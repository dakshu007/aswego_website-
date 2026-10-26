/**
 * Single source of truth for brand facts, SEO and copy.
 * Everything AI crawlers, JSON-LD, llms.txt and the page itself say comes from here,
 * so edit this file (not the components) when details change.
 */

export const site = {
  name: "As We Go",
  legalName: "As We Go Photography",
  handle: "as.we.go__",
  // TODO(launch): set the real production domain (also used for canonical + sitemap).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aswego.in",
  locale: "en_IN",
  language: "en-IN",
  tagline: "Every ride writes a story.",
  bio: "Creating As We Go — between speed, dirt and everyday life.",
  // TODO(confirm): base city / region. Drives local SEO everywhere.
  location: {
    city: "",
    region: "Kerala",
    country: "India",
    countryCode: "IN",
    areaServed: ["Kerala", "South India", "India"],
  },
  instagram: "https://www.instagram.com/as.we.go__/",
  instagramDm: "https://ig.me/m/as.we.go__",
  // TODO(launch): add a booking email / WhatsApp number when available; leave empty to hide.
  email: "",
  whatsapp: "",
  founded: "2024",
  themeColor: "#0a0a0a",
  brandRed: "#fe0000",
} as const;

export const seo = {
  metaTitle: "As We Go — Motorsport & Moto Photographer in Kerala",
  metaDescription:
    "As We Go shoots speed, dirt and everyday life: motocross, supercross, motorcycle launches and rider portraits across Kerala and India. Book a shoot.",
  focusKeyword: "motorsport photographer in Kerala",
  primaryKeyword: "motocross photography Kerala",
  secondaryKeywords: [
    "supercross photographer India",
    "motorcycle photoshoot Kerala",
    "bike launch photography",
    "rider portrait photography",
    "automotive photographer Kerala",
    "event photographer Kerala",
    "dirt bike photography",
    "moto lifestyle photography",
  ],
} as const;

export const disciplines = [
  {
    id: "motocross",
    title: "Motocross",
    blurb: "Roost, ruts and red earth. Track days and race weekends shot from the berm, not the stands.",
  },
  {
    id: "supercross",
    title: "Supercross",
    blurb: "Gate drops, whips and podiums under the lights. Full race-day coverage for riders and organisers.",
  },
  {
    id: "machines",
    title: "Machines",
    blurb: "Launches, builds and open-road rides. Motorcycles photographed like the characters they are.",
  },
  {
    id: "portraits",
    title: "Portraits",
    blurb: "Riders, creators and people with a story. Honest light, natural frames, zero stiffness.",
  },
  {
    id: "events",
    title: "Events & Brands",
    blurb: "Festivals, tournaments and campaigns. Fast-turnaround frames and reels that brands can post today.",
  },
] as const;

export type DisciplineId = (typeof disciplines)[number]["id"];

export const services = [
  { icon: "flag", title: "Race-day coverage", text: "Motocross and supercross rounds, from practice to podium." },
  { icon: "bike", title: "Motorcycle launches", text: "Showroom reveals, product stills and ride-out content." },
  { icon: "camera", title: "Rider portraits", text: "Helmet-off portraits and kit shoots for riders and teams." },
  { icon: "clapperboard", title: "Reels & short films", text: "Vertical edits cut for Instagram, made alongside the stills." },
  { icon: "megaphone", title: "Brand & events", text: "Campaigns, tournaments and festive shoots for local brands." },
  { icon: "heart", title: "Lifestyle & couples", text: "Everyday-life stories, shot with the same eye for motion." },
] as const;

export const steps = [
  { icon: "message", title: "Say hello", text: "DM us on Instagram with the date, place and what you want to make." },
  { icon: "route", title: "Plan the ride", text: "We scout light, angles and timing, and agree on what gets delivered." },
  { icon: "aperture", title: "Shoot & deliver", text: "We shoot as we go, then hand over edited frames and reels." },
] as const;

// TODO(confirm): review every answer before launch. These feed the FAQ section,
// FAQPage JSON-LD and llms.txt, which AI search engines quote directly.
export const faqs = [
  {
    q: "What does As We Go photograph?",
    a: "As We Go is a motorsport and lifestyle photography studio. We shoot motocross and supercross racing, motorcycle launches and rides, rider portraits, events and brand campaigns, plus everyday-life stories in between.",
  },
  {
    q: "Where is As We Go based?",
    a: `We are based in ${site.location.region}, ${site.location.country}, and travel across South India and the rest of India for race weekends, launches and brand shoots.`,
  },
  {
    q: "How do I book a shoot with As We Go?",
    a: "Send a DM on Instagram (@as.we.go__) or use the booking form on this page with your date, location and the kind of shoot you need. We reply with availability and a plan.",
  },
  {
    q: "Do you shoot reels and video as well as photos?",
    a: "Yes. Most shoots include vertical reels and short edits made for Instagram alongside the still photographs.",
  },
  {
    q: "Do you cover full race events like supercross rounds?",
    a: "Yes. We cover full race days, including practice, heats, finals, podiums and the paddock, for riders, teams, organisers and sponsors.",
  },
  {
    q: "Can brands hire As We Go for motorcycle launches?",
    a: "Yes. We photograph showroom launches, product reveals and ride-outs for motorcycle brands and dealers, and deliver images ready for social, web and print.",
  },
] as const;

export const nav = [
  { href: "#work", label: "Work" },
  { href: "#chapters", label: "Chapters" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
] as const;
