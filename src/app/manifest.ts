import type { MetadataRoute } from "next";
import { basePath, seo, site } from "@/content/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.legalName,
    short_name: site.name,
    description: seo.metaDescription,
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: site.themeColor,
    theme_color: site.themeColor,
    categories: ["photography", "sports", "lifestyle"],
    icons: [
      { src: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${basePath}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
