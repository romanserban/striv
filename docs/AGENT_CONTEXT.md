# Agent Context

## Project Name
Striv

## Current Status
Expo React Native TypeScript foundation has been scaffolded and aligned to Expo SDK 54 for Expo Go compatibility.

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
- [ ] Authentication
- [ ] Role-based onboarding
- [ ] Coach profile
- [ ] Client profile
- [ ] Invite code system
- [ ] Exercise library
- [ ] Workout builder
- [ ] Workout assignment
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

App foundation completed on 2026-05-15.

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

---

# Known Issues

- npm audit reports 9 dependency vulnerabilities from the initial install; no `npm audit fix --force` was run because it may introduce breaking changes.
- `npx expo start --clear --localhost` was started briefly and did not crash, but it did not print a QR code before being stopped; close any already-running Expo CLI terminals before starting again.

---

# Next Recommended Task

Build authentication service/forms and role-based redirects using Supabase Auth.

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
