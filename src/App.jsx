// src/App.jsx
import React, { useState, useCallback } from 'react';
import { useProfile } from './hooks/useProfile';
import { generateQuestions, getFallbackQuestions } from './utils/generateQuestions';
import { saveTestResult } from './lib/firebase';

import HomeScreen from './screens/HomeScreen';
import ChapterScreen from './screens/ChapterScreen';
import TestScreen from './screens/TestScreen';
import ResultScreen from './screens/ResultScreen';
import StatsScreen from './screens/StatsScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoadingScreen from './components/LoadingScreen';

// SCREENS
const SCREEN = {
  HOME: 'home',
  CHAPTERS: 'chapters',
  LOADING: 'loading',
  TEST: 'test',
  RESULT: 'result',
  STATS: 'stats',
  HISTORY: 'history',
};

export default function App() {
  const { profile, loading, currentLevel, levelPct, xpInLevel, xpNeeded, recordResult, newBadges, clearNewBadges } = useProfile();

  const [screen, setScreen] = useState(SCREEN.HOME);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [testConfig, setTestConfig] = useState({});
  const [lastResult, setLastResult] = useState(null);
  const [lastXP, setLastXP] = useState(0);

  const handleSubjectSelect = useCallback((subject) => {
    setSelectedSubject(subject);
    setScreen(SCREEN.CHAPTERS);
  }, []);

  const handleStartTest = useCallback(async ({ subject, chapter, qCount }) => {
    setSelectedSubject(subject);
    setSelectedChapter(chapter || null);
    setTestConfig({ qCount });
    setScreen(SCREEN.LOADING);

    try {
      const qs = await generateQuestions({ subject, chapter, count: qCount });
      setQuestions(qs);
    } catch (e) {
      console.error('Question generation failed:', e);
      setQuestions(getFallbackQuestions(subject.name));
    }

    setScreen(SCREEN.TEST);
  }, []);

  const handleTestSubmit = useCallback(async (result) => {
    // result has: answers, correct, total, marks, maxMarks, timeSecs, questions
    const fullResult = {
      ...result,
      subject: selectedSubject.id,
      chapter: selectedChapter,
    };

    const { xpEarned, passed, pct } = await recordResult(fullResult);

    await saveTestResult({
      subject: selectedSubject.id,
      subjectName: selectedSubject.name,
      chapter: selectedChapter ? { id: selectedChapter.id, name: selectedChapter.name } : null,
      score: result.correct,
      total: result.total,
      marks: result.marks,
      maxMarks: result.maxMarks,
      pct,
      passed,
      timeSecs: result.timeSecs,
      xpEarned,
    });

    setLastResult(result);
    setLastXP(xpEarned);
    setScreen(SCREEN.RESULT);
  }, [selectedSubject, selectedChapter, testConfig, recordResult]);

  const handleRetake = useCallback(async () => {
    setScreen(SCREEN.LOADING);
    try {
      const qs = await generateQuestions({
        subject: selectedSubject,
        chapter: selectedChapter,
        count: testConfig.qCount,
      });
      setQuestions(qs);
    } catch (e) {
      setQuestions(getFallbackQuestions(selectedSubject.name));
    }
    clearNewBadges();
    setScreen(SCREEN.TEST);
  }, [selectedSubject, selectedChapter, testConfig, clearNewBadges]);

  const handleHome = useCallback(() => {
    clearNewBadges();
    setScreen(SCREEN.HOME);
  }, [clearNewBadges]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: 52 }} className="animate-float">🎓</div>
        <div style={{
          fontFamily: 'Fredoka One, cursive', fontSize: 28,
          background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>MockMaster</div>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>Loading your progress…</div>
      </div>
    );
  }

  return (
    <>
      {screen === SCREEN.HOME && (
        <HomeScreen
          profile={profile}
          currentLevel={currentLevel}
          levelPct={levelPct}
          xpInLevel={xpInLevel}
          xpNeeded={xpNeeded}
          onSubjectSelect={handleSubjectSelect}
          onShowStats={() => setScreen(SCREEN.STATS)}
          onShowHistory={() => setScreen(SCREEN.HISTORY)}
        />
      )}

      {screen === SCREEN.CHAPTERS && selectedSubject && (
        <ChapterScreen
          subject={selectedSubject}
          onBack={() => setScreen(SCREEN.HOME)}
          onStartTest={handleStartTest}
        />
      )}

      {screen === SCREEN.LOADING && selectedSubject && (
        <LoadingScreen subject={selectedSubject} chapter={selectedChapter} />
      )}

      {screen === SCREEN.TEST && selectedSubject && questions.length > 0 && (
        <TestScreen
          subject={selectedSubject}
          chapter={selectedChapter}
          questions={questions}
          qCount={testConfig.qCount}
          onSubmit={handleTestSubmit}
        />
      )}

      {screen === SCREEN.RESULT && lastResult && selectedSubject && (
        <ResultScreen
          result={lastResult}
          subject={selectedSubject}
          chapter={selectedChapter}
          xpEarned={lastXP}
          newBadges={newBadges}
          onRetake={handleRetake}
          onHome={handleHome}
        />
      )}

      {screen === SCREEN.STATS && (
        <StatsScreen
          profile={profile}
          currentLevel={currentLevel}
          levelPct={levelPct}
          xpInLevel={xpInLevel}
          xpNeeded={xpNeeded}
          onBack={() => setScreen(SCREEN.HOME)}
        />
      )}

      {screen === SCREEN.HISTORY && (
        <HistoryScreen
          profile={profile}
          onBack={() => setScreen(SCREEN.HOME)}
        />
      )}
    </>
  );
}
