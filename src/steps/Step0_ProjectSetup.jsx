import Field from '../components/Field';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';

const styles = {
  contextBox: {
    background: 'var(--gold-light)',
    border: '2px solid var(--gold)',
    borderRadius: 'var(--radius-lg)',
    padding: '22px 24px',
    marginBottom: '24px',
  },
  contextTitle: { fontWeight: 800, fontSize: '15px', color: 'var(--navy)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' },
  contextSub: { fontSize: '13px', color: 'var(--gray-600)', lineHeight: '1.6', marginBottom: '16px' },
  contextLabel: { fontWeight: 600, fontSize: '13.5px', color: 'var(--gray-700)', marginBottom: '5px', display: 'block' },
  contextSublabel: { fontSize: '12.5px', color: 'var(--gray-500)', lineHeight: '1.5', marginBottom: '8px' },
  contextTextarea: {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--gold)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', lineHeight: '1.6',
    resize: 'vertical', outline: 'none',
    background: 'var(--white)',
    marginBottom: '12px',
  },
  hero: {
    background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)',
    color: 'var(--white)',
    padding: '48px 32px 40px',
    textAlign: 'center',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '28px',
  },
  heroTitle: { fontSize: '28px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.5px' },
  heroSub: { fontSize: '15px', opacity: 0.85, maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.6' },
  badge: {
    display: 'inline-block',
    background: 'var(--gold)',
    color: 'var(--navy)',
    borderRadius: '20px',
    padding: '4px 16px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  whatExpect: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '28px',
  },
  expectCard: {
    background: 'var(--white)',
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    boxShadow: 'var(--shadow)',
  },
  expectIcon: { fontSize: '24px', marginBottom: '6px' },
  expectTitle: { fontWeight: 700, fontSize: '13px', color: 'var(--navy)', marginBottom: '4px' },
  expectDesc: { fontSize: '12.5px', color: 'var(--gray-500)', lineHeight: '1.5' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
};

const STAGES = [
  { icon: '🔍', title: 'User Research', desc: 'Document who your users are and what interviews you conducted' },
  { icon: '👥', title: 'User Groups', desc: 'Define needs, pain points, and journeys for each primary user group' },
  { icon: '🎯', title: 'Core Problems', desc: 'Identify up to 3 foundational problems with measurable success criteria' },
  { icon: '🗺️', title: 'Product Strategy', desc: 'Choose your product direction and document what you considered' },
];

export default function Step0_ProjectSetup({ state, setState, onNext }) {
  const meta = state.meta;
  const update = (field) => (val) => setState(s => ({ ...s, meta: { ...s.meta, [field]: val } }));

  return (
    <div>
      <div style={styles.hero}>
        <div style={styles.badge}>MITDP Launchpad · Stage 1</div>
        <h1 style={styles.heroTitle}>Welcome to the Launchpad Wizard</h1>
        <p style={styles.heroSub}>
          This guided tool will walk you through completing Stage 1 of your MITDP Launchpad —
          with coaching tips and follow-up questions at every step to help you think like a product team.
        </p>
      </div>

      <div style={styles.whatExpect}>
        {STAGES.map(s => (
          <div key={s.title} style={styles.expectCard}>
            <div style={styles.expectIcon}>{s.icon}</div>
            <div style={styles.expectTitle}>{s.title}</div>
            <div style={styles.expectDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={styles.contextBox}>
        <div style={styles.contextTitle}>
          <span>🎯</span> Before we start: tell us about your service and situation
        </div>
        <div style={styles.contextSub}>
          These four questions give the tool the background it needs to make every coaching question relevant to your specific service.
          Your answers here are <strong>not</strong> Launchpad answers — they are context for the coach. You will discover your users, problems, and strategy through the guided process that follows.
          Be candid. The more specific you are, the more useful the guidance will be.
        </div>

        <label style={styles.contextLabel}>1. What does this service do? <span style={{ color: 'var(--red)' }}>*</span></label>
        <div style={styles.contextSublabel}>
          Describe the function and purpose of the service in plain language — what it does and which agency or program runs it.
          Don't describe the users or problems yet. Two sentences is enough.
        </div>
        <textarea
          style={styles.contextTextarea}
          rows={2}
          value={meta.serviceDescription || ''}
          onChange={e => update('serviceDescription')(e.target.value)}
          placeholder="e.g., Our agency issues occupational therapy licenses to healthcare professionals in Maryland. The Maryland Board of Occupational Therapy Practice administers the process under the Department of Labor."
        />

        <label style={styles.contextLabel}>2. How does the current process or system work today?</label>
        <div style={styles.contextSublabel}>
          Walk through what someone has to do right now to use this service — the steps, the channels, the handoffs.
          Include both the user-facing experience and the back-office process. What technology (if any) supports it today?
        </div>
        <textarea
          style={styles.contextTextarea}
          rows={3}
          value={meta.currentSystem || ''}
          onChange={e => update('currentSystem')(e.target.value)}
          placeholder="e.g., Applicants download a PDF form from the agency website, fill it out by hand, and mail it with supporting documents and a check. Staff log each application in a spreadsheet and manually review documents. Approvals are mailed back. There is no online option and no way for applicants to check status."
        />

        <label style={styles.contextLabel}>3. What problems or complaints are already known?</label>
        <div style={styles.contextSublabel}>
          What do you already know — from complaints, audits, staff feedback, leadership observations, or your own experience —
          is not working well? Don't filter or frame these formally. Just describe what you've heard or seen.
        </div>
        <textarea
          style={styles.contextTextarea}
          rows={3}
          value={meta.knownProblems || ''}
          onChange={e => update('knownProblems')(e.target.value)}
          placeholder="e.g., Processing takes 10–14 weeks on average. Applicants call constantly to check status because there's no tracking. Staff spend most of their time on data entry. Errors in mailed applications cause back-and-forth that adds weeks. The spreadsheet has crashed twice."
        />

        <label style={styles.contextLabel}>4. What triggered this project? Why is this being worked on now?</label>
        <div style={styles.contextSublabel}>
          What event, mandate, complaint threshold, leadership directive, or deadline prompted action?
          This context helps frame urgency and scope — it is not a Launchpad answer.
        </div>
        <textarea
          style={{ ...styles.contextTextarea, marginBottom: 0 }}
          rows={2}
          value={meta.projectCatalyst || ''}
          onChange={e => update('projectCatalyst')(e.target.value)}
          placeholder="e.g., A legislative audit found average wait times of 14 weeks and 400+ complaints last year. The Secretary directed the agency to modernize the process within 18 months."
        />
      </div>

      <SectionCard title="Project Details" icon="📋" subtitle="Basic information about your MITDP project. This will appear on all exported documents.">
        <Field
          label="Project Name"
          value={meta.projectName}
          onChange={update('projectName')}
          placeholder="e.g., Residential Permit Modernization"
          required
        />
        <div style={styles.row}>
          <Field
            label="Agency / Department"
            value={meta.agency}
            onChange={update('agency')}
            placeholder="e.g., Maryland DoIT"
            required
          />
          <Field
            label="Project Owner Name"
            value={meta.ownerName}
            onChange={update('ownerName')}
            placeholder="Full name"
            required
          />
        </div>
        <Field
          label="Project Owner Email"
          type="email"
          value={meta.ownerEmail}
          onChange={update('ownerEmail')}
          placeholder="name@maryland.gov"
        />
      </SectionCard>

      <div style={{
        border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius-lg)',
        padding: '20px 24px', marginBottom: '24px',
        background: meta.aiAssist ? '#F0F7FF' : 'var(--white)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--navy)', marginBottom: '4px' }}>
              Use AI to fill draft Launchpad answers
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--gray-500)', lineHeight: 1.6 }}>
              When ON: after filling in the coaching questions, a <strong>"Generate draft"</strong> button appears on each answer field.
              It assembles a draft <strong>strictly from what you typed in the coaching questions</strong> — no other information is used.
              Drafts are clearly marked and must be reviewed and edited before submitting.
            </div>
            {meta.aiAssist && (
              <div style={{ marginTop: 10, fontSize: '12px', color: '#1a6bb5', fontWeight: 600 }}>
                ✓ AI drafting is ON — look for "Generate draft" buttons on each answer field.
              </div>
            )}
          </div>
          <button
            onClick={() => update('aiAssist')(!meta.aiAssist)}
            style={{
              flexShrink: 0, padding: '8px 20px', borderRadius: 'var(--radius)',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
              border: meta.aiAssist ? '2px solid #1a6bb5' : '1.5px solid var(--gray-300)',
              background: meta.aiAssist ? '#1a6bb5' : 'var(--white)',
              color: meta.aiAssist ? 'var(--white)' : 'var(--gray-600)',
            }}
          >
            {meta.aiAssist ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <NavButtons
        onBack={null}
        onNext={onNext}
        nextLabel="Start Section 1: User Research →"
        hint="Your progress is saved automatically"
      />
    </div>
  );
}
