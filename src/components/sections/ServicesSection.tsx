"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { serviceCategories, ServiceCategoryKey } from "@/data/services";
import { fetchServices, SiteService, resolveServicePrice, defaultServices } from "@/lib/supabase/queries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowUpRight, ArrowRight, Sparkles, Calendar, Scissors } from "lucide-react";

export interface SignatureStyleItem {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  category: string;
  serviceQuery: string;
  fallbackPrice: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

export const signatureGroomingStyles: SignatureStyleItem[] = [
  {
    id: "style-quiff-taper",
    badge: "Signature Style Spotlight",
    title: "The Textured Quiff",
    highlightText: "Precision Skin Taper",
    category: "Haircuts & Styling",
    serviceQuery: "fade-haircuts",
    fallbackPrice: "Rs. 400",
    description: "Hand-sheared crown volume paired with surgical zero-gap temple transitions and textured styling finish.",
    features: ["Skin Taper Fade", "Textured Crown Lift", "Matte Pomade Finish", "Razor Clean Temple"],
    image: "/images/cutout-quiff-taper.webp",
    imageAlt: "The Textured Quiff Precision Skin Taper haircut at R.B Makeover",
  },
  {
    id: "style-combover-razor",
    badge: "Executive Precision",
    title: "Executive Comb-Over",
    highlightText: "Razor Part Symmetry",
    category: "Haircuts & Styling",
    serviceQuery: "scissor-cuts",
    fallbackPrice: "Rs. 500",
    description: "Surgical razor parting line paired with seamless drop gradient and high-gloss tonic for timeless boardroom presence.",
    features: ["Hard Razor Part", "Seamless Drop Fade", "Gloss Styling Tonic", "Crisp Ear Lineup"],
    image: "/images/cutout-combover-razor.webp",
    imageAlt: "Executive Comb-Over Razor Part Symmetry at R.B Makeover",
  },
  {
    id: "style-executive-crop",
    badge: "Modern European Styling",
    title: "Textured Executive Crop",
    highlightText: "Point-Cut Volume & Micro-Taper",
    category: "Haircuts & Styling",
    serviceQuery: "mens-haircuts",
    fallbackPrice: "Rs. 350",
    description: "Modern European crop featuring high micro-fade temples and point-cut scissor volume for sharp everyday presence.",
    features: ["Micro Temple Taper", "Point-Cut Crown Texture", "Matte Clay Finish", "Razor Clean Neckline"],
    image: "/images/cutout-executive-crop.webp",
    imageAlt: "Textured Executive Crop haircut at R.B Makeover",
  },
  {
    id: "style-razor-dropfade",
    badge: "Contour Detailing",
    title: "Precision Razor Line-Up",
    highlightText: "High Skin Drop Fade",
    category: "Haircuts & Styling",
    serviceQuery: "fade-haircuts",
    fallbackPrice: "Rs. 400",
    description: "Geometric razor edges sculpted with disposable feather blades, steep drop taper, and natural skin blend.",
    features: ["Geometric Line-Up", "Steep Drop Taper", "Feather-Blade Finish", "Natural Skin Blend"],
    image: "/images/cutout-razor-dropfade.webp",
    imageAlt: "Precision Razor Line-Up and High Skin Drop Fade at R.B Makeover",
  },
  {
    id: "style-beard-pompadour",
    badge: "Royal Facial Craft",
    title: "Royal Beard & Pompadour",
    highlightText: "Hot Towel Steam Therapy",
    category: "Additional Grooming Services",
    serviceQuery: "hair-and-beard-styling",
    fallbackPrice: "Rs. 1,500",
    description: "Full haircut and beard transformation featuring hot towel steam, argan hydration, and cheekbone contouring.",
    features: ["Argan Beard Steam", "High-Volume Pompadour", "Cheekbone Contours", "Ice Towel Refresh"],
    image: "/images/cutout-pompadour-sculpt.webp",
    imageAlt: "Royal Beard & Pompadour Hot Towel Steam Therapy at R.B Makeover",
  },
  {
    id: "style-senior-discipline",
    badge: "14+ Years Master Heritage",
    title: "Senior Stylist Discipline",
    highlightText: "Handcrafted Scissor Precision",
    category: "Haircuts & Styling",
    serviceQuery: "scissor-cuts",
    fallbackPrice: "Rs. 500",
    description: "Led by salon owner Imtiaz Ahmad. Classic scissor craft, tailored beard sculpting, and calm luxury consultation.",
    features: ["Bespoke Scissor Craft", "Full Beard Alignment", "Head Stylist Care", "Dedicated Lounge Time"],
    image: "/images/cutout-mature-classic.webp",
    imageAlt: "Senior Stylist Discipline Handcrafted Scissor Precision at R.B Makeover",
  },
];

export function ServicesSection() {
  const [activeCategoryKey, setActiveCategoryKey] =
    useState<ServiceCategoryKey>("haircuts");
  const [dbServices, setDbServices] = useState<SiteService[]>(defaultServices);

  useEffect(() => {
    let mounted = true;
    fetchServices().then((list) => {
      if (mounted && list && list.length > 0) {
        setDbServices(list);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isServiceInCategory = (serviceCategory: string, catKey: ServiceCategoryKey): boolean => {
    const sc = (serviceCategory || "").toLowerCase().trim();
    if (catKey === "haircuts") {
      return sc === "haircuts" || sc.includes("hair") || sc.includes("cut") || sc.includes("styling");
    }
    if (catKey === "beard") {
      return sc === "beard" || sc.includes("beard") || sc.includes("shav");
    }
    if (catKey === "facial") {
      return sc === "facial" || sc.includes("facial") || sc.includes("skin") || sc.includes("massage");
    }
    if (catKey === "grooming") {
      return (
        sc === "grooming" ||
        sc.includes("groom") ||
        sc.includes("package") ||
        sc.includes("vip") ||
        sc.includes("mani") ||
        sc.includes("pedi")
      );
    }
    return false;
  };

  const getCategoryServices = (catKey: ServiceCategoryKey): SiteService[] => {
    const matched = dbServices.filter((s) => isServiceInCategory(s.category, catKey));
    if (matched.length > 0) {
      return matched;
    }
    const staticCat = serviceCategories.find((cat) => cat.key === catKey);
    if (!staticCat) return [];
    return staticCat.services.map((s, idx) => ({
      id: s.id,
      name: s.name,
      category: catKey,
      price: s.price || "Rs. 1,000",
      numeric_price: Number(String(s.price).replace(/[^0-9]/g, "")) || 1000,
      description: "",
      duration: "30 min",
      display_order: idx + 1,
    }));
  };

  const currentCategory =
    serviceCategories.find((cat) => cat.key === activeCategoryKey) ||
    serviceCategories[0];

  const dynamicCategoryServices = getCategoryServices(activeCategoryKey);

  return (
    <section
      id="services"
      aria-label="Services Menu"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#0B0F0D] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading: The Grooming Menu */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="The Grooming Menu"
            titleCream="The Grooming"
            titleGold="Menu"
            description="Precision haircuts, skin fades, beard sculpting, and skincare treatments crafted for gentlemen in Park View City, Lahore. All prices are verified and updated in real-time."
          />
        </AnimatedReveal>

        {/* ============================================================ */}
        {/* PART 1: SIGNATURE STYLES SPOTLIGHT CARDS                     */}
        {/* Exact same images, titles & 4 bullet features as the feed,   */}
        {/* now showing verified pricing and direct WhatsApp booking     */}
        {/* ============================================================ */}
        <div className="mb-16 sm:mb-20">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#C59B46] animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#DFC074]">
                Featured Signature Styles &amp; Rates
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#A8A193] hidden sm:inline">
              Single Source of Truth Pricing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatureGroomingStyles.map((item, idx) => {
              const livePrice = resolveServicePrice(dbServices, item.serviceQuery, item.fallbackPrice);
              const waUrl = `https://wa.me/923269326566?text=${encodeURIComponent(
                `Hello! I would like to book *${item.title} - ${item.highlightText}* (${item.features.join(", ")}) at R.B Makeover Salon for ${livePrice}. Please share available slots.`
              )}`;

              return (
                <AnimatedReveal
                  key={item.id}
                  direction="up"
                  delay={idx * 0.06}
                  className="h-full"
                >
                  <div
                    id={item.id}
                    className="h-full group rounded-2xl bg-[#121815] border border-white/[0.08] hover:border-[#C59B46]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Top Scrim & Badge */}
                    <div className="p-5 sm:p-6 pb-2 relative z-10">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C59B46]">
                          ✦ {item.badge}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#DFC074] px-2.5 py-0.5 rounded-full bg-[#C59B46]/10 border border-[#C59B46]/30 shrink-0">
                          {livePrice}
                        </span>
                      </div>

                      <h4 className="font-['Playfair_Display',Georgia,serif] text-lg sm:text-xl font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors leading-snug">
                        <span>{item.title}</span>{" "}
                        <span className="italic text-[#C59B46]">{item.highlightText}</span>
                      </h4>

                      <p className="text-xs text-[#A8A193] mt-2 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Style Cutout Image */}
                    <div className="relative w-full h-48 sm:h-56 my-1 flex items-end justify-center px-4 overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500 select-none"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#121815] to-transparent pointer-events-none" />
                    </div>

                    {/* Features & Booking Buttons */}
                    <div className="p-5 sm:p-6 pt-2 space-y-3.5 relative z-10 border-t border-white/[0.06] bg-[#0E1411]">
                      {/* 4 Feature Pills matching the showcase exact bullet points */}
                      <div className="grid grid-cols-2 gap-2">
                        {item.features.map((feat) => (
                          <div
                            key={feat}
                            className="p-1.5 sm:p-2 rounded-lg bg-black/40 border border-white/[0.06] flex items-center gap-1.5 min-w-0"
                          >
                            <Sparkles className="w-3 h-3 text-[#C59B46] shrink-0" />
                            <span className="text-[11px] font-medium text-[#E5DFD9] truncate">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#C59B46] hover:bg-[#DFC074] active:bg-[#9A752B] text-[#0B0F0D] font-bold text-xs tracking-wider uppercase transition-all shadow-md group/btn select-none"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-[#0B0F0D] shrink-0" />
                          <span>Book on WhatsApp</span>
                          <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform shrink-0" />
                        </a>

                        <a
                          href="#contact"
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C59B46]/40 text-[#DFC074] transition-colors shrink-0"
                          title="Select in Multi-Service Online Booking"
                          aria-label="Select in Multi-Service Online Booking"
                        >
                          <Calendar className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedReveal>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* PART 2: COMPLETE 23+ SERVICES CATALOG                         */}
        {/* Dynamic categories, live DB pricing, search & WhatsApp inquiry */}
        {/* ============================================================ */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05} className="border-t border-white/[0.08] pt-10 sm:pt-14 mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#A8A193]">
            <span className="w-4 h-[1px] bg-[#C59B46]" />
            <span>Complete Salon Catalog</span>
            <span className="w-4 h-[1px] bg-[#C59B46]" />
          </div>
          <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl sm:text-3xl lg:text-4xl font-medium text-[#F5EFEB]">
            Explore All {dbServices.length > 0 ? dbServices.length : 26} Services by Category
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A193] mt-2 max-w-xl mx-auto">
            Select any service below to inquire on WhatsApp, or book multiple services at once in our online reservation system.
          </p>
        </AnimatedReveal>

        {/* Category Tabs / Segmented Control */}
        <AnimatedReveal direction="up" delay={0.1} amount={0.05} className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar gap-2 pb-4 mb-8 sm:mb-10 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex p-1.5 rounded-full bg-[#141C18] border border-white/10 shrink-0">
            {serviceCategories.map((category) => {
              const isActive = activeCategoryKey === category.key;
              const count = getCategoryServices(category.key).length;
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
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </AnimatedReveal>

        {/* Two-Column Category Display: Left Real Photo Card (45%), Right Editorial List (55%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Category Feature Photo Card */}
          <AnimatedReveal direction="left" delay={0.15} amount={0.05} className="lg:col-span-5 relative z-10">
            <div
              className="relative overflow-hidden w-full h-[260px] sm:h-[340px] lg:h-[560px] flex items-center justify-center select-none rounded-2xl border border-white/[0.08]"
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
                  <span>{dynamicCategoryServices.length} Verified Services</span>
                  <span>Rose Commercial PVC</span>
                </div>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column: Clean Editorial Rows with live DB price */}
          <AnimatedReveal direction="right" delay={0.2} amount={0.05} className="lg:col-span-7 bg-[#121815]/80 rounded-2xl border border-white/[0.08] p-4 sm:p-6 divide-y divide-white/[0.08] relative z-0 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="pb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#7A756B]">
              <span>Service</span>
              <span>Rate / Inquire</span>
            </div>

            {dynamicCategoryServices.map((service) => {
              const livePrice = service.price || resolveServicePrice(dbServices, service.id, "Rs. 1,000");
              const inquiryUrl = buildServiceInquiryWhatsAppUrl(
                service.name,
                currentCategory.title
              );

              return (
                <div
                  key={service.id}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors relative"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59B46] shrink-0" />
                    <div>
                      <h4 className="font-['Playfair_Display',Georgia,serif] text-sm sm:text-lg font-medium text-[#F5EFEB] group-hover:text-[#DFC074] transition-colors leading-snug">
                        {service.name}
                      </h4>
                      {service.duration && (
                        <span className="text-[11px] text-[#7A756B] font-mono block mt-0.5">
                          ⏱️ {service.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
                    <span className="font-mono text-xs sm:text-sm text-[#DFC074] font-semibold whitespace-nowrap">
                      {livePrice}
                    </span>

                    <a
                      href={inquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold leading-none text-center text-[#F5EFEB] hover:text-[#C59B46] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#C59B46]/50 transition-colors shrink-0 select-none"
                      aria-label={`Inquire about ${service.name} on WhatsApp`}
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                      <span className="hidden sm:inline leading-none text-center">Inquire</span>
                      <ArrowUpRight className="w-3 h-3 text-[#A8A193] shrink-0" />
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Bottom Multi-Service Reservation Banner */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-[#A8A193] text-center sm:text-left">
                Want to book multiple services together?
              </span>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C59B46] hover:bg-[#DFC074] text-[#0B0F0D] font-bold text-xs tracking-wider uppercase transition-all shadow-md shrink-0"
              >
                <span>Select Multiple Services in Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </AnimatedReveal>

        </div>

        {/* Small reassurance line */}
        <p className="mt-8 text-center text-xs text-[#7A756B]">
          All service rates are managed in real-time. Message us on WhatsApp or select multiple services above to reserve.
        </p>

      </div>
    </section>
  );
}
