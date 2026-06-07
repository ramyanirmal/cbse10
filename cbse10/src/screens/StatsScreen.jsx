// src/screens/StatsScreen.jsx
import React from 'react';
import { BADGES, LEVELS, getLevelForXP, SUBJECTS } from '../data/subjects';

const styles = {
  container: { minHeight: '100vh', background: 'var(--bg)', paddingBottom: 40 },
  header: {
    padding: '20px 16px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10,
  },
  backBtn: {
    background: 'var(--card)', border: '1.5px solid var(--border)', borderRadius: 10,
    width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 18, color: 'var(--text)', flexShrink: 0,
  },
  headerTitle: { fontSize: 20, fontWeight: 900, color: 'var(--heading)' },
  body: { padding: '20px 16px' },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 12,
  },

  profileCard: {
    background: 'linear-gradient(135deg, #1a0e35, #2d1a55)',
    border: '1px solid rgba(124,58,237,0.3)',
    borderRadius: 20, padding: '24px 20px', textAlign: 'center', marginBottom: 24,
    position: 'relative', overflow: 'hidden',
  },
  profileGlow: {
    position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
    width: 200, height: 150,
    background: 'radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  profileEmoji: { fontSize: 52, marginBottom: 8 },
  profileLevel: { fontSize: 13, color: 'var(--purple-light)', fontWeight: 800, marginBottom: 4 },
  profileXP: {
    fontFamily: 'Fredoka One, cursive', fontSize: 36,
    background: 'linear-gradient(135deg, #a78bfa, #ec4899)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: 4,
  },
  profileXPLabel: { fontSize: 11, color: 'var(--muted)' },
  levelBar: { margin: '16px 0 8px', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' },
  levelFill: { height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #7c3aed, #ec4899)', transition: 'width 1s ease' },
  levelHint: { fontSize: 11, color: 'var(--muted)' },

  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 },
  statCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '16px 14px',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  statIcon: { fontSize: 24 },
  statNum: { fontSize: 22, fontWeight: 900, lineHeight: 1, marginBottom: 2 },
  statLbl: { fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },

  badgesGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  badgeRow: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '12px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
    transition: 'opacity 0.2s',
  },
  badgeEmoji: { fontSize: 28, width: 36, textAlign: 'center' },
  badgeName: { fontSize: 13, fontWeight: 800, color: 'var(--heading)', marginBottom: 2 },
  badgeDesc: { fontSize: 11, color: 'var(--muted)' },
  badgeLock: { marginLeft: 'auto', fontSize: 16, opacity: 0.4 },

  levelsList: { display: 'flex', flexDirection: 'column', gap: 8 },
  levelRow: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '12px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  levelEmoji: { fontSize: 24 },
  levelName: { flex: 1, fontSize: 14, fontWeight: 800, color: 'var(--heading)' },
  levelXP: { fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' },

  subjectList: { display: 'flex', flexDirection: 'column', gap: 8 },
  subjectRow: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '14px 16px',
    display: 'flex', alignItems: 'center', gap: 12,
  },
  subjectEmoji: { fontSize: 22 },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: 13, fontWeight: 800, color: 'var(--heading)', marginBottom: 4 },
  subjectBarTrack: { height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' },
  subjectBarFill: { height: '100%', borderRadius: 2, transition: 'width 0.8s ease' },
  subjectPct: { fontSize: 12, fontWeight: 800, fontFamily: 'monospace' },
};

export default function StatsScreen({ profile, currentLevel, levelPct, xpInLevel, xpNeeded, onBack }) {
  const accuracy = profile.totalQuestions > 0
    ? Math.round((profile.totalCorrect / profile.totalQuestions) * 100) : 0;
  const passRate = profile.totalTests > 0
    ? Math.round((profile.totalPassed / profile.totalTests) * 100) : 0;

  const earnedBadges = profile.badges || [];

  // Per-subject stats from recentResults
  const subjectStats = {};
  (profile.recentResults || []).forEach(r => {
    if (!subjectStats[r.subject]) subjectStats[r.subject] = { tried: 0, passed: 0 };
    subjectStats[r.subject].tried++;
    if (r.passed) subjectStats[r.subject].passed++;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.backBtn} onClick={onBack}>←</div>
        <div style={styles.headerTitle}>🏆 My Stats</div>
      </div>

      <div style={styles.body}>
        {/* Profile */}
        <div style={styles.profileCard} className="animate-slide-up">
          <div style={styles.profileGlow} />
          <div style={styles.profileEmoji}>{currentLevel.emoji}</div>
          <div style={styles.profileLevel}>Level {currentLevel.level} · {currentLevel.name}</div>
          <div style={styles.profileXP}>{profile.totalXP} XP</div>
          <div style={styles.profileXPLabel}>Total Experience Points</div>
          <div style={styles.levelBar}>
            <div style={{ ...styles.levelFill, width: `${levelPct}%` }} />
          </div>
          <div style={styles.levelHint}>
            {xpInLevel} / {xpNeeded} XP to next level
          </div>
        </div>

        {/* Quick stats */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Overview</div>
          <div style={styles.statsGrid}>
            {[
              { icon: '📋', num: profile.totalTests, label: 'Tests Taken' },
              { icon: '✅', num: profile.totalPassed, label: 'Tests Passed', color: 'var(--green)' },
              { icon: '🎯', num: accuracy + '%', label: 'Accuracy', color: 'var(--cyan)' },
              { icon: '📈', num: passRate + '%', label: 'Pass Rate', color: '#fbbf24' },
              { icon: '🔥', num: profile.streak, label: 'Day Streak', color: '#f97316' },
              { icon: '🏅', num: earnedBadges.length, label: 'Badges', color: 'var(--purple-light)' },
            ].map((s, i) => (
              <div key={i} style={styles.statCard} className="animate-slide-up" style={{ ...styles.statCard, animationDelay: `${i*60}ms` }}>
                <span style={styles.statIcon}>{s.icon}</span>
                <div>
                  <div style={{ ...styles.statNum, color: s.color || 'var(--heading)' }}>{s.num}</div>
                  <div style={styles.statLbl}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject performance */}
        {Object.keys(subjectStats).length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Subject Performance</div>
            <div style={styles.subjectList}>
              {SUBJECTS.filter(s => subjectStats[s.id]).map(s => {
                const st = subjectStats[s.id] || { tried: 0, passed: 0 };
                const pct = st.tried > 0 ? Math.round((st.passed / st.tried) * 100) : 0;
                return (
                  <div key={s.id} style={styles.subjectRow}>
                    <span style={styles.subjectEmoji}>{s.emoji}</span>
                    <div style={styles.subjectInfo}>
                      <div style={styles.subjectName}>{s.name}</div>
                      <div style={styles.subjectBarTrack}>
                        <div style={{ ...styles.subjectBarFill, width: `${pct}%`, background: s.gradient }} />
                      </div>
                    </div>
                    <div style={{ ...styles.subjectPct, color: s.color }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Badges</div>
          <div style={styles.badgesGrid}>
            {BADGES.map(b => {
              const earned = earnedBadges.includes(b.id);
              return (
                <div key={b.id} style={{ ...styles.badgeRow, opacity: earned ? 1 : 0.45 }}>
                  <div style={styles.badgeEmoji}>{b.emoji}</div>
                  <div>
                    <div style={styles.badgeName}>{b.name}</div>
                    <div style={styles.badgeDesc}>{b.desc}</div>
                  </div>
                  {earned
                    ? <span style={{ marginLeft: 'auto', fontSize: 14 }}>✅</span>
                    : <span style={styles.badgeLock}>🔒</span>
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Levels roadmap */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Level Roadmap</div>
          <div style={styles.levelsList}>
            {LEVELS.map(l => {
              const active = currentLevel.level === l.level;
              const done = currentLevel.level > l.level;
              return (
                <div key={l.level} style={{
                  ...styles.levelRow,
                  borderColor: active ? 'var(--purple)' : done ? 'rgba(16,185,129,0.3)' : 'var(--border)',
                  background: active ? 'rgba(124,58,237,0.12)' : 'var(--card)',
                }}>
                  <span style={styles.levelEmoji}>{l.emoji}</span>
                  <span style={styles.levelName}>Lv.{l.level} · {l.name}</span>
                  <span style={styles.levelXP}>{l.minXP}+ XP</span>
                  {done && <span>✅</span>}
                  {active && <span style={{ color: 'var(--purple-light)', fontSize: 12, fontWeight: 800 }}>YOU</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
