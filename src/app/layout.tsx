import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PrismFlow AI — AI-Powered Photo & Video Editor",
    template: "%s | PrismFlow AI",
  },
  description:
    "Transform your photos and videos with cutting-edge AI. Professional cinematic filters, AI enhancement, background removal, upscaling, and more.",
  keywords: [
    "AI photo editor",
    "AI video editor",
    "cinematic filters",
    "background removal",
    "image upscaling",
    "video enhancement",
    "photo editing",
    "PrismFlow AI",
  ],
  authors: [{ name: "PrismFlow AI" }],
  creator: "PrismFlow AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "PrismFlow AI — AI-Powered Photo & Video Editor",
    description:
      "Transform your photos and videos with cutting-edge AI technology.",
    siteName: "PrismFlow AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrismFlow AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrismFlow AI — AI-Powered Photo & Video Editor",
    description:
      "Transform your photos and videos with cutting-edge AI technology.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0a0828",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0a0828] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
