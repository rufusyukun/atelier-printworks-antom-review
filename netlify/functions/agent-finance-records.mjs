import { asModernFunction } from "./_http.mjs";
import { financeAuthorized } from "./_access.mjs";
import { connectOrderStorage, isPaidOrder, jsonResponse, listOrders, reconcilePayment, mapConcurrent } from "./_order-service.mjs";

function isAgentPayment(order = {}) {
  return order.source ? order.source === "agent_payment_verification" :
    String(order.notes || "").includes("agent_payment_verification");
}

function confirmationTime(order = {}) {
  const paidEvent = [...(order.paymentEvents || [])]
    .reverse()
    .find(event => /success|paid|finished|complete/i.test(`${event.status || ""} ${event.paymentStatus || ""}`));
  return paidEvent?.at || order.paidAt || "";
}

function normalizedStatus(order = {}) {
  if ([order.status, order.paymentStatus].includes("refunded")) return "refunded";
  if ([order.status, order.paymentStatus].includes("disputed")) return "disputed";
  if (isPaidOrder(order)) return "paid";
  const value = String(order.paymentStatus || order.status || "pending_payment").toLowerCase();
  if (value.includes("blocked")) return "payment_blocked";
  if (value.includes("refund")) return "refunded";
  if (value.includes("dispute")) return "disputed";
  if (value.includes("fail") || value.includes("cancel")) return "payment_failed";
  return "pending_payment";
}

function financeRecord(order = {}) {
  return {
    orderId: String(order.id || ""),
    amount: Number(order.total || 0),
    currency: String(order.currency || "CNY"),
    status: normalizedStatus(order),
    createdAt: order.createdAt || "",
    confirmedAt: confirmationTime(order),
    paymentReference: String(order.paymentProviderTransactionId || order.paymentSessionId || order.paymentRequestId || "")
  };
}

export async function handler(event) {
  if (event.httpMethod !== "GET") return jsonResponse(405, { error: "Method not allowed" });
  if (!financeAuthorized(event)) return jsonResponse(401, { error: "访问码不正确" });

  connectOrderStorage(event);
  let orders = (await listOrders()).filter(isAgentPayment);
  const shouldReconcile = event.queryStringParameters?.reconcile === "1" ||
    new URLSearchParams(event.rawQuery || event.rawUrl?.split("?")[1] || "").get("reconcile") === "1";
  if (shouldReconcile) {
    const pendingOrders = orders
      .filter(order => normalizedStatus(order) === "pending_payment" && Date.now() - new Date(order.paymentDiagnostics?.lastInquiryPayment?.createdAt || 0).getTime() >= 10 * 60_000)
      .sort((a, b) => new Date(a.paymentDiagnostics?.lastInquiryPayment?.createdAt || 0) - new Date(b.paymentDiagnostics?.lastInquiryPayment?.createdAt || 0))
      .slice(0, 2);
    const reconciled = new Map();
    await mapConcurrent(pendingOrders, async order => {
      const next = await reconcilePayment(order).catch(() => order);
      reconciled.set(order.id, next || order);
    }, 1);
    orders = orders.map(order => reconciled.get(order.id) || order);
  }

  const records = orders
    .map(financeRecord)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const paidRecords = records.filter(record => record.status === "paid");
  const totalByCurrency = paidRecords.reduce((totals, record) => {
    totals[record.currency] = Number((totals[record.currency] || 0) + record.amount);
    return totals;
  }, {});

  return jsonResponse(200, {
    records,
    summary: {
      orderCount: records.length,
      paidCount: paidRecords.length,
      pendingCount: records.filter(record => record.status === "pending_payment").length,
      exceptionCount: records.filter(record => !["paid", "pending_payment"].includes(record.status)).length,
      totalByCurrency,
      generatedAt: new Date().toISOString()
    }
  });
}

export default asModernFunction(handler);
