import type { Metadata } from "next";
import { PhotoEditorClient } from "@/components/editor/PhotoEditorClient";

export const metadata: Metadata = { title: "AI Photo Editor" };

export default function EditorPage() {
  return <PhotoEditorClient />;
}
