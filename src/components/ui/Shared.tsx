"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-dark-700 border-t-primary-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-dark-800 shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-dark-700 rounded-full w-1/3" />
        <div className="h-4 bg-dark-700 rounded-full w-3/4" />
        <div className="h-3 bg-dark-700 rounded-full w-1/2" />
        <div className="h-5 bg-dark-700 rounded-full w-1/4" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mb-4 text-dark-500">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "var(--font-outfit)" }}>{title}</h3>
      <p className="text-dark-400 text-sm max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
