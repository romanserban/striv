# Testing Checklist

## Rule

A feature is not marked as done until its main user flow has been tested manually.

After every feature:
- run typecheck
- run lint
- run tests
- open the app
- test the full flow
- update AGENT_CONTEXT.md
- update TODO.md
- update CHANGELOG.md

---

# Done Definition

A feature is done only when:
- it works in the app
- no TypeScript errors
- no lint errors
- relevant tests pass
- no obvious UI breakage
- loading states exist
- error states exist
- empty states exist where needed
- user-facing text uses i18n
- no secrets are committed
- docs are updated

---

# Required Commands

Run if available:

npm run test
npm run typecheck
npm run lint

A feature is not done if these fail.

---

# Unit Testing

## Recommended Testing Stack

- Jest
- React Native Testing Library
- jest-native

---

# What Must Have Unit Tests

## Utilities
- date formatting
- validation helpers
- file/image size helpers
- i18n language helpers

## Validation Schemas
- login form
- signup form
- coach profile form
- client profile form
- workout form
- progress entry form
- scheduled session form

## Components
- Button
- Input
- Card
- EmptyState
- WorkoutCard
- ExerciseCard
- ClientCard
- SessionCard

## Hooks
- auth hook
- language hook
- theme hook
- workout logging hook if logic-heavy

---

# What Does Not Need Unit Tests Initially

Do not write unit tests for:
- every screen
- every style
- simple layout wrappers
- Supabase itself
- navigation internals

---

# Manual Flow Tests

## Authentication
- user can sign up
- user can log in
- user can log out
- forgot password screen opens
- coach redirects to coach dashboard
- client redirects to client dashboard

## Coach / Client Connection
- coach can create profile
- coach has invite code
- client can enter invite code
- client links to coach
- coach sees client in client list
- client sees assigned coach

## Workout Builder
- coach can create workout
- coach can add exercise
- coach can edit sets/reps/rest/notes
- coach can save workout
- coach can edit workout
- coach can duplicate workout

## Workout Assignment
- coach can assign workout to client
- coach can select date
- client sees assigned workout
- workout has correct status

## Workout Logging
- client can start workout
- client can log sets
- client can enter reps and weight
- client can complete workout
- coach can view completed workout

## Progress
- client can log weight
- client can log measurements
- client can upload photo
- photo is compressed
- photo is private
- coach can view progress

## Chat
- coach can start a conversation with an assigned client
- client can open the assigned coach conversation
- coach can send message
- client can send message
- messages appear in order
- realtime message updates appear without leaving the thread
- conversation persists after refresh

## Calendar
- coach can create session
- coach can reschedule session
- coach can cancel session
- client can view session
- client cannot edit session
- coach calendar shows assigned workouts
- client calendar shows assigned workouts

## i18n
- app works in English
- app works in Romanian
- language can be changed in settings
- no hardcoded visible text

## Security
- client cannot access another client’s data
- coach cannot access unrelated clients
- progress photos are private
- no service role key is exposed
- no secrets are committed

---

# Final MVP QA

Before MVP launch:
- test fresh coach account
- test fresh client account
- test full coach-client lifecycle
- test Romanian language
- test English language
- test image upload
- test chat
- test calendar
- test logout/login persistence
- test on iOS simulator
- test on Android emulator
