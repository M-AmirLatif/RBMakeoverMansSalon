"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryImages } from "@/data/images";
import { fetchGalleryItems, GalleryMediaItem } from "@/lib/supabase/queries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Lightbox, LightboxMediaItem } from "@/components/ui/Lightbox";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Eye, Video } from "lucide-react";

export function GallerySection({
  onLightboxToggle,
}: {
  onLightboxToggle?: (isOpen: boolean) => void;
}) {
  const [items, setItems] = useState<GalleryMediaItem[]>(() =>
    galleryImages.map((img, idx) => ({
      id: img.id,
      title: img.title,
      alt: img.alt,
      category: img.category,
      media_type: "image",
      url: img.src,
      webp: img.webp,
      width: img.width,
      height: img.height,
      aspect_ratio: img.aspectRatio,
      featured: !!img.featured,
      display_order: idx + 1,
    }))
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadGallery() {
      const data = await fetchGalleryItems();
      if (mounted && data && data.length > 0) {
        setItems(data);
      }
    }
    loadGallery();
    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenLightbox = (item: GalleryMediaItem) => {
    const idx = items.findIndex((i) => i.id === item.id);
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
      className="relative py-12 sm:py-20 lg:py-28 bg-[#0B0F0D] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Gallery"
            titleCream="Salon Space &amp;"
            titleGold="Work"
            description="Photographs and clips of our styling stations, interior setup, and storefront at Rose Commercial, Park View City."
          />
        </AnimatedReveal>

        {/* Flush CSS Grid: 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-12 grid-flow-dense">
          {items.map((item, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === items.length - 1;
            const isVideo = item.media_type === "video";
            const imageSrc = item.webp || item.url;

            return (
              <AnimatedReveal
                key={item.id}
                direction="up"
                delay={idx * 0.05}
                className={
                  isFirst || item.featured
                    ? "col-span-2 lg:col-span-2"
                    : isLast && items.length % 2 === 1
                    ? "col-span-2 lg:col-span-1"
                    : "col-span-1"
                }
              >
                <div
                  onClick={() => handleOpenLightbox(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenLightbox(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open media: ${item.title}`}
                  className={`group relative rounded-2xl overflow-hidden bg-[#141C18] border border-white/[0.08] hover:border-[#C59B46]/60 cursor-pointer shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46] w-full h-full ${
                    isFirst || item.featured
                      ? "aspect-[16/10]"
                      : isLast
                      ? "aspect-[16/10] lg:aspect-[4/5]"
                      : "aspect-[4/5]"
                  }`}
                >
                  {isVideo ? (
                    <div className="w-full h-full relative bg-black/50">
                      <video
                        src={item.url}
                        muted
                        playsInline
                        loop
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono uppercase text-[#DFC074] border border-[#C59B46]/30 flex items-center gap-1 z-10">
                        <Video className="w-3 h-3 text-[#C59B46]" /> Video Clip
                      </span>
                    </div>
                  ) : imageSrc.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={item.alt || item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/salon-wide-stations.webp";
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt={item.alt || item.title}
                      loading={idx < 4 ? "eager" : "lazy"}
                      decoding="async"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/images/salon-wide-stations.webp";
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  )}

                  {/* Scrim Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top-Right Category Pill */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase bg-black/60 backdrop-blur-sm text-[#DFC074] border border-[#C59B46]/30">
                      {item.category}
                    </span>
                  </div>

                  {/* Center Hover Action Pill */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121815]/90 border border-[#C59B46]/60 text-xs sm:text-sm font-medium text-[#F5EFEB] shadow-xl backdrop-blur-md">
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C59B46]" />
                      {isVideo ? "Play Video" : "View Photo"}
                    </span>
                  </div>

                  {/* Bottom Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-10">
                    <p className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#F5EFEB] leading-snug">
                      {item.title}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[#DFC074] mt-0.5 line-clamp-1">
                      {item.alt}
                    </p>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>

        {/* Lightbox Dialog */}
        <Lightbox
          images={items as LightboxMediaItem[]}
          currentIndex={selectedImageIndex ?? 0}
          isOpen={lightboxOpen}
          onClose={handleCloseLightbox}
          onNavigate={(newIdx) => setSelectedImageIndex(newIdx)}
        />
      </div>
    </section>
  );
}
