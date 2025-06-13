/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#de2c4d",
        secondary: "#fb923c",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        averia: ["Averia Serif Libre", "serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
     animation: {
    "fade-in-down": "fadeInDown 0.8s ease-out",
    "fade-in-up": "fadeInUp 0.8s ease-out",
    glow: "glowPulse 2s ease-in-out infinite",
  },
  keyframes: {
    fadeInDown: {
      "0%": { opacity: 0, transform: "translateY(-20px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
    fadeInUp: {
      "0%": { opacity: 0, transform: "translateY(20px)" },
      "100%": { opacity: 1, transform: "translateY(0)" },
    },
    glowPulse: {
      "0%, 100%": { textShadow: "0 0 10px #f43f5e" },
      "50%": { textShadow: "0 0 20px #14b8a6" },
    },
  },
    },
  },
  plugins: [],
};
