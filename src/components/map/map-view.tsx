"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { MapPin, Navigation, Crosshair, Satellite, Map as MapIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/store"

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

export function MapView() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const setSelectedView = useDashboardStore((s) => s.setSelectedView)
  const [mounted, setMounted] = useState(false)
  const [satellite, setSatellite] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-xl">
      {mounted && <LeafletMap satellite={satellite} />}

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
          onClick={() => setSatellite((s) => !s)}
          className="bg-zinc-900/80 text-xs backdrop-blur-md"
        >
          {satellite ? <MapIcon className="h-3.5 w-3.5" /> : <Satellite className="h-3.5 w-3.5" />}
          {satellite ? "Map" : "Satellite"}
        </Button>
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
