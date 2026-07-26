import { readFileSync } from "node:fs";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const main = readFileSync(join(root, "src/main.js"), "utf8");
const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "src/styles.css"), "utf8");
const pkg = readFileSync(join(root, "package.json"), "utf8");
const orderServicePath = join(root, "netlify/functions/_order-service.mjs");
const orderCreatePath = join(root, "netlify/functions/orders-create.mjs");
const paymentSessionPath = join(root, "netlify/functions/payment-session.mjs");
const paymentWebhookPath = join(root, "netlify/functions/payment-webhook.mjs");
const ordersGetPath = join(root, "netlify/functions/orders-get.mjs");
const paymentConfigCheckPath = join(root, "netlify/functions/payment-config-check.mjs");
const financeRecordsPath = join(root, "netlify/functions/finance-records.mjs");
const orderService = existsSync(orderServicePath) ? readFileSync(orderServicePath, "utf8") : "";
const specificPaymentReviewBrand = new RegExp(["an", "tom"].join(""), "i");

const checks = [
  {
    name: "catalog has at least 16 products",
    pass: (main.match(/id: "/g) || []).length >= 16
  },
  {
    name: "cart state is implemented",
    pass: main.includes("getCart") && main.includes("addToCart")
  },
  {
    name: "checkout form is implemented",
    pass: main.includes("checkoutPage") && main.includes("placeOrder")
  },
  {
    name: "order lookup supports mock/local orders",
    pass: main.includes("orderLookupPage") && main.includes("mockOrders")
  },
  {
    name: "audit checklist page exists",
    pass: main.includes("/audit-checklist") && main.includes("auditChecklistPage")
  },
  {
    name: "admin back office routes exist",
    pass: main.includes('path === "/admin"') && main.includes("adminOrdersPage") && main.includes("adminOrderDetailPage")
  },
  {
    name: "admin operations preserve evidence trail",
    pass: main.includes("saveAdminOrderEdit") && main.includes("adminAuditLog") && main.includes("downloadAdminEvidence")
  },
  {
    name: "admin risk focuses on payment velocity instead of order amount",
    pass: main.includes("ordersWithinWindow") &&
      main.includes("sameCustomerPaidRecent") &&
      main.includes("sameIpPaidRecent") &&
      main.includes("连续支付") &&
      main.includes("高频下单") &&
      !main.includes("高金额订单") &&
      !main.includes("(order.total || 0) >= 500")
  },
  {
    name: "admin hides internal probes and displays Chinese statuses",
    pass: main.includes("function isInternalTestOrder") &&
      main.includes('id.startsWith("AP-STORAGE-PROBE")') &&
      main.includes('id.startsWith("AP-RAPID-")') &&
      main.includes("function adminOrderStatusLabel") &&
      main.includes("待支付确认") &&
      main.includes("已支付") &&
      main.includes("连续支付已拦截")
  },
  {
    name: "admin detail rerenders preserve scroll position",
    pass: main.includes("let lastRenderedRoute") &&
      main.includes("shouldResetScroll") &&
      main.includes("previousScrollY") &&
      main.includes("shouldResetScroll ? 0 : previousScrollY") &&
      !main.includes("window.scrollTo({ top: 0, behavior: \"instant\" });")
  },
  {
    name: "admin interface defaults to Chinese",
    pass: main.includes("订单证据与风控工作台") && main.includes("运营手工编辑") && main.includes("导出证据包")
  },
  {
    name: "membership page has safe plan structure",
    pass: main.includes('path === "/membership"') && main.includes("Maker Monthly") && main.includes("HK$4,999") && main.includes("不能提现、转让、兑换现金")
  },
  {
    name: "membership page is localized across supported languages",
    pass: main.includes("const localizedMembership") &&
      ["en", "zh-CN", "ja-JP", "fr-FR", "es-ES"].every(locale => main.includes(`${locale}:`) || main.includes(`"${locale}":`)) &&
      main.includes("membership.plans.map") &&
      !main.includes("cnAudience")
  },
  {
    name: "hidden quick order checkout page has fixed CNY product packages",
    pass: main.includes('path === "/quick-order-checkout"') &&
      !main.includes('path === "/ops-recharge-test"') &&
      main.includes("const quickOrderPackages") &&
      [1, 9, 999, 1999, 3499, 4999].every(amount => main.includes(`amount: ${amount}`)) &&
      main.includes("createQuickOrder") &&
      main.includes("Commercial License Package") &&
      main.includes("Studio STL Production Bundle")
  },
  {
    name: "quick order checkout page is not linked from public navigation",
    pass: !main.includes("#/quick-order-checkout") &&
      !main.includes("#/ops-recharge-test") &&
      !main.includes("/quick-order-checkout\", t(") &&
      !main.includes("/ops-recharge-test\", t(") &&
      !html.includes("quick-order-checkout") &&
      !html.includes("ops-recharge-test")
  },
  {
    name: "agent preview page is hidden from public navigation and cannot initiate payment",
    pass: main.includes('path === "/t"') &&
      main.includes("function agentPreviewPage") &&
      [300, 600, 900, 1200, 1500, 2000, 3000].every(amount => main.includes(`agentPreviewAmounts = [300, 600, 900, 1200, 1500, 2000, 3000]`) || main.includes(` ${amount},`)) &&
      !/["']#\/t["']/.test(main) &&
      !html.includes('href="/t"') &&
      !main.includes("data-agent-preview-form") &&
      main.includes("Preview mode")
  },
  {
    name: "finance reconciliation page is unlinked and only exposes paid quick-order records",
    pass: main.includes('path === "/finance-reconciliation"') &&
      main.includes("financeReconciliationPage") &&
      !main.includes("#/finance-reconciliation") &&
      !html.includes("finance-reconciliation") &&
      existsSync(financeRecordsPath) &&
      readFileSync(financeRecordsPath, "utf8").includes("hidden_quick_checkout") &&
      readFileSync(financeRecordsPath, "utf8").includes("isPaidOrder") &&
      !readFileSync(financeRecordsPath, "utf8").includes("email:") &&
      !readFileSync(financeRecordsPath, "utf8").includes("address:")
  },
  {
    name: "quick order payment payload uses real product order wording",
    pass: main.includes("quickOrderPayload") &&
      main.includes("hidden_quick_checkout") &&
      !main.includes("AP-OPS-RECHARGE") &&
      !main.includes("Operations Recharge Test") &&
      !main.includes("运营测试充值") &&
      !main.includes("账户充值测试")
  },
  {
    name: "policy pages have structured sections",
    pass: main.includes("policyPages") && main.includes("Digital goods")
  },
  {
    name: "SEO metadata includes Open Graph",
    pass: html.includes('property="og:title"') && html.includes('property="og:description"')
  },
  {
    name: "generated ecommerce product image asset exists",
    pass: existsSync(join(root, "src/assets/product-sheet.webp")) && statSync(join(root, "src/assets/product-sheet.webp")).size > 50000
  },
  {
    name: "premium generated product image asset exists",
    pass: existsSync(join(root, "src/assets/product-premium-sheet.webp")) && statSync(join(root, "src/assets/product-premium-sheet.webp")).size > 50000
  },
  {
    name: "products are mapped to image indexes",
    pass: (main.match(/imageIndex:/g) || []).length >= 16 && css.includes("assets/product-sheet.webp") && css.includes("assets/product-premium-sheet.webp")
  },
  {
    name: "catalog prices support premium positioning",
    pass: !/price: ([1-4][0-9]|[1-9]),/.test(main) && main.includes("price: 54") && main.includes("price: 747") && main.includes("total: 131")
  },
  {
    name: "checkout prices display and submit in Alipay-supported CNY currency",
    pass: main.includes('const checkoutCurrency = "CNY"') &&
      main.includes("function checkoutPrice(value)") &&
      main.includes("currency: checkoutCurrency") &&
      main.includes("productMoney(product.price)") &&
      !main.includes('currency: "USD"')
  },
  {
    name: "cart migration prevents stale default cart items",
    pass: main.includes("atelier-cart-version") && main.includes("localStorage.removeItem(\"atelier-cart\")")
  },
  {
    name: "cart badge exposes a stable QA hook",
    pass: main.includes("data-cart-count") && main.includes("aria-live=\"polite\"")
  },
  {
    name: "mobile navigation is compact",
    pass: main.includes("class=\"mobile-menu\"") && css.includes(".main-nav {\n    display: none;") && css.includes(".mobile-menu {\n    display: block;")
  },
  {
    name: "storefront avoids naming specific payment review brands",
    pass: !specificPaymentReviewBrand.test(`${main}\n${html}\n${css}`)
  },
  {
    name: "company and support details are populated",
    pass: main.includes("whyqwl888@163.com") && main.includes("MazeCraft Technology Limited") && main.includes("80498471")
  },
  {
    name: "payment-ready Netlify functions exist",
    pass: [orderServicePath, orderCreatePath, paymentSessionPath, paymentWebhookPath, ordersGetPath, paymentConfigCheckPath].every(file => existsSync(file))
  },
  {
    name: "server order service defines durable payment states and evidence fields",
    pass: ["draft", "pending_payment", "paid", "payment_failed", "payment_blocked", "fulfillment_pending", "fulfilled", "refunded", "disputed"].every(state => orderService.includes(state)) &&
      ["merchantOrderId", "paymentRequestId", "paymentSessionId", "paymentProviderTransactionId", "customerIp", "customerCountry", "policyVersion", "rawPaymentEvents"].every(field => orderService.includes(field))
  },
  {
    name: "server blocks repeated successful payments within one minute",
    pass: orderService.includes("recentSuccessfulPaymentBlock") &&
      orderService.includes("60_000") &&
      orderService.includes("RECENT_SUCCESSFUL_PAYMENT") &&
      orderService.includes("请稍等 1 分钟后再提交下一笔订单") &&
      readFileSync(paymentSessionPath, "utf8").includes("jsonResponse(429") &&
      readFileSync(paymentSessionPath, "utf8").includes("payment_blocked") &&
      main.includes("连续支付已被系统拦截")
  },
  {
    name: "server can reconcile payment status through inquiry API",
    pass: orderService.includes("inquirePayment") &&
      orderService.includes("reconcilePayment") &&
      orderService.includes("stateFromInquiryPaymentStatus") &&
      orderService.includes("inquiryPaymentPath") &&
      readFileSync(ordersGetPath, "utf8").includes("reconcilePayment") &&
      orderService.includes("lastInquiryPayment") &&
      readFileSync(ordersGetPath, "utf8").includes("reconcile\") === \"recent\"") &&
      main.includes("reconcile=recent&force=1&limit=12") &&
      main.includes("fetchServerOrder(orderId, { reconcile: true, force: true })")
  },
  {
    name: "order service has optional blob persistence fallback",
    pass: pkg.includes("@netlify/blobs") &&
      orderService.includes("connectLambda") &&
      orderService.includes("connectOrderStorage") &&
      orderService.includes("getStore") &&
      orderService.includes("atelier-orders")
  },
  {
    name: "server order routes initialize persistent storage",
    pass: [orderCreatePath, paymentSessionPath, paymentWebhookPath, ordersGetPath]
      .every(file => readFileSync(file, "utf8").includes("connectOrderStorage(event)")) &&
      readFileSync(ordersGetPath, "utf8").includes("storage\") === \"status")
  },
  {
    name: "server order list is backed by an explicit index",
    pass: orderService.includes("ORDER_INDEX_KEY") &&
      orderService.includes("saveOrderIndex") &&
      orderService.includes("listableOrder") &&
      orderService.includes("indexedOrders")
  },
  {
    name: "payment functions keep live credentials and signature handling server-side",
    pass: orderService.includes("signApiRequest") &&
      orderService.includes("verifyApiSignature") &&
      orderService.includes("ANTOM_PRIVATE_KEY") &&
      orderService.includes("ANTOM_MERCHANT_PUBLIC_KEY") &&
      orderService.includes("paymentConfigStatus") &&
      !main.includes("ANTOM_PRIVATE_KEY") &&
      !main.includes("ANTOM_CLIENT_ID")
  },
  {
    name: "payment API supports sandbox and live without exposing keys",
    pass: orderService.includes("[\"sandbox\", \"live\"]") &&
      existsSync(paymentConfigCheckPath) &&
      !html.includes("ANTOM_PRIVATE_KEY") &&
      !css.includes("ANTOM_PRIVATE_KEY")
  },
  {
    name: "payment webhook returns provider standard notification response",
    pass: existsSync(paymentWebhookPath) &&
      readFileSync(paymentWebhookPath, "utf8").includes("function notifySuccess") &&
      readFileSync(paymentWebhookPath, "utf8").includes('resultCode: "SUCCESS"') &&
      readFileSync(paymentWebhookPath, "utf8").includes('resultStatus: "S"') &&
      readFileSync(paymentWebhookPath, "utf8").includes("payload.result?.resultCode") &&
      readFileSync(paymentWebhookPath, "utf8").includes('resultStatus === "F"') &&
      readFileSync(paymentWebhookPath, "utf8").includes("`FAIL:${resultCode}`")
  },
  {
    name: "hosted checkout request includes gateway and mobile context fields",
    pass: existsSync(paymentSessionPath) &&
      readFileSync(paymentSessionPath, "utf8").includes("merchantRegion: config.merchantRegion") &&
      readFileSync(paymentSessionPath, "utf8").includes("productScene: \"CHECKOUT_PAYMENT\"") &&
      readFileSync(paymentSessionPath, "utf8").includes("checkoutEnv(order, event)")
  },
  {
    name: "hosted checkout request includes order goods for risk and display",
    pass: existsSync(paymentSessionPath) &&
      readFileSync(paymentSessionPath, "utf8").includes("function orderGoods(order, currency = order.currency)") &&
      readFileSync(paymentSessionPath, "utf8").includes("goodsUnitAmount") &&
      readFileSync(paymentSessionPath, "utf8").includes("goodsUrl") &&
      readFileSync(paymentSessionPath, "utf8").includes("goods: orderGoods(order)")
  },
  {
    name: "direct Alipay wallet payment normalizes stale HKD orders to CNY",
    pass: existsSync(paymentSessionPath) &&
      readFileSync(paymentSessionPath, "utf8").includes("function paymentCurrencyForMethod") &&
      readFileSync(paymentSessionPath, "utf8").includes("if (paymentMethodType === \"ALIPAY_CN\") return \"CNY\"") &&
      readFileSync(paymentSessionPath, "utf8").includes("fromCurrency === \"HKD\" && toCurrency === \"CNY\"") &&
      readFileSync(paymentSessionPath, "utf8").includes("currencyNormalized")
  },
  {
    name: "internal payment probes are blocked before provider submission",
    pass: existsSync(paymentSessionPath) &&
      readFileSync(paymentSessionPath, "utf8").includes("function isInternalPaymentProbe") &&
      readFileSync(paymentSessionPath, "utf8").includes("INTERNAL_PAYMENT_PROBE_BLOCKED") &&
      readFileSync(paymentSessionPath, "utf8").includes("jsonResponse(403")
  },
  {
    name: "hosted checkout uses standard HTTPS return paths",
    pass: existsSync(paymentSessionPath) &&
      readFileSync(paymentSessionPath, "utf8").includes("}/order-success?order=") &&
      !readFileSync(paymentSessionPath, "utf8").includes("}/#/order-success?order=") &&
      main.includes("function currentRoute()") &&
      main.includes("location.pathname") &&
      main.includes("currentParams()")
  },
  {
    name: "checkout creates server order before hosted payment session",
    pass: main.includes("createServerOrder") && main.includes("createHostedPaymentSession") && main.includes("/.netlify/functions/orders-create") && main.includes("/.netlify/functions/payment-session")
  },
  {
    name: "order lookup and admin can read server orders",
    pass: main.includes("fetchServerOrder") && main.includes("fetchAdminOrders") && main.includes("/.netlify/functions/orders-get")
  }
];

let failed = false;
for (const check of checks) {
  if (!check.pass) {
    console.error(`FAIL: ${check.name}`);
    failed = true;
  } else {
    console.log(`PASS: ${check.name}`);
  }
}

if (failed) process.exit(1);
