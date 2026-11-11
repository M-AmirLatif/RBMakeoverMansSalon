"use client";

import React from "react";
import Image from "next/image";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { Sparkles, Scissors, Flame, ArrowRight } from "lucide-react";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";

export function RoyalBeardFeature() {
  const waUrl = buildServiceInquiryWhatsAppUrl("Beard Sculpting", "Beard & Grooming");

  return (
    <section
      aria-label="Royal Beard Architecture Feature"
      className="relative py-16 sm:py-24 bg-black border-y border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-[#C59B46]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column (6 cols): Big Seamless HD Cutout Image (Zero Cropped Edges) */}
          <AnimatedReveal direction="left" delay={0.1} className="lg:col-span-6 flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none h-[420px] sm:h-[500px] lg:h-[600px] group flex flex-col justify-end">
              <Image
                src="/images/cutout-beard-sculpt.webp"
                alt="Artisanal beard sculpting and straight razor lineup at R.B Makeover Man's Salon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />

              {/* Bottom Scrim blending seamlessly into pure black */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

              {/* Floating Modern HD Caption */}
              <div className="relative z-10 mx-2 sm:mx-6 mb-4 p-3.5 sm:p-4 rounded-2xl bg-[#0E1411]/90 backdrop-blur-md border border-[#C59B46]/30 text-center shadow-2xl select-none">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#C59B46] font-bold block mb-0.5">
                  ✦ ARTISANAL BEARD ARCHITECTURE • STRAIGHT RAZOR SYMMETRY
                </span>
                <p className="font-['Playfair_Display',Georgia,serif] text-xs sm:text-sm text-[#F5EFEB] font-normal">
                  Hot towel steam prep, crisp razor cheek lines &amp; organic argan beard therapy.
                </p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column (6 cols): Modern Editorial Typography & Action */}
          <AnimatedReveal direction="right" delay={0.15} className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            
            <div className="space-y-3 select-none">
              <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.25em] uppercase text-[#C59B46]">
                <span className="w-8 h-[2px] bg-[#C59B46]" />
                <span>Signature Service Spotlight</span>
              </div>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5EFEB] leading-[1.15] tracking-tight">
                <span>Royal Beard Architecture</span>
                <br />
                <span className="italic text-[#C59B46]">From Rs. 600</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#B8B0A2] font-normal leading-relaxed max-w-xl">
              Sculpted to perfection by our master barbers in Park View City. Every beard service begins with hot eucalyptus steam towels to open pores, followed by precision straight-razor lineups and a nourishing botanical beard oil massage.
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#111614] border border-white/[0.08] space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#DFC074]">
                  <Flame className="w-4 h-4 text-[#C59B46]" />
                  <span>Hot Towel Prep</span>
                </div>
                <p className="text-[11px] text-[#A8A193]">Opens pores &amp; softens facial hair for a smooth glide.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111614] border border-white/[0.08] space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#DFC074]">
                  <Scissors className="w-4 h-4 text-[#C59B46] -rotate-45" />
                  <span>Razor Lineup</span>
                </div>
                <p className="text-[11px] text-[#A8A193]">Symmetrical cheek &amp; neckline contouring tailored to jawline.</p>
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
                Book Royal Beard Service on WhatsApp
              </Button>
            </div>

          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
