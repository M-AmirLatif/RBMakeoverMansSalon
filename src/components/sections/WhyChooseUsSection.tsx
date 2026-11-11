"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Sparkles, Scissors } from "lucide-react";

interface WhyChooseItem {
  num: string;
  title: string;
  description: string;
  attribution: string;
}

const reasons: WhyChooseItem[] = [
  {
    num: "01",
    title: "Professional staff",
    description: "Customers consistently highlight our cooperative and skilled staff members.",
    attribution: "As noted in customer reviews by Muhammad Bilal & Ibrahim Arshad",
  },
  {
    num: "02",
    title: "Satisfied customers",
    description: "Visitors share positive feedback about their haircuts and grooming experiences.",
    attribution: "Reflected in 36 Google reviews",
  },
  {
    num: "03",
    title: "Comfortable environment",
    description: "A comfortable salon atmosphere, as customers describe it.",
    attribution: "Mentioned by reviewer Muhammad Safeer",
  },
  {
    num: "04",
    title: "Facial & skincare care",
    description: "Attention to facial massage and skincare grooming needs.",
    attribution: "Highlighted by customer reviews on Google",
  },
  {
    num: "05",
    title: "4.9 on Google",
    description: "A 4.9 out of 5.0 star rating based on 36 customer reviews.",
    attribution: "Public rating on Google Maps listing",
  },
  {
    num: "06",
    title: "Park View City location",
    description: "Centrally situated at Rose Commercial on Main Boulevard for easy neighborhood access.",
    attribution: "Rose Commercial, Main Boulevard, Park View City, Lahore",
  },
];

export function WhyChooseUsSection() {
  return (
    <section
      id="why-us"
      aria-label="Why Choose R.B Makeover"
      className="relative py-20 sm:py-28 bg-[#121815] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          eyebrow="Why Choose Us"
          titleCream="Why Customers"
          titleGold="Choose R.B Makeover"
          description="Customer feedback and details from our Rose Commercial salon in Park View City."
        />

        {/* Editorial Numbered List: 2 Columns Desktop, Large Condensed Numerals, Hairline Dividers, NO BOXES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-10 mt-12">
          {reasons.map((item, idx) => (
            <AnimatedReveal
              key={item.num}
              direction="up"
              delay={idx * 0.08}
              className="relative pb-8 border-b border-white/[0.08] flex items-start gap-6 group"
            >
              {/* Large Condensed Numeral in Gold (Bebas Neue) */}
              <div className="font-['Bebas_Neue',sans-serif] text-4xl sm:text-5xl text-[#C59B46] leading-none shrink-0 w-12 sm:w-14 select-none">
                {item.num}
              </div>

              {/* Content */}
              <div className="space-y-1.5 flex-1">
                <h3 className="font-['Playfair_Display',Georgia,serif] text-xl sm:text-2xl font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[#B8B0A2] leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[11px] text-[#7A756B] pt-1">
                  {item.attribution}
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>

        {/* ============================================================ */}
        {/* NEWLY ADDED HD EDITORIAL VISUAL BAND (BORDERLESS DARK LUXURY) */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-12 border-t border-white/[0.08]">
          
          {/* Visual 1: Vintage Hydraulic Barber Chair */}
          <AnimatedReveal direction="up" delay={0.1} className="group relative rounded-3xl overflow-hidden bg-black border border-white/[0.08] hover:border-[#C59B46]/40 transition-all duration-500 shadow-2xl">
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src="/images/vintage-barber-chair.webp"
                alt="Handcrafted leather reclining hydraulic barber chair at R.B Makeover Man's Salon"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
              
              {/* Top Tag */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C59B46]/30 text-[10px] font-bold tracking-widest text-[#DFC074] uppercase">
                ✦ CRAFT & COMFORT
              </div>

              {/* Bottom Modern HD Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#C59B46] font-semibold block">
                  VINTAGE RECLINING BARBER CHAIRS • ERGONOMIC RELAXATION
                </span>
                <p className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base text-[#F5EFEB] leading-snug">
                  Designed for extended hot towel shaves, beard treatments, and ultimate executive relaxation.
                </p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Visual 2: Artisanal Grooming Tools & Vanity */}
          <AnimatedReveal direction="up" delay={0.2} className="group relative rounded-3xl overflow-hidden bg-black border border-white/[0.08] hover:border-[#C59B46]/40 transition-all duration-500 shadow-2xl">
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src="/images/tools-styling-vanity.webp"
                alt="Artisanal shears, straight razors, and grooming vanity at R.B Makeover Man's Salon"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
              
              {/* Top Tag */}
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-[#C59B46]/30 text-[10px] font-bold tracking-widest text-[#DFC074] uppercase">
                ✦ STERILIZED HYGIENE
              </div>

              {/* Bottom Modern HD Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 space-y-1">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#C59B46] font-semibold block">
                  JAPANESE STEEL SHEARS & STERILIZED BARBER TOOLS
                </span>
                <p className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base text-[#F5EFEB] leading-snug">
                  Every blade, clipper guard, and scissor is professionally sanitized between every client.
                </p>
              </div>
            </div>
          </AnimatedReveal>

        </div>

      </div>
    </section>
  );
}
