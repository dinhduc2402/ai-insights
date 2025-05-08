"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"

interface PromptEditDialogProps {
     content: string
     onSave: (content: string) => void
     trigger?: React.ReactNode
}

export function PromptEditDialog({ content: initialContent, onSave, trigger }: PromptEditDialogProps) {
     const [isOpen, setIsOpen] = useState(false)
     const [content, setContent] = useState(initialContent)

     // Update content when prop changes
     useEffect(() => {
          setContent(initialContent)
     }, [initialContent])

     const handleSave = () => {
          onSave(content)
          setIsOpen(false)
     }

     return (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
               <DialogTrigger asChild>
                    {trigger || (
                         <Button variant="outline" size="sm" className="flex items-center gap-1 h-8 px-3 py-1 border-gray-300">
                              <span className="text-sm">Edit Prompt</span>
                         </Button>
                    )}
               </DialogTrigger>
               <DialogContent className="sm:max-w-[90%] h-[95%] flex flex-col">
                    <DialogHeader>
                         <DialogTitle>Edit Prompt</DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 min-h-0 my-4">
                         <textarea
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              className="w-full h-full min-h-[400px] p-4 border rounded-md focus:outline-none resize-none"
                              placeholder="Enter your prompt here..."
                         />
                    </div>

                    <DialogFooter className="flex justify-between items-center">
                         <Button
                              variant="ghost"
                              onClick={() => setIsOpen(false)}
                              className="hover:bg-red-50 hover:text-red-500"
                         >
                              Cancel
                         </Button>
                         <Button type="submit" onClick={handleSave}>
                              Save & Close
                         </Button>
                    </DialogFooter>
               </DialogContent>
          </Dialog>
     )
} 