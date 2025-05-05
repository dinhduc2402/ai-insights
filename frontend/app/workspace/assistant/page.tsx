import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Message {
     role: "user" | "assistant"
     content: string
}

export default function AssistantPage() {
     const [messages, setMessages] = useState<Message[]>([])
     const [input, setInput] = useState("")
     const [isLoading, setIsLoading] = useState(false)

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          if (!input.trim() || isLoading) return

          const userMessage = input.trim()
          setInput("")
          setMessages((prev) => [...prev, { role: "user", content: userMessage }])
          setIsLoading(true)

          try {
               const response = await api.post("/api/assistant/query/my-workspace", {
                    prompt: userMessage,
               })

               setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: response.data.response },
               ])
          } catch (error) {
               console.error("Error getting assistant response:", error)
          } finally {
               setIsLoading(false)
          }
     }

     return (
          <div className="flex h-full flex-col">
               <div className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                         <div
                              key={index}
                              className={cn(
                                   "rounded-lg p-4",
                                   message.role === "user"
                                        ? "bg-primary text-primary-foreground ml-auto"
                                        : "bg-muted"
                              )}
                         >
                              {message.content}
                         </div>
                    ))}
                    {isLoading && (
                         <div className="rounded-lg bg-muted p-4">
                              <div className="flex items-center gap-2">
                                   <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                                   <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.2s" }} />
                                   <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0.4s" }} />
                              </div>
                         </div>
                    )}
               </div>
               <form onSubmit={handleSubmit} className="border-t p-4">
                    <div className="flex gap-2">
                         <Input
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              placeholder="Type your message..."
                              disabled={isLoading}
                         />
                         <Button type="submit" disabled={isLoading}>
                              Send
                         </Button>
                    </div>
               </form>
          </div>
     )
} 