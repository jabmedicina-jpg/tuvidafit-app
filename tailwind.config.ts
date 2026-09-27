import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: "#12A9B3",
        green: "#2ECC71",
        orange: "#F7A72E",
        blue: "#3B6FF0",
        purple: "#8E6FF0",
        ink: "#1B2A2E",
        muted: "#66767A",
        line: "#E4E9EA",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
