import { Badge } from "@/components/ui/Badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Fashion Photographer",
    avatar: "SC",
    color: "#6047f5",
    rating: 5,
    text: "PrismFlow AI transformed my workflow completely. Background removal and skin retouching that used to take 30 minutes now takes 10 seconds. Absolutely game-changing.",
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator, 2M followers",
    avatar: "MR",
    color: "#ec4899",
    rating: 5,
    text: "The cinematic filters are incredible. My TikTok and Instagram engagement shot up 40% after switching to PrismFlow. The AI just understands aesthetics.",
  },
  {
    name: "Yuki Tanaka",
    role: "Wedding Videographer",
    avatar: "YT",
    color: "#10b981",
    rating: 5,
    text: "The video editor with AI color grading is exactly what I needed. Professional-grade LUTs applied automatically, saving me hours per project.",
  },
  {
    name: "Alex Kim",
    role: "Digital Marketing Director",
    avatar: "AK",
    color: "#00d4ff",
    rating: 5,
    text: "Our team uses PrismFlow AI for all social media content. The batch processing and consistent style application across hundreds of images is unmatched.",
  },
  {
    name: "Isabella Martinez",
    role: "Travel Blogger",
    avatar: "IM",
    color: "#f59e0b",
    rating: 5,
    text: "The travel presets are literally perfect. Santorini, Tokyo Night, Bali Sunset — each one transforms my photos into magazine-worthy shots instantly.",
  },
  {
    name: "David Park",
    role: "Studio Owner",
    avatar: "DP",
    color: "#8b5cf6",
    rating: 5,
    text: "Running a photography studio means speed matters. PrismFlow's AI upscaling and batch editing cut our post-production time by 60%. ROI was immediate.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="orb orb-pink absolute right-0 top-1/2 w-[300px] h-[300px] opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4">Testimonials</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Loved by Creators Worldwide
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-lg">
            Join 50,000+ photographers, videographers, and content creators who trust PrismFlow AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.name} className="glass glass-hover rounded-2xl p-6 flex flex-col">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
                <div className="ml-auto flex">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
