"use client";

import Image from "next/image";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

interface CutoutFeatureBandProps {
  image: string;
  alt: string;
  tag?: string;
  title?: string;
  subtitle?: string;
  maxHeight?: string;
  className?: string;
}

export function CutoutFeatureBand({
  image,
  alt,
  tag = "PRECISION CRAFT",
  title,
  subtitle,
  maxHeight = "h-[260px] sm:h-[340px] lg:h-[440px]",
  className = "",
}: CutoutFeatureBandProps) {
  return (
    <AnimatedReveal
      direction="up"
      delay={0.05}
      amount={0.05}
      className={`w-full flex flex-col items-center justify-center my-4 sm:my-8 relative select-none ${className}`}
    >
      {/* Soft golden ambient glow behind the cutout */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[220px] sm:h-[320px] bg-[#C59B46]/8 rounded-full blur-[90px] pointer-events-none" />

      {/* Seamless cutout container with zero box borders */}
      <div
        className={`relative w-full max-w-[340px] sm:max-w-[440px] lg:max-w-[520px] mx-auto ${maxHeight} group flex flex-col justify-end items-center`}
      >
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 440px, 520px"
          className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700 ease-out"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 85% 85% at 50% 50%, black 50%, transparent 100%)",
          }}
        />

        {/* Floating Minimalist Editorial Caption */}
        {(tag || title) && (
          <div className="relative z-10 mx-auto mb-2 px-4 py-2 rounded-full bg-[#0E1411]/85 backdrop-blur-md border border-[#C59B46]/30 text-center shadow-2xl">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#C59B46] font-bold">
              ✦ {tag}
            </span>
            {title && (
              <span className="text-xs sm:text-sm text-[#F5EFEB] font-['Playfair_Display',Georgia,serif] ml-2">
                • {title}
              </span>
            )}
          </div>
        )}
      </div>
    </AnimatedReveal>
  );
}
