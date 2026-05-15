create unique index if not exists workout_set_logs_unique_set
on public.workout_set_logs(workout_log_id, exercise_id, set_number);

drop policy if exists "workout_set_logs_select_own_log" on public.workout_set_logs;
create policy "workout_set_logs_select_own_log"
on public.workout_set_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.workout_logs logs
    join public.client_profiles clients on clients.id = logs.client_id
    where logs.id = workout_set_logs.workout_log_id
      and clients.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.workout_logs logs
    join public.assigned_workouts assigned on assigned.id = logs.assigned_workout_id
    join public.coach_profiles coaches on coaches.id = assigned.coach_id
    where logs.id = workout_set_logs.workout_log_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "workout_set_logs_update_own_client" on public.workout_set_logs;
create policy "workout_set_logs_update_own_client"
on public.workout_set_logs
for update
to authenticated
using (
  exists (
    select 1
    from public.workout_logs logs
    join public.client_profiles clients on clients.id = logs.client_id
    where logs.id = workout_set_logs.workout_log_id
      and clients.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workout_logs logs
    join public.client_profiles clients on clients.id = logs.client_id
    where logs.id = workout_set_logs.workout_log_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "workout_templates_select_assigned_client" on public.workout_templates;
create policy "workout_templates_select_assigned_client"
on public.workout_templates
for select
to authenticated
using (
  exists (
    select 1
    from public.assigned_workouts assigned
    join public.client_profiles clients on clients.id = assigned.client_id
    where assigned.workout_template_id = workout_templates.id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "workout_template_exercises_select_assigned_client" on public.workout_template_exercises;
create policy "workout_template_exercises_select_assigned_client"
on public.workout_template_exercises
for select
to authenticated
using (
  exists (
    select 1
    from public.assigned_workouts assigned
    join public.client_profiles clients on clients.id = assigned.client_id
    where assigned.workout_template_id = workout_template_exercises.workout_template_id
      and clients.user_id = auth.uid()
  )
);
