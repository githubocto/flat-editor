/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "src/webviews/public": { url: '/', static: true },
    "src/webviews/src": { url: '/' },
  },
  plugins: [
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-postcss',
    ['@snowpack/plugin-typescript', {args: "--project ./tsconfig-webview.json"}]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    bundle: true,
    minify: true,
    target: "es2020",
    entrypoints: ['index.js']
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    output: "stream"
  },
  buildOptions: {
    out: 'out/webviews'
  },
};