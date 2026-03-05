-- ============================================
-- Housespark MVP – Supabase Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- PROFILES (extends auth.users)
-- =====================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default '',
  email text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =====================
-- VILLAS
-- =====================
create table public.villas (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  location_label text not null default '',
  description text not null default '',
  capacity_min int not null default 10,
  capacity_max int not null default 45,
  price_type text not null default 'per_night' check (price_type in ('per_night', 'per_stay')),
  price_amount numeric(10,2) not null default 0,
  activities text[] not null default '{}',
  equipments text[] not null default '{}',
  published boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.villas enable row level security;

create policy "Published villas viewable by everyone" on public.villas
  for select using (published = true or exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can manage villas" on public.villas
  for all using (exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- =====================
-- VILLA PHOTOS
-- =====================
create table public.villa_photos (
  id uuid primary key default uuid_generate_v4(),
  villa_id uuid references public.villas on delete cascade not null,
  url text not null,
  alt text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.villa_photos enable row level security;

create policy "Photos viewable by everyone" on public.villa_photos
  for select using (true);

create policy "Admins can manage photos" on public.villa_photos
  for all using (exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- =====================
-- EXTRAS
-- =====================
create table public.extras (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null default '',
  pricing_type text not null default 'fixed' check (pricing_type in ('fixed', 'per_person')),
  price_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.extras enable row level security;

create policy "Extras viewable by everyone" on public.extras
  for select using (true);

create policy "Admins can manage extras" on public.extras
  for all using (exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- =====================
-- VILLA_EXTRAS (many-to-many)
-- =====================
create table public.villa_extras (
  villa_id uuid references public.villas on delete cascade not null,
  extra_id uuid references public.extras on delete cascade not null,
  primary key (villa_id, extra_id)
);

alter table public.villa_extras enable row level security;

create policy "Villa extras viewable by everyone" on public.villa_extras
  for select using (true);

create policy "Admins can manage villa extras" on public.villa_extras
  for all using (exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- =====================
-- BOOKINGS
-- =====================
create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  reference text not null unique default ('HS-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid references public.profiles on delete set null,
  villa_id uuid references public.villas on delete cascade not null,
  guest_name text not null default '',
  guest_email text not null default '',
  guest_phone text not null default '',
  start_date date not null,
  end_date date not null,
  guests_count int not null default 1,
  total_estimated numeric(10,2) not null default 0,
  status text not null default 'pending_test' check (status in ('pending_test', 'confirmed_test', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings" on public.bookings
  for select using (auth.uid() = user_id or exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

create policy "Anyone can create bookings" on public.bookings
  for insert with check (true);

create policy "Admins can manage bookings" on public.bookings
  for all using (exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));

-- =====================
-- BOOKING_EXTRAS
-- =====================
create table public.booking_extras (
  booking_id uuid references public.bookings on delete cascade not null,
  extra_id uuid references public.extras on delete cascade not null,
  quantity int not null default 1,
  price_at_booking numeric(10,2) not null default 0,
  primary key (booking_id, extra_id)
);

alter table public.booking_extras enable row level security;

create policy "Users can view own booking extras" on public.booking_extras
  for select using (exists(
    select 1 from public.bookings where bookings.id = booking_id and (bookings.user_id = auth.uid() or exists(
      select 1 from public.profiles where profiles.id = auth.uid() and role = 'admin'
    ))
  ));

create policy "Anyone can create booking extras" on public.booking_extras
  for insert with check (true);

create policy "Admins can manage booking extras" on public.booking_extras
  for all using (exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  ));
