import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const main = readFileSync(join(root, "src/main.js"), "utf8");
const html = readFileSync(join(root, "index.html"), "utf8");

const checks = [
  {
    name: "catalog has at least 12 products",
    pass: (main.match(/id: "/g) || []).length >= 12
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
    name: "policy pages have structured sections",
    pass: main.includes("policyPages") && main.includes("Digital goods")
  },
  {
    name: "SEO metadata includes Open Graph",
    pass: html.includes('property="og:title"') && html.includes('property="og:description"')
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
