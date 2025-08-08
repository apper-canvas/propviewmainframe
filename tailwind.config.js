/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2C5530",
        secondary: "#8B7355",
        accent: "#E8B04B",
        surface: "#F8F6F3",
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
        info: "#2196F3",
      },
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 8px rgba(0, 0, 0, 0.1)",
        lift: "0 6px 16px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease-out",
        scaleIn: "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
}