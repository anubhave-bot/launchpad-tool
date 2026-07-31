import { useState } from 'react';
import GuidedQuestion from '../components/GuidedQuestion';
import ContextBanner from '../components/ContextBanner';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';

const S = {
  addBtn: {
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
  removeBtn: {
    background: 'none', border: 'none',
    color: 'var(--red)', fontSize: '18px',
    cursor: 'pointer', padding: '0 4px', lineHeight: 1, flexShrink: 0,
  },
  card: {
    background: 'var(--gray-50)', border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius)', padding: '16px', marginBottom: '12px',
  },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  row3: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' },
  label: { fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '3px', display: 'block' },
  input: {
    width: '100%', padding: '7px 10px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13px', fontFamily: 'inherit', outline: 'none',
  },
  checkbox: { width: '16px', height: '16px', accentColor: 'var(--gold)', cursor: 'pointer' },
  primaryToggle: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontSize: '13px', color: 'var(--gray-600)', cursor: 'pointer', marginTop: '10px',
  },
  badge: (ok) => ({
    fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: 600,
    background: ok ? 'var(--green-light)' : 'var(--gold-light)',
    color: ok ? 'var(--green)' : 'var(--gold-dark)',
    border: `1px solid ${ok ? 'var(--green)' : 'var(--gold)'}`,
    display: 'inline-flex', alignItems: 'center', gap: '4px',
  }),
  sectionHead: {
    fontWeight: 700, fontSize: '14px', color: 'var(--navy)',
    marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px',
  },
};

function inp(field, val, onChange, label, placeholder) {
  return (
    <div>
      <label style={S.label}>{label}</label>
      <input style={S.input} value={val} onChange={e => onChange(field, e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function UserGroupCard({ group, index, onChange, onRemove, canRemove }) {
  const set = (field, val) => onChange({ ...group, [field]: val });
  return (
    <div style={{ ...S.card, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{index + 1}</div>
      <div style={{ flex: 1 }}>
        <div style={S.row2}>
          {inp('name', group.name, set, 'User Group Name *', group.isPrimary ? 'e.g., Primary User Group Name' : 'e.g., Secondary User Group Name')}
          {inp('description', group.description, set, 'Brief description', 'Who exactly is in this group?')}
        </div>
        <div style={{ ...S.row2, marginTop: 8 }}>
          {inp('currentUsers', group.currentUsers, set, 'Current system users (estimate)', 'e.g., ~500')}
          {inp('potentialUsers', group.potentialUsers, set, 'Total potential users (estimate) *', 'e.g., ~12,000 in MD')}
        </div>
        <label style={S.primaryToggle}>
          <input type="checkbox" style={S.checkbox} checked={!!group.isPrimary} onChange={e => set('isPrimary', e.target.checked)} />
          Mark as a <strong>primary</strong> user group (your MITDP will directly serve this group)
        </label>
      </div>
      {canRemove && <button style={S.removeBtn} onClick={onRemove}>×</button>}
    </div>
  );
}

function ParticipantCard({ p, index, onChange, onRemove, canRemove, groupNames }) {
  const set = (field, val) => onChange({ ...p, [field]: val });
  return (
    <div style={{ ...S.card, position: 'relative' }}>
      <div style={S.row3}>
        <div>
          <label style={S.label}>User Group *</label>
          <select style={{ ...S.input, cursor: 'pointer' }} value={p.userGroup} onChange={e => set('userGroup', e.target.value)}>
            <option value="">Select group…</option>
            {groupNames.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label style={S.label}># Participants</label>
          <input style={S.input} value={p.count} onChange={e => set('count', e.target.value)} placeholder="e.g., 3" />
        </div>
        <div>
          <label style={S.label}>Date</label>
          <input style={S.input} value={p.dateRange} onChange={e => set('dateRange', e.target.value)} placeholder="e.g., Mar 2026" />
        </div>
      </div>
      <div style={{ ...S.row3, marginTop: 8 }}>
        <div>
          <label style={S.label}>Recruiting Method</label>
          <input style={S.input} value={p.recruitingMethod} onChange={e => set('recruitingMethod', e.target.value)} placeholder="e.g., Email to agency contact list" />
        </div>
        <div>
          <label style={S.label}>Duration</label>
          <input style={S.input} value={p.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g., 45 min" />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={S.label}>Interview Guide</label>
            <input style={S.input} value={p.guideUsed} onChange={e => set('guideUsed', e.target.value)} placeholder="e.g., Interview Guide v2" />
          </div>
          {canRemove && <button style={{ ...S.removeBtn, marginBottom: 2 }} onClick={onRemove}>×</button>}
        </div>
      </div>
    </div>
  );
}

export default function Step1_UserResearch({ state, setState, onNext, onBack }) {
  const ur = state.userResearch;
  const coaching = state.coaching || {};
  const upd = (field) => (val) => setState(s => ({ ...s, userResearch: { ...s.userResearch, [field]: val } }));

  const { serviceDescription, currentSystem, knownProblems, projectCatalyst } = state.meta;
  const ctx = (serviceDescription || currentSystem || knownProblems || projectCatalyst) ? {
    service: serviceDescription || null,
    currentSystem: currentSystem || null,
    knownProblems: knownProblems || null,
    catalyst: projectCatalyst || null,
  } : null;
  const setCoach = (key, val) => setState(s => ({ ...s, coaching: { ...s.coaching, [key]: val } }));

  // Context shortcuts for dynamic hints
  const svc = ctx?.service ? ctx.service.split('.')[0] : 'your service';
  const sys = ctx?.currentSystem ? ctx.currentSystem.substring(0, 120) : null;
  const probs = ctx?.knownProblems ? ctx.knownProblems.substring(0, 120) : null;
  const catalyst = ctx?.catalyst ? ctx.catalyst.substring(0, 120) : null;

  const totalInterviews = ur.participants.reduce((sum, p) => sum + (parseInt(p.count) || 0), 0);
  const primaryGroups = ur.userGroups.filter(g => g.isPrimary);
  const meetsMin = totalInterviews >= 9;
  const groupNames = ur.userGroups.filter(g => g.name).map(g => g.name);

  function updateGroup(i, g) { upd('userGroups')(ur.userGroups.map((x, j) => j === i ? g : x)); }
  function addGroup() { upd('userGroups')([...ur.userGroups, { id: Date.now(), name: '', description: '', currentUsers: '', potentialUsers: '', isPrimary: true }]); }
  function removeGroup(i) { upd('userGroups')(ur.userGroups.filter((_, j) => j !== i)); }
  function updatePart(i, p) { upd('participants')(ur.participants.map((x, j) => j === i ? p : x)); }
  function addPart() { upd('participants')([...ur.participants, { id: Date.now(), userGroup: '', count: '', dateRange: '', duration: '', recruitingMethod: '', guideUsed: '' }]); }
  function removePart(i) { upd('participants')(ur.participants.filter((_, j) => j !== i)); }

  // Dynamic question arrays built after ctx is derived

  const ugQuestions = [
    {
      id: 'ug_brainstorm',
      text: 'List every type of person who uses, applies for, processes, approves, or is affected by your service — even indirectly. Don\'t filter yet.',
      hint: `Think about the full journey of ${svc}: who initiates the process, who handles it internally, who receives the outcome, and who is affected indirectly.${sys ? ` You described the current process as: "${sys}" — who is involved at each step of that?` : ''}`,
      placeholder: 'e.g., People who apply or enroll, staff who review and process, supervisors who approve, people who receive outcomes, IT staff who maintain systems…',
      rows: 3,
    },
    {
      id: 'ug_goals',
      text: 'For each person you listed, what is the one thing they most need to accomplish?',
      hint: `Think about their actual goal, not what the system does for ${svc}. "Submit an application" is a step. "Get my renovation started without legal problems" is a goal.${probs ? ` You noted: "${probs}" — whose goals are most blocked by that?` : ''}`,
      placeholder: 'e.g., [Group A]: complete their transaction or enrollment without needing to call for help. [Group B]: process requests efficiently without duplicate data entry. [Group C]: understand their status and next steps at any point…',
      rows: 3,
    },
    {
      id: 'ug_harm',
      text: 'Which of these groups would be most harmed if your service doesn\'t work well?',
      hint: `Harm could mean financial loss, safety risk, wasted time, or inability to access something they're entitled to through ${svc}. Who has the most at stake?${probs ? ` You noted: "${probs}" — which group bears the worst of that?` : ''}`,
      placeholder: 'e.g., [Group A] — delays or errors cost them time or money they can\'t easily recover. [Group B] — they may not have resources to navigate a confusing process on their own and have the least ability to absorb delays.',
      rows: 2,
    },
    {
      id: 'ug_split',
      text: 'Can any of your groups be split further? Look for groups that actually behave very differently.',
      hint: `Look for groups in ${svc} that sound like one group but behave very differently — large organizations with dedicated staff vs. individuals doing everything themselves, frequent users vs. first-timers.${sys ? ` Given the current system: "${sys}" — do different sub-groups interact with it in fundamentally different ways?` : ''}`,
      placeholder: 'e.g., [Group A] might split into: frequent users who know the process well and need speed, vs. first-time users who need guidance at every step. Each has different design needs.',
      rows: 2,
    },
    {
      id: 'ug_primary',
      text: 'Given all of the above, which 2–5 groups should your MITDP prioritize? Why those specifically?',
      hint: `Your primary groups are the ones your product will be designed around for ${svc}. Choose groups where your work will have the clearest, most measurable impact.${catalyst ? ` Your project catalyst: "${catalyst}" — does that suggest which groups are most urgent?` : ''}`,
      placeholder: 'e.g., Primary: [Group A] and [Group B] — they interact with your service most frequently and experience the most direct harm when it fails. [Group C] is secondary — we\'ll improve their experience as a byproduct of improving the process overall.',
      rows: 3,
    },
  ];

  const dsQuestions = [
    {
      id: 'ds_databases',
      text: 'What government databases might track this population? Think about registrations, licenses, applications, or enrollments.',
      hint: `Think about registrations, enrollment records, licensing databases, or case management systems your agency or a related agency already maintains for ${svc}. Your agency's own system likely has a user count — ask your IT or data team.${sys ? ` You described the current system as: "${sys}" — does it track counts of users or cases?` : ''}`,
      placeholder: 'e.g., Our agency\'s case management system has [X] active accounts. A related agency tracks [population] — we can request a count. Our program issued [Y] licenses or enrollments last year.',
      rows: 2,
    },
    {
      id: 'ds_census',
      text: 'What Census, demographic, or public data sources are relevant? Think about who this population overlaps with at a population level.',
      hint: `US Census, American Community Survey, MD iMap GIS data, HUD data, BLS occupation data can give order-of-magnitude estimates for the population served by ${svc}.`,
      placeholder: 'e.g., 2020 Census: [relevant population stat] in MD. ACS data: [demographic figure] — relevant to our target population. BLS occupation data gives order-of-magnitude estimates for professional groups.',
      rows: 2,
    },
    {
      id: 'ds_program',
      text: 'Have you talked to program staff or stakeholders who might already know the numbers? What did they say?',
      hint: `Program managers often have a number in their head, or a spreadsheet, even if it's never been formally published. Ask directly: "How many people does ${svc} serve? How many applied last year?"`,
      placeholder: 'e.g., Program manager estimated ~[X] applications or cases per year based on their experience. This hasn\'t been formally tracked — we\'ll verify against system records.',
      rows: 2,
    },
    {
      id: 'ds_methodology',
      text: 'For any groups you can\'t find hard numbers for, what\'s a reasonable estimation methodology?',
      hint: `Show your reasoning step by step for ${svc}. Example: "We can't find a direct count of [group], so we started from [broader population figure] and estimated [X]% based on [assumption]." Rough math with visible logic is better than a number with no source.`,
      placeholder: 'e.g., For [group] who may interact with your service in the future: estimated from [total eligible population in MD] minus those already enrolled or using the current system ([current count from agency records]).',
      rows: 2,
    },
  ];

  const rpQuestions = [
    {
      id: 'rp_existing',
      text: 'Do you or your agency already have relationships with people in your user groups? What do those connections look like?',
      hint: `Agency staff who work directly with the public, program liaisons, advisory boards, existing email lists of applicants — any of these can be your starting point for recruiting participants for ${svc} research.${sys ? ` Your current system: "${sys}" — does it have a user list you can contact?` : ''}`,
      placeholder: 'e.g., Our agency has email records for all applicants or enrollees in the last 2 years (~[N] people). Our program manager has a relationship with [relevant professional association or community organization].',
      rows: 2,
    },
    {
      id: 'rp_orgs',
      text: 'What community organizations, advocacy groups, trade associations, or professional networks serve your target users?',
      hint: `Think broadly for ${svc}: trade or professional associations, community advocacy groups, social service nonprofits, faith communities, neighborhood groups. These organizations can vouch for your research and help you reach participants who wouldn't respond to a government email.`,
      placeholder: 'e.g., [Professional association] for licensed practitioners. [Community organization] for lower-income or underserved users. [Advocacy group] for people who have experienced problems with your service.',
      rows: 2,
    },
    {
      id: 'rp_venues',
      text: 'Where do your target users gather — physically or digitally? What channels reach them?',
      hint: `Public libraries, community centers, church bulletin boards, Nextdoor, Reddit communities, agency waiting rooms — where do users of ${svc} already congregate?${probs ? ` You noted: "${probs}" — are there channels or communities specifically for people affected by that?` : ''}`,
      placeholder: 'e.g., Users of your service may gather at agency waiting rooms, community centers, or professional training events. Online: Nextdoor, local Facebook groups, Reddit communities, professional forums.',
      rows: 2,
    },
    {
      id: 'rp_barriers',
      text: 'Who is the hardest-to-reach group in your list, and what would it take to include at least 3 of them?',
      hint: `Hard-to-reach groups are often the most important for ${svc}. If low-income users, non-English speakers, or rural residents are in your primary groups, they require specific recruiting approaches — you may need a community partner or interpreter.`,
      placeholder: 'e.g., Hardest to reach: [underserved or hard-to-contact group]. Plan: partner with [community organization], offer interviews by phone instead of video, provide materials in [language], schedule around working hours.',
      rows: 2,
    },
  ];

  const igQuestions = [
    {
      id: 'ig_opening',
      text: 'How will you open the interview to put participants at ease and explain what you\'re doing?',
      hint: `The opening matters. You need to: explain you're researching ${svc} (not testing them), get consent to record notes, and set the expectation that there are no wrong answers. What will your first 2 minutes sound like?`,
      placeholder: `e.g., "Thank you for joining us today. We're a team working to improve [service name]. We're not testing you — we want to learn from your experience. There are no right or wrong answers. Is it okay if I take notes?"`,
      rows: 3,
    },
    {
      id: 'ig_behavioral',
      text: 'What are the 3–5 most important behavioral questions you\'ll ask? These should invite stories, not yes/no answers.',
      hint: `Good behavioral questions start with "Tell me about the last time…", "Walk me through…", "What do you do when…". Avoid: "Do you find X difficult?" (Yes/No). Prefer: "Tell me about a time when X was difficult — what happened?"${probs ? ` You noted: "${probs}" — build a question around that specific friction.` : ''}`,
      placeholder: `e.g., 1. "Tell me about the last time you used [your service]. Walk me through exactly what you did, from beginning to end." 2. "Was there a moment you almost gave up or considered doing something differently? What happened?" 3. "How do you typically find out where things stand?"`,
      rows: 4,
    },
    {
      id: 'ig_followups',
      text: 'What follow-up probes will you use when a participant gives a short or vague answer?',
      hint: `Probes get below surface answers about ${svc}. Useful probes: "Can you say more about that?", "What did you do next?", "Why did you do it that way?", "What would you have preferred instead?"`,
      placeholder: 'e.g., "Can you tell me more about that?", "What made you feel that way?", "What did you try before that?", "How long did that part take you?"',
      rows: 2,
    },
  ];

  const synQuestions = [
    {
      id: 'syn_method',
      text: 'What method did your team use to organize and analyze your interview notes?',
      hint: `Common approaches for ${svc}: affinity mapping (grouping sticky notes by theme in Miro, Mural, or on a physical wall), spreadsheet coding (tagging each quote with a theme), structured debrief sessions after each interview, or a combination.`,
      placeholder: 'e.g., After all interviews, we held a 2-hour synthesis session where each team member shared their notes while others added observations to a shared board. We then grouped observations into themes.',
      rows: 2,
    },
    {
      id: 'syn_patterns',
      text: 'What were the 3–5 most important patterns or insights that emerged across multiple interviews?',
      hint: `A pattern is something multiple participants said or did independently. "Participant 3 mentioned X" is an observation. "Every person in this group mentioned X" is a pattern.${probs ? ` You noted: "${probs}" — did the interviews confirm or complicate that?` : ' Patterns become your core problems.'}`,
      placeholder: 'e.g., 1. All [N] participants from [Group A] mentioned uncertainty about status — none knew the expected timeline. 2. [N] of [X] participants in [Group B] were confused about which option or pathway applied to their situation. 3. All staff we spoke with mentioned duplicate data entry across systems.',
      rows: 3,
    },
    {
      id: 'syn_surprises',
      text: 'What surprised you or challenged your initial assumptions about users and the problem?',
      hint: `Surprises are often the most valuable findings about ${svc}. What did you expect to hear that you didn't? What did users say that you weren't expecting?${catalyst ? ` Given your catalyst: "${catalyst}" — did the interviews validate that framing, or reveal something different?` : ' Where were you wrong?'}`,
      placeholder: 'e.g., We assumed [Group A] were resistant to digital tools, but most already use digital services in other parts of their life. The barrier wasn\'t familiarity with technology — it was trust in the government system and uncertainty about what would happen to their information.',
      rows: 2,
    },
  ];

  return (
    <div>
      <ContextBanner context={ctx} />
      {/* ---- WHO ARE YOUR USER GROUPS ---- */}
      <GuidedQuestion
        title="Who are all the people who interact with your service?"
        subtitle="Think widely before narrowing. This brainstorm becomes the foundation for everything that follows."
        questions={ugQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="User Groups — enter each group in the table below"
        finalSublabel="Based on your thinking above, add each user group to the table. Check 'primary' for the 2–5 groups your MITDP will focus on serving."
      />

      <SectionCard title="User Groups Table" icon="👥" subtitle="Add a row for each user group. For each, estimate how many people are in this group.">
        <div style={S.sectionHead}>
          Groups identified
          <span style={S.badge(primaryGroups.length >= 2)}>
            {primaryGroups.length} primary
          </span>
        </div>
        {ur.userGroups.map((g, i) => (
          <UserGroupCard key={g.id} group={g} index={i} onChange={updated => updateGroup(i, updated)} onRemove={() => removeGroup(i)} canRemove={ur.userGroups.length > 1} />
        ))}
        <button style={S.addBtn} onClick={addGroup}>+ Add another user group</button>
      </SectionCard>

      {/* ---- DATA SOURCES ---- */}
      <GuidedQuestion

        title="How do you know how many people are in each group?"
        subtitle="You need a source for your user group size estimates — not a guess, but a traceable number."
        questions={dsQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Data Sources for User Group Estimates"
        finalValue={ur.dataSources}
        onFinalChange={upd('dataSources')}
        finalSublabel="Summarize your sources and methodology for reviewers. Cite specific databases, data years, and how you calculated estimates."
        finalPlaceholder="e.g., [Group A] count: agency licensing or enrollment database, pulled [date] — [N] active records. [Group B] count: 2020 US Census for MD, [relevant population figure]. Potential future users estimated at [X]% of [broader population] based on [historical application or enrollment rate] from agency records."
        finalRows={4}
        required
      />

      {/* ---- RESEARCH PLAN ---- */}
      <GuidedQuestion

        title="How will you reach out to and interview real users?"
        subtitle="Before you can conduct interviews, you need a plan for who you'll talk to and how you'll recruit them."
        questions={rpQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Research Plan Summary"
        finalValue={ur.researchPlan.name}
        onFinalChange={(val) => upd('researchPlan')({ ...ur.researchPlan, name: val })}
        finalSublabel="Give your research plan a name and briefly describe your recruiting approach. Link to the full plan document if you have one."
        finalPlaceholder="e.g., Discovery Research Plan v1 — Recruiting via agency applicant email list, [partner organization] referrals, and outreach through [community channel]. Goal: [N] interviews across [X] user groups ([Y] per group). Full plan: [link]"
        finalRows={3}
        required
      />

      {/* ---- INTERVIEW GUIDES ---- */}
      <GuidedQuestion

        title="What questions will you ask in your interviews?"
        subtitle="Good interview questions reveal how people actually behave — not what they think they should say."
        questions={igQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Interview Guide Name"
        finalValue={ur.interviewGuides[0].name}
        onFinalChange={(val) => upd('interviewGuides')(ur.interviewGuides.map((g, i) => i === 0 ? { ...g, name: val } : g))}
        finalSublabel="Name your primary interview guide. Add notes on what user group it was used for. If you have multiple guides for different groups, add them below."
        finalPlaceholder="e.g., [User Group] Discovery Interview Guide v1 — used for [group name] and [other group name]"
        finalRows={2}
      />

      <SectionCard title="Interview Guides" icon="📝" subtitle="Record each guide you used. You can have separate guides for different user groups.">
        {ur.interviewGuides.map((g, i) => (
          <div key={i} style={{ ...S.card, display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={S.label}>Guide Name / Version</label>
                <input style={S.input} value={g.name} onChange={e => upd('interviewGuides')(ur.interviewGuides.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} placeholder="e.g., [User Group] Interview Guide v2" />
              </div>
              <div>
                <label style={S.label}>Which user groups?</label>
                <input style={S.input} value={g.description} onChange={e => upd('interviewGuides')(ur.interviewGuides.map((x, j) => j === i ? { ...x, description: e.target.value } : x))} placeholder="e.g., Used with [Group A] and [Group B]" />
              </div>
            </div>
            {ur.interviewGuides.length > 1 && <button style={S.removeBtn} onClick={() => upd('interviewGuides')(ur.interviewGuides.filter((_, j) => j !== i))}>×</button>}
          </div>
        ))}
        <button style={S.addBtn} onClick={() => upd('interviewGuides')([...ur.interviewGuides, { name: '', description: '' }])}>+ Add another interview guide</button>
      </SectionCard>

      {/* ---- PARTICIPANTS ---- */}
      <SectionCard
        title="Research Participants"
        icon="🎤"
        subtitle="Log each round of interviews. Minimum: 9 individual interviews total, at least 3 per primary user group. Focus groups do not count."
      >
        <div style={S.sectionHead}>
          Interview sessions
          <span style={S.badge(meetsMin)}>
            {totalInterviews} / 9 minimum
          </span>
        </div>
        {ur.participants.map((p, i) => (
          <ParticipantCard key={p.id} p={p} index={i} onChange={updated => updatePart(i, updated)} onRemove={() => removePart(i)} canRemove={ur.participants.length > 1} groupNames={groupNames} />
        ))}
        <button style={S.addBtn} onClick={addPart}>+ Add another interview session</button>
      </SectionCard>

      {/* ---- SYNTHESIS ---- */}
      <GuidedQuestion

        title="How did you make sense of what you heard?"
        subtitle="Synthesis turns individual interview notes into team-level insights. Reviewers want to know this was deliberate, not a single person's interpretation."
        questions={synQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Synthesis Process & Key Findings"
        finalValue={ur.synthesisNotes}
        onFinalChange={upd('synthesisNotes')}
        finalSublabel="Describe how your team synthesized the data and what you found. Include the method, who was involved, tools used, and the top patterns. Link to synthesis documents or Miro boards if available."
        finalPlaceholder="e.g., We held a [X]-hour synthesis session with all [N] team members on [date], using a shared Miro board. Each person presented notes from their interviews. We identified [N] recurring themes using affinity mapping. Top findings: (1) Status visibility was the #1 pain point across all groups. (2) [Specific friction point] created the longest delays. (3) Staff spent significant time on data re-entry that could be automated."
        finalRows={5}
      />

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel="Save & Continue to User Groups →"
        hint={meetsMin ? `✓ ${totalInterviews} interviews logged` : `⚠ Need at least 9 interviews (${totalInterviews} so far)`}
      />
    </div>
  );
}
