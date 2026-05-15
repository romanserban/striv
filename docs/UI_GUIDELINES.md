# UI Guidelines

## Design Direction

The app should use a premium modern fitness SaaS aesthetic.

The design should feel:
- clean
- minimal
- professional
- motivating
- fast
- trustworthy

Avoid:
- neon gym aesthetics
- cluttered dashboards
- excessive gradients
- excessive animations
- tiny text
- tiny tap targets

---

# Theme

Build dark mode first.

## Recommended Palette

- Background: #0F1115
- Surface: #171A21
- Card: #1E222B
- Primary: #7C5CFF
- Text Primary: #FFFFFF
- Text Secondary: #A0A7B5
- Success: #22C55E
- Error: #EF4444
- Warning: #F59E0B

---

# Typography

Use Inter font.

Typography should be:
- readable
- clean
- consistent
- large enough for gym use

Use:
- large bold headings
- medium section titles
- muted secondary text
- no tiny labels for important actions

---

# Layout Principles

Use:
- card-based layouts
- large tap targets
- consistent spacing
- bottom navigation
- clear visual hierarchy
- minimal clutter

## Spacing Scale

- 4
- 8
- 12
- 16
- 24
- 32

## Border Radius

- 16px for standard cards
- 20–24px for main cards and modals

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

# Core Components

Create reusable components before building screens:

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

# Client Today Screen

This is the most important client screen.

It should show:
- greeting
- today’s workout
- large Start Workout button
- workout duration
- number of exercises
- upcoming session
- latest progress entry

---

# Workout Execution Screen

This screen must be extremely fast and easy to use.

Requirements:
- large buttons
- clear exercise name
- demo image/video area
- set logging table
- complete set button
- next exercise button
- finish workout button

Users may use this screen while tired or sweaty, so avoid small controls.

---

# Coach Dashboard

The coach dashboard should show:
- active clients
- workouts completed today
- missed workouts
- unread messages
- clients needing attention
- quick action to create workout
- quick action to add client

---

# Progress Screen

Keep progress simple.

Show:
- weight chart
- measurements history
- adherence percentage
- progress photos

Do not build complex analytics in MVP.

---

# Calendar Screen

Calendar should show:
- upcoming workouts
- scheduled coaching sessions
- missed sessions
- completed sessions

Coach can create, reschedule, and cancel sessions.

Client can only view sessions in MVP.

---

# Motion

Use subtle motion only:
- screen transitions
- button press feedback
- workout completion animation
- loading skeletons

Avoid heavy animations.

---

# Icons

Use Lucide icons consistently.

Do not mix multiple icon libraries.

---

# Design Tokens

Create centralized design token files:

/theme/colors.ts
/theme/spacing.ts
/theme/radius.ts
/theme/typography.ts
/theme/shadows.ts

Do not hardcode colors, spacing, radius, or typography inside screens.

---

# UI Quality Requirements

The app must include:
- loading states
- empty states
- error states
- form validation states
- haptic feedback for key workout actions
- consistent spacing
- consistent typography
- readable contrast
- large tap targets