// src/lib/firebase.js
// Persistence layer — uses Supabase instead of Firebase Firestore.
// Exports the same API so the rest of the app is unchanged.

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Save a completed test result
export async function saveTestResult(result) {
  try {
    const { error } = await supabase.from('test_results').insert({
      subject: result.subject,
      subject_name: result.subjectName,
      chapter: result.chapter ?? null,
      score: result.score,
      total: result.total,
      marks: result.marks,
      max_marks: result.maxMarks,
      pct: result.pct,
      passed: result.passed,
      time_secs: result.timeSecs,
      difficulty: result.difficulty ?? null,
      xp_earned: result.xpEarned,
    });
    if (error) console.error('saveTestResult failed:', error);
  } catch (e) {
    console.error('saveTestResult failed:', e);
  }
}

// Get all test results ordered by newest first (for history + stats)
export async function getTestHistory() {
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error('getTestHistory failed:', e);
    return [];
  }
}

// Save / update player profile (XP, level, streaks, badges)
export async function saveProfile(profile) {
  try {
    const { error } = await supabase
      .from('player_profile')
      .upsert({ id: 'player', data: profile, updated_at: new Date().toISOString() });
    if (error) console.error('saveProfile failed:', error);
  } catch (e) {
    console.error('saveProfile failed:', e);
  }
}

// Load player profile
export async function loadProfile() {
  try {
    const { data, error } = await supabase
      .from('player_profile')
      .select('data')
      .eq('id', 'player')
      .maybeSingle();
    if (error) throw error;
    return data?.data ?? null;
  } catch (e) {
    console.error('loadProfile failed:', e);
    return null;
  }
}
