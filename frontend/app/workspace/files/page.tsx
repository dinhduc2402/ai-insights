import { FileUpload } from "@/components/workspace/file-upload"
import { api } from "@/lib/api"

export default function FilesPage() {
     const handleUpload = async (file: File) => {
          const formData = new FormData()
          formData.append("file", file)

          try {
               const response = await api.post("/api/assistant/upload/my-workspace", formData)
               console.log("File uploaded successfully:", response.data)
          } catch (error) {
               console.error("Error uploading file:", error)
               throw error
          }
     }

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold">Files</h1>
                    <p className="text-muted-foreground">
                         Upload and manage your files in the workspace
                    </p>
               </div>
               <FileUpload onUpload={handleUpload} />
          </div>
     )
} 