import { createSign, createVerify } from "node:crypto";
import { getStore } from "@netlify/blobs";

const ORDER_STATES = [
  "draft",
  "pending_payment",
  "paid",
  "payment_failed",
  "fulfillment_pending",
  "fulfilled",
  "refunded",
  "disputed"
];

const POLICY_VERSION = "2026-07-01-payment-terms";
const MEMORY_KEY = "__atelierPrintworksOrders";

function memoryStore() {
  if (!globalThis[MEMORY_KEY]) globalThis[MEMORY_KEY] = new Map();
  return globalThis[MEMORY_KEY];
}

async function blobStore() {
  try {
    return getStore({ name: "atelier-orders" });
  } catch {
    return null;
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
    return JSON.parse(event.body || "{}");
  } catch {
    return null;
  }
}

export function getClientEvidence(event) {
  const headers = event.headers || {};
  const forwarded = headers["x-forwarded-for"] || headers["X-Forwarded-For"] || "";
  const customerIp = (forwarded.split(",")[0] || headers["x-nf-client-connection-ip"] || headers["client-ip"] || "").trim();
  const customerCountry = headers["x-country"] || headers["x-nf-geo"] || headers["cf-ipcountry"] || "Unknown";
  return {
    customerIp: customerIp || "Unknown",
    customerCountry,
    userAgent: headers["user-agent"] || headers["User-Agent"] || "Unknown"
  };
}

export function makeMerchantOrderId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const entropy = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AP-${date}-${entropy}`;
}

function normalizeItems(items = []) {
  return items.map(item => ({
    id: String(item.id || ""),
    name: String(item.name || item.id || ""),
    type: String(item.type || "Unknown"),
    qty: Number(item.qty || 1),
    price: Number(item.price || 0)
  })).filter(item => item.id && item.qty > 0);
}

export function normalizeOrderPayload(payload, event) {
  const evidence = getClientEvidence(event);
  const items = normalizeItems(payload.items || []);
  const total = Number(payload.total || items.reduce((sum, item) => sum + item.price * item.qty, 0));
  const merchantOrderId = payload.merchantOrderId || makeMerchantOrderId();
  return {
    id: merchantOrderId,
    merchantOrderId,
    paymentRequestId: payload.paymentRequestId || "",
    paymentSessionId: payload.paymentSessionId || "",
    paymentProviderTransactionId: payload.paymentProviderTransactionId || "",
    createdAt: payload.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: payload.status || "pending_payment",
    paymentStatus: payload.paymentStatus || "pending",
    fulfillmentStatus: payload.fulfillmentStatus || "not_started",
    email: String(payload.email || "").trim(),
    address: String(payload.address || ""),
    notes: String(payload.notes || ""),
    currency: String(payload.currency || "USD"),
    total,
    delivery: String(payload.delivery || ""),
    items,
    customerIp: payload.customerIp || evidence.customerIp,
    customerCountry: payload.customerCountry || evidence.customerCountry,
    userAgent: payload.userAgent || evidence.userAgent,
    policyVersion: payload.policyVersion || POLICY_VERSION,
    checkoutLanguage: payload.checkoutLanguage || "en",
    rawPaymentEvents: payload.rawPaymentEvents || [],
    paymentEvents: payload.paymentEvents || [],
    downloadAccess: payload.downloadAccess || [],
    fulfillmentRecords: payload.fulfillmentRecords || [],
    supportNotes: payload.supportNotes || []
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
    } catch {
      // Fall through to in-memory storage for local smoke tests.
    }
  }
  memoryStore().set(order.id, order);
  return order;
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
    } catch {
      // Fall through to in-memory storage for local smoke tests.
    }
  }
  return memoryStore().get(normalized) || null;
}

export async function listOrders() {
  const config = supabaseConfig();
  if (config) {
    const rows = await supabaseRequest(`${config.table}?select=payload&order=updated_at.desc&limit=100`);
    return (rows || []).map(row => row.payload);
  }
  const store = await blobStore();
  if (store) {
    try {
      const list = await store.list();
      const orders = [];
      for (const blob of list.blobs || []) {
        const order = await store.get(blob.key, { type: "json" });
        if (order?.id && !orders.some(item => item.id === order.id)) orders.push(order);
      }
      return orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 100);
    } catch {
      // Fall through to in-memory storage for local smoke tests.
    }
  }
  return [...memoryStore().values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export async function updateOrder(orderId, patch) {
  const existing = await getOrder(orderId);
  if (!existing) return null;
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
  const paymentEvents = [...(existing.paymentEvents || []), paymentEvent];
  const rawPaymentEvents = [...(existing.rawPaymentEvents || []), paymentEvent.raw || paymentEvent];
  return updateOrder(orderId, { paymentEvents, rawPaymentEvents });
}

export function stateFromPaymentResult(result = "") {
  const normalized = String(result).toLowerCase();
  if (/success|paid|finished|complete/.test(normalized)) return "paid";
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
    clientId: env("ANTOM_CLIENT_ID"),
    merchantId: env("ANTOM_MERCHANT_ID"),
    privateKey: env("ANTOM_PRIVATE_KEY"),
    publicKey: env("ANTOM_PUBLIC_KEY"),
    merchantPublicKey: env("ANTOM_MERCHANT_PUBLIC_KEY"),
    keyVersion: env("ANTOM_KEY_VERSION") || "1",
    merchantRegion: env("ANTOM_MERCHANT_REGION") || "HK"
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
  const signature = Buffer.from(decodeURIComponent(match[1]), "base64");
  const contentToBeValidated = `${method} ${requestUri}\n${clientId}.${requestTime}.${requestBody}`;
  const verifier = createVerify("RSA-SHA256");
  verifier.update(contentToBeValidated, "utf8");
  return verifier.verify(normalizePemKey(publicKey, "PUBLIC KEY"), signature);
}

export { ORDER_STATES, POLICY_VERSION };
