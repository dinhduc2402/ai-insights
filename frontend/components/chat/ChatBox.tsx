"use client"

import { useState, useRef, useEffect } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, SendIcon, ImageIcon } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

type Message = {
     id: string
     role: "user" | "assistant"
     content: string
     isStreaming?: boolean
     image?: string
}

interface ChatBoxProps {
     workspaceId: string
     initialMessages?: Message[]
     onMessageSent?: (message: Message) => void
     selectedModel?: string
}

export function ChatBox({
     workspaceId,
     initialMessages = [],
     onMessageSent,
     selectedModel = "gpt-3.5-turbo"
}: ChatBoxProps) {
     const [messages, setMessages] = useState<Message[]>(initialMessages)
     const [isProcessing, setIsProcessing] = useState(false)
     const [currentQuestion, setCurrentQuestion] = useState("")
     const [currentAnswer, setCurrentAnswer] = useState("")
     const [imageAttachment, setImageAttachment] = useState<string | null>(null)
     const messagesEndRef = useRef<HTMLDivElement>(null)
     const textareaRef = useRef<HTMLTextAreaElement>(null)
     const formRef = useRef<HTMLFormElement>(null)
     const queryClient = useQueryClient()

     // Scroll to bottom when messages change
     useEffect(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
     }, [messages, currentQuestion, currentAnswer])

     // Function to format text with line breaks
     const formatText = (text: string) => {
          return text.split('\n').map((line, i) => (
               <span key={i}>
                    {line}
                    {i < text.split('\n').length - 1 && <br />}
               </span>
          ));
     };

     // Setup event source for streaming
     const setupEventSource = async (url: string, requestOptions: RequestInit) => {
          try {
               // Start streaming response with POST request
               const response = await fetch(url, requestOptions);

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               // Get reader from response body
               const reader = response.body?.getReader();
               if (!reader) {
                    throw new Error('Response body is not readable');
               }

               const decoder = new TextDecoder();
               let buffer = '';
               let accumulatedText = '';

               // Process the stream
               while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    // Decode the chunk and add to buffer
                    buffer += decoder.decode(value, { stream: true });

                    // Split by double newlines which separate SSE events
                    const events = buffer.split('\n\n');
                    buffer = events.pop() || '';

                    for (const event of events) {
                         if (event.trim().startsWith('data: ')) {
                              try {
                                   const eventData = JSON.parse(event.trim().slice(6));

                                   if (eventData.type === 'chunk') {
                                        const chunkText = eventData.content.text || '';
                                        accumulatedText += chunkText;
                                        setCurrentAnswer(accumulatedText);
                                   } else if (eventData.type === 'error') {
                                        console.error('Error from API:', eventData.error);
                                        setCurrentAnswer(`Error: ${eventData.error}`);
                                        setIsProcessing(false);
                                        return false;
                                   } else if (eventData.type === 'end') {
                                        // Streaming completed
                                        finalizeMessages(accumulatedText);
                                        return true;
                                   }
                              } catch (e) {
                                   console.error('Error parsing SSE data:', e);
                              }
                         }
                    }
               }

               // If we reach here, the stream completed normally
               finalizeMessages(accumulatedText);
               return true;
          } catch (error) {
               console.error('Error in streaming:', error);
               setCurrentAnswer(prev => prev || 'An error occurred while processing your request.');
               setIsProcessing(false);
               return false;
          }
     };

     // Finalize messages and reset state after streaming completes
     const finalizeMessages = (accumulatedText: string) => {
          // Update the message history once streaming is complete
          const userMessage = {
               id: `user-${Date.now()}`,
               role: "user",
               content: currentQuestion,
               image: imageAttachment || undefined
          } as Message;

          const assistantMessage = {
               id: `assistant-${Date.now()}`,
               role: "assistant",
               content: accumulatedText
          } as Message;

          setMessages(prev => [...prev, userMessage, assistantMessage]);
          setCurrentQuestion("");
          setCurrentAnswer("");
          setImageAttachment(null);

          // Invalidate query cache to refresh data if needed
          queryClient.invalidateQueries({ queryKey: ["chat", workspaceId] });

          setIsProcessing(false);

          // Reset form
          if (formRef.current) {
               formRef.current.reset();
          }
     };

     const handleSendMessage = async (content: string) => {
          if (!content.trim()) return;

          // Reset previous streaming state
          setCurrentQuestion(content);
          setCurrentAnswer("");
          setIsProcessing(true);

          try {
               // Create API endpoint URL
               const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
               const url = `${baseUrl}/api/chat/${workspaceId}`;

               // Build request body
               const requestBody = {
                    id: `request-${Date.now()}`,
                    prompt: content,
                    model: selectedModel,
                    stream: true,
                    image: imageAttachment || undefined
               };

               // Request options
               const requestOptions = {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
               };

               // Setup streaming
               await setupEventSource(url, requestOptions);

          } catch (error) {
               console.error('Error setting up request:', error);
               setCurrentAnswer('An error occurred while processing your request.');
               setIsProcessing(false);
          }
     };

     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (textareaRef.current && textareaRef.current.value) {
               handleSendMessage(textareaRef.current.value);
          }
     };

     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               const reader = new FileReader();
               reader.onload = (e) => {
                    if (e.target?.result) {
                         setImageAttachment(e.target.result as string);
                    }
               };
               reader.readAsDataURL(file);
          }
     };

     const cancelStreaming = () => {
          // No active stream reference to cancel since we're using fetch directly
          setIsProcessing(false);
          setCurrentAnswer(prev => prev + " [cancelled]");
     };

     return (
          <div className="flex flex-col h-full">
               <div className="flex-1 overflow-y-auto p-4 space-y-4 chat">
                    {/* Display saved messages */}
                    {messages.map((message) => (
                         <div
                              key={message.id}
                              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                         >
                              <Card
                                   className={`max-w-[80%] p-3 ${message.role === 'user'
                                        ? 'bg-primary text-primary-foreground message user'
                                        : 'bg-muted message'
                                        }`}
                              >
                                   {message.image && (
                                        <div className="mb-2">
                                             <img
                                                  src={message.image}
                                                  alt="Attachment"
                                                  className="max-w-full rounded-md"
                                             />
                                        </div>
                                   )}
                                   <div className="whitespace-pre-wrap break-words">
                                        {formatText(message.content)}
                                   </div>
                              </Card>
                         </div>
                    ))}

                    {/* Display current question and streaming answer */}
                    {currentQuestion && (
                         <div className="flex justify-end">
                              <Card className="max-w-[80%] p-3 bg-primary text-primary-foreground message user">
                                   {imageAttachment && (
                                        <div className="mb-2">
                                             <img
                                                  src={imageAttachment}
                                                  alt="Attachment"
                                                  className="max-w-full rounded-md"
                                             />
                                        </div>
                                   )}
                                   <div className="whitespace-pre-wrap break-words">
                                        {formatText(currentQuestion)}
                                   </div>
                              </Card>
                         </div>
                    )}

                    {currentAnswer && (
                         <div className="flex justify-start">
                              <Card className="max-w-[80%] p-3 bg-muted message">
                                   <div className="whitespace-pre-wrap break-words">
                                        {formatText(currentAnswer)}
                                        {isProcessing && (
                                             <span className="inline-block animate-pulse">▋</span>
                                        )}
                                   </div>
                              </Card>
                         </div>
                    )}

                    <div ref={messagesEndRef} className="endChat"></div>
               </div>

               <div className="border-t p-4">
                    <form ref={formRef} onSubmit={handleSubmit} className="newForm flex gap-2">
                         <input
                              type="file"
                              id="file"
                              className="hidden"
                              onChange={handleImageUpload}
                              accept="image/*"
                         />
                         <label htmlFor="file" className="cursor-pointer">
                              <Button type="button" variant="outline" size="icon" className="h-10 w-10">
                                   <ImageIcon className="h-5 w-5" />
                              </Button>
                         </label>

                         <textarea
                              ref={textareaRef}
                              name="text"
                              className="flex-1 min-h-[80px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Ask anything..."
                              disabled={isProcessing}
                              rows={1}
                              onKeyDown={(e) => {
                                   if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        const form = e.currentTarget.form;
                                        if (form) form.requestSubmit();
                                   }
                              }}
                         />

                         {isProcessing ? (
                              <Button type="button" variant="destructive" onClick={cancelStreaming}>
                                   Cancel
                              </Button>
                         ) : (
                              <Button type="submit" className="h-10 aspect-square p-0 rounded-full">
                                   <SendIcon className="h-5 w-5" />
                              </Button>
                         )}
                    </form>
               </div>
          </div>
     )
} 