import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://zyrensports.com"), // Replace with your actual domain
  title: {
    default: "Zyren Sports - Premium Athletic Wear | Founded by Waleed Khalid",
    template: "%s | Zyren Sports",
  },
  description:
    "Premium athletic wear for champions worldwide. Shop high-quality sportswear, running shoes, and athletic accessories. Founded by Waleed Khalid. Fast worldwide shipping to Asia, Europe, America & Africa.",
  keywords: [
    "athletic wear",
    "sportswear",
    "running shoes",
    "gym clothes",
    "premium sports clothing",
    "Zyren Sports",
    "Waleed Khalid",
    "athletic accessories",
    "fitness wear",
    "sports apparel",
    "workout clothes",
    "athletic footwear",
    "men's sportswear",
    "women's athletic wear",
    "premium athletic brand",
    "sports fashion",
    "fitness clothing",
    "athletic performance wear",
  ],
  authors: [{ name: "Waleed Khalid", url: "https://zyrensports.com" }],
  creator: "Waleed Khalid",
  publisher: "Zyren Sports",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zyrensports.com",
    siteName: "Zyren Sports",
    title: "Zyren Sports - Premium Athletic Wear | Founded by Waleed Khalid",
    description:
      "Premium athletic wear for champions worldwide. Shop high-quality sportswear, running shoes, and athletic accessories. Founded by Waleed Khalid. Serving Asia, Europe, America & Africa.",
    images: [
      {
        url: "/og-image.png", // You'll need to add this image
        width: 1200,
        height: 630,
        alt: "Zyren Sports - Premium Athletic Wear",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zyren Sports - Premium Athletic Wear",
    description: "Premium athletic wear for champions worldwide. Founded by Waleed Khalid.",
    images: ["/og-image.png"],
    creator: "@zyrensports", // Replace with your Twitter handle
  },
  alternates: {
    canonical: "https://zyrensports.com",
  },
  verification: {
    google: "your-google-verification-code", // Add your Google verification code
    yandex: "your-yandex-verification-code", // Optional
    bing: "your-bing-verification-code", // Optional
  },
  category: "sports",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://zyrensports.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#16a34a" />
        <meta name="color-scheme" content="light" />

        {/* Enhanced Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Enhanced Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://zyrensports.com/#organization",
              name: "Zyren Sports",
              alternateName: ["Zyren", "Zyren Athletic", "Zyren Sportswear"],
              url: "https://zyrensports.com",
              logo: {
                "@type": "ImageObject",
                url: "https://zyrensports.com/logo.png",
                width: 512,
                height: 512,
              },
              image: "https://zyrensports.com/og-image.png",
              description: "Premium athletic wear for champions worldwide. Founded by Waleed Khalid.",
              founder: {
                "@type": "Person",
                name: "Waleed Khalid",
                jobTitle: "Founder & CEO",
                email: "waleedkhalidop604@gmail.com",
              },
              foundingDate: "2024",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+92-341-6561511",
                  contactType: "customer service",
                  email: "waleedkhalidop604@gmail.com",
                  availableLanguage: ["English"],
                  areaServed: ["Worldwide"],
                  hoursAvailable: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "09:00",
                    closes: "18:00",
                  },
                },
              ],
              address: {
                "@type": "PostalAddress",
                addressCountry: "PK",
              },
              sameAs: [
                "https://wa.me/923416561511",
                "mailto:waleedkhalidop604@gmail.com",
                "https://facebook.com/zyrensports",
                "https://instagram.com/zyrensports",
                "https://twitter.com/zyrensports",
              ],
              areaServed: [
                {
                  "@type": "Place",
                  name: "Asia",
                },
                {
                  "@type": "Place",
                  name: "Europe",
                },
                {
                  "@type": "Place",
                  name: "North America",
                },
                {
                  "@type": "Place",
                  name: "Africa",
                },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Athletic Wear Collection",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Athletic Shoes",
                      category: "Footwear",
                      brand: "Zyren Sports",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Men's Sportswear",
                      category: "Clothing",
                      brand: "Zyren Sports",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Women's Athletic Wear",
                      category: "Clothing",
                      brand: "Zyren Sports",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Athletic Accessories",
                      category: "Accessories",
                      brand: "Zyren Sports",
                    },
                  },
                ],
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1247",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />

        {/* Enhanced Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://zyrensports.com/#website",
              url: "https://zyrensports.com",
              name: "Zyren Sports",
              description: "Premium athletic wear for champions worldwide",
              publisher: {
                "@id": "https://zyrensports.com/#organization",
              },
              potentialAction: [
                {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://zyrensports.com/products?search={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              ],
              inLanguage: "en-US",
            }),
          }}
        />

        {/* Breadcrumb Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://zyrensports.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Products",
                  item: "https://zyrensports.com/products",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Contact",
                  item: "https://zyrensports.com/contact",
                },
              ],
            }),
          }}
        />

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />

        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-XXXXXXX');
            `,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {children}
      </body>
    </html>
  )
}
