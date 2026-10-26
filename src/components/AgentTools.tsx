"use client";

import { useEffect } from "react";
import { hero, photos } from "@/content/photos";
import { disciplines, faqs, services, site } from "@/content/site";

type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>;
};
type ModelContext = {
  registerTool?: (tool: Tool) => void;
  unregisterTool?: (name: string) => void;
  provideContext?: (ctx: { tools: Tool[] }) => void;
};

const text = (value: unknown) => ({
  content: [{ type: "text" as const, text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
});
const sections = ["top", "work", "chapters", "about", "faq", "contact"] as const;

/**
 * Imperative WebMCP tools so in-browser AI agents can query the studio and navigate
 * the page without scraping. No-op in browsers without navigator.modelContext.
 */
export function AgentTools() {
  useEffect(() => {
    const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!mc) return;

    const tools: Tool[] = [
      {
        name: "get_studio_info",
        description:
          "Get facts about As We Go: what the photography studio shoots, where it is based, services offered and how to book.",
        inputSchema: { type: "object", properties: {} },
        execute: async () =>
          text({
            name: site.name,
            tagline: site.tagline,
            basedIn: `${site.location.region}, ${site.location.country}`,
            areaServed: site.location.areaServed,
            disciplines: disciplines.map((d) => ({ title: d.title, summary: d.blurb })),
            services,
            booking: { instagram: site.instagram, directMessage: site.instagramDm, email: site.email || undefined },
            faqs,
          }),
      },
      {
        name: "list_portfolio",
        description: "List photographs in the As We Go portfolio, optionally filtered by discipline.",
        inputSchema: {
          type: "object",
          properties: {
            discipline: {
              type: "string",
              enum: disciplines.map((d) => d.id),
              description: "Only return photos from this discipline.",
            },
          },
        },
        execute: async ({ discipline }) =>
          text(
            [hero, ...photos]
              .filter((p) => !discipline || p.discipline === discipline)
              .map((p) => ({
                title: p.title,
                description: p.alt,
                discipline: p.discipline,
                place: p.place,
                year: p.year,
                url: new URL(p.src.src, window.location.origin).toString(),
              })),
          ),
      },
      {
        name: "go_to_section",
        description: "Scroll the As We Go page to a section: top, work, chapters, about, faq or contact.",
        inputSchema: {
          type: "object",
          properties: {
            section: { type: "string", enum: [...sections], description: "Section to show." },
          },
          required: ["section"],
        },
        execute: async ({ section }) => {
          window.dispatchEvent(new Event("awg:render-all"));
          const el = document.getElementById(String(section));
          if (!el) return text(`Unknown section: ${section}`);
          el.scrollIntoView({ behavior: "smooth" });
          return text(`Showing the ${section} section.`);
        },
      },
    ];

    if (mc.registerTool) tools.forEach((t) => mc.registerTool!(t));
    else mc.provideContext?.({ tools });
    return () => {
      if (mc.unregisterTool) tools.forEach((t) => mc.unregisterTool!(t.name));
    };
  }, []);

  return null;
}
