# Agent Rules

## Purpose

This file defines how Codex or any AI coding agent should work on this project.

The goal is to keep the codebase clean, avoid unnecessary token usage, and prevent agents from rewriting working code.

---

# Always Read First

Before starting any task, read:

- docs/PROJECT_BRIEF.md
- docs/AGENT_CONTEXT.md
- docs/TODO.md
- docs/AGENT_RULES.md

---

# Read Only If Relevant

Read these only when needed:

- docs/MVP_SPEC.md
- docs/UI_GUIDELINES.md
- docs/DB_SCHEMA.md
- docs/API_RULES.md
- docs/TESTING_CHECKLIST.md

Examples:
- For UI work, read UI_GUIDELINES.md.
- For database work, read DB_SCHEMA.md.
- For Supabase service work, read API_RULES.md.
- For feature validation, read TESTING_CHECKLIST.md.

---

# Token Saving Rules

- Do not scan the entire repository unless necessary.
- Inspect only files relevant to the current task.
- Inspect directly imported files if needed.
- Avoid rewriting working code.
- Prefer small targeted edits.
- Do not paste long explanations.
- Do not regenerate files that are already correct.
- Keep documentation updates concise.
- Work on one feature at a time.

---

# Coding Rules

- Use TypeScript.
- Use reusable components.
- Keep files small.
- Avoid duplicated logic.
- Avoid giant components.
- Avoid hardcoded user-facing text.
- Use i18n translation keys.
- Use theme tokens.
- Use service abstraction for Supabase.
- Keep business logic out of UI components.
- Use React Hook Form and Zod for forms.
- Use TanStack Query for server state.
- Use Zustand only for local/global UI state.

---

# Styling Rules

- Use NativeWind consistently.
- Do not mix many styling systems.
- Use centralized theme files.
- Do not hardcode colors inside screens.
- Do not hardcode spacing inside screens when a theme token exists.

---

# Supabase Rules

- Do not place Supabase queries directly in UI components.
- Use services.
- Use Row Level Security.
- Never expose service role key.
- Never commit `.env`.
- Use private buckets for progress photos.
- Store image paths/URLs in database, not base64.

---

# i18n Rules

- All visible text must use translation keys.
- Support English and Romanian.
- Do not hardcode text inside components.
- Add translation keys when adding new UI.

---

# Testing Rule

Before marking any feature as complete:

- run available tests
- run typecheck
- run lint
- manually validate the feature flow
- update TESTING_CHECKLIST.md if new flows are added
- only then mark the task as done in TODO.md

---

# Unit Test Rule

When adding business logic, validation schemas, utilities, or reusable components, add unit tests.

Do not write excessive snapshot tests.

Prefer behavior-based tests.

---

# Git Rules

## Branch Naming

Use feature branches:

- feature/project-foundation
- feature/auth
- feature/profiles
- feature/exercise-library
- feature/workout-builder
- feature/workout-logging
- feature/progress
- feature/chat
- feature/calendar
- feature/notifications
- chore/testing
- chore/polish

## Commit Rules

Commit after meaningful working milestones.

Use clear messages:

- feat: setup app foundation
- feat: add authentication
- feat: add coach client profiles
- feat: add exercise library
- feat: add workout builder
- feat: add workout logging
- feat: add progress tracking
- feat: add chat
- feat: add calendar
- chore: add testing setup
- chore: polish mvp

## Push Rules

Push after completed features or stable milestones.

Do not push broken code to main.

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

Then commit.