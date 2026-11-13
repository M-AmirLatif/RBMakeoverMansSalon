import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";

interface BrandLogoProps {
  variant?: "full" | "mark" | "compact";
  className?: string;
  onClick?: () => void;
}

export function BrandLogo({ variant = "full", className = "", onClick }: BrandLogoProps) {
  return (
    <Link
      href="#hero"
      onClick={onClick}
      className={`group inline-flex items-center gap-3 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46] rounded-sm ${className}`}
      aria-label={`${siteConfig.name} - Return to top`}
    >
      {/* Brand Emblem */}
      <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-[0_0_20px_rgba(197,155,70,0.25)] group-hover:scale-105 transition-transform shrink-0 border border-[#C59B46]/60">
        <Image
          src="/images/rb-makeover-logo-badge.png"
          alt="R.B Makeover Man's Salon Official Emblem"
          width={48}
          height={48}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {variant !== "mark" && (
        <div className="flex flex-col text-left">
          <span className="font-['Bebas_Neue',sans-serif] text-lg sm:text-2xl leading-none tracking-wider text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors">
            R.B MAKEOVER
          </span>
          <span className="text-[9px] sm:text-[11px] font-medium tracking-[0.2em] sm:tracking-[0.25em] text-[#C59B46] uppercase leading-tight font-sans">
            MAN&apos;S SALON
          </span>
        </div>
      )}
    </Link>
  );
}
