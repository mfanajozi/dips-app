-- Create users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null unique,
  username text not null unique,
  password text not null,
  role text not null check (role in ('Admin', 'Super User', 'Management', 'User')),
  avatar text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Create policy to allow authenticated users to read all users
create policy "Allow authenticated users to read users"
  on public.users
  for select
  to authenticated
  using (true);

-- Create policy to allow users to update their own data
create policy "Users can update their own data"
  on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

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
  on public.users
  for each row
  execute function handle_updated_at();
