import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { 50: "#eef2ff", 100: "#e0e7ff", 500: "#1e3a6e", 600: "#162d58", 700: "#0f2040", 800: "#091628", 900: "#060e1a" },
        plate: { yellow: "#F5C518", dark: "#D4A017" },
        apk: { green: "#16a34a", orange: "#d97706", red: "#dc2626" },
        surface: { DEFAULT: "#f8f9fc", card: "#ffffff", border: "#e5e9f2" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["DM Sans", "Inter", "system-ui", "sans-serif"],
        plate: ["Courier Prime", "Courier New", "monospace"],
      },
      borderRadius: { plate: "6px" },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.10), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
        plate: "inset 0 2px 4px rgb(0 0 0 / 0.15), 0 2px 8px rgb(0 0 0 / 0.12)",
      },
      animation: { "fade-in": "fadeIn 0.3s ease-out", "slide-up": "slideUp 0.4s ease-out" },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
