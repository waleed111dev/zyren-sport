"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
          <p className="text-gray-600 mb-8">
            We're sorry, but something unexpected happened. Please try refreshing the page.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={reset} className="bg-green-600 hover:bg-green-700 w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full bg-transparent">
            <a href="/">Go to Homepage</a>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>
            If the problem persists, please{" "}
            <a href="/contact" className="text-green-600 hover:text-green-700 underline">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
