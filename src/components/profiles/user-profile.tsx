"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useDashboardStore } from "@/lib/store"
import { formatDate } from "@/lib/utils"
import {
  Phone,
  Mail,
  MessageSquare,
  Bell,
  MapPin,
  Stethoscope,
  Accessibility,
  Shield,
  PhoneCall,
  Smartphone,
  AlertTriangle,
  CircleCheck,
} from "lucide-react"

export function UserProfileView() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())

  if (!selectedUser) {
    return (
      <Card>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-zinc-500">Select a user to view profile</p>
        </CardContent>
      </Card>
    )
  }

  const { profile, device, geofenceZones } = selectedUser
  const { emergencyContact } = profile

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-center gap-4 pt-4">
          <Avatar name={profile.name} size="lg" />
          <div>
            <h2 className="text-lg font-bold text-zinc-100">{profile.name}</h2>
            <p className="text-xs text-zinc-500">Age {profile.age}</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant={
                  device.connectionStatus === "online" ? "success" : "danger"
                }
              >
                {device.connectionStatus}
              </Badge>
              <span className="text-[10px] text-zinc-600">
                Last update: {formatDate(selectedUser.lastUpdated)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-zinc-500" />
              <CardTitle>Emergency Contact</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Name</span>
              <span className="font-medium text-zinc-200">
                {emergencyContact.name}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-zinc-500">
                <Phone className="h-3 w-3" />
                Phone
              </span>
              <span className="font-medium text-zinc-200">
                {emergencyContact.phone}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Relation</span>
              <span className="font-medium text-zinc-200">
                {emergencyContact.relation}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-zinc-500" />
              <CardTitle>Alert Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.preferredAlertMethods.map((method) => {
                let icon = Smartphone
                let label = method
                if (method === "sms") {
                  icon = MessageSquare
                  label = "SMS"
                } else if (method === "email") {
                  icon = Mail
                  label = "Email"
                } else if (method === "call") {
                  icon = Phone
                  label = "Phone Call"
                } else if (method === "in_app") {
                  icon = Bell
                  label = "In-App"
                }
                const Icon = icon
                return (
                  <div
                    key={method}
                    className="flex items-center gap-2 rounded-lg bg-zinc-800/30 px-2.5 py-2"
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-xs text-zinc-300">{label}</span>
                    <CircleCheck className="ml-auto h-3.5 w-3.5 text-green-500" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-zinc-500" />
              <CardTitle>Medical Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-zinc-400">
              {profile.medicalNotes}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-zinc-500" />
              <CardTitle>Accessibility Notes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs leading-relaxed text-zinc-400">
              {profile.accessibilityNotes}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-zinc-500" />
            <CardTitle>Safe Zones ({geofenceZones.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {geofenceZones.map((zone) => (
              <div
                key={zone.id}
                className="flex items-center justify-between rounded-lg bg-zinc-800/30 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: zone.color }}
                  />
                  <div>
                    <span className="text-xs font-medium text-zinc-200">
                      {zone.name}
                    </span>
                    <span className="ml-2 text-[10px] text-zinc-500">
                      {zone.radius}m radius
                    </span>
                  </div>
                </div>
                <Badge variant={zone.enabled ? "success" : "default"}>
                  {zone.enabled ? "Active" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
