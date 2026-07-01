import { connectOrderStorage, getOrder, jsonResponse, listOrders, orderStorageStatus, reconcilePayment } from "./_order-service.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const params = new URLSearchParams(event.rawQuery || "");
  if (params.get("storage") === "status") return jsonResponse(200, await orderStorageStatus());
  const orderId = params.get("orderId");
  const shouldReconcile = params.get("reconcile") === "1";
  if (orderId) {
    let order = await getOrder(orderId);
    if (!order) return jsonResponse(404, { error: "Order not found" });
    if (shouldReconcile) order = await reconcilePayment(order);
    return jsonResponse(200, { order });
  }
  let orders = await listOrders();
  if (shouldReconcile) {
    orders = await Promise.all(orders.map(order => reconcilePayment(order)));
  }
  return jsonResponse(200, { orders });
}
