"use client";

import React, { useState } from "react";
import { Star, X, CheckCircle2, Sparkles, Send } from "lucide-react";
import { staffBarbers } from "@/data/team";
import { defaultServices } from "@/lib/supabase/queries";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: (newReview: {
    id: string;
    author: string;
    rating: number;
    summary: string;
    service?: string;
    barber?: string;
    source: string;
    createdAt: string;
  }) => void;
}

export function WriteReviewModal({
  isOpen,
  onClose,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [service, setService] = useState("");
  const [barber, setBarber] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name to post a review.");
      return;
    }

    if (!text.trim() || text.trim().length < 5) {
      setError("Please write at least a few words about your experience (minimum 5 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          rating,
          text: text.trim(),
          service: service || undefined,
          barber: barber || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setSuccess(true);
      onReviewSubmitted(data.review);

      setTimeout(() => {
        setSuccess(false);
        setName("");
        setText("");
        setService("");
        setBarber("");
        setRating(5);
        onClose();
      }, 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="write-review-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-[#0E1411] border border-[#C59B46]/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#C59B46] text-[#A8A193] hover:text-[#DFC074] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close review dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C59B46]/10 border border-[#C59B46]/30 text-[10px] font-mono uppercase tracking-widest text-[#DFC074] mb-2">
            <Sparkles className="w-3 h-3 text-[#C59B46]" />
            <span>Public Client Review</span>
          </div>
          <h2
            id="write-review-title"
            className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-medium text-[#F5EFEB]"
          >
            Share Your Experience
          </h2>
          <p className="text-xs text-[#A8A193] mt-1 max-w-sm mx-auto">
            No account required. Your review helps other gentlemen in Park View City discover our master craft.
          </p>
        </div>

        {/* Success State */}
        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-medium text-[#F5EFEB]">
              Review Submitted!
            </h3>
            <p className="text-xs text-[#A8A193] max-w-xs">
              Thank you, <span className="text-[#DFC074] font-semibold">{name}</span>. Your review has been added to our website.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Rating Stars Selector */}
            <div className="flex flex-col items-center justify-center py-2 bg-black/40 rounded-2xl border border-white/[0.06]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#A8A193] mb-1.5">
                Your Rating
              </span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 text-[#C59B46] hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled
                            ? "fill-[#C59B46] text-[#C59B46]"
                            : "text-[#7A756B] stroke-[1.5]"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-[#DFC074] mt-1 font-mono">
                {hoverRating !== null ? hoverRating : rating}.0 / 5.0
              </span>
            </div>

            {/* Name Input (MANDATORY) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#DFC074] mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Muhammad Bilal"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#C59B46] focus:ring-1 focus:ring-[#C59B46] text-sm text-[#F5EFEB] placeholder-[#7A756B] transition-colors outline-none"
              />
            </div>

            {/* Service & Barber Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5">
                  Service Received <span className="text-[10px] text-[#7A756B] font-normal">(Optional)</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#C59B46] text-xs text-[#F5EFEB] transition-colors outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0E1411]">Select service...</option>
                  {defaultServices.map((svc) => (
                    <option key={svc.id} value={svc.name} className="bg-[#0E1411]">
                      {svc.name} ({svc.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5">
                  Stylist / Barber <span className="text-[10px] text-[#7A756B] font-normal">(Optional)</span>
                </label>
                <select
                  value={barber}
                  onChange={(e) => setBarber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#C59B46] text-xs text-[#F5EFEB] transition-colors outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0E1411]">Any barber...</option>
                  {staffBarbers.map((b) => (
                    <option key={b.id} value={b.name} className="bg-[#0E1411]">
                      {b.name} ({b.title})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Review Feedback / Experience (MANDATORY) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#DFC074] mb-1.5">
                Your Review <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts on the haircut precision, barber courtesy, atmosphere, or hygiene..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 focus:border-[#C59B46] focus:ring-1 focus:ring-[#C59B46] text-sm text-[#F5EFEB] placeholder-[#7A756B] transition-colors outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#C59B46] via-[#DFC074] to-[#C59B46] hover:brightness-110 active:brightness-95 text-[#0B0F0D] font-bold text-sm uppercase tracking-wider transition-all shadow-[0_10px_25px_rgba(197,155,70,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <span>Posting Review...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
