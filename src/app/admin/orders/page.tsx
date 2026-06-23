"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency, getStatusColor, getImageUrl, parseProductImages } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  HiOutlineClipboardDocumentList,
  HiOutlineEye,
  HiOutlineXMark,
} from "react-icons/hi2";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string; images: string; slug: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingPhone: string;
  notes: string | null;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
  payment: { method: string; status: string; transactionId: string | null } | null;
}

const statusOptions = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success(`Order updated to ${status}`);
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update order");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Orders
          </h2>
          <p className="text-sm text-dark-400">{orders.length} orders total</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-dark-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 mx-auto mb-4 flex items-center justify-center">
              <HiOutlineClipboardDocumentList className="w-7 h-7 text-dark-500" />
            </div>
            <p className="text-dark-400">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-1 sm:mx-0">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Order</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Customer</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Items</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Status</th>
                  <th className="text-left text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Payment</th>
                  <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Total</th>
                  <th className="text-right text-xs font-medium text-dark-400 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm font-mono text-primary-400">
                        {order.id.slice(0, 8)}...
                      </span>
                      <p className="text-xs text-dark-500 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-white">{order.user.name}</p>
                      <p className="text-xs text-dark-500">{order.user.email}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-dark-300">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer bg-transparent ${getStatusColor(order.status)}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s} className="bg-dark-900 text-white">
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-dark-300">{order.payment?.method || "N/A"}</p>
                      <p className="text-xs text-dark-500">{order.payment?.status || ""}</p>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(order.total)}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 rounded-lg hover:bg-white/5 text-dark-400 hover:text-primary-400 transition-all"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed inset-x-2 sm:inset-x-4 top-[3%] sm:top-[5%] mx-auto max-w-lg glass-card p-4 sm:p-6 z-50 max-h-[94vh] sm:max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                Order Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl hover:bg-white/5 text-dark-400"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Order ID</span>
                <span className="text-sm font-mono text-primary-400">{selectedOrder.id.slice(0, 12)}...</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Date</span>
                <span className="text-sm text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Status</span>
                <span className={`badge ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Customer</span>
                <span className="text-sm text-white">{selectedOrder.user.name}</span>
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">Shipping</h4>
                <p className="text-sm text-dark-300">{selectedOrder.shippingAddress}</p>
                <p className="text-sm text-dark-300">{selectedOrder.shippingCity}, {selectedOrder.shippingZip}</p>
                <p className="text-sm text-dark-400">{selectedOrder.shippingPhone}</p>
                {selectedOrder.notes && (
                  <p className="text-sm text-dark-500 mt-2 italic">Note: {selectedOrder.notes}</p>
                )}
              </div>

              <div className="border-t border-white/5 pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => {
                    const parsedImgs = parseProductImages(item.product.images);
                    const img = parsedImgs[0] || "";
                    return (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                          <img src={getImageUrl(img)} alt={item.product.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{item.product.name}</p>
                          <p className="text-xs text-dark-500">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-xl font-bold text-white">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
