"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, useHydrated } from "@/store/cart";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import {
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "Categories", href: "/products?view=categories" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [showPromo, setShowPromo] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.getItemCount());
  const hydrated = useHydrated();
  const supabase = createClient();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      setUser(res?.data?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      document.cookie = "dionova_mock_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    toast.success("Successfully logged out");
    setUser(null);
    setUserDropdownOpen(false);
    window.location.href = "/";
  };

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
      {/* PROMO BAR */}
      {showPromo && (
        <div className="bg-[#1a1a1a] text-white text-[12px] h-[36px] flex items-center justify-between px-6 z-[60] relative transition-all duration-300">
          <div className="flex-1 text-center font-normal tracking-wide">
            Free shipping on orders over ₱999 · New arrivals every week
          </div>
          <button 
            onClick={() => setShowPromo(false)} 
            className="text-white/80 hover:text-white text-lg p-1 transition-colors outline-none cursor-pointer"
            aria-label="Close Announcement"
          >
            &times;
          </button>
        </div>
      )}

      {/* NAVBAR */}
      <header
        className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-[#e5e5e5] h-[64px] flex items-center shadow-sm"
      >
        <div className="max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[64px]">
            
            {/* LEFT — Logo */}
            <Link href="/" className="flex items-center group relative">
              <span 
                className="text-[15px] font-semibold tracking-[0.15em] text-[#1a1a1a]" 
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                DIONOVA
              </span>
              <span className="w-[6px] h-[6px] bg-[#1a1a1a] inline-block ml-[2px] self-end mb-[4px]" />
            </Link>

            {/* CENTER — Nav Links */}
            <nav className="hidden md:flex items-center gap-[32px]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`text-[13px] font-normal transition-all duration-200 py-1 relative ${
                      isActive ? "text-[#1a1a1a] border-b-[1.5px] border-[#1a1a1a]" : "text-[#555] hover:text-[#1a1a1a] hover:border-b-[1.5px] hover:border-[#1a1a1a]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT — Icon Group */}
            <div className="flex items-center gap-[20px]">
              {/* Search Toggle */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)} 
                className="text-[#1a1a1a] hover:text-[#555] p-1 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <HiOutlineMagnifyingGlass className="w-[20px] h-[20px]" />
              </button>

              {/* Wishlist Link */}
              <Link 
                href="/wishlist" 
                className="text-[#1a1a1a] hover:text-[#555] p-1 transition-colors hidden sm:inline-block"
                title="Wishlist"
              >
                <HiOutlineHeart className="w-[20px] h-[20px]" />
              </Link>

              {/* Cart Button with Count Badge */}
              <button 
                onClick={openCart} 
                className="relative text-[#1a1a1a] hover:text-[#555] p-1 transition-colors cursor-pointer" 
                aria-label="Cart"
              >
                <HiOutlineShoppingBag className="w-[20px] h-[20px]" />
                {hydrated && itemCount > 0 && (
                  <span className="absolute -top-[2px] -right-[2px] min-w-[16px] h-[16px] rounded-full bg-[#1a1a1a] text-white text-[10px] font-medium flex items-center justify-center px-[4px]">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center justify-center w-[20px] h-[20px] text-[#1a1a1a] hover:text-[#555] font-semibold transition-colors cursor-pointer"
                      title={user.user_metadata?.name || user.email}
                    >
                      <HiOutlineUser className="w-[20px] h-[20px]" />
                    </button>
                    <AnimatePresence>
                      {userDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                          <div
                            className="absolute right-0 mt-2 w-56 bg-white border border-[#e5e5e5] rounded-md p-2 z-50 shadow-lg text-left"
                          >
                            <div className="px-4 py-3 border-b border-[#e5e5e5] mb-1.5">
                              <p className="text-sm font-semibold text-[#1a1a1a] truncate">
                                {user.user_metadata?.name || "Customer"}
                              </p>
                              <p className="text-xs text-[#555] truncate mt-0.5">
                                {user.email}
                              </p>
                            </div>
                            <Link
                              href="/wishlist"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded hover:bg-[#f5f5f5] text-sm text-[#555] hover:text-[#1a1a1a] transition-all"
                            >
                              <HiOutlineHeart className="w-4 h-4 text-[#555]" />
                              My Wishlist
                            </Link>
                            <Link
                              href="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded hover:bg-[#f5f5f5] text-sm text-[#555] hover:text-[#1a1a1a] transition-all"
                            >
                              <HiOutlineUser className="w-4 h-4 text-[#555]" />
                              Admin Panel
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded hover:bg-red-50 text-sm text-red-500 hover:text-red-600 transition-all text-left cursor-pointer"
                            >
                              <HiOutlineArrowRightOnRectangle className="w-4 h-4 text-red-500" />
                              Log Out
                            </button>
                          </div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-[#1a1a1a] hover:text-[#555] p-1 transition-colors flex items-center justify-center"
                    title="Sign In"
                  >
                    <HiOutlineUser className="w-[20px] h-[20px]" />
                  </Link>
                )}
              </div>

              {/* Hamburger Mobile Toggle */}
              <button 
                onClick={() => setIsMobileOpen(!isMobileOpen)} 
                className="md:hidden text-[#1a1a1a] hover:text-[#555] p-1 transition-colors cursor-pointer" 
                aria-label="Menu"
              >
                {isMobileOpen ? <HiOutlineXMark className="w-[20px] h-[20px]" /> : <HiOutlineBars3 className="w-[20px] h-[20px]" />}
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH OVERLAY */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: 0.3 }} 
              className="absolute left-0 right-0 top-[64px] bg-white border-b border-[#e5e5e5] shadow-md overflow-hidden z-40"
            >
              <form onSubmit={handleSearch} className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative flex items-center">
                  <HiOutlineMagnifyingGlass className="absolute left-4 w-5 h-5 text-[#555]" />
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Search products..." 
                    className="w-full bg-[#f5f5f5] border border-[#e5e5e5] rounded pl-12 pr-4 py-3 text-sm text-[#1a1a1a] placeholder-[#888] focus:outline-none focus:border-[#1a1a1a] transition-all" 
                    autoFocus 
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MOBILE LEFT SLIDE-IN DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/50 backdrop-blur-xs" 
              onClick={() => setIsMobileOpen(false)} 
            />
            {/* Drawer */}
            <motion.nav 
              initial={{ x: "-100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "-100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }} 
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col p-6 shadow-2xl safe-bottom z-50"
            >
              <div className="flex items-center justify-between pb-6 border-b border-[#e5e5e5] mb-4">
                <span className="text-base font-semibold tracking-wider text-[#1a1a1a]">MENU</span>
                <button onClick={() => setIsMobileOpen(false)} className="text-[#1a1a1a] hover:text-[#555]">
                  <HiOutlineXMark className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileOpen(false)} 
                    className="h-[48px] flex items-center text-sm font-medium text-[#555] hover:text-[#1a1a1a] border-b border-[#e5e5e5] transition-all"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link 
                  href="/wishlist" 
                  onClick={() => setIsMobileOpen(false)} 
                  className="h-[48px] flex items-center text-sm font-medium text-[#555] hover:text-[#1a1a1a] border-b border-[#e5e5e5] transition-all"
                >
                  My Wishlist
                </Link>
                <Link 
                  href="/admin" 
                  onClick={() => setIsMobileOpen(false)} 
                  className="h-[48px] flex items-center text-sm font-medium text-[#555] hover:text-[#1a1a1a] border-b border-[#e5e5e5] transition-all"
                >
                  Admin Panel
                </Link>
              </div>

              <div className="mt-auto border-t border-[#e5e5e5] pt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-semibold text-[#1a1a1a] truncate">{user.user_metadata?.name || "Customer"}</p>
                    <p className="text-xs text-[#555] truncate">{user.email}</p>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileOpen(false); }} 
                      className="mt-4 text-xs font-semibold text-red-500 hover:text-red-600 transition-colors text-left flex items-center gap-1 cursor-pointer"
                    >
                      <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setIsMobileOpen(false)} 
                    className="block text-center bg-[#1a1a1a] text-white py-3 rounded text-sm font-medium hover:bg-[#333] transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
