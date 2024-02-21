/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      "kelly-slab": ["Kelly Slab", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
    screens: {
      sm: "480px",
      desktop: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        first: "#FE4A49",
        second: "#0F172A",
        third: "#C0DCF7",
        forth: "#89C1F0",
      },
    },
  },
  plugins: [],
};
