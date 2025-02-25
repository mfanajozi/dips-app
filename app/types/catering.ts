export type Catering = {
  id: string;
  site: string;
  building_name: string;
  chef_name: string;
  shift: string;
  item: string | null;
  quantity: number | null;
  date_reported: string | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}
