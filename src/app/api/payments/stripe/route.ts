import { NextRequest, NextResponse } from "next/server";
import { createPaymentIntent } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount } = body;

    if (!orderId || !amount) {
      return NextResponse.json(
        { error: "Order ID and amount are required" },
        { status: 400 }
      );
    }

    const paymentIntent = await createPaymentIntent(amount, {
      orderId,
      platform: "DIONOVA",
    });

    // Update payment record with Stripe info
    await prisma.payment.updateMany({
      where: { orderId },
      data: {
        method: "STRIPE",
        transactionId: paymentIntent.paymentIntentId,
        metadata: JSON.stringify({ clientSecret: paymentIntent.clientSecret }),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
