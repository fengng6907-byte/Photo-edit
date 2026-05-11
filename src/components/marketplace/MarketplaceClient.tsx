"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Search, Star, Download, Heart, Sparkles, TrendingUp, Crown, Filter } from "lucide-react";

type Category = "all" | "portrait" | "cinematic" | "travel" | "social_media" | "retro" | "gaming" | "luxury" | "wedding";

const CATEGORIES: { id: Category; label: string; emoji: string; count: number }[] = [
  { id: "all", label: "All Filters", emoji: "✨", count: 247 },
  { id: "portrait", label: "Portrait", emoji: "👤", count: 42 },
  { id: "cinematic", label: "Cinematic", emoji: "🎬", count: 38 },
  { id: "travel", label: "Travel", emoji: "✈️", count: 35 },
  { id: "social_media", label: "Social Media", emoji: "📱", count: 28 },
  { id: "retro", label: "Retro", emoji: "🎞️", count: 24 },
  { id: "gaming", label: "Gaming", emoji: "🎮", count: 20 },
  { id: "luxury", label: "Luxury", emoji: "💎", count: 18 },
  { id: "wedding", label: "Wedding", emoji: "💍", count: 22 },
];

const SORT_OPTIONS = ["Most Popular", "Newest", "Highest Rated", "Most Downloaded"];

const FILTERS_DATA = [
  { id: 1, name: "Hollywood Gold", category: "cinematic" as Category, emoji: "🎬", rating: 4.9, downloads: 15420, isPremium: false, tags: ["cinematic", "warm", "professional"], description: "Hollywood-grade color grading with warm tones" },
  { id: 2, name: "Soft Korean", category: "portrait" as Category, emoji: "✨", rating: 4.8, downloads: 12350, isPremium: false, tags: ["portrait", "soft", "beauty"], description: "Popular Korean beauty filter with soft, luminous skin tones" },
  { id: 3, name: "Bali Sunset", category: "travel" as Category, emoji: "🌴", rating: 4.9, downloads: 10890, isPremium: false, tags: ["travel", "warm", "golden"], description: "Capture the magic of tropical sunsets" },
  { id: 4, name: "Cyberpunk 2077", category: "gaming" as Category, emoji: "🤖", rating: 4.7, downloads: 9820, isPremium: true, tags: ["neon", "dark", "futuristic"], description: "Neon-lit cyberpunk aesthetic" },
  { id: 5, name: "Black Gold Luxury", category: "luxury" as Category, emoji: "💎", rating: 5.0, downloads: 8740, isPremium: true, tags: ["luxury", "dark", "gold"], description: "High-contrast luxury lifestyle aesthetic" },
  { id: 6, name: "Tokyo Nights", category: "travel" as Category, emoji: "🌃", rating: 4.8, downloads: 11230, isPremium: false, tags: ["city", "night", "neon"], description: "Vibrant Japanese city lights at night" },
  { id: 7, name: "VHS Glitch", category: "retro" as Category, emoji: "📼", rating: 4.6, downloads: 7650, isPremium: false, tags: ["retro", "glitch", "vintage"], description: "Authentic VHS tape effect with glitch artifacts" },
  { id: 8, name: "TikTok Viral", category: "social_media" as Category, emoji: "📱", rating: 4.9, downloads: 18920, isPremium: false, tags: ["social", "bright", "trendy"], description: "The most viral TikTok aesthetic filter" },
  { id: 9, name: "Santorini Blue", category: "travel" as Category, emoji: "🏛️", rating: 4.8, downloads: 9340, isPremium: false, tags: ["travel", "blue", "mediterranean"], description: "Mediterranean island vibes" },
  { id: 10, name: "Golden Wedding", category: "wedding" as Category, emoji: "💍", rating: 5.0, downloads: 6230, isPremium: true, tags: ["wedding", "romantic", "warm"], description: "Perfect for wedding photography" },
  { id: 11, name: "Neon RGB", category: "gaming" as Category, emoji: "🌈", rating: 4.7, downloads: 8120, isPremium: false, tags: ["gaming", "neon", "rgb"], description: "Vibrant gaming setup aesthetic" },
  { id: 12, name: "Film Noir", category: "cinematic" as Category, emoji: "🎭", rating: 4.8, downloads: 7890, isPremium: true, tags: ["dark", "noir", "dramatic"], description: "Classic film noir with deep shadows" },
  { id: 13, name: "Instagram Peach", category: "social_media" as Category, emoji: "🍑", rating: 4.7, downloads: 14200, isPremium: false, tags: ["social", "peach", "lifestyle"], description: "Warm peachy Instagram aesthetic" },
  { id: 14, name: "Monaco Rich", category: "luxury" as Category, emoji: "🏎️", rating: 4.9, downloads: 5890, isPremium: true, tags: ["luxury", "european", "rich"], description: "European luxury lifestyle filter" },
  { id: 15, name: "Disposable Camera", category: "retro" as Category, emoji: "📷", rating: 4.8, downloads: 12780, isPremium: false, tags: ["retro", "candid", "film"], description: "Authentic disposable camera look" },
  { id: 16, name: "Beauty Pro", category: "portrait" as Category, emoji: "💄", rating: 4.9, downloads: 16340, isPremium: true, tags: ["portrait", "beauty", "professional"], description: "Professional beauty retouching filter" },
];

export function MarketplaceClient() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [hoveredFilter, setHoveredFilter] = useState<number | null>(null);

  const filtered = FILTERS_DATA.filter((f) => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.tags.some(t => t.includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Most Popular") return b.downloads - a.downloads;
    if (sortBy === "Highest Rated") return b.rating - a.rating;
    if (sortBy === "Most Downloaded") return b.downloads - a.downloads;
    return 0;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-16">
        {/* Hero */}
        <div className="relative bg-gradient-to-b from-[#0d0a30] to-[#0a0828] border-b border-white/10">
          <div className="orb orb-purple absolute -top-20 left-1/4 w-[400px] h-[300px] opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
            <div className="text-center mb-8">
              <Badge variant="purple" className="mb-4">
                <Sparkles size={11} className="mr-1" /> 247+ Premium Filters
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
                Filter Marketplace
              </h1>
              <p className="text-white/50 text-lg max-w-xl mx-auto">
                Discover and apply professional AI-powered filters. From cinematic to luxury — elevate your content instantly.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <Input
                placeholder="Search filters, styles, moods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={15} />}
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left sidebar - categories */}
            <aside className="lg:w-56 shrink-0">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all",
                      activeCategory === cat.id
                        ? "bg-brand-500/20 text-brand-300 border border-brand-500/20"
                        : "text-white/50 hover:text-white hover:bg-white/8"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </div>
                    <span className="text-xs text-white/25">{cat.count}</span>
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 glass rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Trending Now</h4>
                {[
                  { name: "TikTok Viral", icon: <TrendingUp size={12} /> },
                  { name: "Hollywood Gold", icon: <TrendingUp size={12} /> },
                  { name: "Beauty Pro", icon: <TrendingUp size={12} /> },
                ].map((t) => (
                  <div key={t.name} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="text-brand-400">{t.icon}</span>
                    {t.name}
                  </div>
                ))}
              </div>
            </aside>

            {/* Main grid */}
            <div className="flex-1">
              {/* Sort / Filter bar */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-white/40">
                  <span className="text-white font-medium">{sorted.length}</span> filters
                </p>
                <div className="flex items-center gap-2">
                  <Filter size={13} className="text-white/30" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:border-brand-500/50"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-[#0d0a30]">{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sorted.map((filter) => (
                  <div
                    key={filter.id}
                    className="filter-card glass rounded-2xl overflow-hidden group cursor-pointer"
                    onMouseEnter={() => setHoveredFilter(filter.id)}
                    onMouseLeave={() => setHoveredFilter(null)}
                  >
                    {/* Preview */}
                    <div className="aspect-square relative bg-gradient-to-br from-brand-900/50 via-purple-900/30 to-blue-900/50 flex items-center justify-center overflow-hidden">
                      <span className="text-5xl transition-transform duration-300 group-hover:scale-110">
                        {filter.emoji}
                      </span>
                      {filter.isPremium && (
                        <div className="absolute top-2 left-2">
                          <div className="flex items-center gap-1 bg-amber-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Crown size={9} />
                            PRO
                          </div>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className={cn(
                        "absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 transition-opacity duration-200",
                        hoveredFilter === filter.id ? "opacity-100" : "opacity-0"
                      )}>
                        <Link href={`/editor?filter=${filter.id}`}>
                          <Button size="xs" icon={<Sparkles size={11} />}>Apply Filter</Button>
                        </Link>
                        <p className="text-xs text-white/60 text-center px-3 leading-snug">{filter.description}</p>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(filter.id); }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                      >
                        <Heart
                          size={13}
                          className={favorites.has(filter.id) ? "text-pink-400 fill-pink-400" : "text-white/60"}
                        />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-white truncate mb-1">{filter.name}</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs text-white/50">{filter.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/30">
                          <Download size={11} />
                          <span className="text-xs">{(filter.downloads / 1000).toFixed(1)}k</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {filter.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-white/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {sorted.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-white/50">No filters found for &ldquo;{search}&rdquo;</p>
                  <button onClick={() => setSearch("")} className="mt-3 text-brand-400 text-sm hover:text-brand-300">
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
