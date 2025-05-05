"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, MessageSquare, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
     {
          title: "Files",
          href: "/workspace/files",
          icon: FileText,
     },
     {
          title: "Assistant",
          href: "/workspace/assistant",
          icon: MessageSquare,
     },
     {
          title: "Settings",
          href: "/workspace/settings",
          icon: Settings,
     },
]

export function Sidebar() {
     const pathname = usePathname()

     return (
          <div className="w-64 border-r bg-card">
               <div className="flex h-16 items-center border-b px-4">
                    <h1 className="text-lg font-semibold">AI Insights</h1>
               </div>
               <nav className="space-y-1 p-4">
                    {sidebarItems.map((item) => {
                         const isActive = pathname === item.href
                         return (
                              <Link
                                   key={item.href}
                                   href={item.href}
                                   className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                        isActive
                                             ? "bg-primary text-primary-foreground"
                                             : "hover:bg-accent hover:text-accent-foreground"
                                   )}
                              >
                                   <item.icon className="h-4 w-4" />
                                   {item.title}
                              </Link>
                         )
                    })}
               </nav>
          </div>
     )
} 