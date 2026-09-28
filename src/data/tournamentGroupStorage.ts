import { PADEL_TOURNAMENTS_DATA, PoolTeamStanding, TournamentParticipant } from './padelProTournamentsData';
import { getStoredMembers, lookupMemberByName } from './clubMembersStorage';
import { getStoredTournamentById } from './tournamentStorage';

export interface GroupTeamItem {
  id: string;
  name: string;
  p1: string;
  p2: string;
  member1Id?: string;
  member2Id?: string;
  p1Photo?: string;
  p2Photo?: string;
  club: string;
  rating: string;
  pool: string;
  seed?: number;
  isQualified?: boolean;
}

export interface PoolGroupData {
  poolName: string;
  teams: GroupTeamItem[];
}

export interface TournamentDrawState {
  tournamentId: string;
  pools: PoolGroupData[];
  lastUpdated: string;
  isDrawApplied: boolean;
}

const STORAGE_PREFIX = 'lagilagipadel_groups_';

/**
 * Generate default group distribution from initial tournament data or club members
 */
export const getDefaultTournamentGroups = (tournamentId: string): PoolGroupData[] => {
  if (!tournamentId) return [];
  const tourney = getStoredTournamentById(tournamentId) || PADEL_TOURNAMENTS_DATA[tournamentId];
  let poolNames = tourney?.groupStandings?.pools?.filter((p) => p !== 'Semua Pool') || [];
  if (!poolNames || poolNames.length === 0) {
    poolNames = ['Pool A', 'Pool B', 'Pool C', 'Pool D'];
  }
  const participants = tourney?.participants || [];

  const result: PoolGroupData[] = poolNames.map((poolName) => ({
    poolName,
    teams: []
  }));

  if (participants.length > 0) {
    participants.forEach((p, idx) => {
      const targetPoolName = p.pool || poolNames[idx % poolNames.length];
      let poolObj = result.find((pg) => pg.poolName === targetPoolName);
      if (!poolObj) {
        poolObj = { poolName: targetPoolName, teams: [] };
        result.push(poolObj);
      }

      const mem1 = lookupMemberByName(p.p1);
      const mem2 = lookupMemberByName(p.p2);

      poolObj.teams.push({
        id: `team-${tournamentId}-${idx + 1}`,
        name: p.teamName,
        p1: p.p1,
        p2: p.p2,
        member1Id: mem1?.id || `LLP-MBR-${String(100 + idx * 2 + 1)}`,
        member2Id: mem2?.id || `LLP-MBR-${String(100 + idx * 2 + 2)}`,
        p1Photo: mem1?.photoUrl,
        p2Photo: mem2?.photoUrl,
        club: p.club,
        rating: p.rating,
        pool: poolObj.poolName,
        seed: p.seed,
        isQualified: p.status === 'Playoff'
      });
    });
  } else {
    // If tournament has no participants yet, seed with available active club members (if any)
    const members = getStoredMembers();
    if (members.length >= 2) {
      const teamsCount = Math.min(8, Math.max(2, Math.floor(members.length / 2)));
      for (let i = 0; i < teamsCount; i++) {
        const m1 = members[i * 2] || members[0];
        const m2 = members[i * 2 + 1] || members[1];
        const poolName = poolNames[i % poolNames.length];
        const poolObj = result.find((pg) => pg.poolName === poolName);
        if (poolObj && m1 && m2) {
          poolObj.teams.push({
            id: `team-${tournamentId}-${i + 1}`,
            name: `${m1.nickname || m1.name.split(' ')[0]} & ${m2.nickname || m2.name.split(' ')[0]}`,
            p1: m1.name,
            p2: m2.name,
            member1Id: m1.id,
            member2Id: m2.id,
            p1Photo: m1.photoUrl,
            p2Photo: m2.photoUrl,
            club: m1.club || 'LagiLagi Padel Solo',
            rating: m1.rating || '3.0',
            pool: poolName,
            seed: i + 1,
            isQualified: i < 4
          });
        }
      }
    }
  }

  return result;
};

/**
 * Get tournament pools from storage or default
 */
export const getStoredTournamentGroups = (tournamentId: string): PoolGroupData[] => {
  if (!tournamentId) return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${tournamentId}`);
    if (raw !== null) {
      const parsed: TournamentDrawState = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.pools)) {
        return parsed.pools;
      }
    }
  } catch (err) {
    console.error('Error reading tournament groups:', err);
  }
  return getDefaultTournamentGroups(tournamentId);
};

/**
 * Clear all tournament pools from localStorage
 */
export const clearAllTournamentGroups = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error('Error clearing tournament groups:', err);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_groups_updated', {
      detail: { pools: [] }
    })
  );
};

/**
 * Save tournament pools and broadcast custom event
 */
export const saveStoredTournamentGroups = (tournamentId: string, pools: PoolGroupData[]): void => {
  try {
    const state: TournamentDrawState = {
      tournamentId,
      pools,
      lastUpdated: new Date().toISOString(),
      isDrawApplied: true
    };
    localStorage.setItem(`${STORAGE_PREFIX}${tournamentId}`, JSON.stringify(state));

    // Also update participants and groupStandings in PADEL_TOURNAMENTS_DATA in memory
    const tourney = PADEL_TOURNAMENTS_DATA[tournamentId];
    if (tourney) {
      const flatTeams: GroupTeamItem[] = [];
      pools.forEach((p) => {
        p.teams.forEach((t) => {
          flatTeams.push({ ...t, pool: p.poolName });
        });
      });

      // Update participants
      tourney.participants = flatTeams.map((t, idx) => ({
        seed: t.seed || idx + 1,
        teamName: t.name,
        p1: t.p1,
        p2: t.p2,
        category: tourney.categories[0] || 'Rookie Fix Mix',
        club: t.club || 'LagiLagi Padel Club',
        city: 'Jakarta Selatan',
        pool: t.pool,
        rating: t.rating || '3.0',
        status: t.isQualified ? 'Playoff' : 'Confirmed'
      }));

      // Update groupStandings
      tourney.groupStandings.pools = ['Semua Pool', ...pools.map((p) => p.poolName)];
      tourney.groupStandings.standings = flatTeams.map((t, idx) => {
        const existing = tourney.groupStandings.standings.find((s) => s.name === t.name);
        return (
          existing || {
            id: t.id,
            pos: (idx % 4) + 1,
            name: t.name,
            p1: t.p1,
            p2: t.p2,
            pool: t.pool,
            played: 0,
            won: 0,
            lost: 0,
            gamesWon: 0,
            gamesLost: 0,
            gameDiff: 0,
            points: 0,
            isQualified: !!t.isQualified
          }
        );
      });
    }

    // Broadcast event
    window.dispatchEvent(
      new CustomEvent('lagilagipadel_groups_updated', {
        detail: { tournamentId, pools }
      })
    );
  } catch (err) {
    console.error('Error saving tournament groups:', err);
  }
};

/**
 * Fisher-Yates array shuffle helper
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Randomize teams into available pools evenly
 */
export const randomizeTeamsToPools = (
  teams: GroupTeamItem[],
  poolNames: string[]
): PoolGroupData[] => {
  if (poolNames.length === 0) return [];
  const shuffled = shuffleArray(teams);

  const result: PoolGroupData[] = poolNames.map((name) => ({
    poolName: name,
    teams: []
  }));

  shuffled.forEach((team, index) => {
    const poolIndex = index % poolNames.length;
    result[poolIndex].teams.push({
      ...team,
      pool: poolNames[poolIndex]
    });
  });

  return result;
};

/**
 * Reset groups to factory default
 */
export const resetStoredTournamentGroups = (tournamentId: string): PoolGroupData[] => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${tournamentId}`);
    const defaultData = getDefaultTournamentGroups(tournamentId);
    saveStoredTournamentGroups(tournamentId, defaultData);
    return defaultData;
  } catch (err) {
    console.error('Error resetting tournament groups:', err);
    return getDefaultTournamentGroups(tournamentId);
  }
};
