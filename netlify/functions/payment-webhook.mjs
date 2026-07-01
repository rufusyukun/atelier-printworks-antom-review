import { antomConfig, appendPaymentEvent, connectOrderStorage, getOrder, jsonResponse, paymentApiEnabled, stateFromPaymentResult, updateOrder, verifyApiSignature } from "./_order-service.mjs";

function pickOrderId(payload) {
  return payload.merchantOrderId || payload.referenceOrderId || payload.paymentRequestId || payload.orderId || "";
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const config = antomConfig();
  const signatureHeader = event.headers?.signature || event.headers?.Signature || "";
  const requestTime = event.headers?.["request-time"] || event.headers?.["Request-Time"] || "";
  if (paymentApiEnabled() && config.publicKey) {
    const valid = verifyApiSignature({
      method: "POST",
      requestUri: "/.netlify/functions/payment-webhook",
      clientId: config.clientId,
      requestTime,
      publicKey: config.publicKey,
      requestBody: event.body || "{}",
      signatureHeader
    });
    if (!valid) return jsonResponse(401, { error: "Invalid payment notification signature" });
  }
  const payload = JSON.parse(event.body || "{}");
  const orderId = pickOrderId(payload);
  const order = await getOrder(orderId);
  if (!order) return jsonResponse(202, { accepted: true, warning: "Order not found yet" });

  const result = payload.paymentResultCode || payload.resultCode || payload.status || payload.paymentStatus || "";
  const nextState = stateFromPaymentResult(result);
  const eventRecord = {
    id: payload.notifyId || payload.eventId || `${order.id}-${Date.now()}`,
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
    paymentProviderTransactionId: eventRecord.paymentProviderTransactionId || withEvent.paymentProviderTransactionId
  });
  return jsonResponse(200, { received: true, order: updated });
}
