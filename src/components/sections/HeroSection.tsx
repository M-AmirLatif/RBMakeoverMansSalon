"use client";

import React from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, FacebookIcon } from "@/components/ui/Icons";
import {
  Star,
  MapPin,
  Calendar,
  Sparkles,
  Scissors,
  ArrowRight,
  Phone,
} from "lucide-react";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";

interface HeroServiceRow {
  name: string;
  category: string;
  price: string;
}

const heroServices: HeroServiceRow[] = [
  { name: "Haircuts & Fades", category: "Haircuts & Styling", price: "Rs. 1,000" },
  { name: "Beard Trimming & Lineup", category: "Beard & Grooming", price: "Rs. 600" },
  { name: "Professional Shaving", category: "Beard & Grooming", price: "Rs. 700" },
  { name: "Hair and Beard Styling", category: "Additional Grooming Services", price: "Rs. 1,500" },
  { name: "Facial Treatments", category: "Facial & Skincare", price: "Rs. 1,600" },
  { name: "VIP Grooming Packages", category: "Additional Grooming Services", price: "Rs. 3,500" },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Welcome to R.B Makeover Man's Salon"
      className="relative min-h-[100svh] bg-[#0A0E0C] pt-24 sm:pt-28 pb-12 sm:pb-16 flex flex-col justify-between overflow-x-clip"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-[#C59B46]/6 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-36 right-10 w-[450px] h-[350px] bg-[#141C18] rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-auto">
        
        {/* DESKTOP LAYOUT (>= 1024px): Exact Noir & Blade + The Gentleman's Club synthesis */}
        <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left Column (7 cols): Brand, Two-Tone Headline, CTAs, Hairline Services Rail */}
          <div className="col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Top Location Pill Badge (Noir & Blade style) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#C59B46]/30 text-xs font-semibold text-[#C59B46] tracking-wide w-fit">
              <MapPin className="w-3.5 h-3.5 text-[#C59B46]" />
              <span>Rose Commercial, Park View City, Lahore</span>
            </div>

            {/* Brand Title + Grand Two-Tone Headline */}
            <div className="space-y-2 select-none">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#A8A193]">
                <span className="w-6 h-[1px] bg-[#C59B46]" />
                <span>R.B Makeover Man&apos;s Salon</span>
              </div>

              <h1 className="font-['Playfair_Display',Georgia,serif] text-5xl xl:text-6xl 2xl:text-7xl font-normal text-[#F5EFEB] leading-[1.08] tracking-tight">
                <span>Beauty Beholds </span>
                <span className="italic text-[#C59B46] font-normal block xl:inline">
                  Beneath the{" "}
                </span>
                <span>Cuts</span>
              </h1>
            </div>

            {/* Subtitle using exact mandated copy */}
            <p className="text-base xl:text-lg text-[#B8B0A2] font-normal leading-relaxed max-w-xl">
              Men&apos;s haircuts, beard grooming and skincare in Park View City, Lahore.
            </p>

            {/* Two Action Pill Buttons (Noir & Blade style) */}
            <div className="flex items-center gap-4 pt-1">
              <Button
                href="#contact"
                variant="gold"
                size="lg"
                icon={<Calendar className="w-4 h-4" />}
              >
                Book an Appointment
              </Button>

              <Button
                href="#services"
                variant="outline"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Services
              </Button>
            </div>

            {/* Hairline 6-Row Service List from Reference A ("The Gentleman's Club") */}
            <div className="bg-[#111614]/80 rounded-2xl border border-white/[0.08] backdrop-blur-md p-4 divide-y divide-white/[0.08] max-w-xl shadow-xl mt-4">
              <div className="pb-2.5 px-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#7A756B]">
                <span>Featured Services</span>
                <span>Rates / Booking</span>
              </div>

              {heroServices.map((svc) => {
                const waUrl = buildServiceInquiryWhatsAppUrl(svc.name, svc.category);
                return (
                  <div
                    key={svc.name}
                    className="py-2.5 px-3 flex items-center justify-between gap-4 group hover:bg-white/[0.02] rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59B46]/60 group-hover:bg-[#C59B46] transition-colors shrink-0" />
                      <span className="font-['Playfair_Display',Georgia,serif] text-sm xl:text-base font-normal text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors truncate">
                        {svc.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-auto">
                      <span className="text-xs font-semibold text-[#A8A193] font-mono whitespace-nowrap">
                        {svc.price}
                      </span>

                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#C58A3E] hover:bg-[#DFA04E] text-[#0B0F0D] shadow-md transition-all inline-flex items-center justify-center gap-1.5 shrink-0 leading-none text-center"
                        aria-label={`Book ${svc.name} on WhatsApp`}
                      >
                        <span>BOOK</span>
                        <ArrowRight className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column (5 cols): Master Barber Image + Circular Badge + Socials */}
          <div className="col-span-5 relative">
            <div className="relative w-full h-[min(82svh,680px)] rounded-[32px] overflow-hidden border border-[#C59B46]/35 shadow-[0_30px_70px_rgba(0,0,0,0.9)] bg-[#121815] group">
              <Image
                src="/images/hero-barber-craft.webp"
                alt="Master barber in black uniform styling client hair at R.B Makeover Man's Salon"
                fill
                priority
                sizes="(max-width: 1440px) 42vw, 560px"
                className="object-cover object-[50%_35%] group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Scrim: subtle dark gradient at bottom edge */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/95 via-[#0A0E0C]/20 to-transparent pointer-events-none" />

              {/* Rotating Circular Stamp Badge (Noir & Blade signature element) */}
              <div className="absolute top-6 right-6 w-24 h-24 rounded-full border border-[#C59B46]/40 bg-[#0B0F0D]/85 backdrop-blur-md flex items-center justify-center shadow-xl p-1 select-none">
                <div className="relative w-full h-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      id="badgeCircle"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text className="text-[9px] uppercase tracking-[0.22em] fill-[#C59B46] font-bold">
                      <textPath href="#badgeCircle">
                        • R.B MAKEOVER • CRAFT & CARE •
                      </textPath>
                    </text>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Scissors className="w-5 h-5 text-[#C59B46]" />
                </div>
              </div>

              {/* Rating Chip on Lower-Left of the Photo */}
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-[#0D1311]/90 border border-[#C59B46]/40 backdrop-blur-md shadow-lg flex items-center gap-2 whitespace-nowrap">
                <Star className="w-3.5 h-3.5 fill-[#C59B46] text-[#C59B46]" />
                <span className="text-xs font-bold text-[#F5EFEB]">4.9</span>
                <span className="text-xs text-[#A8A193]">• 36 Google reviews</span>
              </div>

              {/* Location Badge on Lower-Right */}
              <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-[#0D1311]/85 border border-white/10 text-[11px] text-[#A8A193] flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#C59B46]" />
                <span>Rose Commercial</span>
              </div>
            </div>

            {/* Vertical Social Links strip on the right side (Noir & Blade style) */}
            <div className="hidden xl:flex flex-col gap-3 absolute -right-6 top-1/2 -translate-y-1/2 z-20">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#111614] border border-white/10 hover:border-[#25D366] text-[#25D366] flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                title="WhatsApp Us"
                aria-label="WhatsApp Us"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              <a
                href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
                className="w-10 h-10 rounded-full bg-[#111614] border border-white/10 hover:border-[#C59B46] text-[#C59B46] flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                title="Call Salon"
                aria-label="Call Salon"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.contact.social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#111614] border border-white/10 hover:border-[#1877F2] text-[#1877F2] flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                title="Facebook"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

        {/* MOBILE & TABLET LAYOUT (< 1024px): Mobile-first 360-430px */}
        <div className="block lg:hidden text-center space-y-6">
          
          {/* Mobile Location Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-[#C59B46]/30 text-[11px] font-semibold text-[#C59B46] mx-auto">
            <MapPin className="w-3 h-3 text-[#C59B46]" />
            <span>Rose Commercial, Park View City</span>
          </div>

          {/* Brand & Headline */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#A8A193]">
              R.B Makeover Man&apos;s Salon
            </div>
            <h1 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl md:text-5xl font-normal text-[#F5EFEB] leading-[1.2] max-w-sm mx-auto text-center">
              <span>Beauty Beholds</span>
              <br />
              <span className="italic text-[#C59B46]">Beneath the</span>{" "}
              <span>Cuts</span>
            </h1>
          </div>

          {/* Hero Image for Mobile */}
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto h-[48svh] max-h-[420px] rounded-3xl overflow-hidden border border-[#C59B46]/30 shadow-2xl bg-[#121815]">
            <Image
              src="/images/hero-barber-craft.webp"
              alt="Master barber cutting hair at R.B Makeover Man's Salon"
              fill
              priority
              sizes="(max-width: 640px) 92vw, 420px"
              className="object-cover object-[50%_35%]"
            />

            {/* Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/95 via-[#0A0E0C]/20 to-transparent pointer-events-none" />

            {/* Rating Chip */}
            <div className="absolute bottom-3.5 left-3.5 px-3 py-1.5 rounded-full bg-[#0D1311]/90 border border-[#C59B46]/40 backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-[#C59B46] text-[#C59B46]" />
              <span className="text-xs font-bold text-[#F5EFEB]">4.9</span>
              <span className="text-[11px] text-[#A8A193]">• 36 Google reviews</span>
            </div>

            {/* Location Badge */}
            <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full bg-[#0D1311]/85 border border-white/10 text-[10px] text-[#A8A193]">
              Rose Commercial
            </div>
          </div>

          {/* Mandated Subtitle */}
          <p className="font-['Playfair_Display',Georgia,serif] text-base sm:text-lg text-[#F5EFEB]/90 font-normal leading-relaxed max-w-md mx-auto px-2">
            Men&apos;s haircuts, beard grooming and skincare in Park View City, Lahore.
          </p>

          {/* Two Thumb-Reachable CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm mx-auto">
            <Button
              href="#contact"
              variant="gold"
              size="lg"
              fullWidth
              icon={<Calendar className="w-4 h-4" />}
            >
              Book an Appointment
            </Button>

            <Button
              href="#services"
              variant="outline"
              size="lg"
              fullWidth
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore Services
            </Button>
          </div>

          {/* Compact Service List for Mobile */}
          <div className="bg-[#111614]/90 rounded-2xl border border-white/[0.08] p-3 divide-y divide-white/[0.08] max-w-md mx-auto text-left shadow-xl">
            <div className="pb-2 px-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-[#7A756B]">
              <span>Featured Services</span>
              <span>Rates / Booking</span>
            </div>
            {heroServices.slice(0, 4).map((svc) => {
              const waUrl = buildServiceInquiryWhatsAppUrl(svc.name, svc.category);
              return (
                <div
                  key={svc.name}
                  className="py-2.5 px-2 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59B46]/70 shrink-0" />
                    <span className="font-['Playfair_Display',Georgia,serif] text-xs sm:text-sm text-[#F5EFEB] truncate">
                      {svc.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 ml-auto">
                    <span className="text-xs font-semibold text-[#A8A193] font-mono whitespace-nowrap">
                      {svc.price}
                    </span>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#C58A3E] hover:bg-[#DFA04E] text-[#0B0F0D] shadow-sm inline-flex items-center justify-center gap-1 shrink-0 leading-none text-center"
                      aria-label={`Book ${svc.name} on WhatsApp`}
                    >
                      <span>BOOK</span>
                      <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Verified Facts Stat Strip Below (Noir & Blade style) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 p-3 sm:p-5 rounded-2xl bg-[#111614]/90 backdrop-blur-md border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
          {/* Stat 1: Google Rating */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 sm:p-2 border-r border-white/5 pb-2 sm:pb-2 border-b sm:border-b-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#C59B46]/10 text-[#C59B46] border border-[#C59B46]/20 shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-[#C59B46]" />
            </div>
            <div>
              <div className="font-['Bebas_Neue',sans-serif] text-xl sm:text-2xl lg:text-3xl tracking-wide text-[#F5EFEB] leading-none">
                4.9 / 5.0
              </div>
              <div className="text-[10px] sm:text-xs text-[#A8A193] mt-0.5">
                Google Rating
              </div>
            </div>
          </div>

          {/* Stat 2: 36 Reviews From Google */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 sm:p-2 md:border-r border-white/5 pb-2 sm:pb-2 border-b sm:border-b-0">
            <div className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#C59B46]/10 text-[#C59B46] border border-[#C59B46]/20 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="font-['Bebas_Neue',sans-serif] text-xl sm:text-2xl lg:text-3xl tracking-wide text-[#F5EFEB] leading-none">
                36 REVIEWS
              </div>
              <div className="text-[10px] sm:text-xs text-[#A8A193] mt-0.5">
                From Google
              </div>
            </div>
          </div>

          {/* Stat 3: 23 Services */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 sm:p-2 border-r border-white/5 pt-2 sm:pt-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#C59B46]/10 text-[#C59B46] border border-[#C59B46]/20 shrink-0">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="font-['Bebas_Neue',sans-serif] text-xl sm:text-2xl lg:text-3xl tracking-wide text-[#F5EFEB] leading-none">
                23 SERVICES
              </div>
              <div className="text-[10px] sm:text-xs text-[#A8A193] mt-0.5">
                Hair, Beard & Skin
              </div>
            </div>
          </div>

          {/* Stat 4: Park View City */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1 sm:p-2 pt-2 sm:pt-2">
            <div className="flex items-center justify-center w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-[#C59B46]/10 text-[#C59B46] border border-[#C59B46]/20 shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="font-['Bebas_Neue',sans-serif] text-xl sm:text-2xl lg:text-3xl tracking-wide text-[#F5EFEB] leading-none">
                PARK VIEW
              </div>
              <div className="text-[10px] sm:text-xs text-[#A8A193] mt-0.5">
                Rose Commercial
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
