import { createHash, timingSafeEqual } from "node:crypto";
import { connectOrderStorage, isPaidOrder, jsonResponse, listOrders, reconcilePayment } from "./_order-service.mjs";

const ACCESS_KEY_SHA256 = "57e25a6ff8811c34e5c9a58126e5f39f55b3b26bd504d50c0698e1225a454d13";

function accessKey(event = {}) {
  return event.headers?.["x-finance-access-key"] || event.headers?.["X-Finance-Access-Key"] || "";
}

function isValidAccessKey(value = "") {
  if (!value) return false;
  const providedHash = createHash("sha256").update(String(value)).digest();
  const expectedHash = Buffer.from(ACCESS_KEY_SHA256, "hex");
  return timingSafeEqual(providedHash, expectedHash);
}

function isAgentPayment(order = {}) {
  return order.source === "agent_payment_verification" ||
    String(order.notes || "").includes("agent_payment_verification");
}

function confirmationTime(order = {}) {
  const paidEvent = [...(order.paymentEvents || [])]
    .reverse()
    .find(event => /success|paid|finished|complete/i.test(`${event.status || ""} ${event.paymentStatus || ""}`));
  return paidEvent?.at || order.paidAt || "";
}

function normalizedStatus(order = {}) {
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
    operatorReference: String(order.operatorReference || "未填写"),
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
  if (!isValidAccessKey(accessKey(event))) return jsonResponse(401, { error: "访问码不正确" });

  connectOrderStorage(event);
  let orders = (await listOrders()).filter(isAgentPayment);
  const shouldReconcile = event.queryStringParameters?.reconcile === "1" ||
    new URLSearchParams(event.rawQuery || event.rawUrl?.split("?")[1] || "").get("reconcile") === "1";
  if (shouldReconcile) {
    const pendingOrders = orders
      .filter(order => normalizedStatus(order) === "pending_payment")
      .slice(0, 8);
    const reconciled = new Map();
    for (const order of pendingOrders) {
      const next = await reconcilePayment(order).catch(() => order);
      reconciled.set(order.id, next || order);
    }
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
