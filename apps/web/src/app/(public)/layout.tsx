"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const PublicNavigation = dynamic(() => import("@/components/PublicNavigation"), {
  ssr: false,
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://aumveda.com";

const publicJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "AUMVEDA",
      url: BASE_URL,
      logo: `${BASE_URL}/images/logo.png`,
      description:
        "Mother–Daughter Neuro-Vedic Healing Practice bridging ancient Indian wisdom and modern autonomic neuroscience.",
      founder: [
        { "@id": `${BASE_URL}/#archana-jain` },
        { "@id": `${BASE_URL}/#sejal-jain` },
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Delhi",
        addressRegion: "Delhi",
        addressCountry: "IN",
      },
      sameAs: [
        "https://www.instagram.com/aumveda",
        "https://www.youtube.com/@aumveda",
      ],
    },
    {
      "@type": "MedicalBusiness",
      "@id": `${BASE_URL}/#medicalbusiness`,
      name: "AUMVEDA Neuro-Vedic Healing Sanctuary",
      url: BASE_URL,
      logo: `${BASE_URL}/images/logo.png`,
      image: `${BASE_URL}/images/og-image.jpg`,
      description:
        "Specialized clinical and holistic sanctuary integrating psychological wellness, polyvagal somatic healing, and Vedic astrology consultations.",
      parentOrganization: { "@id": `${BASE_URL}/#organization` },
      medicalSpecialty: [
        "Psychological Wellness",
        "Somatic Therapy",
        "Holistic Health",
        "Vedic Health Consultation",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Delhi",
        addressRegion: "Delhi",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 28.6139,
        longitude: 77.209,
      },
      priceRange: "$$$",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "AUMVEDA — Your Daily Dose of Healing",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/insights?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#archana-jain`,
      name: "Archana Jain",
      jobTitle: "Master Vedic Astrologer & Cosmic Guide",
      description:
        "Master Vedic Astrologer, Vastu Shastra Consultant, and Co-Founder of AUMVEDA based in Delhi.",
      worksFor: { "@id": `${BASE_URL}/#organization` },
      homeLocation: {
        "@type": "Place",
        name: "Delhi, India",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Delhi",
        addressRegion: "Delhi",
        addressCountry: "IN",
      },
    },
    {
      "@type": "Person",
      "@id": `${BASE_URL}/#sejal-jain`,
      name: "Sejal Jain",
      jobTitle: "Psychological Wellness Practitioner & Polyvagal Somatics Specialist",
      description:
        "Psychological Wellness Practitioner, Polyvagal Somatics Specialist, and Co-Founder of AUMVEDA based in Delhi.",
      worksFor: { "@id": `${BASE_URL}/#organization` },
      homeLocation: {
        "@type": "Place",
        name: "Delhi, India",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Delhi",
        addressRegion: "Delhi",
        addressCountry: "IN",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Insights",
          item: `${BASE_URL}/insights`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Somatic Healing",
          item: `${BASE_URL}/insights/the-high-performing-mans-guide-to-somatic-healing`,
        },
      ],
    },
  ],
};

function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const isHome = pathname === "/";

  return (
    <div
      className={cn(
        "min-h-screen",
        isHome ? "bg-[hsl(var(--av-ink))]" : "bg-[hsl(var(--av-parchment))]"
      )}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(publicJsonLd) }}
      />
      {/* Homepage renders its own floating glass nav (FloatingNav) inside HomePage */}
      {!isHome && <PublicNavigation />}
      <main>{children}</main>

      {/* Homepage carries its own closing beat — no second marketing footer */}
      {!isHome && (
        <footer className="bg-[hsl(var(--av-night))] text-[hsl(var(--av-parchment))] pt-20 pb-12">
          <div className="max-w-[1120px] mx-auto px-6 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
              <div className="space-y-4 max-w-sm">
                <p className="font-serif text-2xl tracking-tight">AUMVEDA</p>
                <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.5)] leading-relaxed">
                  Mother–Daughter Neuro-Vedic Healing. Your Daily Dose of Healing.
                </p>
              </div>
              <nav className="flex flex-wrap gap-x-8 gap-y-3 font-body text-sm text-[hsl(var(--av-parchment)/0.45)]">
                <Link href="/about" className="hover:text-[hsl(var(--av-gold-soft))]">
                  About
                </Link>
                <Link href="/courses" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Academy
                </Link>
                <Link href="/services" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Services
                </Link>
                <Link href="/programs" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Programmes
                </Link>
                <Link href="/insights" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Insights
                </Link>
                <Link href="/contact" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Contact
                </Link>
                <Link href="/auth/login?portal=client" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Client login
                </Link>
                <Link href="/auth/login?portal=coach" className="hover:text-[hsl(var(--av-gold-soft))]">
                  Coach login
                </Link>
              </nav>
            </div>
            <div className="pt-8 border-t border-[hsl(var(--av-parchment)/0.1)] flex flex-col sm:flex-row justify-between gap-4 font-body text-xs text-[hsl(var(--av-parchment)/0.3)]">
              <p>© {new Date().getFullYear()} AUMVEDA</p>
              <div className="flex gap-6">
                <Link href="/privacy-policy" className="hover:text-[hsl(var(--av-parchment)/0.6)]">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-[hsl(var(--av-parchment)/0.6)]">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
