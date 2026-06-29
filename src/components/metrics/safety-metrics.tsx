"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useDashboardStore } from "@/lib/store"
import { cn, formatDistance, formatDuration } from "@/lib/utils"
import {
  Footprints,
  AlertTriangle,
  Clock,
  Route,
  TrendingUp,
  Shield,
  Activity,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

const weeklyData = [
  { day: "Mon", distance: 2.1, alerts: 3, trips: 2 },
  { day: "Tue", distance: 3.5, alerts: 1, trips: 3 },
  { day: "Wed", distance: 1.8, alerts: 5, trips: 1 },
  { day: "Thu", distance: 4.2, alerts: 2, trips: 4 },
  { day: "Fri", distance: 2.7, alerts: 4, trips: 2 },
  { day: "Sat", distance: 5.1, alerts: 0, trips: 3 },
  { day: "Sun", distance: 3.9, alerts: 2, trips: 2 },
]

const hourlyActivity = [
  { hour: "6a", movement: 20 },
  { hour: "8a", movement: 65 },
  { hour: "10a", movement: 45 },
  { hour: "12p", movement: 80 },
  { hour: "2p", movement: 55 },
  { hour: "4p", movement: 70 },
  { hour: "6p", movement: 40 },
  { hour: "8p", movement: 25 },
]

export function SafetyMetrics() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to view metrics</p>
        </CardContent>
      </Card>
    )
  }

  const { metrics } = selectedUser

  const statCards = [
    {
      label: "Distance Today",
      value: formatDistance(metrics.totalDistanceToday * 1000),
      icon: Footprints,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Obstacles Today",
      value: metrics.obstaclesDetected.toString(),
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Trip Duration",
      value: formatDuration(metrics.tripDuration),
      icon: Clock,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Trips Today",
      value: metrics.tripFrequency.toString(),
      icon: Route,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-start gap-3">
                <div className={cn("rounded-lg p-2", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-zinc-500">{stat.label}</p>
                  <p className="text-lg font-bold text-zinc-100">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Distance (km)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="distanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#e4e4e7" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="distance"
                    stroke="#2563eb"
                    fill="url(#distanceGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="hour" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#e4e4e7" }}
                  />
                  <Bar dataKey="movement" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Safety Score</CardTitle>
              <span
                className={cn(
                  "text-lg font-bold",
                  metrics.safetyScore >= 90
                    ? "text-green-400"
                    : metrics.safetyScore >= 75
                      ? "text-amber-400"
                      : "text-red-400",
                )}
              >
                {metrics.safetyScore}/100
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Shield className="h-3 w-3" />
                  Incidents
                </span>
                <span className="font-medium text-zinc-200">{metrics.incidents}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <Activity className="h-3 w-3" />
                  Obstacles Detected
                </span>
                <span className="font-medium text-zinc-200">
                  {metrics.obstaclesDetected}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <TrendingUp className="h-3 w-3" />
                  Weekly Distance
                </span>
                <span className="font-medium text-zinc-200">
                  {formatDistance(metrics.totalDistanceWeek * 1000)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
                  <YAxis stroke="#52525b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#e4e4e7" }}
                  />
                  <Bar dataKey="trips" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
                Trips
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 rounded-sm bg-red-500" />
                Alerts
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
