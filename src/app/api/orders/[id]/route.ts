import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          include: {
            product: { select: { name: true, images: true, slug: true, price: true } },
          },
        },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    // If order is delivered/completed, update payment status
    if (status === "DELIVERED" || status === "COMPLETED") {
      if (order.payment) {
        await prisma.payment.update({
          where: { id: order.payment.id },
          data: { status: "COMPLETED" },
        });
      }
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Order PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
