import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalUsers, recentOrders, allOrders] =
      await Promise.all([
        prisma.product.count({ where: { active: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            payment: true,
          },
        }),
        prisma.order.findMany({
          select: { status: true, total: true },
        }),
      ]);

    // Calculate stats manually for better adapter compatibility
    const statusCounts: Record<string, number> = {};
    let totalRevenue = 0;

    for (const order of allOrders) {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      totalRevenue += order.total;
    }

    const avgOrderValue =
      allOrders.length > 0 ? totalRevenue / allOrders.length : 0;

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        avgOrderValue,
      },
      ordersByStatus: statusCounts,
      recentOrders,
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json(
      {
        stats: {
          totalProducts: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRevenue: 0,
          avgOrderValue: 0,
        },
        ordersByStatus: {},
        recentOrders: [],
      },
      { status: 200 }
    );
  }
}
