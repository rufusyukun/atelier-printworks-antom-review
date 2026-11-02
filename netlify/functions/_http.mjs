// Bridge existing domain handlers to the modern Netlify runtime, which injects
// the complete Blobs context (including the uncached endpoint for strong reads).
export function asModernFunction(handler) {
  return async (request, context) => {
    const url = new URL(request.url);
    const headers = Object.fromEntries(request.headers);
    headers["x-nf-client-connection-ip"] = context.ip || "";
    const event = {
      __modern: true,
      httpMethod: request.method,
      headers,
      rawUrl: request.url,
      rawQuery: url.search.slice(1),
      queryStringParameters: Object.fromEntries(url.searchParams),
      body: ["GET", "HEAD"].includes(request.method) ? "" : await request.text()
    };
    try {
      const result = await handler(event);
      return new Response(result.body, { status: result.statusCode, headers: result.headers });
    } catch (error) {
      console.error("Request failed", error.name);
      return Response.json({ error: "服务暂不可用，请保留当前订单稍后重试" }, { status: 503, headers: { "cache-control": "no-store" } });
    }
  };
}
