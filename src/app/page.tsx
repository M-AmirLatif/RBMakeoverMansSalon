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
import { serviceSpotlights } from "@/data/serviceSpotlights";

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

        {/* Editorial Text Strap 1: Gold Foil Forward Ticker */}
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

        {/* 2. Precision in Every Cut: 3-column with tall portrait & icon cards */}
        <PrecisionSection />

        {/* Service Spotlight 1: Low-Drop Skin Fade & Scissor Texture */}
        <ServiceSpotlightBand {...serviceSpotlights.skinFade} />

        {/* 3. The Grooming Menu: 2x2 featured cards with thumbnails + complete catalog */}
        <ServicesSection />

        {/* Service Spotlight 2: Royal Beard Architecture & Steam */}
        <ServiceSpotlightBand {...serviceSpotlights.royalBeard} />

        {/* 4. About Us: Arched window salon photo, owner quote & hours */}
        <AboutSection />

        {/* Service Spotlight 3: The Royal Hot Towel Shave */}
        <ServiceSpotlightBand {...serviceSpotlights.royalShave} />

        {/* 5. The Hands Behind The Craft: 10 barbers roster with rate switcher */}
        <TeamSection onSelectBarber={setSelectedBarberId} />

        {/* Service Spotlight 4: Executive Hair & Beard Coordination */}
        <ServiceSpotlightBand {...serviceSpotlights.hairBeardCombo} />

        {/* 6. Voices of Our Happy Client: Vintage barber chair centerpiece & Google reviews */}
        <TestimonialsSection />

        {/* Service Spotlight 5: Hydra & Charcoal Skincare Glow */}
        <ServiceSpotlightBand {...serviceSpotlights.facialSkincare} />

        {/* Editorial Text Strap 2: Dark Glass Reverse Ticker */}
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

        {/* 7. Salon Interior Panorama */}
        <InteriorPhotoBand />

        {/* Service Spotlight 6: Deep Scalp Massage & Wash */}
        <ServiceSpotlightBand {...serviceSpotlights.scalpMassage} />

        {/* 8. Why Choose Us (6 Pillars) */}
        <WhyChooseUsSection />

        {/* Service Spotlight 7: Classic Scissor Haircut */}
        <ServiceSpotlightBand {...serviceSpotlights.classicCut} />

        {/* Editorial Text Strap 3: Subtle Gold Accent Ticker */}
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

        {/* 12. Appointment Booking Form with 10 Barbers */}
        <ContactSection preselectedBarberId={selectedBarberId} />
      </main>

      <Footer />

      <MobileActionBar hidden={hideMobileBar} />
    </>
  );
}
