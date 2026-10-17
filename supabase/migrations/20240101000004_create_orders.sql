-- Migration: Create orders table

-- Drop existing types if they exist (idempotency for PostgreSQL enums)
do $$ begin
  drop type if exists order_status cascade;
  drop type if exists payment_status_type cascade;
  exception when others then
    null;
end $$;

create type order_status as enum (
  'pending',
  'paid',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);

create type payment_status_type as enum (
  'pending',
  'paid',
  'failed',
  'refunded'
);

create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
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

-- Enable Row Level Security
alter table public.orders enable row level security;

-- Drop existing policies if they exist (idempotency)
drop policy if exists "Users can view their own orders" on public.orders;
drop policy if exists "Users can create their own orders" on public.orders;
drop policy if exists "Admins can view all orders" on public.orders;
drop policy if exists "Admins can update any order" on public.orders;
drop policy if exists "Admins can delete orders" on public.orders;

-- Policy: Users can view their own orders
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

-- Policy: Users can create their own orders
create policy "Users can create their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

-- Policy: Admins can view all orders
create policy "Admins can view all orders" on public.orders
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Admins can update any order
create policy "Admins can update any order" on public.orders
  for update using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Admins can delete orders
create policy "Admins can delete orders" on public.orders
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Drop existing trigger if exists (idempotency)
drop trigger if exists handle_orders_updated_at on public.orders;

create trigger handle_orders_updated_at
  before update on public.orders
  for each row execute procedure public.handle_updated_at();

-- Drop existing indexes if they exist to avoid duplicates
drop index if exists idx_orders_user_id;
drop index if exists idx_orders_status;
drop index if exists idx_orders_created_at;
drop index if exists idx_orders_payment_status;

-- Indexes for performance
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_payment_status on public.orders(payment_status);