"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineArrowRight } from "react-icons/hi2";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      const data = res?.data;
      if (data?.user) {
        router.push(redirectUrl);
      }
    });
  }, [router, redirectUrl, supabase.auth]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      // Set cookie for middleware access
      if (typeof window !== "undefined") {
        document.cookie = `dionova_mock_user=${encodeURIComponent(
          JSON.stringify(data.user || { email, user_metadata: { name } })
        )}; path=/; max-age=86400`;
      }

      toast.success("Successfully registered!");
      
      // Auto-login or redirect
      window.location.href = redirectUrl;
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center relative px-4">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 sm:p-10 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/45 transition-shadow">
              <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-outfit)" }}>D</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-outfit)" }}>
              DION<span className="gradient-text">OVA</span>
            </span>
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>
            Create Account
          </h2>
          <p className="text-sm text-dark-400">
            Sign up to track orders, review products, and save wishlists.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-300 mb-1.5 font-medium">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-300 mb-1.5 font-medium">Email Address</label>
            <div className="relative">
              <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-dark-300 mb-1.5 font-medium">Password</label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="input-field pl-11"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-6 font-semibold flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                Sign Up
                <HiOutlineArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-dark-400">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-primary-500 animate-spin" />
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
