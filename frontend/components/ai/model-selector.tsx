"use client"

import { useEffect, useRef } from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Model {
  id: string
  name: string
  provider: string
  description: string
  tags?: string[]
}

interface ModelSelectorProps {
  models: Model[]
  selectedModel: string
  onModelSelect: (modelId: string) => void
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function ModelSelector({ models, selectedModel, onModelSelect, isOpen, setIsOpen }: ModelSelectorProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedModelData = models.find((model) => model.id === selectedModel)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{selectedModelData?.name}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen ? "rotate-180" : "")} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="max-h-[300px] overflow-auto p-1">
            {models.map((model) => (
              <div
                key={model.id}
                onClick={() => {
                  onModelSelect(model.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "flex flex-col gap-1 rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-muted",
                  selectedModel === model.id ? "bg-muted" : "",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{model.name}</div>
                  {selectedModel === model.id && <Check className="h-4 w-4 text-purple-500" />}
                </div>
                <div className="text-xs text-muted-foreground">{model.provider}</div>
                <div className="text-xs text-muted-foreground">{model.description}</div>
                {model.tags && model.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {model.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          tag === "Recommended"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : tag === "Fast"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              : tag === "Multimodal"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                : tag === "Balanced"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                  : tag === "Coding"
                                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
