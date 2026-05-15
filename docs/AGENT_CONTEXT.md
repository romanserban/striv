# Agent Context

## Project Name
Striv

## Current Status
Expo React Native TypeScript foundation has been scaffolded, aligned to Expo SDK 54 for Expo Go compatibility, includes the first Supabase Auth flow implementation, has auth/profile/exercise/workout/assignment/logging/progress database migrations, includes coach/client profile editing screens, supports invite-code coach/client connections, has a basic coach exercise library, supports workout templates with exercises, supports assigning workouts to clients, has client workout start/complete plus set-level workout logging, and includes basic client progress tracking with progress photo upload.

---

# Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind
- Supabase
- TanStack Query
- Zustand
- i18next

---

# Completed Features

- [x] Project setup
- [x] Authentication
- [x] Role-based onboarding
- [x] Coach profile
- [x] Client profile
- [x] Invite code system
- [x] Exercise library
- [x] Workout builder
- [x] Workout assignment
- [x] Workout logging
- [x] Progress tracking
- [x] Progress photos
- [x] Chat
- [x] Calendar
- [ ] Notifications
- [ ] Settings
- [x] i18n
- [x] Testing setup

---

# Current Branch

main

---

# Last Completed Work

Calendar foundation completed on 2026-05-15.

---

# Important Implementation Notes

- Use Expo.
- Use TypeScript.
- Use Supabase.
- Use Expo Router.
- Use NativeWind.
- Use TanStack Query for server state.
- Use Zustand only for auth/theme/language/temporary UI state.
- Use i18n keys for all user-facing text.
- Use theme tokens for colors, spacing, radius, shadows, and typography.
- Use service files for Supabase queries.
- Dark mode first.
- Romanian and English support required from start.
- Environment variables are prepared in `.env.example`; real values must stay out of Git.
- Supabase client lives in `lib/supabase.ts`; UI components should call services/hooks, not Supabase directly.
- Current scaffold uses Expo Router route groups for auth, coach, and client tabs.
- The project uses Expo SDK 54 because the App Store Expo Go app may not run SDK 55 projects during the SDK 55 transition period.
- Auth UI uses React Hook Form and Zod schemas.
- Auth screens call service functions in `services/auth.ts`; Supabase is not called directly from UI components.
- Signup attempts to create/update a `profiles` row after Supabase Auth signup.
- `supabase/migrations/202605150001_create_profiles.sql` creates `profiles`, `coach_profiles`, `client_profiles`, updated-at triggers, an Auth user profile trigger, invite code generation, and initial RLS policies.
- The Auth user trigger creates the base profile and role-specific profile from signup metadata, so email-confirmation projects do not need an immediate client-side session to create profiles.
- Coach settings can update full name, bio, and specialty and displays the generated invite code.
- Client profile can update full name, goal, training level, height, and starting weight.
- Profile screens use `services/profiles.ts`; Supabase calls stay out of UI components.
- `supabase/migrations/202605150002_invite_connections.sql` adds RPCs for joining a coach, reading the assigned coach, and reading assigned clients.
- Client profile includes invite-code join and assigned coach display.
- Coach clients screen lists connected clients.
- `supabase/migrations/202605150003_create_exercises.sql` creates the exercises table and RLS for global and coach custom exercises.
- Coach Workouts tab currently hosts the basic exercise library list/create flow; workout builder is not implemented yet.
- `supabase/migrations/202605150004_create_workout_templates.sql` creates workout template tables and RLS.
- Coach Workouts tab supports creating/listing workout templates, selecting a template, and adding exercises with sets/reps/rest targets.
- Coach Workouts tab supports editing, duplicating, and deleting workout templates.
- `supabase/migrations/202605150005_create_assigned_workouts.sql` creates assigned workouts and RLS for coaches/clients.
- Coach Clients tab supports selecting a connected client, selecting a workout template, and assigning it for a scheduled date.
- Client Today tab lists assigned workouts.
- `supabase/migrations/202605150006_create_workout_logs.sql` creates workout logs and set log tables.
- `supabase/migrations/202605150007_workout_set_logging_policies.sql` adds client read access for assigned workout templates/exercises, update access for saved set logs, and the unique index needed for set upserts.
- Client Today tab supports starting and completing assigned workouts.
- Client Today tab links into an assigned workout detail/logging screen.
- Client workout detail supports entering actual reps and actual weight per set and saving each set.
- Coach Clients tab shows assigned workout status.
- `supabase/migrations/202605150008_create_progress_entries.sql` creates progress entries and RLS for clients/coaches.
- Client Progress tab supports logging weight, measurements, energy level, notes, and viewing history.
- `supabase/migrations/202605150009_create_progress_photos.sql` creates private progress photo storage, photo metadata, and storage/table RLS.
- Client Progress tab supports selecting and uploading a progress photo and viewing signed photo thumbnails.
- `supabase/migrations/202605150010_create_chat.sql` creates coach-client conversations, messages, RLS policies, realtime publication setup, and a guarded get-or-create conversation RPC.
- Coach Chat tab supports viewing conversations, starting a conversation from assigned clients, opening a chat thread, sending messages, and receiving realtime message updates.
- Client Chat tab supports opening the assigned coach conversation, sending messages, and receiving realtime message updates.
- `supabase/migrations/202605150011_create_scheduled_sessions.sql` creates scheduled coaching sessions with RLS for coaches and clients.
- Coach Calendar tab supports creating sessions for connected clients, rescheduling sessions, cancelling sessions, and viewing assigned workouts.
- Client Calendar tab supports viewing scheduled coaching sessions and assigned workouts.

---

# Known Issues

- npm audit reports 9 dependency vulnerabilities from the initial install; no `npm audit fix --force` was run because it may introduce breaking changes.
- `npx expo start --clear --localhost` was started briefly and did not crash, but it did not print a QR code before being stopped; close any already-running Expo CLI terminals before starting again.
- Auth/profile/invite flows require applying all migrations in `supabase/migrations` to the Supabase project.
- The full auth flow has not been manually tested against a real Supabase project in this session.
- Chat requires applying `supabase/migrations/202605150010_create_chat.sql`; realtime behavior still needs manual testing against a real Supabase project.
- Calendar requires applying `supabase/migrations/202605150011_create_scheduled_sessions.sql`; session flows still need manual testing against a real Supabase project.

---

# Next Recommended Task

Start notifications foundation: notification permission, push token storage, and notification service preparation.

---

# Recently Changed Files

- docs/PROJECT_BRIEF.md
- docs/MVP_SPEC.md
- docs/AGENT_CONTEXT.md
- docs/TODO.md
- docs/CHANGELOG.md
- docs/AGENT_RULES.md
- docs/UI_GUIDELINES.md
- docs/DB_SCHEMA.md
- docs/API_RULES.md
- docs/TESTING_CHECKLIST.md
- package.json
- package-lock.json
- app/
- components/
- features/
- hooks/
- i18n/
- lib/
- locales/
- services/
- store/
- theme/
- types/
- utils/
- __tests__/
- expo-env.d.ts
- features/auth/
- services/auth.ts
- store/authStore.ts
- hooks/useAuthBootstrap.ts
- types/profile.ts
- supabase/migrations/202605150001_create_profiles.sql
- services/profiles.ts
- features/settings/profileSchemas.ts
- types/roleProfiles.ts
- supabase/migrations/202605150002_invite_connections.sql
- supabase/migrations/202605150003_create_exercises.sql
- services/exercises.ts
- features/workouts/exerciseSchemas.ts
- types/exercise.ts
- supabase/migrations/202605150004_create_workout_templates.sql
- services/workouts.ts
- features/workouts/workoutSchemas.ts
- types/workout.ts
- supabase/migrations/202605150005_create_assigned_workouts.sql
- services/assignments.ts
- features/workouts/assignmentSchemas.ts
- types/assignedWorkout.ts
- supabase/migrations/202605150006_create_workout_logs.sql
- supabase/migrations/202605150007_workout_set_logging_policies.sql
- services/workoutLogs.ts
- types/workoutLog.ts
- app/(client)/workout/[assignedWorkoutId].tsx
- supabase/migrations/202605150008_create_progress_entries.sql
- services/progress.ts
- features/progress/progressSchemas.ts
- types/progress.ts
- supabase/migrations/202605150009_create_progress_photos.sql
- supabase/migrations/202605150010_create_chat.sql
- services/messages.ts
- types/chat.ts
- features/chat/chatSchemas.ts
- features/chat/ChatThread.tsx
- components/ui/MessageBubble.tsx
- app/(coach)/chat.tsx
- app/(client)/chat.tsx
- __tests__/chatSchemas.test.ts
- supabase/migrations/202605150011_create_scheduled_sessions.sql
- services/calendar.ts
- types/scheduledSession.ts
- features/calendar/sessionSchemas.ts
- app/(coach)/calendar.tsx
- app/(client)/calendar.tsx
- __tests__/sessionSchemas.test.ts

---

# Environment Variables

Required:
- EXPO_PUBLIC_SUPABASE_URL
- EXPO_PUBLIC_SUPABASE_ANON_KEY

Never commit real secret values.

---

# Before Starting Work

Read:
- docs/PROJECT_BRIEF.md
- docs/AGENT_CONTEXT.md
- docs/TODO.md
- docs/AGENT_RULES.md

Read only if relevant:
- docs/MVP_SPEC.md
- docs/UI_GUIDELINES.md
- docs/DB_SCHEMA.md
- docs/API_RULES.md
- docs/TESTING_CHECKLIST.md

---

# After Completing Work

Update:
- docs/AGENT_CONTEXT.md
- docs/TODO.md
- docs/CHANGELOG.md

Run if available:
- npm run typecheck
- npm run lint
- npm run test

Commit only working code.
