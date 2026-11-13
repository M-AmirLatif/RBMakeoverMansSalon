"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { fetchServices, SiteService, resolveServicePrice, defaultServices } from "@/lib/supabase/queries";
import {
  Scissors,
  Flame,
  Sparkles,
  Crown,
  Feather,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

interface PrecisionCardDef {
  title: string;
  subtitle: string;
  serviceQuery: string;
  fallbackPrice: string;
  icon: React.ReactNode;
  anchor: string;
}

const leftCardDefs: PrecisionCardDef[] = [
  {
    title: "Hair Care & Fades",
    subtitle: "Precision scissor cuts, taper fades & styling",
    serviceQuery: "kids-haircuts",
    fallbackPrice: "Rs. 700",
    icon: <Scissors className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Beard Sculpting",
    subtitle: "Sharp razor lineups, shaping & oil treatment",
    serviceQuery: "beard-trimming",
    fallbackPrice: "Rs. 600",
    icon: <Flame className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Facial Care & Glow",
    subtitle: "Deep pore cleanse, steam & hydration mask",
    serviceQuery: "facial-massage",
    fallbackPrice: "Rs. 1,600",
    icon: <Sparkles className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
];

const rightCardDefs: PrecisionCardDef[] = [
  {
    title: "Men's Haircut",
    subtitle: "Classic executive cuts & modern textured styling",
    serviceQuery: "mens-haircuts",
    fallbackPrice: "Rs. 1,000",
    icon: <Crown className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Royal Shave",
    subtitle: "Straight razor shave with hot towel prep",
    serviceQuery: "pro-shave",
    fallbackPrice: "Rs. 700",
    icon: <Feather className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
  {
    title: "Color & Treatment",
    subtitle: "Natural grey coverage, protein & scalp repair",
    serviceQuery: "hair-coloring",
    fallbackPrice: "Rs. 2,000",
    icon: <ShieldCheck className="w-5 h-5 text-[#C59B46]" />,
    anchor: "#services",
  },
];

export function PrecisionSection() {
  const [services, setServices] = useState<SiteService[]>(defaultServices);

  useEffect(() => {
    let mounted = true;
    fetchServices().then((list) => {
      if (mounted && list && list.length > 0) {
        setServices(list);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="precision"
      aria-label="Precision in Every Cut"
      className="py-10 sm:py-20 lg:py-24 bg-[#090D0B] relative overflow-hidden border-t border-white/[0.05]"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(197,155,70,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Precision Craft"
            titleCream="Precision in"
            titleGold="Every Cut"
            description="Comprehensive grooming solutions tailored for gentlemen in Park View City, Lahore."
          />
        </AnimatedReveal>

        {/* 3-Column Layout matching Noir & Blade */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 xl:gap-8 items-center mt-8 sm:mt-10">
          
          {/* Left Column (3 cards) */}
          <AnimatedReveal direction="left" delay={0.1} amount={0.05} className="lg:col-span-4 order-2 lg:order-1">
            <div className="flex flex-col gap-4 sm:gap-5">
              {leftCardDefs.map((card) => {
                const livePrice = resolveServicePrice(services, card.serviceQuery, card.fallbackPrice);
                return (
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
                          From {livePrice}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A756B] group-hover:text-[#DFC074] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </a>
                );
              })}
            </div>
          </AnimatedReveal>

          {/* Center Column: Portrait Model with blurred seamless edges */}
          <AnimatedReveal direction="scale" delay={0.15} amount={0.05} className="lg:col-span-4 order-1 lg:order-2 flex justify-center">
            <div
              className="relative w-full max-w-[340px] sm:max-w-[400px] h-[400px] sm:h-[480px] lg:h-[540px] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-black group"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 92% 92% at 50% 50%, black 65%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 92% 92% at 50% 50%, black 65%, transparent 100%)'
              }}
            >
              <Image
                src="/images/cutout-precision-taper.webp"
                alt="Precision razor drop fade haircut model at R.B Makeover"
                fill
                unoptimized
                loading="eager"
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#0E1411]/90 backdrop-blur-md border border-[#C59B46]/30 text-center shadow-lg">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C59B46] block mb-0.5">
                  ✦ MASTER BARBER ARCHITECTURE
                </span>
                <span className="font-['Playfair_Display',Georgia,serif] text-xs text-[#F5EFEB] font-normal">
                  Surgical Lineups &amp; Skin Drop Fades
                </span>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column (3 cards) */}
          <AnimatedReveal direction="right" delay={0.2} amount={0.05} className="lg:col-span-4 order-3">
            <div className="flex flex-col gap-4 sm:gap-5">
              {rightCardDefs.map((card) => {
                const livePrice = resolveServicePrice(services, card.serviceQuery, card.fallbackPrice);
                return (
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
                          From {livePrice}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A756B] group-hover:text-[#DFC074] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </a>
                );
              })}
            </div>
          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
