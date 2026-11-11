import React from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { MapPin, Navigation, ExternalLink, Phone, Car } from "lucide-react";

export function LocationSection() {
  return (
    <section
      id="location"
      aria-label="Location"
      className="relative py-20 sm:py-28 bg-[#0B0F0D] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Location"
          titleCream="Rose Commercial,"
          titleGold="Park View City"
          description="Find us along Main Boulevard in Park View City, Lahore. Parking is available right outside."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Location Details & Storefront Photo (5 cols) */}
          <AnimatedReveal direction="left" delay={0.1} amount={0.15} className="lg:col-span-5 h-full">
            <div className="h-full flex flex-col justify-between space-y-6 bg-[#141C18] p-6 sm:p-8 rounded-2xl border border-white/[0.08] shadow-xl">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#C59B46] bg-[#C59B46]/10 border border-[#C59B46]/20">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Park View City, Lahore</span>
                </div>

                <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl font-medium text-[#F5EFEB]">
                  {siteConfig.name}
                </h3>

                <p className="text-sm text-[#B8B0A2] leading-relaxed">
                  {siteConfig.contact.address.formatted}
                </p>

                {/* Storefront Image preview */}
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-white/10 my-4">
                  <Image
                    src="/images/storefront-exterior.webp"
                    alt="Storefront entrance of R.B Makeover Man's Salon at Rose Commercial"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3 text-[11px] font-semibold text-[#F5EFEB] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C59B46]" />
                    <span>Main Boulevard Facade</span>
                  </div>
                </div>

                {/* Arrival Details */}
                <div className="space-y-2.5 pt-2 text-xs text-[#A8A193]">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#C59B46] shrink-0" />
                    <span>Free street parking and on-site parking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C59B46] shrink-0" />
                    <span>Phone: {siteConfig.contact.primaryPhone}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  href={siteConfig.maps.directionsUrl}
                  external
                  variant="gold"
                  size="md"
                  fullWidth
                  icon={<Navigation className="w-4 h-4" />}
                >
                  Get Directions
                </Button>

                <Button
                  href={siteConfig.maps.officialUrl}
                  external
                  variant="outline"
                  size="md"
                  fullWidth
                  icon={<ExternalLink className="w-4 h-4 text-[#C59B46]" />}
                >
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </AnimatedReveal>

          {/* Right Column: Google Maps Embed (7 cols) */}
          <AnimatedReveal direction="right" delay={0.15} amount={0.15} className="lg:col-span-7 h-full">
            <div className="h-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl relative min-h-[340px] sm:min-h-[400px] bg-[#121815] flex flex-col">
              <iframe
                title="Google Maps Location for R.B Makeover Man's Salon"
                src={siteConfig.maps.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "340px", flex: 1 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full filter saturate-[0.85] contrast-[1.05]"
              />
              <div className="absolute top-4 right-4 z-10">
                <a
                  href={siteConfig.maps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-[#0B0F0D] bg-[#C59B46] hover:bg-[#DFC074] shadow-lg transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>
          </AnimatedReveal>

        </div>

        <p className="mt-4 text-center text-[11px] text-[#7A756B]">
          Verified location at Rose Commercial, Main Boulevard, Park View City, Lahore.
        </p>

      </div>
    </section>
  );
}
