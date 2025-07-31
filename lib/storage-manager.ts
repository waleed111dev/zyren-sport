// Enhanced storage manager with multiple fallbacks and persistence
export interface Product {
  id: number
  name: string
  price: number
  images: string[]
  category: string
  description: string
  inStock: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export class StorageManager {
  private static readonly STORAGE_KEY = "zyren-products-v3"
  private static readonly BACKUP_KEY = "zyren-products-backup-v3"
  private static readonly SYNC_KEY = "zyren-products-sync"
  private static cache: Product[] | null = null
  private static isInitialized = false

  // Initialize storage with multiple fallbacks
  static async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Try to load from multiple sources
      let products = this.loadFromLocalStorage()

      if (!products || products.length === 0) {
        products = this.loadFromBackup()
      }

      if (!products || products.length === 0) {
        products = this.getDefaultProducts()
        await this.saveProducts(products)
      }

      this.cache = products
      this.isInitialized = true

      console.log(`Storage initialized with ${products.length} products`)
    } catch (error) {
      console.error("Storage initialization failed:", error)
      this.cache = this.getDefaultProducts()
      this.isInitialized = true
    }
  }

  // Get default products
  private static getDefaultProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Pro Runner Sneakers",
        price: 129.99,
        images: ["/placeholder.svg?height=300&width=300"],
        category: "Shoes",
        description: "High-performance running shoes with advanced cushioning",
        inStock: true,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
  }

  // Load products with multiple attempts
  static async loadProducts(): Promise<Product[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    // Return cached version if available
    if (this.cache && this.cache.length > 0) {
      return [...this.cache]
    }

    // Try loading again
    const products = this.loadFromLocalStorage() || this.loadFromBackup() || this.getDefaultProducts()
    this.cache = products
    return [...products]
  }

  // Save products with multiple backups and verification
  static async saveProducts(products: Product[]): Promise<boolean> {
    try {
      // Add timestamps
      const timestampedProducts = products.map((product) => ({
        ...product,
        updatedAt: new Date().toISOString(),
        createdAt: product.createdAt || new Date().toISOString(),
      }))

      // Create backup before saving
      const currentData = localStorage.getItem(this.STORAGE_KEY)
      if (currentData) {
        localStorage.setItem(this.BACKUP_KEY, currentData)
      }

      // Save to localStorage with error handling
      const dataToSave = JSON.stringify(timestampedProducts)
      localStorage.setItem(this.STORAGE_KEY, dataToSave)

      // Verify the save was successful
      const verification = localStorage.getItem(this.STORAGE_KEY)
      if (!verification || verification !== dataToSave) {
        throw new Error("Save verification failed")
      }

      // Update cache
      this.cache = timestampedProducts

      // Save sync timestamp
      localStorage.setItem(this.SYNC_KEY, Date.now().toString())

      console.log(`Successfully saved ${products.length} products`)
      return true
    } catch (error) {
      console.error("Failed to save products:", error)

      // Try to restore from backup
      try {
        const backup = localStorage.getItem(this.BACKUP_KEY)
        if (backup) {
          localStorage.setItem(this.STORAGE_KEY, backup)
          console.log("Restored from backup after save failure")
        }
      } catch (restoreError) {
        console.error("Backup restore also failed:", restoreError)
      }

      return false
    }
  }

  // Load from localStorage with error handling
  private static loadFromLocalStorage(): Product[] | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      if (!data) return null

      const products = JSON.parse(data)
      if (!Array.isArray(products)) return null

      // Validate product structure
      const validProducts = products.filter(this.isValidProduct)

      if (validProducts.length !== products.length) {
        console.warn(`Filtered out ${products.length - validProducts.length} invalid products`)
      }

      return validProducts.length > 0 ? validProducts : null
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
      return null
    }
  }

  // Load from backup
  private static loadFromBackup(): Product[] | null {
    try {
      const backup = localStorage.getItem(this.BACKUP_KEY)
      if (!backup) return null

      const products = JSON.parse(backup)
      if (!Array.isArray(products)) return null

      const validProducts = products.filter(this.isValidProduct)
      console.log(`Loaded ${validProducts.length} products from backup`)

      return validProducts.length > 0 ? validProducts : null
    } catch (error) {
      console.error("Failed to load from backup:", error)
      return null
    }
  }

  // Validate product structure
  private static isValidProduct(product: any): product is Product {
    return (
      product &&
      typeof product.id === "number" &&
      typeof product.name === "string" &&
      typeof product.price === "number" &&
      Array.isArray(product.images) &&
      typeof product.category === "string" &&
      typeof product.description === "string" &&
      typeof product.inStock === "boolean" &&
      typeof product.featured === "boolean"
    )
  }

  // Add product with proper ID generation
  static async addProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product | null> {
    try {
      const products = await this.loadProducts()

      // Generate unique ID
      const maxId = products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0
      const newId = maxId + 1

      const newProduct: Product = {
        ...productData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const updatedProducts = [...products, newProduct]
      const success = await this.saveProducts(updatedProducts)

      if (success) {
        return newProduct
      }
      return null
    } catch (error) {
      console.error("Failed to add product:", error)
      return null
    }
  }

  // Update product
  static async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    try {
      const products = await this.loadProducts()
      const productIndex = products.findIndex((p) => p.id === id)

      if (productIndex === -1) {
        console.error(`Product with ID ${id} not found`)
        return false
      }

      products[productIndex] = {
        ...products[productIndex],
        ...updates,
        id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      }

      return await this.saveProducts(products)
    } catch (error) {
      console.error("Failed to update product:", error)
      return false
    }
  }

  // Delete product with verification
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      const products = await this.loadProducts()
      const initialCount = products.length

      const filteredProducts = products.filter((p) => p.id !== id)

      if (filteredProducts.length === initialCount) {
        console.error(`Product with ID ${id} not found for deletion`)
        return false
      }

      const success = await this.saveProducts(filteredProducts)

      if (success) {
        console.log(`Successfully deleted product ${id}. Products: ${initialCount} -> ${filteredProducts.length}`)

        // Verify deletion
        const verificationProducts = await this.loadProducts()
        const stillExists = verificationProducts.some((p) => p.id === id)

        if (stillExists) {
          console.error(`Product ${id} still exists after deletion attempt`)
          return false
        }

        return true
      }

      return false
    } catch (error) {
      console.error("Failed to delete product:", error)
      return false
    }
  }

  // Get product by ID
  static async getProduct(id: number): Promise<Product | null> {
    try {
      const products = await this.loadProducts()
      return products.find((p) => p.id === id) || null
    } catch (error) {
      console.error("Failed to get product:", error)
      return null
    }
  }

  // Clear all data
  static async clearAll(): Promise<boolean> {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.BACKUP_KEY)
      localStorage.removeItem(this.SYNC_KEY)
      this.cache = null
      this.isInitialized = false
      return true
    } catch (error) {
      console.error("Failed to clear storage:", error)
      return false
    }
  }

  // Get storage statistics
  static getStorageInfo(): {
    totalProducts: number
    storageSize: number
    lastSync: string | null
    cacheStatus: string
  } {
    const data = localStorage.getItem(this.STORAGE_KEY)
    const syncTime = localStorage.getItem(this.SYNC_KEY)

    return {
      totalProducts: this.cache?.length || 0,
      storageSize: data?.length || 0,
      lastSync: syncTime ? new Date(Number(syncTime)).toLocaleString() : null,
      cacheStatus: this.cache ? "Active" : "Empty",
    }
  }

  // Force refresh from storage
  static async forceRefresh(): Promise<Product[]> {
    this.cache = null
    this.isInitialized = false
    return await this.loadProducts()
  }

  // Export data for sharing between devices
  static async exportData(): Promise<string> {
    const products = await this.loadProducts()
    return JSON.stringify(
      {
        products,
        exportDate: new Date().toISOString(),
        version: "3.0",
      },
      null,
      2,
    )
  }

  // Import data from another device
  static async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData)

      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid import data format")
      }

      const validProducts = data.products.filter(this.isValidProduct)

      if (validProducts.length === 0) {
        throw new Error("No valid products found in import data")
      }

      const success = await this.saveProducts(validProducts)

      if (success) {
        console.log(`Successfully imported ${validProducts.length} products`)
      }

      return success
    } catch (error) {
      console.error("Failed to import data:", error)
      return false
    }
  }
}
