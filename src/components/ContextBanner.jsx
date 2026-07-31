const S = {
  wrap: {
    background: 'var(--navy)', color: 'var(--white)',
    borderRadius: 'var(--radius)', padding: '12px 16px',
    fontSize: '12px', lineHeight: 1.6, marginBottom: '24px',
  },
  header: {
    fontSize: '9.5px', fontWeight: 800, textTransform: 'uppercase',
    letterSpacing: '0.07em', color: 'var(--gold)', marginBottom: '8px',
  },
  grid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 20px',
  },
  row: { display: 'flex', gap: '8px', alignItems: 'flex-start' },
  rowLabel: {
    fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.05em', color: 'var(--gold)', flexShrink: 0,
    marginTop: '2px', minWidth: '88px',
  },
  rowText: { opacity: 0.88, fontSize: '12px', lineHeight: 1.45 },
};

export default function ContextBanner({ context }) {
  if (!context) return null;
  const { service, currentSystem, knownProblems, catalyst } = context;
  if (!service && !currentSystem && !knownProblems && !catalyst) return null;

  const rows = [
    { label: 'Service', value: service },
    { label: 'Current system', value: currentSystem },
    { label: 'Known issues', value: knownProblems },
    { label: 'Why now', value: catalyst },
  ].filter(r => r.value);

  return (
    <div style={S.wrap}>
      <div style={S.header}>Your project context — used to personalise coaching hints</div>
      <div style={S.grid}>
        {rows.map(r => (
          <div key={r.label} style={S.row}>
            <span style={S.rowLabel}>{r.label}</span>
            <span style={S.rowText}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
