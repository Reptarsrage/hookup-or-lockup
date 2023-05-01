/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "class",
  theme: {
    colors: {
      white: "#fffff9",
      black: "#0b0a26",
      "blue-dark": "#1d1b59",
      "blue-light": "#8480f2",
      "blue-lighter": "#a8a6f5",
      pink: "#f28a80",
      red: "#f20505",
      "pink-light": "#ffa9a1",
      "red-dark": "#6b2d28",
      "red-darker": "#4B201C",
      gray: "#8f9cb5",
      "gray-light": "#a5afc3",
      "gray-dark": "#545367",
    },
    fontFamily: {
      sans: ["Poppins", "sans-serif"],
    },
    extend: {
      aspectRatio: {
        "h-video": "9 / 16",
      },
    },
  },
  plugins: [],
};
