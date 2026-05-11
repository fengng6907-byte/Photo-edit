import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CREDIT_COSTS: Record<string, number> = {
  background_removal: 1,
  upscale: 2,
  face_enhance: 2,
  color_grade: 1,
  enhance: 1,
  noise_removal: 1,
  stabilize: 3,
  subtitle_generation: 3,
  slow_motion: 4,
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { jobType, inputUrl, settings } = body;

    if (!jobType || !inputUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const creditCost = CREDIT_COSTS[jobType] ?? 1;

    // Check credits
    const { data: profile } = await supabase
      .from("users")
      .select("credits_remaining")
      .eq("id", user.id)
      .single();

    if (!profile || profile.credits_remaining < creditCost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Create AI job record
    const { data: job, error: jobError } = await supabase
      .from("ai_jobs")
      .insert({
        user_id: user.id,
        job_type: jobType,
        status: "queued",
        input_url: inputUrl,
        settings: settings ?? {},
      })
      .select()
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }

    // Deduct credits
    await supabase
      .from("users")
      .update({ credits_remaining: profile.credits_remaining - creditCost })
      .eq("id", user.id);

    // In production: dispatch to queue (e.g., Upstash, BullMQ, AWS SQS)
    // For now, mark as processing and simulate
    await supabase
      .from("ai_jobs")
      .update({ status: "processing" })
      .eq("id", job.id);

    return NextResponse.json({ jobId: job.id, status: "processing" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    const { data: job } = await supabase
      .from("ai_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
