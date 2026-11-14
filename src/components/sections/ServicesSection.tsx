"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { serviceCategories, ServiceCategoryKey } from "@/data/services";
import { fetchServices, SiteService, resolveServicePrice, defaultServices } from "@/lib/supabase/queries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { buildServiceInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowUpRight, ArrowRight, Sparkles, Calendar, Scissors, Layers } from "lucide-react";

export interface SignatureStyleItem {
  id: string;
  badge: string;
  title: string;
  highlightText: string;
  category: "haircuts" | "beard" | "facial" | "grooming";
  serviceQuery: string;
  fallbackPrice: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
}

export const signatureGroomingStyles: SignatureStyleItem[] = [
  // 1. Quiff Taper (Editorial 1)
  {
    id: "style-quiff-taper",
    badge: "Signature Style Spotlight",
    title: "The Textured Quiff",
    highlightText: "Precision Skin Taper",
    category: "haircuts",
    serviceQuery: "fade-haircuts",
    fallbackPrice: "Rs. 400",
    description: "Hand-sheared crown layers paired with surgical zero-gap temple transitions and textured styling finish.",
    features: ["Skin Taper Fade", "Textured Crown Lift", "Matte Pomade Finish", "Razor Clean Temple"],
    image: "/images/cutout-quiff-taper.webp",
    imageAlt: "The Textured Quiff Precision Skin Taper haircut at R.B Makeover",
  },
  // 2. Executive Comb-Over (Editorial 2)
  {
    id: "style-combover-razor",
    badge: "Executive Precision",
    title: "Executive Comb-Over",
    highlightText: "Razor Part Symmetry",
    category: "haircuts",
    serviceQuery: "scissor-cuts",
    fallbackPrice: "Rs. 500",
    description: "Surgical razor parting line paired with seamless drop gradient and high-gloss tonic for timeless boardroom presence.",
    features: ["Hard Razor Part", "Seamless Drop Fade", "Gloss Styling Tonic", "Crisp Ear Lineup"],
    image: "/images/cutout-combover-razor.webp",
    imageAlt: "Executive Comb-Over Razor Part Symmetry at R.B Makeover",
  },
  // 3. Textured Executive Crop (Spotlight 1)
  {
    id: "style-executive-crop",
    badge: "Modern European Styling",
    title: "Textured Executive Crop",
    highlightText: "Point-Cut Volume & Micro-Taper",
    category: "haircuts",
    serviceQuery: "mens-haircuts",
    fallbackPrice: "Rs. 350",
    description: "Modern European crop featuring high micro-fade temples and point-cut scissor volume for sharp everyday presence.",
    features: ["Micro Temple Taper", "Point-Cut Crown Texture", "Matte Clay Finish", "Razor Clean Neckline"],
    image: "/images/cutout-executive-crop.webp",
    imageAlt: "Textured Executive Crop haircut at R.B Makeover",
  },
  // 4. Precision Razor Line-Up & Drop Fade (Editorial 3)
  {
    id: "style-razor-dropfade",
    badge: "Contour Detailing",
    title: "Precision Razor Line-Up",
    highlightText: "High Skin Drop Fade",
    category: "haircuts",
    serviceQuery: "fade-haircuts",
    fallbackPrice: "Rs. 400",
    description: "Geometric razor edges sculpted with disposable feather blades, steep drop taper, and natural skin blend.",
    features: ["Geometric Line-Up", "Steep Drop Taper", "Feather-Blade Finish", "Natural Skin Blend"],
    image: "/images/cutout-razor-dropfade.webp",
    imageAlt: "Precision Razor Line-Up and High Skin Drop Fade at R.B Makeover",
  },
  // 5. Low-Drop Skin Fade (Spotlight 2)
  {
    id: "style-skin-fade",
    badge: "Master Cut Spotlight",
    title: "The Low-Drop Skin Fade",
    highlightText: "Precision Scissor Texture",
    category: "haircuts",
    serviceQuery: "fade-haircuts",
    fallbackPrice: "Rs. 400",
    description: "Zero-gap clipper taper smoothly transitioning into hand-sculpted crown layers and razor-clean nape lines.",
    features: ["Zero-Gap Clippers", "Scissor-Over-Comb", "Razor Clean Nape", "Matte Texture Paste"],
    image: "/images/cutout-skin-fade.webp",
    imageAlt: "Low-drop skin fade with precision scissor texture at R.B Makeover",
  },
  // 6. Royal Beard & Pompadour (Editorial 4)
  {
    id: "style-beard-pompadour",
    badge: "Royal Facial Craft",
    title: "Royal Beard & Pompadour",
    highlightText: "Hot Towel Steam Therapy",
    category: "grooming",
    serviceQuery: "hair-and-beard-styling",
    fallbackPrice: "Rs. 1,500",
    description: "Full haircut and beard transformation featuring hot towel steam, argan hydration, and cheekbone contouring.",
    features: ["Argan Beard Steam", "High-Volume Pompadour", "Cheekbone Contours", "Ice Towel Refresh"],
    image: "/images/cutout-pompadour-sculpt.webp",
    imageAlt: "Royal Beard & Pompadour Hot Towel Steam Therapy at R.B Makeover",
  },
  // 7. Royal Beard Architecture (Spotlight 3)
  {
    id: "style-royal-beard",
    badge: "Beard Architecture",
    title: "Royal Beard Architecture",
    highlightText: "Hot Towel Steam & Argan Therapy",
    category: "beard",
    serviceQuery: "beard-trimming",
    fallbackPrice: "Rs. 250",
    description: "Sculpted with straight-razor precision, eucalyptus hot steam towels, and organic argan beard oil nourishment.",
    features: ["Hot Towel Steam", "Feather-Edge Razor", "Mustache Contouring", "Organic Argan Oil"],
    image: "/images/cutout-beard-sculpt.webp",
    imageAlt: "Royal Beard Architecture at R.B Makeover",
  },
  // 8. Textured Curly Crop (Editorial 5)
  {
    id: "style-curly-taper",
    badge: "Bespoke Modern Styling",
    title: "Textured Curly Crop",
    highlightText: "Low-Fade Temple Definition",
    category: "haircuts",
    serviceQuery: "curly-styling",
    fallbackPrice: "Rs. 300",
    description: "Tailored specifically for natural curl movement. Weightless debulking through crown spirals with micro-tapers.",
    features: ["Natural Curl Definition", "Weightless Debulking", "Low Temple Fade", "Moisture Seal Tonic"],
    image: "/images/cutout-curly-taper.webp",
    imageAlt: "Textured Curly Crop haircut at R.B Makeover",
  },
  // 9. Royal Hot Towel Shave (Spotlight 4)
  {
    id: "style-royal-shave",
    badge: "Heritage Shaving",
    title: "The Royal Hot Towel Shave",
    highlightText: "Straight Razor Mastery",
    category: "beard",
    serviceQuery: "pro-shave",
    fallbackPrice: "Rs. 250",
    description: "Traditional multi-step straight razor shave. Warm lather, dual hot towels, ice-chilled towel, and soothing aloe balm.",
    features: ["Dual Hot Towels", "Pre-Shave Oil", "Single-Use Blades", "Soothing Balm Finish"],
    image: "/images/cutout-royal-shave.webp",
    imageAlt: "Traditional hot towel straight razor shaving at R.B Makeover",
  },
  // 10. Senior Stylist Discipline (Editorial 6)
  {
    id: "style-senior-discipline",
    badge: "14+ Years Master Heritage",
    title: "Senior Stylist Discipline",
    highlightText: "Handcrafted Scissor Precision",
    category: "haircuts",
    serviceQuery: "scissor-cuts",
    fallbackPrice: "Rs. 500",
    description: "Led by salon owner Imtiaz Ahmad. Classic scissor craft, tailored beard sculpting, and calm luxury consultation.",
    features: ["Bespoke Scissor Craft", "Full Beard Alignment", "Head Stylist Care", "Dedicated Lounge Time"],
    image: "/images/cutout-mature-classic.webp",
    imageAlt: "Senior Stylist Discipline Handcrafted Scissor Precision at R.B Makeover",
  },
  // 11. Hair & Beard Coordination (Spotlight 5)
  {
    id: "style-hair-beard",
    badge: "Executive Transformation",
    title: "Hair & Beard Coordination",
    highlightText: "Tailored to Your Bone Structure",
    category: "grooming",
    serviceQuery: "hair-and-beard-styling",
    fallbackPrice: "Rs. 1,500",
    description: "Harmonizing haircut with beard contouring to complement facial bone structure and temple tapers.",
    features: ["Facial Proportions", "Temple Transition", "Long-Lasting Hold", "Beard Sculpting"],
    image: "/images/cutout-hair-beard.webp",
    imageAlt: "Hair and Beard Coordination at R.B Makeover",
  },
  // 12. Hydra & Charcoal Skincare (Spotlight 6)
  {
    id: "style-facial",
    badge: "Skincare & Rejuvenation",
    title: "Hydra & Charcoal Skincare",
    highlightText: "Deep Pore Cleansing & Glow",
    category: "facial",
    serviceQuery: "facial-massage",
    fallbackPrice: "Rs. 2,100",
    description: "Deep pore cleansing, ultrasonic blackhead extraction, botanical steam, and revitalizing charcoal mask.",
    features: ["Deep Cleansing", "Charcoal Mask", "Facial Acupressure", "Hydrating Mist"],
    image: "/images/cutout-facial-skincare.webp",
    imageAlt: "Hydra and Charcoal Skincare at R.B Makeover",
  },
  // 13. Invigorating Scalp Massage (Spotlight 7)
  {
    id: "style-scalp",
    badge: "Therapeutic Wash",
    title: "Invigorating Scalp Massage",
    highlightText: "Menthol Acupressure & Follicle Therapy",
    category: "grooming",
    serviceQuery: "shampoo-conditioning",
    fallbackPrice: "Rs. 600",
    description: "Scalp acupressure massage using tea tree and peppermint botanicals, relieving tension and promoting healthy roots.",
    features: ["Botanical Steam", "Tea-Tree Menthol", "Acupressure Massage", "Cold Rinse Seal"],
    image: "/images/cutout-scalp-therapy.webp",
    imageAlt: "Invigorating scalp acupressure massage at R.B Makeover",
  },
  // 14. Classic Scissor Haircut (Spotlight 8)
  {
    id: "style-classic-cut",
    badge: "Timeless Barbering",
    title: "Classic Scissor Haircut",
    highlightText: "Handcrafted Scissor Discipline",
    category: "haircuts",
    serviceQuery: "scissor-cuts",
    fallbackPrice: "Rs. 500",
    description: "Soft natural tapers and razor-clean necklines for gentlemen who appreciate timeless scissor styling.",
    features: ["Pure Scissor Work", "Gentle Neckline Lineup", "Natural Parting", "Light Styling Tonic"],
    image: "/images/cutout-classic-cut.webp",
    imageAlt: "Classic scissor haircut at R.B Makeover",
  },
  // 15. Keratin Silk Smoothing (Spotlight 9)
  {
    id: "style-keratin",
    badge: "Structural Hair Care",
    title: "Keratin Silk Smoothing",
    highlightText: "Glossy Silk Finish & Frizz Control",
    category: "haircuts",
    serviceQuery: "hair-treatments",
    fallbackPrice: "Rs. 3,000",
    description: "Deep protein rebuilding that eliminates coarse frizz and locks in mirror shine for manageable styling.",
    features: ["Formaldehyde-Free", "Heat Activated Seal", "12-Week Durability", "Silky Manageability"],
    image: "/images/cutout-keratin-silk.webp",
    imageAlt: "Keratin silk smoothing transformation at R.B Makeover",
  },
  // 16. The Executive VIP Package (Spotlight 10)
  {
    id: "style-vip",
    badge: "Signature All-Inclusive",
    title: "The Executive VIP Package",
    highlightText: "Complete Head-to-Toe Distinction",
    category: "grooming",
    serviceQuery: "vip-grooming",
    fallbackPrice: "Rs. 3,500",
    description: "Master haircut, beard sculpting, charcoal facial massage, deep scalp wash, and hot towel aromatherapies.",
    features: ["Full Service Hair & Beard", "Hydra Facial Cleansing", "Scalp Steam Massage", "Signature Styling"],
    image: "/images/cutout-vip-grooming.webp",
    imageAlt: "The Executive VIP Grooming Package at R.B Makeover",
  },
  // 17. Razor Lineup & Temple Edge (Spotlight 11)
  {
    id: "style-razor-lineup",
    badge: "Precision Detailing",
    title: "Razor Lineup & Temple Edge",
    highlightText: "Zero-Tolerance Contour Geometry",
    category: "beard",
    serviceQuery: "beard-trimming",
    fallbackPrice: "Rs. 250",
    description: "Laser-focused edge work using disposable feather blades to carve crisp cheek curves and neckline definition.",
    features: ["Feather Razor Blades", "Hot Aloe Prep", "Geometric Symmetry", "Post-Shave Ice Towel"],
    image: "/images/cutout-razor-lineup.webp",
    imageAlt: "Razor Lineup and Temple Edge at R.B Makeover",
  },
  // 18. The Executive Finish & Aura (Spotlight 12)
  {
    id: "style-executive-finish",
    badge: "The Grand Standard",
    title: "The Executive Finish & Aura",
    highlightText: "Signature Confidence for Every Occasion",
    category: "grooming",
    serviceQuery: "hair-and-beard-styling",
    fallbackPrice: "Rs. 1,500",
    description: "Signature hot towel finish, collar brush-down, and premium styling tonic for boardroom prominence.",
    features: ["Hot Towel Finish", "Collar Brush-Down", "Matte Pomade Styling", "VIP Walkout Confidence"],
    image: "/images/cutout-master-finish.webp",
    imageAlt: "The Executive Finish and Signature Aura at R.B Makeover",
  },
];

export function ServicesSection() {
  const [styleFilter, setStyleFilter] = useState<"all" | "haircuts" | "beard" | "facial" | "grooming">("all");
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

  const filteredStyles =
    styleFilter === "all"
      ? signatureGroomingStyles
      : signatureGroomingStyles.filter((s) => s.category === styleFilter);

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
            description="Explore all signature handcrafted looks and complete salon services. Every price is synchronized directly with our admin matrix for 100% pricing uniformity."
          />
        </AnimatedReveal>

        {/* ============================================================ */}
        {/* PART 1: ALL 16+ SIGNATURE STYLE SHOWCASE CARDS               */}
        {/* Exact same images, titles & 4 bullet features as the feed,   */}
        {/* now showing verified live pricing and direct WhatsApp booking */}
        {/* ============================================================ */}
        <div className="mb-16 sm:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C59B46] animate-pulse" />
              <div>
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-[#DFC074]">
                  All {signatureGroomingStyles.length} Signature Styles &amp; Verified Rates
                </h3>
                <p className="text-xs text-[#A8A193] mt-0.5">
                  Clicking &quot;Book&quot; on any style above jumps directly to its card below.
                </p>
              </div>
            </div>

            {/* Sub-Filter Tabs for Signature Styles */}
            <div className="inline-flex p-1 rounded-full bg-[#141C18] border border-white/10 self-start sm:self-auto overflow-x-auto no-scrollbar max-w-full">
              {[
                { key: "all", label: `All (${signatureGroomingStyles.length})` },
                { key: "haircuts", label: "Haircuts & Fades" },
                { key: "beard", label: "Beard & Shaving" },
                { key: "facial", label: "Skincare" },
                { key: "grooming", label: "VIP & Combos" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStyleFilter(key as typeof styleFilter)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
                    styleFilter === key
                      ? "bg-[#C59B46] text-[#0B0F0D] font-bold shadow-sm"
                      : "text-[#A8A193] hover:text-[#F5EFEB]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 16+ Signature Styles Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStyles.map((item, idx) => {
              const livePrice = resolveServicePrice(dbServices, item.serviceQuery, item.fallbackPrice);
              const waUrl = `https://wa.me/923269326566?text=${encodeURIComponent(
                `Hello! I would like to book *${item.title} - ${item.highlightText}* (${item.features.join(", ")}) at R.B Makeover Salon for ${livePrice}. Please share available slots.`
              )}`;

              return (
                <AnimatedReveal
                  key={item.id}
                  direction="up"
                  delay={(idx % 6) * 0.05}
                  className="h-full"
                >
                  <div
                    id={item.id}
                    className="scroll-mt-28 h-full group rounded-2xl bg-[#121815] border border-white/[0.08] hover:border-[#C59B46]/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden relative"
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
        {/* PART 2: COMPLETE 26 SERVICES CATALOG                         */}
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
