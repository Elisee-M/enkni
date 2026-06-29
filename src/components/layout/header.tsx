"use client"

import { Bell, Menu, Accessibility } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RoleSwitcher } from "./role-switcher"
import { ThemeToggle } from "./theme-toggle"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function Header() {
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar)
  const toggleAlertPanel = useDashboardStore((s) => s.toggleAlertPanel)
  const unacknowledgedCount = useDashboardStore((s) => s.getUnacknowledgedAlerts().length)
  const role = useDashboardStore((s) => s.caregiverRole)

  return (
    <header className="flex h-14 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Accessibility className="h-4 w-4 text-blue-500 md:hidden" />
          <span className="text-sm font-semibold text-zinc-100">ENKONI</span>
          <span className="hidden text-xs text-zinc-600 sm:inline">| Live Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <RoleSwitcher />
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
        <div className="flex items-center gap-2 border-l border-zinc-800/50 pl-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-[10px] font-semibold text-white">
            {role === "admin" ? "AD" : "VW"}
          </div>
          <span className="hidden text-sm capitalize text-zinc-300 sm:block">{role}</span>
        </div>
      </div>
    </header>
  )
}
