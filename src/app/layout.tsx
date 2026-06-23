import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { CartSidebar } from "@/components/layout/CartSidebar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "DIONOVA — Premium Marketplace",
  description:
    "Discover extraordinary products at DIONOVA. A next-generation marketplace with curated collections, seamless checkout, and premium shopping experience.",
  keywords: "marketplace, e-commerce, shop, premium, products, DIONOVA",
  openGraph: {
    title: "DIONOVA — Premium Marketplace",
    description: "Discover extraordinary products at DIONOVA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col" style={{ fontFamily: "var(--font-inter)" }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#2a2c33",
              color: "#e2e3e5",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#f05a1f", secondary: "#fff" },
            },
          }}
        />
        <Navbar />
        <CartSidebar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
