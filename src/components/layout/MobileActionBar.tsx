"use client";

import React from "react";
import { siteConfig } from "@/data/siteConfig";
import { Phone, Navigation, Calendar } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";

interface MobileActionBarProps {
  hidden?: boolean;
}

export function MobileActionBar({ hidden = false }: MobileActionBarProps) {
  if (hidden) return null;

  return (
    /* Mobile Sticky Bottom Bar (Visible on mobile screens < 768px only) */
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F0D]/95 backdrop-blur-lg border-t border-white/10 px-3 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.6)]"
      role="region"
      aria-label="Quick Actions"
    >
      <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
        {/* Call */}
        <a
          href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-white/[0.04] active:bg-[#C59B46]/20 border border-white/[0.06] text-[#F5EFEB] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C59B46]"
          aria-label={`Call salon directly at ${siteConfig.contact.primaryPhone}`}
        >
          <Phone className="w-4 h-4 text-[#C59B46] mb-1" />
          <span className="text-[10px] font-semibold tracking-tight leading-none">Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={siteConfig.contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-white/[0.04] active:bg-[#25D366]/20 border border-white/[0.06] text-[#F5EFEB] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C59B46]"
          aria-label="Open chat on WhatsApp"
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366] mb-1" />
          <span className="text-[10px] font-semibold tracking-tight leading-none">WhatsApp</span>
        </a>

        {/* Directions */}
        <a
          href={siteConfig.maps.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-white/[0.04] active:bg-[#C59B46]/20 border border-white/[0.06] text-[#F5EFEB] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C59B46]"
          aria-label="Get driving directions in Google Maps"
        >
          <Navigation className="w-4 h-4 text-[#C59B46] mb-1" />
          <span className="text-[10px] font-semibold tracking-tight leading-none">Directions</span>
        </a>

        {/* Book */}
        <a
          href="#contact"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-[#C59B46] active:bg-[#DFC074] text-[#0B0F0D] font-bold shadow-[0_2px_10px_rgba(197,155,70,0.3)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
          aria-label="Jump to appointment inquiry form"
        >
          <Calendar className="w-4 h-4 mb-1" />
          <span className="text-[10px] font-bold tracking-tight leading-none">Book</span>
        </a>
      </div>
    </div>
  );
}
