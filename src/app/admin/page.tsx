"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency, getStatusColor } from "@/lib/utils";
import {
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

interface Analytics {
  stats: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  ordersByStatus: Record<string, number>;
  recentOrders: {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string; email: string };
    payment: { method: string; status: string } | null;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse">
            <div className="h-4 bg-dark-700 rounded w-1/2 mb-3" />
            <div className="h-8 bg-dark-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!data || !data.stats) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-dark-400">Unable to load dashboard data. Make sure the database is connected.</p>
      </div>
    );
  }

  const statCards = [
    {
      icon: <HiOutlineBanknotes className="w-6 h-6" />,
      label: "Total Revenue",
      value: formatCurrency(data.stats.totalRevenue),
      color: "text-green-400 bg-green-500/10",
    },
    {
      icon: <HiOutlineClipboardDocumentList className="w-6 h-6" />,
      label: "Total Orders",
      value: data.stats.totalOrders.toString(),
      color: "text-blue-400 bg-blue-500/10",
    },
    {
      icon: <HiOutlineCube className="w-6 h-6" />,
      label: "Active Products",
      value: data.stats.totalProducts.toString(),
      color: "text-purple-400 bg-purple-500/10",
    },
    {
      icon: <HiOutlineUsers className="w-6 h-6" />,
      label: "Customers",
      value: data.stats.totalUsers.toString(),
      color: "text-primary-400 bg-primary-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <HiOutlineArrowTrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              {stat.value}
            </p>
            <p className="text-sm text-dark-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Order Status + Avg Order */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3
            className="text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Orders by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(data.ordersByStatus).length > 0 ? (
              Object.entries(data.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`badge ${getStatusColor(status)}`}>
                    {status}
                  </span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-dark-500 text-sm">No orders yet</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3
            className="text-lg font-semibold text-white mb-4"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Performance
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-dark-400">Average Order Value</p>
              <p className="text-2xl font-bold text-white mt-1" style={{ fontFamily: "var(--font-outfit)" }}>
                {formatCurrency(data.stats.avgOrderValue)}
              </p>
            </div>
            <div className="h-2 rounded-full bg-dark-800 overflow-hidden">
              <div
                className="h-full rounded-full gradient-bg transition-all"
                style={{
                  width: `${Math.min(100, (data.stats.totalOrders / 100) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-dark-500">
              {data.stats.totalOrders} of 100 orders target
            </p>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3
            className="text-lg font-semibold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Recent Orders
          </h3>
        </div>

        {data.recentOrders.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">
                    Payment
                  </th>
                  <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider p-4">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm font-mono text-primary-400">
                        {order.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-white">{order.user.name}</p>
                      <p className="text-xs text-dark-500">{order.user.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-dark-300">
                        {order.payment?.method || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-dark-500">No orders yet</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
