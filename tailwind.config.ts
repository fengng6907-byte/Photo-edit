import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff0f3",
          100: "#ffe0e6",
          200: "#ffc0cc",
          300: "#ff8fa0",
          400: "#ff4d66",
          500: "#dc143c",
          600: "#b91c2e",
          700: "#951527",
          800: "#7c1421",
          900: "#6b131e",
          950: "#3d050d",
        },
        matte: {
          50: "#f5f5f5",
          100: "#e8e8e8",
          200: "#d0d0d0",
          300: "#a8a8a8",
          400: "#737373",
          500: "#525252",
          600: "#404040",
          700: "#2a2a2a",
          800: "#1a1a1a",
          900: "#111111",
          950: "#0d0d0d",
        },
        crimson: {
          DEFAULT: "#dc143c",
          light: "#ff1744",
          dark: "#8b0000",
          glow: "rgba(220,20,60,0.4)",
        },
        glass: {
          white: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.08)",
          crimson: "rgba(220,20,60,0.08)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0d0d0d 0%, #1a0508 50%, #0d0d0d 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
        "crimson-gradient":
          "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          from: { boxShadow: "0 0 20px rgba(96, 71, 245, 0.3)" },
          to: { boxShadow: "0 0 40px rgba(96, 71, 245, 0.7)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glow: "0 0 30px rgba(220, 20, 60, 0.4)",
        "glow-lg": "0 0 60px rgba(220, 20, 60, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.5)",
        "glass-lg": "0 16px 64px rgba(0, 0, 0, 0.6)",
        crimson: "0 0 20px rgba(220, 20, 60, 0.5)",
        "crimson-lg": "0 0 40px rgba(220, 20, 60, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
