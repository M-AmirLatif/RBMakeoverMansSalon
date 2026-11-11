"use client";

import React from "react";
import { Sparkles, Star, Scissors } from "lucide-react";

interface MarqueeTickerProps {
  items?: string[];
  direction?: "forward" | "reverse";
  variant?: "gold-foil" | "dark-glass" | "subtle";
  iconType?: "star" | "scissors" | "sparkles";
  className?: string;
}

const DEFAULT_ITEMS_PRIMARY = [
  "R.B MAKEOVER MAN'S SALON",
  "PARK VIEW CITY LAHORE",
  "4.9 ★ RATED ON GOOGLE (36 REVIEWS)",
  "10 MASTER BARBERS ON DECK",
  "PRECISION IN EVERY CUT",
  "BEARD SCULPTING & LINEUPS",
  "EXECUTIVE GROOMING PACKAGES",
  "HYDRA & CHARCOAL SKINCARE",
];

export function MarqueeTicker({
  items = DEFAULT_ITEMS_PRIMARY,
  direction = "forward",
  variant = "gold-foil",
  iconType = "scissors",
  className = "",
}: MarqueeTickerProps) {
  const renderIcon = () => {
    switch (iconType) {
      case "star":
        return <Star className="w-3.5 h-3.5 fill-[#C59B46] text-[#C59B46] shrink-0" />;
      case "sparkles":
        return <Sparkles className="w-3.5 h-3.5 text-[#DFC074] shrink-0" />;
      case "scissors":
      default:
        return <Scissors className="w-3.5 h-3.5 text-[#C59B46] shrink-0 -rotate-45" />;
    }
  };

  const variantStyles = {
    "gold-foil":
      "bg-gradient-to-r from-[#111714] via-[#1A231E] to-[#111714] border-y border-[#C59B46]/30 text-[#F5EFEB] shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    "dark-glass":
      "bg-[#0B0F0D]/90 backdrop-blur-md border-y border-white/[0.08] text-[#E8E2D9]",
    subtle:
      "bg-[#0E1411] border-y border-white/[0.05] text-[#A8A193]",
  }[variant];

  const animationClass =
    direction === "forward" ? "animate-marquee" : "animate-marquee-reverse";

  // Repeat items to ensure seamless continuous scroll
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden select-none py-3 sm:py-3.5 ${variantStyles} ${className}`}
      role="region"
      aria-label="Editorial announcement ticker"
    >
      {/* Edge gradient fade masks for high-end editorial feel */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#0B0F0D] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#0B0F0D] to-transparent z-10 pointer-events-none" />

      <div className={animationClass}>
        {duplicatedItems.map((text, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-3 sm:gap-4 px-3 sm:px-4 shrink-0"
          >
            <span className="font-['Bebas_Neue',sans-serif] tracking-[0.16em] text-sm sm:text-base md:text-lg uppercase text-[#F5EFEB]">
              {text}
            </span>
            <span className="inline-flex items-center justify-center opacity-80">
              {renderIcon()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
