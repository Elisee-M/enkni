"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Bell,
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Siren,
} from "lucide-react"
import type { AlertRule } from "@/types"

const methodIcons = {
  sms: MessageSquare,
  email: Mail,
  call: Phone,
  in_app: Bell,
}

export function AlertRulesEngine() {
  const rules = useDashboardStore((s) => s.alertRules)
  const removeAlertRule = useDashboardStore((s) => s.removeAlertRule)
  const toggleAlertRule = useDashboardStore((s) => s.toggleAlertRule)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Siren className="h-4 w-4 text-zinc-500" />
          <CardTitle>Alert Rules Engine</CardTitle>
        </div>
        <p className="text-[10px] text-zinc-600">
          If condition matches → trigger action
        </p>
      </CardHeader>
      <CardContent>
        {rules.length === 0 && (
          <p className="py-4 text-center text-xs text-zinc-600">
            No alert rules configured
          </p>
        )}
        <ScrollArea className="max-h-[360px]">
          <div className="space-y-2">
            {rules.map((rule) => {
              const Icon = methodIcons[rule.action.method]
              return (
                <div
                  key={rule.id}
                  className={cn(
                    "rounded-lg border p-3 transition-colors",
                    rule.enabled
                      ? "border-zinc-700 bg-zinc-800/30"
                      : "border-zinc-800/50 bg-zinc-900/30 opacity-50",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-200">
                          {rule.name}
                        </span>
                        <Badge
                          variant={rule.enabled ? "success" : "default"}
                        >
                          {rule.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-500">
                        <span>
                          IF{" "}
                          <span className="font-medium text-zinc-400">
                            {rule.condition.type === "any"
                              ? "any alert"
                              : rule.condition.type.replace(/_/g, " ")}
                          </span>
                          {rule.condition.severity !== "any" && (
                            <>
                              {" "}
                              severity{" "}
                              <span className="font-medium text-zinc-400">
                                {rule.condition.severity}
                              </span>
                            </>
                          )}
                          {rule.condition.batteryBelow && (
                            <>
                              {" "}
                              battery &lt;{" "}
                              <span className="font-medium text-zinc-400">
                                {rule.condition.batteryBelow}%
                              </span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <span>THEN →</span>
                        <Icon className="h-3 w-3 text-zinc-400" />
                        <span className="font-medium text-zinc-400">
                          {rule.action.method.toUpperCase()}
                        </span>
                        <span>→ {rule.action.notify}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleAlertRule(rule.id)}
                        className="rounded p-1 text-zinc-500 hover:text-zinc-300"
                      >
                        {rule.enabled ? (
                          <ToggleRight className="h-4 w-4 text-blue-400" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => removeAlertRule(rule.id)}
                        className="rounded p-1 text-zinc-600 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
