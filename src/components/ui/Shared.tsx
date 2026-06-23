"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-[#eee] border-t-[#1a1a1a]"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-[#f5f4f0] rounded-lg shimmer mb-4" />
      <div className="space-y-2">
        <div className="h-3 bg-[#e8e6e0] rounded w-1/4" />
        <div className="h-4 bg-[#e8e6e0] rounded w-3/4" />
        <div className="h-3 bg-[#e8e6e0] rounded w-1/2" />
        <div className="h-5 bg-[#e8e6e0] rounded w-1/3" />
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
      <div className="text-[#ddd] mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">{title}</h3>
      <p className="text-[#aaa] text-sm max-w-sm mb-6">{description}</p>
      {action}
    </motion.div>
  );
}
