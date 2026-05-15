create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.generate_invite_code()
returns text
language sql
as $$
  select upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('coach', 'client')),
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.coach_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  bio text,
  specialty text,
  invite_code text not null unique default public.generate_invite_code(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  coach_id uuid references public.coach_profiles(id) on delete set null,
  goal text,
  training_level text,
  height_cm numeric,
  starting_weight_kg numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_coach_profiles_updated_at on public.coach_profiles;
create trigger set_coach_profiles_updated_at
before update on public.coach_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_client_profiles_updated_at on public.client_profiles;
create trigger set_client_profiles_updated_at
before update on public.client_profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  requested_role text;
  requested_name text;
begin
  requested_role := coalesce(new.raw_user_meta_data->>'role', 'client');
  requested_name := coalesce(new.raw_user_meta_data->>'full_name', '');

  if requested_role not in ('coach', 'client') then
    requested_role := 'client';
  end if;

  insert into public.profiles (id, role, full_name)
  values (new.id, requested_role, requested_name)
  on conflict (id) do update
    set role = excluded.role,
        full_name = excluded.full_name;

  if requested_role = 'coach' then
    insert into public.coach_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  else
    insert into public.client_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.coach_profiles enable row level security;
alter table public.client_profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "coach_profiles_select_own" on public.coach_profiles;
create policy "coach_profiles_select_own"
on public.coach_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "coach_profiles_insert_own" on public.coach_profiles;
create policy "coach_profiles_insert_own"
on public.coach_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "coach_profiles_update_own" on public.coach_profiles;
create policy "coach_profiles_update_own"
on public.coach_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "client_profiles_select_own" on public.client_profiles;
create policy "client_profiles_select_own"
on public.client_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "client_profiles_select_assigned_coach" on public.client_profiles;
create policy "client_profiles_select_assigned_coach"
on public.client_profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.user_id = auth.uid()
      and coaches.id = client_profiles.coach_id
  )
);

drop policy if exists "client_profiles_insert_own" on public.client_profiles;
create policy "client_profiles_insert_own"
on public.client_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "client_profiles_update_own" on public.client_profiles;
create policy "client_profiles_update_own"
on public.client_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "client_profiles_update_assigned_coach" on public.client_profiles;
create policy "client_profiles_update_assigned_coach"
on public.client_profiles
for update
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.user_id = auth.uid()
      and coaches.id = client_profiles.coach_id
  )
)
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.user_id = auth.uid()
      and coaches.id = client_profiles.coach_id
  )
);
