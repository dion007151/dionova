import { NextRequest, NextResponse } from "next/server";
import { createGCashPayment, verifyGCashPayment } from "@/lib/gcash";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerName, customerPhone } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    const gcashPayment = await createGCashPayment({
      amount,
      description: `DIONOVA Order ${orderId}`,
      orderId,
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "",
    });

    // Update payment record
    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        method: "GCASH",
        transactionId: gcashPayment.transactionId,
        status: gcashPayment.status,
        metadata: JSON.stringify({
          checkoutUrl: gcashPayment.checkoutUrl,
        }),
      },
    });

    return NextResponse.json(gcashPayment);
  } catch (error) {
    console.error("GCash payment error:", error);
    return NextResponse.json(
      { error: "Failed to initiate GCash payment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, orderId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const verification = await verifyGCashPayment(transactionId);

    if (verification.verified) {
      await prisma.payment.updateMany({
        where: { orderId },
        data: { status: "COMPLETED" },
      });

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });
    }

    return NextResponse.json(verification);
  } catch (error) {
    console.error("GCash verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify GCash payment" },
      { status: 500 }
    );
  }
}
