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

  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";
  const currentFeatured = searchParams.get("featured") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentCategory) params.set("category", currentCategory);
      if (currentSort) params.set("sort", currentSort);
      if (currentSearch) params.set("search", currentSearch);
      if (currentFeatured) params.set("featured", currentFeatured);
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, currentSort, currentSearch, currentFeatured, currentPage]);

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

  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") params.set("page", "1");
    window.history.pushState(null, "", `/products?${params.toString()}`);
    // Trigger re-fetch
    window.dispatchEvent(new Event("popstate"));
  };

  useEffect(() => {
    const handler = () => fetchProducts();
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [fetchProducts]);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
              : currentCategory
              ? categories.find((c) => c.slug === currentCategory)?.name || "Products"
              : currentFeatured
              ? "Featured Products"
              : "All Products"}
          </h1>
          <p className="text-dark-400 mt-2">
            {products.length} products found
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block w-64 flex-shrink-0"
          >
            <div className="glass-card p-6 sticky top-24">
              <h3
                className="text-sm font-semibold text-white mb-4"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                Categories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => updateUrl("category", "")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    !currentCategory
                      ? "bg-primary-500/15 text-primary-400 font-medium"
                      : "text-dark-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateUrl("category", cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                      currentCategory === cat.slug
                        ? "bg-primary-500/15 text-primary-400 font-medium"
                        : "text-dark-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat.name}
                    <span className="text-xs text-dark-500">
                      {cat._count.products}
                    </span>
                  </button>
                ))}
              </div>

              <div className="border-t border-white/5 mt-6 pt-6">
                <h3
                  className="text-sm font-semibold text-white mb-4"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
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

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-6 right-4 sm:right-6 z-30">
            <button
              onClick={() => setFilterOpen(true)}
              className="btn-primary py-3 px-5 rounded-full shadow-xl shadow-primary-500/30"
            >
              <HiOutlineFunnel className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Mobile Filter Drawer */}
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
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="p-2 rounded-xl hover:bg-white/5"
                    >
                      <HiOutlineXMark className="w-5 h-5 text-dark-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-dark-300 mb-3">
                        Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            updateUrl("category", "");
                            setFilterOpen(false);
                          }}
                          className={`px-4 py-2 rounded-xl text-sm ${
                            !currentCategory
                              ? "gradient-bg text-white"
                              : "glass-light text-dark-300"
                          }`}
                        >
                          All
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              updateUrl("category", cat.slug);
                              setFilterOpen(false);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm ${
                              currentCategory === cat.slug
                                ? "gradient-bg text-white"
                                : "glass-light text-dark-300"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-dark-300 mb-3">
                        Sort By
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              updateUrl("sort", opt.value);
                              setFilterOpen(false);
                            }}
                            className={`px-4 py-2 rounded-xl text-sm ${
                              currentSort === opt.value
                                ? "gradient-bg text-white"
                                : "glass-light text-dark-300"
                            }`}
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

          {/* Product Grid */}
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

                {/* Pagination */}
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
