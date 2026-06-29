"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/lib/store"
import { formatDate, formatDistance, formatDuration } from "@/lib/utils"
import { FileDown, Loader2 } from "lucide-react"

export function ReportExport() {
  const selectedUser = useDashboardStore((s) => s.getSelectedUser())
  const alerts = useDashboardStore((s) => s.alerts)
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    if (!selectedUser) return
    setLoading(true)

    try {
      const { default: jsPDF } = await import("jspdf")

      const doc = new jsPDF("p", "mm", "a4")
      const pageW = 210
      const margin = 20
      let y = margin

      const write = (text: string, size = 11, bold = false) => {
        doc.setFontSize(size)
        doc.setFont("helvetica", bold ? "bold" : "normal")
        doc.text(text, margin, y)
        y += size * 0.5
      }

      const line = () => {
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, y, pageW - margin, y)
        y += 6
      }

      doc.setTextColor(20, 20, 30)
      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("ENKONI Trip Report", margin, y)
      y += 10
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(120, 120, 120)
      doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y)
      y += 8

      line()

      write("User Information", 14, true)
      write(`Name: ${selectedUser.profile.name}`, 10)
      write(`Age: ${selectedUser.profile.age}`, 10)
      write(`Status: ${selectedUser.status}`, 10)
      y += 4

      line()

      write("Safety Metrics", 14, true)
      write(`Distance Today: ${formatDistance(selectedUser.metrics.totalDistanceToday * 1000)}`, 10)
      write(`Weekly Distance: ${formatDistance(selectedUser.metrics.totalDistanceWeek * 1000)}`, 10)
      write(`Trip Duration: ${formatDuration(selectedUser.metrics.tripDuration)}`, 10)
      write(`Trips Today: ${selectedUser.metrics.tripFrequency}`, 10)
      write(`Safety Score: ${selectedUser.metrics.safetyScore}/100`, 10)
      write(`Incidents: ${selectedUser.metrics.incidents}`, 10)
      y += 4

      line()

      write("Device Status", 14, true)
      write(`Battery: ${Math.round(selectedUser.device.batteryLevel)}%`, 10)
      write(`Signal: ${selectedUser.device.signalStrength}%`, 10)
      write(`Connection: ${selectedUser.device.connectionStatus}`, 10)
      write(`Firmware: ${selectedUser.device.firmwareVersion}`, 10)
      y += 4

      line()

      write("Recent Alerts", 14, true)
      const userAlerts = alerts
        .filter((a) => a.userId === selectedUser.id)
        .slice(0, 10)
      if (userAlerts.length === 0) {
        write("No recent alerts", 10)
      } else {
        userAlerts.forEach((a) => {
          const date = new Date(a.timestamp).toLocaleString()
          write(`[${a.severity.toUpperCase()}] ${a.message}`, 9)
          write(`  ${date}`, 8)
        })
      }
      y += 4

      line()

      write("Location", 14, true)
      write(`Address: ${selectedUser.currentLocation.address}`, 10)
      write(
        `Coordinates: ${selectedUser.currentLocation.coordinates.lat.toFixed(4)}, ${selectedUser.currentLocation.coordinates.lng.toFixed(4)}`,
        10,
      )
      write(`Last Updated: ${formatDate(selectedUser.lastUpdated)}`, 10)

      doc.save(`ENKONI_Report_${selectedUser.profile.name.replace(/\s/g, "_")}.pdf`)
    } catch {
      console.error("PDF generation failed")
    }

    setLoading(false)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={!selectedUser || loading}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileDown className="h-3.5 w-3.5" />
      )}
      Export PDF
    </Button>
  )
}
