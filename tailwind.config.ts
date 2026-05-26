import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Surfaces */
        page: "var(--bg-page)",
        card: "var(--bg-card)",
        soft: "var(--bg-soft)",
        muted: "var(--bg-muted)",
        overlay: "var(--bg-overlay)",

        /* Text */
        fg: "var(--fg)",
        "fg-muted": "var(--fg-muted)",
        "fg-subtle": "var(--fg-subtle)",
        "fg-faint": "var(--fg-faint)",

        /* Borders */
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        "line-subtle": "var(--line-subtle)",

        /* Accent */
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-soft": "var(--accent-soft)",
        "accent-soft-border": "var(--accent-soft-border)",
        "accent-fg": "var(--accent-fg)",
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
