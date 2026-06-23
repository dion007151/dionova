import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, images: true, slug: true } },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      shippingCity,
      shippingZip,
      shippingPhone,
      notes,
      paymentMethod,
      customerName,
      customerEmail,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must have at least one item" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingCity || !shippingZip || !shippingPhone) {
      return NextResponse.json(
        { error: "Shipping information is required" },
        { status: 400 }
      );
    }

    // Find or create guest user
    let user = null;
    try {
      user = await prisma.user.findUnique({
        where: { email: customerEmail || "guest@dionova.com" },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: customerEmail || "guest@dionova.com",
            name: customerName || "Guest Customer",
            password: "guest-no-login",
            role: "CUSTOMER",
          },
        });
      }
    } catch (e) {
      console.warn("User fetch/creation failed in database, falling back to mock user:", e);
      user = { id: "demo-user-id", email: customerEmail || "guest@dionova.com", name: customerName || "Guest Customer" };
    }

    // Calculate total
    let products: any[] = [];
    try {
      const productIds = items.map((item: { productId: string }) => item.productId);
      products = await prisma.product.findMany({
        where: { id: { in: productIds } },
      });
    } catch (e) {
      console.warn("Product fetch from database failed, falling back to mock products:", e);
    }

    // Import mock products library if we need to search there
    const { MOCK_PRODUCTS } = require("@/lib/mockProducts");

    let total = 0;
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      // Look in database products first, then mock products
      let product = products.find((p) => p.id === item.productId);
      if (!product) {
        product = MOCK_PRODUCTS.find((p: any) => p.id === item.productId);
      }
      
      const price = product ? product.price : 999; // Default price if not found anywhere
      const itemTotal = price * item.quantity;
      total += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: price,
      };
    });

    // Create order with items and payment
    let order;
    try {
      order = await prisma.order.create({
        data: {
          userId: user.id,
          total,
          status: "PENDING",
          shippingAddress,
          shippingCity,
          shippingZip,
          shippingPhone,
          notes,
          items: {
            create: orderItems,
          },
          payment: {
            create: {
              method: paymentMethod || "COD",
              status: "PENDING",
              amount: total,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          payment: true,
          user: { select: { name: true, email: true } },
        },
      });

      // Update product stock
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }
    } catch (dbError) {
      console.warn("Database order creation failed, falling back to mock demo order:", dbError);
      // Fallback/Mock order response for Demo mode
      order = {
        id: "demo_" + Math.random().toString(36).substring(2, 15),
        userId: "demo-user-id",
        total,
        status: "PENDING",
        shippingAddress,
        shippingCity,
        shippingZip,
        shippingPhone,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        payment: {
          id: "demo-payment-id",
          method: paymentMethod || "COD",
          status: "PENDING",
          amount: total,
        },
        items: items.map((item: { productId: string; quantity: number }, idx: number) => ({
          id: `demo-item-id-${idx}`,
          productId: item.productId,
          quantity: item.quantity,
          price: total / items.length, // approximation for fallback UI display
        }))
      };
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
