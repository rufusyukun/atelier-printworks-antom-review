export const categories = [
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

export const products = [
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
  }
];

export const footerGroups = [
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
