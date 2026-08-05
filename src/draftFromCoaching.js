// Synthesizes coaching answers into cohesive launchpad answer drafts.
// Uses ONLY what the user typed — no external data, no context interpolation.
// Each function returns null if there is not enough content to generate a draft.

const DRAFT_PREFIX = '⚠ DRAFT ONLY — PLEASE REVIEW AND EDIT BEFORE SUBMITTING\n\n';

// ── Helpers ──────────────────────────────────────────────────────────────────

function val(text) {
  if (!text || !text.trim()) return '';
  return text.trim()
    .replace(/^e\.g\.?,?\s*/i, '')   // strip example prefixes
    .replace(/^\[.*?\]\s*/, '');      // strip placeholder brackets at start
}

function cap(text) {
  const s = val(text);
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function end(text) {
  const s = val(text);
  if (!s) return '';
  return /[.!?]$/.test(s) ? s : s + '.';
}

// First sentence only — avoids dumping a wall of text inline
function first(text) {
  const s = val(text);
  if (!s) return '';
  const match = s.match(/^[^.!?\n]+[.!?]?/);
  return match ? match[0].trim() : s.substring(0, 200);
}

function has(...vals) {
  return vals.some(v => v && val(v).length > 8);
}

function para(...sentences) {
  return sentences.filter(Boolean).join(' ');
}

// ── Step 1: User Research ────────────────────────────────────────────────────

export function draftDataSources(c) {
  if (!has(c.ds_databases, c.ds_census, c.ds_program, c.ds_methodology)) return null;

  const parts = [];

  if (has(c.ds_databases)) {
    parts.push(end(cap(c.ds_databases)));
  }
  if (has(c.ds_census)) {
    parts.push(`For population-level context: ${end(val(c.ds_census))}`);
  }
  if (has(c.ds_program)) {
    parts.push(`Program staff knowledge also informs these estimates: ${end(val(c.ds_program))}`);
  }
  if (has(c.ds_methodology)) {
    parts.push(`For groups without a direct count, the estimation approach is: ${end(val(c.ds_methodology))}`);
  }

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftResearchPlan(c) {
  if (!has(c.rp_existing, c.rp_orgs, c.rp_venues, c.rp_barriers)) return null;

  const parts = [];

  if (has(c.rp_existing)) {
    parts.push(`Recruiting will start from existing relationships and contacts: ${end(val(c.rp_existing))}`);
  }
  if (has(c.rp_orgs)) {
    parts.push(`We will partner with community organisations and networks to reach users through trusted channels: ${end(val(c.rp_orgs))}`);
  }
  if (has(c.rp_venues)) {
    parts.push(`Participants will be reached through the following channels and venues: ${end(val(c.rp_venues))}`);
  }
  if (has(c.rp_barriers)) {
    parts.push(`To ensure hard-to-reach groups are included: ${end(val(c.rp_barriers))}`);
  }

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftSynthesis(c) {
  if (!has(c.syn_method, c.syn_patterns, c.syn_surprises, c.syn_gaps)) return null;

  const parts = [];

  if (has(c.syn_method)) {
    parts.push(end(cap(c.syn_method)));
  }
  if (has(c.syn_patterns)) {
    parts.push(`The key patterns that emerged across interviews were: ${end(val(c.syn_patterns))}`);
  }
  if (has(c.syn_surprises)) {
    parts.push(`Notably, ${end(val(c.syn_surprises))}`);
  }
  if (has(c.syn_gaps)) {
    parts.push(`Remaining gaps in the research: ${end(val(c.syn_gaps))}`);
  }

  return DRAFT_PREFIX + parts.join(' ');
}

// ── Step 2: Primary User Groups ──────────────────────────────────────────────

export function draftGroupOpportunities(c, pfx) {
  const direct = c[`${pfx}_opp_direct`], policy = c[`${pfx}_opp_policy`];
  if (!has(direct, policy)) return null;

  const parts = [];

  if (has(direct)) parts.push(`The most direct opportunities to improve this experience: ${end(val(direct))}`);
  if (has(policy)) parts.push(`Beyond technology, there are also policy or process opportunities worth addressing: ${end(val(policy))}`);

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftGroupTechBarriers(c, pfx) {
  const a = c[`${pfx}_tech_access`], lang = c[`${pfx}_tech_lang`], trust = c[`${pfx}_tech_trust`];
  if (!has(a, lang, trust)) return null;

  const parts = [];

  if (has(a)) parts.push(end(cap(a)));
  if (has(lang)) parts.push(`Language and accessibility considerations: ${end(val(lang))}`);
  if (has(trust)) parts.push(`Trust and privacy concerns to account for: ${end(val(trust))}`);

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftGroupJourney(c, pfx) {
  const st = c[`${pfx}_journey_steps`], hi = c[`${pfx}_journey_highs`], lo = c[`${pfx}_journey_lows`];
  if (!has(st, hi, lo)) return null;

  const parts = [];

  if (has(st)) parts.push(`The current journey: ${end(val(st))}`);
  if (has(hi)) parts.push(`Where the experience works well and should be preserved: ${end(val(hi))}`);
  if (has(lo)) parts.push(`The biggest pain points and failure moments: ${end(val(lo))}`);

  return DRAFT_PREFIX + parts.join(' ');
}

// ── Step 3: Core Problems ────────────────────────────────────────────────────

export function draftDefinitionOfSuccess(c, pfx) {
  const ou = c[`${pfx}_success_outcome`], si = c[`${pfx}_success_signal`], nd = c[`${pfx}_success_notdone`];
  if (!has(ou, si)) return null;

  const parts = [];

  if (has(ou)) parts.push(end(cap(ou)));
  if (has(si)) parts.push(`We will know this has been achieved when: ${end(val(si))}`);
  if (has(nd)) parts.push(`We will know we have not succeeded if: ${end(val(nd))}`);

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftRelatedIssues(c, pfx) {
  const re = c[`${pfx}_context_related`], ro = c[`${pfx}_context_root`], hi = c[`${pfx}_context_history`];
  if (!has(re, ro, hi)) return null;

  const parts = [];

  if (has(re)) parts.push(end(cap(re)));
  if (has(ro)) parts.push(`The root cause analysis points to: ${end(val(ro))}`);
  if (has(hi)) parts.push(`Previous attempts to address this: ${end(val(hi))}`);

  return DRAFT_PREFIX + parts.join(' ');
}

// ── Step 4: Product Strategy ─────────────────────────────────────────────────

export function draftProductVision(c) {
  const uo = c.ps_user_outcome, vp = c.ps_value_prop, di = c.ps_differentiation, co = c.ps_constraints;
  if (!has(uo, vp)) return null;

  const parts = [];

  if (has(uo)) {
    parts.push(end(cap(uo)));
  }
  if (has(vp)) {
    parts.push(end(cap(vp)));
  }
  if (has(di)) {
    parts.push(`What makes this the right product rather than a generic portal: ${end(val(di))}`);
  }
  if (has(co)) {
    parts.push(`The approach is shaped by the following constraints: ${end(val(co))}`);
  }

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftRejectedAlternatives(c) {
  const al = c.rej_alternatives, ul = c.rej_user_lens, ev = c.rej_evidence;
  if (!has(al, ul)) return null;

  const parts = [];

  if (has(al)) {
    parts.push(`The following approaches were seriously considered: ${end(val(al))}`);
  }
  if (has(ul)) {
    parts.push(`Evaluating each through the lens of what users would gain or lose: ${end(val(ul))}`);
  }
  if (has(ev)) {
    parts.push(`The evidence that ruled these out: ${end(val(ev))}`);
  }

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftFirstRelease(c) {
  const uj = c.fr_user_journey, hy = c.fr_value_hypothesis, os = c.fr_out_of_scope, va = c.fr_validation;
  if (!has(uj, hy)) return null;

  const parts = [];

  if (has(uj)) {
    parts.push(`Release 1 delivers one complete user journey: ${end(val(uj))}`);
  }
  if (has(os)) {
    parts.push(`Deliberately excluded from this release: ${end(val(os))}`);
  }
  if (has(hy)) {
    parts.push(`The core hypothesis this release is testing: ${end(val(hy))}`);
  }
  if (has(va)) {
    parts.push(`We will validate this within 90 days of launch by: ${end(val(va))}`);
  }

  return DRAFT_PREFIX + parts.join(' ');
}

export function draftFirstReleaseValue(c) {
  const hy = c.fr_value_hypothesis, va = c.fr_validation;
  if (!has(hy, va)) return null;

  const parts = [];

  if (has(hy)) parts.push(end(cap(hy)));
  if (has(va)) parts.push(`To test this belief after launch: ${end(val(va))}`);

  return DRAFT_PREFIX + parts.join(' ');
}
