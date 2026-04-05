-- Club 5 Octobre - Supabase schema
-- Run in Supabase SQL editor
create extension if not exists "pgcrypto";

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  description text not null,
  category text not null check (
    category in (
      'Boissons Chaudes',
      'Boissons Fraîches',
      'Petit Déjeuner',
      'Plats Légers',
      'Spécialités Marocaines',
      'Desserts'
    )
  ),
  price_mad numeric(10, 2) not null check (price_mad > 0),
  is_available boolean not null default true,
  image_url text,
  created_at timestamptz not null default now ()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid (),
  full_name text not null,
  email text not null,
  phone text not null,
  reservation_date date not null,
  start_time time not null,
  end_time time not null,
  guests int not null check (guests between 8 and 20),
  notes text,
  language text not null default 'fr' check (language in ('fr', 'ar')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now (),
  check (start_time < end_time)
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  image_url text not null,
  alt_text text,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now ()
);

-- Optional user profile table for admin flag
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now ()
);

alter table public.menu_items enable row level security;

alter table public.reservations enable row level security;

alter table public.gallery_images enable row level security;

alter table public.profiles enable row level security;

-- Unified admin check used by RLS policies.
-- This supports either a profile flag (`profiles.is_admin = true`) or
-- auth claims used by the app's admin login flow.
create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select
    exists (
      select
        1
      from
        public.profiles
      where
        profiles.id = auth.uid ()
        and profiles.is_admin = true
    )
    or coalesce((auth.jwt () -> 'user_metadata' ->> 'role') = 'admin', false)
    or coalesce((auth.jwt () ->> 'email') like '%@club5octobre.ma', false);
$$;

-- Public read policies
drop policy if exists "Public read menu" on public.menu_items;

create policy "Public read menu" on public.menu_items for
select
  using (true);

drop policy if exists "Public read gallery" on public.gallery_images;

create policy "Public read gallery" on public.gallery_images for
select
  using (true);

-- Public insert reservation policy
drop policy if exists "Public insert reservations" on public.reservations;

create policy "Public insert reservations" on public.reservations for insert
with
  check (true);

-- Authenticated users can read their own profile
drop policy if exists "Users read own profile" on public.profiles;

create policy "Users read own profile" on public.profiles for
select
  using (auth.uid () = id);

-- Admin policies
drop policy if exists "Admin manage menu" on public.menu_items;

create policy "Admin manage menu" on public.menu_items for all using (public.is_admin_user())
with
  check (public.is_admin_user());

drop policy if exists "Admin manage gallery" on public.gallery_images;

create policy "Admin manage gallery" on public.gallery_images for all using (public.is_admin_user())
with
  check (public.is_admin_user());

drop policy if exists "Admin read reservations" on public.reservations;

create policy "Admin read reservations" on public.reservations for
select
  using (public.is_admin_user());

drop policy if exists "Admin update reservations" on public.reservations;

create policy "Admin update reservations" on public.reservations for
update using (public.is_admin_user())
with
  check (public.is_admin_user());

-- Storage setup for gallery uploads
insert into
  storage.buckets (id, name, public)
values
  ('club-gallery', 'club-gallery', true) on conflict (id) do nothing;

-- storage policy: public read, admin write
drop policy if exists "Public read gallery bucket" on storage.objects;

create policy "Public read gallery bucket" on storage.objects for
select
  using (bucket_id = 'club-gallery');

drop policy if exists "Admin upload gallery bucket" on storage.objects;

create policy "Admin upload gallery bucket" on storage.objects for insert
with
  check (
    bucket_id = 'club-gallery'
    and public.is_admin_user()
  );

drop policy if exists "Admin delete gallery bucket" on storage.objects;

create policy "Admin delete gallery bucket" on storage.objects for delete using (
  bucket_id = 'club-gallery'
  and public.is_admin_user()
);

-- Seed menu examples
insert into
  public.menu_items (
    name,
    description,
    category,
    price_mad,
    is_available
  )
values
  (
    'Thé à la Menthe',
    'Thé vert infusé à la menthe fraîche.',
    'Boissons Chaudes',
    25,
    true
  ),
  (
    'Espresso',
    'Café serré arabica.',
    'Boissons Chaudes',
    30,
    true
  ),
  (
    'Shakshuka',
    'Œufs mijotés à la tomate et poivron.',
    'Petit Déjeuner',
    65,
    true
  ),
  (
    'Harira',
    'Soupe marocaine traditionnelle.',
    'Spécialités Marocaines',
    45,
    true
  ),
  (
    'Chebakia',
    'Pâtisserie au miel et sésame.',
    'Desserts',
    35,
    true
  ) on conflict do nothing;