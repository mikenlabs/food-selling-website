-- Migration: Create order_items table

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.order_items enable row level security;

-- Drop existing policies if they exist (idempotency)
drop policy if exists "Users can view their order items" on public.order_items;
drop policy if exists "Admins can view all order items" on public.order_items;
drop policy if exists "Service role can insert order items" on public.order_items;
drop policy if exists "Admins can delete order items" on public.order_items;

-- Policy: Users can view order_items for their orders
create policy "Users can view their order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Policy: Admins can view all order items
create policy "Admins can view all order items" on public.order_items
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Policy: Service role can insert order_items
create policy "Service role can insert order items" on public.order_items
  for insert with check (true);

-- Policy: Admins can delete order items
create policy "Admins can delete order items" on public.order_items
  for delete using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Drop existing indexes if they exist to avoid duplicates
drop index if exists idx_order_items_order_id;
drop index if exists idx_order_items_product_id;

-- Indexes for performance
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);