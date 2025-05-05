"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface CreateWorkspaceDialogProps {
     onWorkspaceCreated: () => void
}

interface CreateWorkspaceRequest {
     name: string
     description: string
}

interface CreateWorkspaceResponse {
     data: {
          id: string
          name: string
          description: string
          createdAt: string
     }
}

export function CreateWorkspaceDialog({ onWorkspaceCreated }: CreateWorkspaceDialogProps) {
     const [open, setOpen] = useState(false)
     const [name, setName] = useState("")
     const [description, setDescription] = useState("")
     const [isLoading, setIsLoading] = useState(false)

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setIsLoading(true)

          try {
               await api.post<CreateWorkspaceResponse>("/api/workspaces", {
                    name,
                    description,
               } as CreateWorkspaceRequest)
               toast.success("Workspace created successfully")
               setOpen(false)
               setName("")
               setDescription("")
               onWorkspaceCreated()
          } catch (error) {
               console.error("Error creating workspace:", error)
               toast.error("Failed to create workspace")
          } finally {
               setIsLoading(false)
          }
     }

     return (
          <Dialog open={open} onOpenChange={setOpen}>
               <DialogTrigger asChild>
                    <Button>Create Workspace</Button>
               </DialogTrigger>
               <DialogContent>
                    <DialogHeader>
                         <DialogTitle>Create New Workspace</DialogTitle>
                         <DialogDescription>
                              Create a new workspace to organize your files and conversations.
                         </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                         <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                   <Label htmlFor="name">Name</Label>
                                   <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter workspace name"
                                        required
                                   />
                              </div>
                              <div className="grid gap-2">
                                   <Label htmlFor="description">Description</Label>
                                   <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter workspace description"
                                   />
                              </div>
                         </div>
                         <DialogFooter>
                              <Button type="submit" disabled={isLoading}>
                                   {isLoading ? "Creating..." : "Create Workspace"}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     )
} 