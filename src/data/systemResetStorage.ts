import { FullTournamentDetail, PADEL_TOURNAMENTS_DATA } from './padelProTournamentsData';
import { ClubMember, DEFAULT_CLUB_MEMBERS, saveStoredMembers } from './clubMembersStorage';
import { KnockoutBracketData, getCleanEmptyBracket } from './bracketStorage';
import { clearStoredRefereeState, restoreStoredRefereeState } from './refereeStorage';

const TOURNAMENTS_STORAGE_KEY = 'lagilagipadel_custom_tournaments';
const MEMBERS_STORAGE_KEY = 'lagilagipadel_club_members';
const BRACKET_PREFIX = 'lagilagipadel_bracket_';
const GROUPS_PREFIX = 'lagilagipadel_groups_';
const REFEREE_STORAGE_KEY = 'lagilagipadel_referee_state';

/**
 * Completely empties all system data:
 * - 0 Tournaments
 * - 0 Players / Club Members
 * - Clean empty Brackets (TBD / no scores)
 * - 0 Group Draws / Pools
 * - 0 Live Referee Scoring & Match History (0-0, 0 Games, 0 Sets)
 */
export const clearAllSystemData = (): void => {
  try {
    // 1. Clear Tournaments to empty array []
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify([]));

    // 2. Clear Members to empty array []
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify([]));

    // 3. Clear all custom brackets in localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(BRACKET_PREFIX) || key.startsWith(GROUPS_PREFIX) || key === REFEREE_STORAGE_KEY)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));

    // 4. Remove any active scoring snapshot and explicitly save empty referee state
    localStorage.removeItem('lagilagipadel_active_match');
    clearStoredRefereeState();
  } catch (err) {
    console.error('Error clearing all system data:', err);
  }

  // 5. Broadcast global reactive events to sync all open screens immediately
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: [] }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_members_updated', {
      detail: { members: [] }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_bracket_updated', {
      detail: { tournamentId: 'all', bracket: getCleanEmptyBracket() }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_groups_updated', {
      detail: { tournamentId: 'all', pools: [] }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_scoring_reset', {
      detail: { cleared: true }
    })
  );
};

/**
 * Restores system data back to the factory demo defaults:
 * - Default tournaments (Rookie Fix Mix, HDMC Champions, F3 Rookie Men)
 * - 16 Default club members
 * - Default bracket and pool groupings
 * - Default referee match scoring (Olivia & Rico vs Kartika & Dodie)
 */
export const resetAllSystemDataToDefault = (): void => {
  const defaultTournaments = Object.values(PADEL_TOURNAMENTS_DATA);

  try {
    // 1. Restore Tournaments
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(defaultTournaments));

    // 2. Restore Members
    saveStoredMembers(DEFAULT_CLUB_MEMBERS);

    // 3. Restore Referee State
    restoreStoredRefereeState();

    // 4. Remove custom bracket and group overrides so defaults take effect
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith(BRACKET_PREFIX) || key.startsWith(GROUPS_PREFIX))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Error restoring default system data:', err);
  }

  // 5. Broadcast global reactive events
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: defaultTournaments }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_members_updated', {
      detail: { members: DEFAULT_CLUB_MEMBERS }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_bracket_updated', {
      detail: { tournamentId: 'rookie-mix', bracket: PADEL_TOURNAMENTS_DATA['rookie-mix'].knockoutBracket }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_groups_updated', {
      detail: { tournamentId: 'rookie-mix' }
    })
  );

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_scoring_reset', {
      detail: { cleared: false, resetToDefault: true }
    })
  );
};
