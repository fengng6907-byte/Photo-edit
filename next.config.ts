import type { NextConfig } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const allowedOrigins = ["localhost:3000"];
try {
  const host = new URL(appUrl).host;
  if (host && !allowedOrigins.includes(host)) allowedOrigins.push(host);
} catch {
  // invalid URL, skip
}

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "utfs.io" },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins },
  },
};

export default nextConfig;
