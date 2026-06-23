"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  HiOutlineCreditCard,
  HiOutlineDevicePhoneMobile,
  HiOutlineBanknotes,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
} from "react-icons/hi2";

type PaymentMethod = "STRIPE" | "GCASH" | "COD";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingZip: "",
    shippingPhone: "",
    notes: "",
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const total = getTotal();
  const shipping = total > 2000 ? 0 : 199;
  const grandTotal = total + shipping;

  const handleCheckout = async () => {
    if (!form.customerName || !form.customerEmail || !form.shippingAddress || !form.shippingCity || !form.shippingZip || !form.shippingPhone) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Create the order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: form.shippingAddress,
          shippingCity: form.shippingCity,
          shippingZip: form.shippingZip,
          shippingPhone: form.shippingPhone,
          notes: form.notes,
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          paymentMethod,
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");
      const order = await orderRes.json();

      // Process payment based on method
      if (paymentMethod === "STRIPE") {
        const paymentRes = await fetch("/api/payments/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: grandTotal,
          }),
        });

        if (!paymentRes.ok) {
          // Stripe might fail if no real key, that's okay for demo
          console.log("Stripe payment intent creation skipped (demo mode)");
        }
      } else if (paymentMethod === "GCASH") {
        const gcashRes = await fetch("/api/payments/gcash", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            amount: grandTotal,
            customerName: form.customerName,
            customerPhone: form.shippingPhone,
          }),
        });

        if (gcashRes.ok) {
          const gcashData = await gcashRes.json();
          // Simulate GCash verification
          await fetch("/api/payments/gcash", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transactionId: gcashData.transactionId,
              orderId: order.id,
            }),
          });
        }
      }

      clearCart();
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation?orderId=${order.id}&total=${grandTotal}&email=${encodeURIComponent(form.customerEmail)}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-10 max-w-md w-full mx-4 text-center"
        >
          <div className="w-20 h-20 rounded-full gradient-bg mx-auto mb-6 flex items-center justify-center">
            <HiOutlineCheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-dark-400 mb-2">
            Thank you for your purchase at DIONOVA
          </p>
          <p className="text-sm text-dark-500 mb-8">
            Order ID: <span className="text-primary-400 font-mono">{orderId.slice(0, 12)}...</span>
          </p>
          <div className="space-y-3">
            <Link href="/products" className="btn-primary w-full py-3 block text-center">
              Continue Shopping
            </Link>
            <Link href="/" className="btn-secondary w-full py-3 block text-center">
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-dark-800 mx-auto mb-4 flex items-center justify-center">
            <HiOutlineShoppingBag className="w-8 h-8 text-dark-500" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Cart is Empty</h1>
          <p className="text-dark-400 mb-6">Add items to proceed to checkout</p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors mb-8"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <h1
            className="text-3xl font-bold text-white mb-8"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Checkout
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact Info */}
            <div className="glass-card p-6 space-y-4">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => updateForm("customerName", e.target.value)}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => updateForm("customerEmail", e.target.value)}
                    className="input-field"
                    placeholder="john@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="glass-card p-6 space-y-4">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Shipping Address
              </h2>
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">
                  Address *
                </label>
                <input
                  type="text"
                  value={form.shippingAddress}
                  onChange={(e) => updateForm("shippingAddress", e.target.value)}
                  className="input-field"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.shippingCity}
                    onChange={(e) => updateForm("shippingCity", e.target.value)}
                    className="input-field"
                    placeholder="Manila"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={form.shippingZip}
                    onChange={(e) => updateForm("shippingZip", e.target.value)}
                    className="input-field"
                    placeholder="1000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={form.shippingPhone}
                    onChange={(e) => updateForm("shippingPhone", e.target.value)}
                    className="input-field"
                    placeholder="+63 9XX XXX XXXX"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">
                  Order Notes (optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  className="input-field min-h-[80px] resize-none"
                  placeholder="Any special instructions..."
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-card p-6 space-y-4">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "STRIPE" as PaymentMethod,
                    icon: <HiOutlineCreditCard className="w-6 h-6" />,
                    name: "Credit Card",
                    desc: "Stripe Secure",
                  },
                  {
                    id: "GCASH" as PaymentMethod,
                    icon: <HiOutlineDevicePhoneMobile className="w-6 h-6" />,
                    name: "GCash",
                    desc: "Mobile Payment",
                  },
                  {
                    id: "COD" as PaymentMethod,
                    icon: <HiOutlineBanknotes className="w-6 h-6" />,
                    name: "Cash on Delivery",
                    desc: "Pay on arrival",
                  },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === method.id
                        ? "border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/10"
                        : "border-white/5 bg-dark-800/50 hover:border-white/10"
                    }`}
                  >
                    <div
                      className={`mb-2 ${
                        paymentMethod === method.id
                          ? "text-primary-400"
                          : "text-dark-400"
                      }`}
                    >
                      {method.icon}
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        paymentMethod === method.id
                          ? "text-white"
                          : "text-dark-200"
                      }`}
                    >
                      {method.name}
                    </p>
                    <p className="text-xs text-dark-500 mt-0.5">{method.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="glass-card p-4 sm:p-6 lg:sticky lg:top-24 space-y-4 sm:space-y-6">
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Order Summary
              </h2>

              <div className="space-y-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-14 h-14 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-dark-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Subtotal</span>
                  <span className="text-white">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Place Order — {formatCurrency(grandTotal)}
                  </>
                )}
              </button>

              <p className="text-xs text-dark-500 text-center">
                By placing your order, you agree to our Terms of Service.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
