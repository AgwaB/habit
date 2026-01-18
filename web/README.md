
# Habit Tracker (Supabase)

Single-user habit tracker built from the PRD/UIUX with Supabase for storage.

## Prerequisites
- Node.js 18+
- Supabase CLI (`npx supabase ...`)

## Setup
1) Set your project ref in `supabase/config.toml`:
   - `project_id = "your-project-ref"`
2) Link the project:
   - `npx supabase link --project-ref <your-ref>`
3) Apply migrations:
   - `npx supabase db push`
4) Create `web/.env` from `web/.env.example` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5) Install deps and run:
   - `npm install`
   - `npm run dev`

## Notes
- RLS policies are permissive because this is a single-user app (no auth UI).
- Change the “day start time” in Settings; it is stored in `app_settings`.
