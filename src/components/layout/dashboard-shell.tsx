"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function DashboardShell({ children }: { children: ReactNode }) {
  const isSidebarOpen = useDashboardStore((s) => s.isSidebarOpen)
  const toggleSidebar = useDashboardStore((s) => s.toggleSidebar)

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar />
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={toggleSidebar}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
