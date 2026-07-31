import GuidedQuestion from '../components/GuidedQuestion';
import ContextBanner from '../components/ContextBanner';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';

const S = {
  strategyGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 12, marginBottom: 20,
  },
  stratCard: (sel) => ({
    padding: '14px 16px', borderRadius: 'var(--radius)',
    border: sel ? '2px solid var(--gold)' : '1.5px solid var(--gray-200)',
    background: sel ? 'var(--gold-light)' : 'var(--white)',
    cursor: 'pointer',
  }),
  stratIcon: { fontSize: 22, marginBottom: 6 },
  stratTitle: (sel) => ({ fontWeight: 700, fontSize: 13, color: sel ? 'var(--gold-dark)' : 'var(--navy)', marginBottom: 4 }),
  stratDesc: { fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 },
  label: { fontWeight: 600, fontSize: '13.5px', color: 'var(--gray-700)', marginBottom: 4, display: 'block' },
  sublabel: { fontSize: '12.5px', color: 'var(--gray-500)', marginBottom: 8, lineHeight: 1.5 },
  textarea: {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', lineHeight: 1.6,
    resize: 'vertical', outline: 'none',
  },
  finalInput: {
    width: '100%', padding: '10px 12px',
    border: '2px solid var(--navy)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', lineHeight: 1.6,
    resize: 'vertical', outline: 'none',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 },
  fieldBlock: { marginBottom: 18 },
  problemsBox: {
    background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius)', padding: '12px 14px',
    marginBottom: 16, fontSize: 13,
  },
};

const ARCHETYPES = [
  { id: 'new_build', icon: '🏗️', title: 'Build new', desc: 'Design and develop a custom digital service from scratch' },
  { id: 'configure_cots', icon: '🔧', title: 'Configure off-the-shelf', desc: 'Buy and configure an existing product to meet your needs' },
  { id: 'modernize', icon: '♻️', title: 'Modernize existing', desc: 'Incrementally improve or replace a legacy system' },
  { id: 'no_code_low_code', icon: '⚡', title: 'Low-code / no-code', desc: 'Use a platform that lets non-engineers build the product' },
  { id: 'service_redesign', icon: '🗺️', title: 'Service redesign (non-tech)', desc: 'Redesign the process, forms, or policy — not just the technology' },
  { id: 'hybrid', icon: '🔀', title: 'Hybrid', desc: 'Combination of the above — describe below' },
];

export default function Step4_ProductStrategy({ state, setState, onNext, onBack }) {
  const ps = state.productStrategy;
  const coaching = state.coaching || {};
  const upd = (field) => (val) => setState(s => ({ ...s, productStrategy: { ...s.productStrategy, [field]: val } }));
  const setCoach = (key, val) => setState(s => ({ ...s, coaching: { ...s.coaching, [key]: val } }));

  const { serviceDescription, currentSystem, knownProblems, projectCatalyst } = state.meta;
  const ctx = (serviceDescription || currentSystem || knownProblems || projectCatalyst) ? {
    service: serviceDescription || null,
    currentSystem: currentSystem || null,
    knownProblems: knownProblems || null,
    catalyst: projectCatalyst || null,
  } : null;

  // Context shortcuts for dynamic hints
  const svc = ctx?.service ? ctx.service.split('.')[0] : 'your service';
  const sys = ctx?.currentSystem ? ctx.currentSystem.substring(0, 120) : null;
  const probs = ctx?.knownProblems ? ctx.knownProblems.substring(0, 120) : null;
  const catalyst = ctx?.catalyst ? ctx.catalyst.substring(0, 120) : null;

  const problems = state.coreProblems.filter(p => p.name).map(p => p.name);

  const psStrategyQuestions = [
    {
      id: 'ps_analogy',
      text: 'Imagine your service as a physical business. Would it be a storefront, a mobile van, a marketplace, a subscription service, a self-service kiosk? What analogy fits best and why?',
      hint: `This exercise clarifies the fundamental nature of ${svc}. A storefront is a fixed place people come to; a mobile van goes to them; a marketplace connects people. The analogy reveals what kind of product experience you're designing.${sys ? ` Your current system: "${sys}" — is it more like a storefront (people come to it) or something else?` : ''}`,
      placeholder: 'e.g., We\'re like a service desk that should become a self-service kiosk — instead of making people come to us during business hours, we bring the service to wherever users are, whenever they need it.',
      rows: 2,
    },
    {
      id: 'ps_approach',
      text: 'Review your core problems above. For each problem, what kind of solution would directly address it? What are the realistic options?',
      hint: `For each problem in ${svc}, brainstorm 2–3 distinct approaches. One might be building new software. Another might be configuring an existing product. A third might be redesigning the paper process.${probs ? ` You noted: "${probs}" — what's the most direct fix for each?` : ' List the realistic options before choosing.'}`,
      placeholder: 'e.g., Problem 1 ([your core problem]): Option A — build a custom digital submission flow. Option B — configure an existing off-the-shelf platform. Option C — redesign the intake workflow without technology. Problem 2 (status visibility): Option A — automated email/SMS updates. Option B — a self-service status page.',
      rows: 4,
    },
    {
      id: 'ps_constraints',
      text: 'What constraints must your strategy work within? Think about budget, timeline, vendor access, legacy system dependencies, policy, and staff capacity.',
      hint: `Constraints rule out options for ${svc}.${sys ? ` You described the current system as: "${sys}" — what dependencies or integration requirements does that create?` : ' "We must integrate with an existing agency system" eliminates products that can\'t connect to it.'}${catalyst ? ` You noted the catalyst: "${catalyst}" — does that create timeline or scope constraints?` : ''}`,
      placeholder: 'e.g., Must integrate with [existing agency system]. 18-month timeline. Limited in-house technical staff — need a vendor. Maryland enterprise contract vehicles preferred. Policy requires [specific compliance requirement].',
      rows: 2,
    },
    {
      id: 'ps_direction',
      text: 'Given your problems and constraints, which approach are you choosing and why?',
      hint: `Explain the reasoning, not just the choice. A strong rationale for ${svc} connects the approach back to specific constraints and evidence from your user research.${probs ? ` You noted: "${probs}" — does your chosen approach directly address that?` : ''}`,
      placeholder: 'e.g., We chose to configure [platform/approach] because: (1) it already integrates with our agency\'s existing systems, (2) it passed usability testing with our primary user group, (3) the timeline is faster than a custom build, and (4) comparable programs have deployed it successfully.',
      rows: 3,
    },
  ];

  const psRejectedQuestions = [
    {
      id: 'rej_list',
      text: 'List every alternative approach your team seriously considered. For each, summarize the idea in one sentence.',
      hint: `You should have at least 2 alternatives for ${svc}. If you only considered one approach, that's a signal the strategy wasn't fully explored. Think back: what did team members propose that you ultimately didn't choose?`,
      placeholder: 'e.g., 1. Build a custom system from scratch (new build). 2. Configure an off-the-shelf platform from [vendor]. 3. Redesign the paper process without any technology. 4. Low-code approach using [platform]. List every option your team seriously considered.',
      rows: 3,
    },
    {
      id: 'rej_why',
      text: 'For each alternative, what were the specific reasons you decided against it?',
      hint: `Be honest. Valid reasons: too expensive, too slow, failed user testing, doesn't integrate with existing systems.${sys ? ` Your current system: "${sys}" — did any alternatives fail to integrate with it?` : ''} Weak reasons: "we didn't know how to do it" or "we prefer X."`,
      placeholder: 'e.g., Custom build: estimated 3+ years to build, exceeds our 18-month MITDP timeline. [Vendor platform]: evaluated in [year], failed usability testing with our primary user group, and integration cost exceeded budget. Process redesign only: doesn\'t address the core problem of status visibility or scale of access.',
      rows: 4,
    },
    {
      id: 'rej_tradeoffs',
      text: 'What would you have gained from the rejected alternatives? What did you give up by not choosing them?',
      hint: `Every option has upsides you're trading away for ${svc}. Acknowledging this shows intellectual honesty and helps reviewers understand the full picture.${catalyst ? ` Given the catalyst ("${catalyst}"), were any of those tradeoffs especially hard?` : ''}`,
      placeholder: 'e.g., Custom build: would have given full control over the user experience. We\'re trading that for speed and lower risk. Process-only redesign: faster to implement and no vendor dependency. We\'re trading that for the scale, reach, and visibility features users told us they need.',
      rows: 2,
    },
  ];

  const psFirstReleaseQuestions = [
    {
      id: 'fr_slice',
      text: 'What is the single most important user journey to deliver in your first release? What must work end-to-end?',
      hint: `Your first release for ${svc} should be narrow and complete — one fully working flow, not five half-built flows. What's the single thing that would make users say "this is already useful"?${probs ? ` You noted: "${probs}" — which user journey would most directly address that?` : ''}`,
      placeholder: 'e.g., End-to-end submission flow: user submits their request, uploads required documents, receives confirmation, and can check status. That is the complete first release — no payment processing, no secondary workflows yet.',
      rows: 2,
    },
    {
      id: 'fr_notincluded',
      text: 'What are you deliberately NOT including in the first release, and why?',
      hint: `Explicitly calling out what's out of scope for ${svc} is as important as describing what's in scope. It shows you've prioritized deliberately rather than running out of time.`,
      placeholder: 'e.g., NOT in release 1: payment processing, secondary workflows, integration with [adjacent system], multi-language support, mobile app. These will follow in later releases once the core flow is validated.',
      rows: 2,
    },
    {
      id: 'fr_hypothesis',
      text: 'What core hypothesis are you testing with this release? What would prove it, and what would disprove it?',
      hint: `A hypothesis looks like: "We believe [users] will [behavior] if we [provide X], because [reason]. We'll know we're right when [measurable signal]."${catalyst ? ` Your catalyst was: "${catalyst}" — does your hypothesis directly test whether that framing is correct?` : ''}`,
      placeholder: 'e.g., We believe users will adopt the digital option if it is faster and clearer than the current process. We\'ll know this is working when [X]% of new requests are submitted online within [N] days of launch. If adoption stays below [Y]%, we\'ll re-examine our assumptions about usability or awareness.',
      rows: 3,
    },
    {
      id: 'fr_data',
      text: 'What data will you collect after launch to know if the release is working? Who will monitor it?',
      hint: `Instrumentation decisions need to be made before launch. What will you track for ${svc}? Who checks it and how often?${sys ? ` Your current system: "${sys}" — can you compare post-launch metrics against its baseline?` : ' What threshold triggers a response?'}`,
      placeholder: 'e.g., We\'ll track: digital submission rate (goal: [X]% by day [N]), average completion time (goal: <[Y] min), abandonment rate at each step (alert if >[Z]% abandon at document upload). Our product manager will review a weekly dashboard.',
      rows: 2,
    },
  ];

  return (
    <div>
      <ContextBanner context={ctx} />
      {/* ---- CHOOSING A STRATEGY ---- */}
      <GuidedQuestion
        title="What kind of product will best solve your core problems?"
        subtitle="A product strategy is a direction — not an implementation plan. Think about the type of product you'll build before deciding how you'll build it."
        questions={psStrategyQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Chosen Product Strategy"
        finalValue={ps.chosenStrategy}
        onFinalChange={upd('chosenStrategy')}
        finalSublabel="Describe your chosen approach in 3–5 sentences. What will users be able to do? What kind of product is it? How does this directly address your core problems? (This is strategy, not implementation — no technical architecture yet.)"
        finalPlaceholder="e.g., We will configure [platform], an off-the-shelf [type] platform, to provide a self-service online experience for users of your service. Users will submit requests, upload documents, and track status without visiting an office. Staff will process requests through an updated internal workflow with automated routing. This directly addresses our core problem of [X]-week delays caused by paper-based intake and manual processing."
        finalRows={5}
        required
      />

      <SectionCard title="Strategy Archetype" icon="🗂️" subtitle="Which best describes your approach? (Optional — used for reporting)">
        <div style={S.strategyGrid}>
          {ARCHETYPES.map(a => {
            const sel = ps.strategyArchetype === a.id;
            return (
              <div key={a.id} style={S.stratCard(sel)} onClick={() => upd('strategyArchetype')(sel ? '' : a.id)}>
                <div style={S.stratIcon}>{a.icon}</div>
                <div style={S.stratTitle(sel)}>{a.title}</div>
                <div style={S.stratDesc}>{a.desc}</div>
              </div>
            );
          })}
        </div>
        {problems.length > 0 && (
          <div style={S.problemsBox}>
            <strong style={{ color: 'var(--navy)' }}>Your core problems to solve:</strong>
            <ol style={{ marginTop: 6, paddingLeft: 18, color: 'var(--gray-600)' }}>
              {problems.map((p, i) => <li key={i} style={{ marginBottom: 2 }}>{p}</li>)}
            </ol>
          </div>
        )}
        <div style={S.row2}>
          <div style={S.fieldBlock}>
            <label style={S.label}>Trade-offs / known risks of this approach</label>
            <div style={S.sublabel}>What are the downsides? What are you giving up by not choosing a different strategy?</div>
            <textarea style={S.textarea} rows={4} value={ps.chosenTradeoffs} onChange={e => upd('chosenTradeoffs')(e.target.value)}
              placeholder="e.g., Configuring COTS takes longer to procure than a no-code solution. GovOS's mobile experience needs work. We're dependent on their release schedule for features we need." />
          </div>
          <div style={S.fieldBlock}>
            <label style={S.label}>Supporting artifacts / links</label>
            <div style={S.sublabel}>Links to team working documents, workshop outputs, strategy notes, or prototypes.</div>
            <textarea style={S.textarea} rows={4} value={ps.chosenArtifacts} onChange={e => upd('chosenArtifacts')(e.target.value)}
              placeholder="e.g., Strategy workshop Miro board ([date]): [link]. Market scan comparing [N] platforms or vendors: [link]." />
          </div>
        </div>
      </SectionCard>

      {/* ---- REJECTED ALTERNATIVES ---- */}
      <GuidedQuestion

        title="What other strategies did you seriously consider — and why did you reject them?"
        subtitle="This section is required. Reviewers want evidence that you explored the option space, not just the first idea you had."
        questions={psRejectedQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Rejected Alternatives (required — include at least 1)"
        finalValue={ps.rejectedStrategies}
        onFinalChange={upd('rejectedStrategies')}
        finalSublabel="Describe each alternative you considered and your specific reasons for rejecting it."
        finalPlaceholder="Alternative 1: Custom build — rejected because estimated timeline (3+ years) exceeds our 18-month MITDP window and budget.\n\nAlternative 2: [Vendor platform] — evaluated in [year], failed usability testing with our primary user group and integration costs exceeded budget.\n\nAlternative 3: Process redesign only — doesn't address the root problem at scale."
        finalRows={5}
        required
      />

      {/* ---- FIRST RELEASE ---- */}
      <GuidedQuestion

        title="What will your first release do — and what will it prove?"
        subtitle="Your first release is a working slice of the product that tests your core strategy in the real world."
        questions={psFirstReleaseQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="First Iterative Release — Scope"
        finalValue={ps.firstRelease}
        onFinalChange={upd('firstRelease')}
        finalSublabel="Describe what your first release will contain and, explicitly, what it will NOT include. Connect it to your 90-day build scope."
        finalPlaceholder="e.g., Release 1 scope: Users can create an account, complete and submit a request online, and upload required supporting documents. Request enters a queue for staff review. Users receive email confirmation and can check status. NOT included: payment processing, secondary workflows, [adjacent system] integration, multi-language support."
        finalRows={4}
        required
      />

      <SectionCard title="First Release — Value & Testing" icon="🚀">
        <div style={S.row2}>
          <div style={S.fieldBlock}>
            <label style={S.label}>What value do you believe this will deliver?</label>
            <div style={S.sublabel}>Frame as a hypothesis: "We believe [action] will [result] because [reason]. We'll know this is true when [measurable signal]."</div>
            <textarea style={S.textarea} rows={5} value={ps.firstReleaseValue || ''} onChange={e => upd('firstReleaseValue')(e.target.value)}
              placeholder="e.g., We believe an online submission flow will reduce the time users spend on this from [current state] to under [target], because they already use digital tools for comparable tasks in their work or life. We'll know it's working when [X]% of new requests are submitted online within [N] days of launch." />
          </div>
          <div style={S.fieldBlock}>
            <label style={S.label}>How will you test this belief after launch?</label>
            <div style={S.sublabel}>What data will you collect? What would cause you to change course? How will you know if it's not working?</div>
            <textarea style={S.textarea} rows={5} value={ps.firstReleaseArtifacts} onChange={e => upd('firstReleaseArtifacts')(e.target.value)}
              placeholder="e.g., We'll track: digital submission rate, average completion time, abandonment by step. We'll run usability testing with [N] users after launch. If abandonment at document upload exceeds [X]%, we'll prioritize a guided upload flow in Release 2." />
          </div>
        </div>
      </SectionCard>

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel="Review & Export →"
        hint="Almost done — review your full Launchpad before exporting"
      />
    </div>
  );
}
