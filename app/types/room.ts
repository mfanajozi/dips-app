export interface Room {
  id: string
  site: string
  building_name: string
  room_type: string
  room_number: string
  occupant: string | null
  check_in_date: string | null
  check_out_date: string | null
  status: 'Occupied' | 'Vacant' | 'Maintenance' | 'Reserved'
  created_at: string
  updated_at: string
}
