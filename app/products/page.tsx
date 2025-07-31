import type { Metadata } from "next"
import ProductsClientPage from "./ProductsClientPage"

export const metadata: Metadata = {
  title: "Premium Athletic Products | Zyren Sports Collection",
  description:
    "Shop our complete collection of premium athletic wear including running shoes, gym clothes, sportswear for men and women. High-quality athletic accessories and fitness gear with worldwide shipping.",
  keywords: [
    "athletic products",
    "sportswear collection",
    "running shoes",
    "gym clothes",
    "men's athletic wear",
    "women's sportswear",
    "fitness accessories",
    "premium sports clothing",
    "athletic footwear",
    "workout gear",
    "sports apparel",
    "fitness wear",
    "athletic performance clothing",
    "premium athletic brand",
  ],
  openGraph: {
    title: "Premium Athletic Products | Zyren Sports Collection",
    description:
      "Shop our complete collection of premium athletic wear including running shoes, gym clothes, sportswear for men and women.",
    url: "https://zyrensports.com/products",
    images: [
      {
        url: "/products-og-image.png",
        width: 1200,
        height: 630,
        alt: "Zyren Sports Products Collection",
      },
    ],
  },
  alternates: {
    canonical: "https://zyrensports.com/products",
  },
}

export default function ProductsPage() {
  return (
    <>
      {/* Products Page Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": "https://zyrensports.com/products#webpage",
            url: "https://zyrensports.com/products",
            name: "Premium Athletic Products Collection",
            description: "Complete collection of premium athletic wear and accessories",
            isPartOf: {
              "@id": "https://zyrensports.com/#website",
            },
            mainEntity: {
              "@type": "ItemList",
              name: "Athletic Products",
              description: "Premium athletic wear collection",
              numberOfItems: "100+",
              itemListElement: [
                {
                  "@type": "Product",
                  name: "Athletic Shoes",
                  category: "Footwear",
                  brand: "Zyren Sports",
                },
                {
                  "@type": "Product",
                  name: "Men's Sportswear",
                  category: "Clothing",
                  brand: "Zyren Sports",
                },
                {
                  "@type": "Product",
                  name: "Women's Athletic Wear",
                  category: "Clothing",
                  brand: "Zyren Sports",
                },
              ],
            },
          }),
        }}
      />
      <ProductsClientPage />
    </>
  )
}
