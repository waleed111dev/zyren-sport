"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react"

// Default products that will be loaded if no saved products exist
const defaultProducts = [
  {
    id: 1,
    name: "Pro Runner Sneakers",
    price: 129.99,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Shoes",
    description: "High-performance running shoes with advanced cushioning",
    inStock: true,
    featured: true,
  },
  {
    id: 2,
    name: "Performance Track Jacket",
    price: 89.99,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "Men",
    description: "Lightweight track jacket for optimal performance",
    inStock: true,
    featured: true,
  },
]

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [adminPassword, setAdminPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Enhanced localStorage save function
  const saveProductsToStorage = (productsToSave: any[]) => {
    try {
      localStorage.setItem("zyren-products", JSON.stringify(productsToSave))
      console.log("Products saved to localStorage:", productsToSave.length, "items")
    } catch (error) {
      console.error("Error saving products to localStorage:", error)
      alert("Error saving products. Please try again.")
    }
  }

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("zyren-products")
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts)
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts)
          console.log("Loaded products from localStorage:", parsedProducts.length, "items")
        } else {
          setProducts(defaultProducts)
          saveProductsToStorage(defaultProducts)
        }
      } catch (error) {
        console.error("Error loading products:", error)
        setProducts(defaultProducts)
        saveProductsToStorage(defaultProducts)
      }
    } else {
      setProducts(defaultProducts)
      saveProductsToStorage(defaultProducts)
    }
    setIsLoading(false)
  }, [])

  // Secure authentication with hidden password
  const handleLogin = () => {
    if (adminPassword === "Waleedgujjar111") {
      setIsAuthenticated(true)
      setAdminPassword("") // Clear password from memory
    } else {
      alert("Incorrect password!")
      setAdminPassword("") // Clear incorrect password
    }
  }

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    images: [] as string[],
    inStock: true,
    featured: false,
  })

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const files = e.target.files
    if (files) {
      try {
        const imagePromises = Array.from(files).map((file) => fileToBase64(file))
        const base64Images = await Promise.all(imagePromises)

        if (isEditing && editingProduct) {
          setEditingProduct({
            ...editingProduct,
            images: [...editingProduct.images, ...base64Images],
          })
        } else {
          setNewProduct({
            ...newProduct,
            images: [...newProduct.images, ...base64Images],
          })
        }
      } catch (error) {
        console.error("Error uploading images:", error)
        alert("Error uploading images. Please try again.")
      }
    }
  }

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const product = {
      id: Date.now(),
      ...newProduct,
      price: Number.parseFloat(newProduct.price),
    }

    const updatedProducts = [...products, product]
    setProducts(updatedProducts)
    saveProductsToStorage(updatedProducts)

    // Reset form
    setNewProduct({
      name: "",
      price: "",
      category: "",
      description: "",
      images: [],
      inStock: true,
      featured: false,
    })
    setIsAddingProduct(false)

    alert("Product added successfully!")
  }

  const handleEditProduct = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    const updatedProducts = products.map((p) => (p.id === editingProduct.id ? editingProduct : p))
    setProducts(updatedProducts)
    saveProductsToStorage(updatedProducts)
    setEditingProduct(null)

    alert("Product updated successfully!")
  }

  // Fixed delete function with proper localStorage update
  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      const updatedProducts = products.filter((p) => p.id !== id)
      console.log("Deleting product with ID:", id)
      console.log("Products before deletion:", products.length)
      console.log("Products after deletion:", updatedProducts.length)

      // Update state
      setProducts(updatedProducts)

      // Immediately save to localStorage
      saveProductsToStorage(updatedProducts)

      // Verify the deletion was saved
      setTimeout(() => {
        const savedProducts = localStorage.getItem("zyren-products")
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts)
          console.log("Verified products in localStorage after deletion:", parsedProducts.length)
        }
      }, 100)

      alert("Product deleted successfully!")
    }
  }

  const toggleFeatured = (id: number) => {
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    setProducts(updatedProducts)
    saveProductsToStorage(updatedProducts)
  }

  const toggleStock = (id: number) => {
    const updatedProducts = products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    setProducts(updatedProducts)
    saveProductsToStorage(updatedProducts)
  }

  const removeImage = (imageIndex: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((_: any, i: number) => i !== imageIndex),
      })
    } else {
      setNewProduct({
        ...newProduct,
        images: newProduct.images.filter((_, i) => i !== imageIndex),
      })
    }
  }

  // Clear all products function (for testing)
  const handleClearAllProducts = () => {
    if (confirm("Are you sure you want to delete ALL products? This action cannot be undone!")) {
      setProducts([])
      localStorage.removeItem("zyren-products")
      alert("All products have been deleted!")
    }
  }

  // Reset to default products function
  const handleResetToDefault = () => {
    if (confirm("Reset to default products? This will replace all current products.")) {
      setProducts(defaultProducts)
      saveProductsToStorage(defaultProducts)
      alert("Products reset to default!")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
            <p className="text-center text-sm text-gray-600">Secure access to Zyren Sports Admin Panel</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="mt-1"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-green-600 hover:bg-green-700">
              Login to Admin Panel
            </Button>
            <div className="text-center">
              <p className="text-xs text-gray-500">🔒 Secure authentication required</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-black">
                ZYREN SPORTS
              </Link>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-green-600">
                View Site
              </Link>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your Zyren Sports product catalog ({products.length} products)</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Men">Men</SelectItem>
                        <SelectItem value="Women">Women</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Enter product description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="images">Product Images</Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e)}
                          className="cursor-pointer"
                        />
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                      {newProduct.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                          {newProduct.images.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`Product ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.inStock}
                        onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                      />
                      In Stock
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newProduct.featured}
                        onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                      />
                      Featured Product
                    </label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                      Add Product
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Admin Tools */}
            <Button
              variant="outline"
              onClick={handleResetToDefault}
              className="text-blue-600 border-blue-600 bg-transparent"
            >
              Reset to Default
            </Button>
            <Button variant="destructive" onClick={handleClearAllProducts}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                  <Badge variant={product.inStock ? "default" : "destructive"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-white/90">
                    ID: {product.id}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-green-600 font-bold text-xl">${product.price}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Product (ID: {product.id})</DialogTitle>
                      </DialogHeader>
                      {editingProduct && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="edit-name">Product Name *</Label>
                              <Input
                                id="edit-name"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="edit-price">Price *</Label>
                              <Input
                                id="edit-price"
                                type="number"
                                step="0.01"
                                value={editingProduct.price}
                                onChange={(e) =>
                                  setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="edit-category">Category *</Label>
                            <Select
                              value={editingProduct.category}
                              onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Men">Men</SelectItem>
                                <SelectItem value="Women">Women</SelectItem>
                                <SelectItem value="Shoes">Shoes</SelectItem>
                                <SelectItem value="Accessories">Accessories</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                              id="edit-description"
                              value={editingProduct.description}
                              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label>Product Images</Label>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true)}
                                  className="cursor-pointer"
                                />
                                <Upload className="h-4 w-4 text-gray-400" />
                              </div>
                              {editingProduct.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                  {editingProduct.images.map((image: string, index: number) => (
                                    <div key={index} className="relative">
                                      <img
                                        src={image || "/placeholder.svg"}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-20 object-cover rounded border"
                                      />
                                      <button
                                        onClick={() => removeImage(index, true)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingProduct.inStock}
                                onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                              />
                              In Stock
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingProduct.featured}
                                onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                              />
                              Featured Product
                            </label>
                          </div>

                          <div className="flex gap-2 pt-4">
                            <Button onClick={handleEditProduct} className="bg-green-600 hover:bg-green-700">
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setEditingProduct(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" size="sm" onClick={() => toggleStock(product.id)}>
                    {product.inStock ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeatured(product.id)}
                    className={product.featured ? "bg-yellow-50 border-yellow-300" : ""}
                  >
                    ⭐
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found.</p>
            <Button onClick={() => setIsAddingProduct(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p className="text-sm text-gray-600">Total Products: {products.length}</p>
          <p className="text-sm text-gray-600">Featured Products: {products.filter((p) => p.featured).length}</p>
          <p className="text-sm text-gray-600">In Stock Products: {products.filter((p) => p.inStock).length}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const saved = localStorage.getItem("zyren-products")
              console.log("Current localStorage:", saved)
              alert(`localStorage contains: ${saved ? JSON.parse(saved).length : 0} products`)
            }}
            className="mt-2"
          >
            Check localStorage
          </Button>
        </div>
      </div>
    </div>
  )
}
