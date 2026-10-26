import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import { JsonLd } from "@/components/JsonLd";
import { seo, site } from "@/content/site";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * H1 display face. The brief calls for "Mangelic" — subset the licensed file the same way
 * (see scripts/subset-display-font.sh), point `src` at it, done. Until then an Unbounded
 * (OFL) caps subset stands in: its rounded-square geometry echoes the As We Go logotype.
 * Display text is always uppercase, so the file is cut to caps/digits/punctuation (6 KB)
 * to keep the hero headline — the mobile LCP element — fast.
 */
const display = localFont({
  src: "../assets/fonts/unbounded-700-caps.woff2",
  weight: "700",
  variable: "--font-display-face",
  display: "swap",
  fallback: ["Arial Black", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: seo.metaTitle,
    template: `%s · ${site.name}`,
  },
  description: seo.metaDescription,
  keywords: [seo.focusKeyword, seo.primaryKeyword, ...seo.secondaryKeywords],
  applicationName: site.name,
  authors: [{ name: site.name, url: site.instagram }],
  creator: site.name,
  publisher: site.name,
  category: "Photography",
  alternates: {
    canonical: "/",
    types: { "text/plain": [{ url: "/llms.txt", title: "llms.txt" }] },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: seo.metaTitle,
    description: seo.metaDescription,
    locale: site.locale,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.metaTitle,
    description: seo.metaDescription,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
  appleWebApp: { title: site.name, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.language} className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* Flag JS before first paint so scroll-reveal styles never flash. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <link rel="ai-catalog" href="/.well-known/ai-catalog.json" type="application/json" />
        <JsonLd />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
