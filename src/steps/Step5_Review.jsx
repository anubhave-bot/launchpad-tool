import { useRef } from 'react';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';

const styles = {
  exportBar: {
    background: 'var(--navy)',
    color: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 28px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  exportTitle: { fontSize: '18px', fontWeight: 700, marginBottom: '4px' },
  exportSub: { fontSize: '13px', opacity: 0.75 },
  exportBtns: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  exportBtn: (variant) => ({
    padding: '10px 20px',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px',
    fontWeight: 700,
    cursor: 'pointer',
    border: variant === 'primary' ? 'none' : '1.5px solid rgba(255,255,255,0.4)',
    background: variant === 'primary' ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
    color: variant === 'primary' ? 'var(--navy)' : 'var(--white)',
    display: 'flex', alignItems: 'center', gap: '6px',
  }),
  checkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '10px',
    marginBottom: '24px',
  },
  checkItem: (ok) => ({
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderRadius: 'var(--radius)',
    background: ok ? 'var(--green-light)' : 'var(--gold-light)',
    border: `1px solid ${ok ? 'var(--green)' : 'var(--gold)'}`,
  }),
  checkIcon: (ok) => ({
    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
    background: ok ? 'var(--green)' : 'var(--gold)',
    color: 'var(--white)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700, marginTop: '1px',
  }),
  checkText: { fontSize: '13px', lineHeight: '1.5' },
  checkLabel: (ok) => ({ fontWeight: 600, color: ok ? 'var(--green)' : 'var(--gold-dark)', display: 'block', marginBottom: '2px' }),
  reviewSection: {
    marginBottom: '28px',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  reviewHeader: {
    background: 'var(--gray-50)',
    padding: '14px 20px',
    borderBottom: '1px solid var(--gray-200)',
    fontWeight: 700,
    fontSize: '15px',
    color: 'var(--navy)',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  reviewBody: { padding: '16px 20px' },
  reviewRow: { display: 'grid', gridTemplateColumns: '200px 1fr', gap: '8px', marginBottom: '10px', fontSize: '13.5px' },
  reviewLabel: { color: 'var(--gray-500)', fontWeight: 600, paddingTop: '1px' },
  reviewValue: { color: 'var(--gray-900)', whiteSpace: 'pre-wrap', lineHeight: '1.6' },
  empty: { color: 'var(--gray-400)', fontStyle: 'italic' },
  subSection: {
    background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '14px 16px',
    marginBottom: '12px', border: '1px solid var(--gray-200)',
  },
  subTitle: { fontWeight: 700, color: 'var(--navy)', fontSize: '13px', marginBottom: '8px' },
  printArea: {},
};

function val(v) {
  return v ? <span>{v}</span> : <span style={styles.empty}>Not provided</span>;
}

function Row({ label, value }) {
  return (
    <div style={styles.reviewRow}>
      <span style={styles.reviewLabel}>{label}</span>
      <span style={styles.reviewValue}>{val(value)}</span>
    </div>
  );
}

function ReviewSection({ title, icon, children }) {
  return (
    <div style={styles.reviewSection}>
      <div style={styles.reviewHeader}>{icon} {title}</div>
      <div style={styles.reviewBody}>{children}</div>
    </div>
  );
}

function computeChecks(state) {
  const ur = state.userResearch;
  const pg = state.primaryUserGroups;
  const cp = state.coreProblems;
  const ps = state.productStrategy;
  const totalInterviews = ur.participants.reduce((sum, p) => sum + (parseInt(p.count) || 0), 0);

  return [
    {
      label: 'Project details complete',
      ok: !!(state.meta.projectName && state.meta.agency && state.meta.ownerName),
      note: 'Project name, agency, and owner name are filled in',
    },
    {
      label: 'User groups identified',
      ok: ur.userGroups.filter(g => g.name && g.isPrimary).length >= 2,
      note: 'At least 2 primary user groups with names',
    },
    {
      label: 'Minimum 9 interviews',
      ok: totalInterviews >= 9,
      note: `${totalInterviews} interview participants logged`,
    },
    {
      label: '3 participants per primary group',
      ok: ur.userGroups.filter(g => g.isPrimary).every(g => {
        const count = ur.participants.filter(p => p.userGroup === g.name).reduce((s, p) => s + (parseInt(p.count) || 0), 0);
        return count >= 3;
      }),
      note: 'Each primary group has at least 3 interview participants',
    },
    {
      label: 'Primary user groups documented',
      ok: pg.every(g => g.name && g.painPoints.filter(Boolean).length >= 3),
      note: 'Each group has a name and at least 3 pain points',
    },
    {
      label: 'Core problems defined',
      ok: cp.every(p => p.name && p.currentState && p.undesiredOutcome && p.definitionOfSuccess),
      note: 'Each problem has a full statement and definition of success',
    },
    {
      label: 'Success metrics provided',
      ok: cp.every(p => p.metrics.some(m => m.description && m.currentValue && m.targetValue)),
      note: 'Each problem has at least one metric with current and target values',
    },
    {
      label: 'Product strategy documented',
      ok: !!(ps.chosenStrategy && ps.rejectedStrategies && ps.firstRelease),
      note: 'Chosen strategy, rejected alternatives, and first release are filled in',
    },
  ];
}

export default function Step5_Review({ state, onBack, onRestart }) {
  const printRef = useRef();
  const checks = computeChecks(state);
  const allGood = checks.every(c => c.ok);
  const { meta, userResearch: ur, primaryUserGroups: pg, coreProblems: cp, productStrategy: ps } = state;

  function handlePrint() {
    window.print();
  }

  function handleExportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MITDP_Launchpad_${(meta.projectName || 'export').replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={styles.exportBar}>
        <div>
          <div style={styles.exportTitle}>📄 {meta.projectName || 'Your Launchpad'} — Stage 1 Review</div>
          <div style={styles.exportSub}>{meta.agency} · {meta.ownerName} · Reviewed {new Date().toLocaleDateString()}</div>
        </div>
        <div style={styles.exportBtns}>
          <button style={styles.exportBtn('secondary')} onClick={handleExportJSON}>⬇ Export JSON</button>
          <button style={styles.exportBtn('primary')} onClick={handlePrint}>🖨 Print / Save PDF</button>
        </div>
      </div>

      <SectionCard title="Readiness Checklist" icon="✅" subtitle="Based on the MITDP acceptance criteria. Resolve any warnings before submitting.">
        <div style={styles.checkGrid}>
          {checks.map((c, i) => (
            <div key={i} style={styles.checkItem(c.ok)}>
              <div style={styles.checkIcon(c.ok)}>{c.ok ? '✓' : '!'}</div>
              <div style={styles.checkText}>
                <span style={styles.checkLabel(c.ok)}>{c.label}</span>
                {c.note}
              </div>
            </div>
          ))}
        </div>
        {allGood && (
          <div style={{ background: 'var(--green)', color: 'var(--white)', borderRadius: 'var(--radius)', padding: '14px 18px', fontWeight: 700, fontSize: '14px', textAlign: 'center' }}>
            ✓ All checks pass — your Stage 1 Launchpad is ready to submit to dlmodmissioncontrol_doit@maryland.gov
          </div>
        )}
      </SectionCard>

      <div ref={printRef} style={styles.printArea}>
        <ReviewSection title="Project Details" icon="📋">
          <Row label="Project Name" value={meta.projectName} />
          <Row label="Agency" value={meta.agency} />
          <Row label="Owner" value={meta.ownerName} />
          <Row label="Email" value={meta.ownerEmail} />
        </ReviewSection>

        <ReviewSection title="User Research Summary" icon="🔍">
          <div style={{ marginBottom: '16px' }}>
            <div style={styles.subTitle}>User Groups</div>
            {ur.userGroups.map((g, i) => (
              <div key={i} style={styles.subSection}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{g.name || `Group ${i + 1}`} {g.isPrimary ? '(Primary)' : '(Additional)'}</div>
                <Row label="Description" value={g.description} />
                <Row label="Current users" value={g.currentUsers} />
                <Row label="Potential users" value={g.potentialUsers} />
              </div>
            ))}
          </div>
          <Row label="Data Sources" value={ur.dataSources} />
          <Row label="Research Plan" value={ur.researchPlan.name} />
          <div style={{ marginTop: '12px' }}>
            <div style={styles.subTitle}>Interview Participants ({ur.participants.reduce((s, p) => s + (parseInt(p.count) || 0), 0)} total)</div>
            {ur.participants.map((p, i) => (
              <div key={i} style={styles.subSection}>
                <Row label="User Group" value={p.userGroup} />
                <Row label="Participants" value={p.count} />
                <Row label="Date" value={p.dateRange} />
                <Row label="Duration" value={p.duration} />
                <Row label="Recruiting" value={p.recruitingMethod} />
                <Row label="Guide Used" value={p.guideUsed} />
              </div>
            ))}
          </div>
          <Row label="Synthesis Notes" value={ur.synthesisNotes} />
        </ReviewSection>

        <ReviewSection title="Primary User Groups" icon="👥">
          {pg.map((g, i) => (
            <div key={i} style={{ ...styles.subSection, marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)', marginBottom: '10px' }}>Group {i + 1}: {g.name}</div>
              <div style={{ marginBottom: '8px' }}>
                <div style={styles.subTitle}>User Needs</div>
                {g.needs.filter(Boolean).map((n, j) => <div key={j} style={{ fontSize: '13.5px', marginBottom: '4px', paddingLeft: '12px' }}>• {n}</div>)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={styles.subTitle}>Pain Points</div>
                {g.painPoints.filter(Boolean).map((p, j) => <div key={j} style={{ fontSize: '13.5px', marginBottom: '4px', paddingLeft: '12px' }}>• {p}</div>)}
              </div>
              <Row label="Opportunities" value={g.opportunities} />
              <Row label="Tech / Barriers" value={g.technologyBarriers} />
              <Row label="Journey Map" value={g.journeyMap} />
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Core Problems & Definition of Success" icon="🎯">
          {cp.map((p, i) => (
            <div key={i} style={{ ...styles.subSection, marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)', marginBottom: '10px' }}>Problem {i + 1}: {p.name}</div>
              <Row label="Current situation" value={p.currentState} />
              <Row label="Undesired outcome" value={p.undesiredOutcome} />
              <Row label="Context" value={p.context} />
              <Row label="Desired outcome" value={p.desiredOutcome} />
              <Row label="Related issues" value={p.relatedIssues} />
              <Row label="Definition of success" value={p.definitionOfSuccess} />
              <div style={{ marginTop: '10px', marginBottom: '8px' }}>
                <div style={styles.subTitle}>Impacts for Marylanders</div>
                {p.impacts.filter(Boolean).map((imp, j) => <div key={j} style={{ fontSize: '13.5px', marginBottom: '4px', paddingLeft: '12px' }}>• {imp}</div>)}
              </div>
              <div>
                <div style={styles.subTitle}>Success Metrics</div>
                {p.metrics.filter(m => m.description).map((m, j) => (
                  <div key={j} style={{ fontSize: '13.5px', marginBottom: '8px', paddingLeft: '12px' }}>
                    <strong>{m.description}</strong>: {m.currentValue} → {m.targetValue}
                    {m.source && <div style={{ color: 'var(--gray-500)', fontSize: '12px' }}>Source: {m.source}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Product Strategy" icon="🗺️">
          <Row label="Chosen strategy" value={ps.chosenStrategy} />
          <Row label="Trade-offs" value={ps.chosenTradeoffs} />
          <Row label="Artifacts" value={ps.chosenArtifacts} />
          <Row label="Rejected alternatives" value={ps.rejectedStrategies} />
          <Row label="Rejected trade-offs" value={ps.rejectedTradeoffs} />
          <Row label="First release scope" value={ps.firstRelease} />
          <Row label="First release value" value={ps.firstReleaseValue} />
          <Row label="How you'll test it" value={ps.firstReleaseArtifacts} />
        </ReviewSection>
      </div>

      <NavButtons
        onBack={onBack}
        onNext={null}
        nextLabel=""
        hint={`Last saved: ${state.meta.lastSaved ? new Date(state.meta.lastSaved).toLocaleString() : 'not yet saved'}`}
      />

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; top: 0; left: 0; width: 100%; }
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
