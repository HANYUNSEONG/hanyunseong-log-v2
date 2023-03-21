/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{jsx,js,tsx,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
