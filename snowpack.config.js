/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "src/webviews/public": { url: '/', static: true },
    "src/webviews/src": { url: '/dist' },
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    ['@snowpack/plugin-typescript', {args: "--project ./tsconfig-webview.json"}]
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    // {"match": "routes", "src": ".*", "dest": "/index.html"},
  ],
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    out: 'out/webviews'
  },
};