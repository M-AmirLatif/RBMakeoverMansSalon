import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit size to 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 50MB size limit" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Sanitize filename and create unique path
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .toLowerCase();
    const storagePath = `uploads/${timestamp}_${cleanName}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("salon-media")
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: publicData } = supabase.storage
      .from("salon-media")
      .getPublicUrl(storagePath);

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: storagePath,
      fileName: file.name,
      fileSize: file.size,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
