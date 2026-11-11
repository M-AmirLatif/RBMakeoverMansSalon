"use client";

import React, { useState, useEffect } from "react";

interface TypewriterEffectProps {
  words?: string[];
  prefix?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const DEFAULT_WORDS = [
  "Master Haircuts & Skin Fades",
  "Beard Sculpting & Sharp Lineups",
  "Hot Towel Royal Shaving",
  "Hydra & Charcoal Facials",
  "Tailored Grooming Packages",
];

export function TypewriterEffect({
  words = DEFAULT_WORDS,
  prefix = "Specializing in ",
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseDuration = 1800,
  className = "",
}: TypewriterEffectProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = words[wordIndex % words.length];

    if (!isDeleting && currentText === fullText) {
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && currentText === "") {
      const resetTimer = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 250);
      return () => clearTimeout(resetTimer);
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        } else {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <div
      className={`inline-flex items-center justify-center font-medium ${className}`}
      aria-label={`${prefix}${words[wordIndex % words.length]}`}
    >
      {prefix && <span className="text-[#A8A193] mr-1.5">{prefix}</span>}
      <span className="text-[#C59B46] font-semibold tracking-wide">
        {currentText}
      </span>
      <span className="w-0.5 h-4 sm:h-5 bg-[#C59B46] ml-1 inline-block animate-cursor align-middle" />
    </div>
  );
}
