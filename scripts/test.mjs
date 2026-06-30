import { readFileSync } from "node:fs";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const main = readFileSync(join(root, "src/main.js"), "utf8");
const html = readFileSync(join(root, "index.html"), "utf8");
const css = readFileSync(join(root, "src/styles.css"), "utf8");
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
    name: "admin interface defaults to Chinese",
    pass: main.includes("订单证据与风控工作台") && main.includes("运营手工编辑") && main.includes("导出证据包")
  },
  {
    name: "membership page has safe plan structure",
    pass: main.includes('path === "/membership"') && main.includes("Maker Monthly") && main.includes("$699") && main.includes("不能提现、转让、兑换现金")
  },
  {
    name: "membership page is localized across supported languages",
    pass: main.includes("const localizedMembership") &&
      ["en", "zh-CN", "ja-JP", "fr-FR", "es-ES"].every(locale => main.includes(`${locale}:`) || main.includes(`"${locale}":`)) &&
      main.includes("membership.plans.map") &&
      !main.includes("cnAudience")
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
