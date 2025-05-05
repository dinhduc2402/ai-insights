import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DeepResearchPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deep Research</h1>
        <p className="text-muted-foreground mt-2">
          Conduct in-depth research and analysis using our advanced AI tools.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Research Projects</CardTitle>
          <CardDescription>Your ongoing and completed research projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Market Analysis 2025</p>
                <p className="text-sm text-muted-foreground">In progress - 65% complete</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Competitor Intelligence</p>
                <p className="text-sm text-muted-foreground">Completed on Apr 5, 2025</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <p className="font-medium">Industry Trends 2025-2030</p>
                <p className="text-sm text-muted-foreground">Not started</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
