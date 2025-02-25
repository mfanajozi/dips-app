import { NextResponse } from "next/server"

export async function GET() {
  // In a real app, this would fetch data from a database
  const rooms = [
    { id: 1, room_number: "A101", capacity: 2, status: "occupied", site: "Site A" },
    { id: 2, room_number: "B202", capacity: 4, status: "available", site: "Site B" },
    { id: 3, room_number: "C303", capacity: 3, status: "maintenance", site: "Site C" },
  ]

  return NextResponse.json(rooms)
}

