create table if not exists public.progress_entries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  weight_kg numeric,
  waist_cm numeric,
  chest_cm numeric,
  hips_cm numeric,
  arm_cm numeric,
  energy_level int check (energy_level is null or (energy_level >= 1 and energy_level <= 5)),
  notes text,
  created_at timestamptz not null default now()
);

alter table public.progress_entries enable row level security;

drop policy if exists "progress_entries_select_own_client" on public.progress_entries;
create policy "progress_entries_select_own_client"
on public.progress_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = progress_entries.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "progress_entries_select_assigned_coach" on public.progress_entries;
create policy "progress_entries_select_assigned_coach"
on public.progress_entries
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    join public.coach_profiles coaches on coaches.id = clients.coach_id
    where clients.id = progress_entries.client_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "progress_entries_insert_own_client" on public.progress_entries;
create policy "progress_entries_insert_own_client"
on public.progress_entries
for insert
to authenticated
with check (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = progress_entries.client_id
      and clients.user_id = auth.uid()
  )
);
