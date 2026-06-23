"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Shared";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { 
  TbDeviceLaptop, 
  TbHanger, 
  TbHome2, 
  TbSparkles, 
  TbRun, 
  TbBook,
  TbPackage,
  TbTruck,
  TbLock,
  TbRefresh,
  TbMedal,
  TbStar,
  TbArrowRight,
  TbShoppingBag,
  TbFlame,
} from "react-icons/tb";

const categoryIconMap: Record<string, React.ReactNode> = {
  "electronics": <TbDeviceLaptop className="w-7 h-7" />,
  "fashion": <TbHanger className="w-7 h-7" />,
  "home-living": <TbHome2 className="w-7 h-7" />,
  "beauty": <TbSparkles className="w-7 h-7" />,
  "sports": <TbRun className="w-7 h-7" />,
  "books": <TbBook className="w-7 h-7" />,
};

const categoryAccents = [
  { bg: "rgba(240,90,31,0.08)", border: "rgba(240,90,31,0.3)", text: "#f57946" },
  { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.3)", text: "#818cf8" },
  { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.3)", text: "#34d399" },
  { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)", text: "#fbbf24" },
  { bg: "rgba(236,72,153,0.08)", border: "rgba(236,72,153,0.3)", text: "#f472b6" },
  { bg: "rgba(14,165,233,0.08)", border: "rgba(14,165,233,0.3)", text: "#38bdf8" },
];

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

const trustItems = [
  { icon: <TbTruck className="w-6 h-6" />, title: "Free shipping", desc: "On orders over ₱999", color: "#f57946" },
  { icon: <TbLock className="w-6 h-6" />, title: "Secure payment", desc: "256-bit SSL encryption", color: "#34d399" },
  { icon: <TbRefresh className="w-6 h-6" />, title: "Easy returns", desc: "30-day hassle-free", color: "#818cf8" },
  { icon: <TbMedal className="w-6 h-6" />, title: "Premium quality", desc: "Curated for excellence", color: "#fbbf24" },
];

const customerReviews = [
  { text: "Absolutely love everything I've ordered — quality is unreal for the price.", author: "Sarah K.", initials: "SK", rating: 5 },
  { text: "Fast delivery and beautiful packaging. Will definitely be ordering again.", author: "Michael T.", initials: "MT", rating: 5 },
  { text: "Found my new go-to shop. The curation is spot on and super premium.", author: "Elena R.", initials: "ER", rating: 5 },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "new" | "bestseller" | "under500">("all");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, categoriesRes] = await Promise.all([
          fetch("/api/products?limit=12"),
          fetch("/api/categories"),
        ]);
        const featuredData = await featuredRes.json();
        const categoriesData = await categoriesRes.json();
        setFeaturedProducts(Array.isArray(featuredData.products) ? featuredData.products : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getFilteredProducts = () => {
    switch (filterTab) {
      case "new": return featuredProducts.slice(0, 4);
      case "bestseller": return featuredProducts.filter(p => p.featured).slice(0, 4);
      case "under500": return featuredProducts.filter(p => p.price < 500).slice(0, 4);
      default: return featuredProducts.slice(0, 8);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen">

      {/* ============ HERO ============ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated ambient glows */}
        <div className="hero-glow w-[600px] h-[600px] bg-primary-500/15 top-[-200px] left-[-100px] animate-pulse-glow" />
        <div className="hero-glow w-[400px] h-[400px] bg-purple-500/10 bottom-[-100px] right-[-50px] animate-float-delayed" />
        <div className="hero-glow w-[300px] h-[300px] bg-primary-400/10 top-[30%] right-[20%]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">

          {/* Left: Text */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10"
            >
              <TbFlame className="w-4 h-4 text-primary-400 animate-bounce-soft" />
              <span className="text-xs font-semibold text-primary-300 tracking-widest uppercase">New Season 2025</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Discover{" "}
              <span className="gradient-text italic font-normal">extraordinary</span>
              <br />things.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-dark-300 text-lg leading-relaxed max-w-md mb-10"
            >
              Curated premium products delivered to your door. Discover what makes everyday life exceptional.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                href="/products"
                className="btn-primary px-8 py-4 text-base rounded-xl glow-orange-sm flex items-center gap-2 group"
              >
                <TbShoppingBag className="w-5 h-5" />
                Shop Now
                <TbArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/products?featured=true"
                className="btn-secondary px-8 py-4 text-base rounded-xl"
              >
                View Lookbook
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-8"
            >
              {[
                { value: "500+", label: "Products" },
                { value: "10k+", label: "Happy Customers" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-5">
                  {i > 0 && <div className="w-px h-10 bg-white/10" />}
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-dark-400 mt-0.5">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow ring behind */}
            <div className="absolute w-[400px] h-[400px] rounded-full bg-primary-500/10 blur-3xl animate-pulse-glow" />

            <div className="relative w-full max-w-[500px]">
              <DotLottieReact
                src="https://lottie.host/embed/4fbbbb4c-c3ef-4434-b048-2e5c0e3f9f71/GZfH8bCNlK.lottie"
                loop
                autoplay
              />
            </div>

            {/* Floating cards */}
            <div className="absolute top-8 -left-4 sm:left-4 glass-card px-4 py-3 flex items-center gap-3 animate-float shadow-xl max-w-[180px]">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                <TbPackage className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] text-dark-400 block">Just arrived</span>
                <span className="text-[12px] font-bold text-white block">Nova Headset</span>
                <span className="text-[11px] text-primary-400">₱8,990</span>
              </div>
            </div>

            <div className="absolute bottom-8 -right-4 sm:right-4 glass-card px-4 py-3 flex items-center gap-3 animate-float-delayed shadow-xl max-w-[160px]">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                <TbTruck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <span className="text-[10px] text-dark-400 block">Delivered</span>
                <span className="text-[11px] font-bold text-white">Free shipping!</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0d0e12] to-transparent" />
      </section>

      {/* ============ TRUST BAR ============ */}
      <section className="relative py-8 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.color}18`, border: `1px solid ${item.color}40`, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                  <p className="text-xs text-dark-400 mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10"
          >
            <div>
              <span className="text-xs font-semibold text-primary-400 tracking-widest uppercase mb-2 block">Shop by category</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                Find what you love
              </h2>
            </div>
            <Link href="/products" className="mt-4 sm:mt-0 flex items-center gap-1 text-sm text-dark-400 hover:text-primary-400 transition-colors group">
              See all <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const accent = categoryAccents[i % categoryAccents.length];
              const icon = categoryIconMap[cat.slug] || <TbPackage className="w-7 h-7" />;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center p-5 transition-all duration-300 group cursor-pointer block relative overflow-hidden"
                    style={{
                      background: accent.bg,
                      border: `1px solid ${accent.border}`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `${accent.bg}` }}
                    />
                    <div className="relative z-10 flex flex-col items-center">
                      <div
                        className="mb-3 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1"
                        style={{ color: accent.text }}
                      >
                        {icon}
                      </div>
                      <span className="text-[13px] font-semibold text-white text-center block">
                        {cat.name}
                      </span>
                      <span className="text-[11px] mt-1 block" style={{ color: accent.text }}>
                        {cat._count.products} items
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ PRODUCTS GRID ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <span className="text-xs font-semibold text-primary-400 tracking-widest uppercase block mb-2">Featured picks</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              Trending now 🔥
            </h2>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "new", label: "New" },
              { id: "bestseller", label: "Best sellers" },
              { id: "under500", label: "Under ₱500" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-[12px] font-semibold border transition-all cursor-pointer ${
                  filterTab === tab.id
                    ? "gradient-bg border-transparent text-white shadow-lg shadow-primary-500/20"
                    : "bg-white/5 border-white/10 text-dark-300 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-48 h-48 mb-4">
              <DotLottieReact
                src="https://lottie.host/embed/b9b75d90-0028-448d-bad6-b13da4b5f8a8/3Z6XBYARYO.lottie"
                loop
                autoplay
              />
            </div>
            <h3 className="text-xl text-dark-300 font-semibold mb-3">No products found</h3>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/products" className="btn-secondary px-10 py-4 text-base rounded-xl inline-flex items-center gap-2 group">
            View all products <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ============ ANIMATED BANNER ============ */}
      <section className="relative py-20 overflow-hidden my-8">
        <div className="absolute inset-0 gradient-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/5 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 z-10">
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-outfit)" }}
            >
              Shop smarter,<br />
              <span className="gradient-text">live better.</span>
            </motion.h2>
            <p className="text-dark-300 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Join over 10,000 happy customers discovering premium products every day.
            </p>
            <Link href="/products" className="btn-primary px-10 py-4 text-base rounded-xl inline-flex items-center gap-2 group glow-orange">
              Start Shopping <TbArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full lg:w-[380px] flex-shrink-0">
            <DotLottieReact
              src="https://lottie.host/embed/c5fec8f5-5d95-440d-b7b9-fc51e52c0e10/kVCRuyN7zQ.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary-400 tracking-widest uppercase block mb-2">What customers say</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
            Loved by thousands ❤️
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev, i) => (
            <motion.div
              key={rev.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TbStar key={s} className="w-4 h-4 fill-[#f5a623] text-[#f5a623]" style={{ fill: "#f5a623" }} />
                  ))}
                </div>
                <p className="text-dark-200 leading-relaxed italic mb-6">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                  {rev.initials}
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-white">{rev.author}</h5>
                  <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                    Verified buyer
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}





