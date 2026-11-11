"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { HeroSection } from "@/components/sections/HeroSection";
import { PrecisionSection } from "@/components/sections/PrecisionSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { InteriorPhotoBand } from "@/components/sections/InteriorPhotoBand";
import { WhyChooseUsSection } from "@/components/sections/WhyChooseUsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { FacilitiesSection } from "@/components/sections/FacilitiesSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { ServiceSpotlightBand } from "@/components/ui/ServiceSpotlightBand";
import { EditorialShowcaseBand } from "@/components/ui/EditorialShowcaseBand";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { serviceSpotlights } from "@/data/serviceSpotlights";
import { newEditorialShowcases } from "@/data/newEditorialShowcases";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);

  const hideMobileBar = mobileMenuOpen || lightboxOpen;

  return (
    <>
      <Navbar onMenuToggle={setMobileMenuOpen} />

      <main id="main-content" className="flex-1 focus:outline-none">
        {/* 1. Hero: Noir & Blade + The Gentleman's Club synthesis */}
        <HeroSection />

        {/* Editorial Showcase 2 (matching user screenshot 2: below hero CTAs & before ticker) */}
        <EditorialShowcaseBand {...newEditorialShowcases.heroPart2CombOver} />

        {/* Editorial Text Strap 1: Gold Foil Forward Ticker */}
        <AnimatedReveal direction="fade" delay={0.05} amount={0.05}>
          <MarqueeTicker
            direction="forward"
            variant="gold-foil"
            iconType="scissors"
            items={[
              "R.B MAKEOVER MAN'S SALON",
              "PARK VIEW CITY LAHORE",
              "4.9 ★ RATED ON GOOGLE (36 REVIEWS)",
              "10 MASTER BARBERS ON DECK",
              "PRECISION IN EVERY CUT",
              "HOT TOWEL ROYAL SHAVING",
              "BEARD SCULPTING & LINEUPS",
              "VIP GROOMING PACKAGES",
            ]}
          />
        </AnimatedReveal>

        {/* Service Spotlight 1: Modern Textured European Crop */}
        <ServiceSpotlightBand {...serviceSpotlights.executiveCrop} />

        {/* 2. Precision in Every Cut: 3-column with tall portrait & icon cards */}
        <PrecisionSection />

        {/* Editorial Showcase 3 (matching user screenshot 4: below precision section) */}
        <EditorialShowcaseBand {...newEditorialShowcases.precisionDropFade} />

        {/* Service Spotlight 2: Low-Drop Skin Fade & Scissor Texture */}
        <ServiceSpotlightBand {...serviceSpotlights.skinFade} />

        {/* 3. The Grooming Menu: 2x2 featured cards with thumbnails + complete catalog */}
        <ServicesSection />

        {/* Editorial Showcase 4 (matching user screenshot 3: below services section) */}
        <EditorialShowcaseBand {...newEditorialShowcases.servicesBeardArchitecture} />

        {/* Service Spotlight 2: Royal Beard Architecture & Steam */}
        <ServiceSpotlightBand {...serviceSpotlights.royalBeard} />

        {/* 4. About Us: Arched window salon photo, owner quote & hours */}
        <AboutSection />

        {/* Editorial Showcase 5 (matching user screenshot 5: below about section) */}
        <EditorialShowcaseBand {...newEditorialShowcases.aboutCurlyTaper} />

        {/* Service Spotlight 3: The Royal Hot Towel Shave */}
        <ServiceSpotlightBand {...serviceSpotlights.royalShave} />

        {/* 5. The Hands Behind The Craft: 10 barbers roster with rate switcher */}
        <TeamSection onSelectBarber={setSelectedBarberId} />

        {/* Editorial Showcase 6 (matching user screenshot 6: below team section) */}
        <EditorialShowcaseBand {...newEditorialShowcases.teamSeniorDiscipline} />

        {/* Service Spotlight 4: Executive Hair & Beard Coordination */}
        <ServiceSpotlightBand {...serviceSpotlights.hairBeardCombo} />

        {/* 6. Voices of Our Happy Client: Vintage barber chair centerpiece & Google reviews */}
        <TestimonialsSection />

        {/* Service Spotlight 5: Hydra & Charcoal Skincare Glow */}
        <ServiceSpotlightBand {...serviceSpotlights.facialSkincare} />

        {/* Editorial Text Strap 2: Dark Glass Reverse Ticker */}
        <AnimatedReveal direction="fade" delay={0.05} amount={0.05}>
          <MarqueeTicker
            direction="reverse"
            variant="dark-glass"
            iconType="star"
            items={[
              "MASTER HAIRCUTS & SKIN FADES",
              "BEARD SCULPTING & CLEAN LINEUPS",
              "CHARCOAL FACIALS & DEEP CLEANSING",
              "HOT TOWEL STRAIGHT RAZOR SHAVE",
              "HAIR STEAM & SCALP THERAPY",
              "TAILORED GROOMING COMBOS",
            ]}
          />
        </AnimatedReveal>

        {/* 7. Salon Interior Panorama */}
        <InteriorPhotoBand />

        {/* Service Spotlight 6: Deep Scalp Massage & Wash */}
        <ServiceSpotlightBand {...serviceSpotlights.scalpMassage} />

        {/* 8. Why Choose Us (6 Pillars) */}
        <WhyChooseUsSection />

        {/* Service Spotlight 7: Classic Scissor Haircut */}
        <ServiceSpotlightBand {...serviceSpotlights.classicCut} />

        {/* Editorial Text Strap 3: Subtle Gold Accent Ticker */}
        <AnimatedReveal direction="fade" delay={0.05} amount={0.05}>
          <MarqueeTicker
            direction="forward"
            variant="subtle"
            iconType="sparkles"
            items={[
              "OPEN MON - SAT 10:00 AM - 11:00 PM",
              "SUNDAY OFF-DAY",
              "ROSE COMMERCIAL, MAIN BOULEVARD",
              "PARK VIEW CITY, LAHORE",
              "WHATSAPP: 0326 9326566",
              "WALK-INS & APPOINTMENTS WELCOME",
            ]}
          />
        </AnimatedReveal>

        {/* 9. Gallery with Lightbox */}
        <GallerySection onLightboxToggle={setLightboxOpen} />

        {/* Service Spotlight 8: Keratin Protein & Hair Smoothing */}
        <ServiceSpotlightBand {...serviceSpotlights.keratinProtein} />

        {/* 10. Facilities & Comforts */}
        <FacilitiesSection />

        {/* Service Spotlight 9: The Executive VIP Grooming Package */}
        <ServiceSpotlightBand {...serviceSpotlights.vipGrooming} />

        {/* 11. Location & Verified Google Map */}
        <LocationSection />

        {/* Service Spotlight 11: Precision Razor Lineup & Temple Detailing */}
        <ServiceSpotlightBand {...serviceSpotlights.razorLineup} />

        {/* 12. Appointment Booking Form with 10 Barbers */}
        <ContactSection preselectedBarberId={selectedBarberId} />

        {/* Service Spotlight 12: The Grand Executive Finish & Signature Presence */}
        <ServiceSpotlightBand {...serviceSpotlights.executiveFinish} />
      </main>

      <Footer />

      <MobileActionBar hidden={hideMobileBar} />
    </>
  );
}
