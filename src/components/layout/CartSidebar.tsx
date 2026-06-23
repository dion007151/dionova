"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import Link from "next/link";
import {
  HiOutlineXMark,
  HiOutlineTrash,
  HiPlus,
  HiMinus,
  HiOutlineShoppingBag,
} from "react-icons/hi2";

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md glass z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <HiOutlineShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    Your Cart
                  </h2>
                  <p className="text-xs text-dark-400">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white transition-all"
              >
                <HiOutlineXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
                    <HiOutlineShoppingBag className="w-8 h-8 text-dark-500" />
                  </div>
                  <p className="text-dark-400 font-medium mb-1">
                    Your cart is empty
                  </p>
                  <p className="text-dark-500 text-sm mb-6">
                    Discover something extraordinary
                  </p>
                  <Link
                    href="/products"
                    onClick={closeCart}
                    className="btn-primary text-sm"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="glass-light rounded-xl p-3 sm:p-4 flex gap-3 sm:gap-4"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-dark-800 overflow-hidden flex-shrink-0">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">
                          {item.name}
                        </h3>
                        <p className="text-primary-400 font-bold text-sm mt-1">
                          {formatCurrency(item.price)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-lg bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white transition-all"
                            >
                              <HiMinus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium text-white w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-lg bg-dark-800 hover:bg-dark-700 flex items-center justify-center text-dark-300 hover:text-white transition-all"
                            >
                              <HiPlus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-all"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-white/5 space-y-3 sm:space-y-4 safe-bottom">
                <div className="flex items-center justify-between">
                  <span className="text-dark-300">Subtotal</span>
                  <span className="text-xl font-bold text-white">
                    {formatCurrency(getTotal())}
                  </span>
                </div>
                <p className="text-xs text-dark-500">
                  Shipping & taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full py-3.5 text-center block"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="btn-secondary w-full py-3"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
