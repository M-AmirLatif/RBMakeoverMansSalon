import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. SIGNED URL DIRECT UPLOAD (Bypasses serverless 4.5MB payload limit, supports files up to 50MB)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { fileName, fileSize } = body;

      if (!fileName) {
        return NextResponse.json({ error: "No fileName provided" }, { status: 400 });
      }

      const MAX_SIZE = 50 * 1024 * 1024; // 50MB
      if (fileSize && fileSize > MAX_SIZE) {
        return NextResponse.json(
          { error: "File exceeds 50MB size limit" },
          { status: 400 }
        );
      }

      const supabase = createAdminClient();
      const extension = fileName.split(".").pop()?.toLowerCase() || "jpg";
      const timestamp = Date.now();
      const cleanName = fileName
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const storagePath = `uploads/${timestamp}_${cleanName}.${extension}`;

      const { data, error: signError } = await supabase.storage
        .from("salon-media")
        .createSignedUploadUrl(storagePath);

      if (signError || !data) {
        console.error("Signed URL creation error:", signError);
        return NextResponse.json(
          { error: signError?.message || "Failed to generate signed upload URL" },
          { status: 500 }
        );
      }

      const { data: publicData } = supabase.storage
        .from("salon-media")
        .getPublicUrl(storagePath);

      return NextResponse.json({
        success: true,
        path: storagePath,
        token: data.token,
        signedUrl: data.signedUrl,
        url: publicData.publicUrl,
      });
    }

    // 2. FALLBACK MULTIPART FORM-DATA (For smaller files)
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
