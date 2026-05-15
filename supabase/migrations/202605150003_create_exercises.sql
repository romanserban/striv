create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid references public.coach_profiles(id) on delete cascade,
  name text not null,
  muscle_group text not null,
  equipment text,
  instructions text,
  media_url text,
  is_global boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exercises_scope_check check (
    (is_global = true and coach_id is null)
    or (is_global = false and coach_id is not null)
  )
);

drop trigger if exists set_exercises_updated_at on public.exercises;
create trigger set_exercises_updated_at
before update on public.exercises
for each row execute function public.set_updated_at();

alter table public.exercises enable row level security;

drop policy if exists "exercises_select_global" on public.exercises;
create policy "exercises_select_global"
on public.exercises
for select
to authenticated
using (is_global = true);

drop policy if exists "exercises_select_own_custom" on public.exercises;
create policy "exercises_select_own_custom"
on public.exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = exercises.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "exercises_insert_own_custom" on public.exercises;
create policy "exercises_insert_own_custom"
on public.exercises
for insert
to authenticated
with check (
  is_global = false
  and exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = exercises.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "exercises_update_own_custom" on public.exercises;
create policy "exercises_update_own_custom"
on public.exercises
for update
to authenticated
using (
  is_global = false
  and exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = exercises.coach_id
      and coaches.user_id = auth.uid()
  )
)
with check (
  is_global = false
  and exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = exercises.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "exercises_delete_own_custom" on public.exercises;
create policy "exercises_delete_own_custom"
on public.exercises
for delete
to authenticated
using (
  is_global = false
  and exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = exercises.coach_id
      and coaches.user_id = auth.uid()
  )
);
