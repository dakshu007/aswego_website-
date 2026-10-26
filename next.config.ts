import type { NextConfig } from "next";

/**
 * Two build targets:
 *  - default: Node/Vercel hosting with Next's image optimiser and security headers.
 *  - STATIC_EXPORT=1: fully static site in out/ (GitHub Pages), served from NEXT_PUBLIC_BASE_PATH,
 *    with images pre-rendered by scripts/build-images.mjs.
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    deviceSizes: [420, 640, 828, 1080, 1440, 1920, 2560],
    minimumCacheTTL: 2678400,
    ...(staticExport ? { loader: "custom" as const, loaderFile: "./src/lib/image-loader.ts" } : {}),
  },
  ...(staticExport
    ? { output: "export" as const, basePath, trailingSlash: true }
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
                { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
                { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
                {
                  key: "Link",
                  value:
                    '</.well-known/ai-catalog.json>; rel="ai-catalog", </llms.txt>; rel="alternate"; type="text/markdown"',
                },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
