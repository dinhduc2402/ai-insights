"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChatEmptyState } from "@/components/chat/chat-empty-state"
import { ChatHeader } from "@/components/chat/chat-header"
import { MessageInput } from "@/components/chat/message-input"
import { ModelSelector, type Model } from "@/components/chat/model-selector"
import { ChatBox } from "@/components/chat/ChatBox"

// Define AI models with proper icons
const models: Model[] = [
     {
          id: "mixture",
          name: "Mixture-of-Agents",
          description: "Auto-mixes best AI models for your task.",
          icon: (
               <div className="flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs">
                    <span>🔄</span>
               </div>
          ),
     },
     {
          id: "gpt4o",
          name: "GPT-4o",
          icon: (
               <div className="flex items-center justify-center w-5 h-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66666 8.15905 6.66666 10C6.66666 11.841 8.15905 13.3333 10 13.3333Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M4.69669 4.69667L7.64669 7.64667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 12.3533L15.3033 15.3033"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 7.64667L15.3033 4.69667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 7.64667L15.3033 4.69667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M4.69669 15.3033L7.64669 12.3533"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "o1",
          name: "o1",
          icon: (
               <div className="flex items-center justify-center w-5 h-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66666 8.15905 6.66666 10C6.66666 11.841 8.15905 13.3333 10 13.3333Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M4.69669 4.69667L7.64669 7.64667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 12.3533L15.3033 15.3033"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 7.64667L15.3033 4.69667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 7.64667L15.3033 4.69667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M4.69669 15.3033L7.64669 12.3533"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "o3-mini-high",
          name: "o3-mini-high",
          icon: (
               <div className="flex items-center justify-center w-5 h-5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66666 8.15905 6.66666 10C6.66666 11.841 8.15905 13.3333 10 13.3333Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M4.69669 4.69667L7.64669 7.64667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 12.3533L15.3033 15.3033"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 7.64667L15.3033 4.69667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M12.3533 7.64667L15.3033 4.69667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M4.69669 15.3033L7.64669 12.3533"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "claude-sonnet-thinking",
          name: "Claude 3.7 Sonnet (Thinking)",
          icon: (
               <div className="flex items-center justify-center w-5 h-5 text-orange-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M10 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66666 8.15905 6.66666 10C6.66666 11.841 8.15905 13.3333 10 13.3333Z"
                              fill="currentColor"
                         />
                         <path
                              d="M10 1.66667V3.33334"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 16.6667V18.3333"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M3.57501 3.57501L4.75834 4.75834"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M15.2417 15.2417L16.425 16.425"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66666 10H3.33332"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M16.6667 10H18.3333"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M3.57501 16.425L4.75834 15.2417"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M15.2417 4.75834L16.425 3.57501"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "claude-sonnet",
          name: "Claude 3.7 Sonnet",
          icon: (
               <div className="flex items-center justify-center w-5 h-5 text-orange-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M10 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66666 8.15905 6.66666 10C6.66666 11.841 8.15905 13.3333 10 13.3333Z"
                              fill="currentColor"
                         />
                         <path
                              d="M10 1.66667V3.33334"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 16.6667V18.3333"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M3.57501 3.57501L4.75834 4.75834"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M15.2417 15.2417L16.425 16.425"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66666 10H3.33332"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M16.6667 10H18.3333"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M3.57501 16.425L4.75834 15.2417"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M15.2417 4.75834L16.425 3.57501"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "claude-haiku",
          name: "Claude 3.5 Haiku",
          icon: (
               <div className="flex items-center justify-center w-5 h-5 text-orange-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M10 13.3333C11.8409 13.3333 13.3333 11.841 13.3333 10C13.3333 8.15905 11.8409 6.66667 10 6.66667C8.15905 6.66667 6.66666 8.15905 6.66666 10C6.66666 11.841 8.15905 13.3333 10 13.3333Z"
                              fill="currentColor"
                         />
                         <path
                              d="M10 1.66667V3.33334"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 16.6667V18.3333"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M3.57501 3.57501L4.75834 4.75834"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M15.2417 15.2417L16.425 16.425"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66666 10H3.33332"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M16.6667 10H18.3333"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M3.57501 16.425L4.75834 15.2417"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M15.2417 4.75834L16.425 3.57501"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "gemini",
          name: "Gemini 2.0 Flash",
          icon: (
               <div className="flex items-center justify-center w-5 h-5">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                              fill="#4285F4"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "deepseek-v3",
          name: "DeepSeek V3",
          icon: (
               <div className="flex items-center justify-center w-5 h-5 text-blue-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M1.66669 13.3333C1.66669 13.3333 5.00002 14.1667 6.66669 15.8333C8.33335 17.5 10 18.3333 10 18.3333"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66669 6.66667C1.66669 6.66667 5.00002 5.83333 6.66669 4.16667C8.33335 2.5 10 1.66667 10 1.66667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 18.3333C10 18.3333 11.6667 17.5 13.3333 15.8333C15 14.1667 18.3333 13.3333 18.3333 13.3333"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 1.66667C10 1.66667 11.6667 2.5 13.3333 4.16667C15 5.83333 18.3333 6.66667 18.3333 6.66667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66669 10C1.66669 10 5.00002 11.6667 6.66669 11.6667C8.33335 11.6667 10 10 10 10C10 10 11.6667 8.33333 13.3333 8.33333C15 8.33333 18.3333 10 18.3333 10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
     {
          id: "deepseek-r1",
          name: "DeepSeek R1",
          icon: (
               <div className="flex items-center justify-center w-5 h-5 text-blue-500">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path
                              d="M1.66669 13.3333C1.66669 13.3333 5.00002 14.1667 6.66669 15.8333C8.33335 17.5 10 18.3333 10 18.3333"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66669 6.66667C1.66669 6.66667 5.00002 5.83333 6.66669 4.16667C8.33335 2.5 10 1.66667 10 1.66667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 18.3333C10 18.3333 11.6667 17.5 13.3333 15.8333C15 14.1667 18.3333 13.3333 18.3333 13.3333"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M10 1.66667C10 1.66667 11.6667 2.5 13.3333 4.16667C15 5.83333 18.3333 6.66667 18.3333 6.66667"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                         <path
                              d="M1.66669 10C1.66669 10 5.00002 11.6667 6.66669 11.6667C8.33335 11.6667 10 10 10 10C10 10 11.6667 8.33333 13.3333 8.33333C15 8.33333 18.3333 10 18.3333 10"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                         />
                    </svg>
               </div>
          ),
     },
]

export default function AIChatPage() {
     const [selectedModel, setSelectedModel] = useState("gpt4o")
     const [messages, setMessages] = useState<string[]>([])

     const handleSendMessage = (message: string) => {
          setMessages([...messages, message])
          // In a real app, you would send the message to an API here
     }

     return (
          <div className="flex flex-col h-full bg-background">
               <ChatHeader />

               {/* Chat Area */}
               <div className="flex-1 overflow-auto">
                    {messages.length === 0 ? (
                         <ChatEmptyState />
                    ) : (
                         <div className="p-4">
                              {/* Messages would be rendered here */}
                              <div className="text-center text-muted-foreground">Messages would appear here</div>
                         </div>
                    )}
               </div>

               {/* Input Area */}
               <ChatBox workspaceId="6f5c6200-e449-44fa-8f4b-b2721d3b54de" />
          </div>
     )
}
