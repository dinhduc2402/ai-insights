"use client"
import { FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface Attachment {
     id: string
     filename: string
     content_type?: string
     file_size: number
     workspace_id: string
     created_at: string
}

interface AttachmentsListProps {
     workspaceId: string
     onRefresh?: () => void
}

// Define query key for caching
const FILES_QUERY_KEY = 'workspace-files';

export default function AttachmentsList({ workspaceId, onRefresh }: AttachmentsListProps) {
     const queryClient = useQueryClient();

     // Define the fetch function separately for reuse
     const fetchAttachments = async (): Promise<Attachment[]> => {
          const response = await api.get<Attachment[]>(`/api/files/${workspaceId}`)
          return response.data || [];
     };

     // Use React Query for data fetching with caching
     const { data: attachments = [], isLoading, error } = useQuery({
          queryKey: [FILES_QUERY_KEY, workspaceId],
          queryFn: fetchAttachments,
          staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
          refetchOnWindowFocus: false, // Don't refetch when window regains focus
     });

     const removeAttachment = async (id: string) => {
          try {
               // This would need a delete endpoint
               // await api.delete(`/api/files/${workspaceId}/${id}`)

               // Optimistic update - modify cache immediately
               queryClient.setQueryData(
                    [FILES_QUERY_KEY, workspaceId],
                    (oldData: Attachment[] | undefined) =>
                         oldData ? oldData.filter(attachment => attachment.id !== id) : []
               );

               if (onRefresh) onRefresh()
          } catch (error) {
               console.error("Error removing attachment:", error)
               // Refetch on error to restore correct data
               queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY, workspaceId] });
          }
     }

     const getFileIcon = (contentType?: string, filename?: string) => {
          if (contentType?.includes('spreadsheet') ||
               filename?.endsWith('.csv') ||
               filename?.endsWith('.xlsx')) {
               return <FileSpreadsheet className="h-5 w-5 text-green-500" />
          }
          return <FileSpreadsheet className="h-5 w-5 text-blue-500" />
     }

     if (isLoading) {
          return <div className="flex items-center justify-center h-40">Loading attachments...</div>
     }

     if (error) {
          return <div className="flex items-center justify-center h-40 text-red-500">Error loading files</div>
     }

     if (attachments.length === 0) {
          return (
               <div className="flex items-center justify-center h-40 border border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                         <p>No attachments yet</p>
                         <p className="text-sm">Upload files to get started</p>
                    </div>
               </div>
          )
     }

     return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {attachments.map((attachment) => (
                    <div
                         key={attachment.id}
                         className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                         <div className="flex items-center gap-2">
                              {getFileIcon(attachment.content_type, attachment.filename)}
                              <div>
                                   <span className="text-sm text-gray-700 block">{attachment.filename}</span>
                                   <span className="text-xs text-gray-500 block">
                                        {(attachment.file_size / 1024).toFixed(1)} KB
                                   </span>
                              </div>
                         </div>
                         <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                              onClick={() => removeAttachment(attachment.id)}
                         >
                              <X className="h-4 w-4" />
                         </Button>
                    </div>
               ))}
          </div>
     )
} 