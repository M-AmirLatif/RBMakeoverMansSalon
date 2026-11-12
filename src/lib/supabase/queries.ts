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
