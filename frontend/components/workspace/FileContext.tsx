"use client"
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

interface Attachment {
     id: string;
     filename: string;
     content_type?: string;
     file_size: number;
     workspace_id: string;
     created_at: string;
}

interface FileContextType {
     files: Attachment[];
     isLoading: boolean;
     error: Error | null;
     fetchFiles: (workspaceId: string) => Promise<void>;
     removeFile: (id: string) => void;
     uploadFile: (workspaceId: string, formData: FormData, userId?: string) => Promise<void>;
     isUploading: boolean;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function useFiles() {
     const context = useContext(FileContext);
     if (context === undefined) {
          throw new Error("useFiles must be used within a FileProvider");
     }
     return context;
}

export function FileProvider({ children }: { children: React.ReactNode }) {
     const [files, setFiles] = useState<Attachment[]>([]);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState<Error | null>(null);
     const [isUploading, setIsUploading] = useState(false);

     const fetchFiles = useCallback(async (workspaceId: string) => {
          if (!workspaceId) return;

          setIsLoading(true);
          setError(null);

          try {
               const response = await api.get<Attachment[]>(`/api/files/${workspaceId}`);
               setFiles(response.data || []);
          } catch (err) {
               console.error("Error fetching files:", err);
               setError(err instanceof Error ? err : new Error("Failed to fetch files"));
          } finally {
               setIsLoading(false);
          }
     }, []);

     const removeFile = useCallback((id: string) => {
          setFiles(prev => prev.filter(file => file.id !== id));
     }, []);

     const uploadFile = useCallback(async (workspaceId: string, formData: FormData, userId?: string) => {
          setIsUploading(true);
          try {
               const queryParams = userId ? `?user_id=${userId}` : '';
               await api.post(
                    `/api/files/upload/${workspaceId}${queryParams}`,
                    formData,
                    {
                         headers: {
                              'Content-Type': 'multipart/form-data'
                         }
                    }
               );

               // Refresh file list after upload
               await fetchFiles(workspaceId);
          } catch (err) {
               console.error("Error uploading file:", err);
               throw err;
          } finally {
               setIsUploading(false);
          }
     }, [fetchFiles]);

     const value = {
          files,
          isLoading,
          error,
          fetchFiles,
          removeFile,
          uploadFile,
          isUploading
     };

     return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
} 