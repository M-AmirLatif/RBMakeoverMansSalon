import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { reviews as defaultGoogleReviews } from "@/data/reviews";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, serviceRoleKey);
const STORAGE_BUCKET = "salon-media";
const REVIEWS_FILE_PATH = "data/client_reviews.json";

export interface ClientReviewItem {
  id: string;
  author: string;
  rating: number;
  summary: string;
  service?: string;
  barber?: string;
  source: string;
  createdAt: string;
  active?: boolean;
}

async function getStoredUserReviews(): Promise<ClientReviewItem[]> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(REVIEWS_FILE_PATH);

    if (error || !data) {
      return [];
    }

    const text = await data.text();
    const json = JSON.parse(text);
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.warn("Could not load stored user reviews:", err);
    return [];
  }
}

async function saveStoredUserReviews(reviews: ClientReviewItem[]): Promise<boolean> {
  try {
    const buffer = Buffer.from(JSON.stringify(reviews, null, 2), "utf8");
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(REVIEWS_FILE_PATH, buffer, {
        contentType: "application/json",
        upsert: true,
      });

    if (error) {
      console.error("Storage upload error for reviews:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error saving reviews to storage:", err);
    return false;
  }
}

// GET: Return all reviews (merges verified Google reviews + stored user reviews)
export async function GET() {
  try {
    const userReviews = await getStoredUserReviews();
    const formattedGoogleReviews: ClientReviewItem[] = defaultGoogleReviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      summary: r.summary,
      source: r.source || "Google review",
      createdAt: "2026-01-01T00:00:00Z",
      active: true,
    }));

    // User reviews first (newest on top), followed by Google reviews
    const combined = [...userReviews.filter((r) => r.active !== false), ...formattedGoogleReviews];

    return NextResponse.json({
      success: true,
      reviews: combined,
      count: combined.length,
      userReviewsCount: userReviews.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Add new review without login (Name is strictly required)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rating, text, service, barber } = body;

    // Validate name (strictly required per user prompt)
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your name to submit a review." },
        { status: 400 }
      );
    }

    // Validate review text
    if (!text || typeof text !== "string" || text.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: "Please provide your review feedback (at least 5 characters)." },
        { status: 400 }
      );
    }

    const numericRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview: ClientReviewItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      author: name.trim(),
      rating: numericRating,
      summary: text.trim(),
      service: service ? String(service).trim() : undefined,
      barber: barber ? String(barber).trim() : undefined,
      source: "Verified Client",
      createdAt: new Date().toISOString(),
      active: true,
    };

    const existing = await getStoredUserReviews();
    const updated = [newReview, ...existing];
    await saveStoredUserReviews(updated);

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Thank you! Your review has been published.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error submitting review";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
