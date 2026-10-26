import { faqs, seo, services, site } from "@/content/site";
import { hero, photos } from "@/content/photos";

const abs = (path: string) => new URL(path, site.url).toString();

/** Structured data graph: who we are, what we offer, the gallery and the FAQ. */
export function JsonLd() {
  const orgId = abs("/#studio");
  const websiteId = abs("/#website");
  const pageId = abs("/#webpage");
  const year = new Date().getFullYear();

  const imageObject = (p: typeof hero) => ({
    "@type": "ImageObject",
    "@id": abs(`/#photo-${p.id}`),
    contentUrl: abs(p.src.src),
    url: abs(`/#photo-${p.id}`),
    width: p.src.width,
    height: p.src.height,
    name: p.title,
    caption: p.alt,
    creator: { "@id": orgId },
    creditText: site.name,
    copyrightHolder: { "@id": orgId },
    copyrightNotice: `© ${year} ${site.name}`,
    acquireLicensePage: abs("/#contact"),
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "Organization"],
        "@id": orgId,
        name: site.name,
        legalName: site.legalName,
        alternateName: [`@${site.handle}`, "AsWeGo", "As We Go Photography"],
        slogan: site.tagline,
        description: `${site.name} is a ${seo.focusKeyword}: ${seo.metaDescription}`,
        url: site.url,
        logo: abs("/icons/icon-512.png"),
        image: abs("/og.jpg"),
        foundingDate: site.founded,
        sameAs: [site.instagram],
        ...(site.email ? { email: site.email } : {}),
        ...(site.whatsapp ? { telephone: site.whatsapp } : {}),
        address: {
          "@type": "PostalAddress",
          ...(site.location.city ? { addressLocality: site.location.city } : {}),
          addressRegion: site.location.region,
          addressCountry: site.location.countryCode,
        },
        areaServed: site.location.areaServed.map((name) => ({ "@type": "Place", name })),
        knowsAbout: [
          "Motocross photography",
          "Supercross photography",
          "Motorsport photography",
          "Motorcycle photography",
          "Portrait photography",
          "Event photography",
          "Instagram reels",
        ],
        keywords: [seo.focusKeyword, seo.primaryKeyword, ...seo.secondaryKeywords].join(", "),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "bookings",
          url: site.instagramDm,
          availableLanguage: ["English"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Photography services",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: s.title, description: s.text, provider: { "@id": orgId } },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: seo.metaDescription,
        inLanguage: site.language,
        publisher: { "@id": orgId },
      },
      {
        "@type": ["WebPage", "CollectionPage"],
        "@id": pageId,
        url: site.url,
        name: seo.metaTitle,
        description: seo.metaDescription,
        inLanguage: site.language,
        isPartOf: { "@id": websiteId },
        about: { "@id": orgId },
        primaryImageOfPage: { "@id": abs(`/#photo-${hero.id}`) },
        mainEntity: { "@id": abs("/#gallery") },
      },
      {
        "@type": "ImageGallery",
        "@id": abs("/#gallery"),
        name: `${site.name} — selected work`,
        description: "Motocross, supercross, motorcycle, portrait and event photography by As We Go.",
        author: { "@id": orgId },
        image: [hero, ...photos].map(imageObject),
      },
      {
        "@type": "FAQPage",
        "@id": abs("/#faq"),
        isPartOf: { "@id": pageId },
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here: all values come from our own content files.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
