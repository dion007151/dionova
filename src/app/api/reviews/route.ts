import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Missing productId parameter" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, rating, comment, reviewerFirstName, city, email } = body;

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create user based on provided email or fallback
    let user = await prisma.user.findUnique({
      where: { email: email || "guest@dionova.com" },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email || "guest@dionova.com",
          name: reviewerFirstName || "Anonymous",
          password: "guest-no-login",
          role: "CUSTOMER",
        },
      });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: parseInt(rating),
        comment,
        reviewerFirstName: reviewerFirstName || user.name,
        city: city || "Manila",
        verifiedPurchase: true, // Auto-verify in demo
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("Reviews POST error:", error);
    
    // Handle unique constraint (one review per user per product)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "You have already reviewed this product." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
