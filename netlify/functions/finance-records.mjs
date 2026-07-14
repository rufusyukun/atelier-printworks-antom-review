import { connectOrderStorage, isPaidOrder, jsonResponse, listOrders } from "./_order-service.mjs";

function isQuickOrder(order = {}) {
  return String(order.notes || "").includes("hidden_quick_checkout");
}

function confirmationTime(order = {}) {
  const paidEvent = [...(order.paymentEvents || [])]
    .reverse()
    .find(event => /success|paid|finished|complete/i.test(`${event.status || ""} ${event.paymentStatus || ""}`));
  return paidEvent?.at || order.paidAt || order.updatedAt || order.createdAt || "";
}

function financeRecord(order = {}) {
  const items = Array.isArray(order.items) ? order.items : [];
  return {
    orderId: order.id,
    amount: Number(order.total || 0),
    currency: String(order.currency || "CNY"),
    status: "paid",
    confirmedAt: confirmationTime(order),
    productSummary: items.map(item => String(item.name || item.id || "商品")).filter(Boolean).join("、") || "商品订单",
    paymentReference: String(order.paymentProviderTransactionId || order.paymentSessionId || order.paymentRequestId || "")
  };
}

export async function handler(event) {
  if (event.httpMethod !== "GET") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);

  const records = (await listOrders())
    .filter(order => isQuickOrder(order) && isPaidOrder(order))
    .map(financeRecord)
    .sort((a, b) => new Date(b.confirmedAt || 0) - new Date(a.confirmedAt || 0));

  const totalByCurrency = records.reduce((totals, record) => {
    totals[record.currency] = Number((totals[record.currency] || 0) + record.amount);
    return totals;
  }, {});

  return jsonResponse(200, {
    records,
    summary: {
      paidCount: records.length,
      totalByCurrency,
      generatedAt: new Date().toISOString()
    }
  });
}
