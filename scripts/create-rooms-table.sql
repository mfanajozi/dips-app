-- Create rooms table
create table public.rooms (
  id uuid default gen_random_uuid() primary key,
  site text not null,
  building_name text not null,
  room_type text not null,
  room_number text not null unique,
  occupant text,
  check_in_date timestamp with time zone,
  check_out_date timestamp with time zone,
  notes text,
  priority text check (priority in ('High', 'Medium', 'Low')),
  status text check (status in ('Occupied', 'Vacant', 'Maintenance', 'Reserved')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a unique constraint on room_number within a building
create unique index rooms_building_room_number_idx on public.rooms (building_name, room_number);

-- Enable Row Level Security (RLS)
alter table public.rooms enable row level security;

-- Create policy to allow authenticated users to read all rooms
create policy "Allow authenticated users to read rooms"
  on public.rooms
  for select
  to authenticated
  using (true);

-- Create policy to allow users with admin role to manage rooms
create policy "Allow admins to manage rooms"
  on public.rooms
  for all
  to authenticated
  using (
    auth.jwt() ->> 'role' = 'Admin'
  );

-- Create function to handle updated_at
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create trigger for updated_at
create trigger handle_updated_at
  before update
  on public.rooms
  for each row
  execute function handle_updated_at();
