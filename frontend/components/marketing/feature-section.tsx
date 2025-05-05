import type React from "react"
import Image from "next/image"
import { BarChart2, Bot, BrainCircuit, Lightbulb, Search } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: <Lightbulb className="h-10 w-10 text-blue-500" />,
    title: "AI Insights",
    description:
      "Generate actionable insights from your data automatically. Our AI analyzes patterns and trends to provide valuable business intelligence.",
  },
  {
    icon: <Bot className="h-10 w-10 text-indigo-500" />,
    title: "AI Chat",
    description:
      "Interact with your data through natural language. Ask questions and get immediate answers powered by advanced language models.",
  },
  {
    icon: <BrainCircuit className="h-10 w-10 text-purple-500" />,
    title: "Super Agent",
    description:
      "Deploy autonomous AI agents that can perform complex tasks and workflows, saving your team time and resources.",
  },
  {
    icon: <Search className="h-10 w-10 text-pink-500" />,
    title: "Deep Research",
    description:
      "Conduct comprehensive research and analysis across multiple data sources to uncover hidden opportunities and insights.",
  },
  {
    icon: <BarChart2 className="h-10 w-10 text-orange-500" />,
    title: "Advanced Analytics",
    description:
      "Visualize your data with powerful charts and dashboards. Track KPIs and metrics that matter to your business.",
  },
]

export function FeatureSection() {
  return (
    <section className="py-20 md:py-32" id="features">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8 mb-12 md:mb-20">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Transform Your Data with AI</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our platform offers a comprehensive suite of AI-powered tools to help you make better decisions.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 transition-all hover:border-primary/50 hover:shadow-md">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-20 md:mt-32">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="relative rounded-lg border bg-background p-2 shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=700"
                  width={700}
                  height={500}
                  alt="AI Insights Feature"
                  className="rounded shadow-sm"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 flex flex-col gap-6">
              <div>
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm mb-4">AI-Powered</div>
                <h3 className="text-3xl font-bold tracking-tighter mb-4">Unlock the Power of Your Data</h3>
                <p className="text-muted-foreground md:text-lg max-w-[600px]">
                  Our platform uses state-of-the-art AI models to analyze your data and provide insights that would take
                  teams of analysts weeks to discover.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "Automated data analysis and pattern recognition",
                  "Natural language processing for easy data querying",
                  "Predictive analytics to forecast future trends",
                  "Anomaly detection to identify issues before they become problems",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
