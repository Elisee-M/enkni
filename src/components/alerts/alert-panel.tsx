"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useDashboardStore } from "@/lib/store"
import { cn, formatDate, getSeverityBadge } from "@/lib/utils"
import {
  TriangleAlert,
  ArrowDownFromLine,
  UserRoundX,
  WifiOff,
  BatteryWarning,
  Fence,
  Activity,
  CheckCheck,
  Bell,
  BellOff,
  X,
} from "lucide-react"
import type { AlertType } from "@/types"

const alertIcons: Record<AlertType, typeof TriangleAlert> = {
  obstacle_detected: TriangleAlert,
  hole_stair_detected: ArrowDownFromLine,
  fall_detected: UserRoundX,
  device_disconnected: WifiOff,
  low_battery: BatteryWarning,
  geofence_breach: Fence,
  unusual_movement: Activity,
}

function AlertIcon({ type }: { type: AlertType }) {
  const Icon = alertIcons[type]
  return <Icon className="h-4 w-4 shrink-0" />
}

export function AlertPanel() {
  const alerts = useDashboardStore((s) => s.alerts)
  const acknowledgeAlert = useDashboardStore((s) => s.acknowledgeAlert)
  const isOpen = useDashboardStore((s) => s.isAlertPanelOpen)
  const toggleAlertPanel = useDashboardStore((s) => s.toggleAlertPanel)

  const unacknowledged = alerts.filter((a) => !a.acknowledged)
  const acknowledged = alerts.filter((a) => a.acknowledged)

  return (
    <div
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-96 flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-semibold text-zinc-100">Alerts</span>
          {unacknowledged.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
              {unacknowledged.length}
            </span>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={toggleAlertPanel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {unacknowledged.length > 0 && (
          <div className="p-3">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              New Alerts
            </span>
            <div className="mt-2 space-y-2">
              {unacknowledged.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={() => acknowledgeAlert(alert.id)}
                />
              ))}
            </div>
          </div>
        )}

        {acknowledged.length > 0 && (
          <div className="p-3 pt-0">
            <Separator className="mb-3" />
            <div className="flex items-center gap-1.5">
              <BellOff className="h-3 w-3 text-zinc-600" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                History
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {acknowledged.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  dimmed
                />
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center pt-16 text-zinc-600">
            <BellOff className="mb-2 h-8 w-8" />
            <p className="text-sm">No alerts</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

function AlertCard({
  alert,
  onAcknowledge,
  dimmed,
}: {
  alert: {
    id: string
    type: AlertType
    severity: "critical" | "warning" | "info"
    message: string
    userName: string
    timestamp: string
    acknowledged: boolean
    acknowledgedBy?: string
    location?: { address?: string }
  }
  onAcknowledge?: () => void
  dimmed?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-3 transition-colors",
        dimmed
          ? "border-zinc-800/50 bg-zinc-900/30 opacity-60"
          : alert.severity === "critical"
            ? "border-red-500/20 bg-red-500/5"
            : alert.severity === "warning"
              ? "border-amber-500/20 bg-amber-500/5"
              : "border-blue-500/20 bg-blue-500/5",
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn("mt-0.5", getSeverityBadge(alert.severity).split(" ")[0])}>
          <AlertIcon type={alert.type} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-200">
              {alert.userName}
            </span>
            <span
              className={cn(
                "rounded px-1 py-0.5 text-[9px] font-medium uppercase",
                getSeverityBadge(alert.severity),
              )}
            >
              {alert.severity}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">{alert.message}</p>
          {alert.location?.address && (
            <p className="mt-0.5 text-[10px] text-zinc-600">
              {alert.location.address}
            </p>
          )}
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] text-zinc-600">
              {formatDate(alert.timestamp)}
            </span>
            {alert.acknowledged && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                <CheckCheck className="h-3 w-3" />
                {alert.acknowledgedBy}
              </span>
            )}
          </div>
        </div>
        {onAcknowledge && (
          <Button variant="ghost" size="sm" onClick={onAcknowledge}>
            <CheckCheck className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
