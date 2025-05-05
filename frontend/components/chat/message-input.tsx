"use client"

import type React from "react"

import { useState } from "react"
import { PaperclipIcon, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  onSendMessage: (message: string) => void
  className?: string
}

export function MessageInput({ onSendMessage, className }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
        <PaperclipIcon className="h-5 w-5" />
        <span className="sr-only">Attach file</span>
      </Button>
      <div className="relative flex-1">
        <Input
          className="pr-10 py-6 border-muted-foreground/20 focus-visible:ring-offset-0"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={handleSendMessage}
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  )
}
