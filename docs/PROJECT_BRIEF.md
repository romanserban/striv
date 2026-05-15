# Project Brief

## Project Name
Striv

## Description
Striv is a React Native fitness coaching app for fitness instructors and their clients.

The app helps coaches manage clients, assign workouts, track progress, communicate with clients, and schedule coaching sessions.

The app helps clients complete workouts, log progress, upload progress photos, communicate with their coach, and view scheduled sessions.

---

# MVP Goal

Build a simple, production-ready MVP that solves the core coaching workflow:

1. Coach creates account.
2. Client creates account.
3. Client connects to coach using invite code.
4. Coach creates workout plan.
5. Coach assigns workout to client.
6. Client completes workout.
7. Coach tracks progress.
8. Coach and client communicate.
9. Coach schedules sessions.

Do not overbuild.

---

# Tech Stack

## Mobile App
- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind

## Backend
- Supabase
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Realtime

## State Management
- TanStack Query for server state
- Zustand for local/global UI state

## Forms
- React Hook Form
- Zod

## Internationalization
- i18next
- react-i18next
- expo-localization

## Testing
- Jest
- React Native Testing Library
- jest-native

---

# Core MVP Features

- Authentication
- Coach/client roles
- Coach profile
- Client profile
- Invite code system
- Exercise library
- Workout builder
- Workout assignment
- Workout logging
- Progress tracking
- Progress photos
- Coach-client chat
- Calendar/scheduling
- Romanian and English language support
- Push notification preparation

---

# Design Direction

The app should feel:
- premium
- clean
- modern
- professional
- motivating
- fast

Design style:
- dark mode first
- card-based layout
- large tap targets
- clear typography
- subtle animations only

---

# Main Rules

- Build one feature at a time.
- Use TypeScript everywhere.
- Use reusable components.
- Use i18n keys for all visible text.
- Use theme tokens for all colors, spacing, typography, radius, and shadows.
- Do not hardcode secrets.
- Do not place Supabase queries directly inside UI components.
- Update documentation after every completed feature.
