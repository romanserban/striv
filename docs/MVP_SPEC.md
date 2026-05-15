# MVP Specification

## Project Name
Striv

## Product Type
Mobile app for fitness coaches and their clients.

## Platforms
- iOS
- Android

Built with:
- React Native
- Expo
- TypeScript

---

# Product Vision

Striv is a fitness coaching app that allows trainers to manage clients, create and assign workout plans, track client progress, communicate with clients, and schedule coaching sessions.

The MVP should be focused, simple, and reliable.

The app should not try to compete with every fitness app feature at launch. The goal is to solve the core coach-client workflow very well.

---

# Target Users

## Coach
A fitness instructor, personal trainer, online fitness coach, bodybuilding coach, or wellness coach who manages multiple clients.

## Client
A person coached by a fitness instructor who needs workout plans, progress tracking, communication, and accountability.

---

# Main MVP Problem

Coaches need a simple way to:
- assign workouts
- monitor client adherence
- see client progress
- communicate efficiently
- schedule sessions

Clients need a simple way to:
- see what they need to do today
- complete workouts
- log progress
- send updates to coach
- stay accountable

---

# MVP Scope

## Included in MVP
- Authentication
- Coach/client roles
- Coach profile
- Client profile
- Invite code system
- Exercise library
- Workout builder
- Workout assignment
- Client workout logging
- Progress tracking
- Progress photos
- Coach-client chat
- Calendar/scheduling
- Romanian and English support
- Basic push notification setup
- Testing checklist
- Basic unit tests for utilities, validation, and reusable components

## Not Included in MVP
- AI workout generation
- AI meal plans
- Full nutrition tracking
- Calorie/macro tracking
- Wearable integration
- Apple Health integration
- Google Fit integration
- Payments
- Marketplace
- Social feed
- Video calls
- Livestream classes
- Complex analytics
- Gamification
- Admin web dashboard

---

# User Roles

## Coach
Can:
- create profile
- invite clients
- view clients
- create workouts
- assign workouts
- review workout completion
- review progress
- chat with clients
- create scheduled sessions

## Client
Can:
- create profile
- join coach using invite code
- view assigned workouts
- complete workouts
- log body progress
- upload progress photos
- chat with coach
- view scheduled sessions

---

# Authentication

## Requirements
- Email/password signup
- Email/password login
- Forgot password
- Logout
- Role selection during onboarding
- Role-based redirects

## Roles
- coach
- client

## Auth Flow
1. User signs up.
2. User selects role.
3. App creates profile.
4. Coach is redirected to coach dashboard.
5. Client is redirected to client onboarding.
6. Returning users are redirected based on role.

---

# Coach Onboarding

Coach must enter:
- full name
- profile photo optional
- bio optional
- specialty optional

Coach gets:
- unique invite code
- ability to share invite code with clients

---

# Client Onboarding

Client must enter:
- full name
- goal
- training level
- height optional
- starting weight optional
- coach invite code

Client is linked to one coach in MVP.

---

# Invite Code System

## Requirements
- Each coach has one unique invite code.
- Client enters invite code during onboarding.
- Client becomes linked to that coach.
- Coach sees client in client list.
- Client sees assigned coach.

## MVP Rule
One client belongs to one coach.

---

# Exercise Library

## Exercise Fields
- name
- muscle group
- equipment
- instructions
- media URL optional
- is_global
- coach_id nullable

## Requirements
Coach can:
- view global exercises
- search exercises
- filter by muscle group
- create custom exercises
- edit own custom exercises

Client can:
- view exercises included in assigned workouts

## Exercise Visibility
- Global exercises visible to everyone.
- Custom exercises visible only to the coach who created them.
- Clients can see custom exercises only if included in their assigned workout.

---

# Workout Builder

## Workout Template Fields
- name
- description
- coach_id
- created_at

## Workout Exercise Fields
- exercise_id
- order_index
- sets
- reps
- target_weight
- rest_seconds
- tempo
- notes

## Coach Can
- create workout template
- add exercises
- reorder exercises
- define sets
- define reps
- define target weight
- define rest time
- define tempo
- add notes
- edit workout template
- duplicate workout template
- delete workout template

---

# Workout Assignment

Coach can assign a workout template to a client for a specific date.

## Assigned Workout Status
- assigned
- in_progress
- completed
- missed

## Requirements
- Coach selects client.
- Coach selects workout template.
- Coach selects scheduled date.
- Client sees workout on scheduled date.
- Coach sees assigned workouts in client detail.

---

# Client Workout Logging

Client can:
- open today's workout
- view workout details
- view exercise instructions
- mark set as complete
- enter actual reps
- enter actual weight
- add notes
- complete workout

## Workout Log Fields
- assigned_workout_id
- client_id
- started_at
- completed_at
- client_notes

## Set Log Fields
- workout_log_id
- exercise_id
- set_number
- actual_reps
- actual_weight
- completed
- notes

## UX Rule
Workout logging must be extremely fast and easy to use.

Users may use this screen while tired, moving, or in the gym.

Use:
- large buttons
- clear text
- minimal clutter
- fast set completion actions

---

# Progress Tracking

Client can log:
- body weight
- waist measurement
- chest measurement
- hips measurement
- arm measurement
- energy level
- notes
- progress photos

Coach can view:
- client weight history
- measurements history
- progress photos
- adherence summary

## Progress Screen
Show:
- weight chart
- latest measurements
- progress photo gallery
- simple adherence percentage

Do not build complex analytics in MVP.

---

# Progress Photos

## Requirements
- Client can upload progress photos.
- Photos are compressed before upload.
- Max upload size: 2 MB.
- Target file size: 300–800 KB.
- Photos are stored in Supabase Storage.
- Use private buckets.
- Store only file path/URL in database.
- Do not store base64 images in database.
- Client can delete own photos.
- Coach can view photos only for assigned clients.

## Consent
User must consent to progress photo storage.

---

# Chat

## Requirements
- One conversation per coach-client pair.
- Coach can message client.
- Client can message coach.
- Messages are stored in Supabase.
- Messages appear in chronological order.
- Realtime updates if possible.
- Basic unread indicator optional.

## Message Fields
- conversation_id
- sender_id
- body
- created_at
- read_at nullable

---

# Calendar / Scheduling

## Coach Can
- create coaching session
- reschedule session
- cancel session
- view client calendar
- view upcoming sessions

## Client Can
- view sessions
- view upcoming workouts
- view cancelled sessions
- receive reminders later

## Client Cannot
- create sessions in MVP
- edit sessions in MVP

## Scheduled Session Fields
- coach_id
- client_id
- title
- description
- session_type
- start_time
- end_time
- location
- status

## Session Status
- scheduled
- completed
- cancelled
- missed

---

# Notifications

## MVP Notification Setup
Prepare architecture for:
- workout assigned
- workout reminder
- message received
- session reminder
- session cancelled
- session rescheduled

## MVP Rule
Implement basic push token registration and permission request.

Do not overbuild notification automation in v1.

---

# Internationalization

The app must support multiple languages from the beginning.

Initial languages:
- English: en
- Romanian: ro

## Libraries
- i18next
- react-i18next
- expo-localization

## Requirements
- Detect device language automatically.
- Default to English if unsupported.
- Allow manual language switch in Settings.
- Persist selected language locally.
- All visible UI strings must use translation keys.
- No hardcoded user-facing strings in components.

## Folder Structure
/locales
  /en
    common.json
  /ro
    common.json

/i18n
  index.ts

## Rule
Bad:
<Text>Start Workout</Text>

Good:
<Text>{t("startWorkout")}</Text>

---

# Main Screens

## Public Screens
- Welcome
- Login
- Signup
- Forgot Password
- Choose Role

## Coach Screens
- Coach Dashboard
- Clients List
- Client Detail
- Exercise Library
- Workout Templates
- Create/Edit Workout
- Assign Workout
- Progress Review
- Calendar
- Chat List
- Chat Detail
- Profile
- Settings

## Client Screens
- Today
- Workout Detail
- Exercise Detail
- Workout Logging
- Progress Log
- Progress History
- Progress Photos
- Calendar
- Chat
- Profile
- Settings

---

# Navigation

## Coach Bottom Tabs
- Dashboard
- Clients
- Workouts
- Calendar
- Chat

## Client Bottom Tabs
- Today
- Progress
- Calendar
- Chat
- Profile

---

# Design System

## Style
Premium modern fitness SaaS.

## Theme
Dark mode first.

## Colors
- Background: #0F1115
- Surface: #171A21
- Card: #1E222B
- Primary: #7C5CFF
- Text Primary: #FFFFFF
- Text Secondary: #A0A7B5
- Success: #22C55E
- Error: #EF4444
- Warning: #F59E0B

## Typography
Use Inter font.

## Layout
- Card-based
- Large tap targets
- Consistent spacing
- Clear hierarchy
- Minimal clutter

## Spacing Scale
- 4
- 8
- 12
- 16
- 24
- 32

## Radius
- 16px for regular cards
- 20–24px for main cards and modals

## Components
Create reusable:
- Button
- Card
- Input
- Avatar
- ProgressBar
- BottomTabBar
- ExerciseCard
- WorkoutCard
- ClientCard
- SessionCard
- MessageBubble
- EmptyState
- LoadingSkeleton

---

# Engineering Rules

## General
- Use TypeScript everywhere.
- Keep files small.
- Avoid duplicated logic.
- Avoid giant components.
- Avoid direct Supabase queries inside UI components.
- Use service files.
- Use reusable components.
- Use strict typing.
- Use async/await consistently.

## State
Use TanStack Query for:
- server data
- caching
- loading states
- refetching
- invalidation

Use Zustand only for:
- auth session
- theme
- language
- temporary UI state

Do not store server data in Zustand.

## Forms
Use:
- React Hook Form
- Zod

All forms must:
- validate inputs
- show inline errors
- prevent invalid submissions

## Error Handling
Every async operation must:
- show loading state
- handle errors
- show user-friendly error message

## Security
- Never expose Supabase service role key.
- Never commit `.env`.
- Use Row Level Security.
- Use private storage buckets.
- Validate uploaded file types.
- Do not expose data across unrelated users.

---

# Monetization Notes

Payments are not required in MVP.

Future model:
- monthly subscription per coach
- client access included
- free trial for coaches
- optional premium plan later

Database should not block future monetization.

---

# Legal Notes

MVP should prepare for:
- Terms and Conditions
- Privacy Policy
- GDPR consent
- Health disclaimer
- Progress photo consent
- User data deletion request

Important:
The app stores health-adjacent data, body measurements, photos, and private messages. Privacy and consent matter.

---

# Launch Criteria

MVP is ready when:
- Coach can register.
- Client can register.
- Client can connect to coach.
- Coach can create workout.
- Coach can assign workout.
- Client can complete workout.
- Coach can view workout completion.
- Client can log progress.
- Client can upload progress photo.
- Coach can view progress.
- Coach and client can chat.
- Coach can schedule session.
- Client can view schedule.
- Romanian and English switching works.
- Basic tests pass.
- No secrets are exposed.