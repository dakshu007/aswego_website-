# As We Go — website

Premium one-page portfolio for **As We Go** ([@as.we.go\_\_](https://www.instagram.com/as.we.go__/)) —
motorsport & lifestyle photography. Direction: **"Dust & Speed"** — near-black canvas, bone type,
one loud signal red from the logo, cinematic motion.

**Stack:** Next.js 16 (App Router, static) · React 19 · Three.js (hero) · Lenis (smooth scroll) ·
Lucide icons · Instrument Sans + display face (Mangelic slot).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## What's on the page

| Section | Notes |
| --- | --- |
| Hero | Full-bleed photo (LCP), H1 *"Every ride writes a story."*. On first interaction it upgrades to a **Three.js** scene: pointer ripple, scroll-velocity stretch/RGB split, red-earth dust that scatters from the cursor. |
| Marquee | Red ticker whose speed + skew follow scroll velocity. |
| Manifesto | Words light up as you scroll. |
| Selected work | Editorial 12-col grid, parallax frames, filter chips, full-screen lightbox (keyboard ← → Esc, swipe). |
| Chapters | Pinned horizontal ride through the 5 disciplines (desktop); swipe rail on touch. |
| Services · How it works · About · FAQ | Lucide icons; FAQ feeds `FAQPage` JSON-LD and llms.txt. |
| Book a shoot | Brief form → copies the brief and opens the Instagram DM (or email once set). Exposed to AI agents via WebMCP. |
| Extras | Custom cursor (fine pointers), film grain, app-style bottom dock on mobile/tablet, `prefers-reduced-motion` respected everywhere. |

## Replacing placeholder content

Everything editable lives in **`src/content/`**:

- **`site.ts`** — brand facts, location, contact, SEO keywords, services, FAQ. Items marked
  `TODO(launch)` / `TODO(confirm)` need real values (domain, email/WhatsApp, city, FAQ wording).
- **`photos.ts`** — photo list. The images in `src/assets/photos/` are **generated placeholders**
  (each is stamped "PLACEHOLDER"). Overwrite each file with the real photo **using the same file
  name**, then update its `alt` text so it describes exactly what is in the frame. Any aspect ratio works.
- **Display font (Mangelic):** run
  `scripts/subset-display-font.sh Mangelic.ttf src/assets/fonts/mangelic-caps.woff2`
  and point `src` in `src/app/layout.tsx` at it. Until then an Unbounded (OFL) caps subset stands in.
- **Domain:** set `NEXT_PUBLIC_SITE_URL` (used by canonical, sitemap, JSON-LD, llms.txt, ai-catalog).

## SEO

| | |
| --- | --- |
| Meta title | As We Go — Motorsport & Moto Photographer in Kerala (51 chars) |
| Meta description | As We Go shoots speed, dirt and everyday life: motocross, supercross, motorcycle launches and rider portraits across Kerala and India. Book a shoot. (148 chars) |
| Focus keyword | motorsport photographer in Kerala |
| Primary keyword | motocross photography Kerala |
| Secondary keywords | supercross photographer India · motorcycle photoshoot Kerala · bike launch photography · rider portrait photography · automotive photographer Kerala · event photographer Kerala · dirt bike photography · moto lifestyle photography |

Also: canonical, Open Graph/Twitter card (`public/og.jpg`), `robots.txt`, image sitemap,
web manifest, and a JSON-LD graph (`ProfessionalService`, `WebSite`, `WebPage`, `ImageGallery`
with image licence metadata, `FAQPage`, `OfferCatalog`).

## AI search & agents (Gemini / AI Overviews, ChatGPT, Claude, Perplexity, DeepSeek…)

- `robots.txt` explicitly allows Google-Extended, GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  Claude-SearchBot, PerplexityBot, DeepSeekBot, Applebot-Extended, Bingbot and more.
- [`/llms.txt`](https://llmstxt.org) + `/llms-full.txt` — the whole site as clean Markdown.
- `/.well-known/ai-catalog.json` (ARD spec) → an Agent Skill at
  `/.well-known/agent-skills/as-we-go-booking/SKILL.md`, linked via `<link rel="ai-catalog">` and a `Link` header.
- **WebMCP**: the booking form is a declarative tool (`request_photo_shoot`) and the page registers
  `get_studio_info`, `list_portfolio`, `go_to_section` for in-browser agents.
- FAQ answers are written to be quoted verbatim by AI answers.

## Lighthouse 13.5 (local production build, placeholder photos)

| | Performance | Accessibility | Best Practices | SEO | Agentic Browsing |
| --- | --- | --- | --- | --- | --- |
| Desktop | **100** (5/5 runs) | **100** | **100** | **100** | **100** (6/6) |
| Mobile | **94–98** (median 98) | **100** | **100** | **100** | **100** (6/6) |

Mobile performance is limited by the simulated-4G LCP estimate, which counts the Next.js/React
runtime (~155 KB) downloaded before first paint. Measure performance in a **performance-only**
run: with the Agentic category enabled in the same run, Lighthouse's WebMCP instrumentation adds
main-thread noise to TBT regardless of the page.

Performance choices: Three.js is fetched only after the visitor's first interaction; below-the-fold
sections use `content-visibility`; the gallery is server-rendered; the display font is a 6 KB caps subset;
AVIF/WebP via `next/image`.

## Launch checklist

- [ ] Real photos + accurate alt text in `src/content/photos.ts`
- [ ] Mangelic font file + web licence
- [ ] `NEXT_PUBLIC_SITE_URL` = production domain
- [ ] Confirm city/region, FAQ answers, email/WhatsApp in `src/content/site.ts`
- [ ] Deploy (Vercel recommended), then submit `sitemap.xml` in Google Search Console
