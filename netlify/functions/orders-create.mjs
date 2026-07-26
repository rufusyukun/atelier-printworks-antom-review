import { connectOrderStorage, jsonResponse, normalizeOrderPayload, parseJson, saveOrder } from "./_order-service.mjs";

const AGENT_PAYMENT_AMOUNTS = new Set([300, 600, 900, 1200, 1500, 2000, 3000, 5000]);

export async function handler(event) {
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const payload = await parseJson(event);
  if (!payload) return jsonResponse(400, { error: "Invalid JSON body" });
  const order = normalizeOrderPayload(payload, event);
  if (!order.email || !order.items.length || !order.total) {
    return jsonResponse(422, { error: "Missing order email, items, or total" });
  }
  if (order.source === "agent_payment_verification") {
    const validAmount = AGENT_PAYMENT_AMOUNTS.has(order.total);
    const validReference = Boolean(order.operatorReference.trim());
    const validItem = order.items.length === 1 &&
      order.items[0].id === `agent-payment-verification-${order.total}` &&
      order.items[0].price === order.total &&
      order.items[0].qty === 1;
    if (!validAmount || !validReference || !validItem) {
      return jsonResponse(422, { error: "代理付款订单金额或编号无效" });
    }
  }
  const saved = await saveOrder(order);
  return jsonResponse(200, { order: saved });
}
