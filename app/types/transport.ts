export interface Vehicle {
  id: string
  plateNumber: string
  type: "Bus" | "Van" | "Car"
  capacity: number
  status: "Available" | "In Use" | "Maintenance"
  lastMaintenance: string
  currentLocation?: string
  fuelLevel: number
}

export interface Driver {
  id: string
  name: string
  licenseNumber: string
  status: "On Duty" | "Off Duty" | "On Leave"
  assignedVehicle?: string
  phoneNumber: string
  totalTrips: number
  rating: number
}

export interface Route {
  id: string
  name: string
  driver: string
  vehicle: string
  startLocation: string
  endLocation: string
  departureTime: string
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled"
  passengers: number
  estimatedDuration: string
}

