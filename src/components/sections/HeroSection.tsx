"use client";

import React from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon, FacebookIcon } from "@/components/ui/Icons";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
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
      className="relative min-h-[100svh] bg-black pt-24 sm:pt-28 pb-12 sm:pb-16 flex flex-col justify-between overflow-x-clip"
    >
      {/* Subtle ambient lighting placed away from the portrait so black stays pure #000000 */}
      <div className="absolute top-24 right-1/4 w-[500px] h-[350px] bg-[#C59B46]/5 rounded-full blur-[160px] pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-20 left-10 w-[450px] h-[350px] bg-[#141C18]/60 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 space-y-16 sm:space-y-20">
        
        {/* ============================================================ */}
        {/* PART 1: THE GENTLEMAN'S CLUB MASTER CENTERPIECE (FRONT HERO)  */}
        {/* ============================================================ */}
        <AnimatedReveal direction="fade" delay={0.05} amount={0} margin="0px" className="w-full">
          
          {/* Headline Line 1: Shop Name across the top, crisp & grand */}
          <div className="w-full mb-2 sm:mb-4 select-none">
            <h1 className="font-['Bebas_Neue',sans-serif] text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9.5rem] tracking-tight text-[#F5EFEB] uppercase leading-[0.88] text-left">
              R.B MAKEOVER
            </h1>
          </div>

          {/* Center Split: Exact Borderless Gentleman Profile (Left) & MAN'S SALON + Services List (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            
            {/* Left Column (5 cols): Exact real man photo without borders, seamless black */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px]">
                <Image
                  src="/images/gentleman-hero-profile.jpg"
                  alt="R.B Makeover Man's Salon Signature Gentleman"
                  width={640}
                  height={640}
                  priority
                  className="w-full h-auto object-contain select-none"
                />
              </div>
            </div>

            {/* Right Column (7 cols): Title Part 2 "MAN'S SALON" + Hairline Service Rail */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 lg:pl-2">
              
              {/* Title Part 2: Pushed to right side of the face */}
              <div className="select-none">
                <h2 className="font-['Bebas_Neue',sans-serif] text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-[#F5EFEB] uppercase leading-none">
                  MAN&apos;S <span className="text-[#C59B46]">SALON</span>
                </h2>
              </div>

              {/* Service List with Rates & BOOK buttons from Reference A */}
              <div className="bg-[#111614]/90 rounded-2xl border border-white/[0.08] backdrop-blur-md p-3.5 sm:p-5 divide-y divide-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
                <div className="pb-2.5 px-2 sm:px-3 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#7A756B]">
                  <span>Featured Services</span>
                  <span>Rates / Booking</span>
                </div>

                {heroServices.map((svc) => {
                  const waUrl = buildServiceInquiryWhatsAppUrl(svc.name, svc.category);
                  return (
                    <div
                      key={svc.name}
                      className="py-2.5 sm:py-3 px-2 sm:px-3 flex items-center justify-between gap-2 sm:gap-4 group hover:bg-white/[0.02] rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pr-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C59B46] shrink-0" />
                        <span className="font-['Playfair_Display',Georgia,serif] text-xs sm:text-base font-normal text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors leading-snug">
                          {svc.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                        <span className="text-[11px] sm:text-xs font-semibold text-[#A8A193] font-mono whitespace-nowrap">
                          {svc.price}
                        </span>

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-[#C58A3E] hover:bg-[#DFA04E] text-[#0B0F0D] shadow-md transition-all inline-flex items-center justify-center gap-1 shrink-0 leading-none text-center select-none"
                          aria-label={`Book ${svc.name} on WhatsApp`}
                        >
                          <span>BOOK</span>
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </AnimatedReveal>

        {/* ============================================================ */}
        {/* STAT STRIP (Connecting the two editorial hero showcases)       */}
        {/* ============================================================ */}
        <div className="w-full">
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

        {/* ============================================================ */}
        {/* PART 2: NOIR & BLADE SHOWCASE (PUSHED DOWN AS REQUESTED)      */}
        {/* ============================================================ */}
        {/* Desktop Presentation (>= 1024px) */}
        <div className="hidden lg:grid grid-cols-12 gap-8 xl:gap-12 items-center pt-4">
          
          {/* Left Column: Brand, Two-Tone Headline, CTAs */}
          <AnimatedReveal direction="left" delay={0.1} amount={0.15} className="col-span-7 flex flex-col justify-center space-y-6">
            
            {/* Brand Title + Grand Two-Tone Headline */}
            <div className="space-y-2 select-none">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-[#A8A193]">
                <span className="w-6 h-[1px] bg-[#C59B46]" />
                <span>R.B Makeover Man&apos;s Salon</span>
              </div>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-5xl xl:text-6xl font-normal text-[#F5EFEB] leading-[1.08] tracking-tight">
                <span>Beauty Beholds </span>
                <span className="italic text-[#C59B46] font-normal block xl:inline">
                  Beneath the{" "}
                </span>
                <span>Cuts</span>
              </h2>
            </div>

            {/* Subtitle using exact mandated copy */}
            <p className="text-base xl:text-lg text-[#B8B0A2] font-normal leading-relaxed max-w-xl">
              Men&apos;s haircuts, beard grooming and skincare in Park View City, Lahore.
            </p>

            {/* Two Action Pill Buttons */}
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
          </AnimatedReveal>

          {/* Right Column: Master Barber Image + Circular Badge + Socials */}
          <AnimatedReveal direction="right" delay={0.15} amount={0.15} className="col-span-5 relative">
            <div className="relative w-full h-[min(75svh,580px)] rounded-[32px] overflow-hidden border border-[#C59B46]/35 shadow-[0_30px_70px_rgba(0,0,0,0.9)] bg-[#121815] group">
              <Image
                src="/images/hero-barber-craft.webp"
                alt="Master barber in black uniform styling client hair at R.B Makeover Man's Salon"
                fill
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

            {/* Vertical Social Links strip on the right side */}
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
          </AnimatedReveal>

        </div>

        {/* Mobile & Tablet Presentation (< 1024px) */}
        <AnimatedReveal direction="up" delay={0.1} amount={0.15} className="block lg:hidden text-center space-y-6 pt-4">
          
          {/* Brand & Headline */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#A8A193]">
              R.B Makeover Man&apos;s Salon
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl sm:text-4xl font-normal text-[#F5EFEB] leading-[1.2] max-w-sm mx-auto text-center">
              <span>Beauty Beholds</span>
              <br />
              <span className="italic text-[#C59B46]">Beneath the</span>{" "}
              <span>Cuts</span>
            </h2>
          </div>

          {/* Hero Image for Mobile */}
          <div className="relative w-full max-w-[360px] sm:max-w-[420px] mx-auto h-[44svh] max-h-[380px] rounded-3xl overflow-hidden border border-[#C59B46]/30 shadow-2xl bg-[#121815]">
            <Image
              src="/images/hero-barber-craft.webp"
              alt="Master barber cutting hair at R.B Makeover Man's Salon"
              fill
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
          <p className="font-['Playfair_Display',Georgia,serif] text-base text-[#F5EFEB]/90 font-normal leading-relaxed max-w-md mx-auto px-2">
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

        </AnimatedReveal>

      </div>

    </section>
  );
}
