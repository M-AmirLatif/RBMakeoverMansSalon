"use client";

import React from "react";
import Image from "next/image";
import { reviews, reviewsSummary } from "@/data/reviews";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Star, ShieldCheck } from "lucide-react";
import { GoogleGIcon } from "@/components/ui/Icons";

export function TestimonialsSection() {
  // Group reviews: left 2 and right 2 around the center chair
  const leftReviews = [reviews[0], reviews[1]]; // Hamza Ch, Muhammad Bilal
  const rightReviews = [reviews[2], reviews[3]]; // Ibrahim Arshad, Abdullah Tariq
  const additionalReviews = reviews.slice(4); // Usman Ghani, Muhammad Ahmad, etc.

  return (
    <section
      id="reviews"
      aria-label="Voices of Our Happy Clients"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#090D0B] border-b border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting (GPU texture gradient without heavy blur filter) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(197,155,70,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading: Voices of Our Happy Client (Noir & Blade style) */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Testimonials"
            titleCream="Voices of"
            titleGold="Our Happy"
            titleSuffix="Clients"
            description="Genuine Google customer reviews from clients in Park View City, Lahore."
          />
        </AnimatedReveal>

        {/* Rating Summary Pill Strip */}
        <AnimatedReveal direction="up" delay={0.1} amount={0.05} className="max-w-xl mx-auto mb-10 sm:mb-14 flex items-center justify-between p-3.5 sm:p-4 rounded-full bg-[#111614] border border-white/[0.08] shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 shrink-0">
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
                      className="w-3 h-3 fill-[#C59B46] text-[#C59B46]"
                    />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-[#A8A193]">
                {reviewsSummary.reviewCount} Verified Google Reviews
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C59B46]/10 border border-[#C59B46]/25 text-[11px] text-[#C59B46] font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Google Verified</span>
          </div>
        </AnimatedReveal>

        {/* DESKTOP 3-COLUMN COMPOSITION: Left Cards | Center Vintage Barber Chair | Right Cards (Noir & Blade exact layout) */}
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
                    5.0 ★
                  </span>
                </div>

                <p className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base text-[#F5EFEB] leading-relaxed italic">
                  &ldquo;{rev.summary}&rdquo;
                </p>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F5EFEB]">{rev.author}</div>
                    <div className="text-[10px] text-[#A8A193]">{rev.source}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#C59B46] font-medium">
                    <GoogleGIcon className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedReveal>

          {/* Center Column: Luxury Vintage Barber Chair (Smooth blurred edges, no hard border) */}
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
                    5.0 ★
                  </span>
                </div>

                <p className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base text-[#F5EFEB] leading-relaxed italic">
                  &ldquo;{rev.summary}&rdquo;
                </p>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#F5EFEB]">{rev.author}</div>
                    <div className="text-[10px] text-[#A8A193]">{rev.source}</div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#C59B46] font-medium">
                    <GoogleGIcon className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedReveal>

        </div>

        {/* Additional Customer Reviews Grid below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {additionalReviews.slice(0, 3).map((rev) => (
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
                  5.0 ★
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#B8B0A2] leading-relaxed line-clamp-3">
                &ldquo;{rev.summary}&rdquo;
              </p>

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F5EFEB]">{rev.author}</span>
                <span className="text-[#C59B46] text-[11px] font-medium">Verified Google Review</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
