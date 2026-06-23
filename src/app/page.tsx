"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Shared";
import {
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
} from "react-icons/hi2";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  featured: boolean;
  category: { name: string; slug: string };
  reviews: { rating: number }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  _count: { products: number };
}

const features = [
  {
    icon: <HiOutlineTruck className="w-6 h-6" />,
    title: "Free Shipping",
    desc: "On orders over ₱2,000",
  },
  {
    icon: <HiOutlineShieldCheck className="w-6 h-6" />,
    title: "Secure Payment",
    desc: "256-bit SSL encryption",
  },
  {
    icon: <HiOutlineCreditCard className="w-6 h-6" />,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
  {
    icon: <HiOutlineSparkles className="w-6 h-6" />,
    title: "Premium Quality",
    desc: "Curated collections",
  },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, categoriesRes, newRes] = await Promise.all([
          fetch("/api/products?featured=true&limit=4"),
          fetch("/api/categories"),
          fetch("/api/products?sort=newest&limit=8"),
        ]);
        const featuredData = await featuredRes.json();
        const categoriesData = await categoriesRes.json();
        const newData = await newRes.json();

        setFeaturedProducts(Array.isArray(featuredData.products) ? featuredData.products : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setNewProducts(Array.isArray(newData.products) ? newData.products : []);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 rounded-full bg-primary-500/10 blur-[80px] sm:blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-64 lg:w-80 h-40 sm:h-64 lg:h-80 rounded-full bg-primary-600/8 blur-[60px] sm:blur-[100px] animate-float" style={{ animationDelay: "-3s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[400px] lg:w-[600px] h-[280px] sm:h-[400px] lg:h-[600px] rounded-full border border-white/[0.02]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[280px] lg:w-[400px] h-[200px] sm:h-[280px] lg:h-[400px] rounded-full border border-white/[0.03]" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8"
            >
              <HiOutlineSparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-dark-200">
                Premium Marketplace — 2026 Collection
              </span>
            </motion.div>

            <h1
              className="text-3xl xs:text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-4 sm:mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              <span className="text-white">Discover</span>
              <br />
              <span className="gradient-text">Extraordinary</span>
            </h1>

            <p className="text-dark-300 text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed px-2 sm:px-0">
              Curated collections of premium products designed for those who
              appreciate the finer things. Shop with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="btn-primary py-4 px-8 text-base">
                Explore Collection
                <HiOutlineArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products?featured=true"
                className="btn-secondary py-4 px-8 text-base"
              >
                View Featured
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-6 sm:gap-12 mt-10 sm:mt-16"
          >
            {[
              { value: "500+", label: "Products" },
              { value: "10k+", label: "Customers" },
              { value: "4.9", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-dark-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bar */}
      <section className="relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-6 lg:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-dark-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2
                className="text-3xl lg:text-4xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Shop by <span className="gradient-text">Category</span>
              </h2>
              <p className="text-dark-400 mt-2">Find what you&apos;re looking for</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              View All <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="block glass-card p-5 text-center group"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-bg mx-auto mb-3 flex items-center justify-center text-2xl opacity-80 group-hover:opacity-100 transition-opacity shadow-lg shadow-primary-500/20">
                    {cat.image || "📦"}
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-dark-500">
                    {cat._count.products} items
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Featured <span className="gradient-text">Picks</span>
            </h2>
            <p className="text-dark-400 mt-2">Handpicked by our curators</p>
          </div>
          <Link
            href="/products?featured=true"
            className="hidden sm:flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            See All <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 gradient-bg opacity-90" />
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-black/10 blur-2xl" />
          </div>
          <div className="relative px-5 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16 text-center">
            <h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              New Season,<br />New Discoveries
            </h2>
            <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-xl mx-auto mb-5 sm:mb-8">
              Explore our latest collection with up to 40% off on selected items.
              Limited time offer.
            </p>
            <Link
              href="/products?sort=newest"
              className="inline-flex items-center gap-2 bg-white text-dark-900 px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-xl"
            >
              Shop Now <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              New <span className="gradient-text">Arrivals</span>
            </h2>
            <p className="text-dark-400 mt-2">Fresh additions to our collection</p>
          </div>
          <Link
            href="/products?sort=newest"
            className="hidden sm:flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            View All <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : newProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>
      </section>
    </div>
  );
}
