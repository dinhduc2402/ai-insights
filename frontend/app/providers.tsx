'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { FileProvider } from '@/components/workspace/FileContext'

export default function Providers({ children }: { children: React.ReactNode }) {
     // Create a new QueryClient instance on every render in development
     // This ensures data isn't shared between connections
     const [queryClient] = useState(() => new QueryClient({
          defaultOptions: {
               queries: {
                    staleTime: 5 * 60 * 1000, // 5 minutes
                    refetchOnWindowFocus: false,
               },
          },
     }))

     return (
          <QueryClientProvider client={queryClient}>
               <FileProvider>
                    {children}
               </FileProvider>
          </QueryClientProvider>
     )
} 