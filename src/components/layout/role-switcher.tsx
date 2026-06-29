"use client"

import { useDashboardStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Eye } from "lucide-react"
import type { CaregiverRole } from "@/types"

const roles: { value: CaregiverRole; label: string; icon: typeof ShieldCheck }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "viewer", label: "Viewer", icon: Eye },
]

export function RoleSwitcher() {
  const role = useDashboardStore((s) => s.caregiverRole)
  const setRole = useDashboardStore((s) => s.setCaregiverRole)

  return (
    <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-0.5">
      {roles.map((r) => {
        const Icon = r.icon
        const isActive = role === r.value
        return (
          <Button
            key={r.value}
            variant="ghost"
            size="sm"
            onClick={() => setRole(r.value)}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              isActive
                ? "bg-zinc-700 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon className="h-3 w-3" />
            {r.label}
          </Button>
        )
      })}
    </div>
  )
}
