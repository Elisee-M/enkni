import type { AlertSeverity, AlertType, ConnectionStatus } from "@/types"

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

export function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20"
    case "warning":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    case "info":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20"
  }
}

export function getSeverityBadge(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "warning":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "info":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  }
}

export function getConnectionColor(status: ConnectionStatus): string {
  switch (status) {
    case "online":
      return "text-green-500"
    case "offline":
      return "text-red-500"
    case "reconnecting":
      return "text-amber-500"
  }
}

export function getAlertIcon(type: AlertType): string {
  switch (type) {
    case "obstacle_detected":
      return "TriangleAlert"
    case "hole_stair_detected":
      return "ArrowDownFromLine"
    case "fall_detected":
      return "UserRoundX"
    case "device_disconnected":
      return "WifiOff"
    case "low_battery":
      return "BatteryWarning"
    case "geofence_breach":
      return "Fence"
    case "unusual_movement":
      return "Activity"
  }
}

export function getSensorIcon(type: string): string {
  switch (type) {
    case "obstacle":
      return "Eye"
    case "gps":
      return "MapPin"
    case "motion":
      return "Zap"
    case "gyroscope":
      return "Rotate3D"
    case "ultrasonic":
      return "Waves"
    default:
      return "Circle"
  }
}
