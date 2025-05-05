"use client"

import { useState } from "react"
import { CreateWorkspaceDialog } from "@/components/dashboard/workspaces/create-workspace-dialog"
import { WorkspaceList } from "@/components/dashboard/workspaces/workspace-list"

export default function WorkspacesPage() {
     const [refreshKey, setRefreshKey] = useState(0)

     const handleWorkspaceCreated = () => {
          setRefreshKey(prev => prev + 1)
     }

     return (
          <div className="container py-8">
               <div className="flex items-center justify-between mb-8">
                    <div>
                         <h1 className="text-3xl font-bold">Workspaces</h1>
                         <p className="text-muted-foreground">
                              Manage your workspaces and organize your files
                         </p>
                    </div>
                    <CreateWorkspaceDialog onWorkspaceCreated={handleWorkspaceCreated} />
               </div>
               <WorkspaceList key={refreshKey} />
          </div>
     )
} 