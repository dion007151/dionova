import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_CATEGORIES } from "@/lib/mockProducts";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Categories GET error (falling back to mock categories):", error);
    return NextResponse.json(MOCK_CATEGORIES);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const slug = name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

    const category = await prisma.category.create({
      data: { name, slug, description, image },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Categories POST error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
