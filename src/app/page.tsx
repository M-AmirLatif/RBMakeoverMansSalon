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

        {/* 2. Precision in Every Cut: 3-column with tall portrait & icon cards */}
        <PrecisionSection />

        {/* 3. The Grooming Menu: 2x2 featured cards with thumbnails + complete catalog */}
        <ServicesSection />

        {/* 4. About Us: Arched window salon photo, owner quote & hours */}
        <AboutSection />

        {/* 5. The Hands Behind The Craft: 10 barbers roster with rate switcher */}
        <TeamSection onSelectBarber={setSelectedBarberId} />

        {/* 6. Voices of Our Happy Client: Vintage barber chair centerpiece & Google reviews */}
        <TestimonialsSection />

        {/* 7. Salon Interior Panorama */}
        <InteriorPhotoBand />

        {/* 8. Why Choose Us (6 Pillars) */}
        <WhyChooseUsSection />

        {/* 9. Gallery with Lightbox */}
        <GallerySection onLightboxToggle={setLightboxOpen} />

        {/* 10. Facilities & Comforts */}
        <FacilitiesSection />

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
