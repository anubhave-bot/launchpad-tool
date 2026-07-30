const STEPS = [
  { id: 0, label: 'Project Setup' },
  { id: 1, label: 'User Research' },
  { id: 2, label: 'User Groups' },
  { id: 3, label: 'Core Problems' },
  { id: 4, label: 'Product Strategy' },
  { id: 5, label: 'Review & Export' },
];

const styles = {
  wrapper: {
    background: 'var(--white)',
    borderBottom: '1px solid var(--gray-200)',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: 'var(--shadow)',
  },
  inner: {
    maxWidth: '860px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'stretch',
    gap: '0',
  },
  step: (active, done) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '14px 6px 12px',
    cursor: active ? 'default' : 'pointer',
    borderBottom: active ? '3px solid var(--gold)' : '3px solid transparent',
    transition: 'border-color 0.2s',
    gap: '6px',
  }),
  dot: (active, done) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    background: done ? 'var(--green)' : active ? 'var(--gold)' : 'var(--gray-200)',
    color: done || active ? 'var(--white)' : 'var(--gray-500)',
    transition: 'background 0.2s',
    flexShrink: 0,
  }),
  label: (active) => ({
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    color: active ? 'var(--navy)' : 'var(--gray-500)',
    textAlign: 'center',
    lineHeight: '1.3',
  }),
  savedBadge: {
    fontSize: '11px',
    color: 'var(--green)',
    textAlign: 'center',
    padding: '4px 0 6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    borderBottom: '1px solid var(--gray-100)',
  },
};

export default function ProgressBar({ currentStep, lastSaved, onNavigate }) {
  return (
    <div style={styles.wrapper}>
      {lastSaved && (
        <div style={styles.savedBadge}>
          ✓ Auto-saved {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      <div style={styles.inner}>
        {STEPS.map(s => {
          const done = s.id < currentStep;
          const active = s.id === currentStep;
          return (
            <div
              key={s.id}
              style={styles.step(active, done)}
              onClick={() => !active && onNavigate(s.id)}
              title={!active ? `Go to ${s.label}` : undefined}
            >
              <div style={styles.dot(active, done)}>
                {done ? '✓' : s.id + 1}
              </div>
              <span style={styles.label(active)}>{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
