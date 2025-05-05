import { Sidebar } from "@/components/workspace/sidebar"
import { WorkspaceHeader } from "@/components/workspace/header"

interface WorkspaceLayoutProps {
     children: React.ReactNode
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
     return (
          <div className="flex h-screen bg-background">
               <Sidebar />
               <div className="flex-1 flex flex-col">
                    <WorkspaceHeader />
                    <main className="flex-1 overflow-auto p-6">
                         {children}
                    </main>
               </div>
          </div>
     )
} 