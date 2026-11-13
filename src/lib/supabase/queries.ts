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
  { id: "mens-haircuts", name: "Men's Haircuts", category: "haircuts", price: "Rs. 1,000", numeric_price: 1000, description: "Precision haircut tailored to hair texture and head shape.", duration: "30 min", display_order: 1 },
  { id: "kids-haircuts", name: "Kids' Haircuts", category: "haircuts", price: "Rs. 700", numeric_price: 700, description: "Gentle, patient haircut for boys and kids.", duration: "25 min", display_order: 2 },
  { id: "fade-haircuts", name: "Fade & Taper Haircuts", category: "haircuts", price: "Rs. 1,200", numeric_price: 1200, description: "Skin fades, drop fades, temple tapers with razor edge lineup.", duration: "40 min", display_order: 3 },
  { id: "scissor-cuts", name: "Scissor Precision Cuts", category: "haircuts", price: "Rs. 1,200", numeric_price: 1200, description: "Classic scissors-only executive haircut with layered texture.", duration: "35 min", display_order: 4 },
  { id: "curly-styling", name: "Curly Hair Styling", category: "haircuts", price: "Rs. 1,400", numeric_price: 1400, description: "Hydrating definition, curl shaping, and taper finish.", duration: "40 min", display_order: 5 },
  { id: "hair-coloring", name: "Hair Coloring", category: "haircuts", price: "Rs. 2,000", numeric_price: 2000, description: "Natural gray blending, gloss tints, or custom color tones.", duration: "45 min", display_order: 6 },
  { id: "hair-straightening", name: "Hair Straightening", category: "haircuts", price: "Rs. 3,500", numeric_price: 3500, description: "Keratin and protein thermal treatment for smooth hair.", duration: "75 min", display_order: 7 },
  { id: "beard-trimming", name: "Beard Trimming & Lineup", category: "beard", price: "Rs. 600", numeric_price: 600, description: "Clipper trim, razor edge cheek shaping, and neckline cleanup.", duration: "20 min", display_order: 8 },
  { id: "pro-shave", name: "Professional Shaving", category: "beard", price: "Rs. 700", numeric_price: 700, description: "Hot towel prep, straight razor lather shave, chilled towel finish.", duration: "25 min", display_order: 9 },
  { id: "beard-dye", name: "Beard Dyeing & Conditioning", category: "beard", price: "Rs. 900", numeric_price: 900, description: "Gray blending, conditioning argan oil treatment.", duration: "25 min", display_order: 10 },
  { id: "facial-massage", name: "Facial Treatments & Cleansing", category: "facial", price: "Rs. 1,600", numeric_price: 1600, description: "Deep pore cleansing, scrub, steam, gentle blackhead extraction.", duration: "40 min", display_order: 11 },
  { id: "gold-facial", name: "VIP Royal Gold Facial", category: "facial", price: "Rs. 2,500", numeric_price: 2500, description: "Multi-stage gold revitalizing mask, serum infusion, face massage.", duration: "50 min", display_order: 12 },
  { id: "vip-grooming", name: "VIP Complete Grooming Package", category: "grooming", price: "Rs. 3,500", numeric_price: 3500, description: "Haircut, beard sculpt, executive facial treatment, hot towel therapy.", duration: "75 min", display_order: 13 },
  { id: "mani-pedi", name: "Mani & Pedicure", category: "grooming", price: "Rs. 2,500", numeric_price: 2500, description: "Complete luxury manicure and pedicure treatment with hand soak, cuticle care, foot scrub, and nail grooming.", duration: "60 min", display_order: 14 },
  { id: "manicure", name: "Manicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500, description: "Executive men's hand grooming, cuticle treatment, nail shaping, and relaxing hand massage.", duration: "35 min", display_order: 15 },
  { id: "pedicure", name: "Pedicure", category: "grooming", price: "Rs. 1,500", numeric_price: 1500, description: "Relaxing foot soak, dead skin exfoliation, cuticle care, nail buffing, and rejuvenating foot massage.", duration: "40 min", display_order: 16 },
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
