# Changelog

## 2026-05-15

### Added
- Expo React Native TypeScript app foundation.
- Expo Router route groups for auth, coach, and client flows.
- NativeWind, Supabase client, TanStack Query provider, Zustand store, and i18n setup.
- Theme token files for colors, spacing, radius, typography, and shadows.
- Reusable UI components: Button, Card, Input, Screen, EmptyState, LoadingSkeleton.
- Placeholder auth, coach, and client screens.
- Jest and React Native Testing Library setup with a Button component test.
- Supabase Auth service functions for login, signup, password reset, profile lookup, profile upsert, and logout.
- React Hook Form and Zod auth forms for login, signup, forgot password, and role selection.
- Zustand auth session/profile store with auth bootstrap listener.
- Role-based redirects for coach and client entry points.
- Logout actions on coach settings and client profile screens.
- Auth validation schema tests.
- Initial Supabase migration for auth/profile tables, role-specific profile tables, invite codes, updated-at triggers, Auth user profile creation, and RLS policies.
- Coach profile editing for full name, bio, specialty, and invite code display.
- Client profile editing for full name, goal, training level, height, and starting weight.
- Profile service functions and profile validation schema tests.
- Invite-code RPC migration for client coach connection, assigned coach lookup, and assigned client list.
- Client invite-code join form and assigned coach display.
- Coach connected-client list.
- Exercise table migration with RLS for global and coach-owned custom exercises.
- Exercise service, validation schema, schema tests, and basic coach exercise list/create UI.
- Workout template migration with RLS, service functions, validation schema/tests, and basic coach template create/list UI.
- Added coach flow for selecting a workout template and adding exercises with set/rep/rest targets.
- Added coach workout template edit, duplicate, and delete actions.
- Added assigned workout migration, assignment service/schema/tests, coach assignment flow, and client assigned-workout list on Today.
- Added progress entries migration/RLS, progress service/schema/tests, and client progress entry form/history list.
- Added private progress photo storage/table migration, upload service, image picker dependency, and client photo upload/list UI.
- Added workout log migration/service and client start/complete workout actions with coach-visible assignment status.
- Added client workout detail screen with set-level actual reps and weight logging.
- Local demo user seed script for one coach and one connected client.
- Added chat migration with conversation/message tables, RLS, realtime publication setup, and guarded get-or-create conversation RPC.
- Added message service, chat validation schema/test, reusable message bubble, shared chat thread UI, and coach/client chat screens.
- Added scheduled session migration with RLS, calendar service, session validation schema/test, and coach/client calendar screens.
- Added coach session create, reschedule, cancel flows plus calendar views for sessions and assigned workouts.
- Added notification migration for push tokens and notification events with RLS.
- Added Expo push notification permission/token service, reusable registration card, and notification payload builders for workout assignments, messages, and session reminders.
- Added notification utility tests.
- Added reusable retryable error state and applied query error handling across Today, Clients, Workouts, Progress, Chat, and Calendar screens.
- Added guards that disable context-dependent actions until required profile/client/template data is loaded.
- Added ErrorState component tests.
- Tightened date/time validation for workout assignments and scheduled sessions.
- Exposed missing workout form fields for media URL, tempo, and notes.
- Added locale parity test for English and Romanian translation keys.
- Added translated status labels and a reusable StatusBadge for workout and session states.
- Clarified `.env.example` so the Supabase service-role key is marked local-script-only.
- Aligned Expo notification dependencies with Expo SDK 54 and completed final automated QA.

### Notes
- Supabase environment variables are documented in `.env.example` only.
- npm audit currently reports dependency vulnerabilities from installed packages.
- Auth profile creation requires the `profiles` table and RLS policies to be applied in Supabase.
- Apply all migrations in `supabase/migrations` before manually testing real signup/login/profile/invite flows.
- Push token registration requires a physical device and an EAS project ID; notification event delivery is prepared for future server-side dispatch.

### Fixed
- Downgraded the project from Expo SDK 55 to SDK 54 so it can run with the App Store Expo Go app.
- Aligned Expo, React Native, React, React Navigation, Jest, Reanimated, Worklets, SVG, and Expo peer package versions for SDK 54.
- Updated tab icon props for the installed Lucide React Native typings.
- Fixed signup onboarding so role selection is shown before the signup form.

## Initial Setup

### Added
- Project planning
- MVP specification
- Documentation structure
- Feature roadmap
- Technical stack definition
- Design direction
- Database planning
- Testing strategy

### Notes
- No implementation yet.
