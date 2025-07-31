import DeploymentStatus from "@/components/deployment-status"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DeploymentGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-green-600 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🚀 Deploy Zyren Sports to Google</h1>
          <p className="text-gray-600">
            Follow this step-by-step guide to get your website live and discoverable on Google
          </p>
        </div>

        <DeploymentStatus />

        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">📞 Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Deployment Issues:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Check Vercel documentation</li>
                <li>• Ensure all files are saved</li>
                <li>• Verify internet connection</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Google Issues:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Wait 24-48 hours for indexing</li>
                <li>• Check Search Console for errors</li>
                <li>• Ensure sitemap is accessible</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
