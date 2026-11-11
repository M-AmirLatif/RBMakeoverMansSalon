"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import {
  Scissors,
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Feather,
  Crown,
} from "lucide-react";

interface PrecisionCard {
  title: string;
  subtitle: string;
  priceNote: string;
  icon: React.ReactNode;
  anchor: string;
}

const leftCards: PrecisionCard[] = [
  {
    title: "Hair Care & Fades",
    subtitle: "Precision scissor cuts, taper fades & styling",
    priceNote: "From Rs. 700",
    icon: <Scissors className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Beard Sculpting",
    subtitle: "Sharp razor lineups, shaping & oil treatment",
    priceNote: "From Rs. 450",
    icon: <Flame className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Facial Care & Glow",
    subtitle: "Deep pore cleanse, steam & hydration mask",
    priceNote: "From Rs. 800",
    icon: <Sparkles className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
];

const rightCards: PrecisionCard[] = [
  {
    title: "Men's Haircut",
    subtitle: "Classic executive cuts & modern textured styling",
    priceNote: "From Rs. 1,000",
    icon: <Crown className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Royal Shave",
    subtitle: "Straight razor shave with hot towel prep",
    priceNote: "From Rs. 500",
    icon: <Feather className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Color & Treatment",
    subtitle: "Natural grey coverage, protein & scalp repair",
    priceNote: "From Rs. 1,000",
    icon: <ShieldCheck className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
];

export function PrecisionSection() {
  return (
    <section
      id="precision"
      aria-label="Precision in Every Cut"
      className="py-16 sm:py-24 bg-[#090D0B] relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C59B46]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          eyebrow="Precision Craft"
          titleCream="Precision in"
          titleGold="Every Cut"
          description="Comprehensive grooming solutions tailored for gentlemen in Park View City, Lahore."
        />

        {/* 3-Column Layout matching Noir & Blade */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center mt-10">
          
          {/* Left Column (3 cards) */}
          <AnimatedReveal direction="left" delay={0.1} className="lg:col-span-4 order-2 lg:order-1">
            <div className="flex flex-col gap-4 sm:gap-5">
              {leftCards.map((card) => (
                <a
                  key={card.title}
                  href={card.anchor}
                  className="group p-5 rounded-2xl bg-[#111614] border border-white/[0.08] hover:border-[#C59B46]/40 transition-all duration-300 shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C59B46]/10 border border-[#C59B46]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-['Playfair_Display',Georgia,serif] text-base sm:text-lg font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#A8A193] mt-0.5 line-clamp-1">
                        {card.subtitle}
                      </p>
                      <span className="text-[11px] font-semibold text-[#C59B46] font-mono mt-1 block">
                        {card.priceNote}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#C59B46] text-[#A8A193] group-hover:text-[#0B0F0D] flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </AnimatedReveal>

          {/* Center Column: Tall Portrait of Gentleman (matching Noir & Blade centerpiece) */}
          <AnimatedReveal direction="scale" delay={0.15} className="lg:col-span-4 order-1 lg:order-2">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-none mx-auto h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border border-[#C59B46]/35 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              <Image
                src="/images/hero-gentleman-profile.webp"
                alt="Gentleman profile with precision fade and groomed beard at R.B Makeover Man's Salon"
                fill
                sizes="(max-width: 1024px) 380px, 400px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Scrim gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-transparent to-transparent pointer-events-none" />

              {/* Badge overlay on center portrait */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0B0F0D]/85 backdrop-blur-md border border-white/10 text-center shadow-xl">
                <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C59B46] block mb-0.5">
                  The Gentleman Look
                </span>
                <p className="font-['Playfair_Display',Georgia,serif] text-base text-[#F5EFEB]">
                  Tailored styling for every face shape
                </p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column (3 cards) */}
          <AnimatedReveal direction="right" delay={0.2} className="lg:col-span-4 order-3">
            <div className="flex flex-col gap-4 sm:gap-5">
              {rightCards.map((card) => (
                <a
                  key={card.title}
                  href={card.anchor}
                  className="group p-5 rounded-2xl bg-[#111614] border border-white/[0.08] hover:border-[#C59B46]/40 transition-all duration-300 shadow-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#C59B46]/10 border border-[#C59B46]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-['Playfair_Display',Georgia,serif] text-base sm:text-lg font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#A8A193] mt-0.5 line-clamp-1">
                        {card.subtitle}
                      </p>
                      <span className="text-[11px] font-semibold text-[#C59B46] font-mono mt-1 block">
                        {card.priceNote}
                      </span>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#C59B46] text-[#A8A193] group-hover:text-[#0B0F0D] flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </AnimatedReveal>

        </div>

        {/* Action Button underneath */}
        <div className="mt-12 text-center">
          <Button
            href="#services"
            variant="gold"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Full Grooming Menu & Rates
          </Button>
        </div>

      </div>
    </section>
  );
}
