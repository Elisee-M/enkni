"use client"

import { Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Header() {
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar)
  const toggleAlertPanel = useDashboardStore((s) => s.toggleAlertPanel)
  const unacknowledgedCount = useDashboardStore((s) => s.getUnacknowledgedAlerts().length)

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold text-zinc-100 md:hidden">ENKONI</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
          <span className="text-[10px] font-medium text-emerald-400">Live</span>
        </div>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAlertPanel}
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unacknowledgedCount > 0 && (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white",
                unacknowledgedCount > 9 && "px-0.5",
              )}
            >
              {unacknowledgedCount > 9 ? "9+" : unacknowledgedCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
