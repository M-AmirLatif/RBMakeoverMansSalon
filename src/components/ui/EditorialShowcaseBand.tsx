"use client";

import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WhatsAppIcon } from "@/components/ui/Icons";

export interface EditorialShowcaseProps {
  id?: string;
  image: string;
  alt?: string;
  imageAlt?: string;
  badge?: string;
  title: string;
  highlightText: string;
  description: string;
  features: string[];
  ctaText?: string;
  ctaUrl?: string;
  captionTag?: string;
  captionTitle?: string;
  isImageRight?: boolean;
  imageSide?: "left" | "right";
  bgDarkTone?: "black" | "dark";
  className?: string;
}

export function EditorialShowcaseBand({
  id,
  image,
  alt,
  imageAlt,
  badge = "SIGNATURE LOOK",
  title,
  highlightText,
  description,
  features,
  ctaText = "Book on WhatsApp",
  ctaUrl = "https://wa.me/923269326566",
  captionTag = "PRECISION CRAFT",
  captionTitle = "Bespoke Grooming",
  isImageRight = false,
  imageSide,
  bgDarkTone = "dark",
  className = "",
}: EditorialShowcaseProps) {
  const bgClass = bgDarkTone === "black" ? "bg-black" : "bg-[#090D0B]";
  const isRight = isImageRight || imageSide === "right";
  const imageAltText = alt || imageAlt || title;

  return (
    <section
      id={id}
      aria-label={`${title} Showcase`}
      className={`relative py-10 sm:py-16 lg:py-24 ${bgClass} border-y border-white/[0.06] overflow-hidden ${className}`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute top-1/2 ${
          isRight ? "right-1/4" : "left-1/4"
        } -translate-y-1/2 w-[500px] h-[350px] bg-[#C59B46]/5 rounded-full blur-[160px] pointer-events-none`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-center">
          
          {/* Image Column (6 cols): Large on PC & BIG on Mobile (h-[420px]), 100% transparent background */}
          <AnimatedReveal
            direction={isRight ? "right" : "left"}
            delay={0.05}
            amount={0.05}
            className={`lg:col-span-6 flex justify-center ${
              isRight ? "order-2" : "order-2 lg:order-1"
            }`}
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none h-[420px] sm:h-[480px] lg:h-[600px] group flex flex-col justify-end">
              <Image
                src={image}
                alt={imageAltText}
                fill
                sizes="(max-width: 640px) 96vw, (max-width: 1024px) 80vw, 50vw"
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700 ease-out select-none"
              />

              {/* Bottom Scrim blending seamlessly into dark background */}
              <div
                className={`absolute inset-x-0 bottom-0 h-32 pointer-events-none ${
                  bgDarkTone === "black"
                    ? "bg-gradient-to-t from-black via-black/40 to-transparent"
                    : "bg-gradient-to-t from-[#090D0B] via-[#090D0B]/40 to-transparent"
                }`}
              />

              {/* Floating Modern Editorial Caption Band */}
              <div className="relative z-10 mx-2 sm:mx-6 mb-2 sm:mb-4 p-3 sm:p-4 rounded-2xl bg-[#0E1411]/90 backdrop-blur-md border border-[#C59B46]/30 text-center shadow-2xl select-none">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-widest uppercase text-[#C59B46] font-bold block mb-0.5">
                  ✦ {captionTag}
                </span>
                <p className="font-['Playfair_Display',Georgia,serif] text-xs sm:text-sm text-[#F5EFEB] font-normal leading-snug">
                  {captionTitle}
                </p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Text Content Column (6 cols): Modern Editorial Typography with Rich Side Content */}
          <AnimatedReveal
            direction={isRight ? "left" : "right"}
            delay={0.05}
            amount={0}
            className={`lg:col-span-6 space-y-6 ${
              isRight ? "order-1" : "order-1 lg:order-2"
            }`}
          >
            <div className="space-y-3 select-none">
              <div className="flex items-center gap-2.5 text-xs font-bold tracking-[0.25em] uppercase text-[#C59B46]">
                <span className="w-8 h-[2px] bg-[#C59B46]" />
                <span>{badge}</span>
              </div>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl lg:text-5xl font-normal text-[#F5EFEB] leading-[1.15] tracking-tight">
                <span>{title}</span>
                <br />
                <span className="italic text-[#C59B46]">{highlightText}</span>
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#B8B0A2] font-normal leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {features.map((feat) => (
                <div
                  key={feat}
                  className="p-3.5 rounded-xl bg-[#111614] border border-white/[0.08] flex items-center gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-[#C59B46] shrink-0" />
                  <span className="text-xs font-semibold text-[#F5EFEB] truncate">{feat}</span>
                </div>
              ))}
            </div>

            {/* Booking CTA Button */}
            <div className="pt-2">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#C59B46] hover:bg-[#DFC074] active:bg-[#9A752B] text-[#0B0F0D] font-bold text-sm tracking-wide transition-all shadow-[0_10px_25px_rgba(197,155,70,0.3)] hover:shadow-[0_14px_35px_rgba(197,155,70,0.45)] group cursor-pointer"
              >
                <WhatsAppIcon className="w-4 h-4 text-[#0B0F0D]" />
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
