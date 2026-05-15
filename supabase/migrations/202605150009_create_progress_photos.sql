insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do update set public = false;

create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.client_profiles(id) on delete cascade,
  image_path text not null,
  photo_type text,
  created_at timestamptz not null default now()
);

alter table public.progress_photos enable row level security;

drop policy if exists "progress_photos_select_own_client" on public.progress_photos;
create policy "progress_photos_select_own_client"
on public.progress_photos
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = progress_photos.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "progress_photos_select_assigned_coach" on public.progress_photos;
create policy "progress_photos_select_assigned_coach"
on public.progress_photos
for select
to authenticated
using (
  exists (
    select 1
    from public.client_profiles clients
    join public.coach_profiles coaches on coaches.id = clients.coach_id
    where clients.id = progress_photos.client_id
      and coaches.user_id = auth.uid()
  )
);

drop policy if exists "progress_photos_insert_own_client" on public.progress_photos;
create policy "progress_photos_insert_own_client"
on public.progress_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.client_profiles clients
    where clients.id = progress_photos.client_id
      and clients.user_id = auth.uid()
  )
);

drop policy if exists "progress_photo_objects_select_own_client" on storage.objects;
create policy "progress_photo_objects_select_own_client"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'progress-photos'
  and exists (
    select 1
    from public.client_profiles clients
    where clients.user_id = auth.uid()
      and (storage.foldername(name))[1] = clients.id::text
  )
);

drop policy if exists "progress_photo_objects_select_assigned_coach" on storage.objects;
create policy "progress_photo_objects_select_assigned_coach"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'progress-photos'
  and exists (
    select 1
    from public.client_profiles clients
    join public.coach_profiles coaches on coaches.id = clients.coach_id
    where coaches.user_id = auth.uid()
      and (storage.foldername(name))[1] = clients.id::text
  )
);

drop policy if exists "progress_photo_objects_insert_own_client" on storage.objects;
create policy "progress_photo_objects_insert_own_client"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'progress-photos'
  and exists (
    select 1
    from public.client_profiles clients
    where clients.user_id = auth.uid()
      and (storage.foldername(name))[1] = clients.id::text
  )
);
