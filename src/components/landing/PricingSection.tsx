"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types";

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out PrismFlow AI",
    monthlyPrice: 0,
    yearlyPrice: 0,
    credits: 10,
    storageGB: 1,
    features: [
      "10 AI credits/month",
      "1 GB storage",
      "Basic filters (20+)",
      "Image editing",
      "480p video export",
      "Watermarked exports",
      "Community support",
    ],
  },
  {
    id: "creator",
    name: "Creator",
    description: "For serious content creators",
    monthlyPrice: 12,
    yearlyPrice: 96,
    credits: 100,
    storageGB: 10,
    features: [
      "100 AI credits/month",
      "10 GB storage",
      "All filters (100+)",
      "Photo & video editing",
      "1080p video export",
      "No watermarks",
      "Priority support",
      "Custom presets",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professional creators & studios",
    monthlyPrice: 29,
    yearlyPrice: 228,
    credits: 500,
    storageGB: 50,
    isPopular: true,
    features: [
      "500 AI credits/month",
      "50 GB storage",
      "All filters + premium",
      "Advanced video editor",
      "4K video export",
      "No watermarks",
      "API access",
      "Priority processing",
      "Team collaboration",
      "Advanced analytics",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    description: "For agencies and large teams",
    monthlyPrice: 79,
    yearlyPrice: 636,
    credits: 2000,
    storageGB: 200,
    features: [
      "2000 AI credits/month",
      "200 GB storage",
      "Everything in Pro",
      "Unlimited team members",
      "White-label exports",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Admin dashboard",
      "Custom AI training",
    ],
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="orb orb-blue absolute -left-40 bottom-0 w-[400px] h-[400px] opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="purple" className="mb-4">Pricing</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg mb-8">
            Start free. Upgrade when you need more power.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                !annual ? "bg-brand-500 text-white shadow-glow" : "text-white/50 hover:text-white"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                annual ? "bg-brand-500 text-white shadow-glow" : "text-white/50 hover:text-white"
              )}
            >
              Annual
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md">-33%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-6 flex flex-col transition-all duration-300",
                plan.isPopular
                  ? "gradient-border shadow-glow bg-gradient-to-b from-brand-600/10 to-transparent"
                  : "glass"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-glow">
                    <Sparkles size={11} />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-white/40">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">
                    ${annual ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </span>
                  <span className="text-white/40 text-sm">/mo</span>
                </div>
                {annual && plan.yearlyPrice > 0 && (
                  <div className="text-xs text-white/40 mt-0.5">
                    ${plan.yearlyPrice}/year
                  </div>
                )}
              </div>

              <div className="space-y-1.5 flex-1 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={plan.id === "free" ? "/register" : `/register?plan=${plan.id}`}>
                <Button
                  variant={plan.isPopular ? "primary" : "secondary"}
                  className="w-full"
                  icon={plan.isPopular ? <Zap size={14} /> : undefined}
                >
                  {plan.id === "free" ? "Get Started Free" : `Start ${plan.name}`}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="mt-8 glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Need a custom plan?</h3>
            <p className="text-sm text-white/50">Contact us for enterprise pricing with custom credits, SLA, and dedicated support.</p>
          </div>
          <Button variant="outline" size="lg">Contact Sales</Button>
        </div>
      </div>
    </section>
  );
}
