"use client";

import React, { useState } from "react";
import { staffBarbers, BarberStaff } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { CutoutFeatureBand } from "@/components/ui/CutoutFeatureBand";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { buildBarberBookingWhatsAppUrl } from "@/lib/whatsapp";
import {
  Star,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Scissors,
} from "lucide-react";

type RateTier =
  | "haircut"
  | "beard"
  | "hairAndBeard"
  | "facial"
  | "groomingPackage";

interface RateOption {
  key: RateTier;
  label: string;
}

const rateOptions: RateOption[] = [
  { key: "haircut", label: "Haircut" },
  { key: "beard", label: "Beard" },
  { key: "hairAndBeard", label: "Hair + Beard" },
  { key: "facial", label: "Facial" },
  { key: "groomingPackage", label: "VIP Package" },
];

export function TeamSection({
  onSelectBarber,
}: {
  onSelectBarber?: (barberId: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeTier, setActiveTier] = useState<RateTier>("haircut");
  const [expandedRatesId, setExpandedRatesId] = useState<string | null>(null);

  const filteredBarbers = staffBarbers.filter((barber) => {
    if (activeCategory === "all") return true;
    return barber.category === activeCategory;
  });

  const handleBookBarber = (barber: BarberStaff) => {
    onSelectBarber?.(barber.id);
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getTierLabel = (tier: RateTier) => {
    switch (tier) {
      case "haircut":
        return "Haircut";
      case "beard":
        return "Beard Styling";
      case "hairAndBeard":
        return "Hair + Beard Combo";
      case "facial":
        return "Facial Treatment";
      case "groomingPackage":
        return "VIP Grooming";
    }
  };

  return (
    <section
      id="team"
      aria-label="Salon Staff and Barbers"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#121815] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: The Hands Behind The Craft (Noir & Blade exact title) */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Our Team"
            titleCream="The Hands"
            titleGold="Behind The"
            titleSuffix="Craft"
            description="R.B Makeover has 10 barbers on shop. Compare their rates, experience, and book directly with your preferred stylist."
          />
        </AnimatedReveal>

        {/* Interactive Controls Bar: Category Filters & Service Rate Selector */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.2} className="mt-10 mb-8 space-y-4">
          
          {/* Top Row: Service Rate Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#141C18] border border-white/[0.08]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F5EFEB]">
              <Scissors className="w-4 h-4 text-[#C59B46]" />
              <span>Show Rates For:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto -mx-2 px-2 sm:mx-0 sm:px-0">
              {rateOptions.map((opt) => {
                const isActive = activeTier === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveTier(opt.key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? "bg-[#C59B46] text-[#0B0F0D] shadow-md"
                        : "bg-white/5 text-[#B8B0A2] hover:text-[#F5EFEB] hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Row: Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs text-[#7A756B] shrink-0 mr-1 hidden sm:inline">
              Filter by:
            </span>
            {[
              { id: "all", label: "All 10 Barbers" },
              { id: "senior", label: "Senior Stylists & Partners" },
              { id: "haircut", label: "Hair & Fade Specialists" },
              { id: "skincare", label: "Skincare & Grooming" },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? "bg-white/15 text-[#F5EFEB] border border-white/25 font-semibold"
                      : "text-[#A8A193] hover:text-[#F5EFEB] bg-white/[0.03] border border-transparent"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        </AnimatedReveal>

        {/* 10 Barbers Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredBarbers.map((barber, idx) => {
            const currentRate = barber.rates[activeTier];
            const isExpanded = expandedRatesId === barber.id;
            const waBookingUrl = buildBarberBookingWhatsAppUrl(
              barber.name,
              getTierLabel(activeTier),
              currentRate
            );

            return (
              <AnimatedReveal
                key={barber.id}
                direction="up"
                delay={(idx % 3) * 0.08}
                amount={0.15}
                className="h-full"
              >
                <div
                  data-barber-card
                  className="h-full relative rounded-2xl bg-[#141C18] border border-white/[0.08] hover:border-[#C59B46]/60 p-5 sm:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex flex-col justify-between group"
                >
                {/* Popular Badge */}
                {barber.isPopular && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C59B46]/15 text-[#C59B46] border border-[#C59B46]/30">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Featured</span>
                  </div>
                )}

                <div>
                  {/* Avatar & Header Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C2621] to-[#0E1512] border border-[#C59B46]/30 flex items-center justify-center text-[#C59B46] font-['Bebas_Neue',sans-serif] text-2xl tracking-wider shrink-0 select-none shadow-md">
                      {barber.initials}
                    </div>

                    <div className="space-y-0.5 flex-1 pr-16">
                      <h3 className="font-['Playfair_Display',Georgia,serif] text-lg sm:text-xl font-medium text-[#F5EFEB] leading-snug">
                        {barber.name}
                      </h3>
                      <p className="text-xs text-[#C59B46] font-medium">
                        {barber.title}
                      </p>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-[#A8A193]">
                        <span className="flex items-center gap-1 text-[#F5EFEB] font-semibold">
                          <Star className="w-3 h-3 fill-[#C59B46] text-[#C59B46]" />
                          {barber.rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{barber.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Active Rate Highlight Display */}
                  <div className="mt-4 p-3 rounded-xl bg-[#0B0F0D]/70 border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#7A756B] block">
                        {getTierLabel(activeTier)} Rate
                      </span>
                      <span className="font-['Bebas_Neue',sans-serif] text-2xl text-[#DFC074] leading-tight">
                        Rs. {currentRate.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRatesId(isExpanded ? null : barber.id)
                      }
                      className="inline-flex items-center gap-1 text-xs text-[#A8A193] hover:text-[#C59B46] transition-colors py-1 px-2 rounded-lg hover:bg-white/5 cursor-pointer"
                      aria-expanded={isExpanded}
                      aria-label={`Toggle all rates for ${barber.name}`}
                    >
                      <span>All Rates</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Expandable Rate Breakdown Table */}
                  {isExpanded && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[#0B0F0D] border border-white/10 space-y-1.5 text-xs text-[#B8B0A2] font-mono animate-in fade-in duration-200">
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span>Haircut:</span>
                        <strong className="text-[#F5EFEB]">Rs. {barber.rates.haircut.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span>Beard Styling:</span>
                        <strong className="text-[#F5EFEB]">Rs. {barber.rates.beard.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span>Hair + Beard Combo:</span>
                        <strong className="text-[#F5EFEB]">Rs. {barber.rates.hairAndBeard.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-white/5">
                        <span>Facial Treatment:</span>
                        <strong className="text-[#F5EFEB]">Rs. {barber.rates.facial.toLocaleString()}</strong>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span>VIP Package:</span>
                        <strong className="text-[#DFC074]">Rs. {barber.rates.groomingPackage.toLocaleString()}</strong>
                      </div>
                    </div>
                  )}

                  {/* Specialties Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {barber.specialties.map((spec) => (
                      <span
                        key={spec}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-white/[0.04] text-[#A8A193] border border-white/[0.05]"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Bio / Praise */}
                  <p className="mt-3 text-xs text-[#8A8478] leading-relaxed line-clamp-2">
                    {barber.bio}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-white/[0.07] grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleBookBarber(barber)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl text-xs font-bold leading-none text-center bg-[#C59B46] hover:bg-[#DFC074] active:bg-[#9A752B] text-[#0B0F0D] transition-colors shadow-md cursor-pointer select-none"
                  >
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span className="leading-none text-center">Select Barber</span>
                  </button>

                  <a
                    href={waBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold leading-none text-center bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/40 text-[#F5EFEB] hover:text-[#25D366] transition-colors select-none"
                    aria-label={`Direct WhatsApp with ${barber.name}`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                    <span className="leading-none text-center">WhatsApp</span>
                  </a>
                </div>
              </div>
            </AnimatedReveal>
          );
          })}
        </div>

        {/* Editorial Feature Cutout (matching user screenshot 8) */}
        <CutoutFeatureBand
          image="/images/cutout-mature-classic.webp"
          alt="Distinguished mature gentleman with classic scissor cut and beard grooming at R.B Makeover"
          tag="HERITAGE SCISSOR WORK"
          title="14+ Years Craftsmanship"
          maxHeight="h-[240px] sm:h-[320px] lg:h-[400px]"
        />

        {/* Bottom Note */}
        <div className="mt-10 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center gap-3 text-center text-xs text-[#A8A193]">
          <CheckCircle2 className="w-4 h-4 text-[#C59B46] shrink-0" />
          <p>
            You can select any of our 10 barbers when filling out the appointment request below, or message us on WhatsApp with your preferred specialist.
          </p>
        </div>

      </div>
    </section>
  );
}
