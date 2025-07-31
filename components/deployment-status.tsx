"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle, ExternalLink, AlertCircle, Clock } from "lucide-react"

interface DeploymentStep {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "error"
  url?: string
  estimatedTime?: string
}

export default function DeploymentStatus() {
  const [steps, setSteps] = useState<DeploymentStep[]>([
    {
      id: "deploy",
      title: "Deploy Website",
      description: "Deploy your Zyren Sports website to Vercel or Netlify",
      status: "pending",
      url: "https://vercel.com",
      estimatedTime: "5 minutes",
    },
    {
      id: "domain",
      title: "Custom Domain (Optional)",
      description: "Set up a custom domain like zyrensports.com",
      status: "pending",
      url: "https://domains.google",
      estimatedTime: "15 minutes",
    },
    {
      id: "search-console",
      title: "Google Search Console",
      description: "Add your website to Google Search Console",
      status: "pending",
      url: "https://search.google.com/search-console",
      estimatedTime: "10 minutes",
    },
    {
      id: "analytics",
      title: "Google Analytics",
      description: "Set up Google Analytics 4 tracking",
      status: "pending",
      url: "https://analytics.google.com",
      estimatedTime: "10 minutes",
    },
    {
      id: "sitemap",
      title: "Submit Sitemap",
      description: "Submit your sitemap to Google Search Console",
      status: "pending",
      estimatedTime: "2 minutes",
    },
    {
      id: "indexing",
      title: "Request Indexing",
      description: "Request Google to index your important pages",
      status: "pending",
      estimatedTime: "5 minutes",
    },
    {
      id: "business",
      title: "Google My Business",
      description: "Create Google My Business profile for local SEO",
      status: "pending",
      url: "https://business.google.com",
      estimatedTime: "20 minutes",
    },
  ])

  const updateStepStatus = (stepId: string, status: DeploymentStep["status"]) => {
    setSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)))
  }

  const getStatusIcon = (status: DeploymentStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: DeploymentStep["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const completedSteps = steps.filter((step) => step.status === "completed").length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🚀 Zyren Sports Deployment Progress</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Progress: {completedSteps} of {totalSteps} steps completed
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step.id} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {step.title}
                    </h3>
                    {getStatusBadge(step.status)}
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <div className="flex items-center gap-4">
                    {step.url && (
                      <Button asChild variant="outline" size="sm" className="bg-transparent">
                        <a href={step.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Tool
                        </a>
                      </Button>
                    )}
                    {step.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => updateStepStatus(step.id, "in-progress")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Start Step
                      </Button>
                    )}
                    {step.status === "in-progress" && (
                      <Button
                        size="sm"
                        onClick={() => updateStepStatus(step.id, "completed")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Complete
                      </Button>
                    )}
                    {step.estimatedTime && <span className="text-sm text-gray-500">⏱️ ~{step.estimatedTime}</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {completedSteps === totalSteps && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h2>
            <p className="text-green-700 mb-4">
              Your Zyren Sports website is now live on Google and ready to attract customers!
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="https://search.google.com/search-console" target="_blank" rel="noreferrer">
                  Check Search Console
                </a>
              </Button>
              <Button asChild variant="outline" className="bg-transparent">
                <a href="https://analytics.google.com" target="_blank" rel="noreferrer">
                  View Analytics
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Quick Start Checklist</h3>
          <div className="space-y-2 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Download and install Vercel CLI</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Run `vercel --prod` in your project folder</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Copy your live website URL</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Add website to Google Search Console</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Submit sitemap.xml to Google</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span>Set up Google Analytics tracking</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
