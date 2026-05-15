create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coach_profiles(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workout_template_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_template_id uuid not null references public.workout_templates(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id) on delete restrict,
  order_index int not null default 0,
  sets int not null default 3,
  reps text not null,
  target_weight text,
  rest_seconds int,
  tempo text,
  notes text
);

drop trigger if exists set_workout_templates_updated_at on public.workout_templates;
create trigger set_workout_templates_updated_at
before update on public.workout_templates
for each row execute function public.set_updated_at();

alter table public.workout_templates enable row level security;
alter table public.workout_template_exercises enable row level security;

drop policy if exists "workout_templates_select_own" on public.workout_templates;
create policy "workout_templates_select_own"
on public.workout_templates
for select
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = workout_templates.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_templates_insert_own" on public.workout_templates;
create policy "workout_templates_insert_own"
on public.workout_templates
for insert
to authenticated
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = workout_templates.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_templates_update_own" on public.workout_templates;
create policy "workout_templates_update_own"
on public.workout_templates
for update
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = workout_templates.coach_id
      and coaches.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = workout_templates.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_templates_delete_own" on public.workout_templates;
create policy "workout_templates_delete_own"
on public.workout_templates
for delete
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = workout_templates.coach_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_template_exercises_select_own" on public.workout_template_exercises;
create policy "workout_template_exercises_select_own"
on public.workout_template_exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.workout_templates templates
    join public.coach_profiles coaches on coaches.id = templates.coach_id
    where templates.id = workout_template_exercises.workout_template_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_template_exercises_insert_own" on public.workout_template_exercises;
create policy "workout_template_exercises_insert_own"
on public.workout_template_exercises
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workout_templates templates
    join public.coach_profiles coaches on coaches.id = templates.coach_id
    where templates.id = workout_template_exercises.workout_template_id
      and coaches.user_id = auth.uid()
  )
);
