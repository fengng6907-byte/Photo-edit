import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { VibeGallery } from "@/components/landing/VibeGallery";
import { StudioSection } from "@/components/landing/StudioSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VibeLens — Film the Vibe. AI Does the Rest.",
  description:
    "Transform your photos with Fujifilm and CCD analog AI styles. One click. Instant film vibes. 10 free credits on signup.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <div id="vibe-gallery">
          <VibeGallery />
        </div>
        <StudioSection />
      </main>
      <Footer />
    </>
  );
}
