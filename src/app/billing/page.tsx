import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, CreditCard, Zap, Crown, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Billing" };

const PLANS = [
  {
    id: "free", name: "Free", price: 0, credits: 10, features: ["10 AI credits", "1 GB storage", "Basic filters", "480p export", "Watermarked"]
  },
  {
    id: "creator", name: "Creator", price: 12, credits: 100, popular: false, features: ["100 AI credits", "10 GB storage", "All filters", "1080p export", "No watermark", "Priority support"]
  },
  {
    id: "pro", name: "Pro", price: 29, credits: 500, popular: true, features: ["500 AI credits", "50 GB storage", "Premium filters", "4K export", "API access", "Team collab", "Analytics"]
  },
  {
    id: "studio", name: "Studio", price: 79, credits: 2000, features: ["2000 AI credits", "200 GB storage", "Everything", "White-label", "Custom AI", "Dedicated support", "SLA"]
  },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("subscription_tier, credits_remaining").eq("id", user.id).single();
  const currentTier = profile?.subscription_tier ?? "free";

  return (
    <div className="flex h-screen bg-[#0a0828] overflow-hidden">
      <div className="hidden lg:flex flex-col">
        <Sidebar user={{ name: user.email?.split("@")[0], email: user.email, tier: currentTier, creditsRemaining: profile?.credits_remaining ?? 0 }} />
      </div>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Billing & Plans</h1>
            <p className="text-white/40 text-sm">Manage your subscription and payment methods.</p>
          </div>

          {/* Current plan */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Crown size={20} className="text-brand-400" />
                </div>
                <div>
                  <p className="text-white font-semibold capitalize">{currentTier} Plan</p>
                  <p className="text-sm text-white/40">{profile?.credits_remaining ?? 0} AI credits remaining</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success">Active</Badge>
                {currentTier !== "free" && (
                  <Button variant="danger" size="sm">Cancel Plan</Button>
                )}
              </div>
            </div>
          </div>

          {/* Plans grid */}
          <h2 className="text-lg font-semibold text-white mb-4">Choose a Plan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-5 flex flex-col ${plan.popular ? "gradient-border bg-brand-500/5" : "glass"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-glow">
                      <Zap size={9} /> Popular
                    </div>
                  </div>
                )}
                <div className="mb-3">
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                    <span className="text-white/40 text-sm">/mo</span>
                  </div>
                </div>
                <div className="space-y-1.5 flex-1 mb-4">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span className="text-xs text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
                {currentTier === plan.id ? (
                  <div className="w-full text-center py-2 text-xs text-brand-400 font-semibold">Current Plan</div>
                ) : (
                  <Button
                    variant={plan.popular ? "primary" : "secondary"}
                    size="sm"
                    className="w-full"
                    icon={<ArrowRight size={13} />}
                    iconPosition="right"
                  >
                    {plan.price === 0 ? "Downgrade" : currentTier === "studio" ? "Downgrade" : "Upgrade"}
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Payment method */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Payment Method</h2>
              <Button variant="secondary" size="sm" icon={<CreditCard size={13} />}>Add Card</Button>
            </div>
            <div className="text-center py-8 text-white/30">
              <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No payment method on file</p>
              <p className="text-xs text-white/20 mt-1">Add a card to upgrade your plan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
