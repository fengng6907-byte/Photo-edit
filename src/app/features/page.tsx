import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore all AI-powered features of PrismFlow AI — photo editing, video editing, filters, and more.",
};

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <div className="text-center pt-16 pb-4">
          <h1 className="text-5xl font-black text-white mb-4">All Features</h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Everything you need to create stunning photos and videos with the power of AI.
          </p>
        </div>
        <FeaturesSection />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}
