const STORAGE_KEY = 'mitdp_launchpad_v1';

export const defaultState = {
  meta: { projectName: '', agency: '', ownerName: '', ownerEmail: '', serviceDescription: '', projectCatalyst: '', currentSystem: '', knownProblems: '', lastSaved: null, aiAssist: false },
  userResearch: {
    userGroups: [
      { id: 1, name: '', description: '', currentUsers: '', potentialUsers: '', isPrimary: true },
    ],
    dataSources: '',
    researchPlan: { name: '', description: '' },
    interviewGuides: [{ name: '', description: '' }],
    participants: [
      { id: 1, userGroup: '', count: '', dateRange: '', duration: '', recruitingMethod: '', guideUsed: '' },
    ],
    synthesisNotes: '',
  },
  primaryUserGroups: [
    {
      id: 1,
      name: '',
      needs: ['', '', '', '', ''],
      painPoints: ['', '', '', '', ''],
      opportunities: '',
      technologyBarriers: '',
      journeyMap: '',
    },
  ],
  coreProblems: [
    {
      id: 1,
      name: '',
      currentState: '',
      undesiredOutcome: '',
      context: '',
      desiredOutcome: '',
      relatedIssues: '',
      definitionOfSuccess: '',
      impacts: ['', '', ''],
      metrics: [{ description: '', currentValue: '', targetValue: '', source: '' }],
    },
  ],
  productStrategy: {
    chosenStrategy: '',
    chosenTradeoffs: '',
    chosenArtifacts: '',
    rejectedStrategies: '',
    rejectedTradeoffs: '',
    firstRelease: '',
    firstReleaseTradeoffs: '',
    firstReleaseArtifacts: '',
    firstReleaseValue: '',
  },
  coaching: {},
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return deepMerge(defaultState, JSON.parse(raw));
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  try {
    const toSave = { ...state, meta: { ...state.meta, lastSaved: new Date().toISOString() } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return toSave;
  } catch {
    return state;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

function deepMerge(defaults, saved) {
  if (Array.isArray(defaults)) return saved ?? defaults;
  if (typeof defaults !== 'object' || defaults === null) return saved ?? defaults;
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (key in saved) result[key] = deepMerge(defaults[key], saved[key]);
  }
  return result;
}
