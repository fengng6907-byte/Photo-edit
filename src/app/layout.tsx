import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VibeLens — Film the Vibe. AI Does the Rest.",
    template: "%s | VibeLens",
  },
  description:
    "Transform your photos with Fujifilm and CCD analog AI styles. One click. Instant film vibes.",
  keywords: [
    "AI photo editor",
    "Fujifilm filter",
    "CCD aesthetic",
    "analog photo AI",
    "film photography AI",
    "photo style transfer",
    "VibeLens",
  ],
  authors: [{ name: "VibeLens" }],
  creator: "VibeLens",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "VibeLens — Film the Vibe. AI Does the Rest.",
    description:
      "Transform your photos with Fujifilm and CCD analog AI styles.",
    siteName: "VibeLens",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeLens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeLens — Film the Vibe. AI Does the Rest.",
    description:
      "Transform your photos with Fujifilm and CCD analog AI styles.",
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
  themeColor: "#0d0d0d",
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
      <body className="min-h-screen bg-[#0d0d0d] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
