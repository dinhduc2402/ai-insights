"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface Template {
     id: string
     name: string
     description: string
     llm_model: string
}

interface TemplateProcessorProps {
     trigger?: React.ReactNode
     workspaceId: string
     onComplete?: (result: any) => void
}

export function TemplateProcessor({ trigger, workspaceId, onComplete }: TemplateProcessorProps) {
     const [isOpen, setIsOpen] = useState(false)
     const [isLoading, setIsLoading] = useState(false)
     const [isProcessing, setIsProcessing] = useState(false)
     const [templates, setTemplates] = useState<Template[]>([])
     const [selectedTemplateId, setSelectedTemplateId] = useState<string>("")
     const [userInput, setUserInput] = useState("")
     const [result, setResult] = useState<any>(null)
     const [streamedResult, setStreamedResult] = useState("")
     const [isStreaming, setIsStreaming] = useState(false)

     // Fetch templates when dialog opens
     const handleOpen = async (open: boolean) => {
          setIsOpen(open)
          if (open) {
               setIsLoading(true)
               setResult(null)
               setStreamedResult("")
               try {
                    const response = await api.get<Template[]>(`/api/templates?workspace_id=${workspaceId}`)
                    setTemplates(response.data)
                    if (response.data.length > 0) {
                         setSelectedTemplateId(response.data[0].id)
                    }
               } catch (error) {
                    console.error("Error fetching templates:", error)
                    toast({
                         title: "Error",
                         description: "Failed to load templates",
                         variant: "destructive"
                    })
               } finally {
                    setIsLoading(false)
               }
          }
     }

     const processTemplate = async (stream: boolean = false) => {
          if (!selectedTemplateId) {
               toast({
                    title: "Error",
                    description: "Please select a template",
                    variant: "destructive"
               })
               return
          }

          setIsProcessing(true)
          setResult(null)

          if (stream) {
               setIsStreaming(true)
               setStreamedResult("")
               processTemplateStream()
          } else {
               try {
                    const response = await api.post("/api/templates/process", {
                         workspace_id: workspaceId,
                         template_id: selectedTemplateId,
                         user_input: userInput,
                         additional_context: {},
                         stream: false
                    })

                    setResult(response.data)

                    if (onComplete) {
                         onComplete(response.data)
                    }
               } catch (error) {
                    console.error("Error processing template:", error)
                    toast({
                         title: "Error",
                         description: "Failed to process template",
                         variant: "destructive"
                    })
               } finally {
                    setIsProcessing(false)
               }
          }
     }

     const processTemplateStream = async () => {
          try {
               const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/templates/process`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                         workspace_id: workspaceId,
                         template_id: selectedTemplateId,
                         user_input: userInput,
                         additional_context: {},
                         stream: true
                    })
               })

               if (!response.ok) {
                    throw new Error("Failed to stream response")
               }

               const reader = response.body?.getReader()
               if (!reader) throw new Error("Cannot read response stream")

               // Metadata object to collect
               let metadata: any = null

               // Process the stream
               while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    // Convert bytes to text
                    const chunk = new TextDecoder().decode(value)
                    const lines = chunk.split("\n\n")

                    for (const line of lines) {
                         if (!line.trim() || !line.startsWith("data: ")) continue

                         const jsonString = line.replace("data: ", "")
                         try {
                              const data = JSON.parse(jsonString)

                              if (data.type === "chunk") {
                                   if (typeof data.content === "object" && data.content.metadata) {
                                        // Handle metadata
                                        metadata = data.content.metadata
                                   } else if (typeof data.content === "object" && data.content.text) {
                                        // Handle text chunk
                                        setStreamedResult(prev => prev + data.content.text)
                                   } else if (typeof data.content === "string") {
                                        // Handle text chunk
                                        setStreamedResult(prev => prev + data.content)
                                   }
                              } else if (data.type === "error") {
                                   toast({
                                        title: "Error",
                                        description: data.error || "An error occurred during streaming",
                                        variant: "destructive"
                                   })
                              }
                         } catch (e) {
                              console.error("Error parsing JSON from stream:", e)
                         }
                    }
               }

               // Complete with collected results
               if (metadata) {
                    setResult({
                         result: streamedResult,
                         metadata: metadata
                    })

                    if (onComplete) {
                         onComplete({
                              result: streamedResult,
                              metadata: metadata
                         })
                    }
               }
          } catch (error) {
               console.error("Error in template streaming:", error)
               toast({
                    title: "Error",
                    description: "Failed to process template stream",
                    variant: "destructive"
               })
          } finally {
               setIsProcessing(false)
               setIsStreaming(false)
          }
     }

     return (
          <Dialog open={isOpen} onOpenChange={handleOpen}>
               <DialogTrigger asChild>
                    {trigger || (
                         <Button variant="outline" className="flex items-center gap-1">
                              Process with Template
                         </Button>
                    )}
               </DialogTrigger>
               <DialogContent className="sm:max-w-[90%] h-[95%] flex flex-col">
                    <DialogHeader>
                         <DialogTitle className="text-2xl font-bold">
                              Process Workspace with Template
                         </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-auto p-4 flex gap-4">
                         <div className="w-1/3 space-y-4">
                              <div>
                                   <Label>Select Template</Label>
                                   {isLoading ? (
                                        <div className="flex items-center justify-center py-4">
                                             <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                   ) : (
                                        <Select
                                             value={selectedTemplateId}
                                             onValueChange={setSelectedTemplateId}
                                             disabled={isProcessing}
                                        >
                                             <SelectTrigger>
                                                  <SelectValue placeholder="Select a template" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  {templates.map(template => (
                                                       <SelectItem key={template.id} value={template.id}>
                                                            {template.name}
                                                       </SelectItem>
                                                  ))}
                                             </SelectContent>
                                        </Select>
                                   )}
                              </div>

                              <div>
                                   <Label htmlFor="userInput">Message</Label>
                                   <Textarea
                                        id="userInput"
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        placeholder="Enter your specific query or context to use with the template"
                                        className="min-h-[200px]"
                                        disabled={isProcessing}
                                   />
                              </div>

                              <div className="flex gap-2">
                                   <Button
                                        onClick={() => processTemplate(false)}
                                        disabled={isProcessing || !selectedTemplateId}
                                        className="flex-1"
                                   >
                                        {isProcessing && !isStreaming ? (
                                             <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Processing...
                                             </>
                                        ) : "Process"}
                                   </Button>

                                   <Button
                                        onClick={() => processTemplate(true)}
                                        disabled={isProcessing || !selectedTemplateId}
                                        variant="outline"
                                        className="flex-1"
                                   >
                                        {isStreaming ? (
                                             <>
                                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                  Streaming...
                                             </>
                                        ) : "Stream"}
                                   </Button>
                              </div>
                         </div>

                         <div className="w-2/3">
                              <Card className="h-full flex flex-col">
                                   <CardHeader>
                                        <CardTitle>Results</CardTitle>
                                   </CardHeader>
                                   <CardContent className="flex-1 overflow-auto">
                                        {isProcessing && !streamedResult ? (
                                             <div className="flex items-center justify-center py-10">
                                                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                  <span className="ml-2 text-lg">Processing...</span>
                                             </div>
                                        ) : streamedResult ? (
                                             <div className="whitespace-pre-wrap">{streamedResult}</div>
                                        ) : result ? (
                                             <div className="whitespace-pre-wrap">{result.result}</div>
                                        ) : (
                                             <div className="text-center py-10 text-muted-foreground">
                                                  Select a template and click Process to get results
                                             </div>
                                        )}
                                   </CardContent>
                                   {(result?.metadata || isStreaming) && (
                                        <CardFooter className="border-t pt-4">
                                             <div className="text-sm text-muted-foreground">
                                                  <p className="font-medium">Sources:</p>
                                                  <ul className="list-disc list-inside">
                                                       {result?.metadata?.sources?.map((source: any, index: number) => (
                                                            <li key={index}>{source.source} (Score: {source.score.toFixed(2)})</li>
                                                       ))}
                                                  </ul>
                                             </div>
                                        </CardFooter>
                                   )}
                              </Card>
                         </div>
                    </div>

                    <DialogFooter>
                         <Button
                              variant="ghost"
                              onClick={() => setIsOpen(false)}
                              disabled={isProcessing}
                         >
                              Close
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
} 