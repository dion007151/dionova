"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  HiOutlineChartBarSquare,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: <HiOutlineChartBarSquare className="w-5 h-5" />,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: <HiOutlineCube className="w-5 h-5" />,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-dark-400 hover:text-primary-400 transition-colors mb-2"
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Admin <span className="gradient-text">Panel</span>
            </h1>
          </div>
        </div>

        {/* Admin Nav */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-1.5 mb-8 flex gap-1 overflow-x-auto scrollbar-hide"
        >
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                pathname === link.href
                  ? "gradient-bg text-white shadow-lg shadow-primary-500/20"
                  : "text-dark-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </motion.nav>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
