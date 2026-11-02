import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, generateKeyPairSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { handler as create } from '../netlify/functions/orders-create.mjs';
import { handler as query } from '../netlify/functions/orders-get.mjs';
import { handler as session } from '../netlify/functions/payment-session.mjs';
import { handler as checkout } from '../netlify/functions/agent-checkout.mjs';
import { handler as finance } from '../netlify/functions/agent-finance-records.mjs';
import { handler as internalFinance } from '../netlify/functions/finance-records.mjs';
import { handler as webhook } from '../netlify/functions/payment-webhook.mjs';
import { getOrder, updateOrder, saveOrder, isPaidOrder, stateFromPaymentResult, recentSuccessfulPaymentBlock, mapConcurrent, signApiRequest, verifyApiSignature } from '../netlify/functions/_order-service.mjs';
import { catalog } from '../netlify/functions/_catalog.mjs';

// No credentials, no network, and only process-local mock storage in this suite.
for (const key of Object.keys(process.env)) if (/^(ANTOM_|SUPABASE_|NETLIFY_)/.test(key)) delete process.env[key];
process.env.PAYMENT_MODE = 'mock';
globalThis.fetch = async () => { throw new Error('Unexpected external request in isolated test'); };
const financeCode = 'isolated-test-finance-code-not-for-production';
process.env.BF_FINANCE_ACCESS_KEY = financeCode;
const payload = (amount=30) => ({ email:'buyer@example.invalid',currency:'CNY',source:'agent_payment_verification',total:amount,items:[{id:`agent-payment-verification-${amount}`,price:amount,qty:1}] });
const event = (body, token=randomBytes(32).toString('hex')) => ({httpMethod:'POST',body:JSON.stringify(body),headers:{'x-order-token':token,'x-nf-client-connection-ip':'203.0.113.42','user-agent':'isolated test'}});
const body = result => JSON.parse(result.body);
let owned, token;

test('server strips forged status, IDs, evidence, and creates a private canonical order', async () => {
 const e=event({...payload(),status:'paid',paymentStatus:'paid',merchantOrderId:'VICTIM',paymentProviderTransactionId:'fake',customerIp:'attacker',paymentEvents:[{status:'SUCCESS'}]}); token=e.headers['x-order-token'];
 const r=await create(e); assert.equal(r.statusCode,200);owned=body(r).order;
 const stored=await getOrder(owned.id);assert.notEqual(owned.id,'VICTIM');assert.equal(stored.status,'pending_payment');assert.equal(stored.paymentStatus,'pending');assert.deepEqual(stored.paymentEvents,[]);assert.equal(stored.customerIp,'203.0.113.42');assert.equal(stored.paymentProviderTransactionId,'');assert.equal(stored.items[0].name,'预付费订金');assert.equal(body(r).order.accessTokenHash,undefined);
});
test('retry uses same order, changed amount with same token is rejected',async()=>{
 assert.equal(body(await create(event(payload(),token))).order.id,owned.id);
 assert.equal((await create(event(payload(50),token))).statusCode,409);
});
test('rejects malformed JSON and amount/currency/quantity/source spoofing',async()=>{
 assert.equal((await create({httpMethod:'POST',body:'{'})).statusCode,400);
 for(const p of [{...payload(),currency:'USD'},{...payload(),total:-1},{...payload(),total:31},{...payload(),items:[{id:'agent-payment-verification-30',price:1,qty:1}]},{...payload(),items:[{id:'agent-payment-verification-30',price:30,qty:-1}]},{...payload(),source:'storefront'},{...payload(),items:{}}]) assert.equal((await create(event(p))).statusCode,422);
});
test('all supported agent amounts are accepted',async()=>{
 for(const amount of [30,50,100,269,300,369,599,600,900,1200,1500,2000,3000,5000]) assert.equal((await create(event(payload(amount)))).statusCode,200);
});
test('server catalog stays consistent with frontend prices',()=>{
 const main=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
 const products=vm.runInNewContext(main.match(/const products = (\[[\s\S]*?\n\]);/)[1]);
 for(const product of products) assert.equal(catalog[product.id].price,Math.round(product.price*7.2));
});
test('anonymous list, single-order lookup and session cannot bypass finance authentication',async()=>{
 assert.equal((await query({httpMethod:'GET',headers:{},rawQuery:''})).statusCode,401);
 assert.equal((await query({httpMethod:'GET',headers:{},rawQuery:`orderId=${owned.id}`})).statusCode,403);
 assert.equal((await session(event({orderId:owned.id}))).statusCode,403);
 assert.equal((await finance({httpMethod:'GET',headers:{}})).statusCode,401);
 assert.equal((await internalFinance({httpMethod:'GET',headers:{}})).statusCode,401);
 const r=await query({httpMethod:'GET',headers:{'x-order-token':token},rawQuery:`orderId=${owned.id}`});assert.equal(r.statusCode,200);assert.equal(body(r).order.customerIp,undefined);assert.equal(body(r).order.accessTokenHash,undefined);
});
test('finance key cannot grant generic admin access',async()=>{
 assert.equal((await query({httpMethod:'GET',headers:{'x-finance-access-key':financeCode},rawQuery:''})).statusCode,401);
 const r=await finance({httpMethod:'GET',headers:{'x-finance-access-key':financeCode}});assert.equal(r.statusCode,200);assert.ok(body(r).records.some(r=>r.orderId===owned.id));assert.equal(body(r).records[0].email,undefined);
});
test('combined checkout and retry return same order/session in mock mode',async()=>{
 const e=event(payload(50));const first=await checkout(e);assert.equal(first.statusCode,200);const second=await checkout(e);assert.equal(second.statusCode,200);assert.equal(body(first).order.id,body(second).order.id);assert.equal(body(first).checkoutUrl,body(second).checkoutUrl);assert.match(first.headers['server-timing'],/order;dur=/);
});
test('unpaid/unsuccessful/unfulfilled are not recognized as paid',()=>{
 for(const status of ['unpaid','unsuccessful','unfulfilled','pending_payment','refunded','disputed']) {assert.equal(isPaidOrder({status}),false);assert.notEqual(stateFromPaymentResult(status),'paid');}
 assert.equal(isPaidOrder({status:'refunded',paymentStatus:'paid'}),false);
 assert.equal(isPaidOrder({status:'paid'}),true);
});
test('webhook amount mismatch is rejected, duplicate success is idempotent and late fail cannot downgrade paid',async()=>{
 const stored=await getOrder(owned.id);
 const notification={paymentRequestId:owned.id,paymentId:'test-provider-id',paymentAmount:{value:'3000',currency:'CNY'},result:{resultStatus:'S',resultCode:'SUCCESS'}};
 assert.equal((await webhook(event({...notification,paymentAmount:{value:'1',currency:'CNY'}}))).statusCode,400);
 assert.equal((await webhook(event(notification))).statusCode,200);
 assert.equal((await webhook(event(notification))).statusCode,200);
 assert.equal((await getOrder(owned.id)).paymentEvents.length,1);
 assert.equal((await webhook(event({...notification,result:{resultStatus:'F',resultCode:'FAIL'}}))).statusCode,200);
 assert.equal((await getOrder(owned.id)).status,'paid');
 assert.equal((await session(event({orderId:owned.id},token))).statusCode,409);
});
test('60 second rule: matching identity blocked; different IP/browser and expired payment allowed',async()=>{
 const previous=await getOrder(owned.id);const next={...previous,id:'NEW',status:'pending_payment'};
 assert.equal((await recentSuccessfulPaymentBlock(next)).code,'RECENT_SUCCESSFUL_PAYMENT');
 assert.equal(await recentSuccessfulPaymentBlock({...next,customerIp:'203.0.113.99'}),null);
 assert.equal(await recentSuccessfulPaymentBlock({...next,userAgent:'different browser'}),null);
 await saveOrder({...previous,paidAt:new Date(Date.now()-61000).toISOString(),paymentEvents:[]});
 assert.equal(await recentSuccessfulPaymentBlock(next),null);
});
test('ledger retains records beyond 100 and isolates sources',async()=>{
 for(let i=0;i<110;i++) await saveOrder({id:`TEST-${i}`,source:i%2?'agent_payment_verification':'storefront',createdAt:new Date().toISOString(),total:30,currency:'CNY',status:'pending_payment'});
 const r=body(await finance({httpMethod:'GET',headers:{'x-finance-access-key':financeCode}}));assert.ok(r.records.some(r=>r.orderId===owned.id));assert.ok(r.records.some(r=>r.orderId==='TEST-109'));assert.ok(!r.records.some(r=>r.orderId==='TEST-108'));
});
test('parallel reads preserve order and bound concurrency',async()=>{
 let active=0,max=0;const results=await mapConcurrent(Array.from({length:30},(_,i)=>i),async i=>{active++;max=Math.max(max,active);await new Promise(resolve=>setTimeout(resolve,1));active--;return i;},4);assert.equal(max,4);assert.deepEqual(results,Array.from({length:30},(_,i)=>i));
});
test('signature verification rejects tampered/malformed messages and unsigned live callbacks',async()=>{
 const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
 const args={requestUri:'/.netlify/functions/payment-webhook',clientId:'test-client',requestTime:new Date().toISOString(),requestBody:'{}',privateKey,publicKey};const signatureHeader=signApiRequest(args);
 assert.equal(verifyApiSignature({...args,signatureHeader}),true);assert.equal(verifyApiSignature({...args,signatureHeader,requestBody:'{"tampered":true}'}),false);assert.equal(verifyApiSignature({...args,signatureHeader:'signature=%ZZ'}),false);
 process.env.PAYMENT_MODE='live';process.env.ANTOM_PUBLIC_KEY=publicKey;process.env.ANTOM_CLIENT_ID='test-client';
 try { assert.equal((await webhook(event({}))).statusCode,401);assert.equal((await create(event(payload()))).statusCode,503); } finally {process.env.PAYMENT_MODE='mock';}
});

test('wallet request uses stable paymentRequestId, server amount, and fragment-only receipt credential (stubbed transport)',async()=>{
 const {createDirectWalletPayment}=await import('../netlify/functions/payment-session.mjs');
 const storedOrder=await getOrder(owned.id);
 const {privateKey,publicKey}=generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
 Object.assign(process.env,{PAYMENT_MODE:'sandbox',ANTOM_API_BASE_URL:'https://provider.invalid',ANTOM_CLIENT_ID:'test',ANTOM_MERCHANT_ID:'test',ANTOM_PRIVATE_KEY:privateKey,ANTOM_PUBLIC_KEY:publicKey});
 const originalFetch=globalThis.fetch;const requests=[];
 globalThis.fetch=async(url,options)=>{assert.match(url,/^https:\/\/provider\.invalid\//);requests.push(JSON.parse(options.body));assert.ok(options.signal);return new Response(JSON.stringify({result:{resultStatus:'U',resultCode:'PAYMENT_IN_PROCESS'},paymentId:'stub',normalUrl:'https://wallet.invalid/checkout'}),{status:200,headers:{'content-type':'application/json'}});};
 try {
  const one=await createDirectWalletPayment(storedOrder,event({},token));const two=await createDirectWalletPayment(storedOrder,event({},token));
  assert.equal(one.checkoutUrl,two.checkoutUrl);assert.equal(requests.length,2);assert.equal(requests[0].paymentRequestId,requests[1].paymentRequestId);assert.deepEqual(requests[0].paymentAmount,{currency:'CNY',value:'3000'});
  const redirect=new URL(requests[0].paymentRedirectUrl);assert.equal(redirect.searchParams.has('access_token'),false);assert.ok(redirect.hash.includes(token));
 } finally {globalThis.fetch=originalFetch;process.env.PAYMENT_MODE='mock';}
});

test('agent result rendering and return-token import form a receipt loop without storefront navigation',()=>{
 const values=new Map();const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};
 const source=readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/window\.addEventListener\("hashchange",[\s\S]*$/,'');
 const context=vm.createContext({document:{querySelector:()=>null,addEventListener:()=>{}},window:{addEventListener:()=>{}},localStorage:storage,sessionStorage:storage,URLSearchParams,location:{pathname:'/order-success',search:'',hash:`#/order-success?order=${owned.id}&access_token=${token}`},history:{replaceState:(_a,_b,url)=>{assert.ok(!url.includes(token));}},Intl,setTimeout,console});
 vm.runInContext(source,context);
 vm.runInContext('importReturnToken()',context);assert.equal(values.get(`atelier-order-token-${owned.id}`),token);
 for(const [status,label] of [['paid','支付成功'],['pending_payment','正在确认付款结果'],['payment_failed','支付未成功或已关闭']]) {
  context.sample={id:owned.id,status,paymentStatus:status,source:'agent_payment_verification',total:30,currency:'CNY'};
  const html=vm.runInContext('agentPaymentResultPage(sample)',context);assert.ok(html.includes(label));assert.ok(html.includes('href="/t"'));assert.ok(!html.includes('main-nav'));assert.ok(!html.includes('<footer'));
 }
});

test('agent ledger does not accept a storefront note as an agent source, and refunds override paid flags',async()=>{
 await saveOrder({id:'SPOOF-NOTE',source:'storefront',notes:'agent_payment_verification',status:'paid',total:30,currency:'CNY'});
 await saveOrder({id:'REFUNDED-AGENT',source:'agent_payment_verification',status:'refunded',paymentStatus:'paid',total:30,currency:'CNY'});
 const r=body(await finance({httpMethod:'GET',headers:{'x-finance-access-key':financeCode}}));
 assert.ok(!r.records.some(record=>record.orderId==='SPOOF-NOTE'));
 assert.equal(r.records.find(record=>record.orderId==='REFUNDED-AGENT').status,'refunded');
});

test('modern runtime bridge preserves request body and query and trusts context IP',async()=>{
 const {asModernFunction}=await import('../netlify/functions/_http.mjs');
 let captured;
 const wrapped=asModernFunction(async event=>{captured=event;return {statusCode:200,headers:{'content-type':'application/json'},body:'{"ok":true}'};});
 const result=await wrapped(new Request('https://example.invalid/test?orderId=ONE',{method:'POST',headers:{'x-nf-client-connection-ip':'forged'},body:'{"data":"exact"}'}),{ip:'203.0.113.7'});
 assert.equal(result.status,200);assert.equal(captured.__modern,true);assert.equal(captured.body,'{"data":"exact"}');assert.equal(captured.rawQuery,'orderId=ONE');assert.equal(captured.headers['x-nf-client-connection-ip'],'203.0.113.7');
});
