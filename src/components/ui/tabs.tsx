"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}) {
  const [internalTab, setInternalTab] = useState(defaultValue ?? "")
  const activeTab = value ?? internalTab
  const setActiveTab = onValueChange ?? setInternalTab
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-zinc-800/50 p-1",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  const isActive = ctx.activeTab === value
  return (
    <button
      onClick={() => ctx.setActiveTab(value)}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
        isActive
          ? "bg-zinc-700 text-zinc-100 shadow-sm"
          : "text-zinc-500 hover:text-zinc-300",
        className,
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  if (ctx.activeTab !== value) return null
  return <div className={cn(className)}>{children}</div>
}
