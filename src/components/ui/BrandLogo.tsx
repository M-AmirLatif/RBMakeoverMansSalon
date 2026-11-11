import React from "react";
import Link from "next/link";
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
      <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#141C18] border border-[#C59B46]/60 shadow-[0_0_15px_rgba(197,155,70,0.15)] group-hover:border-[#C59B46] transition-colors shrink-0">
        <svg
          viewBox="0 0 44 44"
          fill="none"
          className="w-6 h-6 sm:w-7 sm:h-7 text-[#C59B46]"
          aria-hidden="true"
        >
          {/* Inner hairline ring */}
          <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1.5 2" opacity="0.6" />
          <circle cx="22" cy="22" r="16.5" stroke="currentColor" strokeWidth="0.6" opacity="0.8" />
          {/* Crossed Shears */}
          <path
            d="M15 30 C15 26 19 23 22 20 L29 13 M29 30 C29 26 25 23 22 20 L15 13"
            stroke="#F5EFEB"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="14" cy="31" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="#0B0F0D" />
          <circle cx="30" cy="31" r="2.2" stroke="currentColor" strokeWidth="1.2" fill="#0B0F0D" />
          {/* Monogram letters */}
          <text
            x="22"
            y="11"
            fontFamily="'Bebas Neue', sans-serif"
            fontSize="7"
            fontWeight="bold"
            fill="#C59B46"
            textAnchor="middle"
            letterSpacing="0.5"
          >
            R.B
          </text>
        </svg>
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
