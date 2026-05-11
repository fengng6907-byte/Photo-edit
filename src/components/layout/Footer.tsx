import Link from "next/link";
import { Sparkles, Twitter, Github, Instagram, Youtube, Linkedin } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Photo Editor", href: "/editor" },
    { label: "Video Studio", href: "/video-studio" },
    { label: "Filter Marketplace", href: "/marketplace" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api-docs" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
  ],
};

const socials = [
  { icon: <Twitter size={16} />, href: "#", label: "Twitter" },
  { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
  { icon: <Youtube size={16} />, href: "#", label: "YouTube" },
  { icon: <Github size={16} />, href: "#", label: "GitHub" },
  { icon: <Linkedin size={16} />, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08061f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 flex items-center justify-center shadow-glow">
                <Sparkles size={17} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">PrismFlow AI</span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-4">
              The most powerful AI-driven photo and video editing platform for creators, professionals, and studios.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} PrismFlow AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/30">
            <span>Built with</span>
            <span className="text-red-400">♥</span>
            <span>using Next.js, Supabase, and AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
