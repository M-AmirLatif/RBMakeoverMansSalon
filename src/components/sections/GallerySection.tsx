"use client";

import React, { useState } from "react";
import Image from "next/image";
import { galleryImages, SalonImage } from "@/data/images";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox } from "@/components/ui/Lightbox";
import { Eye } from "lucide-react";

export function GallerySection({
  onLightboxToggle,
}: {
  onLightboxToggle?: (isOpen: boolean) => void;
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleOpenLightbox = (image: SalonImage) => {
    const idx = galleryImages.findIndex((img) => img.id === image.id);
    if (idx !== -1) {
      setSelectedImageIndex(idx);
      setLightboxOpen(true);
      onLightboxToggle?.(true);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    onLightboxToggle?.(false);
  };

  return (
    <section
      id="gallery"
      aria-label="Gallery of Salon and Work"
      className="relative py-20 sm:py-28 bg-[#0B0F0D] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          eyebrow="Gallery"
          titleCream="Salon Space &"
          titleGold="Work"
          description="Photographs of our styling stations, interior setup, and storefront at Rose Commercial, Park View City."
        />

        {/* Flush CSS Grid: 2 columns on mobile, 3 columns on desktop, all rows end flush */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 grid-flow-dense">
          {galleryImages.map((image, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === galleryImages.length - 1;

            return (
              <div
                key={image.id}
                onClick={() => handleOpenLightbox(image)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenLightbox(image);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Open photo: ${image.title}`}
                className={`group relative rounded-2xl overflow-hidden bg-[#141C18] border border-white/[0.08] hover:border-[#C59B46]/60 cursor-pointer shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46] ${
                  isFirst
                    ? "col-span-2 lg:col-span-2 aspect-[16/10]"
                    : isLast
                    ? "col-span-2 lg:col-span-1 aspect-[16/10] lg:aspect-[4/5]"
                    : "col-span-1 aspect-[4/5]"
                }`}
              >
                <Image
                  src={image.webp}
                  alt={image.alt}
                  fill
                  priority={idx < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Scrim Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D]/90 via-[#0B0F0D]/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none" />

                {/* Caption overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex items-center justify-between">
                  <span className="font-['Playfair_Display',Georgia,serif] text-xs sm:text-sm font-medium text-[#F5EFEB] line-clamp-1">
                    {image.title}
                  </span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0B0F0D]/80 border border-white/10 flex items-center justify-center text-[#C59B46] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 ml-2">
                    <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-[#7A756B]">
          Photos of R.B Makeover Man&apos;s Salon. Tap any photo to expand.
        </p>
      </div>

      {/* Accessible Lightbox Modal */}
      <Lightbox
        images={galleryImages}
        currentIndex={selectedImageIndex ?? 0}
        isOpen={lightboxOpen}
        onClose={handleCloseLightbox}
        onNavigate={setSelectedImageIndex}
      />
    </section>
  );
}
