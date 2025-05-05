import { Bot } from "lucide-react"

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-3xl font-medium mb-2">what can I help with?</h2>
      <p className="text-muted-foreground max-w-md">
        Ask me anything about your data, research, or any topic you'd like to explore.
      </p>
    </div>
  )
}
