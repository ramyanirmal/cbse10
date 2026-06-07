// src/screens/ChapterScreen.jsx
import React, { useState } from 'react';

const styles = {
  container: { minHeight: '100vh', background: 'var(--bg)' },
  header: {
    padding: '16px 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    position: 'sticky',
    top: 0,
    background: 'var(--bg)',
    zIndex: 10,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottom: '1px solid var(--border)',
  },
  backBtn: {
    background: 'var(--card)',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    width: 38, height: 38,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: 18, color: 'var(--text)',
    flexShrink: 0, transition: 'all 0.15s',
  },
  titleBlock: { flex: 1 },
  title: { fontSize: 18, fontWeight: 900, color: 'var(--heading)' },
  subtitle: { fontSize: 12, color: 'var(--muted)', marginTop: 2 },

  body: { padding: '0 16px 80px' },

  configCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '20px',
    marginBottom: 24,
  },
  configTitle: {
    fontSize: 13,
    fontWeight: 800,
    color: 'var(--heading)',
    marginBottom: 16,
    display: 'flex', alignItems: 'center', gap: 6,
  },
  configGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    marginBottom: 14,
  },
  configItem: {},
  configLabel: {
    fontSize: 10,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: 'var(--muted)',
    marginBottom: 6,
  },
  select: {
    width: '100%',
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 10,
    padding: '10px 12px',
    color: 'var(--text)',
    fontSize: 13,
    fontFamily: 'Nunito, sans-serif',
    fontWeight: 700,
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237c6fa0' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: 30,
  },
  startBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontSize: 15,
    fontWeight: 900,
    fontFamily: 'Nunito, sans-serif',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'var(--muted)',
    marginBottom: 12,
  },
  chaptersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  chapterCard: {
    background: 'var(--card)',
    border: '1.5px solid var(--border)',
    borderRadius: 14,
    padding: '14px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    transition: 'all 0.18s',
  },
  chapterNum: {
    width: 32, height: 32,
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12,
    fontWeight: 900,
    fontFamily: 'monospace',
    flexShrink: 0,
  },
  chapterInfo: { flex: 1 },
  chapterName: { fontSize: 14, fontWeight: 700, color: 'var(--heading)', marginBottom: 2 },
  chapterSub: { fontSize: 11, color: 'var(--muted)' },
  chapterArrow: { fontSize: 14, color: 'var(--muted)' },
};

export default function ChapterScreen({ subject, onBack, onStartTest }) {
  const [qCount, setQCount] = useState('10');
  const [difficulty, setDifficulty] = useState('mixed');
  const [selectedChapter, setSelectedChapter] = useState(null);

  const handleStart = (chapter = null) => {
    onStartTest({ subject, chapter: chapter || selectedChapter, qCount: parseInt(qCount), difficulty });
  };

  const btnLabel = selectedChapter
    ? `🚀 Start Ch.${selectedChapter.id}: ${selectedChapter.name.slice(0,20)}…`
    : `🚀 Start Full ${subject.name} Test`;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.backBtn} onClick={onBack}>←</div>
        <div style={styles.titleBlock}>
          <div style={styles.title}>{subject.emoji} {subject.name}</div>
          <div style={styles.subtitle}>{subject.chapters.length} chapters · CBSE 2026–27</div>
        </div>
      </div>

      <div style={styles.body}>
        {/* Config */}
        <div style={styles.configCard}>
          <div style={styles.configTitle}>⚙️ Test Settings</div>
          <div style={styles.configGrid}>
            <div style={styles.configItem}>
              <div style={styles.configLabel}>Questions</div>
              <select
                style={styles.select}
                value={qCount}
                onChange={e => setQCount(e.target.value)}
              >
                <option value="5">5 — Quick</option>
                <option value="10">10 — Standard</option>
                <option value="15">15 — Detailed</option>
                <option value="20">20 — Full</option>
              </select>
            </div>
            <div style={styles.configItem}>
              <div style={styles.configLabel}>Difficulty</div>
              <select
                style={styles.select}
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy 😊</option>
                <option value="mixed">Mixed 🎯</option>
                <option value="medium">Medium 📚</option>
                <option value="hard">Hard 🔥</option>
              </select>
            </div>
          </div>
          <button style={styles.startBtn} onClick={() => handleStart(null)}>
            {btnLabel}
          </button>
        </div>

        {/* Chapters */}
        <div style={styles.sectionLabel}>— or drill a specific chapter —</div>
        <div style={styles.chaptersList}>
          {subject.chapters.map((ch, i) => {
            const isSelected = selectedChapter?.id === ch.id;
            return (
              <div
                key={ch.id}
                className="animate-slide-up"
                style={{
                  ...styles.chapterCard,
                  borderColor: isSelected ? subject.color : 'var(--border)',
                  background: isSelected ? subject.color + '18' : 'var(--card)',
                  animationDelay: `${i * 30}ms`,
                }}
                onClick={() => {
                  setSelectedChapter(isSelected ? null : ch);
                }}
              >
                <div style={{
                  ...styles.chapterNum,
                  background: subject.color + '22',
                  color: subject.color,
                }}>
                  {ch.id}
                </div>
                <div style={styles.chapterInfo}>
                  <div style={styles.chapterName}>{ch.name}</div>
                  {ch.sub && <div style={styles.chapterSub}>{ch.sub}</div>}
                </div>
                {isSelected
                  ? <span style={{ fontSize: 18 }}>✅</span>
                  : <span style={styles.chapterArrow}>›</span>
                }
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
