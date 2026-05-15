drop policy if exists "profiles_select_assigned_coach" on public.profiles;
create policy "profiles_select_assigned_coach"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    join public.coach_profiles coaches on coaches.id = clients.coach_id
    where clients.user_id = profiles.id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "profiles_select_assigned_client" on public.profiles;
create policy "profiles_select_assigned_client"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    join public.coach_profiles coaches on coaches.id = clients.coach_id
    where coaches.user_id = profiles.id
      and clients.user_id = auth.uid()
  )
);

create or replace function public.join_coach_by_invite_code(invite_code_input text)
returns table (
  coach_profile_id uuid,
  coach_user_id uuid,
  coach_full_name text,
  invite_code text
)
security definer
set search_path = public
language plpgsql
as $$
declare
  selected_coach public.coach_profiles%rowtype;
begin
  select *
  into selected_coach
  from public.coach_profiles
  where coach_profiles.invite_code = upper(trim(invite_code_input))
  limit 1;

  if selected_coach.id is null then
    raise exception 'Invalid invite code';
  end if;

  update public.client_profiles
  set coach_id = selected_coach.id
  where user_id = auth.uid();

  if not found then
    raise exception 'Client profile not found';
  end if;

  return query
  select
    selected_coach.id,
    selected_coach.user_id,
    profiles.full_name,
    selected_coach.invite_code
  from public.profiles
  where profiles.id = selected_coach.user_id;
end;
$$;

create or replace function public.get_assigned_coach()
returns table (
  coach_profile_id uuid,
  coach_user_id uuid,
  coach_full_name text,
  invite_code text
)
security definer
set search_path = public
language sql
stable
as $$
  select
    coaches.id,
    coaches.user_id,
    profiles.full_name,
    coaches.invite_code
  from public.client_profiles clients
  join public.coach_profiles coaches on coaches.id = clients.coach_id
  join public.profiles profiles on profiles.id = coaches.user_id
  where clients.user_id = auth.uid()
  limit 1;
$$;

create or replace function public.get_assigned_clients()
returns table (
  client_profile_id uuid,
  client_user_id uuid,
  client_full_name text,
  goal text,
  training_level text
)
security definer
set search_path = public
language sql
stable
as $$
  select
    clients.id,
    clients.user_id,
    profiles.full_name,
    clients.goal,
    clients.training_level
  from public.coach_profiles coaches
  join public.client_profiles clients on clients.coach_id = coaches.id
  join public.profiles profiles on profiles.id = clients.user_id
  where coaches.user_id = auth.uid()
  order by profiles.full_name asc;
$$;
