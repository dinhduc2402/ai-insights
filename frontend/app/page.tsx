import { MarketingHeader } from "@/components/marketing/header"
import { MarketingFooter } from "@/components/marketing/footer"
import { HeroSection } from "@/components/marketing/hero-section"
import { FeatureSection } from "@/components/marketing/feature-section"
import { TestimonialSection } from "@/components/marketing/testimonial-section"
import { PricingSection } from "@/components/marketing/pricing-section"
import { CtaSection } from "@/components/marketing/cta-section"
import { PartnersSection } from "@/components/marketing/partners-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <HeroSection />
        <PartnersSection />
        <FeatureSection />
        <TestimonialSection />
        <PricingSection />
        <CtaSection />
      </main>
      <MarketingFooter />
    </div>
  )
}
