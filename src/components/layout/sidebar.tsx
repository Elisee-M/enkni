"use client"

import { Cane } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/lib/store"

export function Sidebar() {
  const isOpen = useDashboardStore((s) => s.isSidebarOpen)

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-14 flex-col border-r border-zinc-800/50 bg-zinc-950 transition-transform duration-200 md:static md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
      )}
    >
      <div className="flex h-14 items-center justify-center border-b border-zinc-800/50">
        <Cane className="h-5 w-5 text-blue-500" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <span className="text-[8px] font-medium tracking-widest text-zinc-700 [writing-mode:vertical-lr]">
          ENKONI
        </span>
      </div>
    </aside>
  )
}
