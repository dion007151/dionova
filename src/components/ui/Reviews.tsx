"use client";

import { useState, useEffect } from "react";
import { HiStar as HiStarSolid, HiOutlineStar as HiStarOutline, HiOutlineCheckBadge, HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reviewerFirstName: string | null;
  city: string | null;
  verifiedPurchase: boolean;
  createdAt: string;
}

interface ReviewsProps {
  productId: string;
}

export function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [firstName, setFirstName] = useState("");
  const [city, setCity] = useState("");

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: any) => {
      setUser(data?.user);
      if (data?.user) {
        setFirstName(data.user.user_metadata?.name || "");
      }
    });
  }, [supabase.auth]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          comment,
          reviewerFirstName: firstName || "Anonymous",
          city: city || "Manila",
          email: user?.email || "guest@dionova.com",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success("Review submitted successfully!");
      setModalOpen(false);
      // Reset form
      setComment("");
      setRating(5);
      // Refresh reviews list
      fetchReviews();
    } catch (error: any) {
      console.error("Submit review error:", error);
      toast.error(error.message || "Failed to submit review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === stars).length / totalReviews) * 100 : 0
  }));

  if (loading) {
    return (
      <div className="py-12 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-48 bg-white/5 rounded-xl"></div>
          <div className="md:col-span-2 space-y-4">
            <div className="h-32 bg-white/5 rounded-xl"></div>
            <div className="h-32 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 border-t border-white/5 mt-12">
      <h2 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Rating Breakdown */}
        <div className="glass-card p-6 md:col-span-1 h-fit">
          <div className="flex items-end gap-3 mb-6">
            <span className="text-5xl font-bold text-white tracking-tight">{averageRating}</span>
            <div className="pb-1">
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <HiStarSolid key={s} className={`w-5 h-5 ${s <= Math.round(parseFloat(averageRating)) ? "text-yellow-400" : "text-dark-600"}`} />
                ))}
              </div>
              <p className="text-sm text-dark-400">{totalReviews} Reviews</p>
            </div>
          </div>

          <div className="space-y-3">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-dark-300 w-8">{stars} <HiStarSolid className="inline w-3 h-3 text-dark-400 mb-0.5" /></span>
                <div className="flex-1 h-2 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary-500 rounded-full"
                  />
                </div>
                <span className="text-xs text-dark-500 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setModalOpen(true)} className="btn-secondary w-full mt-6 py-3 cursor-pointer">
            Write a Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-dark-400">No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map((review) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={review.id} 
                className="glass-light p-6 rounded-2xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{review.reviewerFirstName || "Anonymous"}</span>
                      {review.verifiedPurchase && (
                        <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                          <HiOutlineCheckBadge className="w-3.5 h-3.5" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dark-500">{review.city || "Manila"} • {new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <HiStarSolid key={s} className={`w-4 h-4 ${s <= review.rating ? "text-yellow-400" : "text-dark-600"}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-dark-300 text-sm leading-relaxed">{review.comment}</p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-card w-full max-w-lg p-6 sm:p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    Write a Review
                  </h3>
                  <button onClick={() => setModalOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white transition-all cursor-pointer">
                    <HiXMark className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-sm text-dark-300 mb-1.5 font-medium">Your Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-2xl hover:scale-110 transition-transform cursor-pointer"
                        >
                          {star <= rating ? (
                            <HiStarSolid className="w-8 h-8 text-yellow-400" />
                          ) : (
                            <HiStarOutline className="w-8 h-8 text-dark-600 hover:text-yellow-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-dark-300 mb-1.5 font-medium">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-dark-300 mb-1.5 font-medium">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Manila"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-dark-300 mb-1.5 font-medium">Review Comments</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="input-field min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="btn-secondary flex-1 py-3"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 py-3 disabled:opacity-50"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                      ) : (
                        "Submit Review"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
