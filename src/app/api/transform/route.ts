export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transformImage, type StyleKey } from "@/lib/fal";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse and validate request body
  let imageUrl: string;
  let style: StyleKey;
  try {
    const body = await request.json();
    imageUrl = body.imageUrl;
    style = body.style ?? "fujifilm";
    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }
    if (!["fujifilm", "ccd"].includes(style)) {
      return NextResponse.json({ error: "style must be 'fujifilm' or 'ccd'" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // 3. Atomic credit deduction — returns false if balance is 0
  const { data: deducted, error: deductError } = await supabase.rpc("deduct_credit", {
    p_user_id: user.id,
  });

  if (deductError) {
    console.error("Credit deduction error:", deductError);
    return NextResponse.json({ error: "Failed to check credits" }, { status: 500 });
  }

  if (!deducted) {
    return NextResponse.json(
      { error: "Insufficient credits. Please upgrade to continue." },
      { status: 402 }
    );
  }

  // 4. Insert pending transformation record
  const { data: transformation, error: insertError } = await supabase
    .from("transformations")
    .insert({
      user_id: user.id,
      original_url: imageUrl,
      style,
      status: "processing",
      credits_used: 1,
    })
    .select("id")
    .single();

  if (insertError || !transformation) {
    // Refund: credit was deducted but we can't create the record
    await supabase.rpc("refund_credit", { p_user_id: user.id });
    return NextResponse.json({ error: "Failed to create transformation record" }, { status: 500 });
  }

  // 5. Call Fal.ai
  try {
    const result = await transformImage(imageUrl, style);

    await supabase
      .from("transformations")
      .update({
        transformed_url: result.imageUrl,
        status: "completed",
        fal_request_id: result.requestId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", transformation.id);

    return NextResponse.json({
      transformedUrl: result.imageUrl,
      transformationId: transformation.id,
      style,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transform failed";
    console.error("Fal.ai transform error:", message);

    // Mark as failed and refund the credit
    await Promise.all([
      supabase
        .from("transformations")
        .update({ status: "failed", error: message, updated_at: new Date().toISOString() })
        .eq("id", transformation.id),
      supabase.rpc("refund_credit", { p_user_id: user.id }),
    ]);

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
