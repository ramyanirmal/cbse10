// src/screens/ResultScreen.jsx
import React, { useEffect, useRef } from 'react';
import { PASS_THRESHOLD } from '../data/subjects';

// Simple confetti burst using canvas
function fireConfetti(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 6 + 3,
    d: Math.random() * 120,
    color: ['#7c3aed','#ec4899','#fbbf24','#10b981','#06b6d4','#a78bfa'][Math.floor(Math.random()*6)],
    tilt: Math.floor(Math.random() * 10) - 10,
    tiltAngle: 0,
    tiltAngleInc: Math.random() * 0.07 + 0.05,
  }));
  let angle = 0, frame;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    angle += 0.01;
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.y += (Math.cos(angle + p.d) + 1 + p.r/2) * 1.5;
      p.tilt = Math.sin(p.tiltAngle) * 15;
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r/4, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/4);
      ctx.stroke();
    });
    if (particles.some(p => p.y < canvas.height + 20)) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  draw();
  return () => cancelAnimationFrame(frame);
}

const styles = {
  container: { minHeight: '100vh', background: 'var(--bg)', paddingBottom: 80, position: 'relative' },
  canvas: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 },

  header: {
    padding: '20px 16px 0',
    textAlign: 'center',
    marginBottom: 24,
  },
  subjectTag: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '6px 14px',
    fontSize: 12, fontWeight: 700, color: 'var(--muted)',
    marginBottom: 16,
  },

  resultCard: {
    margin: '0 16px 20px',
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 24,
    padding: '28px 20px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  passLabel: {
    fontFamily: 'Fredoka One, cursive',
    fontSize: 36,
    marginBottom: 4,
  },
  scoreRow: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: 'var(--muted)',
    marginBottom: 16,
  },

  bigPct: {
    fontFamily: 'Fredoka One, cursive',
    fontSize: 72,
    lineHeight: 1,
    marginBottom: 4,
  },
  pctLabel: { fontSize: 13, color: 'var(--muted)', marginBottom: 20 },

  xpEarned: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'rgba(124,58,237,0.15)',
    border: '1.5px solid rgba(167,139,250,0.3)',
    borderRadius: 12, padding: '10px 20px',
    fontSize: 16, fontWeight: 900, color: 'var(--purple-light)',
    marginBottom: 8,
    animation: 'bounceIn 0.5s ease',
  },

  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8,
    margin: '0 16px 20px',
  },
  stat: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '14px 8px', textAlign: 'center',
  },
  statNum: { fontSize: 22, fontWeight: 900, lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },

  badgeSection: { margin: '0 16px 20px' },
  badgeTitle: { fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 12 },
  badgeRow: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  badgeCard: {
    background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))',
    border: '1.5px solid rgba(167,139,250,0.4)',
    borderRadius: 14, padding: '12px 14px',
    display: 'flex', alignItems: 'center', gap: 10,
    animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
  },
  badgeEmoji: { fontSize: 26, lineHeight: 1 },
  badgeName: { fontSize: 13, fontWeight: 800, color: 'var(--heading)', marginBottom: 2 },
  badgeDesc: { fontSize: 10, color: 'var(--muted)' },

  msgBox: {
    margin: '0 16px 20px',
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '14px 16px',
    fontSize: 14, color: 'var(--text)', lineHeight: 1.6, textAlign: 'center', fontWeight: 600,
  },

  actions: { margin: '0 16px', display: 'flex', gap: 10 },
  actionBtn: {
    flex: 1, padding: '14px',
    border: 'none', borderRadius: 14,
    fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14,
    cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
};

function getMessage(pct, passed) {
  if (pct === 100) return "PERFECT SCORE! You are absolutely unstoppable! 🔥👑";
  if (pct >= 90) return "Outstanding! Board exams won't know what hit them! ⭐";
  if (pct >= 75) return "Really strong! You're on the right track, keep going! 🚀";
  if (pct >= 60) return "Good work! A little more revision and you'll ace it! 💪";
  if (passed) return "You passed! But there's room to grow — revisit the chapter! 📖";
  return "Don't give up! Review the material and try again — you've got this! 💖";
}

export default function ResultScreen({ result, subject, chapter, xpEarned, newBadges, onRetake, onHome }) {
  const canvasRef = useRef(null);
  const { correct, total, marks, maxMarks, timeSecs } = result;
  const pct = Math.round((marks / maxMarks) * 100);
  const passed = pct >= PASS_THRESHOLD;
  const mins = Math.floor(timeSecs / 60);
  const secs = timeSecs % 60;

  useEffect(() => {
    if (passed) {
      const cancel = fireConfetti(canvasRef.current);
      return cancel;
    }
  }, [passed]);

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      <div style={{ height: 20 }} />

      {/* Subject tag */}
      <div style={{ textAlign: 'center' }}>
        <div style={styles.subjectTag}>
          {subject.emoji} {chapter ? `Ch.${chapter.id}: ${chapter.name}` : subject.name}
        </div>
      </div>

      {/* Main Result Card */}
      <div style={{ ...styles.resultCard, borderColor: passed ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
        {/* Glow behind */}
        <div style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 200, height: 200,
          background: passed
            ? 'radial-gradient(ellipse, rgba(16,185,129,0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(239,68,68,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ ...styles.passLabel, color: passed ? 'var(--green)' : 'var(--red)' }} className="animate-bounce-in">
          {passed ? '🎉 PASSED!' : '😔 Not Yet'}
        </div>
        <div style={styles.scoreRow}>
          {marks} / {maxMarks} marks · {correct}/{total} correct
        </div>

        <div style={{ ...styles.bigPct, color: passed ? 'var(--green)' : 'var(--red)' }} className="animate-bounce-in">
          {pct}%
        </div>
        <div style={styles.pctLabel}>
          Pass mark: {PASS_THRESHOLD}% · {passed ? 'Above' : 'Below'} threshold
        </div>

        <div style={styles.xpEarned} className="animate-bounce-in">
          ✨ +{xpEarned} XP earned!
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.stat}>
          <div style={{ ...styles.statNum, color: 'var(--green)' }}>{correct}</div>
          <div style={styles.statLabel}>Correct</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statNum, color: 'var(--red)' }}>{total - correct}</div>
          <div style={styles.statLabel}>Wrong</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statNum, color: '#fbbf24' }}>{pct}%</div>
          <div style={styles.statLabel}>Score</div>
        </div>
        <div style={styles.stat}>
          <div style={{ ...styles.statNum, color: 'var(--cyan)' }}>{mins}m{secs}s</div>
          <div style={styles.statLabel}>Time</div>
        </div>
      </div>

      {/* New Badges */}
      {newBadges?.length > 0 && (
        <div style={styles.badgeSection}>
          <div style={styles.badgeTitle}>🏅 New Badges Unlocked!</div>
          <div style={styles.badgeRow}>
            {newBadges.map((b, i) => (
              <div key={b.id} style={{ ...styles.badgeCard, animationDelay: `${i * 150}ms` }}>
                <div style={styles.badgeEmoji}>{b.emoji}</div>
                <div>
                  <div style={styles.badgeName}>{b.name}</div>
                  <div style={styles.badgeDesc}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div style={styles.msgBox}>{getMessage(pct, passed)}</div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{ ...styles.actionBtn, background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
          onClick={onRetake}
        >
          🔄 Retake
        </button>
        <button
          style={{ ...styles.actionBtn, background: 'linear-gradient(135deg,#7c3aed,#ec4899)', color: 'white', flex: 2 }}
          onClick={onHome}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
}
