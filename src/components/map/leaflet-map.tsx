"use client"

import { useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet"
import L from "leaflet"
import { useDashboardStore } from "@/lib/store"
import { formatDate } from "@/lib/utils"
import type { LocationHistoryPoint } from "@/types"

const TILE_STYLES = {
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
}

function useMapIcon() {
  return useMemo(() => {
    if (typeof window === "undefined") return null
    return new L.DivIcon({
      className: "custom-marker",
      html: `<div style="background:#2563eb;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }, [])
}

export default function LeafletMap({ satellite }: { satellite: boolean }) {
  const userIcon = useMapIcon()
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const users = useDashboardStore((s) => s.users)
  const setSelectedUser = useDashboardStore((s) => s.setSelectedUser)
  const timeRange = useDashboardStore((s) => s.timeRange)

  if (!userIcon) return null

  const tileStyle = satellite ? TILE_STYLES.satellite : TILE_STYLES.dark

  const center = selectedUser
    ? ([selectedUser.currentLocation.coordinates.lat, selectedUser.currentLocation.coordinates.lng] as [number, number])
    : ([-1.9441, 30.0619] as [number, number])

  const getFilteredHistory = (history: LocationHistoryPoint[]) => {
    const now = Date.now()
    const cutoff = now - timeRange * 24 * 60 * 60 * 1000
    return history.filter((p) => new Date(p.timestamp).getTime() >= cutoff)
  }

  const userColors = ["#2563eb", "#059669", "#7c3aed"]

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
      zoomControl={true}
    >
      <TileLayer
        key={satellite ? "satellite" : "dark"}
        url={tileStyle.url}
        attribution={tileStyle.attribution}
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
