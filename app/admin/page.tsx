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
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Download, RefreshCw, AlertCircle } from "lucide-react"
import { StorageManager, type Product } from "@/lib/storage-manager"

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [adminPassword, setAdminPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [storageInfo, setStorageInfo] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load products using enhanced storage manager
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true)
        await StorageManager.initialize()
        const loadedProducts = await StorageManager.loadProducts()
        setProducts(loadedProducts)
        setStorageInfo(StorageManager.getStorageInfo())
        console.log(`Loaded ${loadedProducts.length} products successfully`)
      } catch (error) {
        console.error("Failed to initialize data:", error)
        alert("Error loading products. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // Update storage info when products change
  useEffect(() => {
    if (!isLoading) {
      setStorageInfo(StorageManager.getStorageInfo())
    }
  }, [products, isLoading])

  // Secure authentication
  const handleLogin = () => {
    if (adminPassword === "Waleedgujjar111") {
      setIsAuthenticated(true)
      setAdminPassword("")
    } else {
      alert("Incorrect password!")
      setAdminPassword("")
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
      setIsProcessing(true)
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
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    try {
      const productData = {
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
      }

      const addedProduct = await StorageManager.addProduct(productData)

      if (addedProduct) {
        const updatedProducts = await StorageManager.loadProducts()
        setProducts(updatedProducts)

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

        alert(`Product "${addedProduct.name}" added successfully!`)
      } else {
        alert("Failed to add product. Please try again.")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Error adding product. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEditProduct = async () => {
    if (!editingProduct || !editingProduct.name || !editingProduct.price || !editingProduct.category) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)
    try {
      const success = await StorageManager.updateProduct(editingProduct.id, editingProduct)

      if (success) {
        const updatedProducts = await StorageManager.loadProducts()
        setProducts(updatedProducts)
        setEditingProduct(null)
        alert("Product updated successfully!")
      } else {
        alert("Failed to update product. Please try again.")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert("Error updating product. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    const product = products.find((p) => p.id === id)
    if (!product) {
      alert("Product not found!")
      return
    }

    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      setIsProcessing(true)
      try {
        const success = await StorageManager.deleteProduct(id)

        if (success) {
          const updatedProducts = await StorageManager.loadProducts()
          setProducts(updatedProducts)
          alert(`Product "${product.name}" deleted successfully!`)
        } else {
          alert("Failed to delete product. Please try again.")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Error deleting product. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const toggleFeatured = async (id: number) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      const success = await StorageManager.updateProduct(id, { featured: !product.featured })
      if (success) {
        const updatedProducts = await StorageManager.loadProducts()
        setProducts(updatedProducts)
      }
    }
  }

  const toggleStock = async (id: number) => {
    const product = products.find((p) => p.id === id)
    if (product) {
      const success = await StorageManager.updateProduct(id, { inStock: !product.inStock })
      if (success) {
        const updatedProducts = await StorageManager.loadProducts()
        setProducts(updatedProducts)
      }
    }
  }

  const removeImage = (imageIndex: number, isEditing = false) => {
    if (isEditing && editingProduct) {
      setEditingProduct({
        ...editingProduct,
        images: editingProduct.images.filter((_, i) => i !== imageIndex),
      })
    } else {
      setNewProduct({
        ...newProduct,
        images: newProduct.images.filter((_, i) => i !== imageIndex),
      })
    }
  }

  const handleClearAllProducts = async () => {
    if (confirm("Are you sure you want to delete ALL products? This action cannot be undone!")) {
      setIsProcessing(true)
      try {
        const success = await StorageManager.clearAll()
        if (success) {
          setProducts([])
          alert("All products have been deleted!")
        } else {
          alert("Failed to clear products. Please try again.")
        }
      } catch (error) {
        console.error("Error clearing products:", error)
        alert("Error clearing products. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleResetToDefault = async () => {
    if (confirm("Reset to default products? This will replace all current products.")) {
      setIsProcessing(true)
      try {
        await StorageManager.clearAll()
        await StorageManager.initialize()
        const defaultProducts = await StorageManager.loadProducts()
        setProducts(defaultProducts)
        alert("Products reset to default!")
      } catch (error) {
        console.error("Error resetting products:", error)
        alert("Error resetting products. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleExportProducts = async () => {
    try {
      const exportData = await StorageManager.exportData()
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `zyren-products-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting products:", error)
      alert("Error exporting products. Please try again.")
    }
  }

  const handleImportProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        try {
          const jsonData = event.target?.result as string
          const success = await StorageManager.importData(jsonData)
          if (success) {
            const importedProducts = await StorageManager.loadProducts()
            setProducts(importedProducts)
            alert("Products imported successfully!")
          } else {
            alert("Failed to import products. Please check the file format.")
          }
        } catch (error) {
          alert("Error reading file. Please ensure it's a valid JSON file.")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleForceRefresh = async () => {
    setIsLoading(true)
    try {
      const refreshedProducts = await StorageManager.forceRefresh()
      setProducts(refreshedProducts)
      alert("Data refreshed successfully!")
    } catch (error) {
      console.error("Error refreshing data:", error)
      alert("Error refreshing data. Please try again.")
    } finally {
      setIsLoading(false)
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
              {isProcessing && (
                <Badge variant="outline" className="animate-pulse">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Processing...
                </Badge>
              )}
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
        {/* Header with Storage Info */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your Zyren Sports product catalog ({products.length} products)</p>
            {storageInfo && (
              <div className="mt-2 flex gap-4 text-sm text-gray-500">
                <span>Storage: {(storageInfo.storageSize / 1024).toFixed(1)}KB</span>
                <span>Last Sync: {storageInfo.lastSync || "Never"}</span>
                <span>Cache: {storageInfo.cacheStatus}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700" disabled={isProcessing}>
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
                          disabled={isProcessing}
                        />
                        <Upload className="h-4 w-4 text-gray-400" />
                        {isProcessing && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
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
                    <Button
                      onClick={handleAddProduct}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Product"
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Enhanced Admin Tools */}
            <Button variant="outline" onClick={handleExportProducts}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportProducts}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>

            <Button variant="outline" onClick={handleForceRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <Button
              variant="outline"
              onClick={handleResetToDefault}
              className="text-blue-600 border-blue-600 bg-transparent"
            >
              Reset Default
            </Button>

            <Button variant="destructive" onClick={handleClearAllProducts} disabled={isProcessing}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Storage Status Alert */}
        {storageInfo && storageInfo.totalProducts !== products.length && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">
                Storage sync issue detected. Displayed: {products.length}, Stored: {storageInfo.totalProducts}
              </p>
              <Button size="sm" variant="outline" onClick={handleForceRefresh}>
                Fix Now
              </Button>
            </div>
          </div>
        )}

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
                  <p className="text-xs text-gray-400">Updated: {new Date(product.updatedAt).toLocaleDateString()}</p>
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
                                  disabled={isProcessing}
                                />
                                <Upload className="h-4 w-4 text-gray-400" />
                                {isProcessing && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
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
                            <Button
                              onClick={handleEditProduct}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
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
                    disabled={isProcessing}
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

        {/* Enhanced Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">System Information:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>Total Products: {products.length}</div>
            <div>Featured Products: {products.filter((p) => p.featured).length}</div>
            <div>In Stock Products: {products.filter((p) => p.inStock).length}</div>
            <div>Storage Size: {storageInfo ? (storageInfo.storageSize / 1024).toFixed(1) + "KB" : "Unknown"}</div>
          </div>
          <div className="mt-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const info = StorageManager.getStorageInfo()
                alert(
                  `Storage Info:\nProducts: ${info.totalProducts}\nSize: ${(info.storageSize / 1024).toFixed(1)}KB\nLast Sync: ${info.lastSync}\nCache: ${info.cacheStatus}`,
                )
              }}
            >
              Check Storage
            </Button>
            <Button variant="outline" size="sm" onClick={handleForceRefresh}>
              Force Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
