"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboardStore } from "@/lib/store"
import { cn, formatDate, formatDistance, formatDuration } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import {
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  Wifi,
  WifiOff,
  Footprints,
  AlertTriangle,
} from "lucide-react"

function BatteryIcon({ level }: { level: number }) {
  if (level > 70) return <BatteryFull className="h-3.5 w-3.5 text-green-400" />
  if (level > 40) return <BatteryMedium className="h-3.5 w-3.5 text-amber-400" />
  if (level > 20) return <BatteryLow className="h-3.5 w-3.5 text-orange-400" />
  return <BatteryWarning className="h-3.5 w-3.5 text-red-400" />
}

function StatusDot({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        status === "online" && "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
        status === "offline" && "bg-red-500",
        status === "reconnecting" && "bg-amber-500",
      )}
    />
  )
}

export function UserList() {
  const users = useDashboardStore((s) => s.users)
  const alerts = useDashboardStore((s) => s.alerts)
  const selectedUserId = useDashboardStore((s) => s.selectedUserId)
  const setSelectedUser = useDashboardStore((s) => s.setSelectedUser)

  return (
    <Card>
      <div className="flex items-center justify-between p-3 pb-0">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Monitored Users
        </span>
        <Badge variant="info">{users.length} active</Badge>
      </div>
      <ScrollArea className="mt-2 max-h-[320px]">
        <div className="flex flex-col gap-1 p-2 pt-0">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-zinc-800/50",
                selectedUserId === user.id && "bg-zinc-800 ring-1 ring-blue-500/30",
              )}
            >
              <Avatar name={user.profile.name} size="sm" />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-zinc-200">
                    {user.profile.name}
                  </span>
                  {alerts.some(
                    (a) => a.userId === user.id && !a.acknowledged,
                  ) && <AlertTriangle className="h-3 w-3 shrink-0 text-red-400" />}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Footprints className="h-3 w-3" />
                    {formatDistance(user.metrics.totalDistanceToday * 1000)}
                  </span>
                  <span>{formatDuration(user.metrics.tripDuration)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <BatteryIcon level={user.device.batteryLevel} />
                  <span className="text-[10px] tabular-nums text-zinc-400">
                    {Math.round(user.device.batteryLevel)}%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {user.device.connectionStatus === "online" ? (
                    <Wifi className="h-3 w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-500" />
                  )}
                  <span className="text-[10px] text-zinc-500">
                    {formatDate(user.lastUpdated)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-zinc-800 p-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-[10px] text-zinc-600">Connection Status</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
              <StatusDot status="online" /> Online
            </span>
            <span className="flex items-center gap-1 text-[10px] text-zinc-500">
              <StatusDot status="offline" /> Offline
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
