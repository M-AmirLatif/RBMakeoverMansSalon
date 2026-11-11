"use client";

import React, { useState, useEffect, useRef } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { siteConfig } from "@/data/siteConfig";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Barbers (10)", href: "#team" },
  { label: "Reviews", href: "#reviews" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ onMenuToggle }: { onMenuToggle?: (isOpen: boolean) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sync mobile menu state with parent (e.g. for hiding bottom action bar)
  useEffect(() => {
    if (onMenuToggle) {
      onMenuToggle(mobileMenuOpen);
    }
  }, [mobileMenuOpen, onMenuToggle]);

  // Handle scroll appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const sections = navItems.map((item) => item.href.substring(1));
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -65% 0px",
      threshold: 0,
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll reliably on mobile and handle keyboard accessibility when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      const originalBodyPosition = document.body.style.position;
      const originalBodyTop = document.body.style.top;
      const originalBodyWidth = document.body.style.width;
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.position = originalBodyPosition;
        document.body.style.top = originalBodyTop;
        document.body.style.width = originalBodyWidth;
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        window.scrollTo(0, scrollY);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0B0F0D]/90 backdrop-blur-md border-b border-white/[0.07] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo />

          {/* Desktop Nav Items - Noir & Blade Floating Pill */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-1.5 px-3 py-1.5 rounded-full bg-[#111614]/90 border border-white/[0.08] backdrop-blur-md shadow-lg"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`relative px-4 py-1.5 text-xs lg:text-sm tracking-wide rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-[#0B0F0D] bg-[#C59B46] font-bold shadow-md"
                      : "text-[#B8B0A2] hover:text-[#F5EFEB] hover:bg-white/5 font-medium"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop CTA - Noir & Blade Gold Pill */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-[#C59B46] border border-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
              title={`Call ${siteConfig.contact.primaryPhone}`}
              aria-label={`Call ${siteConfig.contact.primaryPhone}`}
            >
              <Phone className="w-4 h-4" />
            </a>

            <Button
              href="#contact"
              variant="gold"
              size="sm"
              icon={<ArrowUpRight className="w-4 h-4" />}
            >
              Book Now →
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
              className="p-2 rounded-full bg-white/5 text-[#C59B46] border border-white/10"
              aria-label={`Call salon at ${siteConfig.contact.primaryPhone}`}
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-full bg-[#121815] text-[#F5EFEB] border border-white/10 hover:border-[#C59B46]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              <Menu className="w-5 h-5 text-[#F5EFEB]" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 bg-[#0B0F0D]/98 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
        >
          {/* Top Bar with Logo and Close */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
            <BrandLogo onClick={() => setMobileMenuOpen(false)} />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-white/5 text-[#F5EFEB] hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 py-3 my-auto shrink-0">
            {navItems.map((item, idx) => {
              const isActive = activeSection === item.href.substring(1);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className={`group flex items-center justify-between text-xl sm:text-2xl font-['Bebas_Neue',sans-serif] tracking-wider py-1.5 transition-colors ${
                    isActive ? "text-[#C59B46]" : "text-[#F5EFEB] hover:text-[#DFC074]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-mono font-normal text-[#C59B46]/60 tracking-normal font-sans">
                      0{idx + 1}
                    </span>
                    {item.label}
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </a>
              );
            })}
          </nav>

          {/* Mobile Bottom Conversion Block */}
          <div className="space-y-2.5 pt-3 border-t border-white/10 shrink-0">
            <Button
              href="#contact"
              variant="gold"
              size="md"
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
            >
              Book an Appointment
            </Button>

            <div className="grid grid-cols-2 gap-2.5">
              <Button
                href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
                external
                variant="secondary"
                size="sm"
                fullWidth
                icon={<Phone className="w-3.5 h-3.5 text-[#C59B46]" />}
                iconPosition="left"
              >
                Call Salon
              </Button>

              <Button
                href={siteConfig.contact.whatsappUrl}
                external
                variant="outline"
                size="sm"
                fullWidth
                icon={<WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />}
                iconPosition="left"
              >
                WhatsApp
              </Button>
            </div>

            <p className="text-center text-[11px] text-[#7A756B] pt-0.5 leading-tight">
              {siteConfig.contact.address.formatted}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
