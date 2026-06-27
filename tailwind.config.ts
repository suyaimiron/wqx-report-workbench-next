import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        basin: {
          950: "#071527",
          900: "#0A1F38",
          800: "#0D2F53",
          700: "#114D76",
          600: "#176C9F"
        },
        lagoon: {
          500: "#14B8C8",
          400: "#2DD4BF",
          300: "#67E8F9"
        },
        mist: "#F4FAFF",
        ink: "#102033"
      },
      boxShadow: {
        glass: "0 22px 70px rgba(1, 14, 32, 0.24)",
        glow: "0 0 34px rgba(45, 212, 191, 0.28)"
      },
      backgroundImage: {
        "dashboard-radial":
          "radial-gradient(circle at 18% 12%, rgba(45,212,191,.24), transparent 28%), radial-gradient(circle at 86% 8%, rgba(103,232,249,.18), transparent 28%), linear-gradient(135deg, #071527 0%, #0A1F38 43%, #17235B 100%)"
      }
    }
  },
  plugins: []
};

export default config;
