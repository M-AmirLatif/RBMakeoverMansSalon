"use client";

import React from "react";
import Image from "next/image";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, Scissors, CheckCircle2 } from "lucide-react";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";

export interface ServiceSpotlightProps {
  id: string;
  badge: string;
  serviceName: string;
  category: string;
  price: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  imageAlt: string;
  captionTag: string;
  captionTitle: string;
  features: string[];
  imageSide?: "left" | "right";
  bgDarkTone?: "black" | "obsidian";
}

export function ServiceSpotlightBand({
  id,
  badge,
  serviceName,
  category,
  price,
  title,
  highlightText,
  description,
  image,
  imageAlt,
  captionTag,
  captionTitle,
  features,
  imageSide = "right",
  bgDarkTone = "black",
}: ServiceSpotlightProps) {
  const waUrl = buildServiceInquiryWhatsAppUrl(serviceName, category);
  const isImageRight = imageSide === "right";
  const bgClass = bgDarkTone === "black" ? "bg-black" : "bg-[#080C0A]";

  return (
    <section
      id={id}
      aria-label={`${serviceName} Spotlight`}
      className={`relative py-8 sm:py-16 lg:py-24 ${bgClass} border-y border-white/[0.06] overflow-hidden`}
    >
      {/* Background ambient lighting */}
      <div
        className={`absolute top-1/2 ${
          isImageRight ? "right-1/4" : "left-1/4"
        } -translate-y-1/2 w-[500px] h-[350px] bg-[#C59B46]/5 rounded-full blur-[160px] pointer-events-none`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-14 items-center">
          
          {/* Image Column (6 cols): Large on PC, Zero Cropped Edges, Seamless Background */}
          <AnimatedReveal
            direction={isImageRight ? "right" : "left"}
            delay={0.05}
            amount={0.05}
            className={`lg:col-span-6 flex justify-center ${
              isImageRight ? "order-2" : "order-2 lg:order-1"
            }`}
          >
            <div className="relative w-full max-w-[400px] sm:max-w-[480px] lg:max-w-none h-[280px] sm:h-[380px] lg:h-[560px] group flex flex-col justify-end">
              <Image
                src={image}
                alt={imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain object-bottom group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 55%, transparent 100%)'
                }}
              />

              {/* Bottom Scrim blending seamlessly into dark background */}
              <div className={`absolute inset-x-0 bottom-0 h-28 pointer-events-none ${
                bgDarkTone === "black"
                  ? "bg-gradient-to-t from-black via-black/40 to-transparent"
                  : "bg-gradient-to-t from-[#080C0A] via-[#080C0A]/40 to-transparent"
              }`} />

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

          {/* Text Content Column (6 cols): Modern Editorial Typography */}
          <AnimatedReveal
            direction={isImageRight ? "left" : "right"}
            delay={0.05}
            amount={0}
            className={`lg:col-span-6 space-y-6 ${
              isImageRight ? "order-1" : "order-1 lg:order-2"
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

            {/* Action Button: Direct to WhatsApp booking for that service */}
            <div className="pt-2">
              <Button
                href={waUrl}
                variant="gold"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Book {serviceName} ({price}) on WhatsApp
              </Button>
            </div>
          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
