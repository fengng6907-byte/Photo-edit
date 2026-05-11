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
          50: "#f0f0ff",
          100: "#e4e3ff",
          200: "#cdcbff",
          300: "#aba6ff",
          400: "#8478ff",
          500: "#6047f5",
          600: "#5029eb",
          700: "#441cd8",
          800: "#3818b5",
          900: "#301791",
          950: "#1c0c62",
        },
        neon: {
          blue: "#00d4ff",
          purple: "#8b5cf6",
          pink: "#ec4899",
          green: "#10b981",
        },
        glass: {
          white: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.1)",
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
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
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
        glow: "0 0 30px rgba(96, 71, 245, 0.4)",
        "glow-lg": "0 0 60px rgba(96, 71, 245, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 16px 64px rgba(0, 0, 0, 0.4)",
        neon: "0 0 20px rgba(0, 212, 255, 0.5)",
      },
    },
  },
  plugins: [],
};

export default config;
