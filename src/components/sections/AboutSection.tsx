"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ArrowRight, UserCheck, Star, Clock, MapPin, Sparkles } from "lucide-react";
import { fetchShopTiming, ShopTimingConfig } from "@/lib/supabase/queries";

export function AboutSection() {
  const [timing, setTiming] = useState<ShopTimingConfig>({
    weekday: "10:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "Off-Day",
    note: "OPEN MON - SAT 10:00 AM - 11:00 PM • SUNDAY OFF-DAY",
  });

  useEffect(() => {
    let mounted = true;
    fetchShopTiming().then((data) => {
      if (mounted && data) {
        setTiming(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <section
      id="about"
      aria-label="About R.B Makeover Man's Salon"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#090D0B] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Arched Window Salon Photo (Noir & Blade signature shape, smooth blurred edges) */}
          <AnimatedReveal direction="left" delay={0.1} amount={0.05} className="lg:col-span-5 relative">
            <div
              className="relative rounded-t-[180px] rounded-b-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] aspect-[3/4] max-w-md mx-auto lg:max-w-none group bg-[#121815]"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 65%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 65%, transparent 100%)'
              }}
            >
              <Image
                src="/images/about-interior-floor.webp"
                alt="Our salon interior at Rose Commercial, Park View City"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E0C]/90 via-transparent to-transparent pointer-events-none" />

              {/* Circular Gold Badge overlapping lower right (Noir & Blade style) */}
              <div className="absolute top-8 right-6 w-20 h-20 rounded-full border border-[#C59B46]/40 bg-[#0B0F0D]/85 backdrop-blur-md flex items-center justify-center shadow-xl p-1 select-none">
                <div className="relative w-full h-full flex items-center justify-center animate-[spin_24s_linear_infinite]">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      id="aboutBadge"
                      d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                      fill="none"
                    />
                    <text className="text-[10px] uppercase tracking-[0.25em] fill-[#C59B46] font-bold">
                      <textPath href="#aboutBadge">
                        • PARK VIEW CITY • BEST SERVICE •
                      </textPath>
                    </text>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Sparkles className="w-4 h-4 text-[#C59B46]" />
                </div>
              </div>

              {/* Verified Image Caption */}
              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-xl bg-[#121815]/90 backdrop-blur-md border border-white/10 text-xs text-[#F5EFEB] flex items-center justify-between">
                <span>Our salon at Rose Commercial.</span>
                <span className="text-[#C59B46] text-[11px] font-medium">Park View City</span>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column: Editorial Information (Noir & Blade style) */}
          <AnimatedReveal direction="right" delay={0.2} className="lg:col-span-7 space-y-6">
            <SectionHeading
              align="left"
              eyebrow="About Us"
              titleCream="We Believe Grooming is"
              titleGold="Personal"
              description="R.B Makeover Man's Salon is located at Rose Commercial on Main Boulevard, Park View City, Lahore. We provide men's haircuts, beard grooming, and facial skincare services with a dedicated team."
              className="mb-4"
            />

            {/* Verified Owner Statement */}
            <div className="p-6 rounded-2xl bg-[#111614] border-l-4 border-[#C59B46] text-[#F5EFEB] space-y-2 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C59B46] block">
                Owner&apos;s Statement
              </span>
              <p className="font-['Playfair_Display',Georgia,serif] text-base sm:text-lg text-[#F5EFEB] leading-relaxed italic">
                &ldquo;Hello I&apos;m Imtiaz Ahmad Owner of R.B Makeover Man&apos;s Salon. My Salon best service in the Park View City &amp; I have a good staff.&rdquo;
              </p>
            </div>

            {/* Operating Hours & Location Strip (Noir & Blade style 3 cards with live timing) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#111614] border border-white/[0.07] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#C59B46] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Mon - Fri</span>
                </div>
                <div className="text-sm font-bold text-[#F5EFEB]">{timing.weekday}</div>
                <div className="text-[10px] text-[#7A756B]">Weekdays</div>
              </div>

              <div className="p-4 rounded-xl bg-[#111614] border border-white/[0.07] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#C59B46] font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sat - Sun</span>
                </div>
                <div className="text-sm font-bold text-[#F5EFEB] truncate">{timing.saturday}</div>
                <div className="text-[10px] text-[#7A756B]">Sun: {timing.sunday}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#111614] border border-white/[0.07] space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-[#C59B46] font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Location</span>
                </div>
                <div className="text-sm font-bold text-[#F5EFEB] truncate">Rose Commercial</div>
                <div className="text-[10px] text-[#7A756B]">Main Boulevard PVC</div>
              </div>
            </div>

            {/* Two Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#C59B46]/10 text-[#C59B46] shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F5EFEB]">Led by Imtiaz Ahmad</div>
                  <div className="text-xs text-[#A8A193]">14+ Years Craft Experience</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#C59B46]/10 text-[#C59B46] shrink-0">
                  <Star className="w-5 h-5 fill-[#C59B46]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#F5EFEB]">4.9 on Google</div>
                  <div className="text-xs text-[#A8A193]">36 Verified Reviews</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Button
                href="#contact"
                variant="gold"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Book Your Visit
              </Button>

              <Button
                href="#services"
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                Explore Services
              </Button>
            </div>
          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
