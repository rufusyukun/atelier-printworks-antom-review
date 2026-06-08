const app = document.querySelector("#app");

const categories = [
  {
    id: "desk",
    title: "Desk Accessories",
    description: "Cable holders, trays, modular shelves, and small organizers made for calm workspaces."
  },
  {
    id: "home",
    title: "Home Objects",
    description: "Original sculptural vessels, micro displays, and low-volume decor for everyday rooms."
  },
  {
    id: "pet",
    title: "Pet Keepsakes",
    description: "Personalized memorial plinths, name tags, and gentle keepsake forms made to order."
  },
  {
    id: "stl",
    title: "STL Packs",
    description: "Ready-to-print STL and 3MF files with PDF guides for personal printing."
  },
  {
    id: "custom",
    title: "Custom Prints",
    description: "Upload-ready custom printing assistance for prototypes, mini decor, and desk utility parts."
  }
];

const products = [
  {
    id: "arc-desk-dock",
    name: "Arc Desk Dock",
    type: "Physical Product",
    category: "desk",
    price: 32,
    badge: "Made to order",
    summary: "A weighted modular dock for phone, watch, pen, and cable parking.",
    specs: ["Matte graphite PLA blend", "Approx. 18 x 9 x 4 cm", "Non-slip cork base included"],
    delivery: "Printed after purchase. Production takes 3-7 business days. Shipping normally takes 7-15 business days depending on destination.",
    refund: "Returnable for manufacturing defects, shipping damage, wrong item, or missing parts. Made-to-order items are not eligible for no-reason returns once production begins.",
    license: "Physical item only. Design files are not included."
  },
  {
    id: "linea-cable-orbit",
    name: "Linea Cable Orbit",
    type: "Physical Product",
    category: "desk",
    price: 18,
    badge: "Desk utility",
    summary: "A clean spiral cable organizer for USB-C, audio, and charging cables.",
    specs: ["Set of 4 organizers", "Fits most 3-5 mm cables", "Soft sandstone, ink, or cloud finish"],
    delivery: "Made to order in 3-7 business days. Shipping is tracked where the destination supports tracking.",
    refund: "Defective, damaged, or incorrectly shipped items can be replaced or refunded after support review.",
    license: "Physical item only. Commercial reproduction is not permitted."
  },
  {
    id: "modu-rise-mini-shelf",
    name: "Modu-Rise Mini Shelf",
    type: "Physical Product",
    category: "home",
    price: 46,
    badge: "Modular",
    summary: "A stackable micro shelf for small plants, collectibles, keys, and entryway objects.",
    specs: ["Two interlocking shelf blocks", "Approx. 22 x 12 x 16 cm assembled", "Printed in recycled PETG by request"],
    delivery: "Production takes 4-8 business days due to larger print time. Estimated delivery is 7-15 business days.",
    refund: "Eligible for replacement if damaged in transit or materially different from the product description.",
    license: "No digital file is included."
  },
  {
    id: "quiet-paws-keepsake",
    name: "Quiet Paws Keepsake Plinth",
    type: "Custom Print",
    category: "pet",
    price: 58,
    badge: "Personalized",
    summary: "A minimalist pet name plinth with optional date engraving and soft architectural lines.",
    specs: ["Personalized name text", "Optional short date line", "Proof sent before production"],
    delivery: "Customer proof is prepared within 2 business days. Production begins after proof approval and takes 3-7 business days.",
    refund: "Personalized items cannot be canceled after proof approval unless there is a production defect or shipping issue.",
    license: "Custom physical item only. Customer text remains customer-provided content."
  },
  {
    id: "urban-nook-stl-pack",
    name: "Urban Nook STL Pack",
    type: "Digital STL Pack",
    category: "stl",
    price: 24,
    badge: "Instant digital delivery",
    summary: "Original micro-architecture models for display shelves, dioramas, and print practice.",
    specs: ["12 STL files", "3MF layout files", "PDF print guide", "Personal-use license"],
    delivery: "After purchase, download links are available from the order page and sent by email. Files include STL, 3MF, and PDF guide formats.",
    refund: "Digital downloads are not refundable after access or download, except where files are corrupted, unavailable, or materially different from the description.",
    license: "Personal printing only. Resale, redistribution, public upload, and commercial production require a separate Commercial License."
  },
  {
    id: "mechanic-sprout-stl-bundle",
    name: "Mechanic Sprout Toy Bundle",
    type: "Digital STL Pack",
    category: "stl",
    price: 29,
    badge: "Ready to print",
    summary: "Five original mechanical-inspired desk toy models with snap-fit display bases.",
    specs: ["Pre-oriented STL files", "Optional 3MF scene plates", "Assembly PDF", "Test printed on 0.4 mm nozzle"],
    delivery: "Digital files are delivered through the order page and email link after payment confirmation.",
    refund: "No no-reason refunds after download. Support will replace broken archives, missing files, or incorrect download links.",
    license: "Personal license included. Commercial use requires a Commercial License."
  },
  {
    id: "studio-commercial-license",
    name: "Studio Commercial License",
    type: "Commercial License",
    category: "license",
    price: 89,
    badge: "For small shops",
    summary: "Permission for one small business to sell physical prints from eligible Atelier Printworks STL packs.",
    specs: ["Covers one business entity", "Up to 500 physical units per year", "Digital resale prohibited"],
    delivery: "License certificate is delivered by email and listed on the order page after purchase.",
    refund: "License purchases are non-refundable after certificate delivery unless duplicate payment or order error is confirmed.",
    license: "Allows sale of physical prints from eligible files. Does not allow resale, sharing, sublicensing, or uploading source files."
  },
  {
    id: "prototype-print-service",
    name: "Prototype Print Service",
    type: "Custom Print",
    category: "custom",
    price: 72,
    badge: "Quote reviewed",
    summary: "A starter service for small utility parts, display models, and original prototype prints.",
    specs: ["Includes printability review", "One material recommendation", "Up to 160 g print volume"],
    delivery: "Support reviews your brief within 1-2 business days. Production timeline is confirmed before payment capture where a custom quote is required.",
    refund: "Custom service refunds depend on project stage. Work not yet started can be canceled; approved and printed custom work is not refundable unless defective.",
    license: "Customer keeps rights to customer-provided original files. We do not accept infringing character, brand, or logo requests."
  },
  {
    id: "terra-minimal-plant-pot",
    name: "Terra Minimal Plant Pot",
    type: "Physical Product",
    category: "home",
    price: 34,
    badge: "Home object",
    summary: "A softly faceted planter with a removable drainage tray for small indoor plants.",
    specs: ["Approx. 12 x 12 x 11 cm", "PLA matte ceramic finish", "Removable drainage saucer"],
    delivery: "Made to order in 3-7 business days. Shipping normally takes 7-15 business days depending on destination.",
    refund: "Eligible for replacement or refund if damaged in transit, defective, or materially different from the listing.",
    license: "Physical item only. Digital model files are not included."
  },
  {
    id: "desk-setup-stl-pack",
    name: "Desk Setup STL Pack",
    type: "Digital STL Pack",
    category: "stl",
    price: 19,
    badge: "STL + 3MF",
    summary: "A focused set of cable clips, riser feet, pen cups, and micro trays for personal desk printing.",
    specs: ["18 STL files", "3MF build plates", "PDF print guide", "Personal-use license"],
    delivery: "Download links are available on the order page and sent by email after payment confirmation.",
    refund: "Downloaded digital goods are not eligible for no-reason refunds. Support will fix corrupted files, failed downloads, or mismatched descriptions.",
    license: "Personal printing only unless a Commercial License is purchased separately."
  },
  {
    id: "custom-logo-desk-sign",
    name: "Custom Logo Desk Sign",
    type: "Custom Print",
    category: "custom",
    price: 66,
    badge: "Proof required",
    summary: "A clean desk sign for original business names, studio names, or personal maker labels.",
    specs: ["One text/logo review", "Two color options", "Proof before production"],
    delivery: "Support reviews the request within 1-2 business days. Production starts after proof approval and takes 3-7 business days.",
    refund: "Not refundable after proof approval unless the item is defective or produced incorrectly. We reject trademark-infringing logo requests.",
    license: "Customer must own or have permission to use submitted artwork and business marks."
  },
  {
    id: "single-product-commercial-license",
    name: "Single Product Commercial License",
    type: "Commercial License",
    category: "license",
    price: 39,
    badge: "One design",
    summary: "Commercial permission to sell physical prints from one eligible Atelier Printworks digital product.",
    specs: ["Covers one eligible digital product", "Up to 150 physical units per year", "One business entity"],
    delivery: "License certificate is delivered by email and attached to the order record after purchase.",
    refund: "Non-refundable after certificate delivery unless duplicate payment or order error is confirmed.",
    license: "Allows physical print resale only. Digital files may not be shared, resold, uploaded, or sublicensed."
  }
];

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["Products", "#/products"],
      ["Custom Print", "#/products?category=custom"],
      ["STL Packs", "#/products?category=stl"],
      ["Commercial License", "#/commercial-license"]
    ]
  },
  {
    title: "Support",
    links: [
      ["Order Lookup", "#/order-lookup"],
      ["Contact Us", "#/contact"],
      ["FAQ", "#/faq"],
      ["Shipping Policy", "#/shipping-policy"],
      ["Refund Policy", "#/refund-policy"]
    ]
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "#/privacy-policy"],
      ["Terms of Service", "#/terms-of-service"],
      ["Digital Goods Policy", "#/digital-goods-policy"],
      ["License Agreement", "#/license-agreement"]
    ]
  }
];

const supportEmail = "support@atelierprintworks.example";
const businessName = "Atelier Printworks LLC (placeholder)";
const operatingAddress = "Operating address placeholder: 1200 Maker Avenue, Suite 8, Dover, DE 19901, United States";
const languages = [
  ["en", "English"],
  ["zh-CN", "中文"],
  ["ja-JP", "日本語"],
  ["fr-FR", "Français"],
  ["es-ES", "Español"]
];
let currentLang = localStorage.getItem("atelier-lang") || "en";

const dict = {
  en: {
    tag: "Original 3D Print Goods",
    navProducts: "Products",
    navCustom: "Custom Print",
    navStl: "STL Packs",
    navLicense: "Commercial License",
    navAbout: "About",
    navContact: "Contact",
    cart: "Cart",
    originalRender: "Original generated product render for",
    footerLine: "Original files, objects, and print services.",
    email: "Email",
    secureNote: "Secure checkout placeholder for Antom integration. Private payment credentials are never stored in the browser.",
    copyright: "© 2026 Atelier Printworks. All product concepts are original designs.",
    shop: "Shop",
    support: "Support",
    legal: "Legal",
    products: "Products",
    customPrint: "Custom Print",
    stlPacks: "STL Packs",
    commercialLicense: "Commercial License",
    orderLookup: "Order Lookup",
    contactUs: "Contact Us",
    faq: "FAQ",
    shippingPolicy: "Shipping Policy",
    refundPolicy: "Refund Policy",
    privacyPolicy: "Privacy Policy",
    terms: "Terms of Service",
    digitalPolicy: "Digital Goods Policy",
    licenseAgreement: "License Agreement",
    heroEyebrow: "Original 3D printed objects and digital STL packs",
    heroTitle: "Atelier-made tools, keepsakes, and print-ready model files.",
    heroBody: "Shop clean desk accessories, home objects, pet keepsakes, commercial licenses, and custom 3D print services. Every item is an original design with clear delivery, refund, and license terms.",
    shopProducts: "Shop products",
    digitalTerms: "Digital delivery terms",
    readyPacks: "Ready-to-print packs",
    readyPacksBody: "STL, 3MF, PDF guide, lifetime order access",
    purpose: "Shop by purpose",
    workflowTitle: "Built around real print workflows.",
    featured: "Featured products",
    featuredTitle: "Original models, objects, and licenses.",
    viewAll: "View all",
    viewDetails: "View details",
    digitalInfoTitle: "Digital files are delivered through the order page and email.",
    digitalInfoBody: "STL packs include STL, 3MF, and PDF guide files where noted. Downloads are for personal use unless a Commercial License is purchased. If a file is corrupted or access fails, support will resend or resolve it.",
    physicalInfoTitle: "Physical items are made to order and shipped worldwide.",
    physicalInfoBody: "Most physical products are produced in 3-7 business days, then shipped in 7-15 business days depending on region. Custom and personalized items begin after proof approval.",
    licenseInfoTitle: "Commercial licensing is separated from file ownership.",
    licenseInfoBody: "Eligible packs can be used for small-batch physical resale only when a Commercial License is purchased. Digital resale, file sharing, and marketplace uploads are prohibited.",
    trust: ["Secure Checkout", "Original Designs", "Digital Delivery", "Worldwide Shipping", "Support"],
    quickAnswers: "Quick answers",
    beforeBuy: "Before you buy.",
    q1: "Can I refund an STL pack after downloading it?",
    a1: "No-reason refunds are not available after a digital file has been accessed or downloaded. We will help if the archive is damaged, the download fails, or the file does not match the listing.",
    q2: "How long do made-to-order products take?",
    a2: "Most physical products need 3-7 business days for production and 7-15 business days for shipping, depending on destination and carrier availability.",
    q3: "Can I sell prints made from your STL files?",
    a3: "Only with a separate Commercial License. The personal license included with STL packs does not permit resale or distribution.",
    catalog: "Catalog",
    allProducts: "All Products",
    catalogBody: "Every listing includes product type, delivery method, processing time, refund rules, and license notes for a clear purchase decision.",
    addToCart: "Add to cart",
    buyNow: "Buy now",
    remove: "Remove",
    quantity: "Qty",
    subtotal: "Subtotal",
    total: "Total",
    continueShopping: "Continue shopping",
    checkout: "Checkout",
    emptyCart: "Your cart is empty.",
    emptyCartBody: "Add a physical product, STL pack, custom service, or license before checkout.",
    customerEmail: "Customer email",
    shippingAddress: "Shipping address",
    customNotes: "Custom print notes",
    placeOrder: "Place order",
    orderSuccess: "Order confirmed",
    orderNumber: "Order number",
    lookupHelp: "Enter an order number to view delivery, download, and support details.",
    lookupOrder: "Look up order",
    notRequiredDigital: "Shipping address is not required for digital-only carts.",
    deliveryRefundBeforeCheckout: "Delivery and refund notes are shown before checkout for each item.",
    paymentPlaceholder: "Antom payment integration placeholder. This preview creates a mock order and stores no payment credentials.",
    requiredField: "Please complete the required fields.",
    invalidEmail: "Please enter a valid email address.",
    orderNotFound: "Order not found. Check the order number or email support.",
    successBody: "Your mock order has been created for review. Digital links and license certificates would appear on this page after payment confirmation.",
    downloadAccess: "Download access",
    shippingNeeded: "Shipping required",
    customReview: "Custom review required",
    productFaq: "Product FAQ",
    auditChecklist: "Audit Checklist",
    specifications: "Specifications",
    delivery: "Delivery",
    refundNote: "Refund note",
    licenseNote: "License note",
    complianceBody: "This page is part of the store compliance structure and will be expanded with full operational copy in V2 and V3. For immediate support, email",
    supportReply: "Support replies within 1-2 business days.",
    business: "Business",
    address: "Operating address",
    notFound: "Product Not Found",
    notFoundBody: "The requested product could not be found. Please return to the catalog.",
    pageNotFound: "Page Not Found",
    pageNotFoundBody: "This route does not exist. Use the navigation or footer links to continue shopping."
  },
  "zh-CN": {
    tag: "原创 3D 打印商品",
    navProducts: "商品",
    navCustom: "定制打印",
    navStl: "STL 文件包",
    navLicense: "商业授权",
    navAbout: "关于我们",
    navContact: "联系我们",
    cart: "购物车",
    originalRender: "原创生成商品图：",
    footerLine: "原创数字文件、实体小物与打印服务。",
    email: "邮箱",
    secureNote: "Antom 接入预留的安全结账入口。支付私密凭证不会存放在浏览器中。",
    copyright: "© 2026 Atelier Printworks。所有商品概念均为原创设计。",
    shop: "商店",
    support: "支持",
    legal: "法律与政策",
    products: "商品",
    customPrint: "定制打印",
    stlPacks: "STL 文件包",
    commercialLicense: "商业授权",
    orderLookup: "订单查询",
    contactUs: "联系我们",
    faq: "常见问题",
    shippingPolicy: "配送政策",
    refundPolicy: "退款政策",
    privacyPolicy: "隐私政策",
    terms: "服务条款",
    digitalPolicy: "数字商品政策",
    licenseAgreement: "授权协议",
    heroEyebrow: "原创 3D 打印实体小物与 STL 数字文件",
    heroTitle: "工作室原创的桌面工具、纪念摆件与可打印模型文件。",
    heroBody: "购买桌面收纳、家居小物、宠物纪念摆件、商业授权和定制 3D 打印服务。每件商品都清楚说明交付方式、退款规则和授权范围。",
    shopProducts: "浏览商品",
    digitalTerms: "查看数字交付说明",
    readyPacks: "可直接打印的文件包",
    readyPacksBody: "包含 STL、3MF、PDF 指南，并可通过订单长期访问",
    purpose: "按用途选购",
    workflowTitle: "围绕真实打印流程设计。",
    featured: "精选商品",
    featuredTitle: "原创模型、实体小物与授权。",
    viewAll: "查看全部",
    viewDetails: "查看详情",
    digitalInfoTitle: "数字文件通过订单页和邮件交付。",
    digitalInfoBody: "STL 文件包会按说明包含 STL、3MF 和 PDF 指南。未购买商业授权时仅限个人使用。如果文件损坏或无法下载，客服会补发或协助处理。",
    physicalInfoTitle: "实体商品按订单制作，并支持全球配送。",
    physicalInfoBody: "多数实体商品生产周期为 3-7 个工作日，配送通常为 7-15 个工作日，具体取决于地区。定制和个性化商品会在确认稿后开始制作。",
    licenseInfoTitle: "商业授权与文件所有权分开管理。",
    licenseInfoBody: "符合条件的文件包只有在购买商业授权后，才可用于小批量实体打印销售。禁止转售数字文件、分享源文件或上传到公开平台。",
    trust: ["安全结账", "原创设计", "数字交付", "全球配送", "客服支持"],
    quickAnswers: "快速解答",
    beforeBuy: "购买前须知。",
    q1: "STL 文件包下载后还能退款吗？",
    a1: "数字文件一旦访问或下载，原则上不支持无理由退款。如果压缩包损坏、下载失败或文件与描述不符，我们会协助补发或处理。",
    q2: "按订单制作的实体商品需要多久？",
    a2: "多数实体商品生产需要 3-7 个工作日，配送约 7-15 个工作日，具体取决于目的地和承运商。",
    q3: "我可以销售用你们 STL 文件打印出来的实体商品吗？",
    a3: "只有单独购买商业授权后才可以。STL 文件包自带的个人授权不允许转售或分发。",
    catalog: "商品目录",
    allProducts: "全部商品",
    catalogBody: "每个商品都会展示类型、交付方式、处理时间、退款规则和授权说明，方便你清楚下单。",
    addToCart: "加入购物车",
    buyNow: "立即购买",
    remove: "移除",
    quantity: "数量",
    subtotal: "小计",
    total: "合计",
    continueShopping: "继续购物",
    checkout: "结账",
    emptyCart: "购物车是空的。",
    emptyCartBody: "请先添加实体商品、STL 文件包、定制服务或授权。",
    customerEmail: "客户邮箱",
    shippingAddress: "收货地址",
    customNotes: "定制需求备注",
    placeOrder: "提交订单",
    orderSuccess: "订单已生成",
    orderNumber: "订单号",
    lookupHelp: "输入订单号即可查看交付、下载和客服信息。",
    lookupOrder: "查询订单",
    notRequiredDigital: "纯数字商品购物车不需要填写收货地址。",
    deliveryRefundBeforeCheckout: "每件商品在结账前都会展示交付和退款说明。",
    paymentPlaceholder: "Antom 支付接入预留位。当前预览会生成模拟订单，不保存任何支付凭证。",
    requiredField: "请填写必填信息。",
    invalidEmail: "请输入有效邮箱地址。",
    orderNotFound: "未找到订单，请检查订单号或联系邮箱客服。",
    successBody: "模拟订单已生成用于审核。真实支付确认后，数字下载和授权证书会显示在此页面。",
    downloadAccess: "下载访问",
    shippingNeeded: "需要配送",
    customReview: "需要定制审核",
    productFaq: "商品常见问题",
    auditChecklist: "审核清单",
    specifications: "规格参数",
    delivery: "交付方式",
    refundNote: "退款说明",
    licenseNote: "授权说明",
    complianceBody: "该页面属于店铺合规信息结构，完整政策文本会在 V2 和 V3 扩写。需要帮助请发送邮件至",
    supportReply: "客服通常会在 1-2 个工作日内回复。",
    business: "企业名称",
    address: "经营地址",
    notFound: "未找到商品",
    notFoundBody: "请求的商品不存在，请返回商品目录。",
    pageNotFound: "页面不存在",
    pageNotFoundBody: "该路由不存在，请使用导航或页脚链接继续浏览。"
  },
  "ja-JP": {
    tag: "オリジナル3Dプリント商品",
    navProducts: "商品",
    navCustom: "カスタムプリント",
    navStl: "STLパック",
    navLicense: "商用ライセンス",
    navAbout: "会社情報",
    navContact: "お問い合わせ",
    cart: "カート",
    originalRender: "オリジナル生成商品画像:",
    footerLine: "オリジナルファイル、雑貨、プリントサービス。",
    email: "メール",
    secureNote: "Antom連携用の安全なチェックアウト枠です。決済用の機密情報はブラウザに保存しません。",
    copyright: "© 2026 Atelier Printworks. すべての商品コンセプトはオリジナルです。",
    shop: "ショップ",
    support: "サポート",
    legal: "法務",
    products: "商品",
    customPrint: "カスタムプリント",
    stlPacks: "STLパック",
    commercialLicense: "商用ライセンス",
    orderLookup: "注文検索",
    contactUs: "お問い合わせ",
    faq: "FAQ",
    shippingPolicy: "配送ポリシー",
    refundPolicy: "返金ポリシー",
    privacyPolicy: "プライバシーポリシー",
    terms: "利用規約",
    digitalPolicy: "デジタル商品ポリシー",
    licenseAgreement: "ライセンス契約",
    heroEyebrow: "オリジナル3Dプリント雑貨とSTLデジタルファイル",
    heroTitle: "アトリエ発のツール、記念品、すぐ印刷できるモデルファイル。",
    heroBody: "デスク用品、ホームオブジェ、ペット記念品、商用ライセンス、カスタム3Dプリントサービスを購入できます。各商品には配送、返金、ライセンス条件を明記しています。",
    shopProducts: "商品を見る",
    digitalTerms: "デジタル納品条件",
    readyPacks: "すぐ印刷できるパック",
    readyPacksBody: "STL、3MF、PDFガイド、注文ページから継続アクセス",
    purpose: "用途で選ぶ",
    workflowTitle: "実際のプリント工程に合わせた設計。",
    featured: "注目商品",
    featuredTitle: "オリジナルモデル、商品、ライセンス。",
    viewAll: "すべて見る",
    viewDetails: "詳細を見る",
    digitalInfoTitle: "デジタルファイルは注文ページとメールで提供されます。",
    digitalInfoBody: "STLパックには記載に応じてSTL、3MF、PDFガイドが含まれます。商用ライセンスなしでは個人利用のみです。破損やアクセス不良があればサポートが対応します。",
    physicalInfoTitle: "物理商品は受注生産で世界配送に対応します。",
    physicalInfoBody: "多くの商品は3-7営業日で制作し、配送は地域により通常7-15営業日です。カスタム商品は校正承認後に制作します。",
    licenseInfoTitle: "商用ライセンスはファイル所有権とは別です。",
    licenseInfoBody: "対象パックは商用ライセンス購入時のみ小ロットの物理販売が可能です。デジタル再販、共有、公開アップロードは禁止です。",
    trust: ["安全決済", "オリジナル設計", "デジタル納品", "世界配送", "サポート"],
    quickAnswers: "よくある質問",
    beforeBuy: "購入前に。",
    q1: "STLパックをダウンロード後に返金できますか？",
    a1: "アクセスまたはダウンロード後の自己都合返金はできません。破損、ダウンロード失敗、説明との相違がある場合は対応します。",
    q2: "受注生産品はどのくらいかかりますか？",
    a2: "通常3-7営業日で制作し、配送は目的地により7-15営業日です。",
    q3: "STLから印刷した物を販売できますか？",
    a3: "別途商用ライセンスが必要です。個人ライセンスでは再販や配布はできません。",
    catalog: "カタログ",
    allProducts: "すべての商品",
    catalogBody: "各商品には種類、納品方法、処理時間、返金条件、ライセンス情報を明記しています。",
    addToCart: "カートに追加",
    buyNow: "今すぐ購入",
    specifications: "仕様",
    delivery: "納品",
    refundNote: "返金について",
    licenseNote: "ライセンスについて",
    complianceBody: "このページはストアのコンプライアンス構成の一部です。詳細文面はV2/V3で拡充します。サポートはメールでご連絡ください:",
    supportReply: "通常1-2営業日以内に返信します。",
    business: "事業者名",
    address: "運営住所",
    notFound: "商品が見つかりません",
    notFoundBody: "商品が見つかりません。カタログに戻ってください。",
    pageNotFound: "ページが見つかりません",
    pageNotFoundBody: "このページは存在しません。ナビゲーションまたはフッターリンクをご利用ください。"
  }
};

dict["fr-FR"] = {
  ...dict.en,
  tag: "Produits 3D originaux",
  shop: "Boutique",
  support: "Support",
  legal: "Mentions légales",
  products: "Produits",
  customPrint: "Impression sur mesure",
  stlPacks: "Packs STL",
  commercialLicense: "Licence commerciale",
  orderLookup: "Suivi de commande",
  contactUs: "Contact",
  faq: "FAQ",
  shippingPolicy: "Politique de livraison",
  refundPolicy: "Politique de remboursement",
  privacyPolicy: "Confidentialité",
  terms: "Conditions de service",
  digitalPolicy: "Politique des biens numériques",
  licenseAgreement: "Accord de licence",
  navProducts: "Produits",
  navCustom: "Impression sur mesure",
  navStl: "Packs STL",
  navLicense: "Licence commerciale",
  navAbout: "À propos",
  navContact: "Contact",
  cart: "Panier",
  shopProducts: "Voir les produits",
  digitalTerms: "Conditions de livraison numérique",
  heroEyebrow: "Objets 3D originaux et fichiers STL",
  heroTitle: "Outils d'atelier, souvenirs et fichiers prêts à imprimer.",
  heroBody: "Achetez des accessoires de bureau, objets pour la maison, souvenirs pour animaux, licences commerciales et services d'impression 3D sur mesure. Chaque produit précise livraison, remboursement et licence.",
  allProducts: "Tous les produits",
  catalog: "Catalogue",
  addToCart: "Ajouter au panier",
  buyNow: "Acheter",
  viewDetails: "Voir le détail",
  viewAll: "Tout voir",
  specifications: "Spécifications",
  delivery: "Livraison",
  refundNote: "Remboursement",
  licenseNote: "Licence",
  trust: ["Paiement sécurisé", "Designs originaux", "Livraison numérique", "Livraison mondiale", "Support"]
};

dict["es-ES"] = {
  ...dict.en,
  tag: "Productos 3D originales",
  shop: "Tienda",
  support: "Soporte",
  legal: "Legal",
  products: "Productos",
  customPrint: "Impresión personalizada",
  stlPacks: "Packs STL",
  commercialLicense: "Licencia comercial",
  orderLookup: "Buscar pedido",
  contactUs: "Contacto",
  faq: "FAQ",
  shippingPolicy: "Política de envíos",
  refundPolicy: "Política de reembolsos",
  privacyPolicy: "Política de privacidad",
  terms: "Términos de servicio",
  digitalPolicy: "Política de bienes digitales",
  licenseAgreement: "Acuerdo de licencia",
  navProducts: "Productos",
  navCustom: "Impresión personalizada",
  navStl: "Packs STL",
  navLicense: "Licencia comercial",
  navAbout: "Sobre nosotros",
  navContact: "Contacto",
  cart: "Carrito",
  shopProducts: "Ver productos",
  digitalTerms: "Condiciones de entrega digital",
  heroEyebrow: "Objetos 3D originales y archivos STL",
  heroTitle: "Herramientas de estudio, recuerdos y archivos listos para imprimir.",
  heroBody: "Compra accesorios de escritorio, objetos para el hogar, recuerdos para mascotas, licencias comerciales y servicios de impresión 3D personalizada. Cada producto explica entrega, reembolsos y licencia.",
  allProducts: "Todos los productos",
  catalog: "Catálogo",
  addToCart: "Añadir al carrito",
  buyNow: "Comprar ahora",
  viewDetails: "Ver detalles",
  viewAll: "Ver todo",
  specifications: "Especificaciones",
  delivery: "Entrega",
  refundNote: "Nota de reembolso",
  licenseNote: "Nota de licencia",
  trust: ["Pago seguro", "Diseños originales", "Entrega digital", "Envíos mundiales", "Soporte"]
};

const localizedCategories = {
  "zh-CN": {
    desk: ["桌面配件", "线缆收纳、托盘、模块化小架子和让工作区更清爽的小工具。"],
    home: ["家居小物", "原创装饰容器、微型展示件和适合日常空间的小批量摆件。"],
    pet: ["宠物纪念摆件", "按订单制作的宠物姓名底座、纪念牌和温柔克制的纪念形态。"],
    stl: ["STL 文件包", "包含 STL、3MF 和 PDF 指南的可打印数字文件，适合个人打印。"],
    custom: ["定制打印", "为原创原型、小摆件和桌面实用零件提供定制打印协助。"]
  },
  "ja-JP": {
    desk: ["デスク用品", "ケーブルホルダー、トレー、モジュラー棚など整理された作業空間向けの小物。"],
    home: ["ホームオブジェ", "日常空間に合うオリジナルの器、ミクロ展示物、少量生産の装飾品。"],
    pet: ["ペット記念品", "受注生産の名前入り台座、タグ、穏やかな記念オブジェ。"],
    stl: ["STLパック", "個人プリント向けのSTL、3MF、PDFガイド付きファイル。"],
    custom: ["カスタムプリント", "試作品、小型装飾、デスク用パーツのプリント相談。"]
  },
  "fr-FR": {
    desk: ["Accessoires de bureau", "Supports de câbles, plateaux, mini étagères modulaires et organiseurs pour un espace calme."],
    home: ["Objets pour la maison", "Vases sculpturaux, micro-présentoirs et décorations en petite série pour le quotidien."],
    pet: ["Souvenirs pour animaux", "Socles personnalisés, plaques de nom et formes commémoratives fabriquées sur commande."],
    stl: ["Packs STL", "Fichiers STL et 3MF prêts à imprimer avec guides PDF pour usage personnel."],
    custom: ["Impressions sur mesure", "Aide à l'impression pour prototypes originaux, petites décorations et pièces utiles de bureau."]
  },
  "es-ES": {
    desk: ["Accesorios de escritorio", "Soportes de cable, bandejas, estantes modulares y organizadores para espacios de trabajo ordenados."],
    home: ["Objetos para el hogar", "Piezas decorativas originales, microexpositores y objetos de baja producción para uso diario."],
    pet: ["Recuerdos para mascotas", "Peanas personalizadas, placas de nombre y formas conmemorativas hechas bajo pedido."],
    stl: ["Packs STL", "Archivos STL y 3MF listos para imprimir con guías PDF para uso personal."],
    custom: ["Impresiones personalizadas", "Ayuda de impresión para prototipos originales, decoración pequeña y piezas útiles de escritorio."]
  }
};

const localizedProducts = {
  "zh-CN": {
    "arc-desk-dock": ["弧形桌面停靠座", "可放置手机、手表、笔和线缆的加重模块化桌面底座。"],
    "linea-cable-orbit": ["Linea 线缆环", "适用于 USB-C、音频线和充电线的简洁螺旋线缆收纳器。"],
    "modu-rise-mini-shelf": ["Modu-Rise 迷你层架", "可堆叠的小型展示架，适合植物、钥匙和入口小物。"],
    "quiet-paws-keepsake": ["Quiet Paws 宠物纪念底座", "带可选日期刻字的极简宠物姓名纪念底座。"],
    "urban-nook-stl-pack": ["Urban Nook 建筑 STL 包", "原创微缩建筑模型，适合展示架、场景和打印练习。"],
    "mechanic-sprout-stl-bundle": ["Mechanic Sprout 机械玩具包", "五款原创机械风桌面玩具模型，配可打印展示底座。"],
    "studio-commercial-license": ["工作室商业授权", "允许一个小型商家销售符合条件 STL 文件打印出的实体商品。"],
    "prototype-print-service": ["原型打印服务", "面向小型实用零件、展示模型和原创原型的入门打印服务。"],
    "terra-minimal-plant-pot": ["Terra 极简植物盆", "带可拆卸托盘的柔和切面小花盆，适合室内小植物。"],
    "desk-setup-stl-pack": ["桌面布置 STL 包", "包含线夹、增高脚、笔筒和小托盘的桌面打印文件组合。"],
    "custom-logo-desk-sign": ["定制 Logo 桌牌", "用于原创企业名、工作室名或个人创作者标签的简洁桌牌。"],
    "single-product-commercial-license": ["单品商业授权", "允许销售一个符合条件数字商品打印出的实体成品。"]
  },
  "ja-JP": {
    "arc-desk-dock": ["Arcデスクドック", "スマホ、時計、ペン、ケーブルを置ける重みのあるモジュラードック。"],
    "linea-cable-orbit": ["Lineaケーブルオービット", "USB-C、オーディオ、充電ケーブル向けのシンプルなスパイラル収納。"],
    "modu-rise-mini-shelf": ["Modu-Riseミニシェルフ", "植物、鍵、小物向けの積み重ね式ミニ棚。"],
    "quiet-paws-keepsake": ["Quiet Paws記念台座", "日付刻印も選べるミニマルなペット名入り記念台座。"],
    "urban-nook-stl-pack": ["Urban Nook STLパック", "棚展示、ジオラマ、練習プリント向けのオリジナル微建築モデル。"],
    "mechanic-sprout-stl-bundle": ["Mechanic Sprout玩具バンドル", "スナップ式展示台付きの機械風デスクトイ5種。"],
    "studio-commercial-license": ["スタジオ商用ライセンス", "対象STLから印刷した物理商品を小規模販売できるライセンス。"],
    "prototype-print-service": ["プロトタイププリントサービス", "小型パーツ、展示モデル、オリジナル試作品向けの入門サービス。"],
    "terra-minimal-plant-pot": ["Terraミニマルプランター", "取り外し可能な受け皿付きの柔らかな面構成の小型プランター。"],
    "desk-setup-stl-pack": ["Desk Setup STLパック", "ケーブルクリップ、ライザー脚、ペンカップ、小型トレーのファイルセット。"],
    "custom-logo-desk-sign": ["カスタムロゴデスクサイン", "オリジナルの事業名、スタジオ名、メーカーネーム向けのクリーンなサイン。"],
    "single-product-commercial-license": ["単品商用ライセンス", "対象デジタル商品1点から印刷した物理商品の販売許可。"]
  },
  "fr-FR": {
    "arc-desk-dock": ["Station de bureau Arc", "Un dock modulaire lesté pour téléphone, montre, stylo et câbles."],
    "linea-cable-orbit": ["Orbit de câble Linea", "Un organiseur spiralé propre pour câbles USB-C, audio et charge."],
    "modu-rise-mini-shelf": ["Mini étagère Modu-Rise", "Une micro-étagère empilable pour plantes, clés et petits objets."],
    "quiet-paws-keepsake": ["Socle souvenir Quiet Paws", "Un socle minimaliste personnalisé pour animal, avec date optionnelle."],
    "urban-nook-stl-pack": ["Pack STL Urban Nook", "Modèles de micro-architecture originaux pour étagères, dioramas et essais d'impression."],
    "mechanic-sprout-stl-bundle": ["Bundle Mechanic Sprout", "Cinq jouets de bureau originaux d'inspiration mécanique avec bases imprimables."],
    "studio-commercial-license": ["Licence commerciale Studio", "Autorisation pour une petite entreprise de vendre des impressions physiques issues de packs éligibles."],
    "prototype-print-service": ["Service d'impression prototype", "Service de départ pour petites pièces utiles, modèles d'exposition et prototypes originaux."],
    "terra-minimal-plant-pot": ["Pot minimal Terra", "Un petit pot facetté avec soucoupe amovible pour plantes d'intérieur."],
    "desk-setup-stl-pack": ["Pack STL Desk Setup", "Un ensemble de clips, pieds de rehausse, pots à crayons et micro-plateaux à imprimer."],
    "custom-logo-desk-sign": ["Panneau de bureau personnalisé", "Un panneau propre pour noms d'entreprise, studios ou labels de créateur originaux."],
    "single-product-commercial-license": ["Licence commerciale mono-produit", "Autorisation de vendre des impressions physiques d'un produit numérique éligible."]
  },
  "es-ES": {
    "arc-desk-dock": ["Base de escritorio Arc", "Una base modular con peso para teléfono, reloj, bolígrafo y cables."],
    "linea-cable-orbit": ["Órbita de cable Linea", "Un organizador espiral limpio para cables USB-C, audio y carga."],
    "modu-rise-mini-shelf": ["Mini estante Modu-Rise", "Un microestante apilable para plantas pequeñas, llaves y objetos de entrada."],
    "quiet-paws-keepsake": ["Peana recuerdo Quiet Paws", "Una peana minimalista con nombre de mascota y fecha opcional."],
    "urban-nook-stl-pack": ["Pack STL Urban Nook", "Modelos originales de microarquitectura para estantes, dioramas y práctica de impresión."],
    "mechanic-sprout-stl-bundle": ["Bundle Mechanic Sprout", "Cinco juguetes de escritorio originales de inspiración mecánica con bases imprimibles."],
    "studio-commercial-license": ["Licencia comercial Studio", "Permiso para que una pequeña empresa venda impresiones físicas de packs elegibles."],
    "prototype-print-service": ["Servicio de impresión de prototipos", "Servicio inicial para piezas útiles pequeñas, modelos de exhibición y prototipos originales."],
    "terra-minimal-plant-pot": ["Maceta minimal Terra", "Una maceta suavemente facetada con bandeja extraíble para plantas pequeñas de interior."],
    "desk-setup-stl-pack": ["Pack STL Desk Setup", "Un set de clips de cable, elevadores, portalápices y microbandejas para imprimir."],
    "custom-logo-desk-sign": ["Letrero de escritorio personalizado", "Un letrero limpio para nombres de negocio, estudio o etiqueta personal original."],
    "single-product-commercial-license": ["Licencia comercial de producto único", "Permiso para vender impresiones físicas de un producto digital elegible."]
  }
};

const routeTranslations = {
  "/cart": ["cart", "Your cart will show physical products, digital packs, and licenses with delivery notes before checkout."],
  "/checkout": ["Checkout / Payment", "Payment is simulated in this V1 preview. Antom integration will be added without exposing private credentials in front-end code."],
  "/order-lookup": ["orderLookup", "Customers can look up downloads, fulfillment status, and license certificates by order email and order number."],
  "/about": ["About Us", "We design original 3D printable objects for organized desks, warm homes, pet memories, and small creative studios."],
  "/contact": ["contactUs", `Email ${supportEmail}. Business hours: Monday-Friday, 9:00-18:00 UTC+8. Support replies within 1-2 business days.`],
  "/shipping-policy": ["shippingPolicy", "Physical products are made to order in 3-7 business days and usually ship in 7-15 business days depending on destination."],
  "/refund-policy": ["refundPolicy", "Physical defects, damaged shipments, wrong items, and missing parts are handled by support. Downloaded digital goods are not eligible for no-reason refunds."],
  "/privacy-policy": ["privacyPolicy", "We collect order, contact, shipping, and support information needed to operate the store and provide customer service."],
  "/terms-of-service": ["terms", "Purchases require accurate contact details, lawful use, and acceptance of product-specific delivery, refund, and license terms."],
  "/digital-goods-policy": ["digitalPolicy", "STL, 3MF, and PDF guide downloads are delivered after purchase through order page access and email links."],
  "/license-agreement": ["licenseAgreement", "Digital products include personal-use rights only unless a separate Commercial License is purchased."],
  "/faq": ["faq", "Find concise answers about digital downloads, made-to-order production, returns, commercial rights, and custom print requests."],
  "/commercial-license": ["commercialLicense", "Small businesses may purchase a license to sell physical prints from eligible Atelier Printworks files. Digital resale is prohibited."]
};

function t(key) {
  return (dict[currentLang] && dict[currentLang][key]) || dict.en[key] || key;
}

function categoryText(category) {
  const localized = localizedCategories[currentLang]?.[category.id];
  return {
    title: localized?.[0] || category.title,
    description: localized?.[1] || category.description
  };
}

function productText(product) {
  const localized = localizedProducts[currentLang]?.[product.id];
  return {
    name: localized?.[0] || product.name,
    summary: localized?.[1] || product.summary
  };
}

function labelFromFooter(label) {
  const keys = {
    Products: "products",
    "Custom Print": "customPrint",
    "STL Packs": "stlPacks",
    "Commercial License": "commercialLicense",
    "Order Lookup": "orderLookup",
    "Contact Us": "contactUs",
    FAQ: "faq",
    "Shipping Policy": "shippingPolicy",
    "Refund Policy": "refundPolicy",
    "Privacy Policy": "privacyPolicy",
    "Terms of Service": "terms",
    "Digital Goods Policy": "digitalPolicy",
    "License Agreement": "licenseAgreement"
  };
  return t(keys[label] || label);
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem("atelier-cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("atelier-cart", JSON.stringify(cart));
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("atelier-orders") || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("atelier-orders", JSON.stringify(orders));
}

function addToCart(productId) {
  const cart = getCart();
  const item = cart.find(entry => entry.id === productId);
  if (item) item.qty += 1;
  else cart.push({ id: productId, qty: 1 });
  saveCart(cart);
  render();
}

function setCartQty(productId, qty) {
  const next = getCart()
    .map(item => item.id === productId ? { ...item, qty: Math.max(0, qty) } : item)
    .filter(item => item.qty > 0);
  saveCart(next);
  render();
}

function cartLines() {
  return getCart()
    .map(item => ({ ...item, product: products.find(product => product.id === item.id) }))
    .filter(item => item.product);
}

function cartTotal(lines = cartLines()) {
  return lines.reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function cartNeedsShipping(lines = cartLines()) {
  return lines.some(item => ["Physical Product", "Custom Print"].includes(item.product.type));
}

function cartNeedsCustomNotes(lines = cartLines()) {
  return lines.some(item => item.product.type === "Custom Print");
}

function isDigitalOnly(lines = cartLines()) {
  return lines.length > 0 && lines.every(item => ["Digital STL Pack", "Commercial License"].includes(item.product.type));
}

function orderDeliverySummary(lines) {
  const parts = [];
  if (lines.some(item => item.product.type === "Digital STL Pack")) parts.push(t("downloadAccess"));
  if (lines.some(item => item.product.type === "Commercial License")) parts.push(t("licenseAgreement"));
  if (cartNeedsShipping(lines)) parts.push(t("shippingNeeded"));
  if (cartNeedsCustomNotes(lines)) parts.push(t("customReview"));
  return parts.join(" · ");
}

function createMockOrder(form) {
  const lines = cartLines();
  const order = {
    id: `AP-${Date.now().toString().slice(-8)}`,
    createdAt: new Date().toISOString(),
    email: form.email,
    address: form.address || "",
    notes: form.notes || "",
    items: lines.map(line => ({ id: line.product.id, qty: line.qty, price: line.product.price })),
    total: cartTotal(lines),
    delivery: orderDeliverySummary(lines),
    status: "Payment preview created"
  };
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  saveCart([]);
  sessionStorage.setItem("atelier-last-order", order.id);
  location.hash = `#/order-success?order=${order.id}`;
}

const mockOrders = [
  {
    id: "AP-DEMO-1001",
    email: "customer@example.com",
    total: 53,
    delivery: "Download access · License Agreement",
    status: "Digital files available",
    items: [
      { id: "urban-nook-stl-pack", qty: 1, price: 24 },
      { id: "desk-setup-stl-pack", qty: 1, price: 19 }
    ]
  }
];

function findOrder(orderId) {
  const normalized = orderId.trim().toUpperCase();
  return [...getOrders(), ...mockOrders].find(order => order.id.toUpperCase() === normalized);
}

function cartBadgeCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function renderIllustration(product, index = 0) {
  const productLabel = productText(product).name;
  const colors = [
    ["#eef2f0", "#82908a", "#1b2732"],
    ["#f2eee7", "#b8a88e", "#253245"],
    ["#edf0f4", "#7c91a8", "#111827"],
    ["#f5eee8", "#c4a484", "#273238"],
    ["#edf3ef", "#8bb3a3", "#17212b"]
  ][index % 5];

  return `
    <div class="render-card" aria-label="${t("originalRender")} ${productLabel}">
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
          <small>${t("tag")}</small>
        </span>
      </a>
      <nav class="main-nav" aria-label="Primary navigation">
        <a href="#/products">${t("navProducts")}</a>
        <a href="#/products?category=custom">${t("navCustom")}</a>
        <a href="#/products?category=stl">${t("navStl")}</a>
        <a href="#/commercial-license">${t("navLicense")}</a>
        <a href="#/about">${t("navAbout")}</a>
        <a href="#/contact">${t("navContact")}</a>
      </nav>
      <div class="header-actions">
        <select class="language-select" aria-label="Language selector">
          ${languages.map(([code, label]) => `<option value="${code}" ${currentLang === code ? "selected" : ""}>${label}</option>`).join("")}
        </select>
        <a class="cart-link" href="#/cart" aria-label="${t("cart")}">${t("cart")} <span>${cartBadgeCount()}</span></a>
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
              <small>${t("footerLine")}</small>
            </span>
          </a>
          <p>${businessName}</p>
          <p>${operatingAddress}</p>
          <p>${t("email")}: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
        </div>
        ${footerGroups.map(group => `
          <div class="footer-group">
            <h3>${t(group.title.toLowerCase())}</h3>
            ${group.links.map(([label, href]) => `<a href="${href}">${labelFromFooter(label)}</a>`).join("")}
          </div>
        `).join("")}
      </div>
      <div class="footer-bottom">
        <span>${t("secureNote")}</span>
        <span>${t("copyright")}</span>
      </div>
    </footer>
  `;
}

function productCard(product, index) {
  const text = productText(product);
  return `
    <article class="product-card">
      <a href="#/products/${product.id}" class="product-media">${renderIllustration(product, index)}</a>
      <div class="product-body">
        <span class="pill">${product.badge}</span>
        <h3><a href="#/products/${product.id}">${text.name}</a></h3>
        <p>${text.summary}</p>
        <div class="product-meta">
          <span>${product.type}</span>
          <strong>${money(product.price)}</strong>
        </div>
        <div class="card-actions">
          <button class="mini-button" data-add-to-cart="${product.id}" type="button">${t("addToCart")}</button>
          <a class="text-link" href="#/products/${product.id}">${t("viewDetails")}</a>
        </div>
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
          <span class="eyebrow">${t("heroEyebrow")}</span>
          <h1>${t("heroTitle")}</h1>
          <p>${t("heroBody")}</p>
          <div class="hero-actions">
            <a class="button primary" href="#/products">${t("shopProducts")}</a>
            <a class="button secondary" href="#/digital-goods-policy">${t("digitalTerms")}</a>
          </div>
        </div>
        <div class="hero-stage">
          ${renderIllustration(products[4], 4)}
          <div class="stage-note">
            <strong>${t("readyPacks")}</strong>
            <span>${t("readyPacksBody")}</span>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <span class="eyebrow">${t("purpose")}</span>
          <h2>${t("workflowTitle")}</h2>
        </div>
        <div class="category-grid">
          ${categories.map(category => {
            const text = categoryText(category);
            return `
            <a class="category-card" href="#/products?category=${category.id}">
              <span>${text.title}</span>
              <p>${text.description}</p>
            </a>
          `;
          }).join("")}
        </div>
      </section>

      <section class="section muted">
        <div class="section-heading with-action">
          <div>
            <span class="eyebrow">${t("featured")}</span>
            <h2>${t("featuredTitle")}</h2>
          </div>
          <a class="button secondary" href="#/products">${t("viewAll")}</a>
        </div>
        <div class="product-grid">
          ${featured.map(productCard).join("")}
        </div>
      </section>

      <section class="info-band">
        <div>
          <h2>${t("digitalInfoTitle")}</h2>
          <p>${t("digitalInfoBody")}</p>
        </div>
        <div>
          <h2>${t("physicalInfoTitle")}</h2>
          <p>${t("physicalInfoBody")}</p>
        </div>
        <div>
          <h2>${t("licenseInfoTitle")}</h2>
          <p>${t("licenseInfoBody")}</p>
        </div>
      </section>

      <section class="trust-section">
        ${t("trust").map(item => `
          <div>
            <span class="trust-icon" aria-hidden="true"></span>
            <strong>${item}</strong>
          </div>
        `).join("")}
      </section>

      <section class="section faq-preview">
        <div class="section-heading">
          <span class="eyebrow">${t("quickAnswers")}</span>
          <h2>${t("beforeBuy")}</h2>
        </div>
        <details open>
          <summary>${t("q1")}</summary>
          <p>${t("a1")}</p>
        </details>
        <details>
          <summary>${t("q2")}</summary>
          <p>${t("a2")}</p>
        </details>
        <details>
          <summary>${t("q3")}</summary>
          <p>${t("a3")}</p>
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
  const activeCategory = categories.find(category => category.id === active);
  const activeTitle = activeCategory ? categoryText(activeCategory).title : t("allProducts");

  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("catalog")}</span>
        <h1>${activeTitle}</h1>
        <p>${t("catalogBody")}</p>
      </section>
      <section class="catalog-layout">
        <aside class="filters" aria-label="Product categories">
          <a class="${!active ? "active" : ""}" href="#/products">${t("allProducts")}</a>
          ${categories.map(category => `<a class="${active === category.id ? "active" : ""}" href="#/products?category=${category.id}">${categoryText(category).title}</a>`).join("")}
          <a class="${active === "license" ? "active" : ""}" href="#/products?category=license">${t("commercialLicense")}</a>
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
        <p>${t("complianceBody")} <a href="mailto:${supportEmail}">${supportEmail}</a>. ${t("supportReply")}</p>
        <p><strong>${t("business")}:</strong> ${businessName}</p>
        <p><strong>${t("address")}:</strong> ${operatingAddress}</p>
      </section>
    </main>
    ${footer()}
  `;
}

function productDetailPage(id) {
  const product = products.find(item => item.id === id);
  if (!product) return placeholderPage(t("notFound"), t("notFoundBody"));
  const index = products.findIndex(item => item.id === id);
  const text = productText(product);
  return `
    ${nav()}
    <main>
      <section class="detail-layout">
        <div>${renderIllustration(product, index)}</div>
        <div class="detail-copy">
          <span class="pill">${product.type}</span>
          <h1>${text.name}</h1>
          <p class="lead">${text.summary}</p>
          <strong class="detail-price">${money(product.price)}</strong>
          <div class="detail-actions">
            <button class="button primary" data-add-to-cart="${product.id}" type="button">${t("addToCart")}</button>
            <button class="button secondary" data-buy-now="${product.id}" type="button">${t("buyNow")}</button>
          </div>
          <h2>${t("specifications")}</h2>
          <ul>${product.specs.map(spec => `<li>${spec}</li>`).join("")}</ul>
          <h2>${t("delivery")}</h2>
          <p>${product.delivery}</p>
          <h2>${t("refundNote")}</h2>
          <p>${product.refund}</p>
          <h2>${t("licenseNote")}</h2>
          <p>${product.license}</p>
          <h2>${t("productFaq")}</h2>
          <ul>
            <li>${product.type === "Digital STL Pack" ? "Downloads are available after payment confirmation from the order page and email." : "Production or delivery starts after order confirmation and required proof approval when applicable."}</li>
            <li>${product.type === "Commercial License" ? "The license permits physical print resale only within the stated limits." : "Commercial resale rights are not included unless a license is purchased separately."}</li>
          </ul>
        </div>
      </section>
    </main>
    ${footer()}
  `;
}

function cartPage() {
  const lines = cartLines();
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("cart")}</span>
        <h1>${lines.length ? t("cart") : t("emptyCart")}</h1>
        <p>${lines.length ? t("deliveryRefundBeforeCheckout") : t("emptyCartBody")}</p>
      </section>
      <section class="commerce-shell">
        ${lines.length ? `
          <div class="cart-list">
            ${lines.map((line, index) => {
              const text = productText(line.product);
              return `
                <article class="cart-line">
                  <div class="cart-thumb">${renderIllustration(line.product, index)}</div>
                  <div>
                    <span class="pill">${line.product.type}</span>
                    <h2>${text.name}</h2>
                    <p>${text.summary}</p>
                    <p><strong>${t("delivery")}:</strong> ${line.product.delivery}</p>
                    <p><strong>${t("refundNote")}:</strong> ${line.product.refund}</p>
                  </div>
                  <div class="qty-box">
                    <span>${t("quantity")}</span>
                    <button data-cart-qty="${line.product.id}" data-qty="${line.qty - 1}" type="button">-</button>
                    <strong>${line.qty}</strong>
                    <button data-cart-qty="${line.product.id}" data-qty="${line.qty + 1}" type="button">+</button>
                    <button class="text-button" data-cart-qty="${line.product.id}" data-qty="0" type="button">${t("remove")}</button>
                    <b>${money(line.product.price * line.qty)}</b>
                  </div>
                </article>
              `;
            }).join("")}
          </div>
          <aside class="checkout-summary">
            <h2>${t("subtotal")}</h2>
            <strong class="detail-price">${money(cartTotal(lines))}</strong>
            <p>${isDigitalOnly(lines) ? t("notRequiredDigital") : t("shippingNeeded")}</p>
            <a class="button primary" href="#/checkout">${t("checkout")}</a>
            <a class="button secondary" href="#/products">${t("continueShopping")}</a>
          </aside>
        ` : `
          <div class="empty-state">
            <p>${t("emptyCartBody")}</p>
            <a class="button primary" href="#/products">${t("shopProducts")}</a>
          </div>
        `}
      </section>
    </main>
    ${footer()}
  `;
}

function checkoutPage(error = sessionStorage.getItem("atelier-checkout-error") || "") {
  sessionStorage.removeItem("atelier-checkout-error");
  const lines = cartLines();
  if (!lines.length) return cartPage();
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("checkout")}</span>
        <h1>Checkout / Payment</h1>
        <p>${t("paymentPlaceholder")}</p>
      </section>
      <section class="checkout-layout">
        <form class="checkout-form" data-checkout-form>
          ${error ? `<div class="form-error">${error}</div>` : ""}
          <label>${t("customerEmail")}<input name="email" type="email" placeholder="customer@example.com" required /></label>
          ${cartNeedsShipping(lines) ? `<label>${t("shippingAddress")}<textarea name="address" required placeholder="Name, street, city, postal code, country"></textarea></label>` : `<p class="form-note">${t("notRequiredDigital")}</p>`}
          ${cartNeedsCustomNotes(lines) ? `<label>${t("customNotes")}<textarea name="notes" required placeholder="Describe the custom print request, personalization text, or proof requirements."></textarea></label>` : `<label>${t("customNotes")}<textarea name="notes" placeholder="Optional notes for support."></textarea></label>`}
          <div class="policy-confirm">
            <label><input name="terms" type="checkbox" required /> I agree to delivery, refund, digital goods, and license terms.</label>
          </div>
          <button class="button primary" type="submit">${t("placeOrder")}</button>
        </form>
        <aside class="checkout-summary">
          <h2>${t("total")}</h2>
          <strong class="detail-price">${money(cartTotal(lines))}</strong>
          <p>${orderDeliverySummary(lines)}</p>
          ${lines.map(line => `<p><strong>${productText(line.product).name}</strong> × ${line.qty}<br>${line.product.delivery}</p>`).join("")}
        </aside>
      </section>
    </main>
    ${footer()}
  `;
}

function orderCard(order) {
  return `
    <article class="order-card">
      <span class="pill">${order.status}</span>
      <h2>${t("orderNumber")}: ${order.id}</h2>
      <p>${t("total")}: <strong>${money(order.total)}</strong></p>
      <p>${t("delivery")}: ${order.delivery}</p>
      <p>${t("email")}: ${order.email}</p>
      <h3>${t("products")}</h3>
      <ul>${order.items.map(item => {
        const product = products.find(product => product.id === item.id);
        return `<li>${product ? productText(product).name : item.id} × ${item.qty}</li>`;
      }).join("")}</ul>
      <p>${t("successBody")}</p>
      <p>${t("contactUs")}: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
    </article>
  `;
}

function orderLookupPage(result = null, error = sessionStorage.getItem("atelier-lookup-error") || "") {
  sessionStorage.removeItem("atelier-lookup-error");
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("orderLookup")}</span>
        <h1>${t("orderLookup")}</h1>
        <p>${t("lookupHelp")} Demo: AP-DEMO-1001</p>
      </section>
      <section class="policy-shell">
        <form class="lookup-form" data-order-lookup>
          ${error ? `<div class="form-error">${error}</div>` : ""}
          <label>${t("orderNumber")}<input name="orderId" placeholder="AP-DEMO-1001" required /></label>
          <button class="button primary" type="submit">${t("lookupOrder")}</button>
        </form>
        ${result ? orderCard(result) : ""}
      </section>
    </main>
    ${footer()}
  `;
}

function orderSuccessPage() {
  const params = new URLSearchParams(location.hash.split("?")[1] || "");
  const order = findOrder(params.get("order") || sessionStorage.getItem("atelier-last-order") || "");
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("orderSuccess")}</span>
        <h1>${order ? `${t("orderNumber")}: ${order.id}` : t("orderNotFound")}</h1>
        <p>${t("successBody")}</p>
      </section>
      <section class="policy-shell">
        ${order ? orderCard(order) : `<p>${t("orderNotFound")}</p>`}
      </section>
    </main>
    ${footer()}
  `;
}

const policyPages = {
  "/shipping-policy": {
    title: "shippingPolicy",
    sections: [
      ["Made to order", "Physical products are printed after purchase. Most orders require 3-7 business days for production. Larger or personalized prints may require proof approval before production starts."],
      ["Shipping timeline", "Estimated transit time is usually 7-15 business days depending on destination, carrier capacity, customs review, and local delivery conditions."],
      ["Damage or missing items", "If an item arrives damaged, incorrect, or incomplete, contact support with order number and photos within 7 days. We may replace the item, resend missing parts, or issue a refund after review."]
    ]
  },
  "/refund-policy": {
    title: "refundPolicy",
    sections: [
      ["Physical products", "Defective, damaged, wrongly shipped, or materially different physical goods may be replaced or refunded after support review. Made-to-order items are not eligible for no-reason returns once production begins."],
      ["Digital goods", "Downloaded STL, 3MF, PDF, and license files are not refundable after access or download, except when files are corrupted, unavailable, or materially different from the listing."],
      ["Custom prints", "Custom or personalized prints cannot be canceled after proof approval unless the produced item is defective or different from the approved proof."]
    ]
  },
  "/digital-goods-policy": {
    title: "digitalPolicy",
    sections: [
      ["Digital goods delivery", "Digital goods include STL, 3MF, PDF guide, and license certificate files. Access is provided through the order page and email after payment confirmation."],
      ["Download support", "If a download link fails, an archive is corrupted, or a file is missing, contact support and we will resend or correct access."],
      ["Usage restrictions", "Digital files may not be resold, redistributed, uploaded to public platforms, included in file bundles, or shared with third parties without written permission."]
    ]
  },
  "/license-agreement": {
    title: "licenseAgreement",
    sections: [
      ["Personal license", "Digital STL packs include a personal-use license for the purchaser to print for personal use. Digital resale, sharing, and marketplace upload are prohibited."],
      ["Commercial license", "A Commercial License allows one business entity to sell physical prints from eligible files within the stated limits. It does not transfer ownership of source files."],
      ["No sublicensing", "License holders may not sublicense, publish, distribute, or sell the digital files themselves."]
    ]
  },
  "/privacy-policy": {
    title: "privacyPolicy",
    sections: [
      ["Data we collect", "We collect order details, email address, shipping address when required, custom print notes, support messages, and payment status references needed to operate the store."],
      ["How data is used", "Data is used for order fulfillment, digital delivery, support, fraud prevention, compliance, and customer communications."],
      ["Retention and contact", `Customers may contact ${supportEmail} for privacy questions. We do not sell customer personal data.`]
    ]
  },
  "/terms-of-service": {
    title: "terms",
    sections: [
      ["Terms of purchase", "By purchasing, customers agree to provide accurate contact information and accept the delivery, refund, digital goods, and license terms listed for each product."],
      ["Original designs only", "We sell original designs and reject requests that include copyrighted characters, protected logos, celebrity likenesses, or third-party brand assets without permission."],
      ["Payment integration", "The site is prepared for Antom payment integration. Private payment credentials must remain server-side and are not stored in front-end code."]
    ]
  }
};

function policyPage(path) {
  const policy = policyPages[path];
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">Policy</span>
        <h1>${t(policy.title)}</h1>
        <p>${t("supportReply")} ${t("email")}: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
      </section>
      <section class="policy-shell policy-article">
        ${policy.sections.map(([heading, body]) => `
          <section>
            <h2>${heading}</h2>
            <p>${body}</p>
          </section>
        `).join("")}
        <section>
          <h2>${t("business")}</h2>
          <p>${businessName}<br>${operatingAddress}</p>
        </section>
      </section>
    </main>
    ${footer()}
  `;
}

function aboutPage() {
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">Atelier Printworks</span>
        <h1>${t("navAbout")}</h1>
        <p>Atelier Printworks is a small independent 3D design shop focused on original desk utility, home objects, pet keepsakes, STL files, and custom print services.</p>
      </section>
      <section class="info-band">
        <div><h2>Original Designs</h2><p>We avoid infringing IP, character replicas, protected brand marks, and unauthorized fan merchandise.</p></div>
        <div><h2>Physical & Digital</h2><p>Customers can buy made-to-order printed goods, downloadable files, commercial licenses, and reviewed custom services.</p></div>
        <div><h2>Clear Support</h2><p>Support replies within 24-48 hours on business days at ${supportEmail}.</p></div>
      </section>
    </main>
    ${footer()}
  `;
}

function contactPage() {
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("contactUs")}</span>
        <h1>${t("contactUs")}</h1>
        <p>Email <a href="mailto:${supportEmail}">${supportEmail}</a>. Business hours: Monday-Friday, 9:00-18:00 UTC+8. Support replies within 24-48 hours.</p>
      </section>
      <section class="policy-shell">
        <p><strong>${t("business")}:</strong> ${businessName}</p>
        <p><strong>${t("address")}:</strong> ${operatingAddress}</p>
        <p>For order support, include order number, product name, photos if damaged, and the email used at checkout.</p>
      </section>
    </main>
    ${footer()}
  `;
}

function faqPage() {
  const faqs = [
    [t("q1"), t("a1")],
    [t("q2"), t("a2")],
    [t("q3"), t("a3")],
    ["Do you accept custom character or brand requests?", "No. We reject requests involving protected characters, logos, celebrity likenesses, or third-party IP without permission."],
    ["Where are digital files delivered?", "Digital files are available through the order page and email after payment confirmation."]
  ];
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">${t("faq")}</span>
        <h1>${t("faq")}</h1>
      </section>
      <section class="section faq-preview">
        ${faqs.map(([q, a], index) => `<details ${index === 0 ? "open" : ""}><summary>${q}</summary><p>${a}</p></details>`).join("")}
      </section>
    </main>
    ${footer()}
  `;
}

function auditChecklistPage() {
  const checks = [
    ["Pass", "Homepage complete", "Hero, categories, featured products, delivery, trust modules, FAQ, and footer are present."],
    ["Pass", "Products and prices clear", "The catalog includes 12 original products with prices and product types."],
    ["Pass", "Physical, digital, custom, and license rules", "Each product type has delivery, refund, and license notes."],
    ["Pass", "Policies exist", "Shipping, refund, privacy, terms, digital goods, and license pages are present."],
    ["Pass", "Contact available", `Email, response time, business name, and address placeholder are visible.`],
    ["Pass", "Order lookup exists", "Mock order AP-DEMO-1001 and locally generated orders can be queried."],
    ["Warning", "Preview payment only", "Antom is not connected yet. Add server-side Antom API integration before production."],
    ["Pass", "No infringing IP positioning", "The site states original designs only and rejects protected character/logo requests."],
    ["Warning", "Policy translations", "Core UI is multilingual; long policy body copy is currently English-first and should be fully localized before final submission."],
    ["Pass", "Dead links", "All header and footer routes resolve inside the SPA."]
  ];
  return `
    ${nav()}
    <main>
      <section class="page-hero compact">
        <span class="eyebrow">Internal</span>
        <h1>${t("auditChecklist")}</h1>
        <p>Internal Antom readiness review for storefront, checkout, delivery, refund, support, and IP-risk posture.</p>
      </section>
      <section class="policy-shell audit-list">
        ${checks.map(([status, item, note]) => `
          <article class="audit-row ${status.toLowerCase()}">
            <strong>${status}</strong>
            <div><h2>${item}</h2><p>${note}</p><p><em>Fix suggestion:</em> ${status === "Pass" ? "Maintain this requirement during future edits." : "Address before final Antom production submission."}</p></div>
          </article>
        `).join("")}
      </section>
    </main>
    ${footer()}
  `;
}

function route() {
  const raw = location.hash.replace("#", "") || "/";
  const path = raw.split("?")[0];
  const productMatch = path.match(/^\/products\/(.+)$/);
  if (path === "/") return homePage();
  if (path === "/products") return productsPage();
  if (path === "/cart") return cartPage();
  if (path === "/checkout") return checkoutPage();
  if (path === "/order-lookup") return orderLookupPage();
  if (path === "/order-success") return orderSuccessPage();
  if (path === "/audit-checklist") return auditChecklistPage();
  if (path === "/about") return aboutPage();
  if (path === "/contact") return contactPage();
  if (path === "/faq") return faqPage();
  if (policyPages[path]) return policyPage(path);
  if (productMatch) return productDetailPage(productMatch[1]);
  if (routeTranslations[path]) {
    const [titleKey, subtitle] = routeTranslations[path];
    return placeholderPage(t(titleKey), subtitle);
  }
  return placeholderPage(t("pageNotFound"), t("pageNotFoundBody"));
}

function render() {
  app.innerHTML = route();
  document.documentElement.lang = currentLang;
  const languageSelect = document.querySelector(".language-select");
  if (languageSelect) {
    languageSelect.addEventListener("change", event => {
      currentLang = event.target.value;
      localStorage.setItem("atelier-lang", currentLang);
      render();
    });
  }
  app.querySelectorAll("[data-add-to-cart]").forEach(button => {
    button.addEventListener("click", () => addToCart(button.dataset.addToCart));
  });
  app.querySelectorAll("[data-buy-now]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.buyNow);
      location.hash = "#/checkout";
    });
  });
  app.querySelectorAll("[data-cart-qty]").forEach(button => {
    button.addEventListener("click", () => setCartQty(button.dataset.cartQty, Number(button.dataset.qty)));
  });
  const checkoutForm = app.querySelector("[data-checkout-form]");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(checkoutForm));
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");
      if (!emailValid) {
        sessionStorage.setItem("atelier-checkout-error", t("invalidEmail"));
        render();
        return;
      }
      const lines = cartLines();
      if ((cartNeedsShipping(lines) && !data.address) || (cartNeedsCustomNotes(lines) && !data.notes) || !data.terms) {
        sessionStorage.setItem("atelier-checkout-error", t("requiredField"));
        render();
        return;
      }
      createMockOrder(data);
    });
  }
  const lookupForm = app.querySelector("[data-order-lookup]");
  if (lookupForm) {
    lookupForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(lookupForm));
      const order = findOrder(data.orderId || "");
      if (!order) sessionStorage.setItem("atelier-lookup-error", t("orderNotFound"));
      app.innerHTML = orderLookupPage(order, order ? "" : t("orderNotFound"));
      document.documentElement.lang = currentLang;
    });
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", render);
render();
