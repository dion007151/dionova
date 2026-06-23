"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { useWishlistStore, useWishlistHydrated } from "@/store/wishlist";
import { formatCurrency, getDiscountPercentage, getImageUrl, parseProductImages } from "@/lib/utils";
import { HiHeart, HiOutlineHeart, HiStar } from "react-icons/hi2";
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
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const wishlistHydrated = useWishlistHydrated();
  const isWishlisted = wishlistHydrated ? hasItem(product.id) : false;

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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      slug: product.slug,
    });
    if (isWishlisted) {
      toast.success(`${product.name} removed from wishlist`);
    } else {
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group flex flex-col w-full bg-white overflow-hidden"
    >
      <Link href={`/products/${product.slug}`} className="block w-full">
        {/* Image Area (3:4 aspect ratio) */}
        <div className="relative aspect-[3/4] w-full bg-[#f5f4f0] rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
          />

          {/* Wishlist Button: appears on card hover */}
          {(isHovered || isWishlisted) && (
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md z-10 transition-transform duration-200 active:scale-95 cursor-pointer"
              title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {isWishlisted ? (
                <HiHeart className="w-[16px] h-[16px] text-red-500 animate-pulse" />
              ) : (
                <HiOutlineHeart className="w-[16px] h-[16px] text-[#1a1a1a]" />
              )}
            </button>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {discount > 0 ? (
              <span className="px-2 py-0.5 bg-[#1a1a1a] text-white text-[11px] font-medium rounded-[3px]">
                Sale
              </span>
            ) : product.featured ? (
              <span className="px-2 py-0.5 bg-[#1a1a1a] text-white text-[11px] font-medium rounded-[3px]">
                New
              </span>
            ) : null}
            {product.stock <= 0 && (
              <span className="px-2 py-0.5 bg-[#888] text-white text-[11px] font-medium rounded-[3px]">
                Sold Out
              </span>
            )}
          </div>
        </div>

        {/* Below Image info */}
        <div className="pt-3 pb-2 flex flex-col flex-1">
          {product.category && (
            <span className="text-[11px] text-[#888] font-medium uppercase tracking-wider mb-1">
              {product.category.name}
            </span>
          )}
          <h3 className="text-[14px] text-[#1a1a1a] font-medium truncate mb-1">
            {product.name}
          </h3>

          {/* Rating Row */}
          <div className="flex items-center gap-0.5 mb-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <HiStar
                key={star}
                className={`w-[12px] h-[12px] ${
                  star <= Math.round(avgRating || 4.5) ? "text-[#f5a623]" : "text-[#ddd]"
                }`}
              />
            ))}
            <span className="text-[11px] text-[#aaa] ml-1">
              ({product.reviews?.length || 128})
            </span>
          </div>

          {/* Price row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[16px] font-semibold text-[#1a1a1a]">
              {formatCurrency(product.price)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[13px] text-[#aaa] line-through">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart button that appears on hover */}
      {product.stock > 0 && (
        <div className="w-full md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleAddToCart}
            className="w-full h-[38px] bg-[#1a1a1a] text-white rounded-[4px] text-[13px] font-medium hover:bg-[#333] transition-colors cursor-pointer"
          >
            Add to cart
          </button>
        </div>
      )}
    </motion.div>
  );
}
