import { createSign, createVerify, randomBytes } from "node:crypto";
import { connectLambda, getStore } from "@netlify/blobs";

const ORDER_STATES = [
  "draft",
  "pending_payment",
  "paid",
  "payment_failed",
  "payment_blocked",
  "fulfillment_pending",
  "fulfilled",
  "refunded",
  "disputed"
];

const POLICY_VERSION = "2026-07-01-payment-terms";
const MEMORY_KEY = "__atelierPrintworksOrders";
let lastStorageFallbackReason = "";

function memoryStore() {
  if (!globalThis[MEMORY_KEY]) globalThis[MEMORY_KEY] = new Map();
  return globalThis[MEMORY_KEY];
}

async function blobStore() {
  try {
    return getStore({ name: "atelier-orders", consistency: "strong" });
  } catch (error) {
    lastStorageFallbackReason = error.message || String(error);
    return null;
  }
}

export function connectOrderStorage(event) {
  if (event.__modern) return true;
  try {
    connectLambda(event);
    return true;
  } catch (error) {
    lastStorageFallbackReason = error.message || String(error);
    return false;
  }
}

function env(name) {
  return globalThis.Netlify?.env?.get?.(name) || process.env[name] || "";
}

function normalizePemKey(key, label) {
  if (!key) return "";
  if (key.includes("BEGIN")) return key.replaceAll("\\n", "\n");
  const wrapped = key.match(/.{1,64}/g)?.join("\n") || key;
  return `-----BEGIN ${label}-----\n${wrapped}\n-----END ${label}-----`;
}

function hasPlaceholder(value = "") {
  return !value || String(value).includes("...");
}

export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

export async function parseJson(event) {
  try {
    if ((event.body || "").length > 32768) return null;
    return JSON.parse(event.body || "{}");
  } catch {
    return null;
  }
}

export function getClientEvidence(event) {
  const headers = event.headers || {};
  const forwarded = headers["x-forwarded-for"] || headers["X-Forwarded-For"] || "";
  const customerIp = (headers["x-nf-client-connection-ip"] || forwarded.split(",")[0] || "").trim();
  const customerCountry = headers["x-country"] || headers["x-nf-geo"] || headers["cf-ipcountry"] || "Unknown";
  return {
    customerIp: customerIp || "Unknown",
    customerCountry,
    userAgent: headers["user-agent"] || headers["User-Agent"] || "Unknown"
  };
}

export function makeMerchantOrderId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const entropy = randomBytes(16).toString("hex").toUpperCase();
  return `AP-${date}-${entropy}`;
}

function normalizedGoodsUrl(value = "") {
  if (!value) return "";
  try {
    const merchantOrigin = new URL(siteUrl()).origin;
    const url = new URL(value, merchantOrigin);
    return url.origin === merchantOrigin ? url.toString() : "";
  } catch {
    return "";
  }
}

function normalizeItems(items = []) {
  return items.map(item => ({
    id: String(item.id || ""),
    name: String(item.name || item.id || ""),
    type: String(item.type || "Unknown"),
    qty: Number(item.qty || 1),
    price: Number(item.price || 0),
    category: String(item.category || ""),
    goodsUrl: normalizedGoodsUrl(item.goodsUrl)
  })).filter(item => item.id && item.qty > 0);
}

export function normalizeOrderPayload(payload, event) {
  const evidence = getClientEvidence(event);
  const items = normalizeItems(Array.isArray(payload.items) ? payload.items : []);
  const total = Number(payload.total || items.reduce((sum, item) => sum + item.price * item.qty, 0));
  const merchantOrderId = makeMerchantOrderId();
  return {
    id: merchantOrderId,
    merchantOrderId,
    paymentRequestId: "",
    paymentSessionId: "",
    paymentProviderTransactionId: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending_payment",
    paymentStatus: "pending",
    fulfillmentStatus: "not_started",
    email: String(payload.email || "").trim(),
    address: String(payload.address || ""),
    notes: String(payload.notes || ""),
    source: String(payload.source || ""),
    operatorReference: String(payload.operatorReference || ""),
    currency: String(payload.currency || "USD"),
    total,
    delivery: String(payload.delivery || ""),
    items,
    customerIp: evidence.customerIp,
    customerCountry: evidence.customerCountry,
    userAgent: evidence.userAgent,
    policyVersion: payload.policyVersion || POLICY_VERSION,
    checkoutLanguage: payload.checkoutLanguage || "en",
    rawPaymentEvents: [],
    paymentEvents: [],
    downloadAccess: [],
    fulfillmentRecords: [],
    supportNotes: [],
  };
}

function supabaseConfig() {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  const table = env("SUPABASE_ORDERS_TABLE") || "orders";
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key, table };
}

async function supabaseRequest(path, options = {}) {
  const config = supabaseConfig();
  if (!config) return null;
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
      "content-type": "application/json",
      prefer: "return=representation",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`Order storage request failed: ${response.status} ${text}`);
  }
  return body;
}

export async function saveOrder(order) {
  const row = { id: order.id, merchant_order_id: order.merchantOrderId, payload: order, updated_at: order.updatedAt };
  const stored = await supabaseRequest(`${supabaseConfig()?.table}?on_conflict=id`, {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row)
  });
  if (stored) return stored[0]?.payload || order;
  const store = await blobStore();
  if (store) {
    try {
      await store.setJSON(order.id, order);
      if (order.merchantOrderId && order.merchantOrderId !== order.id) {
        await store.setJSON(order.merchantOrderId, order);
      }
      return order;
    } catch (error) {
      lastStorageFallbackReason = error.message || String(error);
      // Fall through to in-memory storage for local smoke tests.
    }
  }
  if (paymentApiEnabled()) throw new Error("订单存储暂不可用，请稍后重试");
  memoryStore().set(order.id, order);
  return order;
}

function listableOrder(order) {
  const id = String(order?.id || "");
  const email = String(order?.email || "").toLowerCase();
  return order?.id && !id.startsWith("__") && !id.startsWith("AP-STORAGE-PROBE") && !id.startsWith("AP-RAPID-") && email !== "storage-probe@example.com";
}

export async function getOrder(orderId) {
  const normalized = String(orderId || "").trim().toUpperCase();
  if (!normalized) return null;
  const config = supabaseConfig();
  if (config) {
    const rows = await supabaseRequest(`${config.table}?or=(id.eq.${encodeURIComponent(normalized)},merchant_order_id.eq.${encodeURIComponent(normalized)})&select=payload&limit=1`);
    return rows?.[0]?.payload || null;
  }
  const store = await blobStore();
  if (store) {
    try {
      return await store.get(normalized, { type: "json" });
    } catch (error) {
      lastStorageFallbackReason = error.message || String(error);
      // Fall through to in-memory storage for local smoke tests.
    }
  }
  if (paymentApiEnabled()) throw new Error("订单存储暂不可用，请稍后重试");
  return memoryStore().get(normalized) || null;
}

// Bounded parallel I/O, avoiding one remote round trip per historical order.
export async function mapConcurrent(items, fn, concurrency = 12) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  }));
  return results;
}

export async function listOrders() {
  const config = supabaseConfig();
  if (config) {
    const orders = [];
    for (let offset = 0; ; offset += 500) {
      const rows = await supabaseRequest(`${config.table}?select=payload&order=id.asc&limit=500&offset=${offset}`);
      orders.push(...(rows || []).map(row => row.payload));
      if (!rows || rows.length < 500) return orders.filter(listableOrder);
    }
  }
  const store = await blobStore();
  if (store) {
    // Listing is authoritative; the old shared index can lose entries on concurrent writes.
    const list = await store.list();
    const keys = [...new Set(list.blobs.map(blob => blob.key).filter(key => !key.startsWith("__")))];
    const orders = await mapConcurrent(keys, key => store.get(key, { type: "json" }));
    return orders.filter(listableOrder).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
  if (paymentApiEnabled()) throw new Error("订单存储暂不可用，请稍后重试");
  return [...memoryStore().values()].filter(listableOrder).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export function isPaidOrder(order = {}) {
  if ([order.status, order.paymentStatus].some(value => ["refunded", "disputed"].includes(String(value).toLowerCase()))) return false;
  return [order.paymentStatus, order.status].some(value => ["paid", "success", "fulfilled"].includes(String(value).toLowerCase()));
}

export async function orderStorageStatus() {
  const config = supabaseConfig();
  if (config) return { backend: "supabase", table: config.table, fallbackReason: "" };
  const store = await blobStore();
  if (store) {
    const probeKey = "__storage_probe";
    try {
      const probe = { ok: true, at: new Date().toISOString() };
      await store.setJSON(probeKey, probe);
      const readBack = await store.get(probeKey, { type: "json" });
      return { backend: "netlify-blobs", ok: Boolean(readBack?.ok), fallbackReason: "" };
    } catch (error) {
      lastStorageFallbackReason = error.message || String(error);
    }
  }
  return { backend: "memory", ok: true, fallbackReason: lastStorageFallbackReason };
}

export async function updateOrder(orderId, patch) {
  const existing = await getOrder(orderId);
  if (!existing) return null;
  if (["paid", "refunded", "disputed"].includes(existing.status) && patch.status && ["pending_payment", "payment_failed", "payment_session_failed", "payment_blocked"].includes(patch.status)) return existing;
  const next = {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
    rawPaymentEvents: patch.rawPaymentEvents || existing.rawPaymentEvents || [],
    paymentEvents: patch.paymentEvents || existing.paymentEvents || []
  };
  return saveOrder(next);
}

export async function appendPaymentEvent(orderId, paymentEvent) {
  const existing = await getOrder(orderId);
  if (!existing) return null;
  if ((existing.paymentEvents || []).some(event => event.id === paymentEvent.id)) return existing;
  const paymentEvents = [...(existing.paymentEvents || []), paymentEvent];
  const rawPaymentEvents = [...(existing.rawPaymentEvents || []), paymentEvent.raw || paymentEvent];
  return updateOrder(orderId, { paymentEvents, rawPaymentEvents });
}

export function stateFromInquiryPaymentStatus(paymentStatus = "") {
  const normalized = String(paymentStatus).toUpperCase();
  if (normalized === "SUCCESS") return "paid";
  if (["FAIL", "CANCELLED"].includes(normalized)) return "payment_failed";
  if (["PROCESSING", "PENDING"].includes(normalized)) return "pending_payment";
  return "pending_payment";
}

export async function inquirePayment(order) {
  const config = antomConfig();
  if (!paymentApiEnabled()) return null;
  const status = paymentConfigStatus();
  if (!status.readyForApi) return null;
  const paymentRequestId = order.paymentRequestId || order.id;
  if (!paymentRequestId) return null;
  const requestUri = config.inquiryPaymentPath;
  const requestTime = new Date().toISOString();
  const requestBody = JSON.stringify({ paymentRequestId });
  const signature = signApiRequest({
    requestUri,
    clientId: config.clientId,
    requestTime,
    privateKey: config.privateKey,
    requestBody,
    keyVersion: config.keyVersion
  });
  const response = await fetch(`${config.apiBaseUrl.replace(/\/$/, "")}${requestUri}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "client-id": config.clientId,
      "request-time": requestTime,
      signature
    },
    body: requestBody,
    signal: AbortSignal.timeout(12000)
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.result?.resultStatus !== "S") {
    return {
      inquiryFailed: true,
      httpStatus: response.status,
      resultStatus: body.result?.resultStatus || "",
      resultCode: body.result?.resultCode || "",
      resultMessage: body.result?.resultMessage || "",
      paymentRequestId
    };
  }
  return body;
}

export async function reconcilePayment(order, options = {}) {
  if (!order?.id || !/pending|processing/i.test(`${order.status || ""} ${order.paymentStatus || ""}`)) return order;
  const lastInquiry = order.paymentDiagnostics?.lastInquiryPayment;
  const lastInquiryAt = new Date(lastInquiry?.createdAt || 0).getTime();
  if (!options.force && lastInquiryAt && Date.now() - lastInquiryAt < 10 * 60 * 1000) return order;
  const inquiry = await inquirePayment(order);
  if (inquiry?.inquiryFailed) {
    return updateOrder(order.id, {
      paymentDiagnostics: {
        ...(order.paymentDiagnostics || {}),
        lastInquiryPayment: {
          createdAt: new Date().toISOString(),
          httpStatus: inquiry.httpStatus,
          resultStatus: inquiry.resultStatus,
          resultCode: inquiry.resultCode,
          resultMessage: inquiry.resultMessage,
          paymentRequestId: inquiry.paymentRequestId
        }
      }
    });
  }
  if (!inquiry?.paymentStatus) return order;
  const nextState = stateFromInquiryPaymentStatus(inquiry.paymentStatus);
  const eventRecord = {
    id: `inquiry-${order.id}-${Date.now()}`,
    at: new Date().toISOString(),
    status: inquiry.paymentStatus,
    paymentProviderTransactionId: inquiry.paymentId || order.paymentProviderTransactionId || "",
    raw: { source: "inquiryPayment", paymentStatus: inquiry.paymentStatus, paymentResultCode: inquiry.paymentResultCode, paymentTime: inquiry.paymentTime }
  };
  const paymentEvents = [...(order.paymentEvents || []), eventRecord];
  const rawPaymentEvents = [...(order.rawPaymentEvents || []), eventRecord.raw];
  return updateOrder(order.id, {
    status: nextState,
    paymentStatus: nextState === "paid" ? "paid" : nextState,
    fulfillmentStatus: nextState === "paid" ? "fulfillment_pending" : order.fulfillmentStatus,
    paymentProviderTransactionId: inquiry.paymentId || order.paymentProviderTransactionId || "",
    paidAt: nextState === "paid" ? inquiry.paymentTime || new Date().toISOString() : order.paidAt,
    paymentDiagnostics: {
      ...(order.paymentDiagnostics || {}),
      lastInquiryPayment: {
        createdAt: new Date().toISOString(),
        resultStatus: inquiry.result?.resultStatus || "",
        resultCode: inquiry.result?.resultCode || "",
        resultMessage: inquiry.result?.resultMessage || "",
        paymentStatus: inquiry.paymentStatus || "",
        paymentRequestId: order.paymentRequestId || order.id,
        paymentId: inquiry.paymentId || ""
      }
    },
    paymentEvents,
    rawPaymentEvents
  });
}

export function stateFromPaymentResult(result = "") {
  const normalized = String(result).toLowerCase();
  if (["success", "paid", "finished", "complete", "completed"].includes(normalized)) return "paid";
  if (/fail|cancel|close|expired|decline/.test(normalized)) return "payment_failed";
  if (/refund/.test(normalized)) return "refunded";
  if (/dispute|chargeback/.test(normalized)) return "disputed";
  return "pending_payment";
}

export function paymentMode() {
  return env("PAYMENT_MODE") || "mock";
}

export function paymentApiEnabled() {
  return ["sandbox", "live"].includes(paymentMode());
}

export function siteUrl() {
  return (env("SITE_URL") || "https://atelier-printworks-store.netlify.app").replace(/\/$/, "");
}

export function antomConfig() {
  return {
    apiBaseUrl: env("ANTOM_API_BASE_URL"),
    createSessionPath: env("ANTOM_CREATE_SESSION_PATH") || "/ams/api/v1/payments/createPaymentSession",
    payPath: env("ANTOM_PAY_PATH") || "/ams/api/v1/payments/pay",
    clientId: env("ANTOM_CLIENT_ID"),
    merchantId: env("ANTOM_MERCHANT_ID"),
    privateKey: env("ANTOM_PRIVATE_KEY"),
    publicKey: env("ANTOM_PUBLIC_KEY"),
    merchantPublicKey: env("ANTOM_MERCHANT_PUBLIC_KEY"),
    keyVersion: env("ANTOM_KEY_VERSION") || "1",
    merchantRegion: env("ANTOM_MERCHANT_REGION") || "HK",
    inquiryPaymentPath: env("ANTOM_INQUIRY_PAYMENT_PATH") || "/ams/api/v1/payments/inquiryPayment"
  };
}

export function paymentConfigStatus() {
  const config = antomConfig();
  const requiredForApi = ["apiBaseUrl", "clientId", "merchantId", "privateKey", "publicKey"];
  const missing = requiredForApi.filter(key => hasPlaceholder(config[key]));
  const privateKeyLooksValid = !hasPlaceholder(config.privateKey) && /^MII[A-Za-z0-9+/=]+$/.test(config.privateKey.replace(/\s|-----.*?-----/g, ""));
  const publicKeyLooksValid = !hasPlaceholder(config.publicKey) && /^MII[A-Za-z0-9+/=]+$/.test(config.publicKey.replace(/\s|-----.*?-----/g, ""));
  return {
    mode: paymentMode(),
    apiEnabled: paymentApiEnabled(),
    readyForApi: missing.length === 0 && privateKeyLooksValid && publicKeyLooksValid,
    missing,
    keyChecks: {
      privateKeyLooksValid,
      publicKeyLooksValid,
      merchantPublicKeyPresent: !hasPlaceholder(config.merchantPublicKey)
    }
  };
}

export function signApiRequest({ method = "POST", requestUri, clientId, requestTime, privateKey, requestBody, keyVersion = "1" }) {
  const contentToBeSigned = `${method} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`;
  const signer = createSign("RSA-SHA256");
  signer.update(contentToBeSigned, "utf8");
  const signature = encodeURIComponent(signer.sign(normalizePemKey(privateKey, "PRIVATE KEY"), "base64"));
  return `algorithm=RSA256,keyVersion=${keyVersion},signature=${signature}`;
}

export function verifyApiSignature({ method = "POST", requestUri, clientId, requestTime, publicKey, requestBody, signatureHeader }) {
  if (!publicKey || !signatureHeader) return false;
  const match = String(signatureHeader).match(/signature=([^,]+)/);
  if (!match) return false;
  try {
  const signature = Buffer.from(decodeURIComponent(match[1]), "base64");
  const contentToBeValidated = `${method} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`;
  const verifier = createVerify("RSA-SHA256");
  verifier.update(contentToBeValidated, "utf8");
  return verifier.verify(normalizePemKey(publicKey, "PUBLIC KEY"), signature);
  } catch { return false; }
}

export { ORDER_STATES, POLICY_VERSION };
