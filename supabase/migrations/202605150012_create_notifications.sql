create table if not exists public.push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  token text not null,
  platform text not null default 'unknown' check (platform in ('ios', 'android', 'web', 'unknown')),
  device_name text,
  project_id text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);

create table if not exists public.notification_events (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('workout_assigned', 'message', 'session_reminder')),
  title text not null,
  body text not null,
  metadata jsonb not null default '{}'::jsonb,
  delivery_status text not null default 'queued' check (delivery_status in ('queued', 'sent', 'failed', 'skipped')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_push_tokens_updated_at on public.push_tokens;
create trigger set_push_tokens_updated_at
before update on public.push_tokens
for each row execute function public.set_updated_at();

drop trigger if exists set_notification_events_updated_at on public.notification_events;
create trigger set_notification_events_updated_at
before update on public.notification_events
for each row execute function public.set_updated_at();

create index if not exists push_tokens_user_id_idx on public.push_tokens(user_id);
create index if not exists notification_events_recipient_id_idx on public.notification_events(recipient_id);
create index if not exists notification_events_type_idx on public.notification_events(type);
create index if not exists notification_events_delivery_status_idx on public.notification_events(delivery_status);
create index if not exists notification_events_scheduled_for_idx on public.notification_events(scheduled_for);

alter table public.push_tokens enable row level security;
alter table public.notification_events enable row level security;

drop policy if exists "push_tokens_select_own" on public.push_tokens;
create policy "push_tokens_select_own"
on public.push_tokens
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "push_tokens_insert_own" on public.push_tokens;
create policy "push_tokens_insert_own"
on public.push_tokens
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "push_tokens_update_own" on public.push_tokens;
create policy "push_tokens_update_own"
on public.push_tokens
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "push_tokens_delete_own" on public.push_tokens;
create policy "push_tokens_delete_own"
on public.push_tokens
for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "notification_events_select_recipient" on public.notification_events;
create policy "notification_events_select_recipient"
on public.notification_events
for select
to authenticated
using (recipient_id = auth.uid());

