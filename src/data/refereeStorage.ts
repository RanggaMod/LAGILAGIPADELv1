export interface RefereeScoringState {
  teamAName: string;
  teamBName: string;
  courtScoreA: number; // 0=0, 1=15, 2=30, 3=40
  courtScoreB: number;
  gamesTeamA: number;
  gamesTeamB: number;
  currentSetA: number;
  currentSetB: number;
  currentServer: 'A' | 'B';
  goldenPointActive: boolean;
  scoreHistory: string[];
  officialRefereeNotes: string;
  activeCourt: number;
  matchPhase: string;
  selectedTourneyId: string;
  isCleared: boolean;
}

export const EMPTY_REFEREE_STATE: RefereeScoringState = {
  teamAName: 'Tim A (TBD)',
  teamBName: 'Tim B (TBD)',
  courtScoreA: 0,
  courtScoreB: 0,
  gamesTeamA: 0,
  gamesTeamB: 0,
  currentSetA: 0,
  currentSetB: 0,
  currentServer: 'A',
  goldenPointActive: false,
  scoreHistory: [],
  officialRefereeNotes: 'Pertandingan belum dimulai (Data skoring & hasil wasit dikosongkan).',
  activeCourt: 1,
  matchPhase: 'Babak Pertandingan',
  selectedTourneyId: '',
  isCleared: true,
};

export const DEFAULT_REFEREE_STATE: RefereeScoringState = {
  teamAName: 'Olivia & Rico',
  teamBName: 'Kartika & Dodie',
  courtScoreA: 2,
  courtScoreB: 1,
  gamesTeamA: 3,
  gamesTeamB: 2,
  currentSetA: 1,
  currentSetB: 0,
  currentServer: 'A',
  goldenPointActive: false,
  scoreHistory: [
    'Game 1 dimenangkan Tim A (40-15)',
    'Game 2 dimenangkan Tim B (Golden Point 40-40)',
    'Game 3 dimenangkan Tim A (40-30)'
  ],
  officialRefereeNotes: 'Pertandingan berjalan kondusif sesuai regulasi FIP Padel Pro.',
  activeCourt: 2,
  matchPhase: 'Grand Final',
  selectedTourneyId: 'rookie-mix',
  isCleared: false,
};

export const REFEREE_STORAGE_KEY = 'lagilagipadel_referee_state';

export const getStoredRefereeState = (): RefereeScoringState => {
  try {
    const raw = localStorage.getItem(REFEREE_STORAGE_KEY);
    if (!raw) return EMPTY_REFEREE_STATE;
    const parsed = JSON.parse(raw);
    return { ...EMPTY_REFEREE_STATE, ...parsed };
  } catch (err) {
    console.error('Error reading stored referee state:', err);
    return EMPTY_REFEREE_STATE;
  }
};

export const saveStoredRefereeState = (state: RefereeScoringState): void => {
  try {
    localStorage.setItem(REFEREE_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error saving stored referee state:', err);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_referee_state_changed', {
      detail: { state }
    })
  );
};

export const clearStoredRefereeState = (): void => {
  try {
    localStorage.setItem(REFEREE_STORAGE_KEY, JSON.stringify(EMPTY_REFEREE_STATE));
  } catch (err) {
    console.error('Error clearing stored referee state:', err);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_scoring_reset', {
      detail: { state: EMPTY_REFEREE_STATE, cleared: true }
    })
  );
};

export const restoreStoredRefereeState = (): void => {
  try {
    localStorage.setItem(REFEREE_STORAGE_KEY, JSON.stringify(DEFAULT_REFEREE_STATE));
  } catch (err) {
    console.error('Error restoring stored referee state:', err);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_scoring_reset', {
      detail: { state: DEFAULT_REFEREE_STATE, resetToDefault: true }
    })
  );
};
