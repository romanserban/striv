create table if not exists public.assigned_workouts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coach_profiles(id) on delete cascade,
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  workout_template_id uuid not null references public.workout_templates(id) on delete restrict,
  scheduled_date date not null,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed', 'missed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_assigned_workouts_updated_at on public.assigned_workouts;
create trigger set_assigned_workouts_updated_at
before update on public.assigned_workouts
for each row execute function public.set_updated_at();

alter table public.assigned_workouts enable row level security;

drop policy if exists "assigned_workouts_select_own_coach" on public.assigned_workouts;
create policy "assigned_workouts_select_own_coach"
on public.assigned_workouts
for select
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = assigned_workouts.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "assigned_workouts_select_own_client" on public.assigned_workouts;
create policy "assigned_workouts_select_own_client"
on public.assigned_workouts
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = assigned_workouts.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "assigned_workouts_insert_own_coach" on public.assigned_workouts;
create policy "assigned_workouts_insert_own_coach"
on public.assigned_workouts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    join public.client_profiles clients on clients.coach_id = coaches.id
    where coaches.id = assigned_workouts.coach_id
      and clients.id = assigned_workouts.client_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "assigned_workouts_update_own_coach" on public.assigned_workouts;
create policy "assigned_workouts_update_own_coach"
on public.assigned_workouts
for update
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = assigned_workouts.coach_id
      and coaches.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = assigned_workouts.coach_id
      and coaches.user_id = auth.uid()
  )
);
