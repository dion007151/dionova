"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from "react-icons/hi2";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill out all fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-outfit)" }}>
              Get in Touch
            </h1>
            <p className="text-dark-400 mb-12 max-w-md">
              Have a question about your order, our products, or just want to say hi? We'd love to hear from you. Fill out the form and our team will get back to you within 24 hours.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <HiOutlineEnvelope className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email Us</h3>
                  <p className="text-dark-400 text-sm">support@dionova.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <HiOutlinePhone className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Call Us</h3>
                  <p className="text-dark-400 text-sm">+63 917 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <HiOutlineMapPin className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Visit Us</h3>
                  <p className="text-dark-400 text-sm">Bonifacio Global City<br/>Taguig, Metro Manila, Philippines</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="input-field"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-400 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field min-h-[150px] resize-none"
                  placeholder="Tell us everything..."
                />
              </div>
              <button disabled={loading} className="btn-primary w-full py-4 disabled:opacity-50">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
