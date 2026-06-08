import { categories, footerGroups, products } from "./data.js";

const app = document.querySelector("#app");

const supportEmail = "support@atelierprintworks.example";
const businessName = "Atelier Printworks LLC (placeholder)";
const operatingAddress = "Operating address placeholder: 1200 Maker Avenue, Suite 8, Dover, DE 19901, United States";

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function renderIllustration(product, index = 0) {
  const colors = [
    ["#eef2f0", "#82908a", "#1b2732"],
    ["#f2eee7", "#b8a88e", "#253245"],
    ["#edf0f4", "#7c91a8", "#111827"],
    ["#f5eee8", "#c4a484", "#273238"],
    ["#edf3ef", "#8bb3a3", "#17212b"]
  ][index % 5];

  return `
    <div class="render-card" aria-label="Original generated product render for ${product.name}">
      <div class="render-grid"></div>
      <div class="render-orbit" style="background: ${colors[0]}"></div>
      <div class="render-block render-block-a" style="background: linear-gradient(135deg, ${colors[1]}, ${colors[2]})"></div>
      <div class="render-block render-block-b"></div>
      <div class="render-block render-block-c"></div>
      <span class="render-type">${product.type}</span>
    </div>
  `;
}

function nav() {
  return `
    <header class="site-header">
      <a class="brand" href="#/" aria-label="Atelier Printworks home">
        <span class="brand-mark">AP</span>
        <span>
          <strong>Atelier Printworks</strong>
          <small>Original 3D Print Goods</small>
        </span>
      </a>
      <nav class="main-nav" aria-label="Primary navigation">
        <a href="#/products">Products</a>
        <a href="#/products?category=custom">Custom Print</a>
        <a href="#/products?category=stl">STL Packs</a>
        <a href="#/commercial-license">Commercial License</a>
        <a href="#/about">About</a>
        <a href="#/contact">Contact</a>
      </nav>
      <div class="header-actions">
        <select class="language-select" aria-label="Language selector">
          <option>English</option>
          <option>中文</option>
          <option>日本語</option>
          <option>Français</option>
          <option>Español</option>
        </select>
        <a class="cart-link" href="#/cart" aria-label="Cart">Cart <span>0</span></a>
      </div>
    </header>
  `;
}

function footer() {
  return `
    <footer class="site-footer">
      <div class="footer-top">
        <div>
          <a class="brand footer-brand" href="#/">
            <span class="brand-mark">AP</span>
            <span>
              <strong>Atelier Printworks</strong>
              <small>Original files, objects, and print services.</small>
            </span>
          </a>
          <p>${businessName}</p>
          <p>${operatingAddress}</p>
          <p>Email: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
        </div>
        ${footerGroups.map(group => `
          <div class="footer-group">
            <h3>${group.title}</h3>
            ${group.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
          </div>
        `).join("")}
      </div>
      <div class="footer-bottom">
        <span>Secure checkout placeholder for Antom integration. Private payment credentials are never stored in the browser.</span>
        <span>© 2026 Atelier Printworks. All product concepts are original designs.</span>
      </div>
    </footer>
  `;
}

function productCard(product, index) {
  return `
    <article class="product-card">
      <a href="#/products/${product.id}" class="product-media">${renderIllustration(product, index)}</a>
      <div class="product-body">
        <span class="pill">${product.badge}</span>
        <h3><a href="#/products/${product.id}">${product.name}</a></h3>
        <p>${product.summary}</p>
        <div class="product-meta">
          <span>${product.type}</span>
          <strong>${money(product.price)}</strong>
        </div>
        <a class="text-link" href="#/products/${product.id}">View details</a>
      </div>
    </article>
  `;
}

function homePage() {
  const featured = products.slice(0, 6);
  return `
    ${nav()}
    <main>
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">Original 3D printed objects and digital STL packs</span>
          <h1>Atelier-made tools, keepsakes, and print-ready model files.</h1>
          <p>
            Shop clean desk accessories, home objects, pet keepsakes, commercial licenses, and custom 3D print services.
            Every item is an original design with clear delivery, refund, and license terms.
          </p>
          <div class="hero-actions">
            <a class="button primary" href="#/products">Shop products</a>
            <a class="button secondary" href="#/digital-goods-policy">Digital delivery terms</a>
          </div>
        </div>
        <div class="hero-stage">
          ${renderIllustration(products[4], 4)}
          <div class="stage-note">
            <strong>Ready-to-print packs</strong>
            <span>STL, 3MF, PDF guide, lifetime order access</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">Shop by purpose</span>
          <h2>Built around real print workflows.</h2>
        </div>
        <div class="category-grid">
          ${categories.map(category => `
            <a class="category-card" href="#/products?category=${category.id}">
              <span>${category.title}</span>
              <p>${category.description}</p>
            </a>
          `).join("")}
        </div>
      </section>

      <section class="section muted">
        <div class="section-heading with-action">
          <div>
            <span class="eyebrow">Featured products</span>
            <h2>Original models, objects, and licenses.</h2>
          </div>
          <a class="button secondary" href="#/products">View all</a>
        </div>
        <div class="product-grid">
          ${featured.map(productCard).join("")}
        </div>
      </section>

      <section class="info-band">
        <div>
          <h2>Digital files are delivered through the order page and email.</h2>
          <p>STL packs include STL, 3MF, and PDF guide files where noted. Downloads are for personal use unless a Commercial License is purchased. If a file is corrupted or access fails, support will resend or resolve it.</p>
        </div>
        <div>
          <h2>Physical items are made to order and shipped worldwide.</h2>
          <p>Most physical products are produced in 3-7 business days, then shipped in 7-15 business days depending on region. Custom and personalized items begin after proof approval.</p>
        </div>
        <div>
          <h2>Commercial licensing is separated from file ownership.</h2>
          <p>Eligible packs can be used for small-batch physical resale only when a Commercial License is purchased. Digital resale, file sharing, and marketplace uploads are prohibited.</p>
        </div>
      </section>

      <section class="trust-section">
        ${["Secure Checkout", "Original Designs", "Digital Delivery", "Worldwide Shipping", "Support"].map(item => `
          <div>
            <span class="trust-icon" aria-hidden="true"></span>
            <strong>${item}</strong>
          </div>
        `).join("")}
      </section>

      <section class="section faq-preview">
        <div class="section-heading">
          <span class="eyebrow">Quick answers</span>
          <h2>Before you buy.</h2>
        </div>
        <details open>
          <summary>Can I refund an STL pack after downloading it?</summary>
          <p>No-reason refunds are not available after a digital file has been accessed or downloaded. We will help if the archive is damaged, the download fails, or the file does not match the listing.</p>
        </details>
        <details>
          <summary>How long do made-to-order products take?</summary>
          <p>Most physical products need 3-7 business days for production and 7-15 business days for shipping, depending on destination and carrier availability.</p>
        </details>
        <details>
          <summary>Can I sell prints made from your STL files?</summary>
          <p>Only with a separate Commercial License. The personal license included with STL packs does not permit resale or distribution.</p>
        </details>
      </section>
    </main>
    ${footer()}
  `;
}

function productsPage() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const active = params.get("category");
  const visible = active ? products.filter(product => product.category === active || product.type.toLowerCase().includes(active)) : products;
  const activeTitle = categories.find(category => category.id === active)?.title || "All Products";

  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">Catalog</span>
        <h1>${activeTitle}</h1>
        <p>Every listing includes product type, delivery method, processing time, refund rules, and license notes for a clear purchase decision.</p>
      </section>
      <section class="catalog-layout">
        <aside class="filters" aria-label="Product categories">
          <a class="${!active ? "active" : ""}" href="#/products">All Products</a>
          ${categories.map(category => `<a class="${active === category.id ? "active" : ""}" href="#/products?category=${category.id}">${category.title}</a>`).join("")}
          <a class="${active === "license" ? "active" : ""}" href="#/products?category=license">Commercial License</a>
        </aside>
        <div class="product-grid catalog-grid">
          ${visible.map(productCard).join("")}
        </div>
      </section>
    </main>
    ${footer()}
  `;
}

function placeholderPage(title, subtitle) {
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">Atelier Printworks</span>
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </section>
      <section class="policy-shell">
        <p>This page is part of the store compliance structure and will be expanded with full operational copy in V2 and V3. For immediate support, email <a href="mailto:${supportEmail}">${supportEmail}</a>. Support replies within 1-2 business days.</p>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Operating address:</strong> ${operatingAddress}</p>
      </section>
    </main>
    ${footer()}
  `;
}

function productDetailPage(id) {
  const product = products.find(item => item.id === id);
  if (!product) return placeholderPage("Product Not Found", "The requested product could not be found. Please return to the catalog.");
  const index = products.findIndex(item => item.id === id);
  return `
    ${nav()}
    <main>
      <section class="detail-layout">
        <div>${renderIllustration(product, index)}</div>
        <div class="detail-copy">
          <span class="pill">${product.type}</span>
          <h1>${product.name}</h1>
          <p class="lead">${product.summary}</p>
          <strong class="detail-price">${money(product.price)}</strong>
          <div class="detail-actions">
            <a class="button primary" href="#/cart">Add to cart</a>
            <a class="button secondary" href="#/checkout">Buy now</a>
          </div>
          <h2>Specifications</h2>
          <ul>${product.specs.map(spec => `<li>${spec}</li>`).join("")}</ul>
          <h2>Delivery</h2>
          <p>${product.delivery}</p>
          <h2>Refund note</h2>
          <p>${product.refund}</p>
          <h2>License note</h2>
          <p>${product.license}</p>
        </div>
      </section>
    </main>
    ${footer()}
  `;
}

const routeTitles = {
  "/cart": ["Cart", "Your cart will show physical products, digital packs, and licenses with delivery notes before checkout."],
  "/checkout": ["Checkout / Payment", "Payment is simulated in this V1 preview. Antom integration will be added without exposing private credentials in front-end code."],
  "/order-lookup": ["Order Lookup", "Customers can look up downloads, fulfillment status, and license certificates by order email and order number."],
  "/about": ["About Us", "We design original 3D printable objects for organized desks, warm homes, pet memories, and small creative studios."],
  "/contact": ["Contact Us", `Email ${supportEmail}. Business hours: Monday-Friday, 9:00-18:00 UTC+8. Support replies within 1-2 business days.`],
  "/shipping-policy": ["Shipping Policy", "Physical products are made to order in 3-7 business days and usually ship in 7-15 business days depending on destination."],
  "/refund-policy": ["Refund Policy", "Physical defects, damaged shipments, wrong items, and missing parts are handled by support. Downloaded digital goods are not eligible for no-reason refunds."],
  "/privacy-policy": ["Privacy Policy", "We collect order, contact, shipping, and support information needed to operate the store and provide customer service."],
  "/terms-of-service": ["Terms of Service", "Purchases require accurate contact details, lawful use, and acceptance of product-specific delivery, refund, and license terms."],
  "/digital-goods-policy": ["Digital Goods Policy", "STL, 3MF, and PDF guide downloads are delivered after purchase through order page access and email links."],
  "/license-agreement": ["License Agreement", "Digital products include personal-use rights only unless a separate Commercial License is purchased."],
  "/faq": ["FAQ", "Find concise answers about digital downloads, made-to-order production, returns, commercial rights, and custom print requests."],
  "/commercial-license": ["Commercial License", "Small businesses may purchase a license to sell physical prints from eligible Atelier Printworks files. Digital resale is prohibited."]
};

function route() {
  const raw = location.hash.replace("#", "") || "/";
  const path = raw.split("?")[0];
  const productMatch = path.match(/^\/products\/(.+)$/);
  if (path === "/") return homePage();
  if (path === "/products") return productsPage();
  if (productMatch) return productDetailPage(productMatch[1]);
  if (routeTitles[path]) return placeholderPage(routeTitles[path][0], routeTitles[path][1]);
  return placeholderPage("Page Not Found", "This route does not exist. Use the navigation or footer links to continue shopping.");
}

function render() {
  app.innerHTML = route();
  document.documentElement.lang = "en";
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", render);
render();
