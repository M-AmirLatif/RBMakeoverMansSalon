"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  Scissors,
  Users,
  Image as ImageIcon,
  DollarSign,
  Layers,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Video,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertCircle,
  X,
  Clock,
  Tag,
} from "lucide-react";
import { staffBarbers, BarberStaff } from "@/data/team";
import { galleryImages } from "@/data/images";
import { SiteService, GalleryMediaItem } from "@/lib/supabase/queries";

function formatNumberWithCommas(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "";
  const cleaned = String(value).replace(/[^0-9]/g, "");
  if (!cleaned) return "";
  return Number(cleaned).toLocaleString("en-US");
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // Authentication state
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"barbers" | "gallery" | "services" | "timing">("barbers");

  // Shop Timing states
  const [timingWeekday, setTimingWeekday] = useState("10:00 AM - 11:00 PM");
  const [timingSaturday, setTimingSaturday] = useState("10:00 AM - 11:00 PM");
  const [timingSunday, setTimingSunday] = useState("Off-Day");
  const [timingNote, setTimingNote] = useState("OPEN MON - SAT 10:00 AM - 11:00 PM • SUNDAY OFF-DAY");
  const [savingTiming, setSavingTiming] = useState(false);

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Data states
  const [barbers, setBarbers] = useState<BarberStaff[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>([]);
  const [services, setServices] = useState<SiteService[]>([]);
  const [siteImages, setSiteImages] = useState<Record<string, string>>({
    hero_barber: "/images/hero-barber-craft.webp",
    about_salon: "/images/about-interior-floor.webp",
    precision_center: "/images/cutout-precision-taper.webp",
    hero_video: "/videos/hero-salon-loop-720p.mp4",
  });
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("/videos/hero-salon-loop-720p.mp4");
  const [heroVideoInput, setHeroVideoInput] = useState<string>("/videos/hero-salon-loop-720p.mp4");
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modals & Editing states
  const [editingBarber, setEditingBarber] = useState<(Omit<BarberStaff, "rates"> & {
    rates: {
      haircut: number | string;
      beard: number | string;
      hairAndBeard: number | string;
      facial: number | string;
      groomingPackage: number | string;
    };
  }) | null>(null);
  const [isNewBarber, setIsNewBarber] = useState(false);
  const [editingService, setEditingService] = useState<SiteService | null>(null);
  const [isNewService, setIsNewService] = useState(false);

  // Gallery upload state
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newGalleryTitle, setNewGalleryTitle] = useState("");
  const [newGalleryCategory, setNewGalleryCategory] = useState("Interiors");
  const [newGalleryFeatured, setNewGalleryFeatured] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Site Image upload ref
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Centralized Server-Side Admin CRUD API caller (uses Service Role Key on backend)
  const callAdminApi = async (action: string, payload: unknown) => {
    const res = await fetch("/api/admin/crud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    if (!res.ok) {
      let errMsg = "Operation failed";
      try {
        const errJson = await res.json();
        errMsg = errJson.error || errMsg;
      } catch {
        const text = await res.text();
        errMsg = text.slice(0, 150) || `Server error (${res.status})`;
      }
      throw new Error(errMsg);
    }
    return await res.json();
  };

  // Resilient direct upload to Supabase Storage via signed URL (bypasses serverless 4.5MB payload limit, supports files up to 50MB)
  const uploadMediaDirect = async (file: File): Promise<{ url: string; path: string }> => {
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_SIZE) {
      throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 50MB limit`);
    }

    // Step 1: Request signed upload URL
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      }),
    });

    if (!res.ok) {
      let errMsg = "Upload initiation failed";
      try {
        const errJson = await res.json();
        errMsg = errJson.error || errMsg;
      } catch {
        const text = await res.text();
        errMsg = text.slice(0, 150) || `Server error (${res.status})`;
      }
      throw new Error(errMsg);
    }

    const { path, token, url } = await res.json();

    // Step 2: Upload directly to Supabase storage with signed token
    const { error: uploadError } = await supabase.storage
      .from("salon-media")
      .uploadToSignedUrl(path, token, file, {
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      throw new Error(uploadError.message || "Failed to upload file to storage");
    }

    return { url, path };
  };

  // Check auth session
  useEffect(() => {
    async function verifyAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);
      setAuthChecking(false);
      loadAllData();
    }
    verifyAuth();
  }, [router, supabase]);

  // Load all tables
  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Barbers
      const { data: bData, error: bErr } = await supabase
        .from("barbers")
        .select("*")
        .order("display_order", { ascending: true });

      if (!bErr && bData && bData.length > 0) {
        setBarbers(
          bData.map((b) => ({
            id: b.id,
            name: b.name,
            title: b.title,
            category: b.category,
            initials: b.initials,
            experience: b.experience,
            rating: Number(b.rating),
            reviewCount: b.review_count,
            specialties: b.specialties || [],
            bio: b.bio || "",
            rates: b.rates,
            isPopular: b.is_popular,
            avatar_url: b.avatar_url || undefined,
          }))
        );
      } else {
        setBarbers(staffBarbers);
      }

      // 2. Gallery Items
      const { data: gData, error: gErr } = await supabase
        .from("gallery_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (!gErr && gData && gData.length > 0) {
        setGalleryItems(gData as GalleryMediaItem[]);
      } else {
        setGalleryItems(
          galleryImages.map((img, idx) => ({
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
          }))
        );
      }

      // 3. Services
      const { data: sData, error: sErr } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true });

      if (!sErr && sData && sData.length > 0) {
        setServices(sData as SiteService[]);
      }

      // 4. Site Images & Hero Video
      const { data: imgData, error: imgErr } = await supabase
        .from("site_images")
        .select("key, url");

      if (!imgErr && imgData && imgData.length > 0) {
        const map: Record<string, string> = {
          hero_barber: "/images/hero-barber-craft.webp",
          about_salon: "/images/about-interior-floor.webp",
          precision_center: "/images/cutout-precision-taper.webp",
          hero_video: "/videos/hero-salon-loop-720p.mp4",
        };
        imgData.forEach((row) => {
          if (row.key && row.url) {
            map[row.key] = row.url;
            if (row.key === "shop_timing_weekday") setTimingWeekday(row.url);
            if (row.key === "shop_timing_saturday") setTimingSaturday(row.url);
            if (row.key === "shop_timing_sunday") setTimingSunday(row.url);
            if (row.key === "shop_timing_note") setTimingNote(row.url);
          }
        });
        setSiteImages(map);
        if (map.hero_video) {
          setHeroVideoUrl(map.hero_video);
          setHeroVideoInput(map.hero_video);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  // -------------------------------------------------------------
  // BARBERS CRUD
  // -------------------------------------------------------------
  const handleRateChange = (
    key: "haircut" | "beard" | "hairAndBeard" | "facial" | "groomingPackage",
    val: string
  ) => {
    // Keep only digits and automatically format with commas (e.g. 6000 -> 6,000, 35000 -> 35,000)
    const cleaned = val.replace(/[^0-9]/g, "");
    const formatted = cleaned ? Number(cleaned).toLocaleString("en-US") : "";
    setEditingBarber((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        rates: {
          ...prev.rates,
          [key]: formatted,
        },
      };
    });
  };

  const [uploadingBarberImage, setUploadingBarberImage] = useState(false);

  const handleBarberImageUpload = async (file: File) => {
    if (!editingBarber) return;
    setUploadingBarberImage(true);
    try {
      const data = await uploadMediaDirect(file);
      setEditingBarber({
        ...editingBarber,
        avatar_url: data.url,
      });
      showToast("Barber photo uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      showToast(msg, "error");
    } finally {
      setUploadingBarberImage(false);
    }
  };

  const handleSaveBarber = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!editingBarber) return;

    try {
      const barberRates = {
        haircut: Number(String(editingBarber.rates?.haircut).replace(/[^0-9]/g, "")) || 1000,
        beard: Number(String(editingBarber.rates?.beard).replace(/[^0-9]/g, "")) || 600,
        hairAndBeard: Number(String(editingBarber.rates?.hairAndBeard).replace(/[^0-9]/g, "")) || 1500,
        facial: Number(String(editingBarber.rates?.facial).replace(/[^0-9]/g, "")) || 1800,
        groomingPackage: Number(String(editingBarber.rates?.groomingPackage).replace(/[^0-9]/g, "")) || 3500,
      };

      const payload = {
        id: editingBarber.id,
        name: editingBarber.name,
        title: editingBarber.title || "Barber & Stylist",
        category: editingBarber.category || "haircut",
        initials: editingBarber.initials || editingBarber.name.substring(0, 2).toUpperCase(),
        experience: editingBarber.experience || "5 Years",
        rating: Number(editingBarber.rating) || 5.0,
        review_count: Number(editingBarber.reviewCount) || 10,
        specialties: Array.isArray(editingBarber.specialties) ? editingBarber.specialties : ["Fade Haircut", "Beard Trim"],
        bio: editingBarber.bio || "",
        avatar_url: editingBarber.avatar_url || null,
        rates: barberRates,
        is_popular: !!editingBarber.isPopular,
      };

      // Call dedicated Admin CRUD API
      await callAdminApi("save_barber", payload);

      // Optimistically update barbers in local state so the photo renders immediately
      setBarbers((prev) => {
        const updated = {
          id: editingBarber.id,
          name: editingBarber.name,
          title: editingBarber.title,
          category: editingBarber.category,
          avatar_url: editingBarber.avatar_url || undefined,
          experience: editingBarber.experience,
          bio: editingBarber.bio || "",
          initials: editingBarber.initials || editingBarber.name.substring(0, 2).toUpperCase(),
          rating: Number(editingBarber.rating) || 5.0,
          reviewCount: Number(editingBarber.reviewCount) || 10,
          specialties: Array.isArray(editingBarber.specialties) ? editingBarber.specialties : ["Fade Haircut", "Beard Trim"],
          isPopular: !!editingBarber.isPopular,
          rates: barberRates,
        };
        const exists = prev.some((b) => b.id === editingBarber.id);
        if (exists) {
          return prev.map((b) => (b.id === editingBarber.id ? updated : b));
        }
        return [...prev, updated];
      });

      showToast(`Barber "${editingBarber.name}" photo and details saved successfully!`);
      setEditingBarber(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save barber";
      showToast(msg, "error");
    }
  };

  const handleDeleteBarber = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove barber "${name}"?`)) return;

    try {
      await callAdminApi("delete_barber", { id });
      setBarbers((prev) => prev.filter((b) => b.id !== id));
      showToast(`Barber "${name}" deleted.`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete barber";
      showToast(msg, "error");
    }
  };

  // -------------------------------------------------------------
  // HERO SHOWCASE VIDEO (EDIT & UPLOAD)
  // -------------------------------------------------------------
  const handleUpdateHeroVideo = async (videoUrl: string) => {
    if (!videoUrl.trim()) return;
    try {
      await callAdminApi("save_hero_video", { url: videoUrl.trim() });
      setHeroVideoUrl(videoUrl.trim());
      setHeroVideoInput(videoUrl.trim());
      showToast("Hero showcase video updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update hero video";
      showToast(msg, "error");
    }
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeroVideo(true);
    try {
      const data = await uploadMediaDirect(file);
      await handleUpdateHeroVideo(data.url);
      showToast("Hero video uploaded and updated successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload video";
      showToast(msg, "error");
    } finally {
      setUploadingHeroVideo(false);
      if (e.target) e.target.value = "";
    }
  };

  // -------------------------------------------------------------
  // GALLERY CRUD (UPLOAD IMAGE OR VIDEO)
  // -------------------------------------------------------------
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingGallery(true);
    try {
      const data = await uploadMediaDirect(file);

      const isVideo = file.type.startsWith("video/");
      const mediaItem = {
        title: newGalleryTitle || file.name.replace(/\.[^/.]+$/, ""),
        alt: newGalleryTitle || file.name,
        category: newGalleryCategory,
        media_type: isVideo ? "video" : "image",
        url: data.url,
        webp: data.url,
        thumbnail_url: isVideo ? null : data.url,
        featured: newGalleryFeatured,
        display_order: galleryItems.length + 1,
      };

      await callAdminApi("save_gallery_item", mediaItem);

      showToast(`Uploaded ${isVideo ? "video" : "photo"} to gallery successfully!`);
      setNewGalleryTitle("");
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      showToast(msg, "error");
    } finally {
      setUploadingGallery(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDeleteGalleryItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the gallery?`)) return;

    try {
      await callAdminApi("delete_gallery_item", { id });
      setGalleryItems((prev) => prev.filter((item) => item.id !== id));
      showToast(`Deleted "${title}" from gallery.`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete item";
      showToast(msg, "error");
    }
  };

  // -------------------------------------------------------------
  // SERVICES CRUD
  // -------------------------------------------------------------
  const handleSaveService = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!editingService) return;

    try {
      const num = Number(String(editingService.price).replace(/[^0-9]/g, "")) || 0;
      const formattedWithComma = num > 0 ? num.toLocaleString("en-US") : "0";
      const displayPrice = `Rs. ${formattedWithComma}`;

      const payload = {
        id: editingService.id,
        name: editingService.name,
        category: editingService.category,
        price: displayPrice,
        numeric_price: num,
        description: editingService.description || "",
        duration: editingService.duration || "30 mins",
        display_order: editingService.display_order || (services.length + 1),
      };

      await callAdminApi("save_service", payload);

      setServices((prev) => {
        const exists = prev.some((s) => s.id === payload.id);
        if (exists) {
          return prev.map((s) => (s.id === payload.id ? { ...s, ...payload } : s));
        }
        return [...prev, payload as SiteService];
      });

      showToast(`Service "${editingService.name}" saved!`);
      setEditingService(null);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save service";
      showToast(msg, "error");
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;

    try {
      await callAdminApi("delete_service", { id });
      setServices((prev) => prev.filter((s) => s.id !== id));
      showToast(`Deleted service "${name}".`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete service";
      showToast(msg, "error");
    }
  };

  // -------------------------------------------------------------
  // SITE KEY IMAGES UPDATE
  // -------------------------------------------------------------
  const handleSiteImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const data = await uploadMediaDirect(file);

      const { error: dbErr } = await supabase.from("site_images").upsert({
        key,
        label: key,
        url: data.url,
        updated_at: new Date().toISOString(),
      });
      if (dbErr) throw dbErr;

      showToast(`Updated image for ${key}!`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update image";
      showToast(msg, "error");
    } finally {
      setUploadingKey(null);
    }
  };

  // -------------------------------------------------------------
  // SHOP TIMING UPDATE
  // -------------------------------------------------------------
  const handleSaveShopTiming = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    setSavingTiming(true);
    try {
      await callAdminApi("save_shop_timing", {
        weekday: timingWeekday,
        saturday: timingSaturday,
        sunday: timingSunday,
        note: timingNote,
      });
      showToast("Shop timings updated successfully! Changes are live on the website.");
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update shop timing";
      showToast(msg, "error");
    } finally {
      setSavingTiming(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#070A08] text-[#DFC074] flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-[#C59B46]" />
        <p className="font-mono text-sm tracking-widest uppercase">Verifying Admin Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070A08] text-[#F5EFEB] pb-24 selection:bg-[#C59B46] selection:text-black">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-[#141C18] border-[#C59B46] text-[#F5EFEB]"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <Sparkles className="w-4 h-4 text-[#C59B46]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar: Mobile-perfect layout with zero wrapping */}
      <header className="sticky top-0 z-40 bg-[#0E1411]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-18 flex items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#C59B46]/60 shadow-[0_0_15px_rgba(197,155,70,0.3)] shrink-0 flex items-center justify-center bg-[#0E1411]">
              <Image
                src="/images/rb-makeover-logo-badge.png"
                alt="R.B Makeover Official Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="min-w-0 flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-lg text-[#F5EFEB] whitespace-nowrap">
                R.B Makeover
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1.5 sm:px-2 py-0.5 rounded bg-[#C59B46]/10 border border-[#C59B46]/30 text-[#C59B46] whitespace-nowrap">
                Admin
              </span>
            </div>
          </div>

          {/* Action Buttons: Responsive icons on phone, full text on desktop */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#DFC074] transition-colors"
              title="View Live Site"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C59B46]" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-xs text-red-300 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation: Smooth horizontal scroll on mobile */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-4 border-t border-white/[0.04] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("barbers")}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "barbers"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Barbers ({barbers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "gallery"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery &amp; Media ({galleryItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "services"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Services &amp; Pricing ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("timing")}
            className={`py-3 sm:py-3.5 px-3 sm:px-4 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "timing"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Shop Timing &amp; Hours</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* ========================================================= */}
        {/* TAB 1: BARBERS & TEAM CRUD                                */}
        {/* ========================================================= */}
        {activeTab === "barbers" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#F5EFEB]">Barber Staff &amp; Rates</h2>
                <p className="text-xs text-[#7A756B] mt-1">
                  Manage the 10 professional barbers, experience titles, ratings, and individual service prices.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingBarber({
                    id: `barber-${Date.now()}`,
                    name: "",
                    title: "Barber & Stylist",
                    category: "haircut",
                    initials: "NB",
                    experience: "5 Years",
                    rating: 5.0,
                    reviewCount: 10,
                    specialties: ["Fade Haircut", "Beard Trim"],
                    bio: "",
                    rates: {
                      haircut: 1000,
                      beard: 600,
                      hairAndBeard: 1500,
                      facial: 1800,
                      groomingPackage: 3500,
                    },
                    isPopular: false,
                  });
                  setIsNewBarber(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Barber</span>
              </button>
            </div>

            {/* Barbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {barbers.map((barber) => (
                <div
                  key={barber.id}
                  className="bg-[#0E1411] border border-white/[0.08] hover:border-[#C59B46]/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#141C18] border border-[#C59B46]/40 flex items-center justify-center text-[#DFC074] font-serif font-bold text-lg relative shrink-0">
                          {barber.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={barber.avatar_url}
                              alt={barber.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            barber.initials
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#F5EFEB] text-base">{barber.name}</h3>
                            {barber.isPopular && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#C59B46]/20 text-[#DFC074] border border-[#C59B46]/30 font-mono">
                                Top
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#DFC074]">{barber.title}</p>
                          <p className="text-[11px] text-[#7A756B]">{barber.experience} • ★ {barber.rating} ({barber.reviewCount} reviews)</p>
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {barber.bio && (
                      <p className="text-xs text-[#A8A29E] line-clamp-2 mb-4 bg-white/[0.02] p-2.5 rounded-lg border border-white/[0.04]">
                        {barber.bio}
                      </p>
                    )}

                    {/* Rate Matrix Preview */}
                    <div className="bg-[#141C18] rounded-xl p-3 border border-white/[0.05] space-y-1.5 mb-4 text-xs font-mono">
                      <div className="flex justify-between text-[#7A756B]">
                        <span>Haircut:</span>
                        <span className="text-[#DFC074]">Rs. {barber.rates?.haircut || 1000}</span>
                      </div>
                      <div className="flex justify-between text-[#7A756B]">
                        <span>Beard Lineup:</span>
                        <span className="text-[#DFC074]">Rs. {barber.rates?.beard || 600}</span>
                      </div>
                      <div className="flex justify-between text-[#7A756B]">
                        <span>Hair + Beard:</span>
                        <span className="text-[#DFC074]">Rs. {barber.rates?.hairAndBeard || 1500}</span>
                      </div>
                      <div className="flex justify-between text-[#7A756B]">
                        <span>Facial Treatment:</span>
                        <span className="text-[#DFC074]">Rs. {barber.rates?.facial || 1800}</span>
                      </div>
                      <div className="flex justify-between text-[#7A756B]">
                        <span>VIP Package:</span>
                        <span className="text-[#DFC074]">Rs. {barber.rates?.groomingPackage || 3500}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => {
                        setEditingBarber({ ...barber });
                        setIsNewBarber(false);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-[#C59B46]/20 border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#F5EFEB] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C59B46]" />
                      <span>Edit Barber</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(barber.id, barber.name)}
                      className="py-2.5 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 text-xs text-red-400 flex items-center justify-center transition-colors"
                      title="Delete Barber"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: GALLERY & MEDIA MANAGER                            */}
        {/* ========================================================= */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            <div className="mb-2">
              <h2 className="text-xl sm:text-2xl font-serif text-[#F5EFEB]">Gallery &amp; Video Media</h2>
              <p className="text-xs text-[#7A756B] mt-1">
                Manage the continuous hero showcase video and public salon gallery photographs and clips.
              </p>
            </div>

            {/* HERO SHOWCASE VIDEO MANAGER */}
            <div className="bg-[#111714] border border-[#C59B46]/40 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#DFC074] font-bold">
                    <Video className="w-3.5 h-3.5 text-[#C59B46]" />
                    <span>Front Hero Slot (Centerpiece Video next to Rates Table)</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFEB]">
                    Live Hair Salon Showcase Video
                  </h3>
                  <p className="text-xs text-[#A8A193]">
                    This video continuously plays on the live website in the first front hero slot. Admin can update only this key video anytime.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live on Website</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
                {/* Video Preview Player */}
                <div className="lg:col-span-5 relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-[#C59B46]/30 shadow-xl group">
                  <video
                    key={heroVideoUrl}
                    src={heroVideoUrl}
                    controls
                    playsInline
                    muted
                    loop
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-mono uppercase text-[#DFC074] border border-[#C59B46]/30 pointer-events-none">
                    Preview
                  </div>
                </div>

                {/* Upload & URL Controls */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-2 font-semibold">
                      Option 1: Upload New Video File (MP4 or WebM up to 50MB)
                    </label>
                    <label className={`cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#C59B46]/20 hover:bg-[#C59B46]/30 border border-[#C59B46]/40 text-xs font-semibold text-[#DFC074] transition-colors shadow-sm ${uploadingHeroVideo ? "opacity-50 pointer-events-none" : ""}`}>
                      {uploadingHeroVideo ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#C59B46]" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      <span>{uploadingHeroVideo ? "Uploading Video..." : "Upload New Video to Storage"}</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm"
                        disabled={uploadingHeroVideo}
                        onChange={handleHeroVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1.5 font-semibold">
                      Option 2: Direct Video URL or Storage Path
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={heroVideoInput}
                        onChange={(e) => setHeroVideoInput(e.target.value)}
                        placeholder="e.g. /videos/hero-salon-loop-720p.mp4 or https://..."
                        className="flex-1 bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateHeroVideo(heroVideoInput)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all cursor-pointer whitespace-nowrap"
                      >
                        Save Video
                      </button>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateHeroVideo("/videos/hero-salon-loop-720p.mp4")}
                      className="text-xs text-[#7A756B] hover:text-[#DFC074] underline transition-colors cursor-pointer"
                    >
                      Reset to Default Salon Video Loop
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Box: Clean, stacked & thumb-friendly on mobile */}
            <div className="bg-[#0E1411] border border-dashed border-[#C59B46]/40 rounded-2xl p-5 sm:p-8 mb-8 text-center relative">
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*,video/mp4,video/webm"
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
                className="hidden"
                id="gallery-file-upload"
              />

              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#141C18] border border-[#C59B46]/30 flex items-center justify-center text-[#C59B46] mx-auto">
                  {uploadingGallery ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-[#C59B46]" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#F5EFEB]">
                    {uploadingGallery ? "Uploading media to storage..." : "Upload New Photo or Video"}
                  </h3>
                  <p className="text-xs text-[#7A756B] mt-1">
                    Supports JPG, PNG, WebP, and MP4/WebM videos up to 50MB
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#7A756B] mb-1">
                      Caption / Title
                    </label>
                    <input
                      type="text"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      placeholder="e.g. Master Beard Sculpting"
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#7A756B] mb-1">
                      Category
                    </label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    >
                      <option value="Interiors">Interiors</option>
                      <option value="Styling">Styling</option>
                      <option value="Haircuts">Haircuts</option>
                      <option value="Beard">Beard</option>
                      <option value="Storefront">Storefront</option>
                    </select>
                  </div>
                </div>

                {/* Mobile stacked controls: checkbox on top, full width upload button */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8A29E] py-1">
                    <input
                      type="checkbox"
                      checked={newGalleryFeatured}
                      onChange={(e) => setNewGalleryFeatured(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#C59B46]"
                    />
                    <span>Featured (spans 2 columns)</span>
                  </label>

                  <label
                    htmlFor="gallery-file-upload"
                    className={`cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all ${
                      uploadingGallery ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select File to Upload</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Gallery Media Grid: with onError fallback protection */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-[#0E1411] border border-white/[0.08] hover:border-[#C59B46]/40 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-[#141C18] overflow-hidden">
                    {item.media_type === "video" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/60 relative">
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          controls
                          playsInline
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono uppercase text-[#DFC074] border border-[#C59B46]/30 flex items-center gap-1">
                          <Video className="w-3 h-3 text-[#C59B46]" /> Video
                        </span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.webp || item.url}
                        alt={item.alt || item.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/salon-wide-stations.webp";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono uppercase text-[#F5EFEB] border border-white/[0.1]">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-[#F5EFEB] truncate">{item.title}</h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.05]">
                      <span className="text-[10px] text-[#7A756B] uppercase font-mono">
                        {item.featured ? "Featured" : "Standard"}
                      </span>
                      <button
                        onClick={() => handleDeleteGalleryItem(item.id, item.title)}
                        className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-500/20 text-xs transition-colors"
                        title="Delete from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SERVICES & PRICING                                 */}
        {/* ========================================================= */}
        {activeTab === "services" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#F5EFEB]">Services &amp; Pricing Matrix</h2>
                <p className="text-xs text-[#7A756B] mt-1">
                  Update customer-facing rates, service categories, and descriptions.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingService({
                    id: `service-${Date.now()}`,
                    name: "",
                    category: "haircuts",
                    price: "Rs. 1,000",
                    numeric_price: 1000,
                    description: "",
                    duration: "30 mins",
                    display_order: services.length + 1,
                  });
                  setIsNewService(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Mobile View: Luxury Cards (never cut off, thumb friendly) */}
            <div className="block md:hidden space-y-3.5">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-[#0E1411] border border-white/[0.08] hover:border-[#C59B46]/40 rounded-2xl p-4 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-[#F5EFEB]">{svc.name}</h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono uppercase text-[#DFC074]">
                          <Tag className="w-2.5 h-2.5 text-[#C59B46]" />
                          {svc.category}
                        </span>
                        {svc.duration && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#7A756B]">
                            <Clock className="w-3 h-3 text-[#7A756B]" />
                            {svc.duration}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-mono text-sm text-[#DFC074] font-bold whitespace-nowrap bg-[#141C18] px-2.5 py-1 rounded-lg border border-[#C59B46]/30">
                      {svc.price}
                    </div>
                  </div>

                  {svc.description && (
                    <p className="text-xs text-[#A8A29E] bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                      {svc.description}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                    <button
                      onClick={() => {
                        setEditingService({ ...svc });
                        setIsNewService(false);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-[#C59B46]/20 border border-white/[0.08] text-xs text-[#DFC074] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C59B46]" />
                      <span>Edit Service</span>
                    </button>
                    <button
                      onClick={() => handleDeleteService(svc.id, svc.name)}
                      className="py-2 px-3 rounded-xl bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 text-xs text-red-400 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden md:block bg-[#0E1411] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141C18] border-b border-white/[0.08] text-[#DFC074] font-mono uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Service Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {services.map((svc) => (
                      <tr key={svc.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#F5EFEB]">{svc.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono uppercase text-[#DFC074]">
                            {svc.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[#DFC074] font-bold">{svc.price}</td>
                        <td className="py-3.5 px-4 text-[#7A756B]">{svc.duration}</td>
                        <td className="py-3.5 px-4 text-[#A8A29E] max-w-xs truncate">{svc.description || "—"}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingService({ ...svc });
                              setIsNewService(false);
                            }}
                            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-[#C59B46]/20 border border-white/[0.08] text-[#C59B46] transition-colors"
                            title="Edit Service"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(svc.id, svc.name)}
                            className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 text-red-400 transition-colors"
                            title="Delete Service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SHOP TIMING & BUSINESS HOURS                       */}
        {/* ========================================================= */}
        {activeTab === "timing" && (
          <div className="space-y-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#F5EFEB]">Shop Timing &amp; Business Hours</h2>
                <p className="text-xs text-[#7A756B] mt-1">
                  Change salon timings anytime. Updates reflect immediately on the live website (About section, schedule strip, and appointment info).
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveShopTiming()}
                disabled={savingTiming}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(197,155,70,0.35)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {savingTiming ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                <span>{savingTiming ? "Saving..." : "Save Timings"}</span>
              </button>
            </div>

            {/* Live Website Preview Card */}
            <div className="rounded-2xl bg-[#141C18] border border-[#C59B46]/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C59B46] font-bold">
                  ✦ LIVE WEBSITE PREVIEW
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-[#25D366] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  Active on Website
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#0E1411] border border-white/[0.08] space-y-1">
                  <div className="text-[11px] text-[#C59B46] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Mon - Fri</span>
                  </div>
                  <div className="text-base font-bold text-[#F5EFEB]">{timingWeekday}</div>
                  <div className="text-[10px] text-[#7A756B]">Weekdays</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E1411] border border-white/[0.08] space-y-1">
                  <div className="text-[11px] text-[#C59B46] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Saturday</span>
                  </div>
                  <div className="text-base font-bold text-[#F5EFEB]">{timingSaturday}</div>
                  <div className="text-[10px] text-[#7A756B]">Weekend Grooming</div>
                </div>

                <div className="p-4 rounded-xl bg-[#0E1411] border border-white/[0.08] space-y-1">
                  <div className="text-[11px] text-[#C59B46] font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Sunday</span>
                  </div>
                  <div className="text-base font-bold text-[#F5EFEB]">{timingSunday}</div>
                  <div className="text-[10px] text-[#7A756B]">Off-Day / Schedule</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0E1411] border border-white/[0.08] text-xs flex items-center gap-2.5">
                <span className="text-[#C59B46] font-mono font-bold uppercase text-[10px] shrink-0">Ticker Note:</span>
                <span className="text-[#F5EFEB] font-mono truncate">{timingNote}</span>
              </div>
            </div>

            {/* Editable Form Card */}
            <form onSubmit={handleSaveShopTiming} className="rounded-2xl bg-[#111614] border border-white/[0.08] p-6 space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5EFEB]">Edit Operating Hours</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#F5EFEB] mb-1.5">
                    Monday – Friday Hours
                  </label>
                  <input
                    type="text"
                    value={timingWeekday}
                    onChange={(e) => setTimingWeekday(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:00 PM"
                    className="w-full px-4 py-3 rounded-xl bg-[#141C18] border border-white/[0.12] text-sm text-[#F5EFEB] focus:outline-none focus:border-[#C59B46]"
                    required
                  />
                  <p className="text-[11px] text-[#7A756B] mt-1">Normal weekday working hours</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EFEB] mb-1.5">
                    Saturday Hours
                  </label>
                  <input
                    type="text"
                    value={timingSaturday}
                    onChange={(e) => setTimingSaturday(e.target.value)}
                    placeholder="e.g. 10:00 AM - 11:00 PM"
                    className="w-full px-4 py-3 rounded-xl bg-[#141C18] border border-white/[0.12] text-sm text-[#F5EFEB] focus:outline-none focus:border-[#C59B46]"
                    required
                  />
                  <p className="text-[11px] text-[#7A756B] mt-1">Saturday rush hours</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EFEB] mb-1.5">
                    Sunday Schedule
                  </label>
                  <input
                    type="text"
                    value={timingSunday}
                    onChange={(e) => setTimingSunday(e.target.value)}
                    placeholder="e.g. Off-Day or 12:00 PM - 10:00 PM"
                    className="w-full px-4 py-3 rounded-xl bg-[#141C18] border border-white/[0.12] text-sm text-[#F5EFEB] focus:outline-none focus:border-[#C59B46]"
                    required
                  />
                  <p className="text-[11px] text-[#7A756B] mt-1">Set to &apos;Off-Day&apos; or custom Sunday hours</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F5EFEB] mb-1.5">
                    Ticker Schedule Announcement
                  </label>
                  <input
                    type="text"
                    value={timingNote}
                    onChange={(e) => setTimingNote(e.target.value)}
                    placeholder="e.g. OPEN MON - SAT 10:00 AM - 11:00 PM • SUNDAY OFF-DAY"
                    className="w-full px-4 py-3 rounded-xl bg-[#141C18] border border-white/[0.12] text-sm text-[#F5EFEB] focus:outline-none focus:border-[#C59B46]"
                    required
                  />
                  <p className="text-[11px] text-[#7A756B] mt-1">Displayed in website header &amp; tickers</p>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-white/[0.08]">
                <span className="text-[11px] text-[#7A756B] block mb-2 font-mono uppercase tracking-wider">
                  Quick One-Click Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTimingWeekday("10:00 AM - 11:00 PM");
                      setTimingSaturday("10:00 AM - 11:00 PM");
                      setTimingSunday("Off-Day");
                      setTimingNote("OPEN MON - SAT 10:00 AM - 11:00 PM • SUNDAY OFF-DAY");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#DFC074] border border-[#C59B46]/20 transition-colors cursor-pointer"
                  >
                    Standard Hours (Mon-Sat 10AM-11PM, Sun Off)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimingWeekday("10:00 AM - 11:00 PM");
                      setTimingSaturday("10:00 AM - 11:00 PM");
                      setTimingSunday("12:00 PM - 10:00 PM");
                      setTimingNote("OPEN 7 DAYS A WEEK • 10:00 AM - 11:00 PM");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#B8B0A2] border border-white/10 transition-colors cursor-pointer"
                  >
                    Open 7 Days (Including Sunday)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTimingWeekday("01:00 PM - 02:00 AM");
                      setTimingSaturday("01:00 PM - 03:00 AM");
                      setTimingSunday("02:00 PM - 02:00 AM");
                      setTimingNote("RAMADAN TIMINGS: 1:00 PM - 3:00 AM DAILY");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#B8B0A2] border border-white/10 transition-colors cursor-pointer"
                  >
                    Ramadan Special Hours
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={savingTiming}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(197,155,70,0.35)] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingTiming ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  <span>{savingTiming ? "Saving Changes..." : "Save &amp; Publish Timing"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD BARBER                                  */}
      {/* ========================================================= */}
      {editingBarber && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-[#0E1411] border border-white/[0.12] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0A0E0C]">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFEB]">
                  {isNewBarber ? "Add New Barber" : `Edit ${editingBarber.name}`}
                </h3>
                <p className="text-[11px] text-[#7A756B] mt-0.5">
                  Update profile photo, role credentials, and individual service rates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBarber(null)}
                className="p-1.5 rounded-lg text-[#7A756B] hover:text-[#F5EFEB] hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form wrapping body and footer */}
            <form onSubmit={handleSaveBarber} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* Barber Profile Photo / Avatar Editor */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#141C18] border border-[#C59B46]/40 flex items-center justify-center text-[#DFC074] font-serif font-bold text-xl relative shrink-0 shadow-md">
                    {editingBarber.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={editingBarber.avatar_url}
                        alt={editingBarber.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      editingBarber.initials || editingBarber.name.substring(0, 2).toUpperCase()
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="text-xs font-semibold text-[#F5EFEB]">Barber Profile Photo</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer py-1.5 px-3 rounded-lg bg-[#C59B46]/20 hover:bg-[#C59B46]/30 border border-[#C59B46]/40 text-xs text-[#DFC074] font-medium flex items-center gap-1.5 transition-colors">
                        {uploadingBarberImage ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C59B46]" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingBarberImage ? "Uploading..." : "Upload Photo"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingBarberImage}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleBarberImageUpload(f);
                          }}
                          className="hidden"
                        />
                      </label>

                      {editingBarber.avatar_url && (
                        <button
                          type="button"
                          onClick={() => setEditingBarber({ ...editingBarber, avatar_url: undefined })}
                          className="py-1.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 text-xs text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Photo</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={editingBarber.avatar_url || ""}
                      onChange={(e) => setEditingBarber({ ...editingBarber, avatar_url: e.target.value })}
                      placeholder="Or enter image URL e.g. /images/barbers/name.jpg"
                      className="w-full bg-[#141C18] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-[11px] text-[#A8A193] placeholder-[#7A756B] focus:border-[#C59B46] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                      Barber Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBarber.name}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          name: e.target.value,
                          id: isNewBarber
                            ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-")
                            : editingBarber.id,
                        })
                      }
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBarber.title}
                      onChange={(e) =>
                        setEditingBarber({ ...editingBarber, title: e.target.value })
                      }
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                      Experience *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingBarber.experience}
                      onChange={(e) =>
                        setEditingBarber({ ...editingBarber, experience: e.target.value })
                      }
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                      Category
                    </label>
                    <select
                      value={editingBarber.category}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          category: e.target.value as "all" | "senior" | "haircut" | "skincare",
                        })
                      }
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    >
                      <option value="senior">Senior Barber</option>
                      <option value="haircut">Hair &amp; Beard Stylist</option>
                      <option value="skincare">Skincare &amp; Facial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                    Bio / Review Highlights
                  </label>
                  <textarea
                    rows={2}
                    value={editingBarber.bio}
                    onChange={(e) =>
                      setEditingBarber({ ...editingBarber, bio: e.target.value })
                    }
                    className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                  />
                </div>

                {/* Service Pricing Matrix */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs uppercase font-mono text-[#DFC074] font-bold">
                      Individual Barber Rates
                    </label>
                    <span className="text-[11px] text-[#7A756B] font-mono">
                      Amounts in PKR (Rs.)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#141C18] p-4 rounded-xl border border-white/[0.06]">
                    {([
                      { key: "haircut", label: "Haircut" },
                      { key: "beard", label: "Beard Trim" },
                      { key: "hairAndBeard", label: "Hair + Beard" },
                      { key: "facial", label: "Facial" },
                      { key: "groomingPackage", label: "VIP Package" },
                    ] as const).map(({ key, label }) => (
                      <div key={key} className={key === "groomingPackage" ? "col-span-2 sm:col-span-1" : "col-span-1"}>
                        <label className="block text-[11px] font-mono text-[#A8A29E] mb-1.5 font-medium">
                          {label}
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs font-mono text-[#7A756B] select-none pointer-events-none">
                            Rs.
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formatNumberWithCommas(editingBarber.rates?.[key] !== undefined ? editingBarber.rates[key] : "")}
                            onChange={(e) => handleRateChange(key, e.target.value)}
                            placeholder="1,000"
                            className="w-full bg-[#0E1411] border border-white/[0.12] focus:border-[#C59B46] rounded-xl pl-9 pr-3 py-2 text-sm text-[#DFC074] font-mono font-medium outline-none transition-colors"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer - Fixed at bottom */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0E0C] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8A29E] select-none">
                  <input
                    type="checkbox"
                    checked={editingBarber.isPopular}
                    onChange={(e) =>
                      setEditingBarber({ ...editingBarber, isPopular: e.target.checked })
                    }
                    className="rounded accent-[#C59B46] w-4 h-4 cursor-pointer"
                  />
                  <span>Mark as Most Requested / Popular</span>
                </label>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingBarber(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#A8A29E] hover:text-[#F5EFEB] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={() => handleSaveBarber()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all cursor-pointer shrink-0"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD SERVICE                                 */}
      {/* ========================================================= */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          <div className="bg-[#0E1411] border border-white/[0.12] rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0A0E0C]">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFEB]">
                  {isNewService ? "Add New Service" : `Edit ${editingService.name}`}
                </h3>
                <p className="text-[11px] text-[#7A756B] mt-0.5">
                  Update service rate, duration, and catalog category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg text-[#7A756B] hover:text-[#F5EFEB] hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form wrapping body and footer */}
            <form onSubmit={handleSaveService} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Form Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        name: e.target.value,
                        id: isNewService
                          ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-")
                          : editingService.id,
                      })
                    }
                    className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                      Price
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-xs font-mono text-[#7A756B] select-none pointer-events-none">
                        Rs.
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={formatNumberWithCommas(editingService.price || "")}
                        onChange={(e) => {
                          const rawDigits = e.target.value.replace(/[^0-9]/g, "");
                          const formatted = rawDigits ? Number(rawDigits).toLocaleString("en-US") : "";
                          setEditingService({
                            ...editingService,
                            price: formatted ? `Rs. ${formatted}` : "",
                            numeric_price: Number(rawDigits) || 0,
                          });
                        }}
                        placeholder="1,000"
                        className="w-full bg-[#141C18] border border-white/[0.12] focus:border-[#C59B46] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#DFC074] font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={editingService.duration}
                      onChange={(e) =>
                        setEditingService({ ...editingService, duration: e.target.value })
                      }
                      placeholder="30 mins"
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                    Category
                  </label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value })
                    }
                    className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                  >
                    <option value="haircuts">Haircuts &amp; Styling</option>
                    <option value="beard">Beard &amp; Grooming</option>
                    <option value="facial">Facial &amp; Skincare</option>
                    <option value="grooming">VIP Packages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-[#DFC074] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingService.description || ""}
                    onChange={(e) =>
                      setEditingService({ ...editingService, description: e.target.value })
                    }
                    placeholder="Short description of the service..."
                    className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer - Fixed */}
              <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0A0E0C] flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs text-[#A8A29E] hover:text-[#F5EFEB] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => handleSaveService()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
