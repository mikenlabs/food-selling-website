-- Seed data: Categories

insert into public.categories (name, slug) values
  ('Main Meals', 'main-meals'),
  ('Snacks', 'snacks'),
  ('Drinks', 'drinks'),
  ('Desserts', 'desserts'),
  ('Local Delicacies', 'local-delicacies')
on conflict (slug) do nothing;