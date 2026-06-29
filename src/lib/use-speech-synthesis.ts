"use client"

import { useEffect, useRef } from "react"
import { useDashboardStore } from "./store"

export function useSpeechSynthesis() {
  const alerts = useDashboardStore((s) => s.alerts)
  const lastSpokenRef = useRef<string>("")

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("speechSynthesis" in window)) return

    const unacknowledgedCritical = alerts.filter(
      (a) => a.severity === "critical" && !a.acknowledged,
    )

    if (unacknowledgedCritical.length === 0) return

    const latest = unacknowledgedCritical[0]
    if (latest.id === lastSpokenRef.current) return

    lastSpokenRef.current = latest.id

    const utterance = new SpeechSynthesisUtterance(
      `Critical alert for ${latest.userName}: ${latest.message}`,
    )
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    window.speechSynthesis.speak(utterance)
  }, [alerts])
}
