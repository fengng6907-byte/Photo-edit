import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative gradient-border rounded-3xl p-12 sm:p-16">
          {/* Glowing bg */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="orb orb-purple absolute -top-20 -left-20 w-[300px] h-[300px] opacity-40" />
            <div className="orb orb-blue absolute -bottom-20 -right-20 w-[300px] h-[300px] opacity-30" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm mb-8">
              <Sparkles size={14} className="text-brand-400" />
              <span className="text-white/70">No credit card required</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6">
              Start Creating<br />
              <span className="gradient-text">For Free Today</span>
            </h2>

            <p className="text-lg text-white/50 mb-10 max-w-xl mx-auto">
              Join 50,000+ creators who are already using PrismFlow AI to produce
              stunning, professional-quality content in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" icon={<Sparkles size={18} />} className="neon-glow">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="glass" size="xl" icon={<ArrowRight size={16} />} iconPosition="right">
                  Explore Features
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
              <span>✓ Free forever plan</span>
              <span>✓ No credit card needed</span>
              <span>✓ Cancel anytime</span>
              <span>✓ 10 AI credits/month free</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
