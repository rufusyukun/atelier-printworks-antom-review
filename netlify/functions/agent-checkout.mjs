import { asModernFunction } from "./_http.mjs";
import { handler as createOrder } from "./orders-create.mjs";
import { handler as createSession } from "./payment-session.mjs";
import { jsonResponse, parseJson } from "./_order-service.mjs";

export async function handler(event) {
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  const payload = await parseJson(event);
  if (payload?.source !== "agent_payment_verification") return jsonResponse(422, { error: "无效的代理付款请求" });
  const started = performance.now();
  const created = await createOrder(event);
  if (created.statusCode !== 200) return created;
  const { order, accessToken } = JSON.parse(created.body);
  const orderReady = performance.now();
  try {
    const response = await createSession({ ...event, body: JSON.stringify({ orderId: order.id }), headers: { ...event.headers, "x-order-token": accessToken } });
    const body = JSON.parse(response.body);
    return { ...response, headers: { ...response.headers, "server-timing": `order;dur=${Math.round(orderReady - started)},payment;dur=${Math.round(performance.now() - orderReady)},${response.headers?.["server-timing"] || ""}` }, body: JSON.stringify({ ...body, order: body.order || order, accessToken }) };
  } catch {
    return jsonResponse(503, { order, accessToken, error: "支付服务暂时不可用，请保留当前页面重试同一订单" });
  }
}

export default asModernFunction(handler);
