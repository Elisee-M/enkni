"use client"

import {
  Map,
  Users,
  Bell,
  BarChart3,
  UserCircle,
  ChevronLeft,
  Cane,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/store"

const navItems = [
  { id: "map" as const, label: "Live Map", icon: Map },
  { id: "users" as const, label: "Users", icon: Users },
  { id: "alerts" as const, label: "Alerts", icon: Bell },
  { id: "metrics" as const, label: "Analytics", icon: BarChart3 },
  { id: "profile" as const, label: "Profile", icon: UserCircle },
]

export function Sidebar() {
  const isOpen = useDashboardStore((s) => s.isSidebarOpen)
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar)
  const selectedView = useDashboardStore((s) => s.selectedView)
  const setSelectedView = useDashboardStore((s) => s.setSelectedView)
  const unacknowledgedCount = useDashboardStore((s) => s.getUnacknowledgedAlerts().length)

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300",
        isOpen ? "w-58" : "w-16",
      )}
    >
      <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <Cane className="h-4 w-4 text-white" />
        </div>
        {isOpen && (
          <span className="text-sm font-bold text-zinc-100">ENKONI</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="ml-auto h-6 w-6"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform",
              !isOpen && "rotate-180",
            )}
          />
        </Button>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            size={isOpen ? "md" : "icon"}
            onClick={() => setSelectedView(item.id)}
            className={cn(
              "justify-start gap-3 rounded-lg transition-colors",
              selectedView === item.id
                ? "bg-zinc-800 text-zinc-100"
                : "text-zinc-500 hover:text-zinc-300",
              !isOpen && "justify-center px-0",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {isOpen && (
              <span className="text-sm">{item.label}</span>
            )}
            {isOpen && item.id === "alerts" && unacknowledgedCount > 0 && (
              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-medium text-white">
                {unacknowledgedCount}
              </span>
            )}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
