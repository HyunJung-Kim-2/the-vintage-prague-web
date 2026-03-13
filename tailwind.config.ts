import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        burgundy: {
          DEFAULT: "#6D1A2A",
          light: "#8B2235",
          dark: "#4F1220",
        },
        offwhite: "#F0EDE8",
        muted: "#8A8480",
        border: "#1E1E1E",
        surface: "#111111",
      },
      fontFamily: {
        serif: ["Cormorant Garant", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
