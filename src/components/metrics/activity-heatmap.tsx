"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useDashboardStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export function ActivityHeatmap() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())

  const weeks = useMemo(() => {
    if (!selectedUser) return []

    const data: { day: number; value: number; label: string }[] = []
    const now = new Date()

    for (let i = 34; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const historyForDay = selectedUser.locationHistory.filter((p) => {
        const pDate = new Date(p.timestamp)
        return pDate.toDateString() === d.toDateString()
      })
      const totalSpeed = historyForDay.reduce((acc, p) => acc + (p.speed ?? 0), 0)
      const value = Math.min(100, Math.round((totalSpeed / historyForDay.length) * 20) || 0)
      data.push({
        day: d.getDay(),
        value,
        label: `${d.toLocaleDateString("en", { weekday: "short" })}\n${d.getDate()}`,
      })
    }

    const weeksArr: typeof data[] = []
    for (let i = 0; i < data.length; i += 7) {
      weeksArr.push(data.slice(i, i + 7))
    }
    return weeksArr
  }, [selectedUser])

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to view activity</p>
        </CardContent>
      </Card>
    )
  }

  const getColor = (value: number) => {
    if (value === 0) return "bg-zinc-800"
    if (value < 20) return "bg-blue-900/50"
    if (value < 40) return "bg-blue-800"
    if (value < 60) return "bg-blue-600"
    if (value < 80) return "bg-blue-500"
    return "bg-blue-400"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap (35 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn(
                    "h-3 w-3 rounded-sm transition-colors",
                    getColor(day.value),
                  )}
                  title={day.label.replace("\n", " ") + ` — ${day.value}%`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-600">
          <span>Less</span>
          <div className="h-2.5 w-2.5 rounded-sm bg-zinc-800" />
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-900/50" />
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-800" />
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-500" />
          <div className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  )
}
