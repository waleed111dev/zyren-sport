import type { Metadata } from "next"
import HomePageClient from "./HomePageClient"

export const metadata: Metadata = {
  title: "Zyren Sports - Premium Athletic Wear | Founded by Waleed Khalid",
  description:
    "Premium athletic wear for champions worldwide. Shop high-quality sportswear, running shoes, and athletic accessories. Founded by Waleed Khalid. Fast worldwide shipping to Asia, Europe, America & Africa.",
  keywords: [
    "premium athletic wear",
    "sportswear online",
    "athletic clothing",
    "gym wear",
    "running shoes",
    "fitness apparel",
    "Zyren Sports",
    "Waleed Khalid",
    "men's sportswear",
    "women's athletic wear",
    "athletic accessories",
    "premium sports brand",
    "fitness clothing",
    "workout clothes",
    "athletic performance wear",
    "sports fashion",
  ],
  openGraph: {
    title: "Zyren Sports - Premium Athletic Wear | Founded by Waleed Khalid",
    description:
      "Premium athletic wear for champions worldwide. Founded by Waleed Khalid. Serving Asia, Europe, America & Africa.",
    url: "https://zyrensports.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zyren Sports Homepage - Premium Athletic Wear",
      },
    ],
  },
  alternates: {
    canonical: "https://zyrensports.com",
  },
}

export default function HomePage() {
  return (
    <>
      {/* Enhanced Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": "https://zyrensports.com/#webpage",
            url: "https://zyrensports.com",
            name: "Zyren Sports - Premium Athletic Wear",
            description: "Premium athletic wear for champions worldwide. Founded by Waleed Khalid.",
            isPartOf: {
              "@id": "https://zyrensports.com/#website",
            },
            about: {
              "@id": "https://zyrensports.com/#organization",
            },
            mainEntity: {
              "@type": "Store",
              name: "Zyren Sports",
              description: "Premium athletic wear store",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Athletic Wear",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Athletic Shoes",
                      category: "Footwear",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Sportswear",
                      category: "Clothing",
                    },
                  },
                ],
              },
            },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".hero-description"],
            },
          }),
        }}
      />
      <HomePageClient />
    </>
  )
}
