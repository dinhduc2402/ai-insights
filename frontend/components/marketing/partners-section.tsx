export function PartnersSection() {
  return (
    <section className="py-12 border-y bg-muted/40">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-medium text-muted-foreground text-center">
            Trusted by leading companies worldwide
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-center">
                <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
