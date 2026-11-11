import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0B0F0D",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.siteUrl),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.owner.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: siteConfig.seo.siteUrl,
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.seo.siteUrl,
    siteName: siteConfig.name,
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "/images/hero-styling-stations.jpg",
        width: 1536,
        height: 2048,
        alt: "R.B Makeover Man's Salon Interior & Styling Stations",
      },
      {
        url: "/images/storefront-exterior.jpg",
        width: 2048,
        height: 1152,
        alt: "R.B Makeover Man's Salon Storefront at Rose Commercial, Park View City Lahore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: ["/images/hero-styling-stations.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data for LocalBusiness / HairSalon
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: siteConfig.name,
    alternateName: [siteConfig.legalName, "R.B Makeover"],
    description: siteConfig.shortDescription,
    image: [
      `${siteConfig.seo.siteUrl}/images/hero-styling-stations.jpg`,
      `${siteConfig.seo.siteUrl}/images/storefront-exterior.jpg`,
    ],
    telephone: siteConfig.contact.primaryPhoneRaw,
    email: siteConfig.contact.email,
    url: siteConfig.seo.siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contact.address.street,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: "Punjab",
      addressCountry: "PK",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.stats.rating.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: siteConfig.stats.reviewCount.toString(),
    },
    sameAs: [siteConfig.contact.social.facebookUrl],
  };

  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${playfairDisplay.variable} ${plusJakartaSans.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#0B0F0D] text-[#F5EFEB] antialiased selection:bg-[#C59B46]/30 selection:text-[#F5EFEB] flex flex-col">
        {/* Accessible skip link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#C59B46] focus:text-[#0B0F0D] focus:font-semibold focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
