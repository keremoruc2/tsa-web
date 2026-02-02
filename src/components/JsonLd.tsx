'use client';

interface OrganizationJsonLdProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  sameAs?: string[];
}

export function OrganizationJsonLd({
  name = "TSA TWENTE - Turkish Student Association",
  url = "https://tsatwente.com",
  logo = "https://tsatwente.com/android-chrome-512x512.png",
  description = "Turkish Student Association at University of Twente. A community bringing Turkish culture to the Netherlands through events, networking, and cultural activities.",
  email = "info@tsatwente.com",
  sameAs = [],
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Enschede",
      addressRegion: "Overijssel",
      addressCountry: "NL",
    },
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "University of Twente",
      url: "https://www.utwente.nl",
    },
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface EventJsonLdProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  url?: string;
}

export function EventJsonLd({
  name,
  description,
  startDate,
  endDate,
  location = "University of Twente, Enschede",
  image,
  url,
}: EventJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    endDate: endDate || startDate,
    location: {
      "@type": "Place",
      name: location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Enschede",
        addressCountry: "NL",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "TSA TWENTE",
      url: "https://tsatwente.com",
    },
    ...(image && { image }),
    ...(url && { url }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  url?: string;
  name?: string;
}

export function WebsiteJsonLd({
  url = "https://tsatwente.com",
  name = "TSA TWENTE",
}: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url,
    name,
    description: "Turkish Student Association at University of Twente",
    publisher: {
      "@type": "Organization",
      name: "TSA TWENTE",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
