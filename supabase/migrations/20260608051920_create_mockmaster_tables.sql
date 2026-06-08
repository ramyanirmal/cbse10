/*
# MockMaster — Create profile and test_results tables

## Summary
Replaces Firebase Firestore with Supabase Postgres for the MockMaster CBSE Class 10 app.

## New Tables

### `player_profile`
Stores the single-player gamification profile (XP, level, streaks, badges, recent results).
- `id` (text, primary key) — always the string 'player' (single-tenant, one profile)
- `data` (jsonb, not null) — full profile object (XP, badges, streaks, recentResults[], etc.)
- `updated_at` (timestamptz) — auto-updated on every write

### `test_results`
Stores every completed test result for history and analytics.
- `id` (uuid, primary key, auto-generated)
- `subject` (text) — subject id e.g. 'maths', 'science'
- `subject_name` (text) — display name
- `chapter` (jsonb, nullable) — {id, name} or null for full-subject tests
- `score` (int) — number of correct answers
- `total` (int) — total questions
- `marks` (int) — marks earned
- `max_marks` (int) — total marks available
- `pct` (int) — percentage score
- `passed` (boolean)
- `time_secs` (int) — time taken in seconds
- `difficulty` (text) — 'easy', 'medium', 'hard', 'mixed'
- `xp_earned` (int)
- `created_at` (timestamptz) — auto-set on insert

## Security
- RLS enabled on both tables.
- anon + authenticated can read/write (single-tenant app, no sign-in required).
*/

CREATE TABLE IF NOT EXISTS player_profile (
  id text PRIMARY KEY DEFAULT 'player',
  data jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  subject_name text NOT NULL,
  chapter jsonb,
  score int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  marks int NOT NULL DEFAULT 0,
  max_marks int NOT NULL DEFAULT 0,
  pct int NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  time_secs int NOT NULL DEFAULT 0,
  difficulty text,
  xp_earned int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_player_profile" ON player_profile;
CREATE POLICY "anon_select_player_profile" ON player_profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_player_profile" ON player_profile;
CREATE POLICY "anon_insert_player_profile" ON player_profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_player_profile" ON player_profile;
CREATE POLICY "anon_update_player_profile" ON player_profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_player_profile" ON player_profile;
CREATE POLICY "anon_delete_player_profile" ON player_profile FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_test_results" ON test_results;
CREATE POLICY "anon_select_test_results" ON test_results FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_test_results" ON test_results;
CREATE POLICY "anon_insert_test_results" ON test_results FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_test_results" ON test_results;
CREATE POLICY "anon_update_test_results" ON test_results FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_test_results" ON test_results;
CREATE POLICY "anon_delete_test_results" ON test_results FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS test_results_created_at_idx ON test_results (created_at DESC);
CREATE INDEX IF NOT EXISTS test_results_subject_idx ON test_results (subject);
