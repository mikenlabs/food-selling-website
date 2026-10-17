-- Seed data: Products (Nigerian dishes and snacks)

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Jollof Rice with Chicken',
  'Classic Nigerian jollof rice served with grilled chicken, plantain and salad.',
  4500,
  'https://picsum.photos/seed/jollof/400/400',
  (select id from public.categories where slug = 'main-meals'),
  25,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Suya Skewers',
  'Spicy grilled beef skewers with yaji pepper and onions.',
  3500,
  'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400',
  (select id from public.categories where slug = 'local-delicacies'),
  40,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Egusi Soup with Pounded Yam',
  'Rich melon seed soup served with soft pounded yam.',
  5500,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'main-meals'),
  15,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Boli and Groundnut',
  'Roasted plantain and fresh groundnut, a classic street snack.',
  1500,
  'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400',
  (select id from public.categories where slug = 'snacks'),
  30,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Zobo Drink',
  'Refreshing hibiscus tea with ginger and cloves.',
  800,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'drinks'),
  50,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Puff Puff',
  'Soft, golden fried dough balls with cinnamon sugar.',
  1200,
  'https://picsum.photos/seed/puffpuff/400/400',
  (select id from public.categories where slug = 'desserts'),
  60,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Pepper Soup with Fish',
  'Hot aromatic pepper soup with fresh fish and spices.',
  4000,
  'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400',
  (select id from public.categories where slug = 'main-meals'),
  20,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Akara Balls',
  'Deep fried bean cakes served with pepper sauce.',
  1000,
  'https://picsum.photos/seed/akara/400/400',
  (select id from public.categories where slug = 'snacks'),
  45,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Fried Rice with Chicken',
  'Colourful fried rice with mixed vegetables and grilled chicken.',
  4200,
  'https://picsum.photos/seed/friedrice/400/400',
  (select id from public.categories where slug = 'main-meals'),
  18,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Moin Moin',
  'Steamed savoury bean pudding wrapped in leaves.',
  900,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'snacks'),
  35,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Bread and Egg',
  'Soft bread with fried egg and tomato, a quick breakfast option.',
  1800,
  'https://picsum.photos/seed/breadegg/400/400',
  (select id from public.categories where slug = 'snacks'),
  25,
  true
on conflict do nothing;

insert into public.products (name, description, price, image_url, category_id, stock, is_available)
select
  'Coconut Water',
  'Fresh chilled coconut water straight from the shell.',
  1500,
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  (select id from public.categories where slug = 'drinks'),
  30,
  true
on conflict do nothing;