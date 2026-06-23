"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatCurrency, getDiscountPercentage, getImageUrl, parseProductImages } from "@/lib/utils";
import { HiOutlineShoppingBag, HiStar } from "react-icons/hi2";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number | null;
    images: string;
    stock: number;
    featured: boolean;
    category?: { name: string; slug: string };
    reviews?: { rating: number }[];
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Detect touch device to disable 3D tilt (which is janky on touch)
  useState(() => {
    if (typeof window !== "undefined") {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }
  });

  const images = parseProductImages(product.images);
  const mainImage = getImageUrl(images[0] || "");

  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || isTouchDevice) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.8, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isTouchDevice
          ? undefined
          : `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: isTouchDevice ? undefined : "preserve-3d",
      }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="glass-card overflow-hidden">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-dark-800">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badges */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
              {discount > 0 && (
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-red-500/90 text-white text-[10px] sm:text-xs font-bold backdrop-blur-sm">
                  -{discount}%
                </span>
              )}
              {product.featured && (
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg gradient-bg text-white text-[10px] sm:text-xs font-bold">
                  Featured
                </span>
              )}
              {product.stock <= 0 && (
                <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-dark-900/90 text-dark-300 text-[10px] sm:text-xs font-bold backdrop-blur-sm">
                  Sold Out
                </span>
              )}
            </div>

            {/* Quick Add */}
            {product.stock > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ scale: 1.05 }}
                onClick={handleAddToCart}
                className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-bg text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-primary-500/30"
              >
                <HiOutlineShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            )}
          </div>

          {/* Info */}
          <div className="p-2.5 sm:p-4 space-y-1 sm:space-y-2">
            {product.category && (
              <span className="text-[10px] sm:text-xs text-primary-400 font-medium uppercase tracking-wider">
                {product.category.name}
              </span>
            )}
            <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-primary-300 transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <HiStar
                    key={star}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                      star <= avgRating ? "text-yellow-400" : "text-dark-600"
                    }`}
                  />
                ))}
                <span className="text-xs text-dark-400 ml-1">
                  ({product.reviews?.length})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm sm:text-lg font-bold text-white">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-[10px] sm:text-sm text-dark-500 line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
