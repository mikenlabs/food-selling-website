-- Migration: Create products table

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  stock integer default 0 check (stock >= 0),
  is_available boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.products enable row level security;

-- Drop existing policies if they exist (idempotency)
drop policy if exists "Products are viewable by everyone" on public.products;
drop policy if exists "Only admins can insert products" on public.products;
drop policy if exists "Only admins can update products" on public.products;
drop policy if exists "Only admins can delete products" on public.products;

-- Policy: Everyone can view products
create policy "Products are viewable by everyone" on public.products
  for select using (true);

-- Policy: Only admins can insert products
create policy "Only admins can insert products" on public.products
  for insert with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Only admins can update products
create policy "Only admins can update products" on public.products
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Only admins can delete products
create policy "Only admins can delete products" on public.products
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Drop existing trigger if exists (idempotency)
drop trigger if exists handle_products_updated_at on public.products;

create trigger handle_products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

-- Drop existing indexes if they exist to avoid duplicates
drop index if exists idx_products_category;
drop index if exists idx_products_available;
drop index if exists idx_products_price;

-- Indexes for performance
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_available on public.products(is_available);
create index if not exists idx_products_price on public.products(price);