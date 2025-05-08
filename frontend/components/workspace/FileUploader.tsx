"use client"
import { useRef } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useFiles } from "./FileContext"

interface FileUploaderProps {
     workspaceId: string
     userId?: string
     onUploadSuccess?: () => void
     onUploadError?: (error: Error) => void
}

export default function FileUploader({
     workspaceId,
     userId = "",
     onUploadSuccess,
     onUploadError
}: FileUploaderProps) {
     const fileInputRef = useRef<HTMLInputElement>(null)
     const { uploadFile, isUploading } = useFiles();

     const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const files = e.target.files
          if (!files || files.length === 0) return

          try {
               for (let i = 0; i < files.length; i++) {
                    const file = files[i]
                    const formData = new FormData()
                    formData.append('file', file)

                    await uploadFile(workspaceId, formData, userId);
               }

               // Reset the input value to allow uploading the same file again
               if (fileInputRef.current) {
                    fileInputRef.current.value = ""
               }

               if (onUploadSuccess) {
                    onUploadSuccess();
               }
          } catch (error) {
               console.error("Error during file upload loop:", error);
               if (onUploadError && error instanceof Error) {
                    onUploadError(error);
               }
          }
     }

     return (
          <>
               <TooltipProvider>
                    <Tooltip>
                         <TooltipTrigger asChild>
                              <Button
                                   variant="outline"
                                   size="sm"
                                   className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                   onClick={() => fileInputRef.current?.click()}
                                   disabled={isUploading}
                              >
                                   <Upload className="h-4 w-4 mr-2" />
                                   {isUploading ? "Uploading..." : "Attach"}
                              </Button>
                         </TooltipTrigger>
                         <TooltipContent>
                              <p>Upload files to the workspace</p>
                         </TooltipContent>
                    </Tooltip>
               </TooltipProvider>

               <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileUpload}
               />
          </>
     )
} 