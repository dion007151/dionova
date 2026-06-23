"use client";

import { useWishlistStore, useWishlistHydrated } from "@/store/wishlist";
import { useCartStore } from "@/store/cart";
import { formatCurrency, getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineHeart, HiOutlineTrash, HiOutlineShoppingBag, HiOutlineArrowLeft } from "react-icons/hi2";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const hydrated = useWishlistHydrated();

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      stock: 10, // Default fallback stock for wishlist items
    });
    toast.success(`${item.name} added to cart!`);
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-white/35 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors mb-2"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
            <h1
              className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <HiOutlineHeart className="w-8 h-8 text-primary-500" />
              My Wishlist
            </h1>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="btn-secondary text-red-400 hover:text-red-300 border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 py-2.5"
            >
              <HiOutlineTrash className="w-4 h-4" />
              Clear Wishlist
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-12 text-center max-w-md mx-auto mt-12 flex flex-col items-center"
            >
              <div className="w-48 h-48 mb-4">
                <DotLottieReact
                  src="https://lottie.host/9f50bc12-f04b-4b13-911e-0c9f1c7d247d/N6m06X0Bux.lottie"
                  loop
                  autoplay
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
                Your Wishlist is Empty
              </h2>
              <p className="text-dark-400 text-sm mb-8">
                Explore our catalog and click the heart icon on any product to save it here.
              </p>
              <Link href="/products" className="btn-primary w-full">
                Explore Catalog
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="glass-card overflow-hidden flex flex-col group"
                >
                  <div className="relative aspect-square overflow-hidden bg-dark-800">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-red-500/20 text-white hover:text-red-400 backdrop-blur-md transition-all shadow-md"
                      title="Remove from Wishlist"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${item.slug}`} className="hover:text-primary-400 transition-colors">
                        <h3 className="font-semibold text-white text-base line-clamp-2 mb-2">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold text-primary-400 mb-4">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn-primary flex-1 py-3"
                      >
                        <HiOutlineShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <Link
                        href={`/products/${item.slug}`}
                        className="btn-secondary py-3 px-3"
                        title="View Details"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
