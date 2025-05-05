import { Eye, Mail, Pencil } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TemplateCardProps {
  name: string
  id: string
  active?: boolean
  prebuilt?: boolean
  onToggle?: (id: string, active: boolean) => void
}

export function TemplateCard({ name, id, active = false, prebuilt = false, onToggle }: TemplateCardProps) {
  return (
    <Card className="flex items-center justify-between p-4 hover:bg-muted/20">
      <div className="flex items-center gap-2">
        <span className="text-lg font-medium">{name}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-6 w-6">
                <span className="sr-only">Info</span>
                <span className="h-5 w-5 rounded-full border border-input flex items-center justify-center text-xs">
                  i
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{prebuilt ? "Prebuilt template" : "Custom template"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/ai-insights/view/${id}`}>
                  <Eye className="h-5 w-5" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View template</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Email insights</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/ai-insights/edit/${id}`}>
                  <Pencil className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit template</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Switch checked={active} onCheckedChange={(checked) => onToggle?.(id, checked)} />
      </div>
    </Card>
  )
}
