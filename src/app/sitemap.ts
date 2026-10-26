import type { MetadataRoute } from "next";
import { hero, photos } from "@/content/photos";
import { absUrl, assetPath } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [hero, ...photos].map((p) => absUrl(assetPath(p.src.src))),
    },
  ];
}
