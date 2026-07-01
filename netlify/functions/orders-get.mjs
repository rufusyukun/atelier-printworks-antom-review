import { connectOrderStorage, getOrder, jsonResponse, listOrders, orderStorageStatus } from "./_order-service.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const params = new URLSearchParams(event.rawQuery || "");
  if (params.get("storage") === "status") return jsonResponse(200, await orderStorageStatus());
  const orderId = params.get("orderId");
  if (orderId) {
    const order = await getOrder(orderId);
    if (!order) return jsonResponse(404, { error: "Order not found" });
    return jsonResponse(200, { order });
  }
  const orders = await listOrders();
  return jsonResponse(200, { orders });
}
