"use client";

import React from "react";
import Image from "next/image";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Sparkles, Crown, ArrowRight, ShieldCheck } from "lucide-react";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";

export function ExecutiveLookFeature() {
  const waUrl = buildServiceInquiryWhatsAppUrl("Hair and Beard Styling", "Additional Grooming Services");

  return (
    <section
      aria-label="Executive Grooming Synergy Feature"
      className="relative py-16 sm:py-24 bg-[#080C0A] border-y border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#C59B46]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column (6 cols): Modern Editorial Information */}
          <AnimatedReveal direction="left" delay={0.1} className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3 select-none">
              <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.25em] uppercase text-[#C59B46]">
                <span className="w-8 h-[2px] bg-[#C59B46]" />
                <span>Executive Transformation</span>
              </div>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5EFEB] leading-[1.15] tracking-tight">
                <span>Hair &amp; Beard Coordination</span>
                <br />
                <span className="italic text-[#C59B46]">Tailored to Your Bone Structure</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#B8B0A2] font-normal leading-relaxed max-w-xl">
              True grooming is an architectural synergy. Our barbers analyze head shape, growth patterns, and jawline angles to deliver a seamless transition from temple skin fades into full, sculpted beard density.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#111614] border border-white/[0.08] space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#DFC074]">
                  <Crown className="w-4 h-4 text-[#C59B46]" />
                  <span>VIP Proportions</span>
                </div>
                <p className="text-[11px] text-[#A8A193]">Balanced temple tapers meeting custom sideburn gradients.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111614] border border-white/[0.08] space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#DFC074]">
                  <ShieldCheck className="w-4 h-4 text-[#C59B46]" />
                  <span>Long-Lasting Hold</span>
                </div>
                <p className="text-[11px] text-[#A8A193]">Styling clay &amp; beard balm application for all-day definition.</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                href={waUrl}
                variant="gold"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Book Complete Styling Combo (Rs. 1,500)
              </Button>
            </div>

          </AnimatedReveal>

          {/* Right Column (6 cols): Big Seamless HD Cutout Image (Zero Cropped Edges) */}
          <AnimatedReveal direction="right" delay={0.15} className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none h-[420px] sm:h-[500px] lg:h-[600px] group flex flex-col justify-end">
              <Image
                src="/images/cutout-hair-beard.webp"
                alt="Executive hair and beard grooming synergy at R.B Makeover Man's Salon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />

              {/* Bottom Scrim blending seamlessly into dark background */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080C0A] via-[#080C0A]/40 to-transparent pointer-events-none" />

              {/* Floating Modern HD Caption */}
              <div className="relative z-10 mx-2 sm:mx-6 mb-4 p-3.5 sm:p-4 rounded-2xl bg-[#0E1411]/90 backdrop-blur-md border border-[#C59B46]/30 text-center shadow-2xl select-none">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#C59B46] font-bold block mb-0.5">
                  ✦ THE EXECUTIVE STANDARD • COMPLETE GROOMING SYNERGY
                </span>
                <p className="font-['Playfair_Display',Georgia,serif] text-xs sm:text-sm text-[#F5EFEB] font-normal">
                  Harmonized hair &amp; beard proportions crafted for confidence and executive poise.
                </p>
              </div>
            </div>
          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
