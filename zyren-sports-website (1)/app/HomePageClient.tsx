"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star, Truck, Trophy, Target, Zap, Users } from "lucide-react"

export default function HomePageClient() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(true)
  const [splashPhase, setSplashPhase] = useState(0)

  // Splash screen animation sequence - NO SOUND
  useEffect(() => {
    const timer1 = setTimeout(() => setSplashPhase(1), 1000)
    const timer2 = setTimeout(() => setSplashPhase(2), 2500)
    const timer3 = setTimeout(() => setShowSplash(false), 3000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  // Load featured products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("zyren-products")
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        const featured = parsedProducts.filter((product: any) => product.featured && product.inStock)
        setFeaturedProducts(featured.slice(0, 6))
      } catch (error) {
        console.error("Error loading products:", error)
        setFeaturedProducts([])
      }
    }
    setIsLoading(false)
  }, [])

  // Modern Athletic Splash Screen
  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-green-900"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-green-500 rotate-45 animate-spin-slow"></div>
            <div className="absolute top-40 right-32 w-24 h-24 border-2 border-green-400 rotate-12 animate-pulse"></div>
            <div className="absolute bottom-32 left-40 w-40 h-40 border-2 border-green-300 -rotate-45 animate-spin-slow"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-green-600 rotate-90 animate-pulse delay-500"></div>
          </div>
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-green-500"></div>
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border-b border-green-500"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 transform ${
                splashPhase >= 0 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
              }`}
            >
              <div className="relative mb-8">
                <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse">
                  <div className="w-40 h-40 rounded-full bg-black flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-black text-green-500 mb-1">Z</div>
                      <div className="text-2xl font-bold text-white">SPORTS</div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="absolute top-4 left-1/2 w-3 h-3 bg-green-400 rounded-full -translate-x-1/2"></div>
                  <div className="absolute bottom-4 left-1/2 w-3 h-3 bg-green-400 rounded-full -translate-x-1/2"></div>
                  <div className="absolute left-4 top-1/2 w-3 h-3 bg-green-400 rounded-full -translate-y-1/2"></div>
                  <div className="absolute right-4 top-1/2 w-3 h-3 bg-green-400 rounded-full -translate-y-1/2"></div>
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-wider">
                <span className="text-green-500">ZYREN</span>
              </h1>
              <div className="flex justify-center items-center mb-6">
                <div className="w-16 h-1 bg-green-600"></div>
                <div className="w-4 h-4 bg-green-500 rounded-full mx-4 animate-pulse"></div>
                <div className="w-16 h-1 bg-green-600"></div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-300 transform ${
                splashPhase >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-2xl md:text-3xl text-gray-300 font-light mb-4">ATHLETIC EXCELLENCE</p>
              <div className="text-green-400 text-lg font-semibold tracking-widest">FOUNDED BY WALEED KHALID</div>
              <div className="mt-12">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-300"></div>
                </div>
                <p className="text-green-300 text-sm tracking-wider">LOADING EXPERIENCE</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
            splashPhase >= 2 ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-3xl font-black text-black tracking-tight">
                <span className="text-green-600">ZYREN</span>
                <span className="text-gray-800 font-light ml-1">SPORTS</span>
              </Link>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                Home
              </Link>
              <Link href="/products" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                Products
              </Link>
              <Link href="/contact" className="text-gray-900 hover:text-green-600 transition-colors font-medium">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-green-600 transition-colors text-sm">
                Admin
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-gray-900" aria-label="Open menu">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Perfect Athletic Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Perfect Athletic Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-background.png"
            alt="Premium Athletic Training Facility - Zyren Sports"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
          />
          {/* Enhanced Gradient Overlay for Better Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
          {/* Athletic Green Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-green-800/20"></div>
        </div>

        {/* Dynamic Athletic Elements */}
        <div className="absolute inset-0 z-10">
          {/* Floating Athletic Particles */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-2xl shadow-green-500/50 opacity-80"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-green-400 rounded-full animate-bounce shadow-2xl shadow-green-400/50 opacity-70"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-white rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-green-300 rounded-full animate-pulse delay-1000 shadow-2xl shadow-green-300/50 opacity-75"></div>

          {/* Athletic Energy Lines */}
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/40 to-transparent animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/30 to-transparent animate-pulse delay-1000"></div>

          {/* Corner Athletic Accents */}
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-green-500/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-green-400/40 -rotate-45 animate-pulse"></div>
        </div>

        {/* Hero Content with Enhanced Typography */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <div className="mb-8">
            {/* Main Brand Title with Athletic Styling */}
            <h1 className="text-7xl md:text-9xl font-black text-white mb-6 tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-600 drop-shadow-2xl filter">
                ZYREN
              </span>
              <br />
              <span className="text-5xl md:text-7xl font-light text-white drop-shadow-2xl">SPORTS</span>
            </h1>

            {/* Athletic Divider */}
            <div className="flex justify-center items-center mb-8">
              <div className="w-8 h-1 bg-green-600 shadow-lg"></div>
              <div className="w-6 h-6 bg-green-500 rounded-full mx-4 animate-pulse shadow-2xl shadow-green-500/50"></div>
              <div className="w-32 h-1 bg-green-500 shadow-lg"></div>
              <div className="w-6 h-6 bg-green-500 rounded-full mx-4 animate-pulse shadow-2xl shadow-green-500/50"></div>
              <div className="w-8 h-1 bg-green-600 shadow-lg"></div>
            </div>

            {/* Enhanced Tagline */}
            <p className="text-2xl md:text-3xl text-gray-100 max-w-4xl mx-auto leading-relaxed mb-4 font-light">
              Unleash Your Athletic Potential with Premium Sportswear
            </p>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
              <span className="text-green-400 font-bold tracking-wide">Performance</span>
              <span className="text-white mx-3">•</span>
              <span className="text-green-400 font-bold tracking-wide">Style</span>
              <span className="text-white mx-3">•</span>
              <span className="text-green-400 font-bold tracking-wide">Excellence</span>
            </p>

            {/* Founder Credit with Athletic Styling */}
            <div className="mt-8 text-green-300 text-xl font-light tracking-wide">
              Founded by <span className="font-bold text-green-400 text-2xl">Waleed Khalid</span>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-6 text-xl font-bold rounded-full shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-110 border-2 border-green-500"
            >
              <Link href="/products">
                <Zap className="mr-3 h-7 w-7" />
                Shop Now
                <ArrowRight className="ml-3 h-7 w-7" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-3 border-white text-white hover:bg-white hover:text-black bg-transparent/20 backdrop-blur-sm px-12 py-6 text-xl font-bold rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl"
            >
              <Link href="/contact">
                <Users className="mr-3 h-7 w-7" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-8 h-12 border-3 border-white rounded-full flex justify-center shadow-2xl bg-white/10 backdrop-blur-sm">
              <div className="w-2 h-4 bg-white rounded-full mt-2 animate-pulse shadow-lg"></div>
            </div>
            <p className="text-white text-sm mt-2 font-light tracking-wider">SCROLL DOWN</p>
          </div>
        </div>
      </section>

      {/* Brand Stats */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">50K+</div>
              <div className="text-green-100">Athletes Trust Us</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">100+</div>
              <div className="text-green-100">Premium Products</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">25+</div>
              <div className="text-green-100">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-bold">99%</div>
              <div className="text-green-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">ZYREN</span> Sports
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Founded by <span className="font-semibold text-green-600">Waleed Khalid</span>, ZYREN Sports is dedicated
              to providing premium athletic wear that combines cutting-edge technology, unmatched style, and peak
              performance. We serve athletes and fitness enthusiasts across
              <span className="font-semibold"> Asia, Europe, America, and Africa</span> with high-quality sportswear
              designed to help you achieve your absolute best.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Championship Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Premium materials and precision craftsmanship in every product, trusted by professional athletes
                worldwide
              </p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Global Delivery</h3>
              <p className="text-gray-600 leading-relaxed">
                Lightning-fast and reliable worldwide shipping with real-time tracking and premium packaging
              </p>
            </div>
            <div className="text-center group hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Performance Focus</h3>
              <p className="text-gray-600 leading-relaxed">
                Every product engineered for peak performance, comfort, and durability to push your limits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="text-green-600">Products</span>
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600">Discover our most popular and high-performance athletic wear</p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 shadow-lg"
                  >
                    <CardContent className="p-0 overflow-hidden rounded-lg">
                      <div className="relative">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={`${product.name} - Premium Athletic Wear by Zyren Sports`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        <div className="absolute top-4 left-4">
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Featured
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6 bg-white">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-green-600">${product.price}</span>
                          <Button asChild size="sm" className="bg-green-600 hover:bg-green-700 rounded-full">
                            <Link href={`/products/${product.id}`}>
                              View Details
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-16">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 bg-transparent"
                >
                  <Link href="/products">
                    View All Products
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Star className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Featured Products Yet</h3>
              <p className="text-gray-600 mb-6">
                Add products in the admin panel and mark them as "Featured" to display them here.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin">Go to Admin Panel</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/placeholder.svg?height=600&width=1200&text=Athletic+Pattern"
            alt="Athletic Pattern Background"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to <span className="text-green-500">Dominate</span>?
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of athletes who trust ZYREN Sports for their performance gear
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Link href="/products">
                <Zap className="mr-2 h-6 w-6" />
                Shop Collection
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-10 py-4 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent"
            >
              <Link href="/contact">Get In Touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-black mb-4">
                <span className="text-green-500">ZYREN</span> SPORTS
              </h3>
              <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                Premium athletic wear for champions worldwide. Founded by{" "}
                <span className="text-green-400 font-semibold">Waleed Khalid</span>, we're dedicated to helping athletes
                achieve their peak performance.
              </p>
              <p className="text-gray-400 mb-2">Email: waleedkhalidop604@gmail.com</p>
              <p className="text-gray-400 mb-2">Phone: +92 341 6561511</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors cursor-pointer">
                  <span className="text-white font-bold">i</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-green-500">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-green-500">Categories</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/products?category=men"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Men's Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=women"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Women's Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=shoes"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Athletic Shoes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products?category=accessories"
                    className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200 inline-block"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 ZYREN Sports. All rights reserved. Founded by{" "}
                <span className="text-green-400">Waleed Khalid</span>.
              </p>
              <p className="text-gray-400">Serving Asia • Europe • America • Africa</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
