import Link from "next/link";
import { HiOutlineHeart } from "react-icons/hi2";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-outfit)" }}>D</span>
              </div>
              <span
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                DION<span className="gradient-text">OVA</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">
              Discover extraordinary products. A next-generation marketplace
              with curated collections and premium shopping experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-white font-semibold mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { name: "All Products", href: "/products" },
                { name: "Featured", href: "/products?featured=true" },
                { name: "New Arrivals", href: "/products?sort=newest" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-dark-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3
              className="text-white font-semibold mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Support
            </h3>
            <ul className="space-y-3">
              {["Shipping Info", "Returns Policy", "Contact Us"].map((name) => (
                <li key={name}>
                  <span className="text-dark-400 text-sm cursor-default">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 sm:col-span-1">
            <h3
              className="text-white font-semibold mb-3 sm:mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Stay Updated
            </h3>
            <p className="text-dark-400 text-sm mb-3 sm:mb-4">
              Get notified about new products and exclusive deals.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field flex-1 min-w-0 py-2.5 text-sm"
              />
              <button className="btn-primary py-2.5 px-4 text-sm flex-shrink-0">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-dark-500 text-sm">
            © 2026 DIONOVA. All rights reserved.
          </p>
          <p className="text-dark-500 text-sm flex items-center gap-1">
            Built with <HiOutlineHeart className="w-4 h-4 text-primary-500" />{" "}
            for extraordinary experiences
          </p>
        </div>
      </div>
    </footer>
  );
}
