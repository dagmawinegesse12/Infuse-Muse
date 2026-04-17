import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { 950: "#07120c", 900: "#0e1f18", 800: "#163126", 700: "#234434", 600: "#385944", 500: "#6f8d77" },
        gold: { 300: "#fad483", 400: "#efcb80", 500: "#d8a84a" },
        cream: "#f4efe6",
        brand: {
          green: "#0f3d2e",
          "green-dark": "#092516",
          gold: "#efcb80",
          "gold-light": "#fad483",
        },
      },
      fontFamily: {
        serif: ["'Erotique Alternate'", "Georgia", "'Times New Roman'", "serif"],
        sans: ["'Montserrat'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: { soft: "0 20px 50px rgba(0,0,0,0.22)" },
      backgroundImage: { "brand-radial": "radial-gradient(circle at top, rgba(56,89,68,0.45), transparent 48%)" }
    }
  },
  plugins: []
};

export default config;
