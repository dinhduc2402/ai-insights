import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    quote:
      "AI Insights has transformed how we analyze our customer data. We've discovered patterns we never knew existed and it's directly impacted our bottom line.",
    author: "Sarah Johnson",
    title: "CMO at TechCorp",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "The AI Chat feature alone has saved our analysts hundreds of hours. Being able to ask questions in natural language and get immediate insights is game-changing.",
    author: "Michael Chen",
    title: "Data Science Lead at Innovate Inc",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    quote:
      "We've been able to automate our monthly reporting process entirely thanks to AI Insights. What used to take a week now happens automatically.",
    author: "Jessica Williams",
    title: "Operations Director at Global Retail",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export function TestimonialSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center mb-12 md:mb-20">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Trusted by Industry Leaders</h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              See what our customers are saying about how AI Insights has transformed their businesses.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <svg
                      className="absolute -top-6 -left-6 h-12 w-12 text-muted-foreground/20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                    <p className="text-lg relative z-10">{testimonial.quote}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div className="rounded-full overflow-hidden h-10 w-10 bg-muted">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.author}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
