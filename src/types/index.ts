export type ConnectionStatus = "online" | "offline" | "reconnecting"

export type AlertSeverity = "critical" | "warning" | "info"

export type AlertType =
  | "obstacle_detected"
  | "hole_stair_detected"
  | "fall_detected"
  | "device_disconnected"
  | "low_battery"
  | "geofence_breach"
  | "unusual_movement"

export type GeofenceZoneType = "home" | "work" | "hospital" | "school" | "custom"

export type SensorType = "obstacle" | "gps" | "motion" | "gyroscope" | "ultrasonic"

export type CaregiverRole = "admin" | "viewer"

export interface Coordinates {
  lat: number
  lng: number
}

export interface LocationData {
  coordinates: Coordinates
  address: string
  timestamp: string
  speed?: number
  heading?: number
}

export interface GeofenceZone {
  id: string
  name: string
  type: GeofenceZoneType
  center: Coordinates
  radius: number
  color: string
  enabled: boolean
}

export interface DeviceSensor {
  id: string
  type: SensorType
  label: string
  status: "active" | "inactive" | "error"
  value?: string | number
  lastReading: string
}

export interface DeviceInfo {
  batteryLevel: number
  signalStrength: number
  lastConnectionTime: string
  firmwareVersion: string
  sensors: DeviceSensor[]
  connectionStatus: ConnectionStatus
}

export interface SafetyMetrics {
  totalDistanceToday: number
  totalDistanceWeek: number
  obstaclesDetected: number
  tripDuration: number
  tripFrequency: number
  safetyScore: number
  incidents: number
}

export interface LocationHistoryPoint {
  coordinates: Coordinates
  timestamp: string
  speed?: number
}

export interface UserProfile {
  id: string
  name: string
  age: number
  photoUrl?: string
  emergencyContact: {
    name: string
    phone: string
    relation: string
  }
  medicalNotes: string
  accessibilityNotes: string
  preferredAlertMethods: ("in_app" | "sms" | "email" | "call")[]
  safeZones: GeofenceZone[]
}

export interface MonitoredUser {
  id: string
  profile: UserProfile
  currentLocation: LocationData
  locationHistory: LocationHistoryPoint[]
  device: DeviceInfo
  metrics: SafetyMetrics
  lastUpdated: string
  geofenceZones: GeofenceZone[]
  status: "moving" | "stationary" | "unknown"
}

export interface Alert {
  id: string
  userId: string
  userName: string
  type: AlertType
  severity: AlertSeverity
  message: string
  location?: LocationData
  timestamp: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}

export interface AlertRule {
  id: string
  name: string
  condition: {
    type: AlertType | "any"
    severity: AlertSeverity | "any"
    batteryBelow?: number
    outsideSafeZone?: boolean
  }
  action: {
    method: "sms" | "email" | "call" | "in_app"
    notify: string
  }
  enabled: boolean
}

export interface DashboardState {
  users: MonitoredUser[]
  alerts: Alert[]
  alertRules: AlertRule[]
  selectedUserId: string | null
  isSidebarOpen: boolean
  isAlertPanelOpen: boolean
  selectedView: "map" | "users" | "alerts" | "metrics" | "profile"
  timeRange: 1 | 3 | 7
}
