import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { 950: "#07120c", 900: "#0e1f18", 800: "#163126", 700: "#234434", 600: "#385944", 500: "#6f8d77" },
        gold: { 300: "#e3c36b", 400: "#d8b354", 500: "#bf9532" },
        cream: "#f7f4ee"
      },
      fontFamily: { serif: ["Georgia", "Times New Roman", "serif"], sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"] },
      boxShadow: { soft: "0 20px 50px rgba(0,0,0,0.22)" },
      backgroundImage: { "brand-radial": "radial-gradient(circle at top, rgba(56,89,68,0.45), transparent 48%)" }
    }
  },
  plugins: []
};

export default config;
