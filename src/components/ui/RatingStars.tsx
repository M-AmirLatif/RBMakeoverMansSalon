import React from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  max?: number;
  className?: string;
  size?: number;
  showScore?: boolean;
  scoreText?: string;
}

export function RatingStars({
  rating = 4.9,
  max = 5,
  className = "",
  size = 18,
  showScore = false,
  scoreText,
}: RatingStarsProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={`Rating: ${rating} out of ${max} stars`}
    >
      <div className="flex items-center gap-0.5 text-[#C59B46]">
        {Array.from({ length: max }).map((_, index) => {
          const fillPercentage = Math.max(0, Math.min(1, rating - index));
          return (
            <div key={index} className="relative inline-block">
              {/* Empty background star */}
              <Star
                size={size}
                className="text-white/20"
                fill="none"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              {/* Filled star overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <Star
                  size={size}
                  className="text-[#C59B46] fill-[#C59B46]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </div>

      {showScore && (
        <span className="text-xs sm:text-sm font-semibold text-[#F5EFEB] ml-1">
          {scoreText || `${rating} / ${max}`}
        </span>
      )}
    </div>
  );
}
