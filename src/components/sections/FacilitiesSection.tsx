"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import {
  Wifi,
  Car,
  CreditCard,
  Smartphone,
  Baby,
  DoorOpen,
  ParkingCircle,
} from "lucide-react";

interface BentoGroup {
  label: string;
  items: { name: string; icon: React.ReactNode }[];
}

const bentoGroups: BentoGroup[] = [
  {
    label: "Comfort",
    items: [
      { name: "Free Wi-Fi", icon: <Wifi className="w-4 h-4 text-[#C59B46]" /> },
      { name: "Restroom", icon: <DoorOpen className="w-4 h-4 text-[#C59B46]" /> },
    ],
  },
  {
    label: "Parking",
    items: [
      { name: "Free parking lot", icon: <ParkingCircle className="w-4 h-4 text-[#C59B46]" /> },
      { name: "Free street parking", icon: <Car className="w-4 h-4 text-[#C59B46]" /> },
      { name: "On-site parking", icon: <Car className="w-4 h-4 text-[#C59B46]" /> },
    ],
  },
  {
    label: "Payments",
    items: [
      { name: "Debit card and machine", icon: <CreditCard className="w-4 h-4 text-[#C59B46]" /> },
      { name: "Online cash", icon: <Smartphone className="w-4 h-4 text-[#C59B46]" /> },
    ],
  },
  {
    label: "Family",
    items: [
      { name: "Suitable for children", icon: <Baby className="w-4 h-4 text-[#C59B46]" /> },
    ],
  },
];

export function FacilitiesSection() {
  return (
    <section
      id="facilities"
      aria-label="Salon Facilities"
      className="relative py-12 sm:py-20 lg:py-28 bg-[#0B0F0D] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Facilities"
            titleCream="Salon"
            titleGold="Amenities"
            description="What you will find at our Rose Commercial salon."
          />
        </AnimatedReveal>

        {/* Bento Panel: 4 Columns across desktop, 2x2 on tablet, 1-col on mobile */}
        <AnimatedReveal direction="up" delay={0.1} amount={0.15}>
          <div className="mt-12 rounded-3xl bg-[#141C18] border border-white/[0.08] shadow-2xl p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bentoGroups.map((group) => (
                <div key={group.label} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59B46]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#C59B46]">
                      {group.label}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-3 text-sm text-[#F5EFEB]/90"
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedReveal>

        <p className="mt-8 text-center text-xs text-[#7A756B]">
          Salon facilities available to all customers at Rose Commercial.
        </p>

      </div>
    </section>
  );
}
