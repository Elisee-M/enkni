"use client"

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { MapPin, Navigation, Crosshair } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/store"
import { formatDate, formatDistance } from "@/lib/utils"
import type { LocationHistoryPoint } from "@/types"

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false },
)
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false },
)
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false },
)
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false },
)
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false },
)
const Circle = dynamic(
  () => import("react-leaflet").then((m) => m.Circle),
  { ssr: false },
)

function useMapIcon() {
  return useMemo(() => {
    if (typeof window === "undefined") return null
    const L = require("leaflet")
    return new L.DivIcon({
      className: "custom-marker",
      html: `<div style="background:#2563eb;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }, [])
}

function useLocationIcon(color: string) {
  return useMemo(() => {
    if (typeof window === "undefined") return null
    const L = require("leaflet")
    return new L.DivIcon({
      className: "custom-marker-location",
      html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="6"/></svg></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    })
  }, [color])
}

function isBrowser() {
  return typeof window !== "undefined"
}

function MapContent() {
  const userIcon = useMapIcon()
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const users = useDashboardStore((s) => s.users)
  const setSelectedUser = useDashboardStore((s) => s.setSelectedUser)
  const timeRange = useDashboardStore((s) => s.timeRange)

  if (!isBrowser() || !userIcon) return null

  const center = selectedUser
    ? [selectedUser.currentLocation.coordinates.lat, selectedUser.currentLocation.coordinates.lng]
    : [-1.2864, 36.8172]

  const getFilteredHistory = (history: LocationHistoryPoint[]) => {
    const now = Date.now()
    const cutoff = now - timeRange * 24 * 60 * 60 * 1000
    return history.filter((p) => new Date(p.timestamp).getTime() >= cutoff)
  }

  const userColors = ["#2563eb", "#059669", "#7c3aed"]

  return (
    <MapContainer
      center={center as [number, number]}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />

      {users.map((u, idx) => {
        const loc = u.currentLocation.coordinates
        const color = userColors[idx % userColors.length]
        const historyPoints = getFilteredHistory(u.locationHistory).map(
          (p) => [p.coordinates.lat, p.coordinates.lng] as [number, number],
        )

        return (
          <div key={u.id}>
            <Marker
              position={[loc.lat, loc.lng]}
              icon={userIcon}
              eventHandlers={{
                click: () => setSelectedUser(u.id),
              }}
            >
              <Popup>
                <div className="font-sans text-xs leading-relaxed">
                  <strong style={{ fontSize: "13px" }}>{u.profile.name}</strong>
                  <br />
                  {u.currentLocation.address}
                  <br />
                  <span style={{ color: "#6b7280" }}>
                    Updated {formatDate(u.lastUpdated)}
                  </span>
                </div>
              </Popup>
            </Marker>

            {historyPoints.length > 1 && (
              <Polyline
                positions={historyPoints}
                pathOptions={{ color, weight: 2, opacity: 0.5 }}
              />
            )}

            {u.id === selectedUser?.id &&
              u.geofenceZones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={[zone.center.lat, zone.center.lng]}
                  radius={zone.radius}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.08,
                    weight: 1,
                    dashArray: "5 5",
                  }}
                />
              ))}
          </div>
        )
      })}
    </MapContainer>
  )
}

export function MapView() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const toggleAlertPanel = useDashboardStore((s) => s.toggleAlertPanel)
  const setSelectedView = useDashboardStore((s) => s.setSelectedView)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-xl">
      {mounted && <MapContent />}

      <div className="absolute left-3 top-3 z-[1000] flex flex-col gap-2">
        <Card className="border-zinc-700/50 bg-zinc-900/80 p-3 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
            {selectedUser ? (
              <span className="font-medium text-zinc-200">
                {selectedUser.currentLocation.address}
              </span>
            ) : (
              <span>Select a user to view location</span>
            )}
          </div>
          {selectedUser && (
            <div className="mt-1.5 flex items-center gap-3 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Crosshair className="h-3 w-3" />
                {selectedUser.currentLocation.coordinates.lat.toFixed(4)},{" "}
                {selectedUser.currentLocation.coordinates.lng.toFixed(4)}
              </span>
              <span className="flex items-center gap-1">
                <Navigation className="h-3 w-3" />
                {selectedUser.currentLocation.speed?.toFixed(1) ?? "0"} m/s
              </span>
            </div>
          )}
        </Card>
      </div>

      <div className="absolute bottom-3 right-3 z-[1000] flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedView("metrics")}
          className="bg-zinc-900/80 text-xs backdrop-blur-md"
        >
          View Analytics
        </Button>
      </div>
    </div>
  )
}
