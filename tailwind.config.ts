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
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: "#f1f3ec",
        cardbg: "#ffffff",
        navy: {
          900: "#12142d",
          800: "#1d2046",
          700: "#272b5c",
          600: "#383d7a",
        },
        aniimo: {
          fire: "#cc5231",
          water: "#2c5eb3",
          grass: "#347f3f",
          lightning: "#d9ad26",
          ice: "#2b96c2",
          wind: "#2e9780",
          earth: "#926339",
          dark: "#6246a9",
          light: "#c7902a",
        },
      },
      animation: {
        "rainbow-spin": "spin 4s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-up": "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

