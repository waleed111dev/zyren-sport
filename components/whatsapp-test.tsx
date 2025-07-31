"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, CheckCircle, AlertCircle } from "lucide-react"

export default function WhatsAppTest() {
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  const testWhatsApp = () => {
    setTestStatus("testing")

    const testMessage = `🧪 WHATSAPP TEST - ZYREN SPORTS

This is a test message to verify WhatsApp integration is working properly.

✅ If you receive this message, the integration is working!
📱 Website: Zyren Sports
🕐 Time: ${new Date().toLocaleString()}

Please reply "TEST OK" to confirm.`

    const whatsappUrl = `https://wa.me/923416561511?text=${encodeURIComponent(testMessage)}`

    try {
      window.open(whatsappUrl, "_blank")
      setTestStatus("success")

      // Reset status after 5 seconds
      setTimeout(() => setTestStatus("idle"), 5000)
    } catch (error) {
      setTestStatus("error")
      setTimeout(() => setTestStatus("idle"), 5000)
    }
  }

  const testDifferentFormats = () => {
    // Test different WhatsApp URL formats
    const formats = [
      `https://wa.me/923416561511`,
      `https://api.whatsapp.com/send?phone=923416561511`,
      `whatsapp://send?phone=923416561511`,
    ]

    formats.forEach((url, index) => {
      setTimeout(() => {
        console.log(`Testing format ${index + 1}:`, url)
        window.open(url, "_blank")
      }, index * 2000)
    })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          WhatsApp Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <p>
            <strong>Number:</strong> +92 341 6561511
          </p>
          <p>
            <strong>Status:</strong>
            {testStatus === "idle" && " Ready to test"}
            {testStatus === "testing" && " Opening WhatsApp..."}
            {testStatus === "success" && " ✅ WhatsApp opened successfully!"}
            {testStatus === "error" && " ❌ Error opening WhatsApp"}
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={testWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={testStatus === "testing"}
          >
            {testStatus === "testing" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Test WhatsApp Connection
              </>
            )}
          </Button>

          <Button onClick={testDifferentFormats} variant="outline" className="w-full bg-transparent" size="sm">
            Test All URL Formats
          </Button>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Make sure WhatsApp is installed on your device</p>
          <p>• Check if the number +92 341 6561511 is correct</p>
          <p>• Try both mobile and desktop WhatsApp</p>
        </div>

        {testStatus === "success" && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            WhatsApp should have opened with a test message!
          </div>
        )}

        {testStatus === "error" && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            Error opening WhatsApp. Try manually: +92 341 6561511
          </div>
        )}
      </CardContent>
    </Card>
  )
}
