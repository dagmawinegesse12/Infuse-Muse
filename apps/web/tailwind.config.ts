import type { Config } from "tailwindcss";

/**
 * Colours resolve to CSS custom properties defined in app/globals.css so a
 * single component tree can render in either tonality (`night` / `parchment`)
 * by flipping [data-muse] on the shell.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        "ground-2": "var(--ground-2)",
        plate: "var(--plate)",
        "plate-ink": "var(--plate-ink)",
        ink: "var(--ink)",
        "ink-strong": "var(--ink-strong)",
        "ink-mute": "var(--ink-mute)",
        rule: "var(--rule)",
        "rule-strong": "var(--rule-strong)",
        accent: "var(--accent)",

        // Legacy brand tokens — still referenced by /waitlist and email templates.
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
      borderRadius: {
        // The system is squared off. Radius is available but unused by design.
        none: "0",
      },
      transitionTimingFunction: {
        muse: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      maxWidth: {
        shell: "1560px",
        measure: "54ch",
      },
    },
  },
  plugins: [],
};

export default config;
