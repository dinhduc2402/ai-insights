import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small teams just getting started with AI insights.",
    price: "$49",
    duration: "per month",
    features: ["AI Insights generation", "5 custom templates", "Basic analytics", "Email support", "1 team member"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing businesses that need more advanced features and capacity.",
    price: "$99",
    duration: "per month",
    features: [
      "Everything in Starter",
      "AI Chat capabilities",
      "20 custom templates",
      "Advanced analytics",
      "Priority support",
      "5 team members",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations that need the full power of AI with custom solutions.",
    price: "Custom",
    duration: "contact for pricing",
    features: [
      "Everything in Professional",
      "Super Agent capabilities",
      "Unlimited templates",
      "Deep Research tools",
      "Dedicated support",
      "Unlimited team members",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section className="py-20 md:py-32" id="pricing">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center mb-12 md:mb-20">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Choose the Right Plan for Your Needs
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Flexible pricing options designed to scale with your business. All plans include a 14-day free trial.
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.popular ? "border-2 border-primary shadow-lg relative" : "border bg-card/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.duration}</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} asChild>
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom plan?{" "}
            <Link href="/contact" className="text-primary underline underline-offset-4">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
