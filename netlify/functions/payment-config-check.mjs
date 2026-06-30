import { jsonResponse, paymentConfigStatus } from "./_order-service.mjs";

export async function handler(event) {
  if (event.httpMethod !== "GET") return jsonResponse(405, { error: "Method not allowed" });
  return jsonResponse(200, paymentConfigStatus());
}
