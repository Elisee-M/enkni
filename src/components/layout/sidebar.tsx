"use client"

import { ChevronLeft, Accessibility } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/store"

export function Sidebar() {
  const isOpen = useDashboardStore((s) => s.isSidebarOpen)
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
        isOpen ? "w-16" : "w-12",
      )}
    >
      <div className="flex h-14 items-center justify-center border-b border-zinc-800">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Accessibility className="h-5 w-5 text-blue-500" />
      </div>
    </aside>
  )
}
