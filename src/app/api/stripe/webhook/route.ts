import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const TIER_CREDITS: Record<string, number> = {
  creator: 100,
  pro: 500,
  studio: 2000,
};

const TIER_STORAGE_GB: Record<string, number> = {
  creator: 10,
  pro: 50,
  studio: 200,
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const priceId = sub.items.data[0]?.price?.id;

      // Determine tier from price ID
      const tier = determineTier(priceId);
      if (!tier) break;

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!user) break;

      await supabase.from("users").update({
        subscription_tier: tier,
        subscription_status: sub.status,
        credits_remaining: TIER_CREDITS[tier],
        storage_limit: TIER_STORAGE_GB[tier],
      }).eq("id", user.id);

      await supabase.from("subscriptions").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        stripe_subscription_id: sub.id,
        tier,
        status: sub.status,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const { data: user } = await supabase
        .from("users")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!user) break;

      await supabase.from("users").update({
        subscription_tier: "free",
        subscription_status: "inactive",
        credits_remaining: 10,
        storage_limit: 1,
      }).eq("id", user.id);
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      const { data: user } = await supabase
        .from("users")
        .select("id, subscription_tier")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!user) break;

      // Refresh monthly credits on successful payment
      const tier = user.subscription_tier ?? "free";
      if (tier !== "free") {
        await supabase.from("users").update({
          credits_remaining: TIER_CREDITS[tier],
        }).eq("id", user.id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function determineTier(priceId: string | undefined): string | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_CREATOR_YEARLY_PRICE_ID) return "creator";
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_PRO_YEARLY_PRICE_ID) return "pro";
  if (priceId === process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID || priceId === process.env.STRIPE_STUDIO_YEARLY_PRICE_ID) return "studio";
  return null;
}
