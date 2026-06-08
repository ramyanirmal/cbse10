// src/screens/HomeScreen.jsx
import React from 'react';
import { SUBJECTS } from '../data/subjects';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg)',
    paddingBottom: 80,
  },
  header: {
    background: 'linear-gradient(180deg, #1a0e35 0%, var(--bg) 100%)',
    padding: '24px 20px 20px',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backdropFilter: 'blur(12px)',
  },
  topRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    fontSize: 28,
    animation: 'float 3s ease-in-out infinite',
  },
  brandName: {
    fontFamily: 'Fredoka One, cursive',
    fontSize: 24,
    background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '0.5px',
  },
  statsBtn: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    padding: '8px 14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    color: 'var(--text)',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'Nunito, sans-serif',
    transition: 'all 0.2s',
  },
  xpBar: {
    background: 'var(--surface)',
    borderRadius: 12,
    padding: '12px 16px',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    fontSize: 22,
    lineHeight: 1,
  },
  xpInfo: { flex: 1 },
  xpRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelName: {
    fontSize: 12,
    fontWeight: 800,
    color: 'var(--purple-light)',
  },
  xpCount: {
    fontSize: 11,
    color: 'var(--muted)',
    fontFamily: 'monospace',
  },
  progressTrack: {
    height: 6,
    background: 'var(--border)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
    transition: 'width 0.8s ease',
  },
  streakBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  streakNum: {
    fontSize: 16,
    fontWeight: 900,
    color: '#fbbf24',
    lineHeight: 1,
  },
  streakLabel: {
    fontSize: 9,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  body: { padding: '24px 16px' },
  heroText: {
    marginBottom: 24,
    textAlign: 'center',
  },
  heroTitle: {
    fontFamily: 'Fredoka One, cursive',
    fontSize: 28,
    color: 'var(--heading)',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: 'var(--muted)',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--muted)',
    marginBottom: 14,
  },
  subjectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 28,
  },
  subjectCard: {
    borderRadius: 20,
    padding: '20px 16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1.5px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 130,
  },
  subjectCardBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.12,
  },
  subjectEmoji: {
    fontSize: 32,
    lineHeight: 1,
    position: 'relative',
    zIndex: 1,
  },
  subjectName: {
    fontWeight: 900,
    fontSize: 14,
    color: 'var(--heading)',
    lineHeight: 1.2,
    position: 'relative',
    zIndex: 1,
  },
  subjectChaps: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    position: 'relative',
    zIndex: 1,
  },
  subjectArrow: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    fontSize: 16,
    opacity: 0.5,
    zIndex: 1,
  },

  quickStatsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginBottom: 28,
  },
  miniStat: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 14,
    padding: '14px 10px',
    textAlign: 'center',
  },
  miniStatNum: {
    fontSize: 22,
    fontWeight: 900,
    lineHeight: 1,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: 10,
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  historyBtn: {
    width: '100%',
    padding: '14px',
    background: 'var(--card)',
    border: '1.5px solid var(--border)',
    borderRadius: 14,
    color: 'var(--text)',
    fontFamily: 'Nunito, sans-serif',
    fontWeight: 800,
    fontSize: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'all 0.2s',
  },
};

export default function HomeScreen({ profile, currentLevel, levelPct, xpInLevel, xpNeeded, onSubjectSelect, onShowStats, onShowHistory }) {
  const accuracy = profile.totalQuestions > 0
    ? Math.round((profile.totalCorrect / profile.totalQuestions) * 100)
    : 0;

  const passRate = profile.totalTests > 0
    ? Math.round((profile.totalPassed / profile.totalTests) * 100)
    : 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.topRow}>
          <div style={styles.brandRow}>
            <span style={styles.brandIcon} className="animate-float">🎓</span>
            <span style={styles.brandName}>MockMaster</span>
          </div>
          <button style={styles.statsBtn} onClick={onShowStats}>
            🏆 My Stats
          </button>
        </div>

        {/* XP Bar */}
        <div style={styles.xpBar}>
          <div style={styles.levelBadge}>{currentLevel.emoji}</div>
          <div style={styles.xpInfo}>
            <div style={styles.xpRow}>
              <span style={styles.levelName}>Lv.{currentLevel.level} {currentLevel.name}</span>
              <span style={styles.xpCount}>{xpInLevel}/{xpNeeded} XP</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${levelPct}%` }} />
            </div>
          </div>
          <div style={styles.streakBadge}>
            <span style={styles.streakNum}>🔥{profile.streak}</span>
            <span style={styles.streakLabel}>streak</span>
          </div>
        </div>
      </div>

      <div style={styles.body}>
        {/* Hero */}
        <div style={styles.heroText} className="animate-slide-up">
          <div style={styles.heroTitle}>
            {profile.totalTests === 0 ? 'Let\'s Begin! ✨' : 'Keep Going! 🚀'}
          </div>
          <div style={styles.heroSub}>
            CBSE Class 10 · 2026–27 · {SUBJECTS.reduce((a,s)=>a+s.chapters.length,0)} chapters across 6 subjects
          </div>
        </div>

        {/* Quick Stats */}
        <div style={styles.quickStatsRow}>
          <div style={styles.miniStat}>
            <div style={{ ...styles.miniStatNum, color: '#a78bfa' }}>{profile.totalXP}</div>
            <div style={styles.miniStatLabel}>Total XP</div>
          </div>
          <div style={styles.miniStat}>
            <div style={{ ...styles.miniStatNum, color: '#10b981' }}>{passRate}%</div>
            <div style={styles.miniStatLabel}>Pass Rate</div>
          </div>
          <div style={styles.miniStat}>
            <div style={{ ...styles.miniStatNum, color: '#fbbf24' }}>{accuracy}%</div>
            <div style={styles.miniStatLabel}>Accuracy</div>
          </div>
        </div>

        {/* Subjects */}
        <div style={styles.sectionLabel}>Choose a Subject</div>
        <div style={styles.subjectsGrid}>
          {SUBJECTS.map((s, i) => (
            <div
              key={s.id}
              className="animate-slide-up"
              style={{
                ...styles.subjectCard,
                background: s.gradient,
                borderColor: s.color + '40',
                animationDelay: `${i * 60}ms`,
              }}
              onClick={() => onSubjectSelect(s)}
            >
              <span style={styles.subjectEmoji}>{s.emoji}</span>
              <div style={styles.subjectName}>{s.name}</div>
              <div style={styles.subjectChaps}>{s.chapters.length} chapters</div>
              <span style={styles.subjectArrow}>→</span>
            </div>
          ))}
        </div>

        {/* History */}
        <button style={styles.historyBtn} onClick={onShowHistory}>
          📋 Test History
        </button>
      </div>
    </div>
  );
}
