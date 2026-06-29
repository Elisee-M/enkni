"use client"

import { useCallback } from "react"
import { create } from "zustand"
import type {
  DashboardState,
  MonitoredUser,
  Alert,
  LocationData,
  CaregiverRole,
} from "@/types"
import { mockUsers, mockAlerts } from "./mock-data"

interface DashboardStore extends DashboardState {
  setSelectedUser: (userId: string | null) => void
  toggleSidebar: () => void
  toggleAlertPanel: () => void
  setSelectedView: (view: DashboardState["selectedView"]) => void
  setTimeRange: (range: 1 | 3 | 7) => void
  acknowledgeAlert: (alertId: string) => void
  updateUserLocation: (userId: string, location: LocationData) => void
  updateBatteryLevel: (userId: string, level: number) => void
  addAlert: (alert: Alert) => void
  getSelectedUser: () => MonitoredUser | undefined
  getUnacknowledgedAlerts: () => Alert[]
  caregiverRole: CaregiverRole
  setCaregiverRole: (role: CaregiverRole) => void
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  users: mockUsers,
  alerts: mockAlerts,
  selectedUserId: "user-1",
  isSidebarOpen: true,
  isAlertPanelOpen: false,
  selectedView: "map",
  timeRange: 1,
  caregiverRole: "admin",

  setSelectedUser: (userId) => set({ selectedUserId: userId }),

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  toggleAlertPanel: () => set((s) => ({ isAlertPanelOpen: !s.isAlertPanelOpen })),

  setSelectedView: (view) => set({ selectedView: view }),

  setTimeRange: (range) => set({ timeRange: range }),

  acknowledgeAlert: (alertId) =>
    set((s) => ({
      alerts: s.alerts.map((a) =>
        a.id === alertId
          ? { ...a, acknowledged: true, acknowledgedAt: new Date().toISOString(), acknowledgedBy: "Admin" }
          : a,
      ),
    })),

  updateUserLocation: (userId, location) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === userId
          ? {
              ...u,
              currentLocation: location,
              lastUpdated: location.timestamp,
              locationHistory: [...u.locationHistory, {
                coordinates: location.coordinates,
                timestamp: location.timestamp,
                speed: location.speed,
              }].slice(-168),
            }
          : u,
      ),
    })),

  updateBatteryLevel: (userId, level) =>
    set((s) => ({
      users: s.users.map((u) =>
        u.id === userId
          ? { ...u, device: { ...u.device, batteryLevel: level } }
          : u,
      ),
    })),

  setCaregiverRole: (role) => set({ caregiverRole: role }),

  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts].slice(0, 100) })),

  getSelectedUser: () => {
    const state = get()
    return state.users.find((u) => u.id === state.selectedUserId)
  },

  getUnacknowledgedAlerts: () => {
    return get().alerts.filter((a) => !a.acknowledged)
  },
}))

export function useSimulatedUpdates() {
  const updateUserLocation = useDashboardStore((s) => s.updateUserLocation)
  const updateBatteryLevel = useDashboardStore((s) => s.updateBatteryLevel)
  const addAlert = useDashboardStore((s) => s.addAlert)

  const simulateLocationUpdate = useCallback((userId: string) => {
    const user = useDashboardStore.getState().users.find((u) => u.id === userId)
    if (!user) return

    const baseLat = user.currentLocation.coordinates.lat
    const baseLng = user.currentLocation.coordinates.lng

    const newLocation: LocationData = {
      coordinates: {
        lat: baseLat + (Math.random() - 0.5) * 0.002,
        lng: baseLng + (Math.random() - 0.5) * 0.002,
      },
      address: user.currentLocation.address,
      timestamp: new Date().toISOString(),
      speed: Math.random() * 3,
      heading: Math.random() * 360,
    }

    updateUserLocation(userId, newLocation)
  }, [updateUserLocation])

  const simulateBatteryDrain = useCallback((userId: string) => {
    const user = useDashboardStore.getState().users.find((u) => u.id === userId)
    if (!user) return

    const newLevel = Math.max(0, user.device.batteryLevel - Math.random() * 0.5)
    updateBatteryLevel(userId, Math.round(newLevel * 10) / 10)

    if (newLevel <= 20 && newLevel > 19.5) {
      addAlert({
        id: `alert-${Date.now()}`,
        userId,
        userName: user.profile.name,
        type: "low_battery",
        severity: "warning",
        message: `${user.profile.name}'s ENKONI device battery is low (${Math.round(newLevel)}%).`,
        timestamp: new Date().toISOString(),
        acknowledged: false,
      })
    }
  }, [updateBatteryLevel, addAlert])

  return { simulateLocationUpdate, simulateBatteryDrain }
}
