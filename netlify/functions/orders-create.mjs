import { connectOrderStorage, jsonResponse, normalizeOrderPayload, parseJson, saveOrder } from "./_order-service.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const payload = await parseJson(event);
  if (!payload) return jsonResponse(400, { error: "Invalid JSON body" });
  const order = normalizeOrderPayload(payload, event);
  if (!order.email || !order.items.length || !order.total) {
    return jsonResponse(422, { error: "Missing order email, items, or total" });
  }
  const saved = await saveOrder(order);
  return jsonResponse(200, { order: saved });
}
