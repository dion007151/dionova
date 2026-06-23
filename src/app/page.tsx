"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Shared";
import {
  HiOutlineSparkles,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { 
  TbDeviceLaptop, 
  TbHanger, 
  TbHome, 
  TbSparkles, 
  TbRun, 
  TbBook,
  TbPackage,
  TbTruck,
  TbLock,
  TbRefresh,
  TbMedal,
  TbStar,
  TbMoodSad
} from "react-icons/tb";

const categoryIconMap: Record<string, React.ReactNode> = {
  "electronics": <TbDeviceLaptop className="w-8 h-8" />,
  "fashion": <TbHanger className="w-8 h-8" />,
  "home-living": <TbHome className="w-8 h-8" />,
  "beauty": <TbSparkles className="w-8 h-8" />,
  "sports": <TbRun className="w-8 h-8" />,
  "books": <TbBook className="w-8 h-8" />,
};

const categoryBgColors = [
  "bg-[#f5f4f0] hover:bg-[#d9d5ce]",
  "bg-[#ede9e3] hover:bg-[#d9d5ce]",
  "bg-[#e8e4dd] hover:bg-[#d9d5ce]",
  "bg-[#f5f4f0] hover:bg-[#d9d5ce]",
  "bg-[#ede9e3] hover:bg-[#d9d5ce]",
  "bg-[#e8e4dd] hover:bg-[#d9d5ce]"
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
  {
    icon: <TbTruck className="w-6 h-6 text-[#1a1a1a]" />,
    title: "Free shipping",
    desc: "On orders over ₱999",
  },
  {
    icon: <TbLock className="w-6 h-6 text-[#1a1a1a]" />,
    title: "Secure payment",
    desc: "256-bit SSL encryption",
  },
  {
    icon: <TbRefresh className="w-6 h-6 text-[#1a1a1a]" />,
    title: "Easy returns",
    desc: "30-day hassle-free returns",
  },
  {
    icon: <TbMedal className="w-6 h-6 text-[#1a1a1a]" />,
    title: "Premium quality",
    desc: "Curated for excellence",
  },
];

const customerReviews = [
  {
    text: "Absolutely love everything I've ordered — quality is unreal for the price.",
    author: "Sarah K.",
    initials: "SK"
  },
  {
    text: "Fast delivery and beautiful packaging. Will definitely be ordering again.",
    author: "Michael T.",
    initials: "MT"
  },
  {
    text: "Found my new go-to shop. The curation is spot on.",
    author: "Elena R.",
    initials: "ER"
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"all" | "new" | "bestseller" | "under500">("all");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

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

  // Filter products according to selected filter tab
  const getFilteredProducts = () => {
    switch (filterTab) {
      case "new":
        return featuredProducts.slice(0, 4); // Simulate newest
      case "bestseller":
        return featuredProducts.filter(p => p.featured).slice(0, 4);
      case "under500":
        return featuredProducts.filter(p => p.price < 500).slice(0, 4);
      case "all":
      default:
        return featuredProducts.slice(0, 8);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-white">
      {/* 2. HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[600px] flex items-center bg-white overflow-hidden border-b border-[#eee]">
        <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-10 items-stretch">
          
          {/* LEFT COLUMN (55%) */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="lg:col-span-6 px-6 sm:px-12 lg:pl-20 lg:pr-12 py-16 sm:py-20 lg:py-24 flex flex-col justify-center text-left"
          >
            <span className="text-[11px] font-medium tracking-[0.12em] text-[#888] uppercase mb-3">
              New Season 2025
            </span>
            
            <h1 
              className="text-[40px] sm:text-[52px] font-bold text-[#1a1a1a] leading-[1.1] mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Discover <span className="italic font-normal">extraordinary</span> things.
            </h1>

            <p className="text-[16px] text-[#666] leading-[1.6] max-w-[420px] mb-8">
              Curated premium products delivered to your door. Discover what makes everyday life exceptional.
            </p>

            {/* CTA Row */}
            <div className="flex items-center gap-6 mb-12">
              <Link 
                href="/products" 
                className="h-[48px] px-8 bg-[#1a1a1a] text-white text-[14px] font-medium rounded-[4px] flex items-center justify-center hover:bg-[#333] transition-colors"
              >
                Shop now
              </Link>
              <Link 
                href="/products?featured=true" 
                className="text-[14px] font-medium text-[#1a1a1a] hover:underline"
              >
                View lookbook &rarr;
              </Link>
            </div>

            {/* Stats row */}
            <div className="border-t border-[#eee] pt-6 grid grid-cols-3 gap-4">
              {[
                { value: "500+", label: "Products" },
                { value: "10k+", label: "Customers" },
                { value: "4.9", label: "Rating" }
              ].map((stat, idx) => (
                <div key={stat.label} className="flex items-center gap-4">
                  {idx > 0 && <div className="h-8 w-[1px] bg-[#eee]" />}
                  <div>
                    <div className="text-[22px] font-semibold text-[#1a1a1a] leading-none mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[12px] text-[#888]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN (45%) */}
          <div className="lg:col-span-4 bg-[#f5f4f0] p-8 sm:p-12 lg:p-0 flex items-center justify-center relative min-h-[450px]">
            {/* Main Product Image Placeholder */}
            <div className="w-[320px] h-[400px] sm:w-[400px] sm:h-[500px] bg-[#e8e6e0] rounded-[8px] overflow-hidden shadow-sm relative flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop"
                alt="Featured Look" 
                className="w-full h-full object-cover mix-blend-multiply opacity-80"
              />
            </div>

            {/* Floating Product Card bottom-left */}
            <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 bg-white rounded-[8px] p-3 sm:p-4 border border-[#eee] flex items-center gap-3 shadow-md max-w-[220px]">
              <div className="w-8 h-8 rounded bg-[#f5f4f0] flex items-center justify-center text-[#1a1a1a]">
                <TbPackage className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#888] block uppercase">Just arrived</span>
                <span className="text-[13px] font-bold text-[#1a1a1a] block truncate max-w-[140px]">Nova Audio Headset</span>
                <span className="text-[13px] text-[#888] block">₱8,990</span>
              </div>
            </div>

            {/* Category pills floating top-right */}
            <div className="absolute top-6 right-6 sm:top-12 sm:right-12 flex flex-col gap-2 z-10">
              {["Electronics", "Fashion", "Home"].map((pill) => (
                <Link
                  key={pill}
                  href={`/products?category=${pill.toLowerCase().replace(" & ", "-")}`}
                  className="bg-white border border-[#ddd] rounded-[20px] text-[11px] font-medium text-[#1a1a1a] px-3.5 py-1 text-center shadow-xs hover:border-[#1a1a1a] transition-all"
                >
                  {pill}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      {categories.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <span className="text-[13px] text-[#888] tracking-[0.1em] font-medium uppercase mb-1.5 block">
                Shop by category
              </span>
              <h2 className="text-[28px] font-semibold text-[#1a1a1a]">
                Find what you love
              </h2>
            </div>
            <Link 
              href="/products?view=categories" 
              className="text-[13px] text-[#1a1a1a] font-medium hover:underline mt-2 sm:mt-0 flex items-center gap-1"
            >
              See all categories &rarr;
            </Link>
          </div>

          {/* Grid of square categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => {
              const bg = categoryBgColors[i % categoryBgColors.length];
              const icon = categoryIconMap[cat.slug] || <TbPackage className="w-8 h-8" />;
              return (
                <Link 
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className={`aspect-square ${bg} rounded-[12px] flex flex-col items-center justify-center p-6 transition-all duration-200 group cursor-pointer`}
                >
                  <div className="text-[#1a1a1a] mb-3 transition-transform duration-200 ease-out group-hover:scale-110">
                    {icon}
                  </div>
                  <span className="text-[13px] font-medium text-[#1a1a1a] text-center block">
                    {cat.name}
                  </span>
                  <span className="text-[11px] text-[#888] mt-1 block">
                    {cat._count.products} products
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. PRODUCT GRID SECTION */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-[80px] pb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] text-[#888] tracking-[0.1em] font-medium uppercase block mb-1.5">
              Featured picks
            </span>
            <h2 className="text-[28px] font-semibold text-[#1a1a1a]">
              Trending now
            </h2>
          </div>

          {/* Filter Tabs */}
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
                className={`px-4 py-2 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
                  filterTab === tab.id
                    ? "bg-[#1a1a1a] border-[#1a1a1a] text-white"
                    : "bg-transparent border-[#ddd] text-[#555] hover:border-[#1a1a1a]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic products renderer */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <TbMoodSad className="w-[48px] h-[48px] text-[#ddd] mb-3" />
            <h3 className="text-[16px] text-[#aaa] font-medium mb-4">No products found</h3>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-[13px] font-medium hover:bg-[#1a1a1a] hover:text-white transition-colors rounded cursor-pointer"
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
      </section>

      {/* 5. TRUST & REVIEWS */}
      
      {/* BLOCK 1: TRUST BAR */}
      <section className="w-full bg-[#f5f4f0] py-[32px] border-y border-[#e0ddd8]">
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
            {trustItems.map((item, idx) => (
              <div key={item.title} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 justify-center">
                {idx > 0 && <div className="hidden lg:block w-[1px] h-12 bg-[#e0ddd8] self-center mr-6" />}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/40">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[14px] font-medium text-[#1a1a1a]">{item.title}</h4>
                  <p className="text-[12px] text-[#888] mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 2: REVIEWS */}
      <section className="bg-white py-[80px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[13px] text-[#888] font-medium uppercase tracking-[0.1em]">
              What customers say
            </span>
            <h2 className="text-[28px] font-bold text-[#1a1a1a] mt-1.5">
              Loved by thousands
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div 
                key={rev.author}
                className="bg-[#fafaf9] border border-[#eeece8] rounded-[12px] p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <TbStar key={s} className="w-[14px] h-[14px] fill-[#f5a623] text-[#f5a623]" />
                    ))}
                  </div>
                  <p className="text-[14px] text-[#444] leading-[1.65] italic line-clamp-3 mb-6">
                    &ldquo;{rev.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-[36px] h-[36px] rounded-full bg-[#e8e6e0] flex items-center justify-center text-[13px] text-[#888] font-medium">
                    {rev.initials}
                  </div>
                  <div>
                    <h5 className="text-[13px] font-semibold text-[#1a1a1a] leading-none mb-1">
                      {rev.author}
                    </h5>
                    <span className="inline-block bg-[#e8f5ee] text-[#0F6E56] text-[11px] font-medium rounded-[3px] px-1.5 py-0.5">
                      Verified buyer
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
