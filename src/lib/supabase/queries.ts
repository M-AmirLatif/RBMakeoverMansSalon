import { createClient } from "./client";
import { staffBarbers, BarberStaff } from "@/data/team";
import { galleryImages, SalonImage } from "@/data/images";
import { serviceCategories } from "@/data/services";

export interface GalleryMediaItem {
  id: string;
  title: string;
  alt: string;
  category: string;
  media_type: "image" | "video";
  url: string;
  webp?: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  aspect_ratio?: string;
  featured: boolean;
  display_order: number;
}

export interface SiteService {
  id: string;
  name: string;
  category: string;
  price: string;
  numeric_price: number;
  description: string;
  duration: string;
  display_order: number;
}

/**
 * Fetch barbers from Supabase with graceful fallback to static data.
 */
export async function fetchBarbers(): Promise<BarberStaff[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("barbers")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return staffBarbers;
    }

    return data.map((b) => ({
      id: b.id,
      name: b.name,
      title: b.title,
      category: b.category as "all" | "senior" | "haircut" | "skincare",
      initials: b.initials,
      experience: b.experience,
      rating: Number(b.rating),
      reviewCount: b.review_count,
      specialties: b.specialties || [],
      bio: b.bio || "",
      rates: b.rates,
      isPopular: b.is_popular,
      avatar_url: b.avatar_url || undefined,
    }));
  } catch {
    return staffBarbers;
  }
}

/**
 * Fetch gallery items (images and videos) with graceful fallback to static data.
 */
export async function fetchGalleryItems(): Promise<GalleryMediaItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return galleryImages.map((img, idx) => ({
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
      }));
    }

    return data as GalleryMediaItem[];
  } catch {
    return galleryImages.map((img, idx) => ({
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
    }));
  }
}

export const defaultServices: SiteService[] = [
  { id: "fade-haircuts", name: "Haircuts & Fades", category: "haircuts", price: "Rs. 400", numeric_price: 400, description: "Skin fades, drop fades, temple tapers with razor edge lineup.", duration: "35 min", display_order: 1 },
  { id: "mens-haircuts", name: "Men's Haircuts", category: "haircuts", price: "Rs. 350", numeric_price: 350, description: "Tailored men's precision cut suited to facial structure.", duration: "30 min", display_order: 2 },
  { id: "kids-haircuts", name: "Kids' Haircuts", category: "haircuts", price: "Rs. 350", numeric_price: 350, description: "Patient, gentle haircut for boys and young gentlemen.", duration: "25 min", display_order: 3 },
  { id: "scissor-cuts", name: "Scissor Precision Cuts", category: "haircuts", price: "Rs. 500", numeric_price: 500, description: "Classic scissors-only executive haircut with layered texture.", duration: "35 min", display_order: 4 },
  { id: "custom-haircuts", name: "Custom Haircuts & Restyling", category: "haircuts", price: "Rs. 450", numeric_price: 450, description: "Personalized bespoke haircut and styling consultation.", duration: "35 min", display_order: 5 },
  { id: "curly-styling", name: "Curly & Straight Hair Styling", category: "haircuts", price: "Rs. 300", numeric_price: 300, description: "Hydrating definition, curl shaping, and hair styling.", duration: "30 min", display_order: 6 },
  { id: "long-haircuts", name: "Long Haircuts & Layering", category: "haircuts", price: "Rs. 500", numeric_price: 500, description: "Long hair trimming, layering, and split-end cleanup.", duration: "40 min", display_order: 7 },
  { id: "hair-coloring", name: "Apple Hair Coloring", category: "haircuts", price: "Rs. 800", numeric_price: 800, description: "Natural gray blending, gloss tints, or custom color tones.", duration: "45 min", display_order: 8 },
  { id: "hair-shaving", name: "Full Head Shaving (Clean Razor)", category: "haircuts", price: "Rs. 350", numeric_price: 350, description: "Hot towel prep and clean head razor shave with soothing balm.", duration: "25 min", display_order: 9 },
  { id: "hair-straightening", name: "Hair Straightening", category: "haircuts", price: "Rs. 6,000", numeric_price: 6000, description: "Keratin and protein thermal treatment for smooth hair.", duration: "75 min", display_order: 10 },
  { id: "hair-treatments", name: "Keratin & Protein Hair Treatment", category: "haircuts", price: "Rs. 3,000", numeric_price: 3000, description: "Deep restorative protein and keratin conditioning treatment.", duration: "60 min", display_order: 11 },
  { id: "beard-trimming", name: "Beard Trimming & Lineup", category: "beard", price: "Rs. 250", numeric_price: 250, description: "Clipper trim, razor edge cheek shaping, and neckline cleanup.", duration: "20 min", display_order: 12 },
  { id: "pro-shave", name: "Professional Shaving", category: "beard", price: "Rs. 250", numeric_price: 250, description: "Hot towel prep, straight razor lather shave, chilled towel finish.", duration: "25 min", display_order: 13 },
  { id: "beard-conditioning", name: "Hot Towel Beard Conditioning", category: "beard", price: "Rs. 400", numeric_price: 400, description: "Warm argan oil steam therapy, softening mask, and beard balm.", duration: "20 min", display_order: 14 },
  { id: "beard-dye", name: "Beard Dyeing & Conditioning", category: "beard", price: "Rs. 600", numeric_price: 600, description: "Gray blending, conditioning argan oil treatment.", duration: "25 min", display_order: 15 },
  { id: "facial-massage", name: "Johnson Facial Cleansing", category: "facial", price: "Rs. 2,100", numeric_price: 2100, description: "Deep pore cleansing, scrub, steam, gentle blackhead extraction.", duration: "40 min", display_order: 16 },
  { id: "johnson-facial-", name: "Johnson Facial", category: "facial", price: "Rs. 4,500", numeric_price: 4500, description: "Full luxury Johnson skincare facial therapy and relaxing massage.", duration: "50 min", display_order: 17 },
  { id: "skincare-services", name: "Deep Pore Skincare & Scrub", category: "facial", price: "Rs. 1,800", numeric_price: 1800, description: "Botanical scrub, steam extraction, and hydrating mask.", duration: "35 min", display_order: 18 },
  { id: "gold-facial", name: "VIP Royal Gold Facial", category: "facial", price: "Rs. 2,500", numeric_price: 2500, description: "Multi-stage gold revitalizing mask, serum infusion, face massage.", duration: "50 min", display_order: 19 },
  { id: "mani-pedi", name: "Mani & Pedicure", category: "grooming", price: "Rs. 2,500", numeric_price: 2500, description: "Complete luxury manicure and pedicure treatment with hand soak, cuticle care, foot scrub, and nail grooming.", duration: "60 min", display_order: 20 },
  { id: "manicure", name: "Manicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500, description: "Executive men's hand grooming, cuticle treatment, nail shaping, and relaxing hand massage.", duration: "35 min", display_order: 21 },
  { id: "pedicure", name: "Pedicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500, description: "Relaxing foot soak, dead skin exfoliation, cuticle care, nail buffing, and rejuvenating foot massage.", duration: "40 min", display_order: 22 },
  { id: "hair-and-beard-styling", name: "Hair & Beard Complete Styling Combo", category: "grooming", price: "Rs. 1,500", numeric_price: 1500, description: "Full haircut, beard sculpt, hot towel, and executive styling.", duration: "50 min", display_order: 23 },
  { id: "vip-grooming", name: "VIP Complete Grooming Package", category: "grooming", price: "Rs. 3,500", numeric_price: 3500, description: "Haircut, beard sculpt, executive facial treatment, hot towel therapy.", duration: "75 min", display_order: 24 },
  { id: "shampoo-conditioning", name: "Luxury Shampoo & Conditioning", category: "grooming", price: "Rs. 600", numeric_price: 600, description: "Relaxing scalp wash, mint conditioning, and blow-dry styling.", duration: "20 min", display_order: 25 },
  { id: "eyebrow-trimming", name: "Eyebrow Shaping & Trimming", category: "grooming", price: "Rs. 300", numeric_price: 300, description: "Clean threading and scissor shaping for crisp eyebrow lines.", duration: "15 min", display_order: 26 },
];

/**
 * Fetch services from Supabase with fallback.
 */
export async function fetchServices(): Promise<SiteService[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultServices;
    }
    return data as SiteService[];
  } catch {
    return defaultServices;
  }
}

/**
 * Helper to get uniform price for any service across the site.
 */
export function resolveServicePrice(
  services: SiteService[],
  query: string,
  fallback = "Rs. 1,000"
): string {
  if (!services || services.length === 0) return fallback;
  const q = query.toLowerCase().trim();

  // 1. Direct ID match
  const directId = services.find((s) => s.id.toLowerCase() === q);
  if (directId?.price) return directId.price;

  // 2. Direct Name match
  const directName = services.find((s) => s.name.toLowerCase() === q);
  if (directName?.price) return directName.price;

  // 3. Keyword / partial matches
  if (q.includes("mani & pedi") || q.includes("mani-pedi") || (q.includes("mani") && q.includes("pedi"))) {
    const found = services.find((s) => s.id === "mani-pedi");
    if (found?.price) return found.price;
  }
  if (q === "manicure" || q.includes("manicure")) {
    const found = services.find((s) => s.id === "manicure");
    if (found?.price) return found.price;
  }
  if (q === "pedicure" || q.includes("pedicure")) {
    const found = services.find((s) => s.id === "pedicure");
    if (found?.price) return found.price;
  }
  if (q.includes("fade") || q.includes("crop") || q.includes("quiff")) {
    const found = services.find((s) => s.id === "fade-haircuts" || s.id === "mens-haircuts");
    if (found?.price) return found.price;
  }
  if (q.includes("beard") && (q.includes("sculpt") || q.includes("trim") || q.includes("lineup"))) {
    const found = services.find((s) => s.id === "beard-trimming");
    if (found?.price) return found.price;
  }
  if (q.includes("shav")) {
    const found = services.find((s) => s.id === "pro-shave");
    if (found?.price) return found.price;
  }
  if (q.includes("facial") || q.includes("skin")) {
    const found = services.find((s) => s.id === "facial-massage");
    if (found?.price) return found.price;
  }
  if (q.includes("vip") || q.includes("package")) {
    const found = services.find((s) => s.id === "vip-grooming");
    if (found?.price) return found.price;
  }

  // 4. General substring inclusion
  const found = services.find(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      q.includes(s.name.toLowerCase())
  );
  return found?.price || fallback;
}

/**
 * Fetch site key images with fallback.
 */
export async function fetchSiteImages(): Promise<Record<string, string>> {
  const defaults: Record<string, string> = {
    hero_barber: "/images/hero-barber-craft.webp",
    about_salon: "/images/about-interior-floor.webp",
    precision_center: "/images/cutout-precision-taper.webp",
    hero_video: "/videos/hero-salon-loop-720p.mp4",
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("site_images").select("key, url");
    if (error || !data || data.length === 0) {
      return defaults;
    }
    const map: Record<string, string> = { ...defaults };
    data.forEach((row) => {
      if (row.key && row.url) {
        map[row.key] = row.url;
      }
    });
    return map;
  } catch {
    return defaults;
  }
}

/**
 * Fetch hero video URL specifically for the hero image slot.
 */
export async function fetchHeroVideoUrl(): Promise<string> {
  const fallback = "/videos/hero-salon-loop-720p.mp4";
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_images")
      .select("url")
      .eq("key", "hero_video")
      .maybeSingle();

    if (error || !data || !data.url) {
      return fallback;
    }
    return data.url;
  } catch {
    return fallback;
  }
}

export interface ShopTimingConfig {
  weekday: string;
  saturday: string;
  sunday: string;
  note: string;
}

/**
 * Fetch editable shop timing configuration from Supabase.
 */
export async function fetchShopTiming(): Promise<ShopTimingConfig> {
  const fallback: ShopTimingConfig = {
    weekday: "10:00 AM - 11:00 PM",
    saturday: "10:00 AM - 11:00 PM",
    sunday: "Off-Day",
    note: "OPEN MON - SAT 10:00 AM - 11:00 PM • SUNDAY OFF-DAY",
  };

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_images")
      .select("key, url")
      .in("key", [
        "shop_timing_weekday",
        "shop_timing_saturday",
        "shop_timing_sunday",
        "shop_timing_note",
      ]);

    if (error || !data || data.length === 0) {
      return fallback;
    }

    const result = { ...fallback };
    data.forEach((row) => {
      if (row.key === "shop_timing_weekday" && row.url) result.weekday = row.url;
      if (row.key === "shop_timing_saturday" && row.url) result.saturday = row.url;
      if (row.key === "shop_timing_sunday" && row.url) result.sunday = row.url;
      if (row.key === "shop_timing_note" && row.url) result.note = row.url;
    });

    return result;
  } catch {
    return fallback;
  }
}
