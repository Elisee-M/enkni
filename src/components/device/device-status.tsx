"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDashboardStore } from "@/lib/store"
import { cn, formatDate } from "@/lib/utils"
import {
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  Signal,
  SignalHigh,
  SignalLow,
  Wifi,
  WifiOff,
  Smartphone,
  Clock,
  Eye,
  MapPin,
  Zap,
  Rotate3D,
  Waves,
  Circle,
} from "lucide-react"
import type { SensorType, ConnectionStatus } from "@/types"

function BatteryDisplay({ level }: { level: number }) {
  const pct = Math.round(level)
  let Icon = BatteryFull
  let color = "text-green-400"
  if (pct <= 70) { Icon = BatteryMedium; color = "text-amber-400" }
  if (pct <= 40) { Icon = BatteryLow; color = "text-orange-400" }
  if (pct <= 20) { Icon = BatteryWarning; color = "text-red-400" }
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4", color)} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-100">{pct}%</span>
        <span className="text-[10px] text-zinc-500">
          {pct <= 20 ? "Charge soon" : "Good"}
        </span>
      </div>
    </div>
  )
}

function SignalDisplay({ strength }: { strength: number }) {
  let Icon = SignalHigh
  let color = "text-green-400"
  let label = "Strong"
  if (strength <= 70) { Icon = Signal; color = "text-amber-400"; label = "Fair" }
  if (strength <= 40) { Icon = SignalLow; color = "text-orange-400"; label = "Weak" }
  if (strength <= 20) { Icon = SignalLow; color = "text-red-400"; label = "Poor" }
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("h-4 w-4", color)} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-zinc-100">{strength}%</span>
        <span className="text-[10px] text-zinc-500">{label}</span>
      </div>
    </div>
  )
}

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      {status === "online" ? (
        <Wifi className="h-3.5 w-3.5 text-green-400" />
      ) : (
        <WifiOff className="h-3.5 w-3.5 text-red-400" />
      )}
      <Badge
        variant={
          status === "online" ? "success" : status === "reconnecting" ? "warning" : "danger"
        }
      >
        {status}
      </Badge>
    </div>
  )
}

function getSensorIcon(type: SensorType) {
  const props = "h-3.5 w-3.5"
  switch (type) {
    case "obstacle": return <Eye className={props} />
    case "gps": return <MapPin className={props} />
    case "motion": return <Zap className={props} />
    case "gyroscope": return <Rotate3D className={props} />
    case "ultrasonic": return <Waves className={props} />
    default: return <Circle className={props} />
  }
}

export function DeviceStatus() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to view device status</p>
        </CardContent>
      </Card>
    )
  }

  const { device } = selectedUser

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Device Status</CardTitle>
          <ConnectionBadge status={device.connectionStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <BatteryDisplay level={device.batteryLevel} />
          <SignalDisplay strength={device.signalStrength} />
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Smartphone className="h-3 w-3" />
              Firmware
            </span>
            <span className="text-zinc-300">{device.firmwareVersion}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-500">
              <Clock className="h-3 w-3" />
              Last Connected
            </span>
            <span className="text-zinc-300">{formatDate(device.lastConnectionTime)}</span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
            Sensors
          </span>
          <div className="mt-2 space-y-1">
            {device.sensors.map((sensor) => (
              <div
                key={sensor.id}
                className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-2.5 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      sensor.status === "active" && "text-green-400",
                      sensor.status === "inactive" && "text-zinc-600",
                      sensor.status === "error" && "text-red-400",
                    )}
                  >
                    {getSensorIcon(sensor.type)}
                  </span>
                  <span className="text-xs text-zinc-400">{sensor.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500">
                    {sensor.value}
                  </span>
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      sensor.status === "active" && "bg-green-500",
                      sensor.status === "inactive" && "bg-zinc-600",
                      sensor.status === "error" && "bg-red-500",
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
