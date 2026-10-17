-- Complete SQL schema for Chisom's Kitchen database
-- Idempotent: safe to run multiple times
-- Drop everything first, then recreate

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- STEP 1: Drop all existing tables and objects (clean slate)
-- ============================================================

-- Drop tables with cascade to remove all dependencies
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;
drop table if exists public.categories cascade;

-- Drop triggers (wrap in DO block to handle missing tables)
do $$ begin
  drop trigger if exists handle_categories_updated_at on public.categories;
  drop trigger if exists handle_profiles_updated_at on public.profiles;
  drop trigger if exists handle_products_updated_at on public.products;
  drop trigger if exists handle_orders_updated_at on public.orders;
  drop trigger if exists on_auth_user_created on auth.users;
  exception when undefined_table then
    null;
end $$;

-- Drop enum types (PostgreSQL doesn't support DROP TYPE IF EXISTS directly)
do $$ begin
  drop type order_status cascade;
  exception when undefined_object then
    null;
end $$;

do $$ begin
  drop type payment_status_type cascade;
  exception when undefined_object then
    null;
end $$;

-- Drop functions (with CASCADE to handle dependent triggers)
drop function if exists public.handle_updated_at() cascade;
drop function if exists public.handle_new_user() cascade;

-- ============================================================
-- STEP 2: Create tables
-- ============================================================

-- Categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Products table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
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

-- Enum types for order status and payment status
create type order_status as enum (
  'pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
);
create type payment_status_type as enum (
  'pending', 'paid', 'failed', 'refunded'
);

-- Orders table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  total numeric(10,2) not null check (total >= 0),
  status order_status default 'pending',
  payment_status payment_status_type default 'pending',
  payment_ref text,
  delivery_address text not null,
  phone text,
  notes text,
  payment_method text default 'cod' check (payment_method in ('cod', 'paystack', 'flutterwave')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Order items table
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamp with time zone default now()
);

-- ============================================================
-- STEP 3: Storage bucket for food images
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('food-images', 'food-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- ============================================================
-- STEP 4: Enable Row Level Security
-- ============================================================

alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- ============================================================
-- STEP 5: Helper function
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- STEP 6: Triggers
-- ============================================================

create trigger handle_categories_updated_at
  before update on public.categories
  for each row execute procedure public.handle_updated_at();

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_products_updated_at
  before update on public.products
  for each row execute procedure public.handle_updated_at();

create trigger handle_orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'customer');
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STEP 6:5: Helper function to check admin role (SECURITY DEFINER to avoid RLS recursion)
-- ============================================================

create or replace function public.is_admin()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$ language sql security definer;

-- ============================================================
-- STEP 7: Policies
-- ============================================================

-- Profiles policies
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Service role can insert profiles" on public.profiles
  for insert with check (true);

create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

-- Categories policies
create policy "Categories are viewable by everyone" on public.categories
  for select using (true);

create policy "Only admins can insert categories" on public.categories
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update categories" on public.categories
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete categories" on public.categories
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Products policies
create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Only admins can insert products" on public.products
  for insert with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can update products" on public.products
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Only admins can delete products" on public.products
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Orders policies
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can create their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Admins can view all orders" on public.orders
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update any order" on public.orders
  for update using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete orders" on public.orders
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Order items policies
create policy "Users can view their order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Admins can view all order items" on public.order_items
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Service role can insert order items" on public.order_items
  for insert with check (true);

create policy "Admins can delete order items" on public.order_items
  for delete using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Storage policies
create policy "Public read food images" on storage.objects
  for select using (bucket_id = 'food-images');

create policy "Service role upload food images" on storage.objects
  for insert with check (bucket_id = 'food-images');

create policy "Admins update food images" on storage.objects
  for update using (
    bucket_id = 'food-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins delete food images" on storage.objects
  for delete using (
    bucket_id = 'food-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ============================================================
-- STEP 8: Indexes
-- ============================================================

create index idx_products_category on public.products(category_id);
create index idx_products_available on public.products(is_available);
create index idx_products_price on public.products(price);
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_created_at on public.orders(created_at desc);
create index idx_orders_payment_status on public.orders(payment_status);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_order_items_product_id on public.order_items(product_id);

-- ============================================================
-- STEP 9: Seed data
-- ============================================================

-- Categories
insert into public.categories (name, slug) values
  ('Main Meals', 'main-meals'),
  ('Snacks', 'snacks'),
  ('Drinks', 'drinks'),
  ('Desserts', 'desserts'),
  ('Local Delicacies', 'local-delicacies')
on conflict (slug) do nothing;

-- Products
insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Jollof Rice with Chicken',
  'Classic Nigerian jollof rice served with grilled chicken, plantain and salad.',
  4500, 'https://picsum.photos/seed/jollof/400/400',
  (select id from public.categories where slug = 'main-meals'), 25, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Suya Skewers',
  'Spicy grilled beef skewers with yaji pepper and onions.',
  3500, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400',
  (select id from public.categories where slug = 'local-delicacies'), 40, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Egusi Soup with Pounded Yam',
  'Rich melon seed soup served with soft pounded yam.',
  5500, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'main-meals'), 15, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Boli and Groundnut',
  'Roasted plantain and fresh groundnut, a classic street snack.',
  1500, 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
  (select id from public.categories where slug = 'snacks'), 30, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Zobo Drink',
  'Refreshing hibiscus tea with ginger and cloves.',
  800, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'drinks'), 50, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Puff Puff',
  'Soft, golden fried dough balls with cinnamon sugar.',
   1200, 'https://picsum.photos/seed/puffpuff/400/400',
  (select id from public.categories where slug = 'desserts'), 60, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Pepper Soup with Fish',
  'Hot aromatic pepper soup with fresh fish and spices.',
  4000, 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400',
  (select id from public.categories where slug = 'main-meals'), 20, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Akara Balls',
  'Deep fried bean cakes served with pepper sauce.',
   1000, 'https://picsum.photos/seed/akara/400/400',
  (select id from public.categories where slug = 'snacks'), 45, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Fried Rice with Chicken',
  'Colourful fried rice with mixed vegetables and grilled chicken.',
   4200, 'https://picsum.photos/seed/friedrice/400/400',
  (select id from public.categories where slug = 'main-meals'), 18, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Moin Moin',
  'Steamed savoury bean pudding wrapped in leaves.',
  900, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'snacks'), 35, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Bread and Egg',
  'Soft bread with fried egg and tomato, a quick breakfast option.',
   1800, 'https://picsum.photos/seed/breadegg/400/400',
  (select id from public.categories where slug = 'snacks'), 25, true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select 'Coconut Water',
  'Fresh chilled coconut water straight from the shell.',
  1500, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'drinks'), 30, true
on conflict do nothing;

-- ============================================================
-- STEP 10: Admin role helper
-- ============================================================

-- Set the first user as admin (if needed, run manually after creating a user)
-- Update profiles set role = 'admin' where id = 'user-uuid-here';

-- Success message
select 'Schema setup complete!' as status;