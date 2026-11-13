/**
 * Mitakshi is a fully client-side app: every model runs in the visitor's browser.
 *
 * - `npm run dev` / `npm run build` / `npm start`: Next.js server features, with the
 *   cross-origin isolation headers that enable the multi-threaded WASM fallback.
 * - `npm run export`: a static `out/` folder for any static host (Netlify, Cloudflare Pages,
 *   GitHub Pages). Headers come from `public/_headers` in that case.
 */
const isStaticExport = process.env.npm_lifecycle_event === 'export';

const isolation = [
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets phones and other PCs on the local network load the dev server by IP.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
  // No floating Next.js badge in the corner during development.
  devIndicators: false,
  output: isStaticExport ? 'export' : undefined,
  // Static exports cannot set headers, so `public/_headers` carries them instead.
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            { source: '/:path*', headers: isolation },
            { source: '/(models|ort|styles)/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, immutable' }] },
          ];
        },
      }),
};

export default nextConfig;
