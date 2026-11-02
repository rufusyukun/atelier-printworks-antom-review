import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

const ACCESS_KEY_SHA256 = "57e25a6ff8811c34e5c9a58126e5f39f55b3b26bd504d50c0698e1225a454d13";
// High-entropy operator credential: only its digest is bundled. An environment override takes precedence.
const ADMIN_ACCESS_KEY_SHA256 = "e145033c7481a57984fbdc676878158ec8d9071a32f7edd8cc88aceecf8ea0ef";
export function header(event, name) {
  return Object.entries(event.headers || {}).find(([key]) => key.toLowerCase() === name)?.[1] || "";
}
export function digest(value) { return createHash("sha256").update(String(value)).digest("hex"); }
function matches(value, hash) {
  return Boolean(value && /^[a-f0-9]{64}$/i.test(hash || "") && timingSafeEqual(Buffer.from(digest(value), "hex"), Buffer.from(hash, "hex")));
}
export function financeAuthorized(event) { return matches(header(event, "x-finance-access-key"), ACCESS_KEY_SHA256); }
export function adminAuthorized(event) {
  const key = globalThis.Netlify?.env?.get?.("ADMIN_ACCESS_KEY") || process.env.ADMIN_ACCESS_KEY;
  return matches(header(event, "x-admin-access-key"), key ? digest(key) : ADMIN_ACCESS_KEY_SHA256);
}
export function newOrderToken(event) {
  const supplied = header(event, "x-order-token");
  if (supplied && !/^[a-f0-9]{64}$/i.test(supplied)) throw new Error("订单凭证格式错误");
  return supplied || randomBytes(32).toString("hex");
}
export function orderAuthorized(event, order) { return matches(header(event, "x-order-token"), order?.accessTokenHash); }
export function customerOrder(order) {
  if (!order) return null;
  const fields = ["id", "merchantOrderId", "createdAt", "updatedAt", "status", "paymentStatus", "fulfillmentStatus", "email", "currency", "total", "delivery", "items", "source", "paidAt"];
  return Object.fromEntries(fields.map(key => [key, order[key]]));
}
export function withoutCredentials(order) {
  const { accessTokenHash, checkoutSession, ...safe } = order;
  return safe;
}
