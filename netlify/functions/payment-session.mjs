import { antomConfig, connectOrderStorage, jsonResponse, paymentApiEnabled, paymentConfigStatus, paymentMode, recentSuccessfulPaymentBlock, signApiRequest, siteUrl, getOrder, normalizeOrderPayload, saveOrder, updateOrder } from "./_order-service.mjs";

function mockCheckoutUrl(order) {
  const params = new URLSearchParams({ order: order.id, payment: "mock_pending" });
  return `${siteUrl()}/#/order-success?${params.toString()}`;
}

function checkoutLocale(language = "en") {
  const supported = {
    en: "en_US",
    "zh-CN": "zh_CN",
    "ja-JP": "ja_JP",
    "fr-FR": "fr_FR",
    "es-ES": "es_ES"
  };
  return supported[language] || supported.en;
}

function checkoutEnv(order, event) {
  const userAgent = event.headers?.["user-agent"] || event.headers?.["User-Agent"] || order.userAgent || "";
  const terminalType = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ? "WAP" : "WEB";
  let osType = "WEB";
  if (/Android/i.test(userAgent)) osType = "ANDROID";
  if (/iPhone|iPad|iPod/i.test(userAgent)) osType = "IOS";
  return { terminalType, osType };
}

function paymentAmount(order, value = order.total) {
  return { currency: order.currency, value: String(Math.round(Number(value || 0) * 100)) };
}

function goodsCategory(item = {}) {
  const type = String(item.type || "").toLowerCase();
  if (type.includes("digital")) return "digital goods/3d printable model files";
  if (type.includes("license")) return "digital goods/commercial license";
  if (type.includes("custom")) return "customized goods/3d printing service";
  return "consumer goods/3d printed home and desk accessories";
}

function orderGoods(order) {
  return (order.items || []).map(item => ({
    referenceGoodsId: String(item.id || "").slice(0, 64),
    goodsName: String(item.name || item.id || "Atelier Printworks item").slice(0, 256),
    goodsCategory: goodsCategory(item),
    goodsQuantity: String(item.qty || 1),
    goodsUnitAmount: paymentAmount(order, item.price || 0),
    goodsUrl: `${siteUrl()}/products/${encodeURIComponent(item.id || "")}`,
    goodsSkuName: String(item.type || "Original 3D design").slice(0, 128)
  })).filter(item => item.referenceGoodsId);
}

function checkoutUrlHost(url = "") {
  try {
    return new URL(url).host;
  } catch {
    return "";
  }
}

async function createHostedPaymentSession(order, event) {
  const config = antomConfig();
  if (!paymentApiEnabled()) {
    return {
      paymentSessionId: `mock-session-${order.id}`,
      paymentRequestId: `mock-request-${order.id}`,
      checkoutUrl: mockCheckoutUrl(order),
      mode: "mock"
    };
  }
  const status = paymentConfigStatus();
  if (!status.readyForApi) {
    throw new Error(`Payment API mode is missing required server environment variables: ${status.missing.join(", ")}`);
  }

  const requestUri = config.createSessionPath;
  const requestTime = new Date().toISOString();
  const checkoutEnvironment = checkoutEnv(order, event);
  const requestPayload = {
    merchantRegion: config.merchantRegion,
    productCode: "CASHIER_PAYMENT",
    productScene: "CHECKOUT_PAYMENT",
    locale: checkoutLocale(order.checkoutLanguage),
    paymentRequestId: order.paymentRequestId || order.id,
    paymentAmount: paymentAmount(order),
    settlementStrategy: { settlementCurrency: order.currency },
    order: {
      referenceOrderId: order.id,
      orderDescription: `Atelier Printworks order ${order.id}`,
      buyer: { referenceBuyerId: order.email, buyerEmail: order.email },
      orderAmount: paymentAmount(order),
      goods: orderGoods(order)
    },
    merchant: {
      referenceMerchantId: config.merchantId,
      merchantMCC: "5945",
      merchantName: "Atelier Printworks",
      merchantRegion: config.merchantRegion
    },
    env: checkoutEnvironment,
    paymentRedirectUrl: `${siteUrl()}/order-success?order=${encodeURIComponent(order.id)}`,
    paymentNotifyUrl: `${siteUrl()}/.netlify/functions/payment-webhook`
  };
  const requestBody = JSON.stringify(requestPayload);
  const signature = signApiRequest({
    requestUri,
    clientId: config.clientId,
    requestTime,
    privateKey: config.privateKey,
    requestBody,
    keyVersion: config.keyVersion
  });
  const response = await fetch(`${config.apiBaseUrl.replace(/\/$/, "")}${requestUri}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "client-id": config.clientId,
      "request-time": requestTime,
      signature
    },
    body: requestBody
  });
  const body = await response.json().catch(() => ({}));
  const normalUrl = body.normalUrl || body.paymentRedirectUrl || body.paymentSessionData?.paymentRedirectUrl || "";
  const diagnostics = {
    createdAt: new Date().toISOString(),
    mode: paymentMode(),
    httpStatus: response.status,
    resultStatus: body.result?.resultStatus || "",
    resultCode: body.result?.resultCode || "",
    resultMessage: body.result?.resultMessage || "",
    hasNormalUrl: Boolean(normalUrl),
    checkoutHost: checkoutUrlHost(normalUrl),
    paymentSessionExpiryTime: body.paymentSessionExpiryTime || "",
    requestShape: {
      merchantRegion: requestPayload.merchantRegion,
      hasMerchantAccountId: Boolean(requestPayload.merchantAccountId),
      productCode: requestPayload.productCode,
      productScene: requestPayload.productScene,
      locale: requestPayload.locale,
      currency: requestPayload.paymentAmount.currency,
      value: requestPayload.paymentAmount.value,
      terminalType: checkoutEnvironment.terminalType,
      osType: checkoutEnvironment.osType,
      goodsCount: requestPayload.order.goods.length
    }
  };
  if (!response.ok || body.result?.resultStatus === "F") {
    const error = new Error(`Hosted payment session failed: ${response.status} ${body.result?.resultCode || ""} ${body.result?.resultMessage || ""}`.trim());
    error.paymentDiagnostics = diagnostics;
    throw error;
  }
  return {
    paymentSessionId: body.paymentSessionId || body.paymentSessionData?.paymentSessionId || "",
    paymentRequestId: body.paymentRequestId || order.id,
    checkoutUrl: normalUrl || body.checkoutUrl || "",
    mode: paymentMode(),
    paymentDiagnostics: diagnostics
  };
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return jsonResponse(405, { error: "Method not allowed" });
  connectOrderStorage(event);
  const payload = JSON.parse(event.body || "{}");
  let order = await getOrder(payload.orderId);
  if (!order && payload.orderSnapshot && paymentMode() !== "live") {
    order = normalizeOrderPayload(payload.orderSnapshot, event);
    await saveOrder(order);
  }
  if (!order) return jsonResponse(404, { error: "Order not found" });

  try {
    const block = await recentSuccessfulPaymentBlock(order);
    if (block) {
      const updated = await updateOrder(order.id, {
        status: "payment_blocked",
        paymentStatus: "blocked",
        fulfillmentStatus: "not_started",
        supportNotes: [
          ...(order.supportNotes || []),
          { at: new Date().toISOString(), note: `${block.message} Matched order: ${block.matchedOrderId}` }
        ]
      });
      return jsonResponse(429, { error: block.message, code: block.code, retryAfterSeconds: block.retryAfterSeconds, matchedOrderId: block.matchedOrderId, order: updated });
    }
    const session = await createHostedPaymentSession(order, event);
    const updated = await updateOrder(order.id, {
      status: "pending_payment",
      paymentStatus: "pending",
      paymentRequestId: session.paymentRequestId,
      paymentSessionId: session.paymentSessionId,
      paymentDiagnostics: {
        ...(order.paymentDiagnostics || {}),
        lastCreateSession: session.paymentDiagnostics
      }
    });
    return jsonResponse(200, { order: updated, ...session });
  } catch (error) {
    await updateOrder(order.id, {
      status: "payment_session_failed",
      paymentStatus: "failed",
      paymentDiagnostics: {
        ...(order.paymentDiagnostics || {}),
        lastCreateSessionError: error.paymentDiagnostics || { message: error.message, at: new Date().toISOString() }
      },
      supportNotes: [
        ...(order.supportNotes || []),
        { at: new Date().toISOString(), note: `Hosted checkout session error: ${error.message}` }
      ]
    });
    return jsonResponse(500, { error: error.message, paymentDiagnostics: error.paymentDiagnostics || null });
  }
}
