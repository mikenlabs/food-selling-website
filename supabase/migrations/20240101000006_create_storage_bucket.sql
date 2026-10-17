-- Migration: Create storage bucket for food images

-- Insert the storage bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('food-images', 'food-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Drop existing storage policies if they exist (idempotency)
drop policy if exists "Public read food images" on storage.objects;
drop policy if exists "Service role upload food images" on storage.objects;
drop policy if exists "Admins update food images" on storage.objects;
drop policy if exists "Admins delete food images" on storage.objects;

-- Storage bucket policies
-- Allow public read access to food images
create policy "Public read food images" on storage.objects
  for select using (bucket_id = 'food-images');

create policy "Service role upload food images" on storage.objects
  for insert with check (bucket_id = 'food-images');

create policy "Admins update food images" on storage.objects
  for update using (
    bucket_id = 'food-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins delete food images" on storage.objects
  for delete using (
    bucket_id = 'food-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );