import Link from "next/link";
import { 
  HiOutlineHeart,
} from "react-icons/hi2";
import { 
  FaInstagram, 
  FaTiktok, 
  FaFacebookF 
} from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full bg-[#111] text-white">
      {/* NEWSLETTER STRIP (above main footer) */}
      <div className="bg-[#1a1a1a] border-b border-[#222] py-[48px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h3 className="text-[22px] font-medium text-white mb-1" style={{ fontFamily: "var(--font-outfit)" }}>
              Stay in the loop
            </h3>
            <p className="text-[14px] text-[#888]">
              New arrivals, exclusive offers, no spam.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-[12px] max-w-md w-full">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-[#2a2a2a] border border-[#333] text-white placeholder-[#888] h-[44px] px-4 rounded-[4px] text-sm focus:outline-none focus:border-white/40 flex-1"
            />
            <button className="bg-white text-[#1a1a1a] h-[44px] px-6 rounded-[4px] font-medium text-sm hover:bg-white/90 transition-colors cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-[64px] pb-[40px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12 mb-[48px]">
          {/* Col 1 (wider) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link href="/" className="flex items-center">
              <span className="text-[15px] font-semibold tracking-[0.15em] text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                DIONOVA
              </span>
              <span className="w-[6px] h-[6px] bg-white inline-block ml-[2px] self-end mb-[4.5px]" />
            </Link>
            <p className="text-[13px] text-[#666] leading-relaxed">
              Premium goods, extraordinary life.
            </p>
            <div className="flex items-center gap-[16px] mt-2">
              <a href="#" className="text-[#666] hover:text-white transition-colors text-lg" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" className="text-[#666] hover:text-white transition-colors text-lg" aria-label="TikTok">
                <FaTiktok />
              </a>
              <a href="#" className="text-[#666] hover:text-white transition-colors text-lg" aria-label="Facebook">
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="lg:col-span-2/12 flex flex-col">
            <h3 className="text-[11px] text-[#555] tracking-[0.1em] font-semibold uppercase mb-4">
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: "New Arrivals", href: "/products?sort=newest" },
                { name: "Best Sellers", href: "/products" },
                { name: "Sale", href: "/products" },
                { name: "All Products", href: "/products" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[13px] text-[#666] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div className="lg:col-span-2/12 flex flex-col">
            <h3 className="text-[11px] text-[#555] tracking-[0.1em] font-semibold uppercase mb-4">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: "FAQ", href: "/shipping-info" },
                { name: "Shipping Info", href: "/shipping-info" },
                { name: "Returns Policy", href: "/returns-policy" },
                { name: "Contact Us", href: "/contact-us" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[13px] text-[#666] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div className="lg:col-span-2/12 flex flex-col">
            <h3 className="text-[11px] text-[#555] tracking-[0.1em] font-semibold uppercase mb-4">
              Company
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Blog", href: "#" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/privacy-policy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[13px] text-[#666] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-[#222] pt-[24px] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#555]">
            © 2025 DIONOVA. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {["GCash", "Visa", "Mastercard", "COD"].map((badge) => (
              <span 
                key={badge} 
                className="bg-[#222] text-[#888] text-[11px] font-medium rounded-[3px] px-2 py-[3px] border border-transparent"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
