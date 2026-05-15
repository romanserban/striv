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

### Notes
- Supabase environment variables are documented in `.env.example` only.
- npm audit currently reports dependency vulnerabilities from installed packages.
- Auth profile creation requires the `profiles` table and RLS policies to be applied in Supabase.
- Apply all migrations in `supabase/migrations` before manually testing real signup/login/profile/invite flows.

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
