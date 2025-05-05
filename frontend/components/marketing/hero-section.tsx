import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
                AI-Driven Insights for Your Business
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl max-w-[600px]">
                Transform your data into actionable insights with our powerful AI analytics platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See Features</Link>
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex -space-x-2">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-background bg-gray-200"></div>
                <div className="inline-block h-8 w-8 rounded-full border-2 border-background bg-gray-300"></div>
                <div className="inline-block h-8 w-8 rounded-full border-2 border-background bg-gray-400"></div>
              </div>
              <div>Trusted by 10,000+ companies worldwide</div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-lg border bg-background p-2 shadow-xl">
              <Image
                src="/placeholder.svg?height=600&width=800"
                width={800}
                height={600}
                alt="AI Insights Dashboard"
                className="rounded shadow-sm"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
                Powered by AI
              </div>
            </div>
            <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
