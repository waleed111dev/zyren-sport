"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import WhatsAppTest from "@/components/whatsapp-test"

export default function TestWhatsAppPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-green-600 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">WhatsApp Integration Test</h1>
          <p className="text-gray-600 mt-2">Test your WhatsApp connection and troubleshoot issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WhatsAppTest />

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Verify WhatsApp is installed on your device</li>
                <li>Check if the number +92 341 6561511 is correct</li>
                <li>Try opening WhatsApp manually first</li>
                <li>Test on different browsers (Chrome, Safari, Firefox)</li>
                <li>Try on both mobile and desktop</li>
                <li>Check if popup blockers are disabled</li>
                <li>Ensure you have internet connection</li>
              </ol>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Manual Test:</h3>
              <p className="text-sm text-green-700 mb-4">If the automatic test doesn't work, try manually:</p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Number:</strong> +92 341 6561511
                </p>
                <p className="text-sm">
                  <strong>Message:</strong> "Hi! Testing from Zyren Sports website"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
