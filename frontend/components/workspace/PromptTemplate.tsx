"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"

// Template data structure based on database schema
interface PromptTemplate {
     id?: string
     workspaceId: string
     name: string
     description: string
     status?: string
     llm_model: string
     main_instructions: string
     business_description: string
     customer_profile: string
     rules_and_filters: string
     example_outputs: string
     guidance_override: string
     content: string // Complete prompt content
}

interface PromptTemplateProps {
     trigger?: React.ReactNode
     workspaceId: string
     templateId?: string
     onSuccess?: () => void
}

// Default template values
const defaultTemplate: PromptTemplate = {
     workspaceId: "",
     name: "",
     description: "",
     status: "active",
     llm_model: "gpt-4",
     main_instructions: "",
     business_description: "",
     customer_profile: "",
     rules_and_filters: "",
     example_outputs: "",
     guidance_override: "",
     content: ""
}

// Available AI models
const aiModels = [
     { id: "gpt-4", name: "GPT-4" },
     { id: "gpt-4o", name: "GPT-4o" },
     { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
     { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
     { id: "claude-3-haiku", name: "Claude 3 Haiku" },
     { id: "xai", name: "Grok 3" },
     { id: "deepseek-coder", name: "DeepSeek R1" },
]

export function PromptTemplate({ trigger, workspaceId, templateId, onSuccess }: PromptTemplateProps) {
     const router = useRouter()
     const [isOpen, setIsOpen] = useState(false)
     const [template, setTemplate] = useState<PromptTemplate>(defaultTemplate)
     const [activeTab, setActiveTab] = useState("basic")
     const [isSubmitting, setIsSubmitting] = useState(false)
     const [isLoading, setIsLoading] = useState(false)

     // Fetch template if templateId is provided
     useEffect(() => {
          if (templateId && isOpen) {
               setIsLoading(true)
               api.get<PromptTemplate>(`/api/templates/${templateId}`)
                    .then(response => {
                         setTemplate(response.data as PromptTemplate)
                    })
                    .catch(error => {
                         console.error("Error fetching template:", error)
                         toast({
                              title: "Error",
                              description: "Failed to load template",
                              variant: "destructive"
                         })
                    })
                    .then(() => {
                         setIsLoading(false)
                    })
          } else {
               // Set default template with current workspace ID
               setTemplate({
                    ...defaultTemplate,
                    workspaceId: workspaceId
               })
          }
     }, [templateId, workspaceId, isOpen])

     const handleChange = (field: keyof PromptTemplate, value: string) => {
          setTemplate(prev => ({
               ...prev,
               [field]: value
          }))
     }

     // Generate complete prompt from all fields
     const generatePrompt = () => {
          const {
               main_instructions,
               business_description,
               customer_profile,
               rules_and_filters,
               example_outputs,
               guidance_override
          } = template

          const promptParts = [
               main_instructions ? `# Main Instructions\n${main_instructions}\n\n` : "",
               business_description ? `# Business Description\n${business_description}\n\n` : "",
               customer_profile ? `# Customer Profile\n${customer_profile}\n\n` : "",
               rules_and_filters ? `# Rules and Filters\n${rules_and_filters}\n\n` : "",
               example_outputs ? `# Example Outputs\n${example_outputs}\n\n` : "",
               guidance_override ? `# Additional Guidance\n${guidance_override}\n\n` : ""
          ]

          const generatedPrompt = promptParts.join("")

          setTemplate(prev => ({
               ...prev,
               content: generatedPrompt
          }))

          setActiveTab("preview")
     }

     const validateTemplate = () => {
          if (!template.name.trim()) {
               toast({
                    title: "Validation Error",
                    description: "Template name is required",
                    variant: "destructive"
               })
               return false
          }

          if (!template.content.trim() && !template.main_instructions.trim()) {
               toast({
                    title: "Validation Error",
                    description: "Either a prompt or main instructions are required",
                    variant: "destructive"
               })
               return false
          }

          return true
     }

     const handleSave = async () => {
          if (!validateTemplate()) return

          setIsSubmitting(true)

          try {
               // If no content is generated yet, generate it from fields
               if (!template.content.trim()) {
                    generatePrompt()
               }

               // Prepare data for API
               const templateData = {
                    ...template,
                    status: template.status || "active"
               }

               let response
               if (templateId) {
                    // Update existing template
                    response = await api.put(`/api/templates/${templateId}`, templateData)
               } else {
                    // Create new template
                    response = await api.post('/api/templates', templateData)
               }

               toast({
                    title: templateId ? "Template Updated" : "Template Created",
                    description: `Successfully ${templateId ? "updated" : "created"} template: ${template.name}`,
               })

               // Close dialog
               setIsOpen(false)

               // Call success callback or navigate
               if (onSuccess) {
                    onSuccess()
               } else {
                    // Navigate to templates page
                    router.push('/dashboard/templates')
               }
          } catch (error) {
               console.error("Error saving template:", error)
               toast({
                    title: "Error",
                    description: `Failed to ${templateId ? "update" : "create"} template`,
                    variant: "destructive"
               })
          } finally {
               setIsSubmitting(false)
          }
     }

     return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger asChild>
                    {trigger || (
                         <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-3 py-1 border-gray-300">
                              <span className="text-sm">{templateId ? "Edit Template" : "Create Template"}</span>
                         </Button>
                    )}
               </DialogTrigger>
               <DialogContent className="sm:max-w-[90%] h-[95%] flex flex-col">
                    <DialogHeader>
                         <DialogTitle className="text-2xl font-bold px-4">
                              {templateId ? "Edit" : "Create"} Prompt Template
                         </DialogTitle>
                    </DialogHeader>

                    {isLoading ? (
                         <div className="flex-1 flex items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <span className="ml-2">Loading template...</span>
                         </div>
                    ) : (
                         <div className="flex-1 min-h-0 overflow-auto px-4">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                   <div>
                                        <Label htmlFor="name">Template Name</Label>
                                        <Input
                                             id="name"
                                             value={template.name}
                                             onChange={(e) => handleChange('name', e.target.value)}
                                             placeholder="E.g., Customer Engagement Analysis"
                                             className="w-full"
                                        />
                                   </div>

                                   <div className="flex gap-4">
                                        <div className="flex-1">
                                             <Label htmlFor="model">AI Model</Label>
                                             <Select
                                                  value={template.llm_model}
                                                  onValueChange={(value) => handleChange('llm_model', value)}
                                             >
                                                  <SelectTrigger>
                                                       <SelectValue placeholder="Select model" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {aiModels.map(model => (
                                                            <SelectItem key={model.id} value={model.id}>
                                                                 {model.name}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   </div>
                              </div>

                              <div className="mb-4">
                                   <Label htmlFor="description">Description</Label>
                                   <Textarea
                                        id="description"
                                        value={template.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        placeholder="Brief description of what this template is used for"
                                        className="w-full resize-none h-20"
                                   />
                              </div>

                              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                   <TabsList className="grid grid-cols-3 mb-4">
                                        <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                                        <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                   </TabsList>

                                   <TabsContent value="basic" className="space-y-4">
                                        <div>
                                             <Label htmlFor="main_instructions">Main Instructions</Label>
                                             <Textarea
                                                  id="main_instructions"
                                                  value={template.main_instructions}
                                                  onChange={(e) => handleChange('main_instructions', e.target.value)}
                                                  placeholder="Provide the primary instructions for the AI"
                                                  className="w-full min-h-[150px] resize-none"
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  The core instructions that define what the AI should do
                                             </p>
                                        </div>

                                        <div>
                                             <Label htmlFor="business_description">Business Description</Label>
                                             <Textarea
                                                  id="business_description"
                                                  value={template.business_description}
                                                  onChange={(e) => handleChange('business_description', e.target.value)}
                                                  placeholder="Describe your business or context"
                                                  className="w-full min-h-[150px] resize-none"
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  Provide context about your business for the AI
                                             </p>
                                        </div>

                                        <div>
                                             <Label htmlFor="customer_profile">Customer Profile</Label>
                                             <Textarea
                                                  id="customer_profile"
                                                  value={template.customer_profile}
                                                  onChange={(e) => handleChange('customer_profile', e.target.value)}
                                                  placeholder="Describe your target customers or audience"
                                                  className="w-full min-h-[150px] resize-none"
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  Information about your customers to help the AI generate relevant insights
                                             </p>
                                        </div>
                                   </TabsContent>

                                   <TabsContent value="advanced" className="space-y-4">
                                        <div>
                                             <Label htmlFor="rules_and_filters">Rules and Filters</Label>
                                             <Textarea
                                                  id="rules_and_filters"
                                                  value={template.rules_and_filters}
                                                  onChange={(e) => handleChange('rules_and_filters', e.target.value)}
                                                  placeholder="Define rules, constraints, or filters for the AI to follow"
                                                  className="w-full min-h-[150px] resize-none"
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  Specific rules or constraints the AI should adhere to
                                             </p>
                                        </div>

                                        <div>
                                             <Label htmlFor="example_outputs">Example Outputs</Label>
                                             <Textarea
                                                  id="example_outputs"
                                                  value={template.example_outputs}
                                                  onChange={(e) => handleChange('example_outputs', e.target.value)}
                                                  placeholder="Provide examples of desired outputs"
                                                  className="w-full min-h-[150px] resize-none"
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  Examples that show the AI the desired format and style
                                             </p>
                                        </div>

                                        <div>
                                             <Label htmlFor="guidance_override">Guidance Override</Label>
                                             <Textarea
                                                  id="guidance_override"
                                                  value={template.guidance_override}
                                                  onChange={(e) => handleChange('guidance_override', e.target.value)}
                                                  placeholder="Any additional guidance to override default behavior"
                                                  className="w-full min-h-[150px] resize-none"
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  Special instructions that override standard guidance
                                             </p>
                                        </div>
                                   </TabsContent>

                                   <TabsContent value="preview">
                                        <div>
                                             <div className="flex justify-between items-center mb-2">
                                                  <Label htmlFor="generatedPrompt">Generated Prompt</Label>
                                                  <Button
                                                       type="button"
                                                       variant="outline"
                                                       size="sm"
                                                       onClick={() => setActiveTab("basic")}
                                                  >
                                                       Edit Sections
                                                  </Button>
                                             </div>
                                             <Textarea
                                                  id="generatedPrompt"
                                                  value={template.content}
                                                  onChange={(e) => handleChange('content', e.target.value)}
                                                  className="w-full h-[400px] font-mono text-sm resize-none"
                                                  placeholder="Your generated prompt will appear here..."
                                             />
                                             <p className="text-xs text-muted-foreground mt-1">
                                                  The final prompt that will be sent to the AI model
                                             </p>
                                        </div>
                                   </TabsContent>
                              </Tabs>
                         </div>
                    )}

                    <DialogFooter className="flex justify-between items-center">
                         <Button
                              type="button"
                              variant="outline"
                              onClick={generatePrompt}
                              disabled={isSubmitting || isLoading}
                         >
                              Generate Prompt
                         </Button>

                         <div className="flex gap-2">
                              <Button
                                   variant="ghost"
                                   onClick={() => setIsOpen(false)}
                                   className="hover:bg-red-50 hover:text-red-500"
                                   disabled={isSubmitting}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   onClick={handleSave}
                                   disabled={isSubmitting}
                              >
                                   {isSubmitting ? (
                                        <>
                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                             Saving...
                                        </>
                                   ) : (
                                        "Save & Close"
                                   )}
                              </Button>
                         </div>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
} 