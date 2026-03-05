-- Table des favoris
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  villa_id uuid references public.villas(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, villa_id)
);

-- Index pour les lookups
create index if not exists favorites_user_id_idx on public.favorites(user_id);
create index if not exists favorites_villa_id_idx on public.favorites(villa_id);

-- RLS
alter table public.favorites enable row level security;

create policy "Users can view their own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);
