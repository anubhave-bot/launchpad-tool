import GuidedQuestion from '../components/GuidedQuestion';
import ContextBanner from '../components/ContextBanner';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';
import { draftProductVision, draftRejectedAlternatives, draftFirstRelease, draftFirstReleaseValue } from '../draftFromCoaching';

const S = {
  label: { fontWeight: 600, fontSize: '13.5px', color: 'var(--gray-700)', marginBottom: 4, display: 'block' },
  sublabel: { fontSize: '12.5px', color: 'var(--gray-500)', marginBottom: 8, lineHeight: 1.5 },
  textarea: {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid var(--gray-300)',
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
  typeGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 10, marginBottom: 16,
  },
  typeCard: (sel) => ({
    padding: '12px 14px', borderRadius: 'var(--radius)', cursor: 'pointer',
    border: sel ? '2px solid var(--gold)' : '1.5px solid var(--gray-200)',
    background: sel ? 'var(--gold-light)' : 'var(--white)',
  }),
  typeTitle: (sel) => ({ fontWeight: 700, fontSize: 12.5, color: sel ? 'var(--gold-dark)' : 'var(--navy)', marginBottom: 3 }),
  typeDesc: { fontSize: 11.5, color: 'var(--gray-500)', lineHeight: 1.45 },
};

const PRODUCT_TYPES = [
  { id: 'new_build',        label: 'New digital service',      desc: 'A purpose-built experience designed around your users\' needs' },
  { id: 'configure_cots',   label: 'Configured platform',      desc: 'An existing product adapted to fit your service and users' },
  { id: 'modernize',        label: 'Modernised existing',       desc: 'An incremental improvement to a service users already rely on' },
  { id: 'no_code_low_code', label: 'Low-code / no-code',        desc: 'A platform-built experience without custom development' },
  { id: 'service_redesign', label: 'Service / process redesign',desc: 'Redesigned delivery — forms, policy, or process — not just technology' },
  { id: 'hybrid',           label: 'Hybrid',                    desc: 'A combination of the above — describe in your vision statement' },
];

export default function Step4_ProductStrategy({ state, setState, onNext, onBack }) {
  const ps = state.productStrategy;
  const coaching = state.coaching || {};
  const aiAssist = state.meta.aiAssist;
  const upd = (field) => (val) => setState(s => ({ ...s, productStrategy: { ...s.productStrategy, [field]: val } }));
  const setCoach = (key, val) => setState(s => ({ ...s, coaching: { ...s.coaching, [key]: val } }));

  const { serviceDescription, currentSystem, knownProblems, projectCatalyst } = state.meta;
  const ctx = (serviceDescription || currentSystem || knownProblems || projectCatalyst) ? {
    service: serviceDescription || null,
    currentSystem: currentSystem || null,
    knownProblems: knownProblems || null,
    catalyst: projectCatalyst || null,
  } : null;

  const problems = state.coreProblems.filter(p => p.name).map(p => p.name);
  const primaryGroups = (state.primaryUserGroups || []).filter(g => g.name).map(g => g.name);

  const psVisionQuestions = [
    {
      id: 'ps_user_outcome',
      text: 'Who is your primary user, and what is the single most important outcome they need from this product?',
      hint: `Ground the product in a specific person and a specific result, not a feature list. Who is the person most harmed by the current situation?${primaryGroups.length ? ` Your primary user groups: ${primaryGroups.join(', ')}.` : ''} What would "done" look like from their perspective?`,
      placeholder: 'e.g., Our primary user is [specific group] — someone who currently [current situation]. The outcome they need is [specific result], not just access to a form or a website.',
      rows: 2,
    },
    {
      id: 'ps_value_prop',
      text: 'What is the core value this product delivers — and why is it better than what users do today?',
      hint: 'Value is always relative to the alternative. What do users currently do instead — call, visit in person, give up, use a workaround? Your product\'s value is the gap between that and what you\'re offering.',
      placeholder: 'e.g., Today users [current workaround or pain]. This product delivers [core value] — meaning users can [specific capability] without [specific burden]. That is meaningfully better because [reason grounded in user research].',
      rows: 3,
    },
    {
      id: 'ps_differentiation',
      text: 'What makes this product the right answer to your core problems — rather than a generic digital form or portal?',
      hint: `A strong product vision is specific. It connects to the problems your users named in research.${problems.length ? ` Your core problems: ${problems.join('; ')}.` : ''} What about this product's design, scope, or approach directly addresses those — in a way a generic self-service portal would not?`,
      placeholder: 'e.g., Unlike a generic submission portal, this product [specific design decision] because our research showed users [specific finding]. The key design choices are [X] and [Y], which directly address [core problem].',
      rows: 2,
    },
    {
      id: 'ps_constraints',
      text: 'What constraints shape what is actually possible? (Budget, timeline, policy, existing systems, staff capacity)',
      hint: 'Constraints define the realistic option space. Be honest: constraints ruled in are as important as constraints ruled out. What does any new product need to work alongside or replace? Does your timeline impose a scope limit?',
      placeholder: 'e.g., Must work within [policy or legal constraint]. Timeline: [N] months to first release. Staff: [description of capacity]. Integration required with [existing system]. Budget ceiling: [range or description].',
      rows: 2,
    },
  ];

  const psRejectedQuestions = [
    {
      id: 'rej_alternatives',
      text: 'What other ways could your users\' core problem be solved — without technology, with a different product type, or by a process change alone?',
      hint: `Think from the user's problem outward, not from technology inward. Could a redesigned paper process solve it? A policy change? A different staffing model? An off-the-shelf product?${problems.length ? ` Your core problems: ${problems.join('; ')} — what are all the ways those could be addressed?` : ''} Each is a legitimate alternative worth naming.`,
      placeholder: 'e.g., 1. Redesign the paper process only — no technology. 2. Configure an existing off-the-shelf platform. 3. Build a custom digital service. 4. Policy change to reduce the burden entirely. List what you genuinely considered.',
      rows: 3,
    },
    {
      id: 'rej_user_lens',
      text: 'For each alternative, what would users gain or lose? Which user needs would each option fail to meet?',
      hint: `Reject alternatives on user-centered grounds, not just cost or preference. Which alternative would leave users with the most unmet needs? Which would serve some groups but not others?${primaryGroups.length ? ` Think about how each option works for: ${primaryGroups.join(', ')}.` : ''}`,
      placeholder: 'e.g., Process redesign only: users gain faster intake but still lack status visibility — the #2 pain point from research. COTS platform: meets most needs but fails users who [specific group or need], based on our usability evaluation.',
      rows: 3,
    },
    {
      id: 'rej_evidence',
      text: 'What evidence — from user research, comparable programs, or evaluation — ruled these alternatives out?',
      hint: 'Evidence makes a rejection credible. Did you test an alternative with users and it failed? Did a comparable program try it and document the outcome? Did your research surface a need the alternative couldn\'t meet?',
      placeholder: 'e.g., We evaluated [alternative] and ruled it out because: (1) usability testing showed [finding], (2) [comparable program] tried this approach and [outcome], (3) our research found users specifically need [capability] that this alternative cannot provide.',
      rows: 3,
    },
  ];

  const psFirstReleaseQuestions = [
    {
      id: 'fr_user_journey',
      text: 'Which single user journey — from your primary user group — should work end-to-end in the first release?',
      hint: 'The first release should be narrow and complete, not broad and partial. What is the one flow that, if it worked well, would make a primary user say "this is already worth using"? Name the journey, not the features.',
      placeholder: 'e.g., The first release delivers one complete journey: [user] can [start to finish action] — from [entry point] to [outcome they care about]. That journey is complete. Everything else comes later.',
      rows: 2,
    },
    {
      id: 'fr_value_hypothesis',
      text: 'What is the core belief you are testing — about user behaviour, adoption, or value delivered?',
      hint: 'A hypothesis is a falsifiable belief: "We believe [users] will [do X] if we [provide Y], because [reason from research]. We\'ll know we\'re right when [measurable signal]." What would disprove it?',
      placeholder: 'e.g., We believe [primary user group] will [adopt / complete / prefer] this if [the product does X], because our research showed [specific finding]. We\'ll know it\'s working when [measurable outcome] within [timeframe]. If we see [counter-signal], we\'ll revisit our assumption about [X].',
      rows: 3,
    },
    {
      id: 'fr_out_of_scope',
      text: 'What are you deliberately NOT including — and how will users still find this release genuinely useful without it?',
      hint: 'Explicitly naming what is out of scope is as important as what is in. What might users expect that won\'t be there yet? Why is the release still worth using without those things?',
      placeholder: 'e.g., NOT in release 1: [list]. Users who need [excluded capability] will still be served by [existing channel or process] for now. The release is still useful because [core value] is complete — users can [main outcome] without waiting for everything else.',
      rows: 2,
    },
    {
      id: 'fr_validation',
      text: 'How will you know — within 90 days of launch — whether users are getting the value you intended?',
      hint: 'Decide what "working" looks like before you launch, not after. What signal would tell you the product is delivering its core value? What signal would tell you it is not? Can you measure against a pre-launch baseline?',
      placeholder: 'e.g., We\'ll track [metric 1] and [metric 2]. "Working" means [threshold] within [timeframe]. "Not working" means [counter-signal] — which would prompt us to [specific response]. We\'ll review this [weekly / after N users / at N days post-launch].',
      rows: 2,
    },
  ];

  return (
    <div>
      <ContextBanner context={ctx} />

      {/* ---- 1. PRODUCT VISION ---- */}
      <GuidedQuestion
        aiAssist={aiAssist}
        onGenerateDraft={() => { const d = draftProductVision(coaching); if (d) upd('chosenStrategy')(d); }}
        title="What product will best serve your users and solve their core problems?"
        subtitle="Describe your product vision in terms of who it serves, what value it delivers, and why it is better than what users do today. Strategy before implementation."
        questions={psVisionQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Product Vision Statement"
        finalValue={ps.chosenStrategy}
        onFinalChange={upd('chosenStrategy')}
        finalSublabel="3–5 sentences. Who is this for? What will they be able to do? Why is this meaningfully better than the alternative? How does it address your core problems? Avoid technical architecture — describe the experience and the value."
        finalPlaceholder="e.g., This product serves [primary user group] — people who currently [current pain or workaround]. It gives them [core capability], so they can [outcome they care about] without [specific burden they face today]. It is different from a generic portal because [specific design choice] directly addresses [core problem identified in research]. For staff, it means [secondary value]. This is the right product because [evidence from research or comparable programs]."
        finalRows={5}
        required
      />

      <SectionCard title="Product Type" icon="🗂️" subtitle="Which best describes what you are building? (Optional — used for reporting)">
        {problems.length > 0 && (
          <div style={S.problemsBox}>
            <strong style={{ color: 'var(--navy)' }}>Core problems this product must solve:</strong>
            <ol style={{ marginTop: 6, paddingLeft: 18, color: 'var(--gray-600)' }}>
              {problems.map((p, i) => <li key={i} style={{ marginBottom: 2 }}>{p}</li>)}
            </ol>
          </div>
        )}
        <div style={S.typeGrid}>
          {PRODUCT_TYPES.map(t => {
            const sel = ps.strategyArchetype === t.id;
            return (
              <div key={t.id} style={S.typeCard(sel)} onClick={() => upd('strategyArchetype')(sel ? '' : t.id)}>
                <div style={S.typeTitle(sel)}>{t.label}</div>
                <div style={S.typeDesc}>{t.desc}</div>
              </div>
            );
          })}
        </div>
        <div style={S.row2}>
          <div style={S.fieldBlock}>
            <label style={S.label}>Known trade-offs or risks with this product vision</label>
            <div style={S.sublabel}>What might users lose or find missing? What could go wrong from a user or delivery perspective?</div>
            <textarea style={S.textarea} rows={4} value={ps.chosenTradeoffs} onChange={e => upd('chosenTradeoffs')(e.target.value)}
              placeholder="e.g., Users who prefer in-person service may not adopt the digital channel without active outreach. The product depends on [external system] being reliable — if that degrades, so does the user experience." />
          </div>
          <div style={S.fieldBlock}>
            <label style={S.label}>Supporting evidence or artifacts</label>
            <div style={S.sublabel}>Links to user research outputs, comparable program examples, product evaluations, or workshop notes that support this vision.</div>
            <textarea style={S.textarea} rows={4} value={ps.chosenArtifacts} onChange={e => upd('chosenArtifacts')(e.target.value)}
              placeholder="e.g., User research synthesis ([date]): [link]. Comparable program review — [program name]: [link]. Product evaluation workshop notes: [link]." />
          </div>
        </div>
      </SectionCard>

      {/* ---- 2. ALTERNATIVES CONSIDERED ---- */}
      <GuidedQuestion
        aiAssist={aiAssist}
        onGenerateDraft={() => { const d = draftRejectedAlternatives(coaching); if (d) upd('rejectedStrategies')(d); }}
        title="What other product approaches did you consider — and why didn't they serve your users as well?"
        subtitle="Reviewers need evidence that you explored the option space. Reject alternatives on user-centered grounds — which users needs would each fail to meet?"
        questions={psRejectedQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Alternatives Considered and Rejected (required — include at least one)"
        finalValue={ps.rejectedStrategies}
        onFinalChange={upd('rejectedStrategies')}
        finalSublabel="For each alternative: what it was, what users would have gained or lost, and the specific evidence or reasoning that ruled it out."
        finalPlaceholder={"Alternative 1: [e.g., Process redesign without technology] — users would gain [X] but would still lack [unmet need from research]. Ruled out because [evidence].\n\nAlternative 2: [e.g., Off-the-shelf platform] — met most needs but failed [specific user group or need] based on [evaluation or testing]. Ruled out because [reason].\n\nAlternative 3: [describe] — [user-centered reasoning]."}
        finalRows={6}
        required
      />

      {/* ---- 3. FIRST ITERATIVE RELEASE ---- */}
      <GuidedQuestion
        aiAssist={aiAssist}
        onGenerateDraft={() => { const d = draftFirstRelease(coaching); if (d) upd('firstRelease')(d); }}
        title="What will your first release do — and what belief will it test?"
        subtitle="The first release is a working slice narrow enough to ship in 90 days and meaningful enough to validate your core product hypothesis with real users."
        questions={psFirstReleaseQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="First Iterative Release — Scope and Value"
        finalValue={ps.firstRelease}
        onFinalChange={upd('firstRelease')}
        finalSublabel="Describe the user journey it delivers end-to-end, what it explicitly does NOT include, and why it is still genuinely useful without those things."
        finalPlaceholder={"Release 1 delivers one complete journey: [user] can [action from start to outcome]. This is enough to be genuinely useful because [core value is present].\n\nNOT included in release 1: [list]. Users who need [excluded item] can [alternative path] for now.\n\nCore hypothesis: We believe [users] will [behavior] because [research finding]. We'll know it's working when [measurable signal] within [timeframe]."}
        finalRows={5}
        required
      />

      <SectionCard title="Value Hypothesis and Validation Plan" icon="🔬">
        <div style={S.row2}>
          <div style={S.fieldBlock}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <label style={{ ...S.label, marginBottom: 0 }}>What value do you believe the first release will deliver to users?</label>
              {aiAssist && <button style={{ flexShrink: 0, background: 'var(--navy)', color: 'var(--white)', border: 'none', borderRadius: 'var(--radius)', padding: '5px 12px', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }} onClick={() => { const d = draftFirstReleaseValue(coaching); if (d) upd('firstReleaseValue')(d); }}>✦ Generate draft</button>}
            </div>
            <div style={S.sublabel}>Frame as a hypothesis: "We believe [users] will [outcome] if we [provide X], because [evidence from research]. We'll know this is true when [measurable signal]."</div>
            <textarea style={{ ...S.textarea, borderColor: (ps.firstReleaseValue || '').startsWith('⚠ DRAFT') ? '#FFC107' : undefined }} rows={5} value={ps.firstReleaseValue || ''} onChange={e => upd('firstReleaseValue')(e.target.value)}
              placeholder="e.g., We believe [primary user group] will complete [key action] digitally — instead of calling or visiting in person — because our research showed [specific finding]. We'll know this is working when [X]% of [action] happens through the new channel within [N] days of launch. If adoption is below [Y]%, we'll revisit our assumption about [barrier]." />
          </div>
          <div style={S.fieldBlock}>
            <label style={S.label}>How will you test this belief after launch?</label>
            <div style={S.sublabel}>What will you measure? What signal means it's working — or not? What would cause you to change course?</div>
            <textarea style={S.textarea} rows={5} value={ps.firstReleaseArtifacts} onChange={e => upd('firstReleaseArtifacts')(e.target.value)}
              placeholder="e.g., We'll track [metric 1] (goal: [target]), [metric 2] (goal: [target]), and user satisfaction via [method]. We'll review results [weekly / at day N]. If [counter-signal], we'll [specific response — adjust, re-test, or change scope]. We'll share findings with [stakeholder] at [milestone]." />
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
