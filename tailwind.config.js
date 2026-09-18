/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B3B82",
        "primary-dark": "#2D2045",
        lavender: "#B9A1D8",
        "lavender-light": "#EEE6F7",
        cream: "#FBF9FD",
        gold: "#C9A96E",
        pink: "#E9A7C5",
        ink: "#30243D",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        script: ["var(--font-great-vibes)", "cursive"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(91,59,130,0.25)",
        card: "0 4px 20px -4px rgba(91,59,130,0.15)",
      },
      backgroundImage: {
        "lavender-watercolor":
          "radial-gradient(circle at 20% 20%, rgba(185,161,216,0.35), transparent 40%), radial-gradient(circle at 80% 0%, rgba(233,167,197,0.25), transparent 45%), radial-gradient(circle at 50% 100%, rgba(185,161,216,0.3), transparent 50%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease forwards",
        marquee: "marquee 18s linear infinite",
      },
    },
  },
  plugins: [],
};
