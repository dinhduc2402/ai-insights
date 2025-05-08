"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Folder, MoreVertical, Settings, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Workspace {
     id: string
     name: string
     description: string
     createdAt: string
}

interface ApiResponse {
     data: Workspace[]
}

export function WorkspaceList() {
     const router = useRouter()
     const [workspaces, setWorkspaces] = useState<Workspace[]>([])
     const [isLoading, setIsLoading] = useState(true)

     useEffect(() => {
          loadWorkspaces()
     }, [])

     const loadWorkspaces = async () => {
          try {
               setIsLoading(true)
               const response = await api.get<ApiResponse>("/api/workspaces")

               setWorkspaces(response.data.data)
          } catch (error) {
               console.error("Error loading workspaces:", error)
               toast.error("Failed to load workspaces")
          } finally {
               setIsLoading(false)
          }
     }

     const handleDelete = async (workspaceId: string) => {
          try {
               await api.delete(`/api/workspaces/${workspaceId}`)
               toast.success("Workspace deleted successfully")
               loadWorkspaces()
          } catch (error) {
               console.error("Error deleting workspace:", error)
               toast.error("Failed to delete workspace")
          }
     }

     if (isLoading) {
          return <div className="text-center py-8">Loading workspaces...</div>
     }

     if (workspaces.length === 0) {
          return (
               <div className="text-center py-8">
                    <p className="text-muted-foreground">No workspaces found. Create one to get started.</p>
               </div>
          )
     }

     return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {workspaces.map((workspace) => (
                    <div
                         key={workspace.id}
                         className="group relative rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
                    >
                         <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                   <Folder className="h-5 w-5 text-muted-foreground" />
                                   <h3 className="font-semibold">{workspace.name}</h3>
                              </div>
                              <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                             <MoreVertical className="h-4 w-4" />
                                        </Button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                             <Link href={`/dashboard/workspaces/${workspace.id}`}>
                                                  <Settings className="mr-2 h-4 w-4" />
                                                  Open
                                             </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                             className="text-destructive"
                                             onClick={() => handleDelete(workspace.id)}
                                        >
                                             <Trash className="mr-2 h-4 w-4" />
                                             Delete
                                        </DropdownMenuItem>
                                   </DropdownMenuContent>
                              </DropdownMenu>
                         </div>
                         <p className="mt-2 text-sm text-muted-foreground">
                              {workspace.description}
                         </p>
                         <p className="mt-4 text-xs text-muted-foreground">
                              Created {new Date(workspace.createdAt).toLocaleDateString()}
                         </p>
                    </div>
               ))}
          </div>
     )
} 