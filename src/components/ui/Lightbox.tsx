"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { SalonImage } from "@/data/images";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: SalonImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const currentImage = images[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Touch Swipe gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext(); // Swiped left -> next image
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> prev image
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      ref={modalRef}
      className="fixed inset-0 z-50 bg-[#0B0F0D]/96 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none animate-in fade-in duration-200"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between text-[#F5EFEB] pb-3 border-b border-white/10 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-[#C59B46]">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="hidden sm:inline-block text-xs text-[#7A756B]">•</span>
          <span className="text-xs sm:text-sm font-medium text-[#B8B0A2] truncate max-w-xs sm:max-w-md">
            {currentImage.title}
          </span>
        </div>

        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-[#F5EFEB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
          aria-label="Close lightbox"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#121815]/80 hover:bg-[#C59B46] text-[#F5EFEB] hover:text-[#0B0F0D] border border-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Current Image */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
          <Image
            src={currentImage.webp}
            alt={currentImage.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-contain"
            priority
          />
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#121815]/80 hover:bg-[#C59B46] text-[#F5EFEB] hover:text-[#0B0F0D] border border-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Caption */}
      <div className="text-center text-xs sm:text-sm text-[#B8B0A2] pt-2 max-w-2xl mx-auto border-t border-white/10 w-full z-10">
        <p>{currentImage.alt}</p>
        <p className="text-[11px] text-[#7A756B] mt-1 font-mono hidden sm:block">
          Use ← and → arrow keys to navigate • Press ESC to close • Swipe on touch
        </p>
      </div>
    </div>
  );
}
