// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { saveProfile, loadProfile } from '../lib/firebase';
import { BADGES, getLevelForXP, XP_PER_CORRECT, XP_PER_PASS, XP_STREAK_BONUS, PASS_THRESHOLD } from '../data/subjects';

const DEFAULT_PROFILE = {
  name: 'Board Queen 👑',
  totalXP: 0,
  totalTests: 0,
  totalPassed: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  streak: 0,
  lastStudyDate: null,
  subjectsTried: 0,
  subjectsTriedList: [],
  passedSubjects: [],
  hasPerfect: false,
  hasFastFinish: false,
  badges: [],
  recentResults: [],
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [newBadges, setNewBadges] = useState([]);

  useEffect(() => {
    loadProfile().then(data => {
      if (data) setProfile({ ...DEFAULT_PROFILE, ...data });
      setLoading(false);
    });
  }, []);

  const updateStreak = (prof) => {
    const today = new Date().toDateString();
    const last = prof.lastStudyDate;
    if (last === today) return { streak: prof.streak, lastStudyDate: prof.lastStudyDate };
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const streak = last === yesterday ? prof.streak + 1 : 1;
    return { streak, lastStudyDate: today };
  };

  const checkBadges = (updatedProfile) => {
    const stats = {
      totalTests: updatedProfile.totalTests,
      totalPassed: updatedProfile.totalPassed,
      streak: updatedProfile.streak,
      hasPerfect: updatedProfile.hasPerfect,
      totalXP: updatedProfile.totalXP,
      subjectsTried: updatedProfile.subjectsTriedList?.length || 0,
      passedSubjects: updatedProfile.passedSubjects || [],
      hasFastFinish: updatedProfile.hasFastFinish,
    };
    const earned = updatedProfile.badges || [];
    const newlyEarned = BADGES.filter(b => !earned.includes(b.id) && b.condition(stats));
    return newlyEarned;
  };

  const recordResult = useCallback(async (result) => {
    // result: { subject, chapter, score, total, marks, maxMarks, timeSecs, questions }
    const pct = Math.round((result.marks / result.maxMarks) * 100);
    const passed = pct >= PASS_THRESHOLD;
    const perfect = pct === 100;
    const fastFinish = result.timeSecs < 180 && result.total >= 5;

    const xpEarned = (result.score * XP_PER_CORRECT) + (passed ? XP_PER_PASS : 0);

    setProfile(prev => {
      const streakData = updateStreak(prev);
      const streakBonus = streakData.streak > prev.streak ? XP_STREAK_BONUS : 0;
      const totalXP = prev.totalXP + xpEarned + streakBonus;

      const subjectsTriedList = prev.subjectsTriedList || [];
      if (!subjectsTriedList.includes(result.subject)) subjectsTriedList.push(result.subject);

      const passedSubjects = prev.passedSubjects || [];
      if (passed && !passedSubjects.includes(result.subject)) passedSubjects.push(result.subject);

      const recentResults = [
        { ...result, pct, passed, xpEarned: xpEarned + streakBonus, ts: new Date().toISOString() },
        ...(prev.recentResults || [])
      ].slice(0, 50);

      const updated = {
        ...prev,
        totalXP,
        totalTests: prev.totalTests + 1,
        totalPassed: prev.totalPassed + (passed ? 1 : 0),
        totalCorrect: prev.totalCorrect + result.score,
        totalQuestions: prev.totalQuestions + result.total,
        hasPerfect: prev.hasPerfect || perfect,
        hasFastFinish: prev.hasFastFinish || fastFinish,
        subjectsTriedList,
        passedSubjects,
        recentResults,
        ...streakData,
      };

      // Check new badges
      const newlyEarned = checkBadges(updated);
      if (newlyEarned.length > 0) {
        updated.badges = [...(prev.badges || []), ...newlyEarned.map(b => b.id)];
        setNewBadges(newlyEarned);
      }

      saveProfile(updated);
      return updated;
    });

    return { xpEarned, passed, pct };
  }, []);

  const clearNewBadges = useCallback(() => setNewBadges([]), []);

  const currentLevel = getLevelForXP(profile.totalXP);
  const nextLevel = getLevelForXP(profile.totalXP + 1);
  const xpInLevel = profile.totalXP - currentLevel.minXP;
  const xpNeeded = currentLevel.maxXP - currentLevel.minXP;
  const levelPct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return { profile, loading, currentLevel, xpInLevel, xpNeeded, levelPct, recordResult, newBadges, clearNewBadges };
}
