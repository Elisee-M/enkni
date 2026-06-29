"use client"

import { useEffect } from "react"
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { MapView } from "@/components/map/map-view"
import { UserList } from "@/components/users/user-list"
import { DeviceStatus } from "@/components/device/device-status"
import { BatteryChart } from "@/components/device/battery-chart"
import { AlertPanel } from "@/components/alerts/alert-panel"
import { AlertRulesEngine } from "@/components/alerts/alert-rules"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Map, Users, Bell, BarChart3, UserCircle } from "lucide-react"

const viewTabs = [
  { id: "map", label: "Map", icon: Map },
  { id: "users", label: "Users", icon: Users },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "metrics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: UserCircle },
]

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
      <div className="flex items-center justify-between">
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)}>
          <TabsList>
            {viewTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.id} value={tab.id}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
            <span className="text-[10px] font-medium text-emerald-400">Live</span>
          </div>
          <ReportExport />
        </div>
      </div>

      <div className="mt-4 flex-1">
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)}>
          <TabsContent value="map">
            <div className="flex h-full flex-col gap-4 lg:flex-row">
              <div className="flex-1">
                <MapView />
              </div>
              <div className="flex w-full flex-col gap-4 lg:w-72">
                <UserList />
                <DeviceStatus />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="mx-auto max-w-4xl">
              <UserList />
              <div className="mt-4">
                <DeviceStatus />
              </div>
              <div className="mt-4">
                <BatteryChart />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="mx-auto max-w-5xl space-y-4">
              <AlertFeed />
              <AlertRulesEngine />
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <div className="space-y-4">
              <SafetyMetrics />
              <div className="grid gap-4 lg:grid-cols-2">
                <TripTimeline />
                <ActivityHeatmap />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-4">
              <UserProfileView />
              <div className="grid gap-4 lg:grid-cols-2">
                <NotificationPreferences />
                <GeofenceEditor />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <AlertPanel />
    </DashboardShell>
  )
}
