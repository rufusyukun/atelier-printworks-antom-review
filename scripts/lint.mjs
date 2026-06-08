import { readFileSync } from "node:fs";
import { join } from "node:path";

const files = ["index.html", "src/main.js", "src/data.js", "src/styles.css"];
const forbidden = [/lorem ipsum/i, /theworkspacehero/i, /warpminiatures/i, /lootstudios/i, /api[_-]?key/i, /secret/i];
const requiredRoutes = [
  "#/products",
  "#/commercial-license",
  "#/order-lookup",
  "#/contact",
  "#/shipping-policy",
  "#/refund-policy",
  "#/privacy-policy",
  "#/terms-of-service",
  "#/digital-goods-policy",
  "#/license-agreement",
  "#/faq"
];

let failed = false;

for (const file of files) {
  const text = readFileSync(join(process.cwd(), file), "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      console.error(`Forbidden placeholder/reference matched ${pattern} in ${file}`);
      failed = true;
    }
  }
}

const combined = files.map(file => readFileSync(join(process.cwd(), file), "utf8")).join("\n");
for (const route of requiredRoutes) {
  if (!combined.includes(route)) {
    console.error(`Missing required route link: ${route}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("Lint checks passed");
