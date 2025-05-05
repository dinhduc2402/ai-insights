import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function WorkspaceHeader() {
     return (
          <div className="flex h-16 items-center justify-between border-b px-6">
               <div>
                    <h2 className="text-lg font-semibold">My Workspace</h2>
                    <p className="text-sm text-muted-foreground">
                         Manage your files and interact with the AI assistant
                    </p>
               </div>
               <div className="flex items-center gap-4">
                    <Button>
                         <Upload className="mr-2 h-4 w-4" />
                         Upload File
                    </Button>
               </div>
          </div>
     )
} 