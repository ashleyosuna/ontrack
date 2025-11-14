/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        background: "var(--background)",
        destructive: "var(--color-destructive)",
        popover: "var(--color-popover)",
        "primary-foreground": "var(--primary-foreground)",
      },
    },
  },
  plugins: [],
};
