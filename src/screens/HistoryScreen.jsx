// src/screens/HistoryScreen.jsx
import React from 'react';
import { SUBJECTS, PASS_THRESHOLD } from '../data/subjects';

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
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 14, lineHeight: 1.6 },

  historyList: { display: 'flex', flexDirection: 'column', gap: 10 },
  historyCard: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '16px',
    animation: 'slideUp 0.3s ease',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  subjectTag: {
    fontSize: 11, fontWeight: 800, padding: '4px 10px',
    borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.5px',
  },
  passBadge: {
    marginLeft: 'auto', fontSize: 11, fontWeight: 900,
    padding: '4px 10px', borderRadius: 8,
  },
  chapterName: { fontSize: 13, fontWeight: 700, color: 'var(--heading)', marginBottom: 8 },
  statsRow: { display: 'flex', gap: 16, alignItems: 'center' },
  pct: { fontFamily: 'Fredoka One, cursive', fontSize: 28, lineHeight: 1 },
  miniStats: { flex: 1, display: 'flex', gap: 12, flexWrap: 'wrap' },
  miniStat: { fontSize: 12, color: 'var(--muted)' },
  miniNum: { fontWeight: 900, color: 'var(--text)' },
  dateLabel: { fontSize: 10, color: 'var(--muted)', marginTop: 8 },
  xpTag: { fontSize: 11, color: 'var(--purple-light)', fontWeight: 800 },
};

export default function HistoryScreen({ profile, onBack }) {
  const results = profile.recentResults || [];
  const subjectMap = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.backBtn} onClick={onBack}>←</div>
        <div style={styles.headerTitle}>📋 Test History</div>
      </div>
      <div style={styles.body}>
        {results.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyEmoji}>📭</div>
            <div style={styles.emptyText}>No tests taken yet!<br/>Pick a subject and start your first test.</div>
          </div>
        ) : (
          <div style={styles.historyList}>
            {results.map((r, i) => {
              const s = subjectMap[r.subject];
              const pct = r.pct;
              const passed = r.passed;
              return (
                <div key={i} className="animate-slide-up" style={{ ...styles.historyCard, animationDelay: `${i*40}ms` }}>
                  <div style={styles.cardTop}>
                    {s && (
                      <span style={{
                        ...styles.subjectTag,
                        background: s.color + '20', color: s.color,
                      }}>
                        {s.emoji} {s.name}
                      </span>
                    )}
                    <span style={{
                      ...styles.passBadge,
                      background: passed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)',
                      color: passed ? 'var(--green)' : 'var(--red)',
                    }}>
                      {passed ? '✅ PASS' : '❌ FAIL'}
                    </span>
                  </div>

                  {r.chapter && (
                    <div style={styles.chapterName}>Ch.{r.chapter?.id}: {r.chapter?.name}</div>
                  )}

                  <div style={styles.statsRow}>
                    <div style={{ ...styles.pct, color: passed ? 'var(--green)' : 'var(--red)' }}>
                      {pct}%
                    </div>
                    <div style={styles.miniStats}>
                      <div style={styles.miniStat}>
                        <span style={styles.miniNum}>{r.score}/{r.total}</span> correct
                      </div>
                      <div style={styles.miniStat}>
                        <span style={styles.miniNum}>{r.marks}/{r.maxMarks}</span> marks
                      </div>
                      <div style={styles.miniStat}>
                        {Math.floor((r.timeSecs||0)/60)}m {(r.timeSecs||0)%60}s
                      </div>
                    </div>
                    <div style={styles.xpTag}>+{r.xpEarned} XP</div>
                  </div>

                  <div style={styles.dateLabel}>
                    {new Date(r.ts).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
