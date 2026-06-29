"use client"

import { Accessibility, Map, Users, Bell, BarChart3, UserCircle, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/lib/store"
import type { DashboardState } from "@/types"

type ViewId = DashboardState["selectedView"]

const navItems: { id: ViewId; label: string; icon: typeof Map }[] = [
  { id: "map", label: "Map", icon: Map },
  { id: "users", label: "Users", icon: Users },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "metrics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: UserCircle },
]

export function Sidebar() {
  const selectedView = useDashboardStore((s) => s.selectedView)
  const setSelectedView = useDashboardStore((s) => s.setSelectedView)
  const isOpen = useDashboardStore((s) => s.isSidebarOpen)
  const role = useDashboardStore((s) => s.caregiverRole)
  const unacknowledgedCount = useDashboardStore((s) => s.getUnacknowledgedAlerts().length)

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-52 flex-col border-r border-zinc-800/50 bg-zinc-950 transition-transform duration-200 md:static md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-zinc-800/50 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Accessibility className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-zinc-100">ENKONI</span>
        </div>

        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = selectedView === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-600/10 text-blue-400"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {item.id === "alerts" && unacknowledgedCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                    {unacknowledgedCount > 9 ? "9+" : unacknowledgedCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-zinc-800/50 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[9px] font-semibold text-zinc-400">
              {role === "admin" ? "AD" : "VW"}
            </div>
            <span className="text-sm capitalize text-zinc-400">{role}</span>
          </div>
        </div>
      </aside>
    </>
  )
}
