import { useState } from 'react';
import GuidedQuestion from '../components/GuidedQuestion';
import SectionCard from '../components/SectionCard';
import NavButtons from '../components/NavButtons';

const S = {
  listRow: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' },
  listNum: {
    width: 24, height: 24, borderRadius: '50%',
    background: 'var(--gray-200)', color: 'var(--gray-600)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '11px', fontWeight: 700, flexShrink: 0, marginTop: 7,
  },
  listInput: {
    flex: 1, padding: '7px 11px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', outline: 'none',
  },
  removeBtn: {
    background: 'none', border: 'none', color: 'var(--red)',
    fontSize: '18px', cursor: 'pointer', padding: '0 4px', lineHeight: 1, flexShrink: 0, marginTop: 6,
  },
  addRowBtn: {
    background: 'none', border: '1.5px dashed var(--gray-300)',
    borderRadius: 'var(--radius)', padding: '6px 14px',
    fontSize: '13px', color: 'var(--gray-500)', cursor: 'pointer', marginTop: 4,
  },
  textarea: {
    width: '100%', padding: '9px 12px',
    border: '1.5px solid var(--gray-300)',
    borderRadius: 'var(--radius)',
    fontSize: '13.5px', fontFamily: 'inherit', lineHeight: 1.6,
    resize: 'vertical', outline: 'none',
  },
  label: { fontWeight: 600, fontSize: '13.5px', color: 'var(--gray-700)', marginBottom: 4, display: 'block' },
  sublabel: { fontSize: '12.5px', color: 'var(--gray-500)', marginBottom: 8, lineHeight: 1.5 },
  pills: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  pill: (ok) => ({
    fontSize: '11.5px', padding: '3px 10px', borderRadius: 20, fontWeight: 600,
    background: ok ? 'var(--green-light)' : 'var(--gray-100)',
    color: ok ? 'var(--green)' : 'var(--gray-400)',
    border: `1px solid ${ok ? 'var(--green)' : 'var(--gray-200)'}`,
  }),
  warn: {
    background: 'var(--red-light)', border: '1px solid var(--red)',
    borderRadius: 'var(--radius)', padding: '9px 13px',
    fontSize: '13px', color: 'var(--red)', marginBottom: 12,
  },
  fieldBlock: { marginBottom: 20 },
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
  // Stacked card styles
  groupCard: {
    border: '1px solid var(--gray-200)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  groupCardHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'var(--navy)', color: 'var(--white)',
    padding: '12px 18px', cursor: 'pointer',
  },
  groupCardTitle: { fontWeight: 700, fontSize: '14px' },
  groupCardBody: { padding: '20px' },
};

function completenessCheck(g) {
  return {
    name: !!g.name,
    needs: g.needs.filter(Boolean).length >= 1,
    painPoints: g.painPoints.filter(Boolean).length >= 3,
    opportunities: !!g.opportunities,
    tech: !!g.technologyBarriers,
    journey: !!g.journeyMap,
  };
}

function ListInput({ items, onChange, placeholder, addLabel, minCount }) {
  const filled = items.filter(Boolean).length;
  function update(i, val) { onChange(items.map((x, j) => j === i ? val : x)); }
  function add() { onChange([...items, '']); }
  function remove(i) { if (items.length > 1) onChange(items.filter((_, j) => j !== i)); }
  return (
    <div>
      {minCount && filled < minCount && <div style={S.warn}>⚠ Please add at least {minCount} (currently {filled})</div>}
      {items.map((item, i) => (
        <div key={i} style={S.listRow}>
          <div style={S.listNum}>{i + 1}</div>
          <input style={S.listInput} value={item} onChange={e => update(i, e.target.value)}
            placeholder={typeof placeholder === 'function' ? placeholder(i) : placeholder} />
          {items.length > 1 && <button style={S.removeBtn} onClick={() => remove(i)}>×</button>}
        </div>
      ))}
      <button style={S.addRowBtn} onClick={add}>{addLabel || '+ Add another'}</button>
    </div>
  );
}

function UserGroupEditor({ group, onChange, coaching, setCoach, groupIndex, projectContext }) {
  const upd = (field) => (val) => onChange({ ...group, [field]: val });
  const checks = completenessCheck(group);

  const pfx = `g${groupIndex}`;

  // Context shortcuts for dynamic hints
  const svc = projectContext?.service ? projectContext.service.split('.')[0] : 'your service';
  const sys = projectContext?.currentSystem ? projectContext.currentSystem.substring(0, 120) : null;
  const probs = projectContext?.knownProblems ? projectContext.knownProblems.substring(0, 120) : null;
  const catalyst = projectContext?.catalyst ? projectContext.catalyst.substring(0, 120) : null;

  const groupName = group.name || 'this group';

  const pillLabels = [
    ['name', 'Name'], ['needs', '≥1 Need'], ['painPoints', '≥3 Pain Points'],
    ['opportunities', 'Opportunities'], ['tech', 'Tech/Barriers'], ['journey', 'Journey'],
  ];

  const needsQuestions = [
    {
      id: `${pfx}_need_jobs`,
      text: 'What is the main job this group is trying to get done when they use your service?',
      hint: `Think about the job-to-be-done for ${groupName}: what outcome are they trying to achieve in their work or life? Not "submit a form" but "get approval so I can start my project."${probs ? ` You noted: "${probs}" — how does that affect their job-to-be-done?` : ''}`,
      placeholder: `e.g., ${groupName} needs to... complete their interaction with ${svc} quickly and with confidence, so they can move forward without uncertainty or delay.`,
      rows: 2,
    },
    {
      id: `${pfx}_need_info`,
      text: 'What information does this group need that they currently can\'t easily get?',
      hint: `Think about what ${groupName} has to look up, call to find out, or guess at in ${svc}. Information gaps are often the root cause of user frustration.${sys ? ` Given the current system: "${sys}" — what information is hardest for this group to get?` : ''}`,
      placeholder: 'e.g., They need to know the status of their request, the expected timeline, what is missing or required from them, and what happens next.',
      rows: 2,
    },
    {
      id: `${pfx}_need_trust`,
      text: 'What does this group need in order to trust the system and feel confident using it?',
      hint: `Trust needs are often invisible until you ask directly. Does ${groupName} need transparency? Confirmation messages? The ability to check on progress? To speak to a human?${catalyst ? ` Given the catalyst: "${catalyst}" — does that create specific urgency for trust?` : ''}`,
      placeholder: 'e.g., Users need confirmation their submission was received, status updates without having to call or come in, and clear explanations when their request is denied or incomplete.',
      rows: 2,
    },
  ];

  const painQuestions = [
    {
      id: `${pfx}_pain_friction`,
      text: 'What are the specific steps in their current process where people get stuck, confused, or frustrated?',
      hint: `Look for steps where ${groupName} repeats themselves, waits without feedback, or has to contact your agency to ask a basic question.${sys ? ` You described the current system as: "${sys}" — where does ${groupName} hit walls in that process?` : ' Listen for phrases like "I always have to…" or "It took forever to…"'}${probs ? ` You noted: "${probs}" — is that reflected in what you heard?` : ''}`,
      placeholder: 'e.g., Users told us they have to re-enter the same information on multiple forms or across multiple systems. They said they never receive confirmation that their submission arrived or is being processed.',
      rows: 3,
    },
    {
      id: `${pfx}_pain_cost`,
      text: 'What does this friction cost them — in time, money, missed opportunities, or emotional stress?',
      hint: `Quantify where you can for ${groupName}. "Each status check takes 30 minutes on hold" is more powerful than "status checking is annoying." Real costs make the problem concrete.`,
      placeholder: 'e.g., Users spend [X] hours on a single interaction that should take minutes. Uncertainty about status forces them to delay decisions that depend on your service, sometimes by weeks.',
      rows: 2,
    },
    {
      id: `${pfx}_pain_workarounds`,
      text: 'What workarounds have they developed to cope with the broken process?',
      hint: `Workarounds reveal pain points you might not know to ask about for ${groupName}. "I always save a copy before submitting in case they lose it" tells you they don't trust the process to acknowledge receipt.${sys ? ` Given the current system: "${sys}" — what do ${groupName} do to work around its limitations?` : ''}`,
      placeholder: 'e.g., Users keep their own records to track what they submitted and when, because the system doesn\'t confirm receipt. They contact staff directly rather than using the official status channel because the official one is unreliable.',
      rows: 2,
    },
  ];

  const oppQuestions = [
    {
      id: `${pfx}_opp_direct`,
      text: 'Looking at each pain point you listed above, what\'s the most direct way to address it?',
      hint: `Don't leap to technology solutions yet for ${groupName}. Focus on what would need to be true. "Users need to know their application arrived" → the system needs to send a confirmation. That's an opportunity, not a solution.${probs ? ` You noted: "${probs}" — what's the most direct fix?` : ''}`,
      placeholder: 'e.g., Pain: no status visibility → Opportunity: provide real-time status updates via text or email. Pain: duplicate data entry → Opportunity: auto-populate from data your agency already holds in existing systems.',
      rows: 3,
    },
    {
      id: `${pfx}_opp_policy`,
      text: 'Are any of the pain points caused by policy, process, or organizational issues — not just technology?',
      hint: `Sometimes the solution for ${groupName} isn't an app — it's a policy change, a better form design, a reorganized workflow, or staff training.${sys ? ` The current system: "${sys}" — are any of the problems really policy or process problems wearing a technology costume?` : ' These are still valid opportunities and may be faster to implement.'}`,
      placeholder: 'e.g., Part of the delay is caused by a policy requiring physical signatures or in-person verification. Moving to electronic signatures or remote verification would reduce processing time before any software changes.',
      rows: 2,
    },
  ];

  const techQuestions = [
    {
      id: `${pfx}_tech_access`,
      text: 'How do the people in this group typically access digital services? What devices do they use? Do they have reliable internet?',
      hint: `Consider for ${groupName}: are they mostly on mobile? Desktop? Do they work in areas with unreliable connectivity? Do they rely on public computers at libraries or community centers?${sys ? ` Given the current system: "${sys}" — how do they access it today?` : ''}`,
      placeholder: 'e.g., Users in this group primarily work from mobile phones in the field, not desktops. Many are in areas with unreliable connectivity. They often access services during breaks or after hours, not during a typical workday.',
      rows: 2,
    },
    {
      id: `${pfx}_tech_lang`,
      text: 'Are there language, literacy, or cognitive accessibility considerations for this group?',
      hint: `About 1 in 5 MD households primarily speak a language other than English. Some users of ${svc} may have low digital literacy, vision impairments, or cognitive differences. These are design requirements, not edge cases.`,
      placeholder: 'e.g., A significant portion of users in this group primarily speak a language other than English. The group also includes older adults and people with varying levels of digital literacy who need plain language, larger text, and simpler form design.',
      rows: 2,
    },
    {
      id: `${pfx}_tech_trust`,
      text: 'Does this group have specific concerns about digital government services — privacy, data use, or mistrust?',
      hint: `Some communities have historical reasons to distrust government data collection. Others may be concerned about immigration status, income reporting, or privacy when using ${svc}.${catalyst ? ` Given the catalyst: "${catalyst}" — does that create specific trust concerns?` : ' Understand these before you design.'}`,
      placeholder: 'e.g., Some users expressed concern about providing personal or financial information online to a government system. Clear messaging about what data is collected, how it is used, and how it is protected is essential for adoption.',
      rows: 2,
    },
  ];

  const journeyQuestions = [
    {
      id: `${pfx}_journey_steps`,
      text: 'List the steps this user goes through to accomplish their goal with your service, from beginning to end.',
      hint: `Start from when ${groupName} first realizes they need to interact with ${svc}, not from when they arrive at your website. What triggers the interaction?${sys ? ` Given the current system: "${sys}" — what does their full path through it look like?` : ' What do they do first?'}`,
      placeholder: 'e.g., 1. User realizes they need to interact with your service (what triggers this?). 2. They search online or ask someone where to start. 3. They arrive at your website or office. 4. They begin the process — what are the first steps?…',
      rows: 4,
    },
    {
      id: `${pfx}_journey_highs`,
      text: 'Where in that journey do things go well? What are the moments of clarity or ease?',
      hint: `These are the parts worth preserving for ${groupName}. Not everything is broken. What are users already successfully doing with ${svc}?`,
      placeholder: 'e.g., Most users found [a specific step] straightforward once they understood what was required. That part works well and should be preserved.',
      rows: 2,
    },
    {
      id: `${pfx}_journey_lows`,
      text: 'Where are the biggest low points — the moments of confusion, frustration, or failure?',
      hint: `These are your highest-priority design problems for ${groupName}. Where do users give up? Where do they make mistakes?${probs ? ` You noted: "${probs}" — is that showing up as a journey low point?` : ' Where do they have to call for help?'}`,
      placeholder: 'e.g., The lowest point: waiting [X] weeks with no status updates or communication. Second lowest: submitting supporting documents — the current process is unclear, error-prone, or requires in-person delivery.',
      rows: 2,
    },
  ];

  return (
    <div>
      <div style={S.pills}>
        {pillLabels.map(([k, l]) => (
          <span key={k} style={S.pill(checks[k])}>{checks[k] ? '✓' : '○'} {l}</span>
        ))}
      </div>

      <div style={S.fieldBlock}>
        <label style={S.label}>User Group Name *</label>
        <input
          style={{ ...S.textarea, resize: 'none', height: 'auto', padding: '7px 11px' }}
          value={group.name}
          onChange={e => upd('name')(e.target.value)}
          placeholder="e.g., Primary User Group Name"
        />
      </div>

      {/* NEEDS — with guided questions */}
      <GuidedQuestion
        projectContext={projectContext}
        title={`What do ${groupName}'s users need to accomplish?`}
        subtitle="Needs should describe goals, not features. Think about what they're trying to achieve in their life or work."
        questions={needsQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel={`Primary User Needs (use the format: "[action] so that [desired result]")`}
        finalSublabel="Write 1–5 needs based on your thinking above. Example: 'Submit my request online so that I don\'t need to take time off work to visit an office in person.'"
      />

      <div style={{ marginBottom: 24 }}>
        <ListInput
          items={group.needs.slice(0, 5)}
          onChange={upd('needs')}
          placeholder={(i) => i === 0 ? `e.g., ${groupName} need to [action] so that [desired result]` : 'Another user need…'}
          addLabel="+ Add a user need"
        />
      </div>

      {/* PAIN POINTS — with guided questions */}
      <GuidedQuestion
        projectContext={projectContext}
        title={`What makes ${groupName}'s experience frustrating or difficult today?`}
        subtitle="Pain points come from what you heard in interviews — specific moments of friction, confusion, or harm."
        questions={painQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel={`Pain Points / Barriers (at least 3)`}
        finalSublabel="List specific pain points from your interviews. Be concrete: 'The process takes too long' is weak. 'Users wait an average of [X] weeks with no status updates' is strong."
      />

      <div style={{ marginBottom: 24 }}>
        <ListInput
          items={group.painPoints}
          onChange={upd('painPoints')}
          placeholder="Describe a specific frustration, barrier, or difficulty — from a real interview"
          addLabel="+ Add a pain point"
          minCount={3}
        />
      </div>

      {/* OPPORTUNITIES */}
      <GuidedQuestion
        projectContext={projectContext}
        title={`What could be done differently to serve ${groupName} better?`}
        subtitle="Opportunities flow directly from pain points. For each pain, there's at least one possible improvement."
        questions={oppQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Opportunities"
        finalValue={group.opportunities}
        onFinalChange={upd('opportunities')}
        finalSublabel="Based on your thinking above, summarize the key opportunities to improve service for this group."
        finalPlaceholder="e.g., Provide real-time status updates via email or text. Auto-populate known data from your agency's existing records to eliminate duplicate entry. Create a guided checklist so users know exactly what to prepare before starting."
        finalRows={4}
      />

      {/* TECHNOLOGY BARRIERS */}
      <GuidedQuestion
        projectContext={projectContext}
        title={`What technology, language, or accessibility barriers affect ${groupName}?`}
        subtitle="Every user group has some barriers. If you're writing 'none' — think again."
        questions={techQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Technology & Accessibility Barriers"
        finalValue={group.technologyBarriers}
        onFinalChange={upd('technologyBarriers')}
        finalSublabel="Summarize the technology, language, and accessibility considerations for this group. These will directly inform your product strategy and design requirements."
        finalPlaceholder="e.g., Primary device: mobile ([X]% of this group access services via phone). Connectivity: unreliable in field environments — design must work on slow connections. Language: ~[X]% prefer [language]. Literacy: some users have limited experience with government forms — plain language required throughout."
        finalRows={3}
      />

      {/* JOURNEY MAP */}
      <GuidedQuestion
        projectContext={projectContext}
        title={`What does ${groupName}'s current experience look like, step by step?`}
        subtitle="A journey map makes the current experience visible — the good, the bad, and the confusing."
        questions={journeyQuestions}
        answers={coaching}
        onAnswerChange={setCoach}
        finalLabel="Journey Map of Key Touchpoints"
        finalValue={group.journeyMap}
        onFinalChange={upd('journeyMap')}
        finalSublabel="Describe the key steps in this group's current journey. You can write a numbered list, describe highs/lows, or paste a link to a diagram."
        finalPlaceholder="e.g., 1. Realizes they need your service (trigger: [event]). 2. Searches online for information — difficulty finding the right starting point (LOW). 3. Fills out a form or submits a request. 4. Waits with no status updates (LOWEST POINT). 5. Calls or visits office to ask what is happening. 6. Receives decision or outcome. 7. Next steps…"
        finalRows={5}
      />
    </div>
  );
}

function GroupCard({ group, index, onChange, onRemove, canRemove, coaching, setCoach, projectContext }) {
  const [collapsed, setCollapsed] = useState(false);
  const title = group.name || `Group ${index + 1}`;

  return (
    <div style={S.groupCard}>
      <div style={S.groupCardHeader} onClick={() => setCollapsed(c => !c)}>
        <span style={S.groupCardTitle}>{title}</span>
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
        <div style={S.groupCardBody}>
          <UserGroupEditor
            group={group}
            onChange={onChange}
            coaching={coaching}
            setCoach={setCoach}
            groupIndex={index}
            projectContext={projectContext}
          />
        </div>
      )}
    </div>
  );
}

export default function Step2_PrimaryUserGroups({ state, setState, onNext, onBack }) {
  const pg = state.primaryUserGroups;
  const coaching = state.coaching || {};
  const setCoach = (key, val) => setState(s => ({ ...s, coaching: { ...s.coaching, [key]: val } }));

  const { serviceDescription, currentSystem, knownProblems, projectCatalyst } = state.meta;
  const ctx = (serviceDescription || currentSystem || knownProblems || projectCatalyst) ? {
    service: serviceDescription || null,
    currentSystem: currentSystem || null,
    knownProblems: knownProblems || null,
    catalyst: projectCatalyst || null,
  } : null;

  const researchGroupNames = (state.userResearch.userGroups || [])
    .filter(g => g.isPrimary && g.name).map(g => g.name);

  function updateGroup(i, g) {
    setState(s => ({ ...s, primaryUserGroups: s.primaryUserGroups.map((x, j) => j === i ? g : x) }));
  }
  function addGroup() {
    const newGroup = {
      id: Date.now(),
      name: researchGroupNames[pg.length] || '',
      needs: ['', '', '', '', ''],
      painPoints: ['', '', ''],
      opportunities: '', technologyBarriers: '', journeyMap: '',
    };
    setState(s => ({ ...s, primaryUserGroups: [...s.primaryUserGroups, newGroup] }));
  }
  function removeGroup(i) {
    if (pg.length <= 1) return;
    setState(s => ({ ...s, primaryUserGroups: s.primaryUserGroups.filter((_, j) => j !== i) }));
  }

  const allHaveRequiredFields = pg.every(g => {
    const c = completenessCheck(g);
    return c.name && c.needs && c.painPoints;
  });

  return (
    <div>
      <SectionCard
        title="Primary User Groups"
        icon="👤"
        subtitle="For each primary user group, work through the guided questions to document their needs, pain points, opportunities, and journey. Everything here should come from your interviews."
      >
        {researchGroupNames.length > 0 && (
          <div style={{ background: 'var(--green-light)', border: '1px solid var(--green)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 16, fontSize: 13, color: 'var(--green)' }}>
            ✓ {researchGroupNames.length} primary group{researchGroupNames.length !== 1 ? 's' : ''} from User Research: <strong>{researchGroupNames.join(', ')}</strong>
          </div>
        )}

        {pg.map((g, i) => (
          <GroupCard
            key={g.id}
            group={g}
            index={i}
            onChange={(updated) => updateGroup(i, updated)}
            onRemove={() => removeGroup(i)}
            canRemove={pg.length > 1}
            coaching={coaching}
            setCoach={setCoach}
            projectContext={ctx}
          />
        ))}

        {pg.length < 5 && (
          <button style={S.addBtn} onClick={addGroup}>+ Add group</button>
        )}
      </SectionCard>

      <NavButtons
        onBack={onBack}
        onNext={onNext}
        nextLabel="Save & Continue to Core Problems →"
        hint={allHaveRequiredFields ? `✓ ${pg.length} groups documented` : '⚠ Some groups are missing required fields'}
      />
    </div>
  );
}
