const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0 8px',
    borderTop: '1px solid var(--gray-200)',
    marginTop: '8px',
  },
  btn: (variant) => ({
    padding: '10px 22px',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    border: variant === 'primary' ? 'none' : '1.5px solid var(--gray-300)',
    background: variant === 'primary' ? 'var(--gold)' : 'var(--white)',
    color: variant === 'primary' ? 'var(--white)' : 'var(--gray-700)',
    transition: 'background 0.15s, transform 0.1s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  }),
  hint: { fontSize: '12px', color: 'var(--gray-400)' },
};

export default function NavButtons({ onBack, onNext, backLabel = '← Back', nextLabel = 'Save & Continue →', hint }) {
  return (
    <div style={styles.wrapper}>
      <button style={styles.btn('secondary')} onClick={onBack} disabled={!onBack}>
        {onBack ? backLabel : ''}
      </button>
      <span style={styles.hint}>{hint}</span>
      <button style={styles.btn('primary')} onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );
}
