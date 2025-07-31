"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const categories = ["All", "Men", "Women", "Shoes", "Accessories"]

// Default products if none are saved
const defaultProducts = [
  {
    id: 1,
    name: "Pro Runner Sneakers",
    price: 129.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Shoes",
    description: "High-performance running shoes with advanced cushioning",
  },
  {
    id: 2,
    name: "Performance Track Jacket",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Men",
    description: "Lightweight track jacket for optimal performance",
  },
]

export default function ProductsClientPage() {
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("zyren-products")
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        // Only show products that are in stock
        const availableProducts = parsedProducts.filter((product: any) => product.inStock)
        setProducts(availableProducts)
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts(defaultProducts)
      }
    } else {
      setProducts(defaultProducts)
    }
    setIsLoading(false)
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading products...</p>
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
              <Link href="/products" className="text-gray-900 hover:text-green-600 transition-colors font-semibold">
                Products
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-green-600 transition-colors">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-500 hover:text-green-600 transition-colors text-sm">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-lg text-gray-600">Discover our complete collection of premium athletic wear</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0] || product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">${product.price}</span>
                      <span className="text-sm text-gray-500">{product.category}</span>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
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
