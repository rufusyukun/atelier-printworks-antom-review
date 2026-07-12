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
    if (shouldReconcile) order = await reconcilePayment(order, { force: params.get("force") === "1" });
    return jsonResponse(200, { order });
  }
  let orders = await listOrders();
  if (shouldReconcile || params.get("reconcile") === "recent") {
    const limit = Math.min(Number(params.get("limit") || 12), 25);
    const pendingOrders = orders
      .filter(order => /pending|processing/i.test(`${order.status || ""} ${order.paymentStatus || ""}`))
      .slice(0, limit);
    const reconciled = [];
    for (const order of pendingOrders) {
      const next = await reconcilePayment(order, { force: params.get("force") === "1" });
      reconciled.push(next || order);
    }
    const reconciledById = new Map(reconciled.map(order => [order.id, order]));
    orders = orders.map(order => reconciledById.get(order.id) || order);
  }
  return jsonResponse(200, { orders });
}
