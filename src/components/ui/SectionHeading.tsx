import React from "react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

interface SectionHeadingProps {
  eyebrow?: string;
  titleCream: string;
  titleGold: string;
  titleSuffix?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  titleCream,
  titleGold,
  titleSuffix,
  description,
  align = "center",
  className = "",
  id,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <AnimatedReveal
      direction="up"
      duration={0.6}
      amount={0.2}
      className={`max-w-3xl ${isCenter ? "mx-auto text-center" : "text-left"} mb-10 sm:mb-14 ${className}`}
    >
      {eyebrow && (
        <div
          className={`inline-flex items-center gap-2 mb-3.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase text-[#C59B46] bg-[#C59B46]/10 border border-[#C59B46]/25`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B46]" />
          <span>{eyebrow}</span>
        </div>
      )}

      <h2
        id={id}
        className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#F5EFEB] leading-[1.18]"
      >
        <span>{titleCream} </span>
        <span className="italic text-[#C59B46]">{titleGold}</span>
        {titleSuffix && <span> {titleSuffix}</span>}
      </h2>

      {description && (
        <p className="mt-4 text-sm sm:text-base md:text-lg text-[#B8B0A2] font-normal leading-relaxed">
          {description}
        </p>
      )}
    </AnimatedReveal>
  );
}
