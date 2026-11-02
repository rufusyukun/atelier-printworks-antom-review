import { adminAuthorized, orderAuthorized, customerOrder, withoutCredentials } from "./_access.mjs";
import { connectOrderStorage, getOrder, jsonResponse, listOrders, orderStorageStatus, reconcilePayment } from "./_order-service.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const admin = adminAuthorized(event);
  const params = new URLSearchParams(event.rawQuery || event.queryStringParameters || "");
  if ((!params.get("orderId") || params.get("storage") === "status") && !admin) return jsonResponse(401, { error: "需要管理员访问码" });
  if (params.get("storage") === "status") return jsonResponse(200, await orderStorageStatus());
  const orderId = params.get("orderId");
  const shouldReconcile = admin && params.get("reconcile") === "1";
  if (orderId) {
    let order = await getOrder(orderId);
    if (!order || (!admin && !orderAuthorized(event, order))) return jsonResponse(403, { error: "请在原付款浏览器查询订单，或联系财务核对" });
    if (shouldReconcile) order = await reconcilePayment(order, { force: admin && params.get("force") === "1" });
    return jsonResponse(200, { order: admin ? withoutCredentials(order) : customerOrder(order) });
  }
  let orders = await listOrders();
  if (shouldReconcile || params.get("reconcile") === "recent") {
    const limit = Math.min(Number(params.get("limit") || 12), 25);
    const pendingOrders = orders
      .filter(order => /pending|processing/i.test(`${order.status || ""} ${order.paymentStatus || ""}`))
      .slice(0, limit);
    const reconciled = [];
    for (const order of pendingOrders) {
      const next = await reconcilePayment(order, { force: admin && params.get("force") === "1" });
      reconciled.push(next || order);
    }
    const reconciledById = new Map(reconciled.map(order => [order.id, order]));
    orders = orders.map(order => reconciledById.get(order.id) || order);
  }
  return jsonResponse(200, { orders: orders.map(withoutCredentials) });
}
