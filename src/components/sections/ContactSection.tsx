"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { fetchServices, fetchBarbers, SiteService, defaultServices } from "@/lib/supabase/queries";
import { staffBarbers, BarberStaff } from "@/data/team";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WhatsAppIcon, FacebookIcon } from "@/components/ui/Icons";
import {
  buildAppointmentWhatsAppUrl,
  AppointmentPayload,
  SelectedServiceItem,
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
  Check,
  Search,
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
  const [services, setServices] = useState<SiteService[]>(defaultServices);
  const [barbers, setBarbers] = useState<BarberStaff[]>(staffBarbers);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState<string>("all");
  const [serviceSearchQuery, setServiceSearchQuery] = useState<string>("" );

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

  // Fetch dynamic services and barbers from Supabase
  useEffect(() => {
    let mounted = true;
    fetchServices().then((list) => {
      if (mounted && list && list.length > 0) {
        setServices(list);
      }
    });
    fetchBarbers().then((list) => {
      if (mounted && list && list.length > 0) {
        setBarbers(list);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

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

  const selectedBarber: BarberStaff | undefined = barbers.find(
    (b) => b.id === formData.barberId
  );

  // List of actual selected service objects
  const selectedServicesList: SiteService[] = React.useMemo(() => {
    return services.filter((s) => selectedServiceIds.includes(s.id));
  }, [services, selectedServiceIds]);

  // Multiple Service Selection Toggle
  const toggleService = (svc: SiteService) => {
    setSelectedServiceIds((prev) => {
      const exists = prev.includes(svc.id);
      const updated = exists ? prev.filter((id) => id !== svc.id) : [...prev, svc.id];
      const chosen = services.filter((s) => updated.includes(s.id));
      setFormData((f) => ({
        ...f,
        service: chosen.map((c) => c.name).join(", "),
      }));
      if (errors.service) {
        setErrors((e) => ({ ...e, service: undefined }));
      }
      return updated;
    });
  };

  const handleClearServices = () => {
    setSelectedServiceIds([]);
    setFormData((f) => ({ ...f, service: "" }));
  };

  // Calculate total price and duration
  const totalEstimatedPrice = React.useMemo(() => {
    return selectedServicesList.reduce((sum, s) => {
      const num = s.numeric_price || Number(String(s.price).replace(/[^0-9]/g, "")) || 0;
      return sum + num;
    }, 0);
  }, [selectedServicesList]);

  const totalEstimatedMinutes = React.useMemo(() => {
    return selectedServicesList.reduce((sum, s) => {
      const m = Number(String(s.duration || "").replace(/[^0-9]/g, "")) || 30;
      return sum + m;
    }, 0);
  }, [selectedServicesList]);

  const estimatedRateString = totalEstimatedPrice > 0
    ? `Rs. ${totalEstimatedPrice.toLocaleString()}`
    : selectedBarber
    ? `Starting from Rs. ${selectedBarber.rates.haircut.toLocaleString()}`
    : undefined;

  const estimatedDurationString = totalEstimatedMinutes > 0
    ? `~${totalEstimatedMinutes} mins`
    : undefined;

  // Filtered services for picker
  const filteredServices = React.useMemo(() => {
    return services.filter((s) => {
      const cat = (s.category || "").toLowerCase();
      const matchCategory =
        serviceCategoryFilter === "all" ||
        (serviceCategoryFilter === "haircuts" && (cat === "haircuts" || cat.includes("hair") || cat.includes("cut"))) ||
        (serviceCategoryFilter === "beard" && (cat === "beard" || cat.includes("beard") || cat.includes("shav"))) ||
        (serviceCategoryFilter === "facial" && (cat === "facial" || cat.includes("facial") || cat.includes("skin"))) ||
        (serviceCategoryFilter === "grooming" && (cat === "grooming" || cat.includes("groom") || cat.includes("vip") || cat.includes("package") || cat.includes("mani") || cat.includes("pedi")));

      const q = serviceSearchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [services, serviceCategoryFilter, serviceSearchQuery]);

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
    "12:00 AM (Midnight)",
    "12:30 AM",
    "01:00 AM",
    "01:30 AM",
    "02:00 AM (Late Night)",
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

    if (selectedServiceIds.length === 0 && (!formData.service || formData.service.trim().length === 0)) {
      setErrors((prev) => ({ ...prev, service: "Please select at least one service to book." }));
      return;
    }

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
      service: formData.service || selectedServicesList.map((s) => s.name).join(", "),
      selectedServicesList: selectedServicesList.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      })),
      totalDuration: estimatedDurationString,
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
    ];

    if (submittedPayload.selectedServicesList && submittedPayload.selectedServicesList.length > 0) {
      lines.push(`Services (${submittedPayload.selectedServicesList.length}):`);
      submittedPayload.selectedServicesList.forEach((s) => {
        lines.push(`  • ${s.name}${s.price ? ` (${s.price})` : ""}`);
      });
    } else {
      lines.push(`Service: ${submittedPayload.service}`);
    }

    if (submittedPayload.barberName) {
      lines.push(`Stylist / Barber: ${submittedPayload.barberName}`);
    }
    if (submittedPayload.estimatedRate) {
      lines.push(`Estimated Total: ${submittedPayload.estimatedRate}`);
    }
    if (submittedPayload.totalDuration) {
      lines.push(`Estimated Duration: ${submittedPayload.totalDuration}`);
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
                    {submittedPayload.selectedServicesList && submittedPayload.selectedServicesList.length > 0 ? (
                      <div className="pt-1.5 pb-1">
                        <strong className="text-[#F5EFEB] block mb-1">
                          Services ({submittedPayload.selectedServicesList.length}):
                        </strong>
                        <ul className="space-y-1 pl-2.5 border-l-2 border-[#C59B46]/40">
                          {submittedPayload.selectedServicesList.map((s, idx) => (
                            <li key={idx} className="flex items-center justify-between text-[11px]">
                              <span className="text-[#F5EFEB]">{s.name}</span>
                              <span className="text-[#DFC074]">{s.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p><strong className="text-[#F5EFEB]">Service:</strong> {submittedPayload.service}</p>
                    )}
                    {submittedPayload.barberName && (
                      <p><strong className="text-[#F5EFEB]">Stylist / Barber:</strong> {submittedPayload.barberName}</p>
                    )}
                    {submittedPayload.estimatedRate && (
                      <p><strong className="text-[#DFC074]">Total Rate:</strong> {submittedPayload.estimatedRate}</p>
                    )}
                    {submittedPayload.totalDuration && (
                      <p><strong className="text-[#DFC074]">Est. Duration:</strong> {submittedPayload.totalDuration}</p>
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
                        Any Available Stylist (First Available Slot)
                      </option>
                      {barbers.map((b) => (
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

                {/* Multiple Services Selection */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#A8A193]">
                      Desired Services <span className="text-[#C59B46]">*</span>
                      <span className="text-[11px] font-normal text-[#7A756B] lowercase ml-1.5">
                        (tap multiple to book together)
                      </span>
                    </label>
                    {selectedServiceIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#C59B46]/20 text-[#DFC074] border border-[#C59B46]/30">
                          {selectedServiceIds.length} Selected
                        </span>
                        <button
                          type="button"
                          onClick={handleClearServices}
                          className="text-[11px] text-[#A8A193] hover:text-[#DFC074] underline transition-colors cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Category Filter Pills & Search */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
                      {[
                        { key: "all", label: "All" },
                        { key: "haircuts", label: "Haircuts" },
                        { key: "beard", label: "Beard" },
                        { key: "facial", label: "Facial" },
                        { key: "grooming", label: "VIP / Pedi" },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setServiceCategoryFilter(tab.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                            serviceCategoryFilter === tab.key
                              ? "bg-[#C59B46] text-[#0B0F0D] font-bold shadow-sm"
                              : "bg-[#0B0F0D] text-[#A8A193] hover:text-[#F5EFEB] border border-white/10"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative sm:ml-auto w-full sm:w-44">
                      <input
                        type="text"
                        value={serviceSearchQuery}
                        onChange={(e) => setServiceSearchQuery(e.target.value)}
                        placeholder="Search service..."
                        className="w-full bg-[#0B0F0D] border border-white/10 rounded-lg pl-7 pr-3 py-1.5 text-xs text-[#F5EFEB] placeholder-[#7A756B] focus:border-[#C59B46] outline-none"
                      />
                      <Search className="w-3.5 h-3.5 text-[#7A756B] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Multi-Service Cards Grid */}
                  <div className="max-h-[290px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredServices.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#7A756B] bg-[#0B0F0D] rounded-xl border border-white/10">
                        No services found matching your filter.
                      </div>
                    ) : (
                      filteredServices.map((svc) => {
                        const isSelected = selectedServiceIds.includes(svc.id);
                        return (
                          <div
                            key={svc.id}
                            onClick={() => toggleService(svc)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                              isSelected
                                ? "bg-[#161F1B] border-[#C59B46] shadow-[0_0_15px_rgba(197,155,70,0.12)]"
                                : "bg-[#0B0F0D] border-white/10 hover:border-white/25 hover:bg-white/[0.02]"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                                  isSelected
                                    ? "bg-[#C59B46] border-[#C59B46] text-[#0B0F0D]"
                                    : "border-white/20 bg-transparent text-transparent"
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                              <div className="min-w-0">
                                <div
                                  className={`text-xs sm:text-sm leading-snug truncate ${
                                    isSelected
                                      ? "text-[#DFC074] font-semibold"
                                      : "text-[#F5EFEB] font-normal"
                                  }`}
                                >
                                  {svc.name}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#A8A193]">
                                  {svc.duration && <span>⏱️ {svc.duration}</span>}
                                  <span className="capitalize text-[#7A756B]">• {svc.category}</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono text-xs sm:text-sm font-semibold text-[#DFC074]">
                                {svc.price}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {errors.service && (
                    <p id="service-error" className="mt-1 text-xs text-red-400">
                      {errors.service}
                    </p>
                  )}

                  {/* Booking Total / Summary Bar when at least 1 service is chosen */}
                  {selectedServicesList.length > 0 && (
                    <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#17211C] to-[#121A16] border border-[#C59B46]/40 shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#C59B46] shrink-0" />
                          <span className="font-semibold text-[#F5EFEB]">
                            {selectedServicesList.length} Service{selectedServicesList.length > 1 ? "s" : ""} Selected
                          </span>
                          {estimatedDurationString && (
                            <span className="text-[#A8A193] text-[11px] font-mono">
                              ({estimatedDurationString})
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#A8A193] uppercase font-mono block">
                            Estimated Total
                          </span>
                          <span className="font-['Bebas_Neue',sans-serif] text-xl sm:text-2xl text-[#DFC074] leading-tight block">
                            {estimatedRateString}
                          </span>
                        </div>
                      </div>

                      {/* Removable chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-white/10">
                        {selectedServicesList.map((s) => (
                          <span
                            key={s.id}
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10 text-[11px] text-[#F5EFEB]"
                          >
                            <span>{s.name}</span>
                            <span className="text-[#DFC074] font-mono text-[10px]">{s.price}</span>
                            <button
                              type="button"
                              onClick={() => toggleService(s)}
                              className="text-[#A8A193] hover:text-red-400 cursor-pointer ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                    <div className="relative group cursor-pointer">
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
                        className={`w-full appearance-none pl-3.5 pr-12 py-3 rounded-xl bg-[#0B0F0D] border text-base sm:text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#C59B46] cursor-pointer date-input-custom ${
                          !formData.preferredDate ? "text-[#7A756B]" : "text-[#F5EFEB]"
                        } ${
                          errors.preferredDate
                            ? "border-red-500/80"
                            : "border-white/10 group-hover:border-[#C59B46]/40 focus:border-[#C59B46]"
                        }`}
                      />
                      {/* Realistic Gold Dropdown Arrow Indicator matching all other fields */}
                      <div className="absolute right-3.5 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#C59B46] group-hover:text-[#DFC074] group-hover:border-[#C59B46]/40 transition-all shadow-sm">
                        <ChevronDown className="w-4 h-4 stroke-[2.25]" />
                      </div>
                    </div>
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
                      className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#A8A193] mb-1.5"
                    >
                      <span>
                        Preferred Time <span className="text-[#C59B46]">*</span>
                      </span>
                      <span className="text-[11px] text-[#DFC074] font-mono font-normal">
                        9:00 AM – 2:00 AM
                      </span>
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
                    iconPosition="left"
                  >
                    {isSubmitting ? "Generating WhatsApp..." : "Book via WhatsApp"}
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
