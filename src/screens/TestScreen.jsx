// src/screens/TestScreen.jsx
import React, { useState, useEffect, useRef } from 'react';

const styles = {
  container: { minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' },

  header: {
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    padding: '12px 16px',
    position: 'sticky', top: 0, zIndex: 50,
  },
  headerTop: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  testLabel: { fontSize: 13, fontWeight: 800, color: 'var(--heading)' },
  timerBox: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 900,
    padding: '6px 12px',
    borderRadius: 8,
    border: '1.5px solid var(--border)',
    background: 'var(--card)',
    color: 'var(--heading)',
    minWidth: 72,
    textAlign: 'center',
    transition: 'all 0.3s',
  },
  progressTrack: {
    height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', borderRadius: 3,
    background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
    transition: 'width 0.4s ease',
  },
  qCountLabel: {
    display: 'flex', justifyContent: 'space-between', marginBottom: 6,
    fontSize: 11, color: 'var(--muted)',
  },

  // Palette
  palette: {
    display: 'flex', flexWrap: 'wrap', gap: 6, padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
  },
  paletteDot: {
    width: 28, height: 28,
    borderRadius: 6,
    border: '1.5px solid var(--border)',
    background: 'var(--card)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
    color: 'var(--muted)', cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // Question
  body: { flex: 1, padding: '16px 16px 100px', overflowY: 'auto' },
  qCard: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 20,
    padding: '20px',
    marginBottom: 16,
    animation: 'slideUp 0.3s ease forwards',
  },
  qMeta: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  qNum: { fontSize: 12, fontWeight: 900, color: 'var(--purple-light)', fontFamily: 'monospace' },
  qTypeBadge: {
    fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '0.5px', padding: '2px 8px', borderRadius: 4,
  },
  qMarks: { marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' },

  caseBlock: {
    background: 'var(--surface)',
    borderLeft: '3px solid #fbbf24',
    borderRadius: '0 10px 10px 0',
    padding: '12px 14px',
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 1.65,
    color: 'var(--text)',
    fontStyle: 'italic',
  },
  qText: {
    fontSize: 15,
    lineHeight: 1.65,
    color: 'var(--heading)',
    fontWeight: 600,
    marginBottom: 18,
  },
  optionsList: { display: 'flex', flexDirection: 'column', gap: 10 },
  option: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 12,
    padding: '13px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'all 0.15s',
    fontSize: 14,
    color: 'var(--text)',
    fontWeight: 600,
    userSelect: 'none',
    lineHeight: 1.4,
  },
  optionKey: {
    width: 28, height: 28,
    borderRadius: 7,
    background: 'var(--card)',
    border: '1.5px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 900, fontFamily: 'monospace',
    flexShrink: 0, transition: 'all 0.15s',
  },

  explanation: {
    background: 'rgba(16,185,129,0.07)',
    border: '1px solid rgba(16,185,129,0.2)',
    borderRadius: 12,
    padding: '14px 16px',
    marginTop: 14,
    fontSize: 13,
    lineHeight: 1.6,
    color: 'var(--text)',
    animation: 'slideUp 0.25s ease',
  },

  // Nav
  navBar: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    padding: '12px 16px',
    display: 'flex',
    gap: 10,
    zIndex: 50,
  },
  navBtn: {
    flex: 1, padding: '13px',
    border: 'none', borderRadius: 12,
    fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.15s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
};

export default function TestScreen({ subject, chapter, questions, qCount, onSubmit }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const secs = String(elapsed % 60).padStart(2, '0');
  const timeStr = `${mins}:${secs}`;
  const timerWarning = elapsed > 1800;
  const timerDanger = elapsed > 2700;

  const q = questions[currentQ];
  const n = questions.length;
  const pct = Math.round(((currentQ) / n) * 100);
  const isLast = currentQ === n - 1;
  const isLocked = locked[currentQ];
  const userAnswer = answers[currentQ];

  const selectOption = (key) => {
    if (locked[currentQ]) return;
    setAnswers(a => ({ ...a, [currentQ]: key }));
    setLocked(l => ({ ...l, [currentQ]: true }));
  };

  const handleSubmit = () => {
    clearInterval(timerRef.current);
    let correct = 0, totalMarks = 0, earnedMarks = 0;
    questions.forEach((q, i) => {
      const m = q.marks || 1;
      totalMarks += m;
      if (answers[i] === q.answer) { correct++; earnedMarks += m; }
    });
    onSubmit({ answers, correct, total: n, marks: earnedMarks, maxMarks: totalMarks, timeSecs: elapsed, questions });
  };

  const getOptionStyle = (key) => {
    let style = { ...styles.option };
    let keyStyle = { ...styles.optionKey };
    if (isLocked) {
      if (key === q.answer) {
        style = { ...style, borderColor: 'var(--green)', background: 'rgba(16,185,129,0.1)', color: 'var(--green)' };
        keyStyle = { ...keyStyle, background: 'var(--green)', borderColor: 'var(--green)', color: 'white' };
      } else if (key === userAnswer) {
        style = { ...style, borderColor: 'var(--red)', background: 'rgba(239,68,68,0.08)', color: 'var(--red)' };
        keyStyle = { ...keyStyle, background: 'var(--red)', borderColor: 'var(--red)', color: 'white' };
      }
    } else if (key === userAnswer) {
      style = { ...style, borderColor: 'var(--purple)', background: 'rgba(124,58,237,0.1)', color: 'var(--heading)' };
      keyStyle = { ...keyStyle, background: 'var(--purple)', borderColor: 'var(--purple)', color: 'white' };
    }
    return { style, keyStyle };
  };

  const typeBadgeStyle = (type) => {
    const map = {
      CBQ: { background: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
      SA:  { background: 'rgba(16,185,129,0.15)', color: 'var(--green)' },
      MCQ: { background: 'rgba(167,139,250,0.15)', color: 'var(--purple-light)' },
    };
    return { ...styles.qTypeBadge, ...(map[type] || map.MCQ) };
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.testLabel}>
            {subject.emoji} {chapter ? `Ch.${chapter.id}: ${chapter.name.slice(0,22)}…` : subject.name}
          </div>
          <div style={{
            ...styles.timerBox,
            borderColor: timerDanger ? 'var(--red)' : timerWarning ? '#fbbf24' : 'var(--border)',
            color: timerDanger ? 'var(--red)' : timerWarning ? '#fbbf24' : 'var(--heading)',
          }}>
            {timerDanger ? '⚠️ ' : ''}{timeStr}
          </div>
        </div>
        <div style={styles.qCountLabel}>
          <span>Question {currentQ + 1} of {n}</span>
          <span>{Object.keys(answers).length} answered</span>
        </div>
        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressFill, width: `${((currentQ + 1) / n) * 100}%` }} />
        </div>
      </div>

      {/* Palette */}
      <div style={styles.palette}>
        {questions.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.paletteDot,
              background: i === currentQ ? 'rgba(124,58,237,0.3)' : answers[i] !== undefined ? 'rgba(16,185,129,0.2)' : 'var(--card)',
              borderColor: i === currentQ ? 'var(--purple)' : answers[i] !== undefined ? 'var(--green)' : 'var(--border)',
              color: i === currentQ ? 'var(--purple-light)' : answers[i] !== undefined ? 'var(--green)' : 'var(--muted)',
            }}
            onClick={() => setCurrentQ(i)}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div key={currentQ} style={styles.qCard}>
          <div style={styles.qMeta}>
            <span style={styles.qNum}>Q{currentQ + 1}</span>
            <span style={typeBadgeStyle(q.type)}>
              {q.type === 'CBQ' ? 'Case Study' : q.type === 'SA' ? 'Short Answer' : 'MCQ'}
            </span>
            <span style={styles.qMarks}>{q.marks || 1} mark{(q.marks||1) > 1 ? 's' : ''}</span>
          </div>

          {q.caseText && <div style={styles.caseBlock}>{q.caseText}</div>}

          <div style={styles.qText}>{q.question}</div>

          <div style={styles.optionsList}>
            {(q.options || []).map((opt, i) => {
              const key = ['A','B','C','D'][i];
              const { style, keyStyle } = getOptionStyle(key);
              return (
                <div key={key} style={style} onClick={() => selectOption(key)}>
                  <div style={keyStyle}>{key}</div>
                  <span>{opt.replace(/^[A-D]\)\s*/, '')}</span>
                </div>
              );
            })}
          </div>

          {isLocked && q.explanation && (
            <div style={styles.explanation}>
              <strong style={{ color: 'var(--green)' }}>✓ </strong>{q.explanation}
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div style={styles.navBar}>
        <button
          style={{
            ...styles.navBtn,
            background: 'var(--card)',
            border: '1.5px solid var(--border)',
            color: 'var(--text)',
            opacity: currentQ === 0 ? 0.4 : 1,
          }}
          onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
          disabled={currentQ === 0}
        >
          ← Prev
        </button>

        {!isLast ? (
          <button
            style={{
              ...styles.navBtn,
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              color: 'white', flex: 2,
            }}
            onClick={() => setCurrentQ(q => Math.min(n - 1, q + 1))}
          >
            Next →
          </button>
        ) : (
          <button
            style={{
              ...styles.navBtn,
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', flex: 2,
              boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
            }}
            onClick={handleSubmit}
          >
            Submit Test 🏁
          </button>
        )}
      </div>
    </div>
  );
}
