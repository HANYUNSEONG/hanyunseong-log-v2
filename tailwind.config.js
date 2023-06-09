/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{jsx,js,tsx,ts}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.blue.500"),
              "&:hover": {
                color: theme("colors.blue.600"),
              },
            },
            code: {
              color: theme("colors.sky.500"),
              backgroundColor: theme("colors.gray.100"),
              padding: "0.2rem 0.25rem",
            },
            "h1,h2,h3,h4,h5": {
              code: {
                backgroundColor: "transparent",
              },
            },
            "ul li:before": {
              backgroundColor: theme("colors.gray.500"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
