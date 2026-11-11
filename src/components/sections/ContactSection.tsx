"use client";

import React, { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { allServices } from "@/data/services";
import { staffBarbers, BarberStaff } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WhatsAppIcon, FacebookIcon } from "@/components/ui/Icons";
import {
  buildAppointmentWhatsAppUrl,
  AppointmentPayload,
} from "@/lib/whatsapp";
import { validateAppointmentForm, FormErrors } from "@/lib/validation";
import {
  Phone,
  Mail,
  MapPin,
  Navigation,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  UserCheck,
  Tag,
  ChevronDown,
} from "lucide-react";

function formatUnambiguousDate(isoDate: string): string {
  if (!isoDate) return "";
  try {
    const [y, m, d] = isoDate.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return isoDate;
  }
}

export function ContactSection({
  preselectedBarberId,
}: {
  preselectedBarberId?: string | null;
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    barberId: preselectedBarberId || "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPayload, setSubmittedPayload] =
    useState<AppointmentPayload | null>(null);
  const [copied, setCopied] = useState(false);

  const [prevPreselectedBarberId, setPrevPreselectedBarberId] = useState(preselectedBarberId);
  if (preselectedBarberId !== prevPreselectedBarberId) {
    setPrevPreselectedBarberId(preselectedBarberId);
    if (preselectedBarberId) {
      setFormData((prev) => ({ ...prev, barberId: preselectedBarberId }));
    }
  }

  const todayDateString = React.useSyncExternalStore(
    () => () => {},
    () => new Date().toISOString().split("T")[0],
    () => ""
  );

  const selectedBarber: BarberStaff | undefined = staffBarbers.find(
    (b) => b.id === formData.barberId
  );

  // Calculate rate based on service and selected barber
  const calculateEstimatedRate = (): number | null => {
    if (!selectedBarber) return null;
    const s = formData.service.toLowerCase();
    if (s.includes("beard") && s.includes("hair")) {
      return selectedBarber.rates.hairAndBeard;
    }
    if (s.includes("beard") || s.includes("shav")) {
      return selectedBarber.rates.beard;
    }
    if (s.includes("facial") || s.includes("skin") || s.includes("massage")) {
      return selectedBarber.rates.facial;
    }
    if (s.includes("package") || s.includes("vip")) {
      return selectedBarber.rates.groomingPackage;
    }
    // Default to haircut rate for haircuts & styling
    return selectedBarber.rates.haircut;
  };

  const estimatedRateNumber = calculateEstimatedRate();
  const estimatedRateString = estimatedRateNumber
    ? `Rs. ${estimatedRateNumber.toLocaleString()}`
    : selectedBarber
    ? `Starting from Rs. ${selectedBarber.rates.haircut.toLocaleString()}`
    : undefined;

  const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAppointmentForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    const unambiguousDate = formatUnambiguousDate(formData.preferredDate);

    const payload: AppointmentPayload = {
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      barberName: selectedBarber
        ? `${selectedBarber.name} (${selectedBarber.title})`
        : "Any Available Stylist",
      estimatedRate: estimatedRateString,
      preferredDate: unambiguousDate || formData.preferredDate,
      preferredTime: formData.preferredTime,
      message: formData.message,
    };

    const waUrl = buildAppointmentWhatsAppUrl(payload);

    setTimeout(() => {
      setSubmittedPayload(payload);
      setIsSubmitting(false);

      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank", "noopener,noreferrer");
      }
    }, 400);
  };

  const handleCopyMessage = () => {
    if (!submittedPayload) return;
    const lines = [
      `Appointment Inquiry — ${siteConfig.name}`,
      `Name: ${submittedPayload.name}`,
      `Phone: ${submittedPayload.phone}`,
      `Service: ${submittedPayload.service}`,
    ];
    if (submittedPayload.barberName) {
      lines.push(`Stylist / Barber: ${submittedPayload.barberName}`);
    }
    if (submittedPayload.estimatedRate) {
      lines.push(`Estimated Rate: ${submittedPayload.estimatedRate}`);
    }
    lines.push(
      `Date: ${submittedPayload.preferredDate}`,
      `Time: ${submittedPayload.preferredTime}`
    );
    if (submittedPayload.message) {
      lines.push(`Notes: ${submittedPayload.message}`);
    }
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      aria-label="Contact and Appointment Inquiry"
      className="relative py-12 sm:py-20 lg:py-24 bg-[#0E1411] border-b border-white/[0.06] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <AnimatedReveal direction="up" delay={0.05} amount={0.05}>
          <SectionHeading
            eyebrow="Contact & Booking"
            titleCream="Make an"
            titleGold="Appointment"
            description="Send your appointment request to our salon on WhatsApp with your preferred barber and service."
          />
        </AnimatedReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8 sm:mt-10">
          
          {/* Left Column: Direct Contact Details + Storefront Photo (5 cols) */}
          <AnimatedReveal direction="left" delay={0.1} amount={0.05} className="lg:col-span-5 space-y-5">
            
            {/* Channels Card */}
            <div className="p-5 sm:p-7 rounded-2xl bg-[#141C18] border border-white/[0.08] shadow-xl space-y-5">
              <h3 className="font-['Playfair_Display',Georgia,serif] text-xl sm:text-2xl font-medium text-[#F5EFEB]">
                Contact Channels
              </h3>

              <div className="space-y-3.5">
                {/* Phone */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 text-[#C59B46] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7A756B] uppercase tracking-wider font-semibold">
                      Phone
                    </div>
                    <a
                      href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
                      className="text-base font-bold text-[#F5EFEB] hover:text-[#C59B46] transition-colors block"
                    >
                      {siteConfig.contact.primaryPhone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] shrink-0">
                    <WhatsAppIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7A756B] uppercase tracking-wider font-semibold">
                      WhatsApp
                    </div>
                    <a
                      href={siteConfig.contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-[#25D366] hover:underline block"
                    >
                      +92 326 9326566
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 text-[#C59B46] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7A756B] uppercase tracking-wider font-semibold">
                      Email
                    </div>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-xs sm:text-sm font-semibold text-[#F5EFEB] hover:text-[#C59B46] transition-colors break-all block"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 text-[#C59B46] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7A756B] uppercase tracking-wider font-semibold">
                      Address
                    </div>
                    <p className="text-xs text-[#F5EFEB] leading-relaxed">
                      {siteConfig.contact.address.formatted}
                    </p>
                  </div>
                </div>

                {/* Social */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1877F2]/10 text-[#1877F2] shrink-0">
                    <FacebookIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7A756B] uppercase tracking-wider font-semibold">
                      Facebook
                    </div>
                    <a
                      href={siteConfig.contact.social.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#F5EFEB] hover:text-[#1877F2] transition-colors flex items-center gap-1"
                    >
                      <span>@{siteConfig.contact.social.handle} on Facebook</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Storefront Location Card (Balances height with form) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#141C18] border border-white/[0.08] shadow-xl overflow-hidden space-y-3.5">
              <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-white/10">
                <Image
                  src="/images/storefront-exterior.webp"
                  alt="R.B Makeover salon entrance at Rose Commercial, Park View City"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F0D]/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#F5EFEB]">Rose Commercial</span>
                  <span className="text-[#C59B46] text-[11px]">Park View City</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  href={siteConfig.maps.officialUrl}
                  external
                  variant="outline"
                  size="sm"
                  fullWidth
                  icon={<Navigation className="w-3.5 h-3.5" />}
                >
                  Google Maps
                </Button>

                <Button
                  href={`tel:${siteConfig.contact.primaryPhoneRaw}`}
                  external
                  variant="secondary"
                  size="sm"
                  fullWidth
                  icon={<Phone className="w-3.5 h-3.5" />}
                >
                  Call Salon
                </Button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-[#7A756B]">
              <AlertCircle className="w-4 h-4 text-[#C59B46] shrink-0 mt-0.5" />
              <p>
                The salon will confirm your appointment and slot availability.
              </p>
            </div>
          </AnimatedReveal>

          {/* Right Column: Appointment Form (7 cols) */}
          <AnimatedReveal direction="right" delay={0.15} amount={0.05} className="lg:col-span-7 bg-[#141C18] p-5 sm:p-7 lg:p-8 rounded-2xl border border-white/[0.08] shadow-2xl relative">
            {submittedPayload ? (
              /* Success State */
              <div className="space-y-5 py-2">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#F5EFEB]">
                  <CheckCircle2 className="w-6 h-6 text-[#25D366] shrink-0" />
                  <div>
                    <h4 className="text-base font-bold text-[#F5EFEB]">
                      Inquiry Created Successfully!
                    </h4>
                    <p className="text-xs text-[#A8A193] mt-0.5">
                      Your WhatsApp window was opened with your appointment details.
                    </p>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0B0F0D] border border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-[#7A756B] pb-2 border-b border-white/10">
                    <span className="font-mono uppercase">Inquiry Summary</span>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1 text-[#C59B46] hover:text-[#DFC074] font-semibold transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? "Copied!" : "Copy Details"}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#B8B0A2] font-mono leading-relaxed">
                    <p><strong className="text-[#F5EFEB]">Name:</strong> {submittedPayload.name}</p>
                    <p><strong className="text-[#F5EFEB]">Phone:</strong> {submittedPayload.phone}</p>
                    <p><strong className="text-[#F5EFEB]">Service:</strong> {submittedPayload.service}</p>
                    {submittedPayload.barberName && (
                      <p><strong className="text-[#F5EFEB]">Stylist / Barber:</strong> {submittedPayload.barberName}</p>
                    )}
                    {submittedPayload.estimatedRate && (
                      <p><strong className="text-[#DFC074]">Rate:</strong> {submittedPayload.estimatedRate}</p>
                    )}
                    <p><strong className="text-[#F5EFEB]">Date:</strong> {submittedPayload.preferredDate}</p>
                    <p><strong className="text-[#F5EFEB]">Time:</strong> {submittedPayload.preferredTime}</p>
                    {submittedPayload.message && (
                      <p><strong className="text-[#F5EFEB]">Notes:</strong> {submittedPayload.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Button
                    href={buildAppointmentWhatsAppUrl(submittedPayload)}
                    external
                    variant="gold"
                    size="md"
                    fullWidth
                    icon={<WhatsAppIcon className="w-4 h-4 text-[#0B0F0D]" />}
                  >
                    Open Again in WhatsApp
                  </Button>

                  <button
                    type="button"
                    onClick={() => setSubmittedPayload(null)}
                    className="w-full text-center text-xs text-[#B8B0A2] hover:text-[#F5EFEB] py-2 transition-colors cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              </div>
            ) : (
              /* The Booking Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                <div className="border-b border-white/[0.08] pb-3">
                  <h3 className="font-['Playfair_Display',Georgia,serif] text-xl sm:text-2xl font-medium text-[#F5EFEB]">
                    Appointment Request
                  </h3>
                  <p className="text-xs text-[#A8A193] mt-1">
                    Fill out your details to send a request on WhatsApp.
                  </p>
                </div>

                {/* Full Name & Phone in 2 cols on tablet/desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="form-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5"
                    >
                      Full Name <span className="text-[#C59B46]">*</span>
                    </label>
                    <input
                      type="text"
                      id="form-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Asad Khan"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full px-3.5 py-3 rounded-xl bg-[#0B0F0D] border text-base sm:text-sm text-[#F5EFEB] placeholder-[#605C55] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C59B46] ${
                        errors.name ? "border-red-500/80" : "border-white/10 focus:border-[#C59B46]"
                      }`}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1 text-xs text-red-400">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="form-phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5"
                    >
                      Mobile Number <span className="text-[#C59B46]">*</span>
                    </label>
                    <input
                      type="tel"
                      id="form-phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0326 9326566"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={`w-full px-3.5 py-3 rounded-xl bg-[#0B0F0D] border text-base sm:text-sm text-[#F5EFEB] placeholder-[#605C55] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C59B46] ${
                        errors.phone ? "border-red-500/80" : "border-white/10 focus:border-[#C59B46]"
                      }`}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-1 text-xs text-red-400">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Barber / Stylist Selection (New feature: 10 barbers) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="form-barber"
                      className="text-xs font-semibold uppercase tracking-wider text-[#A8A193] flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#C59B46]" />
                      <span>Preferred Stylist / Barber (10 Available)</span>
                    </label>
                    {selectedBarber && (
                      <span className="text-xs text-[#C59B46] font-semibold">
                        {selectedBarber.experience}
                      </span>
                    )}
                  </div>
                  <div className="relative group">
                    <select
                      id="form-barber"
                      name="barberId"
                      value={formData.barberId}
                      onChange={handleChange}
                      className="w-full appearance-none pl-3.5 pr-12 py-3 rounded-xl bg-[#0B0F0D] border border-white/10 group-hover:border-[#C59B46]/40 focus:border-[#C59B46] text-base sm:text-sm text-[#F5EFEB] transition-all focus:outline-none focus:ring-1 focus:ring-[#C59B46] cursor-pointer"
                    >
                      <option value="" className="bg-[#0B0F0D] text-[#7A756B]">
                        Any Available Stylist (First available slot)
                      </option>
                      {staffBarbers.map((b) => (
                        <option
                          key={b.id}
                          value={b.id}
                          className="bg-[#0B0F0D] text-[#F5EFEB]"
                        >
                          {b.name} — {b.title} (Haircut: Rs. {b.rates.haircut.toLocaleString()} | Beard: Rs. {b.rates.beard.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    {/* Realistic Gold Dropdown Arrow Indicator with ample spacing from the right */}
                    <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#C59B46] group-hover:text-[#DFC074] group-hover:border-[#C59B46]/40 transition-all shadow-sm">
                      <ChevronDown className="w-4 h-4 stroke-[2.25]" />
                    </div>
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label
                    htmlFor="form-service"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5"
                  >
                    Service <span className="text-[#C59B46]">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      id="form-service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      aria-invalid={!!errors.service}
                      aria-describedby={errors.service ? "service-error" : undefined}
                      className={`w-full appearance-none pl-3.5 pr-12 py-3 rounded-xl bg-[#0B0F0D] border text-base sm:text-sm text-[#F5EFEB] transition-all focus:outline-none focus:ring-1 focus:ring-[#C59B46] cursor-pointer ${
                        errors.service
                          ? "border-red-500/80"
                          : "border-white/10 group-hover:border-[#C59B46]/40 focus:border-[#C59B46]"
                      }`}
                    >
                      <option value="" disabled className="bg-[#0B0F0D] text-[#7A756B]">
                        Select a service...
                      </option>
                      {allServices.map((svc) => (
                        <option
                          key={svc.id}
                          value={svc.name}
                          className="bg-[#0B0F0D] text-[#F5EFEB]"
                        >
                          {svc.name}
                        </option>
                      ))}
                    </select>
                    {/* Realistic Gold Dropdown Arrow Indicator with ample spacing from the right */}
                    <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#C59B46] group-hover:text-[#DFC074] group-hover:border-[#C59B46]/40 transition-all shadow-sm">
                      <ChevronDown className="w-4 h-4 stroke-[2.25]" />
                    </div>
                  </div>
                  {errors.service && (
                    <p id="service-error" className="mt-1 text-xs text-red-400">
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Dynamic Barber Rate Summary Pill (When barber & service are chosen) */}
                {selectedBarber && (
                  <div className="p-3 rounded-xl bg-[#C59B46]/10 border border-[#C59B46]/30 flex items-center justify-between text-xs text-[#F5EFEB]">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#C59B46] shrink-0" />
                      <div>
                        <span className="font-semibold">{selectedBarber.name}</span>
                        <span className="text-[#A8A193] text-[11px] block">
                          {formData.service || "Standard Haircut"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-['Bebas_Neue',sans-serif] text-xl text-[#DFC074] leading-tight block">
                        {estimatedRateString}
                      </span>
                    </div>
                  </div>
                )}

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="form-date"
                        className="text-xs font-semibold uppercase tracking-wider text-[#A8A193]"
                      >
                        Preferred Date <span className="text-[#C59B46]">*</span>
                      </label>
                      {formData.preferredDate && (
                        <span className="text-xs font-semibold text-[#C59B46]">
                          {formatUnambiguousDate(formData.preferredDate)}
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      id="form-date"
                      name="preferredDate"
                      required
                      min={todayDateString}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      aria-invalid={!!errors.preferredDate}
                      aria-describedby={errors.preferredDate ? "date-error" : undefined}
                      className={`w-full px-3.5 py-3 rounded-xl bg-[#0B0F0D] border text-base sm:text-sm text-[#F5EFEB] transition-colors focus:outline-none focus:ring-1 focus:ring-[#C59B46] ${
                        errors.preferredDate ? "border-red-500/80" : "border-white/10 focus:border-[#C59B46]"
                      }`}
                    />
                    {errors.preferredDate && (
                      <p id="date-error" className="mt-1 text-xs text-red-400">
                        {errors.preferredDate}
                      </p>
                    )}
                  </div>

                  {/* Preferred Time: STARTS UNSELECTED */}
                  <div>
                    <label
                      htmlFor="form-time"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5"
                    >
                      Preferred Time <span className="text-[#C59B46]">*</span>
                    </label>
                    <div className="relative group">
                      <select
                        id="form-time"
                        name="preferredTime"
                        required
                        value={formData.preferredTime}
                        onChange={handleChange}
                        aria-invalid={!!errors.preferredTime}
                        aria-describedby={errors.preferredTime ? "time-error" : undefined}
                        className={`w-full appearance-none pl-3.5 pr-12 py-3 rounded-xl bg-[#0B0F0D] border text-base sm:text-sm text-[#F5EFEB] transition-all focus:outline-none focus:ring-1 focus:ring-[#C59B46] cursor-pointer ${
                          errors.preferredTime
                            ? "border-red-500/80"
                            : "border-white/10 group-hover:border-[#C59B46]/40 focus:border-[#C59B46]"
                        }`}
                      >
                        <option value="" disabled className="bg-[#0B0F0D] text-[#7A756B]">
                          Select a time...
                        </option>
                        {timeSlots.map((time) => (
                          <option
                            key={time}
                            value={time}
                            className="bg-[#0B0F0D] text-[#F5EFEB]"
                          >
                            {time}
                          </option>
                        ))}
                      </select>
                      {/* Realistic Gold Dropdown Arrow Indicator with ample spacing from the right */}
                      <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#C59B46] group-hover:text-[#DFC074] group-hover:border-[#C59B46]/40 transition-all shadow-sm">
                        <ChevronDown className="w-4 h-4 stroke-[2.25]" />
                      </div>
                    </div>
                    {errors.preferredTime && (
                      <p id="time-error" className="mt-1 text-xs text-red-400">
                        {errors.preferredTime}
                      </p>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label
                    htmlFor="form-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5"
                  >
                    Additional Message (Optional)
                  </label>
                  <textarea
                    id="form-message"
                    name="message"
                    rows={2}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Add any specific requests or styling notes."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F0D] border border-white/10 text-base sm:text-sm text-[#F5EFEB] placeholder-[#605C55] transition-colors focus:outline-none focus:border-[#C59B46] focus:ring-1 focus:ring-[#C59B46] resize-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    icon={<WhatsAppIcon className="w-5 h-5 text-[#0B0F0D]" />}
                  >
                    {isSubmitting ? "Generating WhatsApp..." : "Send Request on WhatsApp"}
                  </Button>
                </div>

                <p className="text-center text-[11px] text-[#7A756B]">
                  The salon will confirm your appointment.
                </p>
              </form>
            )}
          </AnimatedReveal>

        </div>

      </div>
    </section>
  );
}
