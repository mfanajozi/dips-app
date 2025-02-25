-- Create transport table
create table public.transport (
  id uuid default gen_random_uuid() primary key,
  site text not null,
  driver_name text not null,
  vehicle text not null,
  registration_number text not null unique,
  type text not null check (type in ('Mini Bus', 'Bus')),
  route text,
  next_maintenance_date date,
  notes text,
  priority text check (priority in ('High', 'Medium', 'Low')),
  mileage integer,
  status text check (status in ('Active', 'Maintenance', 'Out of Service')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.transport enable row level security;

-- Create policy to allow authenticated users to read all transport entries
create policy "Allow authenticated users to read transport"
  on public.transport
  for select
  to authenticated
  using (true);

-- Create policy to allow users with admin role to manage transport
create policy "Allow admins to manage transport"
  on public.transport
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
  on public.transport
  for each row
  execute function handle_updated_at();
