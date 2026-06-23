export const MOCK_PRODUCTS = [
  {
    id: "mock-1",
    name: "Wireless Noise-Canceling Headphones",
    slug: "wireless-noise-canceling-headphones",
    description: "Premium over-ear headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio. Features Bluetooth 5.3 and multipoint connection for seamless switching between devices.",
    price: 7499,
    comparePrice: 9999,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838223-710d7f27a770?w=600&h=600&fit=crop",
    ]),
    stock: 45,
    featured: true,
    categoryId: "electronics",
    category: { name: "Electronics", slug: "electronics" },
    reviews: [
      { id: "rev-1", rating: 5, comment: "Amazing sound quality! The noise cancellation is truly premium.", reviewerFirstName: "Maria", city: "Manila", verifiedPurchase: true, createdAt: new Date().toISOString() },
      { id: "rev-2", rating: 4, comment: "Great headphones, comfortable for long sessions.", reviewerFirstName: "John", city: "Quezon City", verifiedPurchase: true, createdAt: new Date().toISOString() }
    ]
  },
  {
    id: "mock-2",
    name: "Smart Watch Ultra Pro",
    slug: "smart-watch-ultra-pro",
    description: "Advanced smartwatch with AMOLED display, health monitoring, GPS tracking, and 7-day battery life. Water-resistant to 50 meters with titanium case.",
    price: 14999,
    comparePrice: 19999,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&h=600&fit=crop",
    ]),
    stock: 30,
    featured: true,
    categoryId: "electronics",
    category: { name: "Electronics", slug: "electronics" },
    reviews: []
  },
  {
    id: "mock-3",
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description: "Compact waterproof speaker with 360° sound, deep bass, and 20-hour playtime. Perfect for outdoor adventures and pool parties.",
    price: 3999,
    comparePrice: 4999,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop",
    ]),
    stock: 60,
    featured: false,
    categoryId: "electronics",
    category: { name: "Electronics", slug: "electronics" },
    reviews: []
  },
  {
    id: "mock-4",
    name: "USB-C Fast Charging Hub",
    slug: "usb-c-fast-charging-hub",
    description: "7-in-1 USB-C hub with 100W power delivery, 4K HDMI, USB 3.0 ports, SD card reader, and Ethernet. Compatible with all USB-C devices.",
    price: 2499,
    comparePrice: null,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&h=600&fit=crop",
    ]),
    stock: 100,
    featured: false,
    categoryId: "electronics",
    category: { name: "Electronics", slug: "electronics" },
    reviews: []
  },
  {
    id: "mock-5",
    name: "Premium Leather Crossbody Bag",
    slug: "premium-leather-crossbody-bag",
    description: "Handcrafted Italian leather crossbody bag with adjustable strap, multiple compartments, and premium gold-tone hardware. A timeless accessory for any occasion.",
    price: 8999,
    comparePrice: 12499,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop",
    ]),
    stock: 25,
    featured: true,
    categoryId: "fashion",
    category: { name: "Fashion", slug: "fashion" },
    reviews: []
  },
  {
    id: "mock-6",
    name: "Minimalist Analog Watch",
    slug: "minimalist-analog-watch",
    description: "Elegant minimalist watch with sapphire crystal, genuine leather strap, and Japanese quartz movement. Water-resistant and scratch-proof.",
    price: 6499,
    comparePrice: 8999,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
    ]),
    stock: 35,
    featured: false,
    categoryId: "fashion",
    category: { name: "Fashion", slug: "fashion" },
    reviews: []
  },
  {
    id: "mock-7",
    name: "Performance Running Shoes",
    slug: "performance-running-shoes",
    description: "Lightweight running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Engineered for speed and comfort on every run.",
    price: 5999,
    comparePrice: 7999,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop",
    ]),
    stock: 70,
    featured: true,
    categoryId: "sports",
    category: { name: "Sports", slug: "sports" },
    reviews: []
  },
  {
    id: "mock-8",
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-brightening-serum",
    description: "Clinical-grade 20% Vitamin C serum with hyaluronic acid and vitamin E. Brightens skin, reduces dark spots, and boosts collagen production.",
    price: 2149,
    comparePrice: 2799,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop",
    ]),
    stock: 90,
    featured: false,
    categoryId: "beauty",
    category: { name: "Beauty", slug: "beauty" },
    reviews: []
  }
];

export const MOCK_CATEGORIES = [
  { id: "electronics", name: "Electronics", slug: "electronics", description: "Latest gadgets and tech accessories", image: "⚡", _count: { products: 4 } },
  { id: "fashion", name: "Fashion", slug: "fashion", description: "Trendy clothing and accessories", image: "👗", _count: { products: 2 } },
  { id: "home-living", name: "Home & Living", slug: "home-living", description: "Furniture, decor and essentials", image: "🏠", _count: { products: 0 } },
  { id: "sports", name: "Sports", slug: "sports", description: "Athletic gear and equipment", image: "⚽", _count: { products: 1 } },
  { id: "beauty", name: "Beauty", slug: "beauty", description: "Skincare, makeup and wellness", image: "✨", _count: { products: 1 } },
  { id: "books", name: "Books", slug: "books", description: "Bestsellers and educational reads", image: "📚", _count: { products: 0 } }
];
