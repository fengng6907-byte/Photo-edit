export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${isImage ? "50" : "500"}MB` }, { status: 400 });
    }

    // Check user storage limit
    const { data: profile } = await supabase
      .from("users")
      .select("storage_used, storage_limit")
      .eq("id", user.id)
      .single();

    const storageUsed = profile?.storage_used ?? 0;
    const storageLimit = (profile?.storage_limit ?? 1) * 1024 * 1024 * 1024;

    if (storageUsed + file.size > storageLimit) {
      return NextResponse.json({ error: "Storage limit exceeded" }, { status: 402 });
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;
    const bucket = isImage ? "images" : "videos";

    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);

    // Record upload in DB
    const { data: upload } = await supabase
      .from("uploads")
      .insert({
        user_id: user.id,
        original_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        media_type: isImage ? "image" : "video",
      })
      .select()
      .single();

    // Update storage used
    await supabase
      .from("users")
      .update({ storage_used: storageUsed + file.size })
      .eq("id", user.id);

    return NextResponse.json({
      uploadId: upload?.id,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mediaType: isImage ? "image" : "video",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
