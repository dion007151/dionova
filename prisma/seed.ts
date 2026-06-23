import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding DIONOVA database...");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: "admin@dionova.com",
      name: "DIONOVA Admin",
      password: "admin123",
      role: "ADMIN",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      email: "maria@example.com",
      name: "Maria Santos",
      password: "password123",
      role: "CUSTOMER",
      phone: "+63 917 123 4567",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Rivera",
      password: "password123",
      role: "CUSTOMER",
      phone: "+63 918 765 4321",
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: "anna@example.com",
      name: "Anna Cruz",
      password: "password123",
      role: "CUSTOMER",
    },
  });

  console.log("✅ Users created");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Latest gadgets and tech accessories",
        image: "⚡",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing and accessories",
        image: "👗",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home-living",
        description: "Furniture, decor and essentials",
        image: "🏠",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sports",
        slug: "sports",
        description: "Athletic gear and equipment",
        image: "⚽",
      },
    }),
    prisma.category.create({
      data: {
        name: "Beauty",
        slug: "beauty",
        description: "Skincare, makeup and wellness",
        image: "✨",
      },
    }),
    prisma.category.create({
      data: {
        name: "Books",
        slug: "books",
        description: "Bestsellers and educational reads",
        image: "📚",
      },
    }),
  ]);

  console.log("✅ Categories created");

  const [electronics, fashion, homeLiving, sports, beauty, books] = categories;

  // Create Products
  const products = await Promise.all([
    // Electronics
    prisma.product.create({
      data: {
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
        categoryId: electronics.id,
      },
    }),
    prisma.product.create({
      data: {
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
        categoryId: electronics.id,
      },
    }),
    prisma.product.create({
      data: {
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
        categoryId: electronics.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "USB-C Fast Charging Hub",
        slug: "usb-c-fast-charging-hub",
        description: "7-in-1 USB-C hub with 100W power delivery, 4K HDMI, USB 3.0 ports, SD card reader, and Ethernet. Compatible with all USB-C devices.",
        price: 2499,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&h=600&fit=crop",
        ]),
        stock: 100,
        featured: false,
        categoryId: electronics.id,
      },
    }),

    // Fashion
    prisma.product.create({
      data: {
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
        categoryId: fashion.id,
      },
    }),
    prisma.product.create({
      data: {
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
        categoryId: fashion.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Designer Sunglasses Collection",
        slug: "designer-sunglasses-collection",
        description: "UV400 polarized sunglasses with acetate frames and anti-reflective coating. Includes premium carrying case and cleaning cloth.",
        price: 4499,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop",
        ]),
        stock: 50,
        featured: true,
        categoryId: fashion.id,
      },
    }),

    // Home & Living
    prisma.product.create({
      data: {
        name: "Aromatherapy Essential Oil Diffuser",
        slug: "aromatherapy-essential-oil-diffuser",
        description: "Ultrasonic cool mist diffuser with wood grain finish, 7 LED color modes, auto shut-off, and whisper-quiet operation. Covers up to 300 sq ft.",
        price: 1999,
        comparePrice: 2999,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=600&fit=crop",
        ]),
        stock: 80,
        featured: false,
        categoryId: homeLiving.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Luxury Scented Candle Set",
        slug: "luxury-scented-candle-set",
        description: "Set of 3 hand-poured soy wax candles in premium glass vessels. Scents include Vanilla Bourbon, Ocean Breeze, and Forest Pine. 60-hour burn time each.",
        price: 2749,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1602607693943-7088c4346063?w=600&h=600&fit=crop",
        ]),
        stock: 40,
        featured: false,
        categoryId: homeLiving.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Modern Ceramic Plant Pot Set",
        slug: "modern-ceramic-plant-pot-set",
        description: "Set of 3 minimalist ceramic planters with bamboo saucers. Drainage holes included. Perfect for succulents, herbs, and small indoor plants.",
        price: 1749,
        comparePrice: 2249,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop",
        ]),
        stock: 55,
        featured: false,
        categoryId: homeLiving.id,
      },
    }),

    // Sports
    prisma.product.create({
      data: {
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
        categoryId: sports.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Yoga Mat Premium",
        slug: "yoga-mat-premium",
        description: "Extra-thick 6mm eco-friendly yoga mat with alignment lines, non-slip surface, and carrying strap. Made from natural tree rubber.",
        price: 2999,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop",
        ]),
        stock: 45,
        featured: false,
        categoryId: sports.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Insulated Water Bottle",
        slug: "insulated-water-bottle",
        description: "32oz double-wall vacuum insulated stainless steel water bottle. Keeps drinks cold 24 hours or hot 12 hours. BPA-free with leak-proof lid.",
        price: 1499,
        comparePrice: 1999,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
        ]),
        stock: 120,
        featured: false,
        categoryId: sports.id,
      },
    }),

    // Beauty
    prisma.product.create({
      data: {
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
        categoryId: beauty.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Professional Makeup Brush Set",
        slug: "professional-makeup-brush-set",
        description: "12-piece professional makeup brush set with synthetic bristles and ergonomic handles. Includes face, eye, and lip brushes with premium travel case.",
        price: 1749,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
        ]),
        stock: 65,
        featured: false,
        categoryId: beauty.id,
      },
    }),

    // Books
    prisma.product.create({
      data: {
        name: "The Art of Mindful Living",
        slug: "the-art-of-mindful-living",
        description: "A comprehensive guide to mindfulness and meditation practices for everyday life. Features practical exercises, journaling prompts, and beautiful illustrations.",
        price: 1249,
        comparePrice: 1649,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop",
        ]),
        stock: 150,
        featured: false,
        categoryId: books.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Modern Web Development Guide",
        slug: "modern-web-development-guide",
        description: "Complete guide to modern web development covering React, Next.js, TypeScript, and more. Perfect for beginners and experienced developers alike.",
        price: 1999,
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&h=600&fit=crop",
        ]),
        stock: 75,
        featured: false,
        categoryId: books.id,
      },
    }),
  ]);

  console.log(`✅ ${products.length} Products created`);

  // Create Reviews
  const reviewData = [
    { userId: customer1.id, productId: products[0].id, rating: 5, comment: "Amazing sound quality! The noise cancellation is truly premium. Best headphones I've ever owned." },
    { userId: customer2.id, productId: products[0].id, rating: 4, comment: "Great headphones, comfortable for long sessions. Battery life is impressive." },
    { userId: customer3.id, productId: products[0].id, rating: 5, comment: "Worth every penny. Crystal clear audio and super comfortable." },
    { userId: customer1.id, productId: products[1].id, rating: 5, comment: "This smartwatch is incredible. The health tracking features are very accurate." },
    { userId: customer2.id, productId: products[1].id, rating: 4, comment: "Beautiful design, great features. Battery could be slightly better." },
    { userId: customer1.id, productId: products[4].id, rating: 5, comment: "The leather quality is outstanding. Gets compliments everywhere I go." },
    { userId: customer3.id, productId: products[4].id, rating: 4, comment: "Beautiful bag, excellent craftsmanship. Love the compartment layout." },
    { userId: customer2.id, productId: products[6].id, rating: 5, comment: "Stylish and great UV protection. The case is a nice touch." },
    { userId: customer1.id, productId: products[10].id, rating: 5, comment: "Most comfortable running shoes I've had. Great support and cushioning." },
    { userId: customer3.id, productId: products[10].id, rating: 4, comment: "Lightweight and responsive. Perfect for my daily runs." },
  ];

  for (const review of reviewData) {
    await prisma.review.create({ data: review });
  }

  console.log("✅ Reviews created");

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      status: "DELIVERED",
      total: 22498,
      shippingAddress: "123 Rizal Street, Barangay San Antonio",
      shippingCity: "Makati City",
      shippingZip: "1203",
      shippingPhone: "+63 917 123 4567",
      items: {
        create: [
          { productId: products[0].id, quantity: 1, price: 7499 },
          { productId: products[1].id, quantity: 1, price: 14999 },
        ],
      },
      payment: {
        create: {
          method: "GCASH",
          status: "COMPLETED",
          amount: 22498,
          transactionId: "GCASH-SAMPLE-001",
        },
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      status: "PROCESSING",
      total: 8999,
      shippingAddress: "456 Bonifacio Avenue",
      shippingCity: "Quezon City",
      shippingZip: "1100",
      shippingPhone: "+63 918 765 4321",
      items: {
        create: [
          { productId: products[4].id, quantity: 1, price: 8999 },
        ],
      },
      payment: {
        create: {
          method: "STRIPE",
          status: "COMPLETED",
          amount: 8999,
          transactionId: "pi_sample_002",
        },
      },
    },
  });

  const order3 = await prisma.order.create({
    data: {
      userId: customer3.id,
      status: "PENDING",
      total: 10498,
      shippingAddress: "789 Mabini Road",
      shippingCity: "Cebu City",
      shippingZip: "6000",
      shippingPhone: "+63 919 111 2222",
      notes: "Please leave at the front door",
      items: {
        create: [
          { productId: products[6].id, quantity: 1, price: 4499 },
          { productId: products[10].id, quantity: 1, price: 5999 },
        ],
      },
      payment: {
        create: {
          method: "COD",
          status: "PENDING",
          amount: 10498,
        },
      },
    },
  });

  console.log("✅ Sample orders created");
  console.log("");
  console.log("🎉 DIONOVA database seeded successfully!");
  console.log(`   📦 ${products.length} Products`);
  console.log(`   📁 ${categories.length} Categories`);
  console.log(`   👤 4 Users (1 admin + 3 customers)`);
  console.log(`   ⭐ ${reviewData.length} Reviews`);
  console.log(`   🛒 3 Sample Orders`);
  console.log("");
  console.log("   Admin: admin@dionova.com");
  console.log("   Store: http://localhost:3000");
  console.log("   Admin Panel: http://localhost:3000/admin");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
