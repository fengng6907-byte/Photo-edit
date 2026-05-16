import { Metadata } from "next";
import { StudioClient } from "./StudioClient";

export const metadata: Metadata = {
  title: "Studio — VibeLens",
  description: "Transform your photos with Fujifilm and CCD AI styles.",
};

export default function StudioPage() {
  return <StudioClient />;
}
