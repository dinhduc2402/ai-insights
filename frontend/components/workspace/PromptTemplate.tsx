"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
     name: string
     description: string
     llmModel: string
     mainInstructions: string
     businessDescription: string
     customerProfile: string
     rulesAndFilters: string
     exampleOutputs: string
     guidanceOverride: string
     content: string // Complete prompt content
}

interface PromptTemplateProps {
     template?: PromptTemplate
     onSave: (template: PromptTemplate) => void
     trigger?: React.ReactNode
}

// Default template values
const defaultTemplate: PromptTemplate = {
     name: "",
     description: "",
     llmModel: "gpt-4",
     mainInstructions: "",
     businessDescription: "",
     customerProfile: "",
     rulesAndFilters: "",
     exampleOutputs: "",
     guidanceOverride: "",
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

export function PromptTemplate({ trigger }: PromptTemplateProps) {
     const [isOpen, setIsOpen] = useState(false)
     const [template, setTemplate] = useState<PromptTemplate>(defaultTemplate)
     const [activeTab, setActiveTab] = useState("basic")

     // Update template when prop changes
     useEffect(() => {
          setTemplate(defaultTemplate)
     }, [defaultTemplate])

     const handleChange = (field: keyof PromptTemplate, value: string) => {
          setTemplate(prev => ({
               ...prev,
               [field]: value
          }))
     }

     // Generate complete prompt from all fields
     const generatePrompt = () => {
          const {
               mainInstructions,
               businessDescription,
               customerProfile,
               rulesAndFilters,
               exampleOutputs,
               guidanceOverride
          } = template

          const promptParts = [
               mainInstructions ? `# Main Instructions\n${mainInstructions}\n\n` : "",
               businessDescription ? `# Business Description\n${businessDescription}\n\n` : "",
               customerProfile ? `# Customer Profile\n${customerProfile}\n\n` : "",
               rulesAndFilters ? `# Rules and Filters\n${rulesAndFilters}\n\n` : "",
               exampleOutputs ? `# Example Outputs\n${exampleOutputs}\n\n` : "",
               guidanceOverride ? `# Additional Guidance\n${guidanceOverride}\n\n` : ""
          ]

          const generatedPrompt = promptParts.join("")

          setTemplate(prev => ({
               ...prev,
               content: generatedPrompt
          }))

          setActiveTab("preview")
     }

     const handleSave = () => {
          // onSave(template)
          setIsOpen(false)
     }

     return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger asChild>
                    {trigger || (
                         <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-3 py-1 border-gray-300">
                              <span className="text-sm">Edit Prompt Template</span>
                         </Button>
                    )}
               </DialogTrigger>
               <DialogContent className="sm:max-w-[90%] h-[95%] flex flex-col">
                    <DialogHeader>
                         <DialogTitle className="text-2xl font-bold px-4">Edit Prompt Template</DialogTitle>
                    </DialogHeader>

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
                                             value={template.llmModel}
                                             onValueChange={(value) => handleChange('llmModel', value)}
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
                                        <Label htmlFor="mainInstructions">Main Instructions</Label>
                                        <Textarea
                                             id="mainInstructions"
                                             value={template.mainInstructions}
                                             onChange={(e) => handleChange('mainInstructions', e.target.value)}
                                             placeholder="Provide the primary instructions for the AI"
                                             className="w-full min-h-[150px] resize-none"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                             The core instructions that define what the AI should do
                                        </p>
                                   </div>

                                   <div>
                                        <Label htmlFor="businessDescription">Business Description</Label>
                                        <Textarea
                                             id="businessDescription"
                                             value={template.businessDescription}
                                             onChange={(e) => handleChange('businessDescription', e.target.value)}
                                             placeholder="Describe your business or context"
                                             className="w-full min-h-[150px] resize-none"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                             Provide context about your business for the AI
                                        </p>
                                   </div>

                                   <div>
                                        <Label htmlFor="customerProfile">Customer Profile</Label>
                                        <Textarea
                                             id="customerProfile"
                                             value={template.customerProfile}
                                             onChange={(e) => handleChange('customerProfile', e.target.value)}
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
                                        <Label htmlFor="rulesAndFilters">Rules and Filters</Label>
                                        <Textarea
                                             id="rulesAndFilters"
                                             value={template.rulesAndFilters}
                                             onChange={(e) => handleChange('rulesAndFilters', e.target.value)}
                                             placeholder="Define rules, constraints, or filters for the AI to follow"
                                             className="w-full min-h-[150px] resize-none"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                             Specific rules or constraints the AI should adhere to
                                        </p>
                                   </div>

                                   <div>
                                        <Label htmlFor="exampleOutputs">Example Outputs</Label>
                                        <Textarea
                                             id="exampleOutputs"
                                             value={template.exampleOutputs}
                                             onChange={(e) => handleChange('exampleOutputs', e.target.value)}
                                             placeholder="Provide examples of desired outputs"
                                             className="w-full min-h-[150px] resize-none"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                             Examples that show the AI the desired format and style
                                        </p>
                                   </div>

                                   <div>
                                        <Label htmlFor="guidanceOverride">Guidance Override</Label>
                                        <Textarea
                                             id="guidanceOverride"
                                             value={template.guidanceOverride}
                                             onChange={(e) => handleChange('guidanceOverride', e.target.value)}
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

                    <DialogFooter className="flex justify-between items-center">
                         <Button
                              type="button"
                              variant="outline"
                              onClick={generatePrompt}
                         >
                              Generate Prompt
                         </Button>

                         <div className="flex gap-2">
                              <Button
                                   variant="ghost"
                                   onClick={() => setIsOpen(false)}
                                   className="hover:bg-red-50 hover:text-red-500"
                              >
                                   Cancel
                              </Button>
                              <Button type="submit" onClick={handleSave}>
                                   Save & Close
                              </Button>
                         </div>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
} 