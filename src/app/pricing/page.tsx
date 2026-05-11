import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for creators of all levels. Start free, upgrade when you need more.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <div className="text-center pt-16 pb-4">
          <h1 className="text-5xl font-black text-white mb-4">Pricing Plans</h1>
          <p className="text-white/50 text-lg">Start free. Scale as you grow.</p>
        </div>
        <PricingSection />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
