# AGENTS.md

## Design / Structure
- Build a new `web/` Vite React app using `example/` UI as a visual reference.
- Add a Supabase-backed data layer (tasks, task_logs, app_settings) mapped to PRD logic.
- Keep UI/UX behavior aligned with PRD.md and UIUX.md.
- Use local-time logical dates based on a per-user day start hour.

## Context
- User wants the PRD/UIUX implemented with Supabase.
- `example/` is a local state-only UI reference; `web/` is the new app.
- No auth UI; app is single-user with Supabase anon access.
- Supabase CLI config + migrations should live in repo root.

## Changelog
- 2026-01-18 19:19 - Created AGENTS.md with initial context and plan placeholders.
- 2026-01-18 19:32 - Copied UI scaffold to `web/`, added Supabase client/env scaffolding, and fixed logical date handling for local timezone.
- 2026-01-18 19:34 - Added Supabase config and initial schema/RLS migrations.
- 2026-01-18 19:42 - Wired `web/` UI state to Supabase with loading/error handling and goal-per-day logic.
- 2026-01-18 19:48 - Updated `web/README.md` with Supabase setup steps.
- 2026-01-18 20:02 - Ran `npm run build` to verify production build.
- 2026-01-18 21:28 - Added missing Supabase env guard to avoid blank screen and show setup message.
- 2026-01-18 22:25 - Removed deprecated auth config keys from `supabase/config.toml`.
- 2026-01-18 22:40 - Added missing Tailwind-like utility classes for indigo/gray and opacity variants to fix UI visibility.
- 2026-01-18 23:10 - Added Vercel config to output `build/` for Vite.
- 2026-01-18 23:13 - Switched Vite output to `dist/` to match Vercel defaults and updated vercel.json.
- 2026-01-18 23:21 - Compacted calendar layout for better on-screen fit.
- 2026-01-19 02:09 - Added task save lock to prevent double-submit on habit creation/edit.
- 2026-01-19 02:18 - Added interactive calendar history editing UI, bottom sheet, and supporting utilities; wired log add/remove handlers.
- 2026-01-19 02:34 - Added missing positional utilities (bottom-0, left-0, z-40) so the edit bottom sheet is visible.
- 2026-01-19 02:38 - Updated page title to Habit Tracker.
- 2026-01-19 22:41 - Updated main dashboard UI to match latest example and added responsive mini heatmap per task.
- 2026-01-19 22:59 - Removed detail heatmap section and darkened calendar “today” highlight.
- 2026-01-19 23:12 - Added calendar month navigation and supporting CSS utilities.
- 2026-01-19 23:35 - Added React Router for URL-based navigation with browser back support.
- 2026-01-19 23:38 - Restored detail heatmap section to match latest example.

## Tasks
- [ ] Implement Supabase-backed habit tracker based on PRD/UIUX and `example/`.
  - Work: Created `web/` app scaffold and Supabase client/env/mappers; updated date utils; added Supabase SQL migrations/RLS/config; wired Supabase reads/writes and UI loading/error states; documented setup steps; added save lock to prevent double-submit; added calendar history edit bottom sheet and handlers; updated main dashboard to match latest example with mini heatmap row; adjusted calendar today highlight; added month navigation in calendar; added URL-based navigation with browser back support; restored detail heatmap section.
  - Next: Validate detail view layout (heatmap + calendar) against example.
  - Status: In progress.
