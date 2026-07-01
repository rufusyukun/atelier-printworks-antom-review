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

function paymentCurrencyForMethod(order, paymentMethodType = "") {
  if (paymentMethodType === "ALIPAY_CN") return "CNY";
  return order.currency || "USD";
}

function convertPaymentValue(value, fromCurrency = "", toCurrency = "") {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === "HKD" && toCurrency === "CNY") return amount * (7.2 / 7.8);
  if (fromCurrency === "USD" && toCurrency === "CNY") return amount * 7.2;
  return amount;
}

function paymentAmountForCurrency(order, value = order.total, currency = order.currency) {
  const normalizedValue = convertPaymentValue(value, order.currency, currency);
  return { currency, value: String(Math.round(normalizedValue * 100)) };
}

function goodsCategory(item = {}) {
  const type = String(item.type || "").toLowerCase();
  if (type.includes("digital")) return "digital goods/3d printable model files";
  if (type.includes("license")) return "digital goods/commercial license";
  if (type.includes("custom")) return "customized goods/3d printing service";
  return "consumer goods/3d printed home and desk accessories";
}

function orderGoods(order, currency = order.currency) {
  return (order.items || []).map(item => ({
    referenceGoodsId: String(item.id || "").slice(0, 64),
    goodsName: String(item.name || item.id || "Atelier Printworks item").slice(0, 256),
    goodsCategory: goodsCategory(item),
    goodsQuantity: String(item.qty || 1),
    goodsUnitAmount: paymentAmountForCurrency(order, item.price || 0, currency),
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

function checkoutPaymentMethods(order = {}) {
  const configured = process.env.CHECKOUT_PAYMENT_METHODS || "";
  const methods = configured
    .split(",")
    .map(item => item.trim().toUpperCase())
    .filter(Boolean);
  const defaultMethods = ["ALIPAY_CN"];
  return (methods.length ? methods : defaultMethods).map((paymentMethodType, index) => ({
    paymentMethodType,
    expressCheckout: ["ALIPAY_CN", "APPLEPAY", "GOOGLEPAY"].includes(paymentMethodType),
    paymentMethodOrder: String(index)
  }));
}

function paymentEntrypoint() {
  return (process.env.PAYMENT_ENTRYPOINT || "pay").trim().toLowerCase();
}

function paymentUrlFromPayResponse(body = {}) {
  return body.applinkUrl || body.schemeUrl || body.normalUrl || "";
}

async function createDirectWalletPayment(order, event) {
  const config = antomConfig();
  const status = paymentConfigStatus();
  if (!status.readyForApi) {
    throw new Error(`Payment API mode is missing required server environment variables: ${status.missing.join(", ")}`);
  }
  const requestUri = config.payPath;
  const requestTime = new Date().toISOString();
  const checkoutEnvironment = checkoutEnv(order, event);
  const paymentMethodType = checkoutPaymentMethods(order)[0]?.paymentMethodType || "ALIPAY_CN";
  const paymentCurrency = paymentCurrencyForMethod(order, paymentMethodType);
  const normalizedPaymentAmount = paymentAmountForCurrency(order, order.total, paymentCurrency);
  const normalizedGoods = orderGoods(order, paymentCurrency);
  const requestPayload = {
    merchantRegion: config.merchantRegion,
    productCode: "CASHIER_PAYMENT",
    paymentRequestId: order.paymentRequestId || order.id,
    paymentAmount: normalizedPaymentAmount,
    settlementStrategy: { settlementCurrency: paymentCurrency },
    paymentMethod: { paymentMethodType },
    paymentRedirectUrl: `${siteUrl()}/order-success?order=${encodeURIComponent(order.id)}`,
    paymentNotifyUrl: `${siteUrl()}/.netlify/functions/payment-webhook`,
    env: checkoutEnvironment,
    order: {
      referenceOrderId: order.id,
      orderDescription: `Atelier Printworks order ${order.id}`,
      buyer: { referenceBuyerId: order.email, buyerEmail: order.email },
      orderAmount: normalizedPaymentAmount,
      goods: normalizedGoods
    }
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
  const checkoutUrl = paymentUrlFromPayResponse(body);
  const diagnostics = {
    createdAt: new Date().toISOString(),
    mode: paymentMode(),
    entrypoint: "pay",
    httpStatus: response.status,
    resultStatus: body.result?.resultStatus || "",
    resultCode: body.result?.resultCode || "",
    resultMessage: body.result?.resultMessage || "",
    hasNormalUrl: Boolean(body.normalUrl),
    hasApplinkUrl: Boolean(body.applinkUrl),
    hasSchemeUrl: Boolean(body.schemeUrl),
    checkoutHost: checkoutUrlHost(checkoutUrl),
    paymentId: body.paymentId || "",
    requestShape: {
      merchantRegion: requestPayload.merchantRegion,
      productCode: requestPayload.productCode,
      currency: requestPayload.paymentAmount.currency,
      originalCurrency: order.currency,
      currencyNormalized: requestPayload.paymentAmount.currency !== order.currency,
      value: requestPayload.paymentAmount.value,
      terminalType: checkoutEnvironment.terminalType,
      osType: checkoutEnvironment.osType,
      goodsCount: requestPayload.order.goods.length,
      paymentMethodTypeList: [paymentMethodType]
    }
  };
  const resultStatus = body.result?.resultStatus || "";
  const resultCode = body.result?.resultCode || "";
  const processable = resultStatus === "U" && resultCode === "PAYMENT_IN_PROCESS" && checkoutUrl;
  if (!response.ok || body.result?.resultStatus === "F" || (!processable && resultStatus !== "S")) {
    const error = new Error(`Direct wallet payment failed: ${response.status} ${resultCode} ${body.result?.resultMessage || ""}`.trim());
    error.paymentDiagnostics = diagnostics;
    throw error;
  }
  return {
    paymentSessionId: body.paymentId || `pay-${order.id}`,
    paymentRequestId: body.paymentRequestId || order.id,
    paymentProviderTransactionId: body.paymentId || "",
    checkoutUrl,
    mode: paymentMode(),
    paymentDiagnostics: diagnostics
  };
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
  const paymentMethodTypeList = checkoutPaymentMethods(order);
  const requestPayload = {
    merchantRegion: config.merchantRegion,
    productCode: "CASHIER_PAYMENT",
    productScene: "CHECKOUT_PAYMENT",
    locale: checkoutLocale(order.checkoutLanguage),
    paymentRequestId: order.paymentRequestId || order.id,
    paymentAmount: paymentAmount(order),
    settlementStrategy: { settlementCurrency: order.currency },
    availablePaymentMethod: { paymentMethodTypeList },
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
      goodsCount: requestPayload.order.goods.length,
      paymentMethodTypeList: paymentMethodTypeList.map(item => item.paymentMethodType)
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
    const session = paymentEntrypoint() === "pay"
      ? await createDirectWalletPayment(order, event)
      : await createHostedPaymentSession(order, event);
    const updated = await updateOrder(order.id, {
      status: "pending_payment",
      paymentStatus: "pending",
      paymentRequestId: session.paymentRequestId,
      paymentSessionId: session.paymentSessionId,
      paymentProviderTransactionId: session.paymentProviderTransactionId || order.paymentProviderTransactionId || "",
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
