import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const featured = searchParams.get("featured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const where: Record<string, unknown> = { active: true };

    if (category) {
      where.category = { slug: category };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (featured === "true") {
      where.featured = true;
    }

    let orderBy: Record<string, string> = { createdAt: "desc" };
    if (sort === "price-asc") orderBy = { price: "asc" };
    if (sort === "price-desc") orderBy = { price: "desc" };
    if (sort === "name") orderBy = { name: "asc" };
    if (sort === "newest") orderBy = { createdAt: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, reviews: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Products GET error (falling back to mock products):", error);
    return NextResponse.json({
      products: MOCK_PRODUCTS,
      pagination: {
        page: 1,
        limit: 12,
        total: MOCK_PRODUCTS.length,
        totalPages: 1,
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, comparePrice, images, stock, featured, categoryId, slug } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-"),
        description,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images: typeof images === "string" ? images : JSON.stringify(images || []),
        stock: parseInt(stock) || 0,
        featured: Boolean(featured),
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Products POST error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
