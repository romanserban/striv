# API Rules

## Purpose

This file defines how the app should interact with Supabase and structure backend/service logic.

---

# Supabase Rules

Do not place Supabase queries directly inside UI components.

Use service files:

/services/auth.ts
/services/profiles.ts
/services/clients.ts
/services/exercises.ts
/services/workouts.ts
/services/progress.ts
/services/messages.ts
/services/calendar.ts
/services/storage.ts
/services/notifications.ts

---

# Query Rules

Use TanStack Query for:
- fetching server data
- caching
- refetching
- invalidation
- loading states
- error states

Use mutations for:
- creating records
- updating records
- deleting records
- uploading files

---

# State Rules

Use Zustand only for:
- auth session
- theme
- language
- temporary UI state

Do not store server data in Zustand.

Server data belongs in TanStack Query.

---

# Auth Rules

Use Supabase Auth.

After signup:
- create profile row
- store role
- redirect based on role

Never expose:
- service role key
- private API keys
- secrets

---

# Service Function Rules

Each service function should:
- accept typed input
- return typed output
- throw clear errors
- not include UI logic
- not include navigation logic

Example:
createWorkoutTemplate(input)
assignWorkoutToClient(input)
sendMessage(input)

---

# Error Handling

All async operations must:
- handle loading
- handle errors
- return user-friendly messages
- avoid silent failures

UI components should display:
- loading state
- empty state
- error state

---

# Storage Rules

Progress photos:
- compress before upload
- max 2 MB per image
- store in private Supabase bucket
- store image path in database
- use signed URLs for viewing
- allow deletion

Never store base64 images in database.

---

# Realtime Rules

Use Supabase Realtime for:
- chat messages
- optional workout status updates

Do not overuse realtime for everything.

---

# Caching Rules

Invalidate related queries after mutations.

Examples:
After assigning workout:
- invalidate client assigned workouts
- invalidate coach client detail

After sending message:
- invalidate messages
- update chat list

After progress entry:
- invalidate progress history
- invalidate coach client progress

---

# Validation

Use Zod schemas for:
- login
- signup
- coach profile
- client profile
- workout template
- progress entry
- scheduled session