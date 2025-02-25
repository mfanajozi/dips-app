-- Create vehicles table
create table public.vehicles (
  id uuid default gen_random_uuid() primary key,
  plate_number text not null unique,
  type text not null check (type in ('Bus', 'Van', 'Car')),
  capacity integer not null,
  status text not null check (status in ('Available', 'In Use', 'Maintenance')),
  last_maintenance date not null,
  current_location text,
  fuel_level integer not null check (fuel_level >= 0 and fuel_level <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create drivers table
create table public.drivers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  license_number text not null unique,
  status text not null check (status in ('On Duty', 'Off Duty', 'On Leave')),
  assigned_vehicle text references public.vehicles(plate_number),
  phone_number text not null,
  total_trips integer not null default 0,
  rating decimal not null check (rating >= 0 and rating <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create routes table
create table public.routes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  driver text not null references public.drivers(name),
  vehicle text not null references public.vehicles(plate_number),
  start_location text not null,
  end_location text not null,
  departure_time text not null,
  status text not null check (status in ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  passengers integer not null check (passengers >= 0),
  estimated_duration text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.routes enable row level security;

-- Create policies for vehicles
create policy "Allow authenticated users to read vehicles"
  on public.vehicles
  for select
  to authenticated
  using (true);

create policy "Allow admins to manage vehicles"
  on public.vehicles
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'Admin');

-- Create policies for drivers
create policy "Allow authenticated users to read drivers"
  on public.drivers
  for select
  to authenticated
  using (true);

create policy "Allow admins to manage drivers"
  on public.drivers
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'Admin');

-- Create policies for routes
create policy "Allow authenticated users to read routes"
  on public.routes
  for select
  to authenticated
  using (true);

create policy "Allow admins to manage routes"
  on public.routes
  for all
  to authenticated
  using (auth.jwt() ->> 'role' = 'Admin');

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

-- Create triggers for updated_at
create trigger handle_vehicles_updated_at
  before update
  on public.vehicles
  for each row
  execute function handle_updated_at();

create trigger handle_drivers_updated_at
  before update
  on public.drivers
  for each row
  execute function handle_updated_at();

create trigger handle_routes_updated_at
  before update
  on public.routes
  for each row
  execute function handle_updated_at();
