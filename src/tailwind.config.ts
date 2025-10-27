import type { Config } from "tailwindcss";

export default {
  darkMode: "class", //  forces dark mode to only trigger with a .dark class TO BE MADE LATER
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./components/ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
