-- Migration: Create categories table

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.categories enable row level security;

-- Drop existing policies if they exist (idempotency)
drop policy if exists "Categories are viewable by everyone" on public.categories;
drop policy if exists "Only admins can insert categories" on public.categories;
drop policy if exists "Only admins can update categories" on public.categories;
drop policy if exists "Only admins can delete categories" on public.categories;

-- Policy: Everyone can view categories
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

-- Policy: Only admins can insert categories
create policy "Only admins can insert categories" on public.categories
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Only admins can update categories
create policy "Only admins can update categories" on public.categories
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Only admins can delete categories
create policy "Only admins can delete categories" on public.categories
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Drop existing trigger if exists (idempotency)
drop trigger if exists handle_categories_updated_at on public.categories;

create trigger handle_categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();