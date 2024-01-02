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
              borderRadius: "0.375rem",
            },
            "ul li:before": {
              backgroundColor: theme("colors.gray.500"),
            },
            "p > img": {
              margin: "0",
              "& + em": {
                display: "block",
                textAlign: "center",
                fontSize: "0.75rem",
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
