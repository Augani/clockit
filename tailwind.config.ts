import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Vibrant blue for primary elements
        secondary: "#22C55E", // Fresh green for secondary actions
        accent: "#F97316", // Vibrant orange for highlights
        muted: "#64748B", // Subtle grayish-blue for muted text
        background: "#F9FAFB", // Light gray for app background
        surface: "#FFFFFF", // White for cards and surfaces
      },
      borderRadius: {
        "2xl": "1.5rem", // Soft, modern corners
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadows for cards
        button: "0 2px 8px rgba(0, 0, 0, 0.15)", // Button elevation
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
