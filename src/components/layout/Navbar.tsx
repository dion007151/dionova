"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useHydrated } from "@/store/cart";
import {
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/products?view=categories" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const hydrated = useHydrated();

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.8, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass shadow-lg shadow-black/20" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-outfit)" }}>D</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white hidden sm:block" style={{ fontFamily: "var(--font-outfit)" }}>
                DION<span className="gradient-text">OVA</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="px-4 py-2 rounded-lg text-sm font-medium text-dark-300 hover:text-white hover:bg-white/5 transition-all duration-300">
                  {link.name}
                </Link>
              ))}
              <Link href="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-dark-400 hover:text-primary-400 hover:bg-primary-500/5 transition-all duration-300">
                Admin
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 rounded-xl hover:bg-white/5 text-dark-300 hover:text-white transition-all" aria-label="Search">
                <HiOutlineMagnifyingGlass className="w-5 h-5" />
              </button>

              <button onClick={openCart} className="relative p-2.5 rounded-xl hover:bg-white/5 text-dark-300 hover:text-white transition-all" aria-label="Cart">
                <HiOutlineShoppingBag className="w-5 h-5" />
                {hydrated && itemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full gradient-bg text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2.5 rounded-xl hover:bg-white/5 text-dark-300 hover:text-white transition-all" aria-label="Menu">
                {isMobileOpen ? <HiOutlineXMark className="w-5 h-5" /> : <HiOutlineBars3 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden border-t border-white/5">
              <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative">
                  <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="input-field pl-12 py-3" autoFocus />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.nav initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 bottom-0 w-[280px] sm:w-72 glass flex flex-col p-6 pt-20 safe-bottom">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMobileOpen(false)} className="py-3 px-4 rounded-xl text-lg font-medium text-dark-200 hover:text-white hover:bg-white/5 transition-all">
                  {link.name}
                </Link>
              ))}
              <Link href="/admin" onClick={() => setIsMobileOpen(false)} className="py-3 px-4 rounded-xl text-lg font-medium text-dark-400 hover:text-primary-400 transition-all">
                Admin Panel
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
