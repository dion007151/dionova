"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineCheckCircle, HiOutlineArrowLeft, HiOutlineShoppingBag } from "react-icons/hi2";
import { formatCurrency } from "@/lib/utils";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const total = searchParams.get("total") || "0";
  const email = searchParams.get("email") || "";

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      {/* Decorative blurs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
        className="glass-card p-8 sm:p-10 max-w-md w-full text-center flex flex-col items-center"
      >
        <div className="w-24 h-24 mb-4">
          <DotLottieReact
            src="https://lottie.host/8e2354c4-7299-4c28-98e3-0d297ca275fb/T5KspJd79M.lottie"
            autoplay
          />
        </div>
        
        <h1
          className="text-2xl sm:text-3xl font-bold text-white mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Order Confirmed!
        </h1>
        <p className="text-dark-300 text-sm mb-6">
          Thank you for your purchase. We have received your order and are processing it.
        </p>

        {orderId && (
          <div className="glass-light p-4 rounded-xl mb-6 text-left space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-dark-400">Order Reference:</span>
              <span className="text-primary-400 font-mono font-semibold truncate max-w-[180px]">{orderId}</span>
            </div>
            {total !== "0" && (
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-dark-400">Amount Paid:</span>
                <span className="text-white font-bold">{formatCurrency(parseFloat(total))}</span>
              </div>
            )}
            {email && (
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-dark-400">Confirmation Sent To:</span>
                <span className="text-white truncate max-w-[180px]">{email}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Link href="/products" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 group">
            <HiOutlineShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          <Link href="/" className="btn-secondary w-full py-3">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-primary-500 animate-spin" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
