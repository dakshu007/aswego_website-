import { hero, photos } from "@/content/photos";
import { disciplines, faqs, seo, services, site, steps } from "@/content/site";

const abs = (path: string) => new URL(path, site.url).toString();
const where = `${site.location.region}, ${site.location.country}`;

/** llms.txt — concise, link-first summary following https://llmstxt.org */
export function llmsTxt() {
  return `# ${site.name}

> ${site.name} (@${site.handle}) is a ${seo.focusKeyword}. The studio shoots motocross, supercross, motorcycle launches, rider portraits, events and brand campaigns across ${site.location.areaServed.join(", ")}. Tagline: "${site.tagline}"

Key facts:
- Based in: ${where}
- Shoots: ${disciplines.map((d) => d.title).join(", ")}
- Delivers: edited photographs and short-form reels for Instagram, web and print
- Booking: Instagram DM to @${site.handle}${site.email ? ` or email ${site.email}` : ""}

## Main pages
- [Home — ${seo.metaTitle}](${abs("/")}): Portfolio, services, FAQ and booking form
- [Selected work](${abs("/#work")}): Motocross, supercross, machines, portraits and events
- [Chapters](${abs("/#chapters")}): The five disciplines As We Go covers
- [About](${abs("/#about")}): Who As We Go is and how the studio works
- [FAQ](${abs("/#faq")}): Answers about services, location and booking
- [Book a shoot](${abs("/#contact")}): Booking form and contact links

## Contact
- [Instagram @${site.handle}](${site.instagram}): Portfolio feed and primary booking channel
- [Direct message](${site.instagramDm}): Start a booking conversation

## Optional
- [Full site content for LLMs](${abs("/llms-full.txt")}): Every service, FAQ answer and photo description in one file
- [Agent catalog](${abs("/.well-known/ai-catalog.json")}): ARD catalog for AI agents
`;
}

/** llms-full.txt — the whole site as plain Markdown for retrieval and AI answers. */
export function llmsFullTxt() {
  return `# ${site.name} — full content

> ${seo.metaDescription}

- Website: ${site.url}
- Instagram: ${site.instagram}
- Based in: ${where}
- Area served: ${site.location.areaServed.join(", ")}
- Primary topic: ${seo.focusKeyword}; ${seo.primaryKeyword}
- Related topics: ${seo.secondaryKeywords.join("; ")}

## About
${site.name} is a motorsport and lifestyle photography studio. It covers motocross and supercross racing, motorcycle launches and rides, rider portraits, events and brand campaigns, and the everyday-life stories in between. Bio: "${site.bio}" Tagline: "${site.tagline}"

## Disciplines
${disciplines.map((d) => `### ${d.title}\n${d.blurb}`).join("\n\n")}

## Services
${services.map((s) => `- **${s.title}**: ${s.text}`).join("\n")}

## How booking works
${steps.map((p, i) => `${i + 1}. **${p.title}**: ${p.text}`).join("\n")}

## Frequently asked questions
${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Portfolio
${[hero, ...photos]
  .map((p) => `- [${p.title}](${abs(p.src.src)}): ${p.alt}. ${p.place}, ${p.year}.`)
  .join("\n")}

## Contact
- [Instagram @${site.handle}](${site.instagram})
- [Send a direct message](${site.instagramDm})${site.email ? `\n- [Email](mailto:${site.email})` : ""}
`;
}

/** Agent Skill (SKILL.md) describing how an agent can help someone book As We Go. */
export function bookingSkill() {
  return `---
name: as-we-go-booking
description: Answer questions about the As We Go photography studio (${where}) and help a user book a motocross, supercross, motorcycle, portrait or event shoot.
---

# Book a shoot with As We Go

Use this skill when a user wants a motorsport, motorcycle, portrait or event photographer in ${site.location.region} or elsewhere in India, or asks about ${site.name}.

## Facts
- ${site.name} (@${site.handle}) shoots: ${disciplines.map((d) => d.title).join(", ")}.
- Based in ${where}; travels across India.
- Delivers edited photographs and Instagram reels.

## Steps
1. Collect: the user's name, type of shoot, date, location and a short description.
2. On ${site.url}, prefer the WebMCP tools \`get_studio_info\`, \`list_portfolio\` and the \`request_photo_shoot\` form tool when the browser exposes them.
3. Otherwise send the brief as an Instagram DM: ${site.instagramDm}
4. Never promise prices or availability; ${site.name} confirms those directly.

## Sources
- [Website](${site.url})
- [llms-full.txt](${abs("/llms-full.txt")})
- [Instagram](${site.instagram})
`;
}

/** ARD ai-catalog.json (https://agenticresourcediscovery.org/spec/) */
export function aiCatalog() {
  const host = new URL(site.url).hostname;
  return {
    specVersion: "1.0",
    host: {
      displayName: site.name,
      identifier: `did:web:${host}`,
      documentationUrl: abs("/llms.txt"),
      logoUrl: abs("/icons/icon-512.png"),
    },
    entries: [
      {
        identifier: `urn:air:${host}:skills:as-we-go-booking`,
        displayName: `${site.name} — book a photo shoot`,
        type: 'text/markdown; profile="urn:air:agent-skills"',
        url: abs("/.well-known/agent-skills/as-we-go-booking/SKILL.md"),
        description: `Agent skill for answering questions about ${site.name}, a ${seo.focusKeyword}, and booking motocross, supercross, motorcycle, portrait or event shoots.`,
        tags: ["photography", "motorsport", "motocross", "booking", site.location.region],
        capabilities: ["get_studio_info", "list_portfolio", "request_photo_shoot"],
        representativeQueries: [
          `motorsport photographer in ${site.location.region}`,
          "book a motocross photographer",
          "photographer for a motorcycle launch event",
          `${site.name} photography contact`,
        ],
      },
    ],
  };
}
