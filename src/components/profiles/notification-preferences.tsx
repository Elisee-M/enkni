"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Bell,
  MessageSquare,
  Mail,
  Phone,
  Smartphone,
  Check,
  X,
} from "lucide-react"

const methods = [
  { value: "in_app" as const, label: "In-App", icon: Bell },
  { value: "sms" as const, label: "SMS", icon: MessageSquare },
  { value: "email" as const, label: "Email", icon: Mail },
  { value: "call" as const, label: "Phone Call", icon: Phone },
]

const severityLevels = [
  { value: "critical" as const, label: "Critical", color: "text-red-400" },
  { value: "warning" as const, label: "Warning", color: "text-amber-400" },
  { value: "info" as const, label: "Info", color: "text-blue-400" },
]

export function NotificationPreferences() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to configure notifications</p>
        </CardContent>
      </Card>
    )
  }

  const [enabledMethods, setEnabledMethods] = useState<string[]>(
    selectedUser.profile.preferredAlertMethods,
  )
  const [enabledSeverities, setEnabledSeverities] = useState<string[]>([
    "critical",
    "warning",
    "info",
  ])

  const toggleMethod = (method: string) => {
    setEnabledMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method],
    )
  }

  const toggleSeverity = (severity: string) => {
    setEnabledSeverities((prev) =>
      prev.includes(severity)
        ? prev.filter((s) => s !== severity)
        : [...prev, severity],
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-zinc-500" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <p className="text-[10px] text-zinc-600">
          Configure how alerts are delivered for {selectedUser.profile.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Delivery Methods
          </span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {methods.map((method) => {
              const Icon = method.icon
              const isOn = enabledMethods.includes(method.value)
              return (
                <button
                  key={method.value}
                  onClick={() => toggleMethod(method.value)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
                    isOn
                      ? "border-blue-500/30 bg-blue-500/10 text-zinc-200"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{method.label}</span>
                  {isOn ? (
                    <Check className="ml-auto h-3 w-3 text-blue-400" />
                  ) : (
                    <X className="ml-auto h-3 w-3 text-zinc-600" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Alert Severity Threshold
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {severityLevels.map((sev) => {
              const isOn = enabledSeverities.includes(sev.value)
              return (
                <button
                  key={sev.value}
                  onClick={() => toggleSeverity(sev.value)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    isOn
                      ? "border-zinc-700 bg-zinc-800 text-zinc-200"
                      : "border-zinc-800 bg-transparent text-zinc-600",
                  )}
                >
                  {sev.label}
                </button>
              )
            })}
          </div>
          <p className="mt-1.5 text-[10px] text-zinc-600">
            {enabledSeverities.length === 0
              ? "No alerts will be delivered"
              : `${enabledSeverities.join(", ")} alerts will be sent via ${enabledMethods.join(", ") || "no delivery methods"}`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
