import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
      },
      colors: {
        primary: "#2E5A7A",
        secondary: "#7B7B85",
        tertiary: "#4FBADB",
        darkcolor: "#181818",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(30px) scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "slide-in-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(-50px) rotate(-5deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) rotate(0deg)",
          },
        },
        "slide-in-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(50px) rotate(5deg)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) rotate(0deg)",
          },
        },
        "bounce-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) rotate(180deg)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05) rotate(0deg)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) rotate(0deg)",
          },
        },
        "letter-appear": {
          "0%": {
            opacity: "0",
            transform: "scale(0.5) translateY(50px)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.1) translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
          },
        },
        "letter-go-up": {
          "0%": {
            opacity: "1",
            transform: "scale(1) translateY(0) rotate(0deg)",
          },
          "25%": {
            opacity: "0.9",
            transform: "scale(1.05) translateY(-20px) rotate(-2deg)",
          },
          "50%": {
            opacity: "0.7",
            transform: "scale(1.1) translateY(-50px) rotate(-5deg)",
          },
          "75%": {
            opacity: "0.4",
            transform: "scale(0.9) translateY(-80px) rotate(-8deg)",
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.7) translateY(-120px) rotate(-10deg)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        "slide-in-left": "slide-in-left 0.8s ease-out forwards",
        "slide-in-right": "slide-in-right 0.8s ease-out forwards",
        "bounce-in": "bounce-in 1s ease-out forwards",
        "letter-appear":
          "letter-appear 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
        "letter-go-up":
          "letter-go-up 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
