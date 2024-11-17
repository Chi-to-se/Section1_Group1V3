/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      scrollbar: ['rounded']
    },
  },
  plugins: [require("tailwind-scrollbar")],
};

