import { siteConfig } from "@/data/siteConfig";

export interface AppointmentPayload {
  name: string;
  phone: string;
  service: string;
  barberName?: string;
  estimatedRate?: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export function buildAppointmentWhatsAppUrl(payload: AppointmentPayload): string {
  const lines = [
    `*Appointment Inquiry — ${siteConfig.name}*`,
    ``,
    `👤 *Name:* ${payload.name.trim()}`,
    `📞 *Phone:* ${payload.phone.trim()}`,
    `✂️ *Desired Service:* ${payload.service}`,
  ];

  if (payload.barberName && payload.barberName.trim().length > 0) {
    lines.push(`💈 *Preferred Stylist / Barber:* ${payload.barberName}`);
  }

  if (payload.estimatedRate && payload.estimatedRate.trim().length > 0) {
    lines.push(`💵 *Estimated Rate:* ${payload.estimatedRate}`);
  }

  lines.push(
    `📅 *Preferred Date:* ${payload.preferredDate}`,
    `⏰ *Preferred Time:* ${payload.preferredTime}`
  );

  if (payload.message && payload.message.trim().length > 0) {
    lines.push(`📝 *Notes:* ${payload.message.trim()}`);
  }

  lines.push(
    ``,
    `_Sent via R.B Makeover website. Please confirm appointment slot._`
  );

  const fullText = lines.join("\n");
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    fullText
  )}`;
}

export function buildBarberBookingWhatsAppUrl(
  barberName: string,
  serviceName: string,
  ratePkr: number
): string {
  const text = [
    `*Barber Booking Inquiry — ${siteConfig.name}*`,
    ``,
    `Hello! I would like to book an appointment with *${barberName}* for *${serviceName}* (Rs. ${ratePkr.toLocaleString()}).`,
    `Please let me know today or upcoming available slots at your Rose Commercial, Park View City salon.`,
    ``,
    `Thank you!`,
  ].join("\n");

  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    text
  )}`;
}

export function buildServiceInquiryWhatsAppUrl(
  serviceName: string,
  categoryName?: string
): string {
  const text = [
    `*Service Inquiry — ${siteConfig.name}*`,
    ``,
    `Hello! I'm interested in booking *${serviceName}*${
      categoryName ? ` (${categoryName})` : ""
    } at your Park View City salon.`,
    `Could you please let me know available appointment slots and pricing?`,
    ``,
    `Thank you!`,
  ].join("\n");

  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
    text
  )}`;
}
