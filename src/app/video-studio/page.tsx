import type { Metadata } from "next";
import { VideoStudioClient } from "@/components/video/VideoStudioClient";

export const metadata: Metadata = { title: "AI Video Studio" };

export default function VideoStudioPage() {
  return <VideoStudioClient />;
}
