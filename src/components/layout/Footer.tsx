"use client";

import React from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { siteConfig } from "@/data/siteConfig";
import { WhatsAppIcon, FacebookIcon, GoogleGIcon } from "@/components/ui/Icons";
import { Phone, Mail, MapPin, ArrowUp, Scissors } from "lucide-react";

export function Footer() {
  const currentYear = React.useSyncExternalStore(
    () => () => {},
    () => new Date().getFullYear(),
    () => 2026
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Choose Us", href: "#why-us" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#reviews" },
    { label: "Team", href: "#team" },
    { label: "Facilities", href: "#facilities" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative bg-[#080B0A] border-t border-white/[0.08] text-[#B8B0A2] pt-16 pb-28 md:pb-16 overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#C59B46]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/[0.07]">
          {/* Column 1: Brand & Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo />
            <p className="text-sm text-[#A8A193] max-w-sm leading-relaxed">
              {siteConfig.shortDescription}
            </p>

            {/* Rating summary badge */}
            <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5">
                <GoogleGIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-[#F5EFEB]">4.9 / 5 Rating</span>
                <span className="text-[#A8A193]"> (36 Reviews / From Google)</span>
              </div>
            </div>

            {/* Social channels */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteConfig.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#25D366]/20 border border-white/10 hover:border-[#25D366]/50 flex items-center justify-center text-[#F5EFEB] hover:text-[#25D366] transition-colors"
                aria-label="Connect on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.contact.social.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/50 flex items-center justify-center text-[#F5EFEB] hover:text-[#1877F2] transition-colors"
                aria-label="Visit Facebook Profile"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>

              <a
                href={siteConfig.maps.searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/50 flex items-center justify-center text-[#F5EFEB] hover:text-[#C59B46] transition-colors"
                aria-label="Find us on Google Maps"
              >
                <GoogleGIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Mandated Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-['Playfair_Display',Georgia,serif] text-base font-semibold text-[#F5EFEB] tracking-wide">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-[#C59B46] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-['Playfair_Display',Georgia,serif] text-base font-semibold text-[#F5EFEB] tracking-wide">
              Park View City Location
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C59B46] shrink-0 mt-1" />
                <span>{siteConfig.contact.address.formatted}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C59B46] shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
                  className="hover:text-[#C59B46] transition-colors"
                >
                  {siteConfig.contact.primaryPhone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C59B46] shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-[#C59B46] transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </div>

            <div className="pt-3">
              <a
                href={siteConfig.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#C59B46] hover:text-[#DFC074] underline underline-offset-4 font-semibold"
              >
                <span>Open route in Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright (Cleaned) and Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A756B]">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Scissors className="w-3.5 h-3.5 text-[#C59B46]" />
            <span>
              &copy; {currentYear} {siteConfig.name}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[#605C55]">Park View City, Lahore</span>
            <a
              href="/admin/login"
              className="text-[#605C55] hover:text-[#C59B46] transition-colors"
              title="Admin Login"
            >
              Admin
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#A8A193] hover:text-[#C59B46] transition-colors font-medium cursor-pointer"
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
