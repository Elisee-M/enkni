"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Plus,
  Trash2,
  Home,
  Briefcase,
  Building,
  Hospital,
  School,
  MapPin,
} from "lucide-react"
import type { GeofenceZone, GeofenceZoneType } from "@/types"

const zoneTypes: { value: GeofenceZoneType; label: string; icon: typeof Home }[] = [
  { value: "home", label: "Home", icon: Home },
  { value: "work", label: "Work", icon: Briefcase },
  { value: "hospital", label: "Hospital", icon: Hospital },
  { value: "school", label: "School", icon: School },
  { value: "custom", label: "Custom", icon: Building },
]

const zoneColors = ["#22c55e", "#3b82f6", "#ef4444", "#a855f7", "#f59e0b"]

export function GeofenceEditor() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const addGeofenceZone = useDashboardStore((s) => s.addGeofenceZone)
  const removeGeofenceZone = useDashboardStore((s) => s.removeGeofenceZone)
  const [editing, setEditing] = useState(false)

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to edit safe zones</p>
        </CardContent>
      </Card>
    )
  }

  const handleAdd = (type: GeofenceZoneType) => {
    const typeDef = zoneTypes.find((t) => t.value === type)
    const color = zoneColors[selectedUser.geofenceZones.length % zoneColors.length]
    const newZone: GeofenceZone = {
      id: `zone-${Date.now()}`,
      name: typeDef?.label ?? type,
      type,
      center: {
        lat: selectedUser.currentLocation.coordinates.lat + (Math.random() - 0.5) * 0.002,
        lng: selectedUser.currentLocation.coordinates.lng + (Math.random() - 0.5) * 0.002,
      },
      radius: 150,
      color,
      enabled: true,
    }
    addGeofenceZone(selectedUser.id, newZone)
    setEditing(false)
  }

  const handleRemove = (zoneId: string) => {
    removeGeofenceZone(selectedUser.id, zoneId)
  }

  const toggleZone = (zoneId: string) => {
    const zones = selectedUser.geofenceZones.map((z) =>
      z.id === zoneId ? { ...z, enabled: !z.enabled } : z,
    )
    useDashboardStore.getState().updateGeofenceZones(selectedUser.id, zones)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-zinc-500" />
            <CardTitle>Safe Zone Editor</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-3 grid grid-cols-5 gap-1.5">
            {zoneTypes.map((zt) => {
              const Icon = zt.icon
              return (
                <button
                  key={zt.value}
                  onClick={() => handleAdd(zt.value)}
                  className="flex flex-col items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-2 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                >
                  <Icon className="h-4 w-4" />
                  {zt.label}
                </button>
              )
            })}
          </div>
        )}

        {selectedUser.geofenceZones.length === 0 && !editing && (
          <p className="py-4 text-center text-xs text-zinc-600">
            No safe zones configured. Click + to add one.
          </p>
        )}

        <ScrollArea className="max-h-[280px]">
          <div className="space-y-1.5">
            {selectedUser.geofenceZones.map((zone) => {
              const TypeIcon =
                zoneTypes.find((t) => t.value === zone.type)?.icon ?? MapPin
              return (
                <div
                  key={zone.id}
                  className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: zone.color }}
                    />
                    <TypeIcon className="h-3 w-3 text-zinc-500" />
                    <div>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          zone.enabled ? "text-zinc-200" : "text-zinc-600",
                        )}
                      >
                        {zone.name}
                      </span>
                      <span className="ml-1.5 text-[10px] text-zinc-600">
                        {zone.radius}m
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleZone(zone.id)}
                      className="rounded px-1.5 py-0.5 text-[10px] text-zinc-500 hover:text-zinc-300"
                    >
                      {zone.enabled ? "ON" : "OFF"}
                    </button>
                    <button
                      onClick={() => handleRemove(zone.id)}
                      className="rounded p-1 text-zinc-600 hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
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
