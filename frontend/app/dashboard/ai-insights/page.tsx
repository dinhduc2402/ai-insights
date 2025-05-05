"use client"

import type React from "react"

import { useState } from "react"
import { Sparkle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ModelSelector } from "@/components/ai/model-selector"

// Define available models
const availableModels = [
  {
    id: "llama-3.3-70b-instruct-fp8-fast",
    name: "llama-3.3-70b-instruct-fp8-fast",
    provider: "Meta",
    description: "High performance instruction-tuned model",
    tags: ["Recommended", "Fast"],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Latest multimodal model with vision capabilities",
    tags: ["Multimodal"],
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance and capabilities",
    tags: ["Balanced"],
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    description: "Advanced reasoning and coding capabilities",
    tags: ["Coding"],
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    description: "Efficient open-weight model",
    tags: ["Efficient"],
  },
]

export default function AIInsightsPage() {
  const [selectedModel, setSelectedModel] = useState(availableModels[0].id)
  const [systemMessage, setSystemMessage] = useState("You are a helpful assistant")
  const [maxTokens, setMaxTokens] = useState(512)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { role: "user", content: inputMessage }])
      setInputMessage("")
      // In a real app, you would call an API here to get the model's response
      // For now, we'll just simulate a response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "This is a simulated response from the AI model.",
          },
        ])
      }, 1000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSendMessage()
    }
  }

  const handleClear = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-10rem)]">
            {/* Left Column - Model Configuration */}
            <Card className="border rounded-lg overflow-auto">
              <div className="border-t-4 border-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg"></div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Workers AI LLM Playground</h2>
                    <Sparkle className="h-5 w-5 text-pink-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Explore different Text Generation models by drafting messages and fine-tuning your responses.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <ModelSelector
                    models={availableModels}
                    selectedModel={selectedModel}
                    onModelSelect={setSelectedModel}
                    isOpen={isModelSelectorOpen}
                    setIsOpen={setIsModelSelectorOpen}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-message">System Message</Label>
                  <Textarea
                    id="system-message"
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-tokens">Maximum Output Length (Tokens)</Label>
                    <span className="text-sm font-medium">{maxTokens}</span>
                  </div>
                  <div className="pt-2">
                    <Slider
                      id="max-tokens"
                      min={1}
                      max={2048}
                      step={1}
                      value={[maxTokens]}
                      onValueChange={(value) => setMaxTokens(value[0])}
                      className="custom-slider"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Column - Chat Interface */}
            <Card className="flex flex-col border rounded-lg overflow-hidden">
              <div className="border-t-4 border-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg"></div>
              <div className="flex-1 overflow-auto p-4">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <p>No messages yet</p>
                      <p className="text-sm">Start a conversation to see responses</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 px-3 py-1 rounded-full text-sm">
                    User
                  </div>
                  <Input
                    placeholder="Enter a message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-muted-foreground">
                    Send messages and generate a response (⌘/Ctrl + Enter)
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClear}>
                      Clear
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      Run <Sparkle className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
