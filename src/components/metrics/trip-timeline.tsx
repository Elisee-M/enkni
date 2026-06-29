"use client"

import { useDashboardStore } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate, formatDistance } from "@/lib/utils"
import {
  Footprints,
  MapPin,
  Clock,
  Navigation,
  AlertTriangle,
  Home,
} from "lucide-react"
import type { LocationHistoryPoint } from "@/types"

export function TripTimeline() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const timeRange = useDashboardStore((s) => s.timeRange)
  const setSelectedView = useDashboardStore((s) => s.setSelectedView)

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to view trip history</p>
        </CardContent>
      </Card>
    )
  }

  const history = selectedUser.locationHistory
  const cutoff = Date.now() - timeRange * 24 * 60 * 60 * 1000
  const filtered = history.filter(
    (p) => new Date(p.timestamp).getTime() >= cutoff,
  )

  const segments: {
    startIdx: number
    startTime: string
    endTime: string
    distance: number
    points: LocationHistoryPoint[]
    isMoving: boolean
  }[] = []

  let segStart = 0
  for (let i = 1; i < filtered.length; i++) {
    const isMoving = (filtered[i].speed ?? 0) > 0.3
    const wasMoving = (filtered[i - 1].speed ?? 0) > 0.3
    if (isMoving !== wasMoving || i === filtered.length - 1) {
      const seg = filtered.slice(segStart, i + 1)
      if (seg.length > 0) {
        const dist = seg.reduce((acc, p, idx) => {
          if (idx === 0) return acc
          const dlat = p.coordinates.lat - seg[idx - 1].coordinates.lat
          const dlng = p.coordinates.lng - seg[idx - 1].coordinates.lng
          return acc + Math.sqrt(dlat * dlat + dlng * dlng) * 111320
        }, 0)
        segments.push({
          startIdx: segStart,
          startTime: seg[0].timestamp,
          endTime: seg[seg.length - 1].timestamp,
          distance: dist,
          points: seg,
          isMoving: wasMoving,
        })
      }
      segStart = i
    }
  }

  const totalDist = filtered.reduce((acc, p, idx) => {
    if (idx === 0) return acc
    const dlat = p.coordinates.lat - filtered[idx - 1].coordinates.lat
    const dlng = p.coordinates.lng - filtered[idx - 1].coordinates.lng
    return acc + Math.sqrt(dlat * dlat + dlng * dlng) * 111320
  }, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trip History</CardTitle>
          <Badge variant="info">
            {formatDistance(totalDist)} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px] pr-2">
          <div className="relative space-y-0">
            {segments.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-500">
                No trip data for this period
              </p>
            )}
            {segments.map((seg, idx) => (
              <div key={idx} className="relative flex gap-3 pb-4 pl-6 last:pb-0">
                <div className="absolute left-[7px] top-2 h-full w-px bg-zinc-800 last:hidden" />
                <div
                  className={cn(
                    "absolute left-0 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-zinc-900",
                    seg.isMoving
                      ? "bg-blue-500"
                      : "bg-zinc-600",
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-200">
                      {formatDate(seg.startTime)}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      ({formatDate(seg.endTime)})
                    </span>
                    {seg.isMoving ? (
                      <Navigation className="h-3 w-3 text-blue-400" />
                    ) : (
                      <Home className="h-3 w-3 text-zinc-500" />
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Footprints className="h-3 w-3" />
                      {formatDistance(seg.distance)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {seg.isMoving ? "Moving" : "Stationary"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {seg.points.length} points
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
