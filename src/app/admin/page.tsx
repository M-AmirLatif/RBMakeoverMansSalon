"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Check,
  X,
  Upload,
  Video,
  ExternalLink,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { staffBarbers, BarberStaff } from "@/data/team";
import { galleryImages, SalonImage } from "@/data/images";
import { SiteService, GalleryMediaItem } from "@/lib/supabase/queries";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  // Authentication state
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"barbers" | "gallery" | "services" | "siteImages">("barbers");

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Data states
  const [barbers, setBarbers] = useState<BarberStaff[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryMediaItem[]>([]);
  const [services, setServices] = useState<SiteService[]>([]);
  const [siteImages, setSiteImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Modals & Editing states
  const [editingBarber, setEditingBarber] = useState<BarberStaff | null>(null);
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

      // 4. Site Images
      const { data: imgData, error: imgErr } = await supabase
        .from("site_images")
        .select("key, url");

      if (!imgErr && imgData) {
        const map: Record<string, string> = {
          hero_barber: "/images/master-barber-cutout.webp",
          about_salon: "/images/about-interior-floor.webp",
          precision_center: "/images/razor-drop-fade-v2.webp",
        };
        imgData.forEach((row) => {
          if (row.key && row.url) map[row.key] = row.url;
        });
        setSiteImages(map);
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
  const handleSaveBarber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBarber) return;

    try {
      const payload = {
        id: editingBarber.id,
        name: editingBarber.name,
        title: editingBarber.title,
        category: editingBarber.category,
        initials: editingBarber.initials || editingBarber.name.substring(0, 2).toUpperCase(),
        experience: editingBarber.experience,
        rating: editingBarber.rating,
        review_count: editingBarber.reviewCount,
        specialties: editingBarber.specialties,
        bio: editingBarber.bio,
        rates: editingBarber.rates,
        is_popular: !!editingBarber.isPopular,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("barbers").upsert(payload);
      if (error) throw error;

      showToast(`Barber "${editingBarber.name}" saved successfully!`);
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
      const { error } = await supabase.from("barbers").delete().eq("id", id);
      if (error) throw error;
      showToast(`Barber "${name}" deleted.`);
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete barber";
      showToast(msg, "error");
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
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      // Insert gallery row into Supabase
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
        active: true,
      };

      const { error: dbError } = await supabase.from("gallery_items").insert(mediaItem);
      if (dbError) throw dbError;

      showToast(`Uploaded ${isVideo ? "video" : "photo"} to gallery successfully!`);
      setNewGalleryTitle("");
      if (galleryFileInputRef.current) galleryFileInputRef.current.value = "";
      loadAllData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload error";
      showToast(msg, "error");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from the gallery?`)) return;

    try {
      const { error } = await supabase.from("gallery_items").delete().eq("id", id);
      if (error) throw error;
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
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    try {
      const payload = {
        id: editingService.id,
        name: editingService.name,
        category: editingService.category,
        price: editingService.price,
        numeric_price: editingService.numeric_price,
        description: editingService.description,
        duration: editingService.duration,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("services").upsert(payload);
      if (error) throw error;

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
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
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
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

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

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0E1411]/95 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C59B46] to-[#DFC074] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0E1411] rounded-[10px] flex items-center justify-center text-[#C59B46]">
                <Scissors className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-[#F5EFEB]">R.B Makeover</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C59B46]/10 border border-[#C59B46]/30 text-[#C59B46]">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-[#7A756B] hidden sm:block">Logged in as {user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#DFC074] transition-colors"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-red-950/30 border border-red-500/20 hover:border-red-500/50 text-xs text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 border-t border-white/[0.04] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("barbers")}
            className={`py-3 sm:py-3.5 px-3 sm:px-5 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "barbers"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Barbers &amp; Team ({barbers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`py-3 sm:py-3.5 px-3 sm:px-5 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
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
            className={`py-3 sm:py-3.5 px-3 sm:px-5 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "services"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Services &amp; Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab("siteImages")}
            className={`py-3 sm:py-3.5 px-3 sm:px-5 font-mono text-xs uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "siteImages"
                ? "border-[#C59B46] text-[#DFC074] font-bold"
                : "border-transparent text-[#7A756B] hover:text-[#F5EFEB]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Website Key Photos</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all"
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
                        <div className="w-12 h-12 rounded-xl bg-[#141C18] border border-[#C59B46]/40 flex items-center justify-center text-[#DFC074] font-serif font-bold text-lg">
                          {barber.initials}
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
                      className="flex-1 py-2 px-3 rounded-lg bg-white/[0.05] hover:bg-[#C59B46]/20 border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#F5EFEB] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#C59B46]" />
                      <span>Edit Barber</span>
                    </button>
                    <button
                      onClick={() => handleDeleteBarber(barber.id, barber.name)}
                      className="py-2 px-3 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 text-xs text-red-400 flex items-center justify-center transition-colors"
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
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#F5EFEB]">Gallery Media (Images &amp; Videos)</h2>
                <p className="text-xs text-[#7A756B] mt-1">
                  Upload new photos or MP4/WebM videos directly into the public salon gallery.
                </p>
              </div>
            </div>

            {/* Upload Box */}
            <div className="bg-[#0E1411] border border-dashed border-[#C59B46]/40 rounded-2xl p-6 sm:p-8 mb-8 text-center relative">
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
                <div className="w-14 h-14 rounded-2xl bg-[#141C18] border border-[#C59B46]/30 flex items-center justify-center text-[#C59B46] mx-auto">
                  {uploadingGallery ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-[#C59B46]" />
                  ) : (
                    <Upload className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#F5EFEB]">
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
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#7A756B] mb-1">
                      Category
                    </label>
                    <select
                      value={newGalleryCategory}
                      onChange={(e) => setNewGalleryCategory(e.target.value)}
                      className="w-full bg-[#141C18] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                    >
                      <option value="Interiors">Interiors</option>
                      <option value="Styling">Styling</option>
                      <option value="Haircuts">Haircuts</option>
                      <option value="Beard">Beard</option>
                      <option value="Storefront">Storefront</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8A29E]">
                    <input
                      type="checkbox"
                      checked={newGalleryFeatured}
                      onChange={(e) => setNewGalleryFeatured(e.target.checked)}
                      className="rounded accent-[#C59B46]"
                    />
                    <span>Featured (spans 2 columns)</span>
                  </label>

                  <label
                    htmlFor="gallery-file-upload"
                    className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all ${
                      uploadingGallery ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Select File to Upload</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Gallery Media Grid */}
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
                        className="p-1 rounded bg-red-950/30 hover:bg-red-950/60 text-red-400 border border-red-500/20 text-xs transition-colors"
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
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            <div className="bg-[#0E1411] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
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
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(svc.id, svc.name)}
                            className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-950/50 border border-red-500/20 text-red-400 transition-colors"
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
        {/* TAB 4: WEBSITE KEY PHOTOS                                 */}
        {/* ========================================================= */}
        {activeTab === "siteImages" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-serif text-[#F5EFEB]">Website Key Showcase Images</h2>
              <p className="text-xs text-[#7A756B] mt-1">
                Fulfilling client requirement: update any photo across the website directly without writing code.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Hero Master Barber */}
              <div className="bg-[#0E1411] border border-white/[0.08] hover:border-[#C59B46]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#141C18] border border-white/[0.08] relative mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteImages.hero_barber || "/images/master-barber-cutout.webp"}
                      alt="Hero master barber"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono uppercase text-[#DFC074] border border-[#C59B46]/30">
                      Hero Cutout
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-[#F5EFEB]">Hero Section Barber Cutout</h3>
                  <p className="text-xs text-[#7A756B] mt-1">
                    The cutout portrait displayed below the Explore Services button on mobile and on desktop hero.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-[#C59B46]/20 border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#DFC074] flex items-center justify-center gap-2 transition-all">
                    {uploadingKey === "hero_barber" ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C59B46]" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingKey === "hero_barber" ? "Uploading..." : "Replace Hero Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleSiteImageUpload("hero_barber", f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 2. About Salon Floor */}
              <div className="bg-[#0E1411] border border-white/[0.08] hover:border-[#C59B46]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#141C18] border border-white/[0.08] relative mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteImages.about_salon || "/images/about-interior-floor.webp"}
                      alt="About salon floor"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono uppercase text-[#DFC074] border border-[#C59B46]/30">
                      About Story
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-[#F5EFEB]">About Section Interior Floor</h3>
                  <p className="text-xs text-[#7A756B] mt-1">
                    The large salon floor styling stations photo in the &quot;Story of R.B Makeover&quot; section.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-[#C59B46]/20 border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#DFC074] flex items-center justify-center gap-2 transition-all">
                    {uploadingKey === "about_salon" ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C59B46]" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingKey === "about_salon" ? "Uploading..." : "Replace About Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleSiteImageUpload("about_salon", f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* 3. Precision Model */}
              <div className="bg-[#0E1411] border border-white/[0.08] hover:border-[#C59B46]/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-[#141C18] border border-white/[0.08] relative mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteImages.precision_center || "/images/razor-drop-fade-v2.webp"}
                      alt="Precision section center model"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono uppercase text-[#DFC074] border border-[#C59B46]/30">
                      Precision Cutout
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm text-[#F5EFEB]">Precision Craftsmanship Model</h3>
                  <p className="text-xs text-[#7A756B] mt-1">
                    The razor drop fade model portrait showcased in the craftsmanship section.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06]">
                  <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-[#C59B46]/20 border border-white/[0.08] hover:border-[#C59B46]/40 text-xs text-[#DFC074] flex items-center justify-center gap-2 transition-all">
                    {uploadingKey === "precision_center" ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C59B46]" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploadingKey === "precision_center" ? "Uploading..." : "Replace Precision Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleSiteImageUpload("precision_center", f);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL: EDIT / ADD BARBER                                  */}
      {/* ========================================================= */}
      {editingBarber && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0E1411] border border-white/[0.1] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <h3 className="text-lg font-serif font-bold text-[#F5EFEB]">
                {isNewBarber ? "Add New Barber" : `Edit ${editingBarber.name}`}
              </h3>
              <button
                onClick={() => setEditingBarber(null)}
                className="p-1 rounded-lg text-[#7A756B] hover:text-[#F5EFEB] hover:bg-white/[0.05]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBarber} className="space-y-4">
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
                <label className="block text-xs uppercase font-mono text-[#DFC074] mb-2 font-bold">
                  Individual Barber Rates (Rs.)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#141C18] p-4 rounded-xl border border-white/[0.06]">
                  <div>
                    <label className="block text-[11px] text-[#7A756B] mb-1">Haircut</label>
                    <input
                      type="number"
                      value={editingBarber.rates.haircut}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          rates: { ...editingBarber.rates, haircut: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-[#0E1411] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-[#DFC074] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7A756B] mb-1">Beard Trim</label>
                    <input
                      type="number"
                      value={editingBarber.rates.beard}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          rates: { ...editingBarber.rates, beard: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-[#0E1411] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-[#DFC074] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7A756B] mb-1">Hair + Beard</label>
                    <input
                      type="number"
                      value={editingBarber.rates.hairAndBeard}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          rates: { ...editingBarber.rates, hairAndBeard: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-[#0E1411] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-[#DFC074] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7A756B] mb-1">Facial</label>
                    <input
                      type="number"
                      value={editingBarber.rates.facial}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          rates: { ...editingBarber.rates, facial: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-[#0E1411] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-[#DFC074] font-mono outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#7A756B] mb-1">VIP Package</label>
                    <input
                      type="number"
                      value={editingBarber.rates.groomingPackage}
                      onChange={(e) =>
                        setEditingBarber({
                          ...editingBarber,
                          rates: { ...editingBarber.rates, groomingPackage: Number(e.target.value) },
                        })
                      }
                      className="w-full bg-[#0E1411] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-xs text-[#DFC074] font-mono outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8A29E]">
                  <input
                    type="checkbox"
                    checked={editingBarber.isPopular}
                    onChange={(e) =>
                      setEditingBarber({ ...editingBarber, isPopular: e.target.checked })
                    }
                    className="rounded accent-[#C59B46]"
                  />
                  <span>Mark as Most Requested / Popular</span>
                </label>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingBarber(null)}
                    className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs text-[#7A756B] hover:text-[#F5EFEB]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(197,155,70,0.3)]"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E1411] border border-white/[0.1] rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <h3 className="text-lg font-serif font-bold text-[#F5EFEB]">
                {isNewService ? "Add New Service" : `Edit ${editingService.name}`}
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="p-1 rounded-lg text-[#7A756B] hover:text-[#F5EFEB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
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
                    Price (Display)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({ ...editingService, price: e.target.value })
                    }
                    placeholder="Rs. 1,000"
                    className="w-full bg-[#141C18] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs text-[#F5EFEB] focus:border-[#C59B46] outline-none"
                  />
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] text-xs text-[#7A756B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C59B46] to-[#DFC074] text-black font-semibold text-xs tracking-wider uppercase"
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
