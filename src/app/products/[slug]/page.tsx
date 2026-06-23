"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { formatCurrency, getDiscountPercentage, getImageUrl, parseProductImages } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/Shared";
import toast from "react-hot-toast";
import {
  HiOutlineShoppingBag,
  HiStar,
  HiOutlineArrowLeft,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiMinus,
  HiPlus,
} from "react-icons/hi2";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string; avatar: string | null };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  featured: boolean;
  category: { name: string; slug: string };
  reviews: Review[];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Product Not Found
          </h1>
          <Link href="/products" className="btn-primary mt-4">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const images = parseProductImages(product.images);

  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0],
        stock: product.stock,
      });
    }
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-dark-400 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide"
        >
          <Link href="/products" className="flex items-center gap-1 hover:text-primary-400 transition-colors flex-shrink-0">
            <HiOutlineArrowLeft className="w-4 h-4" />
            Products
          </Link>
          <span className="flex-shrink-0">/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary-400 transition-colors flex-shrink-0">
            {product.category.name}
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-dark-200 truncate">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card overflow-hidden mb-4">
              <div className="aspect-square relative bg-dark-800">
                <img
                  src={getImageUrl(images[selectedImage] || "")}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-red-500/90 text-white text-sm font-bold">
                    -{discount}%
                  </span>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i
                        ? "border-primary-500 shadow-lg shadow-primary-500/20"
                        : "border-transparent hover:border-white/10"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-primary-400 font-medium uppercase tracking-wider hover:text-primary-300 transition-colors"
              >
                {product.category.name}
              </Link>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <HiStar
                      key={star}
                      className={`w-5 h-5 ${
                        star <= avgRating ? "text-yellow-400" : "text-dark-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-dark-400">
                  {avgRating.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {formatCurrency(product.price)}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-base sm:text-xl text-dark-500 line-through">
                  {formatCurrency(product.comparePrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="badge bg-red-500/20 text-red-400 border-red-500/30">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-dark-300 leading-relaxed">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.stock > 0 ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-sm text-dark-400">
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-center glass-light rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-dark-300 hover:text-white transition-colors"
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-white font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-12 h-12 flex items-center justify-center text-dark-300 hover:text-white transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-3.5"
                >
                  <HiOutlineShoppingBag className="w-5 h-5" />
                  Add to Cart — {formatCurrency(product.price * quantity)}
                </button>
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/5">
              {[
                { icon: <HiOutlineTruck className="w-5 h-5" />, text: "Free Shipping" },
                { icon: <HiOutlineShieldCheck className="w-5 h-5" />, text: "Secure Payment" },
                { icon: <HiOutlineArrowPath className="w-5 h-5" />, text: "Easy Returns" },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center gap-2 text-center">
                  <div className="text-primary-400">{item.icon}</div>
                  <span className="text-[10px] sm:text-xs text-dark-400">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {product.reviews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2
              className="text-2xl font-bold text-white mb-8"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Customer Reviews
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="glass-card p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-sm">
                        {review.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {review.user.name}
                        </p>
                        <p className="text-xs text-dark-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <HiStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-dark-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-dark-300 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
