# Database Schema

## Database
Use Supabase PostgreSQL.

Use Row Level Security on all user-related tables.

---

# Tables

## profiles

Stores base user information.

Fields:
- id uuid primary key references auth.users(id)
- role text check role in ('coach', 'client')
- full_name text
- avatar_url text nullable
- created_at timestamp default now()
- updated_at timestamp default now()

---

## coach_profiles

Stores coach-specific profile.

Fields:
- id uuid primary key
- user_id uuid references profiles(id)
- bio text nullable
- specialty text nullable
- invite_code text unique
- created_at timestamp default now()
- updated_at timestamp default now()

---

## client_profiles

Stores client-specific profile.

Fields:
- id uuid primary key
- user_id uuid references profiles(id)
- coach_id uuid references coach_profiles(id) nullable
- goal text nullable
- training_level text nullable
- height_cm numeric nullable
- starting_weight_kg numeric nullable
- created_at timestamp default now()
- updated_at timestamp default now()

---

## exercises

Stores global and custom exercises.

Fields:
- id uuid primary key
- coach_id uuid references coach_profiles(id) nullable
- name text not null
- muscle_group text
- equipment text nullable
- instructions text nullable
- media_url text nullable
- is_global boolean default false
- created_at timestamp default now()
- updated_at timestamp default now()

Rules:
- Global exercises visible to all.
- Custom exercises visible only to creator coach.
- Clients can see custom exercise only if included in assigned workout.

---

## workout_templates

Stores reusable workout templates.

Fields:
- id uuid primary key
- coach_id uuid references coach_profiles(id)
- name text not null
- description text nullable
- created_at timestamp default now()
- updated_at timestamp default now()

---

## workout_template_exercises

Stores exercises inside a workout template.

Fields:
- id uuid primary key
- workout_template_id uuid references workout_templates(id)
- exercise_id uuid references exercises(id)
- order_index int
- sets int
- reps text
- target_weight text nullable
- rest_seconds int nullable
- tempo text nullable
- notes text nullable

---

## assigned_workouts

Stores workouts assigned to clients.

Fields:
- id uuid primary key
- coach_id uuid references coach_profiles(id)
- client_id uuid references client_profiles(id)
- workout_template_id uuid references workout_templates(id)
- scheduled_date date
- status text default 'assigned'
- created_at timestamp default now()
- updated_at timestamp default now()

Status:
- assigned
- in_progress
- completed
- missed

---

## workout_logs

Stores completed workout sessions.

Fields:
- id uuid primary key
- assigned_workout_id uuid references assigned_workouts(id)
- client_id uuid references client_profiles(id)
- started_at timestamp nullable
- completed_at timestamp nullable
- client_notes text nullable
- created_at timestamp default now()

---

## workout_set_logs

Stores individual set logs.

Fields:
- id uuid primary key
- workout_log_id uuid references workout_logs(id)
- exercise_id uuid references exercises(id)
- set_number int
- actual_reps int nullable
- actual_weight numeric nullable
- completed boolean default false
- notes text nullable
- created_at timestamp default now()

---

## progress_entries

Stores body progress logs.

Fields:
- id uuid primary key
- client_id uuid references client_profiles(id)
- weight_kg numeric nullable
- waist_cm numeric nullable
- chest_cm numeric nullable
- hips_cm numeric nullable
- arm_cm numeric nullable
- energy_level int nullable
- notes text nullable
- created_at timestamp default now()

---

## progress_photos

Stores progress photo metadata.

Fields:
- id uuid primary key
- client_id uuid references client_profiles(id)
- image_path text not null
- photo_type text nullable
- created_at timestamp default now()

Rules:
- Store file path, not base64.
- Use private bucket.
- Generate signed URLs for viewing.

---

## conversations

Stores one coach-client conversation.

Fields:
- id uuid primary key
- coach_id uuid references coach_profiles(id)
- client_id uuid references client_profiles(id)
- created_at timestamp default now()

Rule:
- One conversation per coach-client pair.

---

## messages

Stores chat messages.

Fields:
- id uuid primary key
- conversation_id uuid references conversations(id)
- sender_id uuid references profiles(id)
- body text not null
- created_at timestamp default now()
- read_at timestamp nullable

---

## scheduled_sessions

Stores coaching sessions.

Fields:
- id uuid primary key
- coach_id uuid references coach_profiles(id)
- client_id uuid references client_profiles(id)
- title text not null
- description text nullable
- session_type text nullable
- start_time timestamp not null
- end_time timestamp not null
- location text nullable
- status text default 'scheduled'
- created_at timestamp default now()
- updated_at timestamp default now()

Status:
- scheduled
- completed
- cancelled
- missed

---

# Storage

## Bucket
progress-photos

Rules:
- private bucket
- max file size 2 MB
- allowed types: image/jpeg, image/png, image/webp
- compress images before upload
- generate signed URLs for viewing

---

# Row Level Security Rules

## General
- Users can access only their own profile.
- Coaches can access only their own clients.
- Clients can access only their own data.
- Coaches can access progress data only for assigned clients.
- Clients can access only their own progress data.
- Conversations are visible only to participants.
- Messages are visible only to participants.
- Progress photos are visible only to the client and assigned coach.

---

# Indexes

Recommended indexes:
- profiles.role
- coach_profiles.user_id
- coach_profiles.invite_code
- client_profiles.user_id
- client_profiles.coach_id
- assigned_workouts.client_id
- assigned_workouts.coach_id
- assigned_workouts.scheduled_date
- workout_logs.assigned_workout_id
- progress_entries.client_id
- progress_photos.client_id
- conversations.coach_id
- conversations.client_id
- messages.conversation_id
- scheduled_sessions.client_id
- scheduled_sessions.coach_id
- scheduled_sessions.start_time