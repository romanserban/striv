create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  assigned_workout_id uuid not null references public.assigned_workouts(id) on delete cascade,
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  started_at timestamptz,
  completed_at timestamptz,
  client_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.workout_set_logs (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  set_number int not null,
  actual_reps int,
  actual_weight numeric,
  completed boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.workout_logs enable row level security;
alter table public.workout_set_logs enable row level security;

drop policy if exists "assigned_workouts_update_own_client" on public.assigned_workouts;
create policy "assigned_workouts_update_own_client"
on public.assigned_workouts
for update
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = assigned_workouts.client_id
      and clients.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = assigned_workouts.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "workout_logs_select_own_client" on public.workout_logs;
create policy "workout_logs_select_own_client"
on public.workout_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = workout_logs.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "workout_logs_select_assigned_coach" on public.workout_logs;
create policy "workout_logs_select_assigned_coach"
on public.workout_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.assigned_workouts assigned
    join public.coach_profiles coaches on coaches.id = assigned.coach_id
    where assigned.id = workout_logs.assigned_workout_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_logs_insert_own_client" on public.workout_logs;
create policy "workout_logs_insert_own_client"
on public.workout_logs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = workout_logs.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "workout_logs_update_own_client" on public.workout_logs;
create policy "workout_logs_update_own_client"
on public.workout_logs
for update
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = workout_logs.client_id
      and clients.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = workout_logs.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "workout_set_logs_select_own_log" on public.workout_set_logs;
create policy "workout_set_logs_select_own_log"
on public.workout_set_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.workout_logs logs
    where logs.id = workout_set_logs.workout_log_id
  )
);

drop policy if exists "workout_set_logs_insert_own_client" on public.workout_set_logs;
create policy "workout_set_logs_insert_own_client"
on public.workout_set_logs
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workout_logs logs
    join public.client_profiles clients on clients.id = logs.client_id
    where logs.id = workout_set_logs.workout_log_id
      and clients.user_id = auth.uid()
  )
);
