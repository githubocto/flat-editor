// postcss.config.js
// Taken from: https://tailwindcss.com/docs/installation#using-tailwind-with-postcss
module.exports = {
  plugins: {
    // ...
    '@tailwindcss/jit': {},
    'postcss-nested': {},
    autoprefixer: {},
    // ...
  },
}
