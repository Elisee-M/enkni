"use client"

import { useEffect } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { MapView } from "@/components/map/map-view"
import { UserList } from "@/components/users/user-list"
import { DeviceStatus } from "@/components/device/device-status"
import { AlertPanel } from "@/components/alerts/alert-panel"
import { SafetyMetrics } from "@/components/metrics/safety-metrics"
import { TripTimeline } from "@/components/metrics/trip-timeline"
import { ActivityHeatmap } from "@/components/metrics/activity-heatmap"
import { ReportExport } from "@/components/metrics/report-export"
import { UserProfileView } from "@/components/profiles/user-profile"
import { NotificationPreferences } from "@/components/profiles/notification-preferences"
import { GeofenceEditor } from "@/components/map/geofence-editor"
import { useDashboardStore, useSimulatedUpdates } from "@/lib/store"
import { useSpeechSynthesis } from "@/lib/use-speech-synthesis"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, Users, Bell, BarChart3, UserCircle, RefreshCw } from "lucide-react"

const viewTabs = [
  { id: "map" as const, label: "Live Map", icon: Map },
  { id: "users" as const, label: "Users", icon: Users },
  { id: "alerts" as const, label: "Alerts", icon: Bell },
  { id: "metrics" as const, label: "Analytics", icon: BarChart3 },
  { id: "profile" as const, label: "Profile", icon: UserCircle },
]

function ViewContent() {
  const selectedView = useDashboardStore((s) => s.selectedView)

  switch (selectedView) {
    case "map":
    case "users":
      return (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-h-[400px] flex-1">
            <MapView />
          </div>
          <div className="flex w-full flex-col gap-4 lg:w-80">
            <UserList />
            <DeviceStatus />
          </div>
        </div>
      )
    case "alerts":
      return (
        <div className="flex flex-col gap-4">
          <AlertFeed />
        </div>
      )
    case "metrics":
      return (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-w-0 flex-[3]">
            <SafetyMetrics />
          </div>
          <div className="flex w-full flex-col gap-4 lg:w-80">
            <TripTimeline />
            <ActivityHeatmap />
          </div>
        </div>
      )
    case "profile":
      return (
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="min-w-0 flex-[2]">
            <UserProfileView />
          </div>
          <div className="flex w-full flex-col gap-4 lg:w-80">
            <NotificationPreferences />
            <GeofenceEditor />
          </div>
        </div>
      )
    default:
      return null
  }
}

function AlertFeed() {
  const alerts = useDashboardStore((s) => s.alerts)
  const acknowledgeAlert = useDashboardStore((s) => s.acknowledgeAlert)

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
        <Bell className="mb-3 h-12 w-12" />
        <p className="text-lg font-medium">No alerts</p>
        <p className="text-sm">All quiet on the ENKONI network</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg border p-4 transition-colors ${
            alert.severity === "critical"
              ? "border-red-500/20 bg-red-500/5"
              : alert.severity === "warning"
                ? "border-amber-500/20 bg-amber-500/5"
                : "border-blue-500/20 bg-blue-500/5"
          } ${alert.acknowledged ? "opacity-50" : ""}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-200">
                  {alert.userName}
                </span>
                <Badge
                  variant={
                    alert.severity === "critical"
                      ? "danger"
                      : alert.severity === "warning"
                        ? "warning"
                        : "info"
                  }
                >
                  {alert.severity}
                </Badge>
                <span className="text-[10px] text-zinc-600">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-400">{alert.message}</p>
              {alert.location?.address && (
                <p className="mt-0.5 text-xs text-zinc-600">
                  {alert.location.address}
                </p>
              )}
            </div>
            {!alert.acknowledged && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => acknowledgeAlert(alert.id)}
              >
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const selectedView = useDashboardStore((s) => s.selectedView)
  const setSelectedView = useDashboardStore((s) => s.setSelectedView)
  const toggleAlertPanel = useDashboardStore((s) => s.toggleAlertPanel)
  const { simulateLocationUpdate, simulateBatteryDrain } = useSimulatedUpdates()

  useSpeechSynthesis()

  useEffect(() => {
    const interval = setInterval(() => {
      const ids = useDashboardStore.getState().users.map((u) => u.id)
      ids.forEach((id) => {
        simulateLocationUpdate(id)
        simulateBatteryDrain(id)
      })
    }, 8000)
    return () => clearInterval(interval)
  }, [simulateLocationUpdate, simulateBatteryDrain])

  return (
    <DashboardShell>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">ENKONI Dashboard</h1>
          <p className="text-xs text-zinc-500">
            Smart IoT Walking Cane Monitoring System
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <RefreshCw className="h-3 w-3 animate-spin text-emerald-500" />
            <span className="text-[10px] text-zinc-600">Live</span>
          </div>
          <ReportExport />

          <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-1">
            {viewTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedView(tab.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    selectedView === tab.id
                      ? "bg-zinc-700 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleAlertPanel}
            className="lg:hidden"
          >
            <Bell className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ViewContent />
      <AlertPanel />
    </DashboardShell>
  )
}
