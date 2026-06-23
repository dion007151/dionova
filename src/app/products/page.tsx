"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductCardSkeleton, EmptyState } from "@/components/ui/Shared";
import {
  HiOutlineFunnel,
  HiOutlineXMark,
  HiOutlineShoppingBag,
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
  _count: { products: number };
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name", label: "Name A-Z" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const currentCategory = searchParams.get("category")?.split(",").filter(Boolean) || [];
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";
  const currentFeatured = searchParams.get("featured") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const minPrice = parseInt(searchParams.get("minPrice") || "0");
  const maxPrice = parseInt(searchParams.get("maxPrice") || "10000");

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    window.history.pushState(null, "", `/products?${params.toString()}`);
    window.dispatchEvent(new Event("popstate"));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = parseInt(e.target.value);
    setPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    params.set("page", "1");
    window.history.pushState(null, "", `/products?${params.toString()}`);
    window.dispatchEvent(new Event("popstate"));
  };

  const toggleCategory = (slug: string) => {
    const newCats = currentCategory.includes(slug)
      ? currentCategory.filter(c => c !== slug)
      : [...currentCategory, slug];
    updateUrl("category", newCats.join(","));
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]); // Fallback to empty state
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    const handler = () => fetchProducts();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            {currentSearch
              ? `Results for "${currentSearch}"`
              : currentFeatured
              ? "Featured Products"
              : "All Products"}
          </h1>
          <p className="text-dark-400 mt-2">
            {products.length} products found
          </p>
        </motion.div>

        <div className="flex gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${currentCategory.includes(cat.slug) ? 'bg-primary-500 border-primary-500' : 'border-white/20 group-hover:border-white/50 bg-white/5'}`}>
                      {currentCategory.includes(cat.slug) && <HiOutlineXMark className="w-4 h-4 text-white font-bold rotate-45" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={currentCategory.includes(cat.slug)} onChange={() => toggleCategory(cat.slug)} />
                    <span className="text-sm text-dark-300 group-hover:text-white transition-all flex-1">{cat.name}</span>
                    <span className="text-xs text-dark-500">{cat._count.products}</span>
                  </label>
                ))}
              </div>

              <div className="border-t border-white/5 mt-6 pt-6">
                <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input type="number" value={priceRange[0]} onChange={(e) => handlePriceChange(e, 0)} className="w-full bg-dark-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500/50 outline-none" min="0" max={priceRange[1]} />
                    <span className="text-dark-400">-</span>
                    <input type="number" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} className="w-full bg-dark-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-500/50 outline-none" min={priceRange[0]} />
                  </div>
                  <input type="range" min="0" max="10000" step="100" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} className="w-full accent-primary-500" />
                  <button onClick={applyPriceFilter} className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-all font-medium">Apply</button>
                </div>
              </div>

              <div className="border-t border-white/5 mt-6 pt-6">
                <h3 className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
                  Sort By
                </h3>
                <div className="space-y-1">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updateUrl("sort", opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentSort === opt.value
                          ? "bg-primary-500/15 text-primary-400 font-medium"
                          : "text-dark-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="lg:hidden fixed bottom-6 right-4 sm:right-6 z-30">
            <button
              onClick={() => setFilterOpen(true)}
              className="btn-primary py-3 px-5 rounded-full shadow-xl shadow-primary-500/30"
            >
              <HiOutlineFunnel className="w-5 h-5" />
              Filters
            </button>
          </div>

          <AnimatePresence>
            {filterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setFilterOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 z-50 glass rounded-t-3xl p-5 sm:p-6 max-h-[80vh] overflow-y-auto lg:hidden safe-bottom"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                      Filters
                    </h3>
                    <button onClick={() => setFilterOpen(false)} className="p-2 rounded-xl hover:bg-white/5">
                      <HiOutlineXMark className="w-5 h-5 text-dark-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-dark-300 mb-3">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${currentCategory.includes(cat.slug) ? 'bg-primary-500 border-primary-500' : 'border-white/20 group-hover:border-white/50 bg-white/5'}`}>
                              {currentCategory.includes(cat.slug) && <HiOutlineXMark className="w-4 h-4 text-white font-bold rotate-45" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={currentCategory.includes(cat.slug)} onChange={() => toggleCategory(cat.slug)} />
                            <span className="text-sm text-dark-300 group-hover:text-white transition-all flex-1">{cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-dark-300 mb-3">Price Range</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <input type="number" value={priceRange[0]} onChange={(e) => handlePriceChange(e, 0)} className="w-full bg-dark-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" min="0" max={priceRange[1]} />
                          <span className="text-dark-400">-</span>
                          <input type="number" value={priceRange[1]} onChange={(e) => handlePriceChange(e, 1)} className="w-full bg-dark-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white" min={priceRange[0]} />
                        </div>
                        <button onClick={() => { applyPriceFilter(); setFilterOpen(false); }} className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm transition-all font-medium">Apply Price Filter</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-dark-300 mb-3">Sort By</h4>
                      <div className="flex flex-wrap gap-2">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { updateUrl("sort", opt.value); setFilterOpen(false); }}
                            className={`px-4 py-2 rounded-xl text-sm ${currentSort === opt.value ? "gradient-bg text-white" : "glass-light text-dark-300"}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={<HiOutlineShoppingBag className="w-8 h-8" />}
                title="No products found"
                description="Try adjusting your filters or search to find what you're looking for."
                action={
                  <button
                    onClick={() => {
                      window.history.pushState(null, "", "/products");
                      window.dispatchEvent(new Event("popstate"));
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateUrl("page", (i + 1).toString())}
                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                          currentPage === i + 1
                            ? "gradient-bg text-white shadow-lg shadow-primary-500/20"
                            : "glass-light text-dark-300 hover:text-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
