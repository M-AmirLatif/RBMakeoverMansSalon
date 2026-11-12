"use client";

import React, { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxMediaItem {
  id: string;
  title: string;
  alt: string;
  webp?: string;
  src?: string;
  url?: string;
  media_type?: "image" | "video";
}

interface LightboxProps {
  images: LightboxMediaItem[];
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

  const currentItem = images[currentIndex];

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
      handleNext(); // Swiped left -> next
    } else if (diff < -50) {
      handlePrev(); // Swiped right -> prev
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || !currentItem) return null;

  const isVideo = currentItem.media_type === "video";
  const mediaSource = currentItem.webp || currentItem.url || currentItem.src || "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Media gallery lightbox"
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
            {currentItem.title}
          </span>
          {isVideo && (
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C59B46]/20 text-[#DFC074] border border-[#C59B46]/40">
              Video
            </span>
          )}
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

      {/* Main Media Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-[#121815]/80 hover:bg-[#C59B46] text-[#F5EFEB] hover:text-[#0B0F0D] border border-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
          aria-label="Previous item"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Current Media */}
        <div className="relative max-w-5xl max-h-[75vh] w-full h-full flex items-center justify-center">
          {isVideo ? (
            <video
              src={mediaSource}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
          ) : mediaSource.startsWith("http") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSource}
              alt={currentItem.alt || currentItem.title}
              className="max-w-full max-h-[75vh] object-contain"
            />
          ) : (
            <Image
              src={mediaSource}
              alt={currentItem.alt || currentItem.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-contain"
              priority
            />
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-[#121815]/80 hover:bg-[#C59B46] text-[#F5EFEB] hover:text-[#0B0F0D] border border-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C59B46]"
          aria-label="Next item"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Footer Caption */}
      <div className="text-center text-xs sm:text-sm text-[#B8B0A2] pt-2 max-w-2xl mx-auto border-t border-white/10 w-full z-10">
        <p>{currentItem.alt || currentItem.title}</p>
        <p className="text-[11px] text-[#7A756B] mt-1 font-mono hidden sm:block">
          Use ← and → arrow keys to navigate • Press ESC to close • Swipe on touch
        </p>
      </div>
    </div>
  );
}
