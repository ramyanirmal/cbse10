// src/components/LoadingScreen.jsx
import React, { useEffect, useState } from 'react';

const MESSAGES = [
  'Picking your questions 📋',
  'Shuffling the question bank 🔀',
  'Preparing case study passages 📄',
  'Almost ready! 🚀',
];

const styles = {
  container: {
    minHeight: '100vh',
    background: 'var(--bg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    textAlign: 'center',
  },
  card: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '40px 32px',
    maxWidth: 320,
    width: '100%',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 20,
    display: 'block',
    animation: 'float 2s ease-in-out infinite',
  },
  spinner: {
    width: 48, height: 48,
    border: '3px solid var(--border)',
    borderTopColor: 'var(--purple)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 20px',
  },
  title: {
    fontFamily: 'Fredoka One, cursive',
    fontSize: 22,
    color: 'var(--heading)',
    marginBottom: 8,
  },
  msg: {
    fontSize: 14,
    color: 'var(--muted)',
    lineHeight: 1.6,
    minHeight: 44,
    transition: 'opacity 0.3s',
  },
  subjectTag: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(124,58,237,0.12)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: 10, padding: '6px 14px',
    fontSize: 12, fontWeight: 700, color: 'var(--purple-light)',
    marginTop: 16,
  },
};

export default function LoadingScreen({ subject, chapter }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setMsgIdx(i => (i + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card} className="animate-bounce-in">
        <span style={styles.emoji} className="animate-float">{subject.emoji}</span>
        <div style={styles.spinner} />
        <div style={styles.title}>Generating Questions</div>
        <div style={styles.msg} className="animate-fade">{MESSAGES[msgIdx]}</div>
        <div style={styles.subjectTag}>
          {subject.emoji} {chapter ? `Ch.${chapter.id}: ${chapter.name}` : subject.name}
        </div>
      </div>
    </div>
  );
}
