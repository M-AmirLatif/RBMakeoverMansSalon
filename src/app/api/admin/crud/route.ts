import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;

    const supabase = createAdminClient();

    switch (action) {
      // -------------------------------------------------------------
      // 1. BARBERS CRUD
      // -------------------------------------------------------------
      case "save_barber": {
        if (!payload || !payload.id || !payload.name) {
          return NextResponse.json({ error: "Missing required barber fields" }, { status: 400 });
        }

        const barberData = {
          id: payload.id,
          name: payload.name.trim(),
          title: payload.title || "Barber & Stylist",
          category: payload.category || "haircut",
          initials: payload.initials || payload.name.substring(0, 2).toUpperCase(),
          experience: payload.experience || "5 Years",
          rating: Number(payload.rating) || 5.0,
          review_count: Number(payload.review_count || payload.reviewCount) || 10,
          specialties: Array.isArray(payload.specialties) ? payload.specialties : ["Fade Haircut", "Beard Trim"],
          bio: payload.bio || "",
          avatar_url: payload.avatar_url || null,
          rates: payload.rates || {
            haircut: 1000,
            beard: 600,
            hairAndBeard: 1500,
            facial: 1800,
            groomingPackage: 3500,
          },
          is_popular: !!payload.is_popular,
          active: true,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from("barbers").upsert(barberData).select();
        if (error) {
          console.error("Error saving barber:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data });
      }

      case "delete_barber": {
        const { id } = payload || {};
        if (!id) {
          return NextResponse.json({ error: "Missing barber ID" }, { status: 400 });
        }
        const { error } = await supabase.from("barbers").delete().eq("id", id);
        if (error) {
          console.error("Error deleting barber:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }

      // -------------------------------------------------------------
      // 2. SERVICES CRUD
      // -------------------------------------------------------------
      case "save_service": {
        if (!payload || !payload.id || !payload.name) {
          return NextResponse.json({ error: "Missing required service fields" }, { status: 400 });
        }

        const num = Number(String(payload.price).replace(/[^0-9]/g, "")) || 0;
        const displayPrice = String(payload.price).includes("Rs.")
          ? payload.price
          : `Rs. ${num.toLocaleString()}`;

        const serviceData = {
          id: payload.id,
          name: payload.name.trim(),
          category: payload.category || "haircuts",
          price: displayPrice || "Rs. 1,000",
          numeric_price: num,
          description: payload.description || "",
          duration: payload.duration || "30 mins",
          display_order: Number(payload.display_order) || 1,
          active: true,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from("services").upsert(serviceData).select();
        if (error) {
          console.error("Error saving service:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data });
      }

      case "delete_service": {
        const { id } = payload || {};
        if (!id) {
          return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
        }
        const { error } = await supabase.from("services").delete().eq("id", id);
        if (error) {
          console.error("Error deleting service:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }

      // -------------------------------------------------------------
      // 3. HERO VIDEO & SITE IMAGES
      // -------------------------------------------------------------
      case "save_hero_video": {
        const { url } = payload || {};
        if (!url || !url.trim()) {
          return NextResponse.json({ error: "Missing video URL" }, { status: 400 });
        }
        const { data, error } = await supabase.from("site_images").upsert({
          key: "hero_video",
          label: "Hero Showcase Video",
          description: "Front continuous salon video next to rates table",
          url: url.trim(),
          updated_at: new Date().toISOString(),
        }).select();

        if (error) {
          console.error("Error saving hero video:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data });
      }

      // -------------------------------------------------------------
      // 4. GALLERY CRUD
      // -------------------------------------------------------------
      case "save_gallery_item": {
        if (!payload || !payload.url) {
          return NextResponse.json({ error: "Missing gallery item URL" }, { status: 400 });
        }
        const { data, error } = await supabase.from("gallery_items").upsert({
          id: payload.id || `gallery-${Date.now()}`,
          title: payload.title || "Salon Showcase",
          alt: payload.alt || "R.B Makeover Salon",
          category: payload.category || "Interiors",
          media_type: payload.media_type || "image",
          url: payload.url,
          webp: payload.webp || payload.url,
          thumbnail_url: payload.thumbnail_url || (payload.media_type === "video" ? null : payload.url),
          featured: !!payload.featured,
          display_order: Number(payload.display_order) || 1,
          active: true,
          updated_at: new Date().toISOString(),
        }).select();

        if (error) {
          console.error("Error saving gallery item:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, data });
      }

      case "delete_gallery_item": {
        const { id } = payload || {};
        if (!id) {
          return NextResponse.json({ error: "Missing gallery item ID" }, { status: 400 });
        }
        const { error } = await supabase.from("gallery_items").delete().eq("id", id);
        if (error) {
          console.error("Error deleting gallery item:", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true });
      }

      // -------------------------------------------------------------
      // 5. SHOP TIMINGS & BUSINESS HOURS
      // -------------------------------------------------------------
      case "save_shop_timing": {
        const { weekday, saturday, sunday, note } = payload || {};
        const entries = [
          {
            key: "shop_timing_weekday",
            label: "Monday - Friday Timing",
            description: "Operating hours for Monday through Friday",
            url: (weekday || "10:00 AM - 11:00 PM").trim(),
            updated_at: new Date().toISOString(),
          },
          {
            key: "shop_timing_saturday",
            label: "Saturday Timing",
            description: "Operating hours for Saturday",
            url: (saturday || "10:00 AM - 11:00 PM").trim(),
            updated_at: new Date().toISOString(),
          },
          {
            key: "shop_timing_sunday",
            label: "Sunday Timing",
            description: "Operating hours for Sunday",
            url: (sunday || "Off-Day").trim(),
            updated_at: new Date().toISOString(),
          },
          {
            key: "shop_timing_note",
            label: "Ticker Schedule Text",
            description: "Announcement text for marquee tickers",
            url: (note || "OPEN MON - SAT 10:00 AM - 11:00 PM • SUNDAY OFF-DAY").trim(),
            updated_at: new Date().toISOString(),
          },
        ];

        for (const item of entries) {
          const { error } = await supabase.from("site_images").upsert(item);
          if (error) {
            console.error("Error saving timing item:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
