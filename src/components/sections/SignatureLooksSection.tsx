"use client";

import React from "react";
import Image from "next/image";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Scissors, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";

interface SignatureLook {
  number: string;
  title: string;
  subtitle: string;
  image: string;
  caption: string;
  serviceName: string;
  category: string;
  price: string;
  tags: string[];
}

const signatureLooks: SignatureLook[] = [
  {
    number: "LOOK 01",
    title: "Low Drop Fade & Textured Quiff",
    subtitle: "Zero-gap clipper taper precision with scissor-sculpted natural crown volume.",
    image: "/images/menu-skin-fade.webp",
    caption: "PRECISION CRAFT • SCISSOR TEXTURE • SHARP TEMPLE CONTOURS",
    serviceName: "Skin Fade",
    category: "Haircuts & Styling",
    price: "Rs. 1,000",
    tags: ["Fade Specialist", "Custom Scissor Texture", "Razor Finish"],
  },
  {
    number: "LOOK 02",
    title: "Royal Beard Architecture",
    subtitle: "Straight razor symmetry, hot towel steam prep, and organic beard oil hydration.",
    image: "/images/menu-beard-sculpt.webp",
    caption: "BEARD ARCHITECTURE • HOT TOWEL STEAM • ARGAN OIL THERAPY",
    serviceName: "Beard Sculpting",
    category: "Beard & Grooming",
    price: "Rs. 600",
    tags: ["Razor Lineup", "Hot Towel Prep", "Argan Hydration"],
  },
  {
    number: "LOOK 03",
    title: "Executive Grooming Synergy",
    subtitle: "Complete hair and beard transformation designed around your facial symmetry.",
    image: "/images/menu-hair-beard-combo.webp",
    caption: "COMPLETE TRANSFORMATION • FACIAL SYMMETRY • VIP EXPERIENCE",
    serviceName: "Hair & Beard Styling",
    category: "Additional Grooming Services",
    price: "Rs. 1,500",
    tags: ["Full Synergy", "VIP Styling", "Facial Balance"],
  },
];

export function SignatureLooksSection() {
  return (
    <section
      id="signature-looks"
      aria-label="Editorial Signature Looks"
      className="relative py-20 sm:py-28 bg-black border-y border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C59B46]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          eyebrow="The Master Portfolio"
          titleCream="Editorial"
          titleGold="Signature Looks"
          description="High-definition gentleman grooming crafted by our 10 master barbers at Rose Commercial, Park View City."
        />

        {/* 3-Column Modern HD Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mt-14">
          {signatureLooks.map((look, idx) => {
            const waUrl = buildServiceInquiryWhatsAppUrl(look.serviceName, look.category);
            return (
              <AnimatedReveal
                key={look.number}
                direction="up"
                delay={idx * 0.12}
                className="group relative rounded-3xl bg-[#0D1210] border border-white/[0.08] hover:border-[#C59B46]/40 transition-all duration-500 overflow-hidden shadow-2xl flex flex-col justify-between"
              >
                {/* Image Container with seamless dark integration & hover zoom */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src={look.image}
                    alt={look.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1210] via-[#0D1210]/20 to-transparent pointer-events-none" />

                  {/* Top Badge: Look Number */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#C59B46]/30 text-[11px] font-bold tracking-widest text-[#DFC074] uppercase shadow-lg">
                    {look.number}
                  </div>

                  {/* Top Right: Verified Badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#C59B46]">
                    <Sparkles className="w-4 h-4" />
                  </div>

                  {/* Modern HD Caption Band at bottom of photo */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-center select-none">
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-[#C59B46] font-semibold block">
                      {look.caption}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold tracking-widest text-[#A8A193]">
                        {look.category}
                      </span>
                      <span className="text-sm font-bold text-[#DFC074] font-mono">
                        {look.price}
                      </span>
                    </div>

                    <h3 className="font-['Playfair_Display',Georgia,serif] text-xl sm:text-2xl font-normal text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors">
                      {look.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#A8A193] font-normal leading-relaxed">
                      {look.subtitle}
                    </p>
                  </div>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {look.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-white/[0.04] text-[#A8A193] border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Link: Direct to WhatsApp booking */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-[#C58A3E] hover:bg-[#DFA04E] text-[#0B0F0D] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Scissors className="w-3.5 h-3.5 -rotate-45" />
                      <span>Book This Signature Look</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
