import type { MetadataRoute } from "next";
import { hero, photos } from "@/content/photos";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [hero, ...photos].map((p) => new URL(p.src.src, site.url).toString()),
    },
  ];
}
