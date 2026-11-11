"use client";

import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";

export function InteriorPhotoBand() {
  return (
    <section
      aria-label="Salon Interior Atmosphere"
      className="relative w-full h-[260px] sm:h-[340px] lg:h-[420px] overflow-hidden border-y border-white/[0.08]"
    >
      <Image
        src="/images/interior-panorama-band.webp"
        alt="R.B Makeover salon environment at Rose Commercial, Park View City"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Gentle vignette at edges only */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F0D]/60 via-transparent to-[#0B0F0D]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F0D]/30 via-transparent to-[#0B0F0D]/40 pointer-events-none" />

      {/* Bottom Floating Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#0B0F0D]/85 border border-[#C59B46]/40 backdrop-blur-md shadow-xl flex items-center gap-2 text-xs text-[#F5EFEB] whitespace-nowrap">
        <MapPin className="w-3.5 h-3.5 text-[#C59B46]" />
        <span>Rose Commercial, Main Boulevard, Park View City</span>
      </div>
    </section>
  );
}
