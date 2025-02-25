export type Maintenance = {
  id: string;
  site: string;
  building_name: string;
  room_number: string;
  reporter_name: string;
  date_reported: string | null;
  date_resolved: string | null;
  reference: string | null;
  issue: string | null;
  priority: string | null;
  owner: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
}
