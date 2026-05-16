"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Upload, Zap, Film, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STYLES = [
  {
    id: "fujifilm",
    label: "Fujifilm XT4",
    icon: <Camera size={16} />,
    description: "Warm grain · lifted shadows · analog cinematic",
    color: "from-amber-600/20 to-orange-600/10 border-amber-500/20",
  },
  {
    id: "ccd",
    label: "CCD Digital",
    icon: <Film size={16} />,
    description: "Y2K saturation · digital noise · early 2000s",
    color: "from-sky-600/20 to-indigo-600/10 border-sky-500/20",
  },
];

export function StudioSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("fujifilm");

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="studio">
      <div className="orb orb-dark-crimson absolute left-0 top-0 w-[500px] h-[500px] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-3">
            Studio
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Drop your photo. Pick a vibe.
          </h2>
          <p className="text-white/50 text-lg">
            One transform = 1 credit. 10 free credits on signup.
          </p>
        </div>

        {/* Style selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id)}
              className={cn(
                "flex flex-col items-start gap-2 p-4 rounded-2xl border bg-gradient-to-br transition-all text-left",
                selectedStyle === s.id
                  ? s.color + " shadow-glow"
                  : "from-white/2 to-white/0 border-white/8 hover:border-white/15"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                selectedStyle === s.id ? "bg-brand-500/20 text-brand-400" : "bg-white/6 text-white/40"
              )}>
                {s.icon}
              </div>
              <div>
                <p className={cn("font-semibold text-sm", selectedStyle === s.id ? "text-white" : "text-white/60")}>
                  {s.label}
                </p>
                <p className="text-xs text-white/35 mt-0.5">{s.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "relative rounded-2xl border-2 border-dashed transition-all cursor-pointer",
            isDragActive
              ? "border-brand-500 bg-brand-500/8 dropzone-active"
              : "border-white/12 hover:border-white/25 bg-white/2 hover:bg-white/4"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            {preview ? (
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src={preview}
                  alt="Selected"
                  className="w-full rounded-xl object-cover max-h-56"
                />
                <p className="text-white/40 text-sm mt-3">{selectedFile?.name}</p>
              </div>
            ) : (
              <>
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all",
                  isDragActive ? "bg-brand-500/20" : "bg-white/5"
                )}>
                  <Upload size={28} className={isDragActive ? "text-brand-400" : "text-white/30"} />
                </div>
                <p className="text-white/70 font-medium mb-1">
                  {isDragActive ? "Drop it like it's hot" : "Drag & drop your photo here"}
                </p>
                <p className="text-white/30 text-sm">or click to browse · JPG, PNG, WebP up to 50MB</p>
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          {preview ? (
            <Link href={`/studio?style=${selectedStyle}`} className="w-full sm:w-auto">
              <Button size="lg" icon={<Zap size={16} />} className="w-full sm:w-auto">
                Transform Now · 1 Credit
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" icon={<Zap size={16} />} className="w-full sm:w-auto">
                Get 10 Free Credits
              </Button>
            </Link>
          )}
          <p className="text-white/30 text-sm">No card required · 10 credits free</p>
        </div>
      </div>
    </section>
  );
}
