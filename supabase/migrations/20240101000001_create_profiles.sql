-- Migration: Create profiles table
-- Extends auth.users to store additional user information
-- Run this to set up user profiles and role-based access

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Drop existing policies if they exist (idempotency)
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Service role can insert profiles" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;

-- Policy: Users can view their own profile
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policy: Anyone can insert a profile on signup (service role handles this)
create policy "Service role can insert profiles" on public.profiles
  for insert with check (true);

-- Policy: Admins can view all profiles (uses SECURITY DEFINER function to avoid RLS recursion)
create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$ language sql security definer;

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

-- Drop existing trigger if exists (idempotency)
drop trigger if exists handle_profiles_updated_at on public.profiles;

-- Trigger to set updated_at on profile changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Drop existing user creation trigger if exists (idempotency)
drop trigger if exists on_auth_user_created on auth.users;

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql;

-- Trigger new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();