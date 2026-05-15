create table if not exists public.scheduled_sessions (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coach_profiles(id) on delete cascade,
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  title text not null,
  description text,
  session_type text,
  start_time timestamptz not null,
  end_time timestamptz not null,
  location text,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled', 'missed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scheduled_sessions_valid_time check (end_time > start_time)
);

drop trigger if exists set_scheduled_sessions_updated_at on public.scheduled_sessions;
create trigger set_scheduled_sessions_updated_at
before update on public.scheduled_sessions
for each row execute function public.set_updated_at();

alter table public.scheduled_sessions enable row level security;

drop policy if exists "scheduled_sessions_select_own_coach" on public.scheduled_sessions;
create policy "scheduled_sessions_select_own_coach"
on public.scheduled_sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = scheduled_sessions.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "scheduled_sessions_select_own_client" on public.scheduled_sessions;
create policy "scheduled_sessions_select_own_client"
on public.scheduled_sessions
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = scheduled_sessions.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "scheduled_sessions_insert_own_coach" on public.scheduled_sessions;
create policy "scheduled_sessions_insert_own_coach"
on public.scheduled_sessions
for insert
to authenticated
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    join public.client_profiles clients on clients.coach_id = coaches.id
    where coaches.id = scheduled_sessions.coach_id
      and clients.id = scheduled_sessions.client_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "scheduled_sessions_update_own_coach" on public.scheduled_sessions;
create policy "scheduled_sessions_update_own_coach"
on public.scheduled_sessions
for update
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = scheduled_sessions.coach_id
      and coaches.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = scheduled_sessions.coach_id
      and coaches.user_id = auth.uid()
  )
);
