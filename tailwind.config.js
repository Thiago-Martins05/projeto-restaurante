/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundImage: {
        "header": "url('/assets/bg.png')",
      },
      spacing: {
        '456': '28.5rem',
        '185': '11.5625rem'
        
      }
    },
  },
  plugins: [],
};
