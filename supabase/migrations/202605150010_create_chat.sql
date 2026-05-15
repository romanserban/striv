create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.coach_profiles(id) on delete cascade,
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (coach_id, client_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant"
on public.conversations
for select
to authenticated
using (
  exists (
    select 1
    from public.coach_profiles coaches
    where coaches.id = conversations.coach_id
      and coaches.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.client_profiles clients
    where clients.id = conversations.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "messages_select_participant" on public.messages;
create policy "messages_select_participant"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations conversations
    left join public.coach_profiles coaches on coaches.id = conversations.coach_id
    left join public.client_profiles clients on clients.id = conversations.client_id
    where conversations.id = messages.conversation_id
      and (coaches.user_id = auth.uid() or clients.user_id = auth.uid())
  )
);

drop policy if exists "messages_insert_participant" on public.messages;
create policy "messages_insert_participant"
on public.messages
for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversations conversations
    left join public.coach_profiles coaches on coaches.id = conversations.coach_id
    left join public.client_profiles clients on clients.id = conversations.client_id
    where conversations.id = messages.conversation_id
      and (coaches.user_id = auth.uid() or clients.user_id = auth.uid())
  )
);

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  )
  and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;

create or replace function public.get_or_create_conversation(client_profile_id uuid)
returns uuid
security definer
set search_path = public
language plpgsql
as $$
declare
  active_coach_id uuid;
  conversation_id uuid;
begin
  select id
  into active_coach_id
  from public.coach_profiles
  where user_id = auth.uid()
  limit 1;

  if active_coach_id is null then
    select coach_id
    into active_coach_id
    from public.client_profiles
    where id = client_profile_id
      and user_id = auth.uid()
    limit 1;
  end if;

  if active_coach_id is null then
    raise exception 'Coach connection not found';
  end if;

  if not exists (
    select 1
    from public.client_profiles clients
    where clients.id = client_profile_id
      and clients.coach_id = active_coach_id
      and (
        clients.user_id = auth.uid()
        or exists (
          select 1
          from public.coach_profiles coaches
          where coaches.id = active_coach_id
            and coaches.user_id = auth.uid()
        )
      )
  ) then
    raise exception 'Client is not connected to this coach';
  end if;

  insert into public.conversations (coach_id, client_id)
  values (active_coach_id, client_profile_id)
  on conflict (coach_id, client_id) do update set coach_id = excluded.coach_id
  returning id into conversation_id;

  return conversation_id;
end;
$$;
