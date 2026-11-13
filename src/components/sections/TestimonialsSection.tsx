"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { reviews as staticReviews, reviewsSummary } from "@/data/reviews";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Star, ShieldCheck, PenLine, Sparkles } from "lucide-react";
import { GoogleGIcon } from "@/components/ui/Icons";
import { WriteReviewModal } from "@/components/ui/WriteReviewModal";

export interface DisplayReview {
  id: string;
  author: string;
  rating: number;
  summary: string;
  source: string;
  service?: string;
  barber?: string;
  createdAt?: string;
}

export function TestimonialsSection() {
  const [reviewsList, setReviewsList] = useState<DisplayReview[]>(staticReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviewsList(data.reviews);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  // Split reviews: left 2 and right 2 around center chair, remaining in grid
  const leftReviews = reviewsList.slice(0, 2);
  const rightReviews = reviewsList.slice(2, 4);
  const additionalReviews = reviewsList.slice(4);

  return (
    <section
      id="reviews"
      aria-label="Voices of Our Happy Clients"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#090D0B] border-b border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(197,155,70,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Testimonials"
            titleCream="Voices of"
            titleGold="Our Happy"
            titleSuffix="Clients"
            description="Genuine customer reviews and verified client feedback from gentlemen in Park View City, Lahore."
          />
        </AnimatedReveal>

        {/* Rating Summary & Write Review Button Bar */}
        <AnimatedReveal direction="up" delay={0.1} amount={0.05} className="max-w-2xl mx-auto mb-10 sm:mb-14 flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 sm:p-4 rounded-3xl sm:rounded-full bg-[#111614] border border-white/[0.08] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 shrink-0">
              <GoogleGIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Bebas_Neue',sans-serif] text-xl text-[#F5EFEB] leading-none">
                  {reviewsSummary.rating} / {reviewsSummary.maxRating}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-[#C59B46] text-[#C59B46]"
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-[#A8A193] mt-0.5">
                {reviewsList.length} Verified Client &amp; Google Reviews
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C59B46]/10 border border-[#C59B46]/25 text-[11px] text-[#C59B46] font-semibold whitespace-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Genuine</span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C59B46] via-[#DFC074] to-[#C59B46] hover:brightness-110 active:brightness-95 text-[#0B0F0D] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(197,155,70,0.3)] hover:scale-105 cursor-pointer shrink-0"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>
        </AnimatedReveal>

        {/* DESKTOP 3-COLUMN COMPOSITION: Left Cards | Center Vintage Barber Chair | Right Cards */}
        <div className="hidden lg:grid grid-cols-12 gap-6 xl:gap-8 items-center mb-12">
          
          {/* Left Column: 2 Testimonial Cards */}
          <AnimatedReveal direction="left" delay={0.1} amount={0.05} className="col-span-4 flex flex-col gap-6">
            {leftReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-[#111614] border border-white/[0.08] hover:border-[#C59B46]/35 transition-all duration-300 shadow-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C59B46] text-[#C59B46]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#C59B46] uppercase font-semibold">
                    {rev.rating}.0 ★
                  </span>
                </div>

                <p className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base text-[#F5EFEB] leading-relaxed italic">
                  &ldquo;{rev.summary}&rdquo;
                </p>

                {rev.service && (
                  <div className="text-[11px] text-[#DFC074] font-mono">
                    Service: {rev.service} {rev.barber ? `• Barber: ${rev.barber}` : ""}
                  </div>
                )}

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F5EFEB]">{rev.author}</div>
                    <div className="text-[10px] text-[#A8A193]">{rev.source}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#C59B46] font-medium">
                    <ShieldCheck className="w-3 h-3 text-[#C59B46]" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedReveal>

          {/* Center Column: Luxury Vintage Barber Chair */}
          <AnimatedReveal direction="scale" delay={0.15} amount={0.05} className="col-span-4 flex flex-col items-center justify-center">
            <div
              className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-[#111614] p-4 flex items-center justify-center group"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 92% 92% at 50% 50%, black 65%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 92% 92% at 50% 50%, black 65%, transparent 100%)'
              }}
            >
              <Image
                src="/images/vintage-barber-chair.webp"
                alt="Classic luxury hydraulic leather barber chair at R.B Makeover"
                fill
                sizes="(max-width: 1280px) 300px, 340px"
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090D0B] via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-xl bg-[#0B0F0D]/90 backdrop-blur-md border border-white/10 text-center shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C59B46] block">
                  The Barber Chair
                </span>
                <span className="text-xs text-[#F5EFEB] font-medium">
                  Reserved for Your Appointment
                </span>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column: 2 Testimonial Cards */}
          <AnimatedReveal direction="right" delay={0.2} className="col-span-4 flex flex-col gap-6">
            {rightReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-[#111614] border border-white/[0.08] hover:border-[#C59B46]/35 transition-all duration-300 shadow-xl space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C59B46] text-[#C59B46]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#C59B46] uppercase font-semibold">
                    {rev.rating}.0 ★
                  </span>
                </div>

                <p className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base text-[#F5EFEB] leading-relaxed italic">
                  &ldquo;{rev.summary}&rdquo;
                </p>

                {rev.service && (
                  <div className="text-[11px] text-[#DFC074] font-mono">
                    Service: {rev.service} {rev.barber ? `• Barber: ${rev.barber}` : ""}
                  </div>
                )}

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F5EFEB]">{rev.author}</div>
                    <div className="text-[10px] text-[#A8A193]">{rev.source}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#C59B46] font-medium">
                    <ShieldCheck className="w-3 h-3 text-[#C59B46]" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedReveal>

        </div>

        {/* Additional Customer Reviews Grid below */}
        {additionalReviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {additionalReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-[#111614] border border-white/[0.07] hover:border-[#C59B46]/30 transition-all duration-300 shadow-lg space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#C59B46] text-[#C59B46]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#C59B46] font-semibold">
                    {rev.rating}.0 ★
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#B8B0A2] leading-relaxed line-clamp-3">
                  &ldquo;{rev.summary}&rdquo;
                </p>

                {rev.service && (
                  <div className="text-[10px] text-[#DFC074] font-mono">
                    {rev.service}
                  </div>
                )}

                <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F5EFEB]">{rev.author}</span>
                  <span className="text-[#C59B46] text-[11px] font-medium">{rev.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={(newRev) => {
          setReviewsList((prev) => [newRev, ...prev]);
        }}
      />
    </section>
  );
}
