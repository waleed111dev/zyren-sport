import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Zyren Sports | Get in Touch with Our Team",
  description:
    "Contact Zyren Sports for inquiries about our premium athletic wear. Email, phone, or WhatsApp support available. Founded by Waleed Khalid. Serving Asia, Europe, America & Africa with fast shipping.",
  keywords: [
    "contact Zyren Sports",
    "customer support",
    "athletic wear inquiries",
    "Waleed Khalid contact",
    "sportswear support",
    "premium athletic wear help",
    "sports clothing customer service",
    "athletic wear questions",
    "fitness apparel support",
  ],
  openGraph: {
    title: "Contact Zyren Sports | Get in Touch with Our Team",
    description:
      "Contact Zyren Sports for inquiries about our premium athletic wear. Email, phone, or WhatsApp support available. Serving Asia, Europe, America & Africa.",
    url: "https://zyrensports.com/contact",
    images: [
      {
        url: "/contact-og-image.png",
        width: 1200,
        height: 630,
        alt: "Contact Zyren Sports Team",
      },
    ],
  },
  alternates: {
    canonical: "https://zyrensports.com/contact",
  },
}

export default function ContactPage() {
  return (
    <>
      {/* Contact Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "@id": "https://zyrensports.com/contact#webpage",
            url: "https://zyrensports.com/contact",
            name: "Contact Zyren Sports",
            description: "Get in touch with Zyren Sports team for support and inquiries",
            isPartOf: {
              "@id": "https://zyrensports.com/#website",
            },
            mainEntity: {
              "@type": "Organization",
              "@id": "https://zyrensports.com/#organization",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+92-341-6561511",
                  contactType: "customer service",
                  email: "waleedkhalidop604@gmail.com",
                  availableLanguage: "English",
                  areaServed: "Worldwide",
                },
              ],
            },
          }),
        }}
      />
      <ContactPageClient />
    </>
  )
}
