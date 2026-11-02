import { connectOrderStorage, jsonResponse, normalizeOrderPayload, parseJson, saveOrder, getOrder, siteUrl } from "./_order-service.mjs";
import { catalog, quickPackages } from "./_catalog.mjs";
import { newOrderToken, digest, customerOrder } from "./_access.mjs";

const AGENT_PAYMENT_AMOUNTS = new Set([30, 50, 100, 269, 300, 369, 599, 600, 900, 1200, 1500, 2000, 3000, 5000]);

export function validatedPayload(payload) {
  if (!payload || typeof payload !== "object" || !Array.isArray(payload.items) || !payload.items.length || payload.items.length > 50) throw new Error("商品信息无效");
  if (payload.currency !== "CNY") throw new Error("仅支持人民币结算");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(payload.email || "")) || String(payload.email).length > 254) throw new Error("邮箱格式无效");
  const agent = payload.source === "agent_payment_verification";
  const quick = !agent && (payload.source === "hidden_quick_checkout" || String(payload.notes || "").includes("hidden_quick_checkout"));
  let items;
  if (agent) {
    const amount = Number(payload.total);
    const item = payload.items[0];
    if (!AGENT_PAYMENT_AMOUNTS.has(amount) || payload.items.length !== 1 || item.id !== `agent-payment-verification-${amount}` || Number(item.price) !== amount || Number(item.qty) !== 1) throw new Error("付款订单金额无效");
    items = [{ id: `agent-payment-verification-${amount}`, name: "预付费订金", type: "Prepaid Deposit", category: "business services/deposit", goodsUrl: `${siteUrl()}/t`, price: amount, qty: 1 }];
  } else if (quick) {
    const tier = quickPackages.find(tier => tier.amount === Number(payload.total) && tier.productId === payload.items[0].id);
    if (!tier || payload.items.length !== 1 || Number(payload.items[0].qty) !== 1 || Number(payload.items[0].price) !== tier.amount) throw new Error("快捷订单金额无效");
    items = [{ id: tier.productId, name: tier.name, type: tier.type, price: tier.amount, qty: 1 }];
  } else {
    items = payload.items.map(item => {
      const product = catalog[item.id];
      const qty = Number(item.qty);
      if (!product || !Number.isSafeInteger(qty) || qty < 1 || qty > 99 || Number(item.price) !== product.price) throw new Error("商品价格已更新，请刷新页面后重试");
      return { id: item.id, ...product, qty };
    });
  }
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (!Number.isSafeInteger(total) || total <= 0 || Number(payload.total) !== total) throw new Error("订单总额与商品金额不一致");
  return { ...payload, items, total, source: agent ? "agent_payment_verification" : quick ? "hidden_quick_checkout" : "storefront", notes: agent ? "agent_payment_verification" : quick ? "hidden_quick_checkout" : String(payload.notes || "").slice(0, 2000), address: String(payload.address || "").slice(0, 2000) };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const payload = await parseJson(event);
  if (!payload) return jsonResponse(400, { error: "Invalid JSON body" });
  let validated, token;
  try { validated = validatedPayload(payload); token = newOrderToken(event); }
  catch (error) { return jsonResponse(422, { error: error.message }); }
  const order = normalizeOrderPayload(validated, event);
  // A high-entropy attempt token reuses the same merchant request ID on network retries.
  order.id = order.merchantOrderId = `AP-${digest(token).slice(0, 40).toUpperCase()}`;
  order.accessTokenHash = digest(token);
  const fingerprint = digest(JSON.stringify([order.source, order.currency, order.total, order.items, order.email, order.address]));
  order.requestFingerprint = fingerprint;
  try {
    const existing = await getOrder(order.id);
    if (existing && existing.requestFingerprint !== fingerprint) return jsonResponse(409, { error: "该付款尝试的金额已确定，请继续原订单或开始新订单" });
    const saved = existing || await saveOrder(order);
    return jsonResponse(200, { order: customerOrder(saved), accessToken: token });
  } catch { return jsonResponse(503, { error: "订单存储暂不可用，请稍后重试" }); }
}
