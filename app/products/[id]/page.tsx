"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, Star, MessageCircle } from "lucide-react"
import { useParams } from "next/navigation"

// Default product structure to prevent undefined errors
const defaultProduct = {
  id: 1,
  name: "Product",
  price: 0,
  images: ["/placeholder.svg?height=500&width=500"],
  category: "General",
  description: "Product description",
  features: ["Feature 1", "Feature 2"],
  sizes: ["S", "M", "L"],
  inStock: true,
  rating: 4.5,
  reviews: 0,
}

export default function ProductDetailPage() {
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  // Load the specific product
  useEffect(() => {
    const savedProducts = localStorage.getItem("zyren-products")
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        const foundProduct = parsedProducts.find((p: any) => p.id === productId)

        if (foundProduct) {
          // Ensure all required properties exist with defaults
          const safeProduct = {
            ...defaultProduct,
            ...foundProduct,
            images: foundProduct.images && foundProduct.images.length > 0 ? foundProduct.images : defaultProduct.images,
            features: foundProduct.features || defaultProduct.features,
            sizes: foundProduct.sizes || defaultProduct.sizes,
            rating: foundProduct.rating || defaultProduct.rating,
            reviews: foundProduct.reviews || defaultProduct.reviews,
          }
          setProduct(safeProduct)
        } else {
          // If product not found, use default with the requested ID
          setProduct({ ...defaultProduct, id: productId, name: `Product ${productId}` })
        }
      } catch (error) {
        console.error("Error loading product:", error)
        setProduct({ ...defaultProduct, id: productId, name: `Product ${productId}` })
      }
    } else {
      // No saved products, use default
      setProduct({ ...defaultProduct, id: productId, name: `Product ${productId}` })
    }
    setIsLoading(false)
  }, [productId])

  const [selectedImage, setSelectedSize] = useState(0)
  const [selectedSize, setSelectedImage] = useState("")
  const [quantity, setQuantity] = useState(1)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  // Product not found state
  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-green-600 hover:text-green-700">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black">
                ZYREN SPORTS
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-900 hover:text-green-600 transition-colors">
                Products
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-green-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={
                  product.images && product.images[selectedImage]
                    ? product.images[selectedImage]
                    : "/placeholder.svg?height=500&width=500"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index ? "border-green-600" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg?height=200&width=200"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating Section */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating || 0} ({product.reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="text-3xl font-bold text-green-600 mb-6">${product.price}</div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Features Section */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Size</h3>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-md text-center transition-colors ${
                        selectedSize === size
                          ? "border-green-600 bg-green-50 text-green-600"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // Remove the disable check here - let users buy without size if needed
                  const sizeText = selectedSize ? `Size: ${selectedSize}` : "Size: One Size"
                  const message = `Hi! I'm interested in purchasing:

Product: ${product.name}
Price: $${product.price}
${sizeText}
Quantity: ${quantity}
Total: $${(product.price * quantity).toFixed(2)}

Please let me know about availability and payment options.`

                  // Updated WhatsApp URL with proper formatting
                  const whatsappUrl = `https://wa.me/923416561511?text=${encodeURIComponent(message)}`

                  // Add error handling
                  try {
                    window.open(whatsappUrl, "_blank")
                  } catch (error) {
                    // Fallback - copy to clipboard
                    navigator.clipboard.writeText(`WhatsApp: +92 341 6561511\n\n${message}`)
                    alert("WhatsApp link copied to clipboard! Please paste it in WhatsApp.")
                  }
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Buy via WhatsApp - ${(product.price * quantity).toFixed(2)}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-transparent"
                onClick={() => {
                  const testMessage = "Hi! I'm testing the WhatsApp connection from Zyren Sports website."
                  const whatsappUrl = `https://wa.me/923416561511?text=${encodeURIComponent(testMessage)}`
                  window.open(whatsappUrl, "_blank")
                }}
              >
                Test WhatsApp Connection
              </Button>

              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
                <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">ZYREN SPORTS</h3>
              <p className="text-gray-400">Premium athletic wear for champions worldwide.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/products?category=men" className="text-gray-400 hover:text-white transition-colors">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=women" className="text-gray-400 hover:text-white transition-colors">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=shoes" className="text-gray-400 hover:text-white transition-colors">
                    Shoes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=accessories"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <p className="text-gray-400 mb-2">Email: waleedkhalidop604@gmail.com</p>
              <p className="text-gray-400 mb-2">Phone: +92 341 6561511</p>
              <p className="text-gray-400">Serving Asia, Europe, America & Africa</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Zyren Sports. All rights reserved. Founded by Waleed Khalid.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
