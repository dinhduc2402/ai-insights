import Link from "next/link"
import { ArrowLeft, Edit, Menu, Plus, Share } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ChatHeader() {
  return (
    <div className="flex items-center justify-between border-b px-4 py-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </div>

      <h1 className="text-xl font-semibold">AI Chat</h1>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Edit className="h-5 w-5" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
          <span className="sr-only">New chat</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Share className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </div>
  )
}
