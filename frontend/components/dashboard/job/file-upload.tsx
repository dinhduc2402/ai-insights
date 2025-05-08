'use client';

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
     onUpload: (file: File) => Promise<void>
}

export function FileUpload({ onUpload }: FileUploadProps) {
     const [isUploading, setIsUploading] = useState(false)
     const [progress, setProgress] = useState(0)
     const [error, setError] = useState<string | null>(null)

     const onDrop = useCallback(async (acceptedFiles: File[]) => {
          if (acceptedFiles.length === 0) return

          const file = acceptedFiles[0]
          setIsUploading(true)
          setError(null)

          try {
               await onUpload(file)
               setProgress(100)
          } catch (err) {
               setError(err instanceof Error ? err.message : "Failed to upload file")
          } finally {
               setIsUploading(false)
          }
     }, [onUpload])

     const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop,
          accept: {
               "text/*": [".txt", ".md", ".csv"],
               "application/pdf": [".pdf"],
               "application/json": [".json"],
          },
          maxFiles: 1,
     })

     return (
          <div className="space-y-4">
               <div
                    {...getRootProps()}
                    className={cn(
                         "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                         isDragActive
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/25 hover:border-primary/50"
                    )}
               >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                         {isDragActive
                              ? "Drop the file here"
                              : "Drag and drop a file here, or click to select"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                         Supported formats: TXT, MD, CSV, PDF, JSON
                    </p>
               </div>

               {isUploading && (
                    <div className="space-y-2">
                         <Progress value={progress} />
                         <p className="text-sm text-muted-foreground text-center">
                              Uploading file...
                         </p>
                    </div>
               )}

               {error && (
                    <div className="flex items-center gap-2 text-destructive">
                         <X className="h-4 w-4" />
                         <p className="text-sm">{error}</p>
                    </div>
               )}
          </div>
     )
} 