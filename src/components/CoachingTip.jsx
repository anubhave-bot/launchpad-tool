import { useState } from 'react';

const styles = {
  wrapper: {
    background: 'var(--gold-light)',
    border: '1px solid var(--gold)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    marginBottom: '16px',
    fontSize: '13.5px',
    lineHeight: '1.55',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  icon: { fontSize: '16px' },
  label: { fontWeight: 600, color: 'var(--gold-dark)', flex: 1 },
  chevron: { color: 'var(--gold-dark)', fontSize: '12px', transition: 'transform 0.2s' },
  body: { marginTop: '10px', color: 'var(--gray-700)' },
  example: {
    marginTop: '8px',
    padding: '8px 10px',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '6px',
    fontStyle: 'italic',
    color: 'var(--gray-600)',
    fontSize: '13px',
  },
};

export default function CoachingTip({ tip, example, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={styles.wrapper}>
      <div style={styles.header} onClick={() => setOpen(o => !o)}>
        <span style={styles.icon}>💡</span>
        <span style={styles.label}>Coaching tip</span>
        <span style={{ ...styles.chevron, transform: open ? 'rotate(90deg)' : 'rotate(0)' }}>▶</span>
      </div>
      {open && (
        <div style={styles.body}>
          <p>{tip}</p>
          {example && <div style={styles.example}><strong>Example:</strong> {example}</div>}
        </div>
      )}
    </div>
  );
}
