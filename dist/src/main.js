const app = document.querySelector("#app");
const checkoutCurrency = "HKD";
const usdToHkdRate = 7.8;

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
    price: 96,
    imageIndex: 0,
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
    price: 54,
    imageIndex: 1,
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
    price: 138,
    imageIndex: 2,
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
    price: 174,
    imageIndex: 3,
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
    price: 72,
    imageIndex: 4,
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
    price: 87,
    imageIndex: 5,
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
    price: 267,
    imageIndex: 6,
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
    price: 216,
    imageIndex: 7,
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
    price: 102,
    imageIndex: 8,
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
    price: 59,
    imageIndex: 9,
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
    price: 198,
    imageIndex: 10,
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
    price: 117,
    imageIndex: 11,
    badge: "One design",
    summary: "Commercial permission to sell physical prints from one eligible Atelier Printworks digital product.",
    specs: ["Covers one eligible digital product", "Up to 150 physical units per year", "One business entity"],
    delivery: "License certificate is delivered by email and attached to the order record after purchase.",
    refund: "Non-refundable after certificate delivery unless duplicate payment or order error is confirmed.",
    license: "Allows physical print resale only. Digital files may not be shared, resold, uploaded, or sublicensed."
  },
  {
    id: "observatory-desk-command-center",
    name: "Observatory Desk Command Center",
    type: "Physical Product",
    category: "desk",
    price: 384,
    imageSheet: "premium",
    imageIndex: 0,
    badge: "Premium workspace",
    summary: "A multi-level modular command center with dock, drawers, pen rail, and hidden cable channels.",
    specs: ["Four-module desktop system", "Approx. 32 x 18 x 12 cm assembled", "Matte graphite and ivory finish", "Optional cork feet"],
    delivery: "Made to order due to long print time. Production takes 5-10 business days and shipping normally takes 7-15 business days depending on destination.",
    refund: "Eligible for replacement or refund if damaged, defective, or materially different from the approved listing. Made-to-order production is not eligible for no-reason cancellation after printing begins.",
    license: "Physical product only. STL files and commercial reproduction rights are not included."
  },
  {
    id: "kinetic-orbit-display-toy",
    name: "Kinetic Orbit Display Toy",
    type: "Physical Product",
    category: "home",
    price: 288,
    imageSheet: "premium",
    imageIndex: 1,
    badge: "Mechanical art",
    summary: "An original mechanical desk sculpture with interlocking orbit rings and a display base.",
    specs: ["Original kinetic-inspired design", "Approx. 16 x 16 x 19 cm", "Printed assembly with display base", "Decorative motion model, not a child toy"],
    delivery: "Made to order in 5-9 business days. Shipping usually takes 7-15 business days depending on destination.",
    refund: "Damaged, defective, wrong, or missing parts are covered by support review. No no-reason returns after production begins.",
    license: "Physical decorative item only. No digital design files or resale rights are included."
  },
  {
    id: "custom-architectural-memory-model",
    name: "Custom Architectural Memory Model",
    type: "Custom Print",
    category: "custom",
    price: 567,
    imageSheet: "premium",
    imageIndex: 2,
    badge: "High-detail custom",
    summary: "A bespoke miniature building or room-memory model for original homes, studios, and personal spaces.",
    specs: ["Includes design review", "Proof before production", "One revision round", "Display plinth included"],
    delivery: "Support reviews the brief within 1-2 business days. Modeling and proofing usually takes 5-12 business days before production. Printing takes 4-8 business days after approval.",
    refund: "Refunds depend on project stage. Unstarted work can be canceled; approved custom modeling and printed custom work are not refundable unless defective or materially different from proof.",
    license: "Customer must own or have permission to use submitted reference materials. We do not reproduce protected landmarks, logos, or third-party IP without authorization."
  },
  {
    id: "maker-studio-pro-commercial-license",
    name: "Maker Studio Pro Commercial License",
    type: "Commercial License",
    category: "license",
    price: 747,
    imageSheet: "premium",
    imageIndex: 3,
    badge: "Pro license",
    summary: "A broader small-studio license for eligible STL packs with higher annual physical print limits.",
    specs: ["One business entity", "Up to 2,000 physical units per year", "Covers eligible STL packs purchased by the same account", "Digital file resale prohibited"],
    delivery: "License certificate is delivered by email and recorded on the order page after payment confirmation.",
    refund: "Non-refundable after certificate delivery unless duplicate payment or clear order error is confirmed before use.",
    license: "Allows sale of physical prints from eligible files. Does not allow digital resale, sharing, sublicensing, file upload, or transfer of source files."
  }
];

const footerGroups = [
  {
    title: "Shop",
    links: [
      ["Products", "#/products"],
      ["Custom Print", "#/products?category=custom"],
      ["STL Packs", "#/products?category=stl"],
      ["Membership", "#/membership"],
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

const supportEmail = "whyqwl888@163.com";
const businessName = "MazeCraft Technology Limited (魅智造物科技有限公司)";
const companyRegistration = "Hong Kong Companies Registry No. 80498471; incorporated on 28 May 2026.";
const operatingAddress = "Registered business jurisdiction: Hong Kong. Return/service address is provided by support after order verification.";
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
    navMembership: "Membership",
    navLicense: "Commercial License",
    navAbout: "About",
    navContact: "Contact",
    cart: "Cart",
    originalRender: "Original generated product render for",
    footerLine: "Original files, objects, and print services.",
    email: "Email",
    secureNote: "Secure checkout preview. Private payment credentials are never stored in the browser.",
    copyright: "© 2026 Atelier Printworks. All product concepts are original designs.",
    shop: "Shop",
    support: "Support",
    legal: "Legal",
    products: "Products",
    customPrint: "Custom Print",
    stlPacks: "STL Packs",
    commercialLicense: "Commercial License",
    membership: "Membership",
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
    paymentPlaceholder: "Secure hosted checkout. Your order is created first, then payment is completed on the hosted payment page. Private payment credentials are never stored in this browser.",
    requiredField: "Please complete the required fields.",
    invalidEmail: "Please enter a valid email address.",
    orderNotFound: "Order not found. Check the order number or email support.",
    successBody: "Your order status is shown here after payment confirmation. Digital links, license certificates, and shipping updates will appear on this page when available.",
    downloadAccess: "Download access",
    shippingNeeded: "Shipping required",
    customReview: "Custom review required",
    productFaq: "Product FAQ",
    auditChecklist: "Audit Checklist",
    physicalProduct: "Physical Product",
    digitalStlPack: "Digital STL Pack",
    customPrintType: "Custom Print",
    commercialLicenseType: "Commercial License",
    processingTime: "Processing time",
    deliveryMethod: "Delivery method",
    refundRule: "Refund rule",
    licenseScope: "License scope",
    termsAgreement: "I agree to the delivery, refund, digital goods, and license terms before placing this order.",
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
    navMembership: "会员方案",
    navLicense: "商业授权",
    navAbout: "关于我们",
    navContact: "联系我们",
    cart: "购物车",
    originalRender: "原创生成商品图：",
    footerLine: "原创数字文件、实体小物与打印服务。",
    email: "邮箱",
    secureNote: "安全结账预览。支付私密凭证不会存放在浏览器中。",
    copyright: "© 2026 Atelier Printworks。所有商品概念均为原创设计。",
    shop: "商店",
    support: "支持",
    legal: "法律与政策",
    products: "商品",
    customPrint: "定制打印",
    stlPacks: "STL 文件包",
    commercialLicense: "商业授权",
    membership: "会员方案",
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
    paymentPlaceholder: "安全托管结账。系统会先创建订单，再跳转到托管收银台完成付款；支付私密凭证不会存放在浏览器中。",
    requiredField: "请填写必填信息。",
    invalidEmail: "请输入有效邮箱地址。",
    orderNotFound: "未找到订单，请检查订单号或联系邮箱客服。",
    successBody: "支付确认后可在此查看订单状态。数字下载、授权证书和物流更新会在可用时显示。",
    downloadAccess: "下载访问",
    shippingNeeded: "需要配送",
    customReview: "需要定制审核",
    productFaq: "商品常见问题",
    auditChecklist: "审核清单",
    physicalProduct: "实体商品",
    digitalStlPack: "数字 STL 文件包",
    customPrintType: "定制打印",
    commercialLicenseType: "商业授权",
    processingTime: "处理时间",
    deliveryMethod: "交付方式",
    refundRule: "退款规则",
    licenseScope: "授权范围",
    termsAgreement: "我已在下单前阅读并同意交付、退款、数字商品和授权条款。",
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
    navMembership: "メンバーシップ",
    navLicense: "商用ライセンス",
    navAbout: "会社情報",
    navContact: "お問い合わせ",
    cart: "カート",
    originalRender: "オリジナル生成商品画像:",
    footerLine: "オリジナルファイル、雑貨、プリントサービス。",
    email: "メール",
    secureNote: "安全なチェックアウトのプレビューです。決済用の機密情報はブラウザに保存しません。",
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
  navMembership: "Adhésion",
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
  navMembership: "Membresía",
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

const localizedMembership = {
  en: {
    eyebrow: "Atelier Maker Membership",
    title: "Original STL access, member previews, and priority studio support.",
    body: "A digital membership service for 3D printing hobbyists, small studios, and long-term maker customers. Membership fees cover the listed digital access and service benefits only; they do not create an account balance.",
    primaryCta: "View membership plans",
    secondaryCta: "Digital goods policy",
    visualTitle: "Monthly STL access",
    visualBody: "STL · 3MF · PDF Guide · Member previews",
    plansEyebrow: "Membership Plans",
    plansTitle: "Choose the creator membership that fits your workflow.",
    plansBody: "All three plans are digital content and service benefits. They are not a wallet, stored balance, gift card, or transferable voucher.",
    contactCta: "Contact to activate",
    importantTitle: "Important note",
    importantBody: "Atelier Maker Membership is a digital membership service. It is not a stored-value account, wallet, top-up balance, prepaid card, gift card, cash credit, token, virtual currency, or transferable voucher. Membership benefits cannot be withdrawn, transferred, exchanged for cash, resold, or used as a general payment balance.",
    policy: [
      ["Digital Delivery", "Digital delivery", "Membership benefits are delivered through the customer order page and membership records. STL release packs open during each paid membership month; Studio Annual members receive Premium STL Bundles quarterly."],
      ["Refund Rules", "Refund rules", "If no membership files, previews, discounts, certificates, or service benefits have been accessed or used, you may contact support for cancellation or refund review. Once benefits are accessed or used, the paid membership period is generally not eligible for no-reason refunds."],
      ["Commercial Use", "Commercial use", "Membership STL files are for personal use by default. Selling physical prints made from the files requires a separate Commercial License. Membership discounts do not automatically grant commercial selling rights."]
    ],
    faqEyebrow: "Membership FAQ",
    faqTitle: "Membership questions.",
    faq: [
      ["Is membership a stored balance or points program?", "No. Atelier Maker Membership is not a stored balance, wallet, gift card, points program, token, or top-up account. It only provides the listed digital access and service benefits."],
      ["Can membership benefits be withdrawn or transferred?", "No. Membership benefits cannot be withdrawn, transferred, exchanged for cash, resold, or used as a general payment balance."],
      ["Does membership automatically include commercial selling rights?", "No. To sell physical prints made from STL files, you need to purchase an eligible Commercial License separately."]
    ],
    plans: [
      {
        name: "Maker Monthly",
        period: "/ month",
        audience: "For individual makers who want regular access to original STL releases and member-only previews.",
        benefits: [
          "1 original STL Release Pack per paid month",
          "STL, 3MF, and PDF Guide files where applicable",
          "Member-only previews",
          "10% discount on selected physical products",
          "Priority custom print request review",
          "Priority support within 24-48 business hours"
        ]
      },
      {
        name: "Maker Quarterly",
        period: "/ 3 months",
        audience: "For regular 3D printing customers who prefer a 3-month release cycle and better member savings.",
        benefits: [
          "3 paid membership months",
          "3 original STL Release Packs in total",
          "Member-only previews",
          "15% discount on selected physical products",
          "Priority custom print request review",
          "10% discount on eligible Commercial License purchases",
          "Priority support within 24-48 business hours"
        ]
      },
      {
        name: "Studio Annual",
        period: "/ year",
        badge: "Best for Studios",
        audience: "For small studios, advanced makers, and long-term 3D printing customers who need a full-year content pipeline.",
        benefits: [
          "12 paid membership months",
          "12 monthly original STL Release Packs",
          "4 quarterly Premium STL Bundles",
          "20% discount on selected physical products",
          "Priority custom print request review",
          "2 small custom print design reviews per year",
          "20% discount on eligible Commercial License purchases",
          "PDF membership certificate"
        ]
      }
    ]
  },
  "zh-CN": {
    eyebrow: "Atelier 创作者会员",
    title: "原创 STL 内容、会员预览和工作室优先支持。",
    body: "面向 3D 打印爱好者、小型工作室和长期创作者客户的数字会员服务。会员费用仅对应页面列明的数字访问和服务权益，不产生账户余额。",
    primaryCta: "查看会员方案",
    secondaryCta: "数字商品政策",
    visualTitle: "每月 STL 访问",
    visualBody: "STL · 3MF · PDF 指南 · 会员预览",
    plansEyebrow: "会员方案",
    plansTitle: "选择适合你的创作者会员。",
    plansBody: "三档会员均为数字内容与服务权益，不是钱包、储值余额、礼品卡或可转让代金券。",
    contactCta: "联系开通",
    importantTitle: "重要说明",
    importantBody: "Atelier 创作者会员是一项数字会员服务，不是储值账户、钱包、充值余额、预付卡、礼品卡、现金积分、代币、虚拟币或可转让代金券。会员权益不能提现、转让、兑换现金、转售，也不能作为通用支付余额使用。",
    policy: [
      ["数字交付", "数字交付", "会员权益通过客户订单页和会员记录进行数字交付。STL 发布包会在每个已付费会员月开放；Studio 年度会员会按季度获得 Premium STL Bundle。"],
      ["退款规则", "退款规则", "如果尚未访问或使用任何会员文件、预览内容、折扣、会员证书或服务权益，可联系客服申请取消或退款审核。一旦访问或使用相关权益，该已付费会员周期原则上不支持无理由退款。"],
      ["商业使用", "商业使用", "会员 STL 文件默认仅限个人使用。若要销售由文件打印出的实体商品，需要另行购买商业授权。会员折扣不等于自动获得商业销售权。"]
    ],
    faqEyebrow: "会员常见问题",
    faqTitle: "会员常见问题。",
    faq: [
      ["会员是储值余额或积分吗？", "不是。Atelier 创作者会员不是储值余额、钱包、礼品卡、积分、代币或充值账户。会员仅提供页面列明的数字访问和服务权益。"],
      ["会员权益可以提现吗或转让吗？", "不可以。会员权益不能提现、转让、兑换现金、转售，也不能作为通用支付余额使用。"],
      ["会员是否自动包含商业销售权？", "不包含。若要销售由 STL 文件打印出的实体商品，需要另行购买符合条件的商业授权。"]
    ],
    plans: [
      {
        name: "月度创作者会员",
        period: "/ 月",
        audience: "适合希望定期获取原创 STL 文件和会员新品预览的个人创作者。",
        benefits: [
          "每个已付费月份开放 1 个原创 STL 发布包",
          "按商品说明包含 STL、3MF 和 PDF 指南",
          "会员专属新品预览",
          "指定实体商品 9 折优惠",
          "定制打印需求优先审核",
          "24-48 个工作小时内优先客服支持"
        ]
      },
      {
        name: "季度创作者会员",
        period: "/ 3 个月",
        audience: "适合稳定打印用户，以 3 个月为周期获得原创模型内容和更高会员优惠。",
        benefits: [
          "共 3 个已付费会员月",
          "总计 3 个原创 STL 发布包",
          "会员专属新品预览",
          "指定实体商品 85 折优惠",
          "定制打印需求优先审核",
          "符合条件的商业授权 9 折优惠",
          "24-48 个工作小时内优先客服支持"
        ]
      },
      {
        name: "年度工作室会员",
        period: "/ 年",
        badge: "适合工作室",
        audience: "适合小型工作室、高频创作者和长期 3D 打印客户，约为 4999 元级别年度会员。",
        benefits: [
          "共 12 个已付费会员月",
          "12 个每月原创 STL 发布包",
          "4 个季度 Premium STL Bundle",
          "指定实体商品 8 折优惠",
          "定制打印需求优先审核",
          "每年 2 次小型定制打印设计评审",
          "符合条件的商业授权 8 折优惠",
          "PDF 会员证明"
        ]
      }
    ]
  },
  "ja-JP": {
    eyebrow: "Atelier Maker Membership",
    title: "オリジナルSTL、会員向けプレビュー、優先スタジオサポート。",
    body: "3Dプリント愛好家、小規模スタジオ、長期のメイカー顧客向けのデジタル会員サービスです。会費は記載されたデジタルアクセスとサービス特典にのみ対応し、アカウント残高は発生しません。",
    primaryCta: "会員プランを見る",
    secondaryCta: "デジタル商品ポリシー",
    visualTitle: "月次STLアクセス",
    visualBody: "STL · 3MF · PDFガイド · 会員プレビュー",
    plansEyebrow: "会員プラン",
    plansTitle: "制作スタイルに合う会員プランを選択。",
    plansBody: "3つのプランはいずれもデジタルコンテンツとサービス特典です。ウォレット、残高、ギフトカード、譲渡可能なクーポンではありません。",
    contactCta: "申し込み相談",
    importantTitle: "重要事項",
    importantBody: "Atelier Maker Membershipはデジタル会員サービスです。保存残高、ウォレット、チャージ残高、プリペイドカード、ギフトカード、現金クレジット、トークン、仮想通貨、譲渡可能なクーポンではありません。会員特典は出金、譲渡、換金、再販売、一般的な支払い残高としての使用はできません。",
    policy: [
      ["デジタル納品", "デジタル納品", "会員特典は注文ページと会員記録を通じて提供されます。STLリリースパックは各有料会員月に開放され、Studio Annual会員には四半期ごとにPremium STL Bundleが提供されます。"],
      ["返金ルール", "返金ルール", "会員ファイル、プレビュー、割引、証明書、サービス特典をまだ利用していない場合、キャンセルまたは返金審査をサポートへ依頼できます。利用後の有料会員期間は、原則として自己都合返金の対象外です。"],
      ["商用利用", "商用利用", "会員STLファイルは初期状態では個人利用限定です。ファイルから印刷した物理商品を販売するには、別途商用ライセンスが必要です。会員割引は商用販売権を自動的に付与するものではありません。"]
    ],
    faqEyebrow: "会員FAQ",
    faqTitle: "会員に関する質問。",
    faq: [
      ["会員は保存残高やポイント制度ですか？", "いいえ。Atelier Maker Membershipは保存残高、ウォレット、ギフトカード、ポイント、トークン、チャージアカウントではありません。記載されたデジタルアクセスとサービス特典のみを提供します。"],
      ["会員特典は出金または譲渡できますか？", "できません。会員特典は出金、譲渡、換金、再販売、一般的な支払い残高としての使用はできません。"],
      ["会員には商用販売権が自動で含まれますか？", "含まれません。STLファイルから印刷した物理商品を販売するには、対象となる商用ライセンスを別途購入する必要があります。"]
    ],
    plans: [
      {
        name: "Maker Monthly",
        period: "/ 月",
        audience: "オリジナルSTLリリースと会員限定プレビューを定期的に利用したい個人メイカー向け。",
        benefits: [
          "有料月ごとにオリジナルSTLリリースパック1点",
          "対象商品にSTL、3MF、PDFガイドを同梱",
          "会員限定プレビュー",
          "対象物理商品の10%割引",
          "カスタムプリント依頼の優先レビュー",
          "24-48営業時間以内の優先サポート"
        ]
      },
      {
        name: "Maker Quarterly",
        period: "/ 3か月",
        audience: "3か月単位でモデルコンテンツと会員割引を利用したい継続的な3Dプリント顧客向け。",
        benefits: [
          "3か月分の有料会員期間",
          "合計3点のオリジナルSTLリリースパック",
          "会員限定プレビュー",
          "対象物理商品の15%割引",
          "カスタムプリント依頼の優先レビュー",
          "対象商用ライセンスの10%割引",
          "24-48営業時間以内の優先サポート"
        ]
      },
      {
        name: "Studio Annual",
        period: "/ 年",
        badge: "スタジオ向け",
        audience: "年間のコンテンツ計画が必要な小規模スタジオ、上級メイカー、長期顧客向け。",
        benefits: [
          "12か月分の有料会員期間",
          "毎月12点のオリジナルSTLリリースパック",
          "四半期ごとに4点のPremium STL Bundle",
          "対象物理商品の20%割引",
          "カスタムプリント依頼の優先レビュー",
          "年2回の小型カスタムプリント設計レビュー",
          "対象商用ライセンスの20%割引",
          "PDF会員証明書"
        ]
      }
    ]
  },
  "fr-FR": {
    eyebrow: "Adhésion Atelier Maker",
    title: "Accès STL original, aperçus membres et support studio prioritaire.",
    body: "Une adhésion numérique pour passionnés d'impression 3D, petits studios et clients créateurs réguliers. Les frais couvrent uniquement les accès numériques et services listés; ils ne créent aucun solde de compte.",
    primaryCta: "Voir les formules",
    secondaryCta: "Politique des biens numériques",
    visualTitle: "Accès STL mensuel",
    visualBody: "STL · 3MF · Guide PDF · Aperçus membres",
    plansEyebrow: "Formules d'adhésion",
    plansTitle: "Choisissez l'adhésion adaptée à votre rythme de création.",
    plansBody: "Les trois formules sont des contenus numériques et services. Elles ne sont pas un portefeuille, un solde stocké, une carte cadeau ni un bon transférable.",
    contactCta: "Demander l'activation",
    importantTitle: "Note importante",
    importantBody: "L'adhésion Atelier Maker est un service numérique. Ce n'est pas un compte à valeur stockée, un portefeuille, un solde rechargeable, une carte prépayée, une carte cadeau, un crédit en espèces, un jeton, une monnaie virtuelle ou un bon transférable. Les avantages ne peuvent pas être retirés, transférés, échangés contre de l'argent, revendus ou utilisés comme solde de paiement général.",
    policy: [
      ["Livraison numérique", "Livraison numérique", "Les avantages sont livrés via la page de commande client et les registres d'adhésion. Les packs STL sont ouverts pendant chaque mois payé; les membres Studio Annual reçoivent des Premium STL Bundles chaque trimestre."],
      ["Règles de remboursement", "Règles de remboursement", "Si aucun fichier, aperçu, remise, certificat ou service membre n'a été consulté ou utilisé, vous pouvez contacter le support pour une demande d'annulation ou de remboursement. Après utilisation, la période payée n'est généralement pas remboursable sans motif."],
      ["Usage commercial", "Usage commercial", "Les fichiers STL de l'adhésion sont destinés à un usage personnel par défaut. La vente d'impressions physiques issues de ces fichiers nécessite une licence commerciale séparée. Les remises membres n'accordent pas automatiquement de droits de vente commerciale."]
    ],
    faqEyebrow: "FAQ adhésion",
    faqTitle: "Questions sur l'adhésion.",
    faq: [
      ["L'adhésion est-elle un solde stocké ou un programme de points ?", "Non. L'adhésion Atelier Maker n'est pas un solde stocké, un portefeuille, une carte cadeau, un programme de points, un jeton ou un compte rechargeable. Elle fournit uniquement les accès numériques et services listés."],
      ["Les avantages peuvent-ils être retirés ou transférés ?", "Non. Les avantages ne peuvent pas être retirés, transférés, échangés contre de l'argent, revendus ou utilisés comme solde de paiement général."],
      ["L'adhésion inclut-elle automatiquement des droits de vente commerciale ?", "Non. Pour vendre des impressions physiques issues des fichiers STL, vous devez acheter séparément une licence commerciale éligible."]
    ],
    plans: [
      {
        name: "Maker Monthly",
        period: "/ mois",
        audience: "Pour les créateurs individuels qui veulent accéder régulièrement aux sorties STL originales et aux aperçus réservés aux membres.",
        benefits: [
          "1 pack STL original par mois payé",
          "Fichiers STL, 3MF et guide PDF lorsque disponibles",
          "Aperçus réservés aux membres",
          "10% de remise sur certains produits physiques",
          "Revue prioritaire des demandes d'impression sur mesure",
          "Support prioritaire sous 24-48 heures ouvrées"
        ]
      },
      {
        name: "Maker Quarterly",
        period: "/ 3 mois",
        audience: "Pour les clients réguliers d'impression 3D qui préfèrent un cycle de 3 mois et de meilleures économies membres.",
        benefits: [
          "3 mois d'adhésion payés",
          "3 packs STL originaux au total",
          "Aperçus réservés aux membres",
          "15% de remise sur certains produits physiques",
          "Revue prioritaire des demandes d'impression sur mesure",
          "10% de remise sur les licences commerciales éligibles",
          "Support prioritaire sous 24-48 heures ouvrées"
        ]
      },
      {
        name: "Studio Annual",
        period: "/ an",
        badge: "Idéal studios",
        audience: "Pour petits studios, créateurs avancés et clients 3D réguliers qui ont besoin d'un flux de contenu annuel.",
        benefits: [
          "12 mois d'adhésion payés",
          "12 packs STL originaux mensuels",
          "4 Premium STL Bundles trimestriels",
          "20% de remise sur certains produits physiques",
          "Revue prioritaire des demandes d'impression sur mesure",
          "2 revues de conception de petites impressions sur mesure par an",
          "20% de remise sur les licences commerciales éligibles",
          "Certificat d'adhésion PDF"
        ]
      }
    ]
  },
  "es-ES": {
    eyebrow: "Membresía Atelier Maker",
    title: "Acceso a STL originales, vistas previas para miembros y soporte prioritario.",
    body: "Una membresía digital para aficionados a la impresión 3D, pequeños estudios y clientes creadores recurrentes. La cuota cubre solo el acceso digital y los servicios indicados; no crea saldo de cuenta.",
    primaryCta: "Ver planes",
    secondaryCta: "Política de bienes digitales",
    visualTitle: "Acceso mensual a STL",
    visualBody: "STL · 3MF · Guía PDF · Vistas previas",
    plansEyebrow: "Planes de membresía",
    plansTitle: "Elige la membresía que encaja con tu flujo creativo.",
    plansBody: "Los tres planes son contenido digital y servicios. No son una cartera, saldo almacenado, tarjeta regalo ni cupón transferible.",
    contactCta: "Contactar para activar",
    importantTitle: "Nota importante",
    importantBody: "La Membresía Atelier Maker es un servicio digital. No es una cuenta de valor almacenado, cartera, saldo recargable, tarjeta prepago, tarjeta regalo, crédito en efectivo, token, moneda virtual ni cupón transferible. Los beneficios no se pueden retirar, transferir, cambiar por efectivo, revender ni usar como saldo general de pago.",
    policy: [
      ["Entrega digital", "Entrega digital", "Los beneficios se entregan mediante la página de pedido y los registros de membresía. Los packs STL se abren durante cada mes pagado; los miembros Studio Annual reciben Premium STL Bundles cada trimestre."],
      ["Reglas de reembolso", "Reglas de reembolso", "Si no se ha accedido ni usado ningún archivo, vista previa, descuento, certificado o servicio de membresía, puedes contactar con soporte para revisar cancelación o reembolso. Una vez usados los beneficios, el periodo pagado normalmente no admite reembolso sin motivo."],
      ["Uso comercial", "Uso comercial", "Los archivos STL de membresía son para uso personal por defecto. Vender impresiones físicas hechas con esos archivos requiere una Licencia Comercial separada. Los descuentos de membresía no conceden automáticamente derechos de venta comercial."]
    ],
    faqEyebrow: "FAQ de membresía",
    faqTitle: "Preguntas sobre membresía.",
    faq: [
      ["¿La membresía es saldo almacenado o puntos?", "No. La Membresía Atelier Maker no es saldo almacenado, cartera, tarjeta regalo, programa de puntos, token ni cuenta recargable. Solo proporciona el acceso digital y los servicios indicados."],
      ["¿Los beneficios se pueden retirar o transferir?", "No. Los beneficios no se pueden retirar, transferir, cambiar por efectivo, revender ni usar como saldo general de pago."],
      ["¿La membresía incluye automáticamente derechos comerciales?", "No. Para vender impresiones físicas hechas con archivos STL, debes comprar por separado una Licencia Comercial elegible."]
    ],
    plans: [
      {
        name: "Maker Monthly",
        period: "/ mes",
        audience: "Para creadores individuales que quieren acceso regular a lanzamientos STL originales y vistas previas exclusivas.",
        benefits: [
          "1 pack STL original por cada mes pagado",
          "Archivos STL, 3MF y guía PDF cuando corresponda",
          "Vistas previas exclusivas para miembros",
          "10% de descuento en productos físicos seleccionados",
          "Revisión prioritaria de solicitudes de impresión personalizada",
          "Soporte prioritario en 24-48 horas hábiles"
        ]
      },
      {
        name: "Maker Quarterly",
        period: "/ 3 meses",
        audience: "Para clientes habituales de impresión 3D que prefieren un ciclo de 3 meses y mejores ahorros.",
        benefits: [
          "3 meses de membresía pagados",
          "3 packs STL originales en total",
          "Vistas previas exclusivas para miembros",
          "15% de descuento en productos físicos seleccionados",
          "Revisión prioritaria de solicitudes de impresión personalizada",
          "10% de descuento en Licencias Comerciales elegibles",
          "Soporte prioritario en 24-48 horas hábiles"
        ]
      },
      {
        name: "Studio Annual",
        period: "/ año",
        badge: "Ideal estudios",
        audience: "Para pequeños estudios, creadores avanzados y clientes de impresión 3D de largo plazo que necesitan un flujo anual de contenido.",
        benefits: [
          "12 meses de membresía pagados",
          "12 packs STL originales mensuales",
          "4 Premium STL Bundles trimestrales",
          "20% de descuento en productos físicos seleccionados",
          "Revisión prioritaria de solicitudes de impresión personalizada",
          "2 revisiones pequeñas de diseño personalizado al año",
          "20% de descuento en Licencias Comerciales elegibles",
          "Certificado de membresía en PDF"
        ]
      }
    ]
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
    "single-product-commercial-license": ["单品商业授权", "允许销售一个符合条件数字商品打印出的实体成品。"],
    "observatory-desk-command-center": ["Observatory 桌面指挥中心", "多层模块化桌面系统，集停靠座、抽屉、笔架和隐藏线槽于一体。"],
    "kinetic-orbit-display-toy": ["Kinetic Orbit 机械摆件", "原创机械风桌面动态雕塑，带交错轨道环和展示底座。"],
    "custom-architectural-memory-model": ["定制建筑记忆模型", "为原创住宅、工作室或私人空间制作的高细节微缩建筑模型。"],
    "maker-studio-pro-commercial-license": ["Maker Studio Pro 商业授权", "面向小型工作室的更高额度实体打印销售授权。"]
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
    "single-product-commercial-license": ["単品商用ライセンス", "対象デジタル商品1点から印刷した物理商品の販売許可。"],
    "observatory-desk-command-center": ["Observatoryデスクコマンドセンター", "ドック、引き出し、ペンレール、隠しケーブル溝を備えた多層デスクシステム。"],
    "kinetic-orbit-display-toy": ["Kinetic Orbitディスプレイトイ", "交差するリングと展示台を備えたオリジナル機械風デスクスカルプチャー。"],
    "custom-architectural-memory-model": ["カスタム建築メモリーモデル", "住宅、スタジオ、個人空間のための高精細ミニチュア建築モデル。"],
    "maker-studio-pro-commercial-license": ["Maker Studio Pro商用ライセンス", "小規模スタジオ向けの高上限フィジカル販売ライセンス。"]
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
    "single-product-commercial-license": ["Licence commerciale mono-produit", "Autorisation de vendre des impressions physiques d'un produit numérique éligible."],
    "observatory-desk-command-center": ["Centre de bureau Observatory", "Système de bureau modulaire à plusieurs niveaux avec dock, tiroirs, rail à stylos et passages de câbles."],
    "kinetic-orbit-display-toy": ["Sculpture Kinetic Orbit", "Sculpture de bureau mécanique originale avec anneaux orbitaux et socle de présentation."],
    "custom-architectural-memory-model": ["Modèle architectural souvenir", "Miniature architecturale personnalisée pour maisons, studios et espaces personnels originaux."],
    "maker-studio-pro-commercial-license": ["Licence commerciale Maker Studio Pro", "Licence de petit studio avec limites annuelles plus élevées pour impressions physiques éligibles."]
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
    "single-product-commercial-license": ["Licencia comercial de producto único", "Permiso para vender impresiones físicas de un producto digital elegible."],
    "observatory-desk-command-center": ["Centro de escritorio Observatory", "Sistema modular multinivel con base, cajones, riel para bolígrafos y canales ocultos para cables."],
    "kinetic-orbit-display-toy": ["Escultura Kinetic Orbit", "Escultura mecánica original de escritorio con anillos orbitales y base de exhibición."],
    "custom-architectural-memory-model": ["Modelo arquitectónico personalizado", "Miniatura arquitectónica a medida para hogares, estudios y espacios personales originales."],
    "maker-studio-pro-commercial-license": ["Licencia comercial Maker Studio Pro", "Licencia de estudio con límites anuales más altos para impresiones físicas elegibles."]
  }
};

const routeTranslations = {
  "/cart": ["cart", "Your cart will show physical products, digital packs, and licenses with delivery notes before checkout."],
  "/checkout": ["Checkout / Payment", "Payment is simulated in this preview without exposing private credentials in front-end code."],
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

function productTypeLabel(type) {
  const keys = {
    "Physical Product": "physicalProduct",
    "Digital STL Pack": "digitalStlPack",
    "Custom Print": "customPrintType",
    "Commercial License": "commercialLicenseType"
  };
  return t(keys[type] || type);
}

function processingTime(product) {
  if (product.type === "Digital STL Pack") return "Instant after payment confirmation";
  if (product.type === "Commercial License") return "Certificate delivered after payment confirmation";
  if (product.type === "Custom Print") return "1-2 business day review, then 3-7 business day production";
  return "3-7 business days production";
}

function deliveryMethod(product) {
  if (product.type === "Digital STL Pack") return "Order page and email download";
  if (product.type === "Commercial License") return "Email certificate and order page record";
  if (product.type === "Custom Print") return "Proof review, made-to-order production, tracked shipping where available";
  return "Made-to-order production and worldwide shipping";
}

function labelFromFooter(label) {
  const keys = {
    Products: "products",
    "Custom Print": "customPrint",
    "STL Packs": "stlPacks",
    Membership: "membership",
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
  const cartVersion = "2026-06-22-premium-products";
  if (localStorage.getItem("atelier-cart-version") !== cartVersion) {
    localStorage.removeItem("atelier-cart");
    localStorage.setItem("atelier-cart-version", cartVersion);
  }
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

function getServerOrdersCache() {
  try {
    return JSON.parse(localStorage.getItem("atelier-server-orders-cache") || "[]");
  } catch {
    return [];
  }
}

function saveServerOrderCache(order) {
  if (!order?.id) return;
  const orders = [order, ...getServerOrdersCache().filter(item => item.id !== order.id)];
  localStorage.setItem("atelier-server-orders-cache", JSON.stringify(orders.slice(0, 100)));
}

function saveServerOrdersCache(orders = []) {
  const merged = [...orders, ...getServerOrdersCache()];
  const unique = merged.filter((order, index, list) => order?.id && list.findIndex(item => item.id === order.id) === index);
  localStorage.setItem("atelier-server-orders-cache", JSON.stringify(unique.slice(0, 100)));
}

async function apiJson(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body;
}

function checkoutOrderPayload(form) {
  const lines = cartLines();
  return {
    email: form.email,
    address: form.address || "",
    notes: form.notes || "",
    currency: checkoutCurrency,
    total: cartTotal(lines),
    delivery: orderDeliverySummary(lines),
    checkoutLanguage: currentLang,
    items: lines.map(line => ({
      id: line.product.id,
      name: productText(line.product).name,
      type: line.product.type,
      qty: line.qty,
      price: checkoutPrice(line.product.price)
    }))
  };
}

async function createServerOrder(form) {
  const body = await apiJson("/.netlify/functions/orders-create", {
    method: "POST",
    body: JSON.stringify(checkoutOrderPayload(form))
  });
  saveServerOrderCache(body.order);
  return body.order;
}

async function createHostedPaymentSession(order) {
  return apiJson("/.netlify/functions/payment-session", {
    method: "POST",
    body: JSON.stringify({ orderId: order.id, orderSnapshot: order })
  });
}

async function fetchServerOrder(orderId) {
  const body = await apiJson(`/.netlify/functions/orders-get?orderId=${encodeURIComponent(orderId)}`);
  saveServerOrderCache(body.order);
  return body.order;
}

async function fetchAdminOrders() {
  const body = await apiJson("/.netlify/functions/orders-get");
  saveServerOrdersCache(body.orders || []);
  return body.orders || [];
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
  return lines.reduce((sum, item) => sum + checkoutPrice(item.product.price) * item.qty, 0);
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
    currency: checkoutCurrency,
    items: lines.map(line => ({ id: line.product.id, qty: line.qty, price: checkoutPrice(line.product.price) })),
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
    createdAt: "2026-06-24T04:16:00.000Z",
    address: "1-12-4 Jingumae, Shibuya-ku, Tokyo 150-0001, Japan",
    notes: "客户要求使用日文物流通知，并在面单上保留罗马字地址。",
    total: 131,
    delivery: "下载访问 · 授权协议",
    status: "数字文件可用",
    items: [
      { id: "urban-nook-stl-pack", qty: 1, price: 72 },
      { id: "desk-setup-stl-pack", qty: 1, price: 59 }
    ]
  },
  {
    id: "AP-DEMO-1002",
    email: "studio-buyer@example.fr",
    createdAt: "2026-06-25T09:42:00.000Z",
    address: "14 Rue des Petits Champs, 75002 Paris, France",
    notes: "高客单价实体桌面商品，快递面单应使用法语地址格式。",
    total: 384,
    delivery: "需要配送",
    status: "生产审核",
    items: [
      { id: "observatory-desk-command-center", qty: 1, price: 384 }
    ]
  },
  {
    id: "AP-DEMO-1003",
    email: "maker-team@example.es",
    createdAt: "2026-06-26T11:08:00.000Z",
    address: "Carrer de Mallorca 214, 08008 Barcelona, Spain",
    notes: "商业授权订单，证书发放前需要人工复核。",
    total: 747,
    delivery: "授权协议",
    status: "风控复核",
    items: [
      { id: "maker-studio-pro-commercial-license", qty: 1, price: 747 }
    ]
  }
];

function findOrder(orderId) {
  const normalized = orderId.trim().toUpperCase();
  return [...getServerOrdersCache(), ...getOrders(), ...mockOrders].find(order => order.id.toUpperCase() === normalized);
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function adminStoredEdits() {
  try {
    return JSON.parse(localStorage.getItem("atelier-admin-order-edits") || "{}");
  } catch {
    return {};
  }
}

function saveAdminStoredEdits(edits) {
  localStorage.setItem("atelier-admin-order-edits", JSON.stringify(edits));
}

function adminAuditLog() {
  try {
    return JSON.parse(localStorage.getItem("atelier-admin-audit-log") || "[]");
  } catch {
    return [];
  }
}

function saveAdminAuditLog(logs) {
  localStorage.setItem("atelier-admin-audit-log", JSON.stringify(logs.slice(0, 200)));
}

function adminAllOrders() {
  const merged = [...getServerOrdersCache(), ...getOrders(), ...mockOrders];
  return merged
    .filter((order, index, list) => list.findIndex(item => item.id === order.id) === index)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function orderProducts(order) {
  return (order.items || []).map(item => ({
    ...item,
    product: products.find(product => product.id === item.id)
  }));
}

function orderTypes(order) {
  return [...new Set(orderProducts(order).map(item => item.product?.type || "Unknown"))];
}

function defaultOperationalFields(order) {
  const demoDefaults = {
    "AP-DEMO-1001": {
      customerName: "Mina Hart",
      customerEmail: order.email,
      preferredLanguage: "ja-JP",
      phone: "+81 90 0000 1001",
      country: "Japan",
      region: "Tokyo",
      city: "Shibuya-ku",
      postalCode: "150-0001",
      addressLocal: "〒150-0001 東京都渋谷区神宮前1-12-4",
      addressEnglish: "1-12-4 Jingumae, Shibuya-ku, Tokyo 150-0001, Japan",
      carrier: "数字交付",
      trackingNumber: "",
      trackingUrl: "",
      fulfillmentStatus: "数字文件已开放访问",
      deliveryNotes: "客户偏好日文通知。数字文件可通过订单查询页访问。",
      supportNotes: "暂无客服问题。",
      riskDecision: "已通过"
    },
    "AP-DEMO-1002": {
      customerName: "Luc Martin",
      customerEmail: order.email,
      preferredLanguage: "fr-FR",
      phone: "+33 6 00 00 10 02",
      country: "France",
      region: "Ile-de-France",
      city: "Paris",
      postalCode: "75002",
      addressLocal: "14 Rue des Petits Champs, 75002 Paris, France",
      addressEnglish: "14 Rue des Petits Champs, 75002 Paris, France",
      carrier: "La Poste / Colissimo",
      trackingNumber: "COL-DEMO-1002",
      trackingUrl: "https://www.laposte.fr/outils/suivre-vos-envois",
      fulfillmentStatus: "按订单制作 - 已进入生产排队",
      deliveryNotes: "使用法语快递面单；如客户回复公寓/公司信息，需要补充到面单地址。",
      supportNotes: "发货前应上传生产照片和包装照片。",
      riskDecision: "已通过"
    },
    "AP-DEMO-1003": {
      customerName: "Maker Team SL",
      customerEmail: order.email,
      preferredLanguage: "es-ES",
      phone: "+34 600 000 103",
      country: "Spain",
      region: "Catalonia",
      city: "Barcelona",
      postalCode: "08008",
      addressLocal: "Carrer de Mallorca 214, 08008 Barcelona, Espana",
      addressEnglish: "Carrer de Mallorca 214, 08008 Barcelona, Spain",
      carrier: "授权证书邮件",
      trackingNumber: "",
      trackingUrl: "",
      fulfillmentStatus: "商业授权人工复核",
      deliveryNotes: "发送商业授权证书前，需要确认购买方经营主体名称。",
      supportNotes: "高金额授权订单，保留审核备注用于后续证据包。",
      riskDecision: "人工复核"
    }
  };

  return demoDefaults[order.id] || {
    customerName: "",
    customerEmail: order.email || "",
    preferredLanguage: currentLang,
    phone: "",
    country: "",
    region: "",
    city: "",
    postalCode: "",
    addressLocal: order.address || "",
    addressEnglish: order.address || "",
    carrier: "",
    trackingNumber: "",
    trackingUrl: "",
    fulfillmentStatus: order.status || "新订单",
    deliveryNotes: order.delivery || "",
    supportNotes: order.notes || "",
    riskDecision: "待审核"
  };
}

function adminOrderState(order) {
  const edit = adminStoredEdits()[order.id] || {};
  return {
    ...defaultOperationalFields(order),
    ...(edit.operational || {}),
    updatedAt: edit.updatedAt || "",
    updatedBy: edit.updatedBy || ""
  };
}

function adminOrderRisk(order, operational = adminOrderState(order)) {
  const types = orderTypes(order);
  const logs = adminAuditLog().filter(log => log.orderId === order.id);
  const risks = [];
  if ((order.total || 0) >= 500) risks.push(["High", "高金额订单"]);
  if (types.includes("Commercial License")) risks.push(["Medium", "商业授权订单需要核验经营主体"]);
  if (types.includes("Digital STL Pack") && /refund|退款/i.test(operational.supportNotes || "")) risks.push(["High", "数字商品交付后出现退款诉求"]);
  if (logs.some(log => /country|address|customerEmail|phone/i.test((log.fields || []).join(",")))) risks.push(["Medium", "客户或物流敏感字段被编辑"]);
  if (!operational.customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(operational.customerEmail)) risks.push(["High", "运营邮箱缺失或格式无效"]);
  if (!risks.length) risks.push(["Low", "未命中主要风险规则"]);
  return risks;
}

function adminRiskLevelLabel(level) {
  return { High: "高风险", Medium: "中风险", Low: "低风险" }[level] || level;
}

function adminProductTypeLabel(type) {
  return {
    "Physical Product": "实体商品",
    "Digital STL Pack": "数字 STL 文件包",
    "Custom Print": "定制打印",
    "Commercial License": "商业授权",
    Unknown: "未知类型"
  }[type] || type;
}

function adminDigitalDelivery(order) {
  return orderProducts(order)
    .filter(item => ["Digital STL Pack", "Commercial License"].includes(item.product?.type))
    .map((item, index) => ({
      name: item.product?.name || item.id,
      format: item.product?.type === "Commercial License" ? "PDF 授权证书" : "STL, 3MF, PDF 指南",
      status: order.status || "待处理",
      firstAccess: order.id === "AP-DEMO-1001" ? "2026-06-24 04:22 UTC" : "待开放",
      firstDownload: order.id === "AP-DEMO-1001" ? "2026-06-24 04:24 UTC" : "未下载",
      downloads: order.id === "AP-DEMO-1001" ? index + 1 : 0,
      downloadIp: order.id === "AP-DEMO-1001" ? "203.0.113.42" : "未记录"
    }));
}

function adminFulfillmentEvidence(order, operational = adminOrderState(order)) {
  const physical = orderTypes(order).some(type => ["Physical Product", "Custom Print"].includes(type));
  return {
    productionStatus: physical ? operational.fulfillmentStatus : "无需实体配送",
    carrier: operational.carrier || "未分配",
    trackingNumber: operational.trackingNumber || "未分配",
    trackingUrl: operational.trackingUrl || "",
    carrierAddress: operational.addressLocal || operational.addressEnglish || "未设置",
    labelLanguage: operational.preferredLanguage || "en",
    photos: physical ? "发货前应附加生产照片和包装照片。" : "不适用"
  };
}

function adminFulfillmentLabel(key) {
  return {
    productionStatus: "生产/履约状态",
    carrier: "物流商/交付渠道",
    trackingNumber: "物流单号",
    trackingUrl: "物流查询链接",
    carrierAddress: "面单地址",
    labelLanguage: "面单/通知语言",
    photos: "照片证据"
  }[key] || key;
}

function saveAdminOrderEdit(orderId, formData) {
  const order = findOrder(orderId);
  if (!order) return;
  const previous = adminOrderState(order);
  const operational = {
    customerName: formData.customerName || "",
    customerEmail: formData.customerEmail || "",
    preferredLanguage: formData.preferredLanguage || "en",
    phone: formData.phone || "",
    country: formData.country || "",
    region: formData.region || "",
    city: formData.city || "",
    postalCode: formData.postalCode || "",
    addressLocal: formData.addressLocal || "",
    addressEnglish: formData.addressEnglish || "",
    carrier: formData.carrier || "",
    trackingNumber: formData.trackingNumber || "",
    trackingUrl: formData.trackingUrl || "",
    fulfillmentStatus: formData.fulfillmentStatus || "",
    deliveryNotes: formData.deliveryNotes || "",
    supportNotes: formData.supportNotes || "",
    riskDecision: formData.riskDecision || "Pending review"
  };
  const changedFields = Object.keys(operational).filter(key => String(previous[key] || "") !== String(operational[key] || ""));
  const edits = adminStoredEdits();
  edits[orderId] = {
    operational,
    updatedAt: new Date().toISOString(),
    updatedBy: "本地后台预览管理员"
  };
  saveAdminStoredEdits(edits);

  if (changedFields.length) {
    const logs = adminAuditLog();
    logs.unshift({
      id: `LOG-${Date.now()}`,
      orderId,
      at: new Date().toISOString(),
      by: "本地后台预览管理员",
      reason: formData.editReason || "运营字段修正",
      fields: changedFields,
      before: Object.fromEntries(changedFields.map(key => [key, previous[key] || ""])),
      after: Object.fromEntries(changedFields.map(key => [key, operational[key] || ""]))
    });
    saveAdminAuditLog(logs);
  }
}

function adminEvidencePackage(orderId) {
  const order = findOrder(orderId);
  if (!order) return null;
  const operational = adminOrderState(order);
  return {
    generatedAt: new Date().toISOString(),
    business: {
      storefront: "Atelier Printworks",
      legalEntity: businessName,
      registration: companyRegistration,
      supportEmail
    },
    order: {
      id: order.id,
      createdAt: order.createdAt || "",
      originalEmail: order.email,
      originalAddress: order.address || "",
      originalNotes: order.notes || "",
      total: order.total,
      status: order.status,
      delivery: order.delivery,
      items: orderProducts(order).map(item => ({
        id: item.id,
        name: item.product?.name || item.id,
        type: item.product?.type || "Unknown",
        qty: item.qty,
        price: item.price,
        snapshot: item.product ? {
          summary: item.product.summary,
          delivery: item.product.delivery,
          refund: item.product.refund,
          license: item.product.license
        } : {}
      }))
    },
    operational,
    risk: adminOrderRisk(order, operational),
    digitalDelivery: adminDigitalDelivery(order),
    fulfillment: adminFulfillmentEvidence(order, operational),
    auditLog: adminAuditLog().filter(log => log.orderId === order.id),
    policySnapshot: {
      refund: policyPages["/refund-policy"].sections,
      digitalGoods: policyPages["/digital-goods-policy"].sections,
      terms: policyPages["/terms-of-service"].sections
    }
  };
}

function downloadAdminEvidence(orderId) {
  const evidence = adminEvidencePackage(orderId);
  if (!evidence) return;
  const blob = new Blob([JSON.stringify(evidence, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${orderId}-evidence-package.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function cartBadgeCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function money(value) {
  return new Intl.NumberFormat("en-HK", { style: "currency", currency: checkoutCurrency }).format(value);
}

function orderMoney(value, currency = checkoutCurrency) {
  return new Intl.NumberFormat(currency === "HKD" ? "en-HK" : "en-US", { style: "currency", currency }).format(value);
}

function checkoutPrice(value) {
  return Math.round(Number(value || 0) * usdToHkdRate);
}

function productMoney(value) {
  return money(checkoutPrice(value));
}

function renderIllustration(product, index = 0) {
  const productLabel = productText(product).name;
  const imageIndex = Number.isInteger(product.imageIndex) ? product.imageIndex : index;
  const isPremiumSheet = product.imageSheet === "premium";
  const cols = isPremiumSheet ? 2 : 4;
  const rows = isPremiumSheet ? 2 : 3;
  const col = imageIndex % cols;
  const row = Math.floor(imageIndex / cols);
  const x = cols === 1 ? 0 : col * (100 / (cols - 1));
  const y = rows === 1 ? 0 : row * (100 / (rows - 1));
  const bgSize = `${cols * 100}% ${rows * 100}%`;
  const sheetClass = isPremiumSheet ? "premium-photo" : "";

  return `
    <div class="render-card product-photo ${sheetClass}" aria-label="${t("originalRender")} ${productLabel}" style="--image-x: ${x}%; --image-y: ${y}%; --image-size: ${bgSize};">
      <div class="product-photo-image" role="img" aria-label="${productLabel}"></div>
      <span class="render-type">${productTypeLabel(product.type)}</span>
    </div>
  `;
}

function nav() {
  const rawPath = currentRoute();
  const path = rawPath.split("?")[0];
  const isActive = href => {
    const targetRaw = href.replace("#", "");
    const target = targetRaw.split("?")[0];
    if (targetRaw.includes("?")) return rawPath === targetRaw;
    if (target === "/products") return path === "/products" || path.startsWith("/products/");
    return path === target;
  };
  const navLinks = [
    ["#/products", t("navProducts")],
    ["#/products?category=custom", t("navCustom")],
    ["#/products?category=stl", t("navStl")],
    ["#/membership", t("navMembership")],
    ["#/commercial-license", t("navLicense")],
    ["#/about", t("navAbout")],
    ["#/contact", t("navContact")]
  ];
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
        ${navLinks.map(([href, label]) => `<a class="${isActive(href) ? "active" : ""}" ${isActive(href) ? "aria-current=\"page\"" : ""} href="${href}">${label}</a>`).join("")}
      </nav>
      <div class="header-actions">
        <select class="language-select" aria-label="Language selector">
          ${languages.map(([code, label]) => `<option value="${code}" ${currentLang === code ? "selected" : ""}>${label}</option>`).join("")}
        </select>
        <a class="cart-link" href="#/cart" aria-label="${t("cart")}">${t("cart")} <span data-cart-count aria-live="polite">${cartBadgeCount()}</span></a>
        <details class="mobile-menu">
          <summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary>
          <nav aria-label="Mobile navigation">
            ${navLinks.map(([href, label]) => `<a class="${isActive(href) ? "active" : ""}" ${isActive(href) ? "aria-current=\"page\"" : ""} href="${href}">${label}</a>`).join("")}
          </nav>
        </details>
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
          <p>${companyRegistration}</p>
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
        <span class="pill">${productTypeLabel(product.type)}</span>
        <h3><a href="#/products/${product.id}">${text.name}</a></h3>
        <p>${text.summary}</p>
        <div class="product-meta">
          <span>${product.badge}</span>
          <strong>${productMoney(product.price)}</strong>
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
  const featuredIds = [
    "observatory-desk-command-center",
    "custom-architectural-memory-model",
    "maker-studio-pro-commercial-license",
    "kinetic-orbit-display-toy",
    "urban-nook-stl-pack",
    "quiet-paws-keepsake"
  ];
  const featured = featuredIds.map(id => products.find(product => product.id === id)).filter(Boolean);
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

      <section class="section muted product-showcase">
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

      <section class="section purpose-section">
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

function membershipPage() {
  const membership = localizedMembership[currentLang] || localizedMembership.en;
  const prices = ["HK$299", "HK$799", "HK$4,999"];
  const plans = membership.plans.map((plan, index) => ({ ...plan, price: prices[index] }));

  return `
    ${nav()}
    <main>
      <section class="membership-hero">
        <div>
          <span class="eyebrow">${membership.eyebrow}</span>
          <h1>${membership.title}</h1>
          <p>${membership.body}</p>
          <div class="hero-actions">
            <a class="button primary" href="#/membership-plans">${membership.primaryCta}</a>
            <a class="button secondary" href="#/digital-goods-policy">${membership.secondaryCta}</a>
          </div>
        </div>
        <div class="membership-visual">
          ${renderIllustration(products.find(product => product.id === "urban-nook-stl-pack") || products[4], 4)}
          <div class="membership-visual-note">
            <strong>${membership.visualTitle}</strong>
            <span>${membership.visualBody}</span>
          </div>
        </div>
      </section>

      <section class="section membership-section" id="membership-plans">
        <div class="section-heading">
          <span class="eyebrow">${membership.plansEyebrow}</span>
          <h2>${membership.plansTitle}</h2>
          <p>${membership.plansBody}</p>
        </div>
        <div class="membership-grid">
          ${plans.map(plan => `
            <article class="membership-card ${plan.badge ? "featured-membership" : ""}">
              ${plan.badge ? `<span class="membership-badge">${plan.badge}</span>` : ""}
              <h3>${plan.name}</h3>
              <p>${plan.audience}</p>
              <div class="membership-price"><strong>${plan.price}</strong><span>${plan.period}</span></div>
              <ul>
                ${plan.benefits.map(benefit => `<li>${benefit}</li>`).join("")}
              </ul>
              <a class="button ${plan.badge ? "primary" : "secondary"}" href="#/contact">${membership.contactCta}</a>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="membership-notice">
        <strong>${membership.importantTitle}</strong>
        <p>${membership.importantBody}</p>
      </section>

      <section class="membership-policy-grid">
        ${membership.policy.map(([eyebrow, title, body]) => `
          <article>
            <span class="eyebrow">${eyebrow}</span>
            <h2>${title}</h2>
            <p>${body}</p>
          </article>
        `).join("")}
      </section>

      <section class="section faq-preview">
        <div class="section-heading">
          <span class="eyebrow">${membership.faqEyebrow}</span>
          <h2>${membership.faqTitle}</h2>
        </div>
        ${membership.faq.map(([question, answer], index) => `
          <details ${index === 0 ? "open" : ""}>
            <summary>${question}</summary>
            <p>${answer}</p>
          </details>
        `).join("")}
      </section>
    </main>
    ${footer()}
  `;
}

function productsPage() {
  const params = currentParams();
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
        <p><strong>Company registration:</strong> ${companyRegistration}</p>
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
          <span class="pill">${productTypeLabel(product.type)}</span>
          <h1>${text.name}</h1>
          <p class="lead">${text.summary}</p>
          <strong class="detail-price">${productMoney(product.price)}</strong>
          <div class="detail-actions">
            <button class="button primary" data-add-to-cart="${product.id}" type="button">${t("addToCart")}</button>
            <button class="button secondary" data-buy-now="${product.id}" type="button">${t("buyNow")}</button>
          </div>
          <div class="detail-facts">
            <div><span>${t("deliveryMethod")}</span><strong>${deliveryMethod(product)}</strong></div>
            <div><span>${t("processingTime")}</span><strong>${processingTime(product)}</strong></div>
            <div><span>${t("refundRule")}</span><strong>${product.type === "Digital STL Pack" ? "No no-reason refund after download" : "Defects and shipping issues reviewed"}</strong></div>
            <div><span>${t("licenseScope")}</span><strong>${product.type === "Commercial License" ? "Physical resale rights only" : "Personal use unless licensed"}</strong></div>
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
                    <span class="pill">${productTypeLabel(line.product.type)}</span>
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
                    <b>${money(checkoutPrice(line.product.price) * line.qty)}</b>
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
            <label><input name="terms" type="checkbox" required /> ${t("termsAgreement")}</label>
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
      <p>${t("total")}: <strong>${orderMoney(order.total, order.currency || checkoutCurrency)}</strong></p>
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
  const rememberedLookup = sessionStorage.getItem("atelier-lookup-order") || "";
  const rememberedResult = result || (rememberedLookup ? findOrder(rememberedLookup) : null);
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
          <label>${t("orderNumber")}<input name="orderId" value="${rememberedLookup}" placeholder="AP-DEMO-1001" required /></label>
          <button class="button primary" type="submit">${t("lookupOrder")}</button>
        </form>
        ${rememberedResult ? orderCard(rememberedResult) : ""}
      </section>
    </main>
    ${footer()}
  `;
}

function orderSuccessPage() {
  const params = currentParams();
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
      ["Payment processing", "The site is prepared for secure payment processing. Private payment credentials must remain server-side and are not stored in front-end code."]
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
        <p>Atelier Printworks is the online storefront operated by ${businessName}, focused on original desk utility, home objects, pet keepsakes, STL files, and custom print services.</p>
      </section>
      <section class="info-band">
        <div><h2>Original Designs</h2><p>We avoid infringing IP, character replicas, protected brand marks, and unauthorized fan merchandise.</p></div>
        <div><h2>Physical & Digital</h2><p>Customers can buy made-to-order printed goods, downloadable files, commercial licenses, and reviewed custom services.</p></div>
        <div><h2>Clear Support</h2><p>Support replies within 24-48 hours on business days at ${supportEmail}. ${companyRegistration}</p></div>
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
        <p><strong>Company registration:</strong> ${companyRegistration}</p>
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

function adminStatusPill(label, value) {
  return `<span class="admin-pill ${label.toLowerCase()}"><strong>${adminRiskLevelLabel(label)}</strong>${escapeHtml(value)}</span>`;
}

function adminOrdersPage() {
  const orders = adminAllOrders();
  const pending = orders.filter(order => /review|queued|created|pending|审核|复核|排队|待/i.test(order.status || "")).length;
  const highRisk = orders.filter(order => adminOrderRisk(order).some(([level]) => level === "High")).length;
  const digital = orders.filter(order => orderTypes(order).some(type => ["Digital STL Pack", "Commercial License"].includes(type))).length;
  return `
    ${nav()}
    <main class="admin-shell">
      <section class="admin-hero">
        <span class="eyebrow">运营后台</span>
        <h1>订单证据与风控工作台</h1>
        <p>用于订单运营、地址本地化编辑、交付记录、风控备注、审计日志和纠纷证据包的内部预览后台。</p>
      </section>
      <section class="admin-metrics">
        <div><span>订单总数</span><strong>${orders.length}</strong></div>
        <div><span>待处理订单</span><strong>${pending}</strong></div>
        <div><span>数字/授权订单</span><strong>${digital}</strong></div>
        <div><span>高风险标记</span><strong>${highRisk}</strong></div>
      </section>
      <section class="admin-panel">
        <div class="admin-panel-heading">
          <div>
            <span class="eyebrow">P0 模块</span>
            <h2>订单列表</h2>
          </div>
          <a class="button secondary" href="#/audit-checklist">审核自检清单</a>
        </div>
        <div class="admin-table" role="table" aria-label="后台订单">
          <div class="admin-table-row admin-table-head" role="row">
            <span>订单</span><span>客户</span><span>类型</span><span>金额</span><span>风险</span><span>状态</span><span></span>
          </div>
          ${orders.map(order => {
            const operational = adminOrderState(order);
            const risk = adminOrderRisk(order, operational)[0];
            return `
              <article class="admin-table-row" role="row">
                <span><strong>${order.id}</strong><small>${escapeHtml(new Date(order.createdAt || Date.now()).toLocaleString("en-US"))}</small></span>
                <span>${escapeHtml(operational.customerEmail || order.email)}<small>${escapeHtml(operational.country || "未设置国家")}</small></span>
                <span>${orderTypes(order).map(type => `<small>${escapeHtml(adminProductTypeLabel(type))}</small>`).join("")}</span>
                <span><strong>${orderMoney(order.total || 0, order.currency || checkoutCurrency)}</strong></span>
                <span>${adminStatusPill(risk[0], risk[1])}</span>
                <span>${escapeHtml(operational.fulfillmentStatus || order.status || "新订单")}</span>
                <span><a class="button secondary compact-button" href="#/admin/orders/${order.id}">打开</a></span>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    </main>
  `;
}

function adminField(name, label, value, type = "text") {
  const safe = escapeHtml(value || "");
  if (type === "textarea") {
    return `<label>${label}<textarea name="${name}">${safe}</textarea></label>`;
  }
  return `<label>${label}<input name="${name}" value="${safe}" /></label>`;
}

function adminOrderDetailPage(orderId) {
  const order = findOrder(orderId);
  if (!order) return placeholderPage("后台订单不存在", "请求的订单记录不存在。");
  const operational = adminOrderState(order);
  const risks = adminOrderRisk(order, operational);
  const digitalDelivery = adminDigitalDelivery(order);
  const fulfillment = adminFulfillmentEvidence(order, operational);
  const audit = adminAuditLog().filter(log => log.orderId === order.id);
  return `
    ${nav()}
    <main class="admin-shell">
      <section class="admin-hero compact-admin-hero">
        <span class="eyebrow">订单运营</span>
        <h1>${order.id}</h1>
        <p>客户原始下单信息会被保留；运营字段可用于快递面单本地化、客服处理和纠纷证据说明。</p>
        <div class="hero-actions">
          <a class="button secondary" href="#/admin">返回后台</a>
          <button class="button primary" data-export-evidence="${order.id}" type="button">导出证据包</button>
        </div>
      </section>
      <section class="admin-detail-grid">
        <aside class="admin-panel">
          <span class="eyebrow">原始订单快照</span>
          <h2>不可变记录</h2>
          <dl class="admin-dl">
            <div><dt>原始邮箱</dt><dd>${escapeHtml(order.email)}</dd></div>
            <div><dt>原始地址</dt><dd>${escapeHtml(order.address || "未提供")}</dd></div>
            <div><dt>原始备注</dt><dd>${escapeHtml(order.notes || "无")}</dd></div>
            <div><dt>订单金额</dt><dd>${orderMoney(order.total || 0, order.currency || checkoutCurrency)}</dd></div>
            <div><dt>订单状态</dt><dd>${escapeHtml(order.status || "新订单")}</dd></div>
          </dl>
          <h3>商品</h3>
          <ul class="admin-list">
            ${orderProducts(order).map(item => `<li><strong>${escapeHtml(item.product?.name || item.id)}</strong><span>${escapeHtml(adminProductTypeLabel(item.product?.type || "Unknown"))} · ${item.qty} × ${orderMoney(item.price || 0, order.currency || checkoutCurrency)}</span></li>`).join("")}
          </ul>
        </aside>
        <section class="admin-panel">
          <span class="eyebrow">运营手工编辑</span>
          <h2>本地化履约字段</h2>
          <form class="admin-form" data-admin-order-form>
            <input type="hidden" name="orderId" value="${order.id}" />
            <div class="admin-form-grid">
              ${adminField("customerName", "客户/经营主体名称", operational.customerName)}
              ${adminField("customerEmail", "运营联系邮箱", operational.customerEmail)}
              <label>客户偏好语言
                <select name="preferredLanguage">
                  ${languages.map(([code, label]) => `<option value="${code}" ${operational.preferredLanguage === code ? "selected" : ""}>${label}</option>`).join("")}
                </select>
              </label>
              ${adminField("phone", "电话", operational.phone)}
              ${adminField("country", "国家/地区", operational.country)}
              ${adminField("region", "省/州/都道府县", operational.region)}
              ${adminField("city", "城市", operational.city)}
              ${adminField("postalCode", "邮编", operational.postalCode)}
              ${adminField("addressLocal", "当地语言/快递面单地址", operational.addressLocal, "textarea")}
              ${adminField("addressEnglish", "英文地址", operational.addressEnglish, "textarea")}
              ${adminField("carrier", "物流商/交付渠道", operational.carrier)}
              ${adminField("trackingNumber", "物流单号", operational.trackingNumber)}
              ${adminField("trackingUrl", "物流查询链接", operational.trackingUrl)}
              ${adminField("fulfillmentStatus", "履约状态", operational.fulfillmentStatus)}
              ${adminField("deliveryNotes", "配送/生产备注", operational.deliveryNotes, "textarea")}
              ${adminField("supportNotes", "客服/纠纷备注", operational.supportNotes, "textarea")}
              ${adminField("riskDecision", "风控处理结论", operational.riskDecision)}
              <label>编辑原因<span class="required-dot">审计日志必填</span><textarea name="editReason" required placeholder="例如：快递面单本地化、客户更正地址、邮编规范化、风控复核备注..."></textarea></label>
            </div>
            <button class="button primary" type="submit">保存运营修改</button>
          </form>
        </section>
      </section>
      <section class="admin-evidence-grid">
        <article class="admin-panel">
          <span class="eyebrow">风控复核</span>
          <h2>风险标记</h2>
          ${risks.map(([level, note]) => adminStatusPill(level, note)).join("")}
        </article>
        <article class="admin-panel">
          <span class="eyebrow">数字交付</span>
          <h2>下载/授权记录</h2>
          ${digitalDelivery.length ? `<ul class="admin-list">${digitalDelivery.map(item => `<li><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.format)} · ${escapeHtml(item.status)} · 下载次数: ${item.downloads} · IP: ${escapeHtml(item.downloadIp)}</span></li>`).join("")}</ul>` : `<p>该订单不需要数字交付。</p>`}
        </article>
        <article class="admin-panel">
          <span class="eyebrow">履约记录</span>
          <h2>物流/交付证据</h2>
          <dl class="admin-dl">
            ${Object.entries(fulfillment).map(([key, value]) => `<div><dt>${escapeHtml(adminFulfillmentLabel(key))}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
          </dl>
        </article>
        <article class="admin-panel">
          <span class="eyebrow">审计日志</span>
          <h2>编辑历史</h2>
          ${audit.length ? `<ul class="admin-list">${audit.map(log => `<li><strong>${escapeHtml(log.at)}</strong><span>${escapeHtml(log.reason)} · 修改字段: ${escapeHtml((log.fields || []).join(", "))}</span></li>`).join("")}</ul>` : `<p>暂无运营编辑记录。</p>`}
        </article>
      </section>
    </main>
  `;
}

function auditChecklistPage() {
  const checks = [
    ["Pass", "Homepage complete", "Hero, categories, featured products, delivery, trust modules, FAQ, and footer are present."],
    ["Pass", "Products and prices clear", "The catalog includes original products with prices and product types."],
    ["Pass", "Physical, digital, custom, and license rules", "Each product type has delivery, refund, and license notes."],
    ["Pass", "Policies exist", "Shipping, refund, privacy, terms, digital goods, and license pages are present."],
    ["Pass", "Contact available", `Email, response time, business name, company registration, and service address policy are visible.`],
    ["Pass", "Order lookup exists", "Mock order AP-DEMO-1001 and locally generated orders can be queried."],
    ["Warning", "Preview payment only", "Live payment capture is not connected yet. Add server-side payment provider integration before production."],
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
        <p>Internal payment readiness review for storefront, checkout, delivery, refund, support, and IP-risk posture.</p>
      </section>
      <section class="policy-shell audit-list">
        ${checks.map(([status, item, note]) => `
          <article class="audit-row ${status.toLowerCase()}">
            <strong>${status}</strong>
            <div><h2>${item}</h2><p>${note}</p><p><em>Fix suggestion:</em> ${status === "Pass" ? "Maintain this requirement during future edits." : "Address before final payment review submission."}</p></div>
          </article>
        `).join("")}
      </section>
    </main>
    ${footer()}
  `;
}

function currentRoute() {
  const hashRoute = location.hash.replace("#", "");
  const pathRoute = `${location.pathname || "/"}${location.search || ""}`;
  return hashRoute || pathRoute || "/";
}

function currentPath() {
  return currentRoute().split("?")[0] || "/";
}

function currentParams() {
  return new URLSearchParams(currentRoute().split("?")[1] || "");
}

function route() {
  const path = currentPath();
  const productMatch = path.match(/^\/products\/(.+)$/);
  const adminOrderMatch = path.match(/^\/admin\/orders\/(.+)$/);
  if (path === "/") return homePage();
  if (path === "/products") return productsPage();
  if (path === "/membership") return membershipPage();
  if (path === "/cart") return cartPage();
  if (path === "/checkout") return checkoutPage();
  if (path === "/order-lookup") return orderLookupPage();
  if (path === "/order-success") return orderSuccessPage();
  if (path === "/admin") return adminOrdersPage();
  if (adminOrderMatch) return adminOrderDetailPage(adminOrderMatch[1]);
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
    checkoutForm.addEventListener("submit", async event => {
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
      const submitButton = checkoutForm.querySelector("button[type='submit']");
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Processing...";
      }
      try {
        const order = await createServerOrder(data);
        const session = await createHostedPaymentSession(order);
        if (session.order) saveServerOrderCache(session.order);
        saveCart([]);
        sessionStorage.setItem("atelier-last-order", order.id);
        if (session.checkoutUrl) {
          location.href = session.checkoutUrl;
        } else {
          location.hash = `#/order-success?order=${order.id}`;
        }
      } catch (error) {
        sessionStorage.setItem("atelier-checkout-error", error.message || t("requiredField"));
        render();
      }
    });
  }
  const lookupForm = app.querySelector("[data-order-lookup]");
  if (lookupForm) {
    lookupForm.addEventListener("submit", async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(lookupForm));
      let order = null;
      try {
        order = await fetchServerOrder(data.orderId || "");
      } catch {
        order = findOrder(data.orderId || "");
      }
      if (!order) sessionStorage.setItem("atelier-lookup-error", t("orderNotFound"));
      if (order) sessionStorage.setItem("atelier-lookup-order", order.id);
      else sessionStorage.removeItem("atelier-lookup-order");
      render();
    });
  }
  const adminOrderForm = app.querySelector("[data-admin-order-form]");
  if (adminOrderForm) {
    adminOrderForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(adminOrderForm));
      saveAdminOrderEdit(data.orderId, data);
      render();
    });
  }
  app.querySelectorAll("[data-export-evidence]").forEach(button => {
    button.addEventListener("click", () => downloadAdminEvidence(button.dataset.exportEvidence));
  });
  const path = currentPath();
  if (path === "/admin" && !window.__atelierAdminOrdersLoading) {
    window.__atelierAdminOrdersLoading = true;
    fetchAdminOrders()
      .then(() => {
        window.__atelierAdminOrdersLoading = false;
        if (currentPath() === "/admin") render();
      })
      .catch(() => {
        window.__atelierAdminOrdersLoading = false;
      });
  }
  if (path === "/order-success" && !window.__atelierOrderSuccessLoading) {
    const params = currentParams();
    const orderId = params.get("order") || sessionStorage.getItem("atelier-last-order") || "";
    if (orderId && !findOrder(orderId)) {
      window.__atelierOrderSuccessLoading = true;
      fetchServerOrder(orderId)
        .then(() => {
          window.__atelierOrderSuccessLoading = false;
          if (currentPath() === "/order-success") render();
        })
        .catch(() => {
          window.__atelierOrderSuccessLoading = false;
        });
    }
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

window.addEventListener("hashchange", render);
render();
