module.exports = {
  purge: ["./src/webviews/**/*.{js,jsx,ts,tsx,css}"],

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
