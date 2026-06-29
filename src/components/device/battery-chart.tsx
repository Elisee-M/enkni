"use client"

import { useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useDashboardStore } from "@/lib/store"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

export function BatteryChart() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())

  const data = useMemo(() => {
    if (!selectedUser) return []
    const now = Date.now()
    const points: { time: string; battery: number; charging?: boolean }[] = []
    let baseBattery = selectedUser.device.batteryLevel
    for (let i = 24; i >= 0; i--) {
      const t = new Date(now - i * 60 * 60 * 1000)
      const variation = (Math.random() - 0.5) * 6
      const charge = i > 18
      const b = charge
        ? Math.min(100, baseBattery + (24 - i) * 2.5 + variation)
        : Math.max(5, baseBattery - (24 - i) * 1.8 + variation)
      points.push({
        time: `${t.getHours()}:00`,
        battery: Math.round(b),
        charging: charge,
      })
    }
    return points
  }, [selectedUser])

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to view battery history</p>
        </CardContent>
      </Card>
    )
  }

  const currentLevel = Math.round(selectedUser.device.batteryLevel)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Battery History (24h)</CardTitle>
          <span
            className={`text-sm font-bold ${
              currentLevel > 40
                ? "text-green-400"
                : currentLevel > 20
                  ? "text-amber-400"
                  : "text-red-400"
            }`}
          >
            {currentLevel}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="time"
                stroke="#52525b"
                fontSize={10}
                tickFormatter={(v: string) => v}
                interval={3}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#52525b"
                fontSize={10}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#e4e4e7" }}
                formatter={(value: number) => [`${value}%`, "Battery"]}
              />
              <ReferenceLine
                y={20}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
              <Line
                type="monotone"
                dataKey="battery"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-4 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 bg-blue-500" />
            24h trend
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-4 border-t border-dashed border-red-500 opacity-40" />
            Low threshold (20%)
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
