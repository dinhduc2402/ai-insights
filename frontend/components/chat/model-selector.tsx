"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type Model = {
  id: string
  name: string
  description?: string
  icon: React.ReactNode
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelSelector({ models, selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const selectedModelData = models.find((model) => model.id === selectedModel)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 h-9 px-3 border-muted-foreground/20 bg-background"
        >
          {selectedModelData?.icon}
          <span className="text-sm font-medium">{selectedModelData?.name || "Select model"}</span>
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 shadow-lg" align="start">
        <div className="py-2">
          <RadioGroup value={selectedModel} onValueChange={onModelChange}>
            {models.map((model) => (
              <div key={model.id} className="flex items-center justify-between px-3 py-2 hover:bg-muted/50">
                <div className="flex items-center gap-2">
                  {model.icon}
                  <div>
                    <div className="text-sm font-medium">{model.name}</div>
                    {model.description && <div className="text-xs text-muted-foreground">{model.description}</div>}
                  </div>
                </div>
                <RadioGroupItem
                  value={model.id}
                  id={model.id}
                  className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:text-primary-foreground"
                />
              </div>
            ))}
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  )
}
