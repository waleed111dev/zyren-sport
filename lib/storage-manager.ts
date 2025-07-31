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

  // Fixed delete product with proper verification
  static async deleteProduct(id: number): Promise<boolean> {
    try {
      console.log(`🗑️ Starting deletion process for product ID: ${id}`)

      // Step 1: Load current products and verify product exists
      const currentProducts = await this.loadProducts()
      const productToDelete = currentProducts.find((p) => p.id === id)

      if (!productToDelete) {
        console.error(`❌ Product with ID ${id} not found`)
        return false
      }

      console.log(`📦 Found product to delete: "${productToDelete.name}"`)
      console.log(`📊 Current products count: ${currentProducts.length}`)

      // Step 2: Create filtered array WITHOUT the product to delete
      const filteredProducts = currentProducts.filter((p) => p.id !== id)
      console.log(`🔄 Filtered products count: ${filteredProducts.length}`)

      // Step 3: Verify the product was actually filtered out
      const stillInFiltered = filteredProducts.some((p) => p.id === id)
      if (stillInFiltered) {
        console.error(`❌ Product ${id} still exists in filtered array`)
        return false
      }

      // Step 4: Clear all storage first
      try {
        localStorage.removeItem(this.STORAGE_KEY)
        localStorage.removeItem(this.BACKUP_KEY)
        console.log(`🧹 Cleared existing storage`)
      } catch (error) {
        console.warn("Warning: Could not clear storage:", error)
      }

      // Step 5: Save the filtered products with multiple attempts
      let saveSuccess = false
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`💾 Save attempt ${attempt}/3`)

          // Create backup of current data
          const currentData = localStorage.getItem(this.STORAGE_KEY)
          if (currentData) {
            localStorage.setItem(this.BACKUP_KEY, currentData)
          }

          // Save filtered products
          const dataToSave = JSON.stringify(filteredProducts)
          localStorage.setItem(this.STORAGE_KEY, dataToSave)

          // Immediate verification
          const savedData = localStorage.getItem(this.STORAGE_KEY)
          if (savedData) {
            const parsedData = JSON.parse(savedData)
            const productStillExists = parsedData.some((p: any) => p.id === id)

            if (!productStillExists && parsedData.length === filteredProducts.length) {
              console.log(`✅ Save attempt ${attempt} successful`)
              saveSuccess = true
              break
            } else {
              console.warn(`⚠️ Save attempt ${attempt} failed verification`)
            }
          }

          // Wait before next attempt
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 100))
          }
        } catch (error) {
          console.error(`❌ Save attempt ${attempt} failed:`, error)
        }
      }

      if (!saveSuccess) {
        console.error(`❌ All save attempts failed for product ${id}`)
        return false
      }

      // Step 6: Update cache immediately
      this.cache = [...filteredProducts]
      console.log(`🔄 Cache updated, new count: ${this.cache.length}`)

      // Step 7: Final verification with a slightly longer delay
      await new Promise((resolve) => setTimeout(resolve, 300)) // Increased delay for final check

      const finalVerification = localStorage.getItem(this.STORAGE_KEY)
      if (finalVerification) {
        const finalProducts = JSON.parse(finalVerification)
        const finalCheck = finalProducts.some((p: any) => p.id === id)

        if (finalCheck) {
          console.error(`❌ CRITICAL: Product ${id} still exists after all attempts`)

          // Emergency cleanup - force remove from storage
          const emergencyFiltered = finalProducts.filter((p: any) => p.id !== id)
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(emergencyFiltered))
          this.cache = emergencyFiltered

          // Final emergency check
          const emergencyCheck = localStorage.getItem(this.STORAGE_KEY)
          if (emergencyCheck) {
            const emergencyProducts = JSON.parse(emergencyCheck)
            const stillThere = emergencyProducts.some((p: any) => p.id === id)
            if (stillThere) {
              console.error(`❌ EMERGENCY CLEANUP FAILED for product ${id}`)
              return false
            }
          }

          console.log(`🚨 Emergency cleanup successful for product ${id}`)
        }
      }

      // Step 8: Set sync timestamp
      localStorage.setItem(this.SYNC_KEY, Date.now().toString())

      console.log(`✅ Product ${id} ("${productToDelete.name}") successfully deleted`)
      console.log(`📊 Final count: ${filteredProducts.length} products`)

      // Add a debug call here to show the final state of storage
      await this.debugStorage()

      return true
    } catch (error) {
      console.error(`❌ Critical error during deletion of product ${id}:`, error)
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
      this.cache = []
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

  // Debug method to check storage consistency
  static async debugStorage(): Promise<void> {
    try {
      console.log("🔍 STORAGE DEBUG REPORT:")

      const storageData = localStorage.getItem(this.STORAGE_KEY)
      const backupData = localStorage.getItem(this.BACKUP_KEY)
      const syncTime = localStorage.getItem(this.SYNC_KEY)

      console.log("📦 Storage data exists:", !!storageData)
      console.log("💾 Backup data exists:", !!backupData)
      console.log("🕐 Last sync:", syncTime ? new Date(Number(syncTime)).toLocaleString() : "Never")

      if (storageData) {
        const parsed = JSON.parse(storageData)
        console.log("📊 Storage products count:", parsed.length)
        console.log(
          "🆔 Storage product IDs:",
          parsed.map((p: any) => p.id),
        )
      }

      console.log("🧠 Cache exists:", !!this.cache)
      console.log("📊 Cache products count:", this.cache?.length || 0)
      console.log("🆔 Cache product IDs:", this.cache?.map((p: any) => p.id) || [])
    } catch (error) {
      console.error("❌ Debug storage error:", error)
    }
  }
}
