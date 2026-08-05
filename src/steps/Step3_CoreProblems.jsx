import { useState } from 'react';
import GuidedQuestion from '../components/GuidedQuestion';
import ContextBanner from '../components/ContextBanner';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';
import { draftDefinitionOfSuccess, draftRelatedIssues } from '../draftFromCoaching';

const S = {
  pills: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  pill: (ok) => ({
    fontSize: '11.5px', padding: '3px 10px', borderRadius: 20, fontWeight: 600,
    background: ok ? 'var(--green-light)' : 'var(--gray-100)',
    color: ok ? 'var(--green)' : 'var(--gray-400)',
    border: `1px solid ${ok ? 'var(--green)' : 'var(--gray-200)'}`,
  }),
  statementBox: {
    background: 'var(--navy)', color: 'var(--white)',
    borderRadius: 'var(--radius)', padding: '16px 18px',
    marginBottom: 20, fontSize: 14, lineHeight: 1.7,
  },
  statementLbl: { fontSize: '11px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 },
  solutionAlert: {
    background: 'var(--red-light)', border: '1px solid var(--red)',
    borderRadius: 'var(--radius)', padding: '10px 14px',
    fontSize: '13px', color: 'var(--red)', marginBottom: 12,
  },
  label: { fontWeight: 600, fontSize: '13.5px', color: 'var(--gray-700)', marginBottom: 4, display: 'block' },
  sublabel: { fontSize: '12.5px', color: 'var(--gray-500)', marginBottom: 8, lineHeight: 1.5 },
  input: {
    width: '100%', padding: '8px 11px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', outline: 'none',
  },
  textarea: {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', lineHeight: 1.6,
    resize: 'vertical', outline: 'none',
  },
  metricRow: {
    display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto',
    gap: 10, padding: 14,
    background: 'var(--gray-50)', borderRadius: 'var(--radius)',
    border: '1px solid var(--gray-200)', marginBottom: 10,
  },
  metricLabel: { fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 3, display: 'block' },
  removeBtn: {
    background: 'none', border: 'none', color: 'var(--red)',
    fontSize: '18px', cursor: 'pointer', padding: '0 4px', lineHeight: 1, marginTop: 20,
  },
  addBtn: {
    background: 'none', border: '1.5px dashed var(--gray-300)',
    borderRadius: 'var(--radius)', padding: '7px 14px',
    fontSize: '13px', color: 'var(--gray-500)', cursor: 'pointer', marginTop: 4,
  },
  addBtnWide: {
    background: 'none',
    border: '1.5px dashed var(--gray-300)',
    borderRadius: 'var(--radius)',
    padding: '8px 16px',
    fontSize: '13px',
    color: 'var(--gray-500)',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  impactRow: { display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  impactNum: {
    width: 26, height: 26, borderRadius: '50%',
    background: 'var(--gold)', color: 'var(--white)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: 6,
  },
  fieldBlock: { marginBottom: 20 },
  // Stacked card styles
  problemCard: {
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  problemCardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--navy)', color: 'var(--white)',
    padding: '12px 18px', cursor: 'pointer',
  },
  problemCardTitle: { fontWeight: 700, fontSize: '14px' },
  problemCardBody: { padding: '20px' },
};

const SOLUTION_WORDS = ['build', 'create', 'system', 'platform', 'portal', 'app', 'application', 'tool', 'software', 'develop', 'implement', 'deploy'];

function hasSolutionLang(text) {
  if (!text || text.length < 20) return false;
  return SOLUTION_WORDS.some(w => text.toLowerCase().includes(w));
}

function buildStatement({ currentState, undesiredOutcome, context, desiredOutcome }) {
  if (!currentState && !undesiredOutcome) return null;
  let s = currentState || '';
  if (undesiredOutcome) s += (s ? ' is causing ' : '') + undesiredOutcome + '.';
  if (context) s += '\n\nThis is happening ' + context;
  if (desiredOutcome) s += (context ? ' and it is important to address so that ' : '\n\nIt is important to address so that ') + desiredOutcome + '.';
  return s;
}

function ProblemEditor({ problem, onChange, coaching, setCoach, index, projectContext, aiAssist }) {
  const upd = (field) => (val) => onChange({ ...problem, [field]: val });
  const pfx = `p${index}`;

  const checks = {
    statement: !!(problem.currentState && problem.undesiredOutcome && problem.context && problem.desiredOutcome),
    success: !!problem.definitionOfSuccess,
    impacts: problem.impacts.filter(Boolean).length >= 3,
    metrics: problem.metrics.some(m => m.description && m.currentValue && m.targetValue),
  };

  const statement = buildStatement(problem);
  const solutionAlert = hasSolutionLang(problem.currentState) || hasSolutionLang(problem.undesiredOutcome);

  function updateMetric(i, field, val) {
    onChange({ ...problem, metrics: problem.metrics.map((m, j) => j === i ? { ...m, [field]: val } : m) });
  }
  function addMetric() {
    onChange({ ...problem, metrics: [...problem.metrics, { description: '', currentValue: '', targetValue: '', source: '' }] });
  }
  function removeMetric(i) {
    if (problem.metrics.length <= 1) return;
    onChange({ ...problem, metrics: problem.metrics.filter((_, j) => j !== i) });
  }

  const problemStatementQuestions = [
    {
      id: `${pfx}_observable`,
      text: 'What is happening today that you can directly observe or measure — without assuming a cause?',
      hint: 'Describe what people actually do today — behaviours and steps you can see, not the technology you wish existed. "Users must submit paper forms by mail" is observable. "We lack a digital portal" is a system gap, not a problem.',
      placeholder: 'e.g., People who need your service must submit requests by mail or in person. Requests then sit in a physical intake queue before staff manually enter them into the review process.',
      rows: 3,
    },
    {
      id: `${pfx}_whohurt`,
      text: 'Who is harmed by this situation, and how specifically are they harmed?',
      hint: 'Be specific about the harm. "Users are frustrated" is vague. "People in this group lose [specific time or money] for each [delay or error]" is specific. Use numbers from your interviews wherever possible.',
      placeholder: 'e.g., [Group A]: delays of [X] weeks cause financial loss or require them to reschedule commitments that depend on your service. [Group B]: uncertainty about status prevents them from making plans or decisions while they wait.',
      rows: 3,
    },
    {
      id: `${pfx}_scale`,
      text: 'How widespread is this problem? Roughly how many people experience it and how often?',
      hint: 'Scope gives reviewers a sense of the problem\'s importance. Even rough estimates matter. "Approximately [N] requests processed per year, all experiencing this issue" is more useful than "many people are affected."',
      placeholder: 'e.g., Approximately [N] requests are processed each year through your agency\'s current process. Nearly every person who uses your service encounters this problem — there is no alternative path.',
      rows: 2,
    },
    {
      id: `${pfx}_notech`,
      text: 'If you solved this problem without building any technology, would that still be a success?',
      hint: 'This is the acid test for a good problem statement. If the answer is yes — you have a real problem. If no, you may be describing a technology solution rather than a problem. Could workflow or policy changes alone fix the core harm?',
      placeholder: 'e.g., Yes — if your agency reorganized its intake workflow and added staff, the delay problem could be reduced. Technology would make the solution faster and more scalable, but it is not the only path to solving the problem.',
      rows: 2,
    },
  ];

  const successQuestions = [
    {
      id: `${pfx}_success_min`,
      text: 'What is the minimum that must be true to call this problem solved — even partially?',
      hint: 'Think about the core harm you described. What\'s the smallest change that would meaningfully reduce that harm? This becomes your MVP benchmark — the floor below which success is not credible.',
      placeholder: 'e.g., At minimum, users receive an acknowledgment within 24 hours of submission and a decision within [X] business days for routine requests.',
      rows: 2,
    },
    {
      id: `${pfx}_success_verify`,
      text: 'How would someone independently verify that this has been achieved? What evidence would you show them?',
      hint: '"Users are happier" is not verifiable. "90% of requests processed within 5 days, measured from our case management system" is verifiable. Could a reviewer who has never met you read the evidence and confirm the problem is solved?',
      placeholder: 'e.g., Pull processing time data from your agency\'s case or application system. Survey users [X] days after launch. A reviewer who has never met us should be able to read the numbers and say: yes, this problem is solved.',
      rows: 2,
    },
    {
      id: `${pfx}_success_partial`,
      text: 'What would partial success look like at the end of your first release? What would full success look like in 2 years?',
      hint: 'Break success into horizons. Your first release won\'t solve everything. Being honest about what\'s a 6-month win vs. a 2-year win helps reviewers understand your ambition and realism.',
      placeholder: 'e.g., 6 months: digital submission available, [X]% of new requests using it. 2 years: [X]% adoption, median processing time under [Y] days, user satisfaction measurably improved.',
      rows: 2,
    },
  ];

  const impactQuestions = [
    {
      id: `${pfx}_impact_time`,
      text: 'How will this save people time or reduce burden in their daily lives?',
      hint: 'Time is the most universal benefit. How many hours per interaction? How many calls to check status? How many trips to a government office? Quantify where you can — specific numbers are far more compelling than general claims.',
      placeholder: 'e.g., Each user will save [X] hours per interaction by submitting online instead of preparing and mailing paper forms, or making an in-person visit.',
      rows: 2,
    },
    {
      id: `${pfx}_impact_economic`,
      text: 'What economic benefit does this create for individuals, small businesses, or communities?',
      hint: 'Faster decisions mean people can act sooner. What money, time, or opportunity is currently being lost because of the delay or friction? Delays create cascading costs — financial, logistical, or emotional — that solving the problem would eliminate.',
      placeholder: 'e.g., People who depend on timely decisions from your agency can plan and commit to other activities more reliably. Delays in your process create cascading costs that solving the problem would eliminate.',
      rows: 2,
    },
    {
      id: `${pfx}_impact_equity`,
      text: 'Who benefits most from solving this problem? Does this address any equity gaps?',
      hint: 'Sometimes the biggest beneficiaries are populations that currently have the hardest time navigating government services — non-English speakers, lower-income households, rural residents, people with disabilities. Call them out explicitly.',
      placeholder: 'e.g., Non-English-speaking users currently rely on intermediaries to navigate a complex paper process. A digital service with plain language and multilingual support could remove that dependency and reduce inequality in access.',
      rows: 2,
    },
  ];

  const metricsQuestions = [
    {
      id: `${pfx}_metric_today`,
      text: 'What data exists today that could be used as a baseline? Where is it stored and who owns it?',
      hint: 'Think about: your agency\'s existing databases, annual reports, complaint logs, call centre records. Even a rough number from a spreadsheet is better than nothing — you need a baseline to measure progress against.',
      placeholder: 'e.g., Your agency\'s case management or intake system likely has timestamps for when requests are received and resolved — you can calculate average processing time from those.',
      rows: 2,
    },
    {
      id: `${pfx}_metric_access`,
      text: 'Can your team actually access that data? Is it in a system you can query, or would you need help from IT or another agency?',
      hint: 'It\'s common to identify a great data source that turns out to be locked in a legacy system with no reporting tools. Flag this now — you\'ll need a plan to access it before you can measure success.',
      placeholder: 'e.g., Our IT team can run a query against the case management system. We\'ll need to request a regular data export — we don\'t have direct dashboard access yet, but that\'s part of what we\'ll set up.',
      rows: 2,
    },
    {
      id: `${pfx}_metric_target`,
      text: 'What would "significantly better" look like in concrete numbers? What is your target?',
      hint: 'Ground your target in what you heard from users or in comparable benchmarks — don\'t guess. "Under 5 days" should come from what users told you they need, or from a program that already achieves it.',
      placeholder: 'e.g., Target: ≤[X] business days for 90% of routine requests. Benchmark: users told us anything over [Y] days creates planning problems for them. Your program currently averages [Z] days — that\'s your baseline.',
      rows: 2,
    },
  ];

  return (
    <div>
      <div style={S.pills}>
        {[['statement', 'Problem Statement'], ['success', 'Definition of Success'], ['impacts', '3 Impacts'], ['metrics', 'Metric']].map(([k, l]) => (
          <span key={k} style={S.pill(checks[k])}>{checks[k] ? '✓' : '○'} {l}</span>
        ))}
      </div>

      <div style={S.fieldBlock}>
        <label style={S.label}>Core Problem Name *</label>
        <input style={S.input} value={problem.name} onChange={e => upd('name')(e.target.value)} placeholder="e.g., Slow, opaque process with no status visibility for users" />
      </div>

      {/* PROBLEM STATEMENT */}
      <GuidedQuestion
        projectContext={projectContext}
        title="What is the problem? (Don't describe a solution — describe the situation causing harm)"
        subtitle="Your problem statement must describe observable, real-world circumstances and their effects on people. Not technology plans."
        questions={problemStatementQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
      />

      <SectionCard title="Problem Statement" badge="Required Format" icon="📌">
        {solutionAlert && (
          <div style={S.solutionAlert}>
            ⚠ <strong>Watch out:</strong> One or more fields may describe a solution rather than a problem. Remove words like "build," "system," "platform," or "portal" — focus on what users are experiencing today.
          </div>
        )}

        <div style={S.fieldBlock}>
          <label style={S.label}>What is currently happening? *</label>
          <div style={S.sublabel}>The observable situation causing the problem. Focus on user behavior, not technology.</div>
          <textarea style={S.textarea} rows={2} value={problem.currentState} onChange={e => upd('currentState')(e.target.value)}
            placeholder="e.g., People who need your service must submit requests by mail or in person, without a digital option…" />
        </div>
        <div style={S.fieldBlock}>
          <label style={S.label}>What is the undesired outcome? *</label>
          <div style={S.sublabel}>What bad thing happens as a result? How are people harmed?</div>
          <textarea style={S.textarea} rows={2} value={problem.undesiredOutcome} onChange={e => upd('undesiredOutcome')(e.target.value)}
            placeholder="e.g., …causing processing delays of [X] weeks and significant uncertainty for people waiting on your agency's decision…" />
        </div>
        <div style={S.fieldBlock}>
          <label style={S.label}>Context — where or how widely is this happening? *</label>
          <div style={S.sublabel}>Across which programs, populations, offices, or workflows? How widespread?</div>
          <textarea style={S.textarea} rows={2} value={problem.context} onChange={e => upd('context')(e.target.value)}
            placeholder="e.g., …across all requests processed through your program statewide, affecting an estimated [N] people or cases per year…" />
        </div>
        <div style={S.fieldBlock}>
          <label style={S.label}>Desired outcome if solved *</label>
          <div style={S.sublabel}>What positive change happens for people when this problem is solved?</div>
          <textarea style={S.textarea} rows={2} value={problem.desiredOutcome} onChange={e => upd('desiredOutcome')(e.target.value)}
            placeholder="e.g., …users of your service can plan and act with confidence, reducing delays, wasted effort, and frustration with government services." />
        </div>

        {statement && (
          <div style={S.statementBox}>
            <div style={S.statementLbl}>Your assembled problem statement:</div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{statement}</div>
          </div>
        )}
      </SectionCard>

      {/* DEFINITION OF SUCCESS */}
      <GuidedQuestion
        title="What would it mean to have actually solved this problem?"
        subtitle="A definition of success must be specific enough that a stranger could verify it without talking to you."
        questions={successQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Definition of Success *"
        finalValue={problem.definitionOfSuccess}
        onFinalChange={upd('definitionOfSuccess')}
        finalSublabel="Write a clear, measurable statement of what success looks like. Someone who has never seen your project should be able to read this and determine whether it has been achieved."
        finalPlaceholder="e.g., Users of your service can submit requests entirely online, and 90% of routine requests receive a decision within [X] business days of submission. Submission time drops from [current state] to under [target time]. Measured monthly from your agency's case management system."
        finalRows={4}
        required
        aiAssist={aiAssist}
        onGenerateDraft={() => { const d = draftDefinitionOfSuccess(coaching, `p${index}`); if (d) upd('definitionOfSuccess')(d); }}
      />

      {/* IMPACTS */}
      <GuidedQuestion
        projectContext={projectContext}
        title="How will Marylanders specifically be better off when this problem is solved?"
        subtitle="Impacts should describe real human benefit — not system improvements."
        questions={impactQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Impacts for the People of Maryland (list at least 3)"
        finalSublabel="List 3–5 concrete ways Marylanders will be better off. Each should answer: how are real people better off, not just how is the system better."
      />

      <div style={{ marginBottom: 20 }}>
        {problem.impacts.map((impact, i) => (
          <div key={i} style={S.impactRow}>
            <div style={S.impactNum}>{i + 1}</div>
            <input style={{ ...S.input, flex: 1 }} value={impact}
              onChange={e => {
                const updated = problem.impacts.map((x, j) => j === i ? e.target.value : x);
                onChange({ ...problem, impacts: updated });
              }}
              placeholder={i === 0 ? 'e.g., Users of your service get faster decisions, reducing the time they spend waiting and unable to move forward' : 'Another impact for Marylanders…'} />
          </div>
        ))}
        {problem.impacts.length < 5 && (
          <button style={S.addBtn} onClick={() => onChange({ ...problem, impacts: [...problem.impacts, ''] })}>+ Add another impact</button>
        )}
      </div>

      {/* METRICS */}
      <GuidedQuestion
        projectContext={projectContext}
        title="How will you measure whether this problem has been solved?"
        subtitle="Good metrics are specific, measurable, and tied to data that actually exists somewhere."
        questions={metricsQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Success Metrics — enter each in the table below"
        finalSublabel="Add at least one metric with a current value, target value, and source. The source is critical — reviewers want to know you can actually measure this."
      />

      <SectionCard title="Success Metrics" icon="📊">
        {problem.metrics.map((m, i) => (
          <div key={i} style={S.metricRow}>
            <div>
              <span style={S.metricLabel}>Description *</span>
              <input style={S.input} value={m.description} onChange={e => updateMetric(i, 'description', e.target.value)} placeholder="e.g., Average processing time from submission to decision (days)" />
            </div>
            <div>
              <span style={S.metricLabel}>Current value *</span>
              <input style={S.input} value={m.currentValue} onChange={e => updateMetric(i, 'currentValue', e.target.value)} placeholder="e.g., 42 days" />
            </div>
            <div>
              <span style={S.metricLabel}>Target value *</span>
              <input style={S.input} value={m.targetValue} onChange={e => updateMetric(i, 'targetValue', e.target.value)} placeholder="e.g., ≤5 days" />
            </div>
            {problem.metrics.length > 1 && (
              <button style={S.removeBtn} onClick={() => removeMetric(i)}>×</button>
            )}
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={S.metricLabel}>Source — how was the current value measured?</span>
              <textarea style={{ ...S.textarea, minHeight: 52 }} rows={2} value={m.source} onChange={e => updateMetric(i, 'source', e.target.value)}
                placeholder="e.g., Queried agency case management system for all requests [date range]. Calculated from submission and decision timestamps. Manual log count used for periods before system was in place." />
            </div>
          </div>
        ))}
        <button style={S.addBtn} onClick={addMetric}>+ Add another metric</button>
      </SectionCard>

      <div style={S.fieldBlock}>
        <label style={S.label}>Related Issues / Sub-problems (optional)</label>
        <div style={S.sublabel}>Adjacent problems worth noting for context — these won't be in scope but help reviewers understand the full picture.</div>
        <textarea style={S.textarea} rows={3} value={problem.relatedIssues} onChange={e => upd('relatedIssues')(e.target.value)}
          placeholder="Optional: describe any related issues that reviewers should be aware of…" />
      </div>
    </div>
  );
}

function ProblemCard({ problem, index, onChange, onRemove, canRemove, coaching, setCoach, projectContext, aiAssist }) {
  const [collapsed, setCollapsed] = useState(false);
  const title = problem.name || `Problem ${index + 1}`;

  return (
    <div style={S.problemCard}>
      <div style={S.problemCardHeader} onClick={() => setCollapsed(c => !c)}>
        <span style={S.problemCardTitle}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {canRemove && (
            <button
              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.4)', color: 'var(--white)', fontSize: '12px', borderRadius: 'var(--radius)', padding: '3px 10px', cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); onRemove(); }}
            >
              Remove
            </button>
          )}
          <span style={{ fontSize: 12, opacity: 0.7 }}>{collapsed ? '▶ expand' : '▼ collapse'}</span>
        </div>
      </div>
      {!collapsed && (
        <div style={S.problemCardBody}>
          <ProblemEditor
            problem={problem}
            onChange={onChange}
            projectContext={projectContext}
            coaching={coaching}
            setCoach={setCoach}
            index={index}
            aiAssist={aiAssist}
          />
        </div>
      )}
    </div>
  );
}

export default function Step3_CoreProblems({ state, setState, onNext, onBack }) {
  const problems = state.coreProblems;
  const coaching = state.coaching || {};
  const aiAssist = state.meta.aiAssist;
  const setCoach = (key, val) => setState(s => ({ ...s, coaching: { ...s.coaching, [key]: val } }));

  const { serviceDescription, currentSystem, knownProblems, projectCatalyst } = state.meta;
  const ctx = (serviceDescription || currentSystem || knownProblems || projectCatalyst) ? {
    service: serviceDescription || null,
    currentSystem: currentSystem || null,
    knownProblems: knownProblems || null,
    catalyst: projectCatalyst || null,
  } : null;

  function updateProblem(i, updated) {
    setState(s => ({ ...s, coreProblems: s.coreProblems.map((p, j) => j === i ? updated : p) }));
  }
  function addProblem() {
    if (problems.length >= 3) return;
    setState(s => ({
      ...s,
      coreProblems: [...s.coreProblems, {
        id: Date.now(), name: '', currentState: '', undesiredOutcome: '', context: '', desiredOutcome: '',
        relatedIssues: '', definitionOfSuccess: '',
        impacts: ['', '', ''],
        metrics: [{ description: '', currentValue: '', targetValue: '', source: '' }],
      }],
    }));
  }
  function removeProblem(i) {
    if (problems.length <= 1) return;
    setState(s => ({ ...s, coreProblems: s.coreProblems.filter((_, j) => j !== i) }));
  }

  return (
    <div>
      <ContextBanner context={ctx} />
      <SectionCard
        title="Core Problems & Definition of Success"
        icon="🎯"
        subtitle="Define up to 3 foundational problems your MITDP needs to solve. These must come from patterns you observed across multiple user interviews — not assumptions. Use the guided questions to think each one through before writing."
      >
        <div style={{ background: 'var(--gold-light)', border: '1.5px solid var(--gold)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 20, fontSize: 13.5, color: 'var(--navy)' }}>
          <strong>Important:</strong> These problems define what MITDP funding can be spent on. Future changes require legislative notification. Take your time — get input from your whole team before finalizing.
        </div>

        {problems.map((p, i) => (
          <ProblemCard
            key={p.id}
            problem={p}
            index={i}
            onChange={(updated) => updateProblem(i, updated)}
            onRemove={() => removeProblem(i)}
            canRemove={problems.length > 1}
            coaching={coaching}
            setCoach={setCoach}
            projectContext={ctx}
            aiAssist={aiAssist}
          />
        ))}

        {problems.length < 3 && (
          <button style={S.addBtnWide} onClick={addProblem}>+ Add problem</button>
        )}
      </SectionCard>

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel="Save & Continue to Product Strategy →"
        hint={`${problems.length} core problem${problems.length !== 1 ? 's' : ''} defined`}
      />
    </div>
  );
}
