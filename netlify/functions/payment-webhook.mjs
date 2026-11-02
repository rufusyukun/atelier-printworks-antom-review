import { antomConfig, appendPaymentEvent, isPaidOrder, connectOrderStorage, getOrder, jsonResponse, paymentApiEnabled, stateFromPaymentResult, updateOrder, verifyApiSignature } from "./_order-service.mjs";

function notifySuccess(body = {}) {
  return jsonResponse(200, {
    result: {
      resultCode: "SUCCESS",
      resultStatus: "S",
      resultMessage: "success"
    },
    ...body
  });
}

function notifyFailure(statusCode, message) {
  return jsonResponse(statusCode, {
    result: {
      resultCode: "FAIL",
      resultStatus: "F",
      resultMessage: message
    }
  });
}

function pickOrderId(payload) {
  return payload.merchantOrderId || payload.referenceOrderId || payload.paymentRequestId || payload.orderId || "";
}

function pickPaymentResult(payload = {}) {
  const resultStatus = payload.result?.resultStatus || "";
  const resultCode = payload.result?.resultCode || "";
  if (resultStatus === "S") return payload.paymentStatus || resultCode || "SUCCESS";
  if (resultStatus === "F") return resultCode ? `FAIL:${resultCode}` : "FAIL";
  if (resultStatus === "U") return resultCode || "PENDING";
  return payload.paymentResultCode || payload.resultCode || payload.result?.resultCode || payload.status || payload.paymentStatus || "";
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return notifyFailure(405, "Method not allowed");
  connectOrderStorage(event);
  const config = antomConfig();
  const signatureHeader = event.headers?.signature || event.headers?.Signature || "";
  const requestTime = event.headers?.["request-time"] || event.headers?.["Request-Time"] || "";
  if (paymentApiEnabled()) {
    const valid = verifyApiSignature({
      method: "POST",
      requestUri: "/.netlify/functions/payment-webhook",
      clientId: config.clientId,
      requestTime,
      publicKey: config.publicKey,
      requestBody: event.body || "{}",
      signatureHeader
    });
    if (!valid) return notifyFailure(401, "Invalid payment notification signature");
  }
  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return notifyFailure(400, "Invalid JSON body");
  }
  const orderId = pickOrderId(payload);
  const order = await getOrder(orderId);
  if (!order) return notifyFailure(503, "Order not available yet; retry notification");
  if (payload.paymentRequestId !== (order.paymentRequestId || order.id)) return notifyFailure(400, "Payment request mismatch");
  const expected = order.paymentDiagnostics?.lastCreateSession?.requestShape;
  const expectedCurrency = expected?.currency || order.currency;
  const expectedValue = expected?.value || String(Math.round(order.total * 100));
  if (payload.paymentAmount?.currency !== expectedCurrency || String(payload.paymentAmount?.value) !== expectedValue) return notifyFailure(400, "Payment amount mismatch");
  if (order.paymentProviderTransactionId && payload.paymentId !== order.paymentProviderTransactionId) return notifyFailure(400, "Payment reference mismatch");

  const result = pickPaymentResult(payload);
  const nextState = stateFromPaymentResult(result);
  if ((isPaidOrder(order) && nextState !== "paid") || ["refunded", "disputed"].includes(order.status)) return notifySuccess({ received: true });
  if (isPaidOrder(order) && nextState === "paid" && order.paymentProviderTransactionId === payload.paymentId) return notifySuccess({ received: true });
  const eventRecord = {
    id: payload.notifyId || payload.eventId || `${order.id}-${payload.paymentId}-${nextState}`,
    at: new Date().toISOString(),
    status: result || nextState,
    paymentProviderTransactionId: payload.paymentId || payload.transactionId || payload.paymentProviderTransactionId || "",
    raw: payload
  };

  const withEvent = await appendPaymentEvent(order.id, eventRecord);
  const updated = await updateOrder(order.id, {
    status: nextState,
    paymentStatus: nextState === "paid" ? "paid" : nextState,
    fulfillmentStatus: nextState === "paid" ? "fulfillment_pending" : withEvent.fulfillmentStatus,
    paymentProviderTransactionId: eventRecord.paymentProviderTransactionId || withEvent.paymentProviderTransactionId,
    paidAt: nextState === "paid" ? payload.paymentTime || payload.paymentCreateTime || new Date().toISOString() : withEvent.paidAt
  });
  return notifySuccess({ received: true, orderId: updated?.id || order.id });
}
