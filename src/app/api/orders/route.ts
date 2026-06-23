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
    let user = await prisma.user.findUnique({
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

    // Calculate total
    const productIds = items.map((item: { productId: string }) => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    let total = 0;
    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Create order with items and payment
    const order = await prisma.order.create({
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

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
