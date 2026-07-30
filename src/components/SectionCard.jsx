const styles = {
  card: {
    background: 'var(--white)',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-lg)',
    padding: '28px 32px',
    marginBottom: '20px',
    boxShadow: 'var(--shadow)',
  },
  cardTitle: {
    fontSize: '17px',
    fontWeight: 700,
    color: 'var(--navy)',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  cardSubtitle: {
    fontSize: '13.5px',
    color: 'var(--gray-500)',
    marginBottom: '20px',
    lineHeight: '1.55',
  },
  divider: { border: 'none', borderTop: '1px solid var(--gray-200)', margin: '20px 0' },
  badge: {
    display: 'inline-block',
    background: 'var(--gold-light)',
    color: 'var(--gold-dark)',
    border: '1px solid var(--gold)',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
};

export default function SectionCard({ title, subtitle, badge, children, icon }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>
        {icon && <span>{icon}</span>}
        {title}
        {badge && <span style={styles.badge}>{badge}</span>}
      </div>
      {subtitle && <p style={styles.cardSubtitle}>{subtitle}</p>}
      <hr style={styles.divider} />
      {children}
    </div>
  );
}
