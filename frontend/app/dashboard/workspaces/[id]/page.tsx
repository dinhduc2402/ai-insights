"use client"
import React from 'react';
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { Bell, ChevronDown, MoreHorizontal, PaperclipIcon, SendIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import AttachmentsList from "@/components/workspace/AttachmentsList";
import FileUploader from "@/components/workspace/FileUploader";
import { PromptEditDialog } from "@/components/workspace/PromptEditDialog"
import { user_id } from '@/utils/data';
import { PromptTemplate } from '@/components/workspace/PromptTemplate';
import TemplatesList from '@/components/workspace/Templates';

const WorkspacePage = () => {
     const params = useParams();
     const workspaceId = params.id as string;
     const [workspace, setWorkspace] = useState<{ id: string; name: string; description?: string } | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     const [activeTab, setActiveTab] = useState("attachments")
     const [refreshKey, setRefreshKey] = useState(0)
     const [conversations, setConversations] = useState<{ id: string; text: string; timestamp: string }[]>([])
     const [inputMessage, setInputMessage] = useState("")
     const [selectedModel, setSelectedModel] = useState("Grok 3")
     const [selectedTool, setSelectedTool] = useState("DeepSearch")
     const [textareaHeight, setTextareaHeight] = useState("56px"); // min-h-14 is 56px
     const textareaRef = useRef<HTMLTextAreaElement>(null);

     const handleSendMessage = () => {
          if (inputMessage.trim()) {
               const newConversation = {
                    id: Date.now().toString(),
                    text: inputMessage,
                    timestamp: new Date().toLocaleTimeString(),
               }
               setConversations([...conversations, newConversation])
               setInputMessage("")
               setTextareaHeight("56px") // Reset height after sending
               setActiveTab("conversations") // Switch to conversations tab
          }
     }

     const handlePromptSave = (updatedContent: string) => {
          setInputMessage(updatedContent);
          // Update height based on new content
          if (updatedContent.length > 500) {
               setTextareaHeight("350px");
          } else {
               // Auto-size for shorter content
               if (textareaRef.current) {
                    textareaRef.current.style.height = "56px"; // Reset to calculate properly
                    const scrollHeight = textareaRef.current.scrollHeight;
                    const newHeight = Math.min(scrollHeight, 350); // Cap at 350px
                    setTextareaHeight(`${newHeight}px`);
               }
          }
     };

     const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === "Enter" && !e.shiftKey) {
               e.preventDefault()
               handleSendMessage()
          }
     }

     useEffect(() => {
          const loadData = async () => {
               try {
                    const wsResponse = await api.get<{ data: any }>(`/api/workspaces/${workspaceId}`);
                    setWorkspace(wsResponse.data.data);

               } catch (error) {
                    console.error("Error loading workspace or jobs:", error);
               } finally {
                    setIsLoading(false);
               }
          };
          loadData();
     }, [workspaceId]);

     if (isLoading) {
          return <div className="text-center py-8">Loading...</div>;
     }

     return (
          <div className="container py-4">
               <div className="flex flex-col h-full bg-white">
                    <div className="container mx-auto py-6 px-4 flex-1 flex flex-col">
                         {/* Workspace Header */}
                         <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                   <Bell className="h-5 w-5 text-purple-500" />
                                   <h1 className="text-xl font-semibold text-gray-900">{workspace?.name}</h1>
                              </div>

                              <div className="flex items-center gap-3">
                                   <Popover>
                                        <PopoverTrigger asChild>
                                             <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                                  <span className="mr-2">Instructions</span>
                                             </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                             <div className="space-y-2">
                                                  <h3 className="font-medium">Workspace Instructions</h3>
                                                  <p className="text-sm text-gray-500">
                                                       This workspace allows you to analyze data using AI. Upload CSV files and start a conversation to get
                                                       insights.
                                                  </p>
                                             </div>
                                        </PopoverContent>
                                   </Popover>
                                   <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                                        <MoreHorizontal className="h-5 w-5" />
                                   </Button>
                              </div>
                         </div>

                         {/* Conversation Input */}
                         <div className="bg-gray-50 rounded-3xl border border-gray-200 mb-6">
                              <div className="p-4">
                                   <textarea
                                        ref={textareaRef}
                                        placeholder="Start a conversation in this workspace"
                                        className="w-full bg-transparent text-gray-700 mb-4 outline-none px-2 @[480px]/input:px-3 focus:outline-none text-fg-primary align-bottom pt-5 my-0 overflow-auto"
                                        style={{ height: textareaHeight, minHeight: "56px", maxHeight: "350px" }}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyDownCapture={handleKeyDown}
                                   />
                                   <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                             <Popover>
                                                  <PopoverTrigger asChild>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1 h-8 px-3 py-1 border-gray-300"
                                                       >
                                                            <SearchIcon className="h-4 w-4 text-purple-500" />
                                                            <span className="text-sm">{selectedTool}</span>
                                                            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                                                       </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-48 p-0">
                                                       <div className="py-1">
                                                            {["DeepSearch", "BasicSearch", "AdvancedSearch"].map((tool) => (
                                                                 <button
                                                                      key={tool}
                                                                      className={cn(
                                                                           "flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100",
                                                                           selectedTool === tool && "bg-gray-100 font-medium",
                                                                      )}
                                                                      onClick={() => setSelectedTool(tool)}
                                                                 >
                                                                      {tool}
                                                                 </button>
                                                            ))}
                                                       </div>
                                                  </PopoverContent>
                                             </Popover>
                                             <PromptEditDialog
                                                  content={inputMessage}
                                                  onSave={handlePromptSave}
                                             />
                                             <PromptTemplate workspaceId={workspaceId} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <Popover>
                                                  <PopoverTrigger asChild>
                                                       <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1 h-8 px-3 py-1 border-gray-300"
                                                       >
                                                            <span className="text-sm">{selectedModel}</span>
                                                            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                                                       </Button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-48 p-0">
                                                       <div className="py-1">
                                                            {["Grok 3", "GPT-4o", "Claude 3", "Gemini Pro"].map((model) => (
                                                                 <button
                                                                      key={model}
                                                                      className={cn(
                                                                           "flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100",
                                                                           selectedModel === model && "bg-gray-100 font-medium",
                                                                      )}
                                                                      onClick={() => setSelectedModel(model)}
                                                                 >
                                                                      {model}
                                                                 </button>
                                                            ))}
                                                       </div>
                                                  </PopoverContent>
                                             </Popover>

                                             <Button
                                                  variant="default"
                                                  size="icon"
                                                  className="h-8 w-8 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                                                  onClick={handleSendMessage}
                                                  disabled={!inputMessage.trim()}
                                             >
                                                  <SendIcon className="h-4 w-4" />
                                             </Button>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Tabs and Content */}
                         <div className="flex-1 flex flex-col">
                              <Tabs defaultValue="attachments" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                   <div className="border-b border-gray-200">
                                        <TabsList className="bg-transparent h-auto p-0">
                                             <TabsTrigger
                                                  value="attachments"
                                                  className={cn(
                                                       "rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700",
                                                       activeTab === "attachments" && "border-purple-500 text-gray-900",
                                                  )}
                                             >
                                                  Attachments
                                             </TabsTrigger>
                                             <TabsTrigger
                                                  value="conversations"
                                                  className={cn(
                                                       "rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700",
                                                       activeTab === "conversations" && "border-purple-500 text-gray-900",
                                                  )}
                                             >
                                                  Conversations
                                             </TabsTrigger>
                                             <TabsTrigger
                                                  value="templates"
                                                  className={cn(
                                                       "rounded-none border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700",
                                                       activeTab === "templates" && "border-purple-500 text-gray-900",
                                                  )}
                                             >
                                                  Templates
                                             </TabsTrigger>
                                        </TabsList>
                                   </div>
                                   <div className="flex justify-end mt-4">
                                        <FileUploader
                                             workspaceId={workspaceId}
                                             userId={user_id}
                                             onUploadSuccess={() => {
                                                  setActiveTab("attachments");
                                                  setRefreshKey(prev => prev + 1); // Force attachment list to refresh
                                             }}
                                        />
                                   </div>
                                   <TabsContent value="attachments" className="mt-4 flex-1">
                                        <AttachmentsList
                                             workspaceId={workspaceId}
                                             onRefresh={() => setActiveTab("attachments")}
                                             key={refreshKey}
                                        />
                                   </TabsContent>
                                   <TabsContent value="conversations" className="mt-4 flex-1">
                                        {conversations.length > 0 ? (
                                             <div className="space-y-4">
                                                  {conversations.map((conversation) => (
                                                       <div key={conversation.id} className="bg-white rounded-md p-4 border border-gray-200">
                                                            <div className="flex justify-between items-start">
                                                                 <p className="text-gray-700">{conversation.text}</p>
                                                                 <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="flex items-center justify-center h-40 border border-dashed border-gray-300 rounded-lg">
                                                  <div className="text-center text-gray-500">
                                                       <p>No conversations yet</p>
                                                       <p className="text-sm">Start a conversation to see it here</p>
                                                  </div>
                                             </div>
                                        )}
                                   </TabsContent>
                                   <TabsContent value="templates" className="mt-4 flex-1">
                                        <TemplatesList
                                             workspaceId={workspaceId}
                                             onRefresh={() => setActiveTab("templates")}
                                             key={refreshKey}
                                        />
                                   </TabsContent>
                              </Tabs>
                         </div>
                    </div>
               </div>
          </div>
     );
};

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
     return (
          <svg
               {...props}
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
          >
               <circle cx="11" cy="11" r="8" />
               <path d="m21 21-4.3-4.3" />
          </svg>
     )
}

export default WorkspacePage;
