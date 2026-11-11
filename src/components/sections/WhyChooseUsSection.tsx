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

      </div>
    </section>
  );
}
