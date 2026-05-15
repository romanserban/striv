# Agent Context

## Project Name
Striv

## Current Status
Expo React Native TypeScript foundation has been scaffolded, aligned to Expo SDK 54 for Expo Go compatibility, includes the first Supabase Auth flow implementation, has auth/profile/exercise/workout/assignment/logging database migrations, includes coach/client profile editing screens, supports invite-code coach/client connections, has a basic coach exercise library, supports workout templates with exercises, supports assigning workouts to clients, and has basic workout start/complete logging.

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
- [ ] Workout logging
- [ ] Progress tracking
- [ ] Progress photos
- [ ] Chat
- [ ] Calendar
- [ ] Notifications
- [ ] Settings
- [x] i18n
- [x] Testing setup

---

# Current Branch

main

---

# Last Completed Work

Workout logging foundation completed on 2026-05-15.

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
- Client Today tab supports starting and completing assigned workouts.
- Coach Clients tab shows assigned workout status.

---

# Known Issues

- npm audit reports 9 dependency vulnerabilities from the initial install; no `npm audit fix --force` was run because it may introduce breaking changes.
- `npx expo start --clear --localhost` was started briefly and did not crash, but it did not print a QR code before being stopped; close any already-running Expo CLI terminals before starting again.
- Auth/profile/invite flows require applying all migrations in `supabase/migrations` to the Supabase project.
- The full auth flow has not been manually tested against a real Supabase project in this session.

---

# Next Recommended Task

Implement set-level workout logging for actual reps and weight.

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
- services/workoutLogs.ts
- types/workoutLog.ts

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
