import Link from "next/link";
import { Camera, Twitter, Github, Instagram } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Studio", href: "/studio" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socials = [
  { icon: <Twitter size={16} />, href: "#", label: "Twitter" },
  { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
  { icon: <Github size={16} />, href: "#", label: "GitHub" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
                <Camera size={15} className="text-white" />
              </div>
              <span className="font-bold text-base gradient-text-crimson">VibeLens</span>
            </Link>
            <p className="text-sm text-white/35 leading-relaxed mb-5 max-w-xs">
              Film the vibe. AI does the rest. Fujifilm warmth and CCD nostalgia in one click.
            </p>
            <div className="flex items-center gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/4 hover:bg-white/8 flex items-center justify-center text-white/35 hover:text-white transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/45 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} VibeLens. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Powered by Fal.ai · Supabase · Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
