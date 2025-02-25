import { supabase } from "../lib/supabase"

async function setupTransportTables() {
  try {
    console.log("Starting transport tables setup...")

    // Insert vehicles
    console.log("Inserting vehicles...")
    const { error: vehiclesError } = await supabase.from("vehicles").insert([
      {
        plate_number: "ABC 123",
        type: "Bus",
        capacity: 45,
        status: "Available",
        last_maintenance: "2024-01-15",
        current_location: "Site A",
        fuel_level: 85,
      },
      {
        plate_number: "XYZ 789",
        type: "Van",
        capacity: 15,
        status: "In Use",
        last_maintenance: "2024-01-20",
        current_location: "Site B",
        fuel_level: 65,
      },
      {
        plate_number: "DEF 456",
        type: "Bus",
        capacity: 45,
        status: "Maintenance",
        last_maintenance: "2024-02-01",
        current_location: "Maintenance Bay",
        fuel_level: 30,
      },
    ])
    if (vehiclesError) {
      console.error("Error inserting vehicles:", vehiclesError)
      throw vehiclesError
    }
    console.log("Vehicles inserted successfully")

    // Insert drivers
    console.log("Inserting drivers...")
    const { error: driversError } = await supabase.from("drivers").insert([
      {
        name: "John Smith",
        license_number: "DL123456",
        status: "On Duty",
        assigned_vehicle: "ABC 123",
        phone_number: "+1234567890",
        total_trips: 156,
        rating: 4.8,
      },
      {
        name: "Sarah Johnson",
        license_number: "DL789012",
        status: "Off Duty",
        phone_number: "+1234567891",
        total_trips: 142,
        rating: 4.9,
      },
      {
        name: "Mike Wilson",
        license_number: "DL345678",
        status: "On Leave",
        phone_number: "+1234567892",
        total_trips: 98,
        rating: 4.7,
      },
    ])
    if (driversError) {
      console.error("Error inserting drivers:", driversError)
      throw driversError
    }
    console.log("Drivers inserted successfully")

    // Insert routes
    console.log("Inserting routes...")
    const { error: routesError } = await supabase.from("routes").insert([
      {
        name: "Morning Shuttle A",
        driver: "John Smith",
        vehicle: "ABC 123",
        start_location: "Site A",
        end_location: "Site B",
        departure_time: "08:00 AM",
        status: "Scheduled",
        passengers: 35,
        estimated_duration: "45 mins",
      },
      {
        name: "Evening Shuttle B",
        driver: "Sarah Johnson",
        vehicle: "XYZ 789",
        start_location: "Site B",
        end_location: "Site C",
        departure_time: "05:00 PM",
        status: "In Progress",
        passengers: 12,
        estimated_duration: "30 mins",
      },
    ])
    if (routesError) {
      console.error("Error inserting routes:", routesError)
      throw routesError
    }
    console.log("Routes inserted successfully")

    console.log("Transport tables setup completed successfully")
  } catch (error) {
    console.error("Error setting up transport tables:", error)
    process.exit(1)
  }
}

setupTransportTables()
