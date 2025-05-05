import type React from "react"
import type { ReactNode } from "react"

export default function AIInsightsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      <div className="border-b">
        <div className="container mx-auto py-2 px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">AI Insights</h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs <DocumentIcon className="ml-1 h-4 w-4" />
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Code <CodeIcon className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}
