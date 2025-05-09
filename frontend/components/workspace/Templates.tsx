"use client"
import { FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"

interface Template {
     id: string
     name: string
     description: string
     llm_model: string
     main_instructions: string
     business_description: string
     customer_profile: string
     rules_and_filters: string
     workspace_id: string
     created_at: string
}

interface TemplatesListProps {
     workspaceId: string
     onRefresh?: () => void
}

// Define query key for caching
const FILES_QUERY_KEY = 'workspace-templates';

export default function TemplatesList({ workspaceId, onRefresh }: TemplatesListProps) {
     const queryClient = useQueryClient();

     // Define the fetch function separately for reuse
     const fetchTemplates = async (): Promise<Template[]> => {
          const response = await api.get<Template[]>(`/api/templates?workspace_id=${workspaceId}`)
          return response.data || [];
     };

     // Use React Query for data fetching with caching
     const { data: templates = [], isLoading, error } = useQuery({
          queryKey: [FILES_QUERY_KEY, workspaceId],
          queryFn: fetchTemplates,
          staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
          refetchOnWindowFocus: false, // Don't refetch when window regains focus
     });

     const removeTemplate = async (id: string) => {
          try {
               // This would need a delete endpoint
               // await api.delete(`/api/files/${workspaceId}/${id}`)

               // Optimistic update - modify cache immediately
               queryClient.setQueryData(
                    [FILES_QUERY_KEY, workspaceId],
                    (oldData: Template[] | undefined) =>
                         oldData ? oldData.filter(template => template.id !== id) : []
               );

               if (onRefresh) onRefresh()
          } catch (error) {
               console.error("Error removing Template:", error)
               // Refetch on error to restore correct data
               queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY, workspaceId] });
          }
     }

     if (isLoading) {
          return <div className="flex items-center justify-center h-40">Loading Templates...</div>
     }

     if (error) {
          return <div className="flex items-center justify-center h-40 text-red-500">Error loading files</div>
     }

     if (templates.length === 0) {
          return (
               <div className="flex items-center justify-center h-40 border border-dashed border-gray-300 rounded-lg">
                    <div className="text-center text-gray-500">
                         <p>No templates yet</p>
                         <p className="text-sm">Upload files to get started</p>
                    </div>
               </div>
          )
     }

     return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {templates.map((template) => (
                    <div
                         key={template.id}
                         className="flex items-center justify-between bg-white rounded-md p-3 border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                         <div className="flex items-center gap-2">
                              <div>
                                   <span className="text-sm text-gray-700 block">{template.name}</span>
                              </div>
                         </div>
                         <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700"
                              onClick={() => removeTemplate(template.id)}
                         >
                              <X className="h-4 w-4" />
                         </Button>
                    </div>
               ))}
          </div>
     )
} 