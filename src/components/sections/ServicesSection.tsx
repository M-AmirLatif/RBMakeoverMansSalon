"use client";

import React, { useState } from "react";
import Image from "next/image";
import { serviceCategories, ServiceCategoryKey } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowUpRight, ArrowRight } from "lucide-react";

interface FeaturedMenuItem {
  title: string;
  category: string;
  price: string;
  desc: string;
  image: string;
}

const featuredMenu: FeaturedMenuItem[] = [
  {
    title: "Classic Executive Haircut",
    category: "Haircuts & Styling",
    price: "Rs. 1,000",
    desc: "Precision scissors cut, tailored side part & clean neck taper finished with styling.",
    image: "/images/menu-classic-cut.webp",
  },
  {
    title: "Skin Fade & Texture Cut",
    category: "Haircuts & Styling",
    price: "Rs. 1,200",
    desc: "Seamless gradient skin fade, textured crown styling & razor-sharp temple contours.",
    image: "/images/menu-skin-fade.webp",
  },
  {
    title: "Haircut & Beard Sculpt Combo",
    category: "Additional Grooming Services",
    price: "Rs. 1,800",
    desc: "Our most popular combination: full precision haircut paired with sharp beard shaping.",
    image: "/images/menu-hair-beard-combo.webp",
  },
  {
    title: "Signature Beard Sculpt & Shave",
    category: "Beard & Grooming",
    price: "Rs. 1,100",
    desc: "Hot towel prep, straight razor cheek & neckline sculpting with beard nourishment.",
    image: "/images/menu-beard-sculpt.webp",
  },
];

export function ServicesSection() {
  const [activeCategoryKey, setActiveCategoryKey] =
    useState<ServiceCategoryKey>("haircuts");

  const currentCategory =
    serviceCategories.find((cat) => cat.key === activeCategoryKey) ||
    serviceCategories[0];

  return (
    <section
      id="services"
      aria-label="Services Menu"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#0B0F0D] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: The Grooming Menu (Noir & Blade style) */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="The Grooming Menu"
            titleCream="The Grooming"
            titleGold="Menu"
            description="Precision grooming, beard styling, and skincare treatments crafted for gentlemen in Park View City, Lahore."
          />
        </AnimatedReveal>

        {/* 2x2 Grid of Featured Menu Items (Noir & Blade signature layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-16 sm:mb-20">
          {featuredMenu.map((item, idx) => {
            const waUrl = buildServiceInquiryWhatsAppUrl(item.title, item.category);
            return (
              <AnimatedReveal
                key={item.title}
                direction="up"
                delay={idx * 0.08}
                className="h-full"
              >
                <div className="h-full group p-5 sm:p-6 rounded-2xl bg-[#121815] border border-white/[0.08] hover:border-[#C59B46]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.85)] flex items-center gap-5 sm:gap-6">
                  {/* Haircut / Style Thumbnail */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-base lg:text-lg font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <span className="text-[11px] sm:text-xs font-bold text-[#C59B46] font-mono shrink-0 px-2 sm:px-2.5 py-0.5 rounded-full bg-[#C59B46]/10 border border-[#C59B46]/25">
                        {item.price}
                      </span>
                    </div>

                    <p className="text-xs text-[#A8A193] line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A756B]">
                        {item.category}
                      </span>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#C59B46] hover:text-[#DFC074] transition-colors"
                      >
                        <span>Book on WhatsApp</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>

        {/* Catalog Subheading */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05} className="border-t border-white/[0.08] pt-10 sm:pt-12 mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#A8A193]">
            <span className="w-4 h-[1px] bg-[#C59B46]" />
            <span>Complete Salon Catalog</span>
            <span className="w-4 h-[1px] bg-[#C59B46]" />
          </div>
          <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl font-medium text-[#F5EFEB]">
            Explore All 23 Services by Category
          </h3>
        </AnimatedReveal>

        {/* Category Tabs / Segmented Control */}
        <AnimatedReveal direction="up" delay={0.1} amount={0.05} className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-4 mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex p-1.5 rounded-full bg-[#141C18] border border-white/10 shrink-0">
            {serviceCategories.map((category) => {
              const isActive = activeCategoryKey === category.key;
              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setActiveCategoryKey(category.key)}
                  className={`relative px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#C59B46] text-[#0B0F0D] shadow-md font-bold"
                      : "text-[#B8B0A2] hover:text-[#F5EFEB] hover:bg-white/5"
                  }`}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span>{category.title}</span>
                  <span
                    className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#0B0F0D]/20 text-[#0B0F0D] font-bold"
                        : "bg-white/10 text-[#B8B0A2]"
                    }`}
                  >
                    {category.services.length}
                  </span>
                </button>
              );
            })}
          </div>
        </AnimatedReveal>

        {/* Two-Column Category Display: Left Real Photo Card (45%), Right Editorial List (55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Category Feature Photo Card (Smooth blurred edges, no card border) */}
          <AnimatedReveal direction="left" delay={0.15} amount={0.05} className="lg:col-span-5 relative z-10">
            <div
              className="relative overflow-hidden w-full h-[260px] sm:h-[340px] lg:h-[560px] flex items-center justify-center select-none"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 35%, transparent 92%)',
                maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 35%, transparent 92%)'
              }}
            >
              <Image
                key={currentCategory.key}
                src={currentCategory.image.webp}
                alt={currentCategory.image.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/40 to-transparent pointer-events-none" />

              {/* Category Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 bg-gradient-to-t from-[#0B0F0D] via-[#0B0F0D]/85 to-transparent">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C59B46]">
                  {currentCategory.shortTitle}
                </span>
                <h3 className="font-['Playfair_Display',Georgia,serif] text-xl sm:text-2xl font-medium text-[#F5EFEB] mt-1">
                  {currentCategory.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-[#B8B0A2]">
                  {currentCategory.tagline}
                </p>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#7A756B]">
                  <span>{currentCategory.services.length} Services</span>
                  <span>Rose Commercial</span>
                </div>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column: Clean Editorial Name-Only Rows (Reference A style) */}
          <AnimatedReveal direction="right" delay={0.2} amount={0.05} className="lg:col-span-7 bg-[#121815]/80 rounded-2xl border border-white/[0.08] p-4 sm:p-6 divide-y divide-white/[0.08] relative z-0">
            <div className="pb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#7A756B]">
              <span>Service</span>
              <span>Inquire</span>
            </div>

            {currentCategory.services.map((service) => {
              const inquiryUrl = buildServiceInquiryWhatsAppUrl(
                service.name,
                currentCategory.title
              );

              return (
                <div
                  key={service.id}
                  className="py-3.5 flex items-center justify-between gap-4 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors relative"
                >
                  <h4 className="font-['Playfair_Display',Georgia,serif] text-base sm:text-lg font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors">
                    {service.name}
                  </h4>

                  <a
                    href={inquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold leading-none text-center text-[#F5EFEB] hover:text-[#C59B46] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C59B46]/50 transition-colors shrink-0 select-none"
                    aria-label={`Inquire about ${service.name} on WhatsApp`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                    <span className="leading-none text-center">Inquire</span>
                    <ArrowUpRight className="w-3 h-3 text-[#A8A193] shrink-0" />
                  </a>
                </div>
              );
            })}
          </AnimatedReveal>

        </div>

        {/* Mandated small line */}
        <p className="mt-8 text-center text-xs text-[#7A756B]">
          Message us on WhatsApp for pricing and availability.
        </p>

      </div>
    </section>
  );
}
