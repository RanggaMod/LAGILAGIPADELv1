import { PADEL_TOURNAMENTS_DATA, FullTournamentDetail, TournamentMatch, TournamentWinner } from './padelProTournamentsData';

const TOURNAMENTS_STORAGE_KEY = 'lagilagipadel_custom_tournaments';

/**
 * Initializes and retrieves tournaments from persistent local storage.
 * Seeds with default predefined tournaments if storage is empty.
 */
export const getStoredTournaments = (): FullTournamentDetail[] => {
  try {
    const raw = localStorage.getItem(TOURNAMENTS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading stored tournaments:', err);
  }

  // Seed default tournaments ONLY on fresh initial load when key does not exist
  const defaultList = Object.values(PADEL_TOURNAMENTS_DATA);
  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(defaultList));
  } catch (e) {
    console.error(e);
  }
  return defaultList;
};

/**
 * Empties all tournaments (0 tournaments).
 */
export const clearAllTournaments = (): void => {
  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify([]));
  } catch (e) {
    console.error(e);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: [] }
    })
  );
};

/**
 * Retrieves a single tournament by its ID.
 */
export const getStoredTournamentById = (id: string): FullTournamentDetail | undefined => {
  const all = getStoredTournaments();
  return all.find((t) => t.id === id);
};

/**
 * Saves (creates or updates) a tournament.
 */
export const saveTournament = (tournament: FullTournamentDetail): void => {
  const current = getStoredTournaments();
  const existingIndex = current.findIndex((t) => t.id === tournament.id);

  let updated: FullTournamentDetail[];
  if (existingIndex >= 0) {
    // Preserve existing rich data (participants, bracket, matches) if not supplied in edit
    const existing = current[existingIndex];
    updated = [...current];
    updated[existingIndex] = {
      ...existing,
      ...tournament,
      // Ensure complex objects aren't wiped out if absent
      winners: tournament.winners || existing.winners,
      participants: tournament.participants || existing.participants,
      matches: tournament.matches || existing.matches,
      knockoutBracket: tournament.knockoutBracket || existing.knockoutBracket,
      groupStandings: tournament.groupStandings || existing.groupStandings
    };
  } else {
    // New tournament: ensure complete sub-structures exist
    const newTournament: FullTournamentDetail = {
      ...tournament,
      winners: tournament.winners || {
        notes: `Turnamen ${tournament.name} belum memiliki pemenang resmi.`,
        podium: []
      },
      participants: tournament.participants || [],
      matches: tournament.matches || [],
      knockoutBracket: tournament.knockoutBracket || {
        quarters: [
          {
            id: 'qf-1',
            roundTitle: 'Perempat Final 1',
            court: 'Court 1',
            time: '13:00',
            team1: { name: 'Menunggu Tim (Juara Pool A)', players: 'Pemain 1 / Pemain 2', score: '-', isWinner: false },
            team2: { name: 'Menunggu Tim (Runner-up Pool B)', players: 'Pemain 1 / Pemain 2', score: '-', isWinner: false },
            status: 'Dijadwalkan'
          },
          {
            id: 'qf-2',
            roundTitle: 'Perempat Final 2',
            court: 'Court 2',
            time: '13:45',
            team1: { name: 'Menunggu Tim (Juara Pool B)', players: 'Pemain 1 / Pemain 2', score: '-', isWinner: false },
            team2: { name: 'Menunggu Tim (Runner-up Pool A)', players: 'Pemain 1 / Pemain 2', score: '-', isWinner: false },
            status: 'Dijadwalkan'
          }
        ],
        semis: [
          {
            id: 'sf-1',
            roundTitle: 'Semifinal 1',
            court: 'Court 1',
            time: '15:30',
            team1: { name: 'Pemenang QF 1', players: 'TBD', score: '-', isWinner: false },
            team2: { name: 'Pemenang QF 2', players: 'TBD', score: '-', isWinner: false },
            status: 'Dijadwalkan'
          }
        ],
        grandFinal: {
          id: 'gf-1',
          roundTitle: 'Grand Final (Gold Match)',
          court: 'Court 1',
          time: '17:00',
          team1: { name: 'Finalis 1', players: 'TBD', score: '-', isWinner: false },
          team2: { name: 'Finalis 2', players: 'TBD', score: '-', isWinner: false },
          status: 'Dijadwalkan'
        },
        bronzeMatch: {
          id: 'bm-1',
          roundTitle: 'Perebutan Tempat ke-3 (Bronze)',
          court: 'Court 2',
          time: '16:15',
          team1: { name: 'Semifinalis 1', players: 'TBD', score: '-', isWinner: false },
          team2: { name: 'Semifinalis 2', players: 'TBD', score: '-', isWinner: false },
          status: 'Dijadwalkan'
        }
      },
      groupStandings: tournament.groupStandings || {
        pools: ['Semua Pool', 'Pool A', 'Pool B'],
        standings: []
      }
    };
    updated = [newTournament, ...current];
  }

  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving tournament:', err);
  }

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: updated, affectedId: tournament.id }
    })
  );
};

/**
 * Updates only the status of an existing tournament quickly.
 */
export const updateTournamentStatus = (
  id: string,
  status: 'Live' | 'Selesai' | 'Akan Datang'
): void => {
  const current = getStoredTournaments();
  const index = current.findIndex((t) => t.id === id);
  if (index === -1) return;

  current[index].status = status;

  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Error updating tournament status:', err);
  }

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: current, affectedId: id }
    })
  );
};

/**
 * Deletes a tournament by its ID.
 */
export const deleteTournament = (id: string): void => {
  const current = getStoredTournaments();
  const updated = current.filter((t) => t.id !== id);

  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting tournament:', err);
  }

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: updated, affectedId: id, deleted: true }
    })
  );
};

/**
 * Resets tournament list back to system default.
 */
export const resetToDefaultTournaments = (): FullTournamentDetail[] => {
  const defaultList = Object.values(PADEL_TOURNAMENTS_DATA);
  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(defaultList));
  } catch (e) {
    console.error(e);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: defaultList }
    })
  );
  return defaultList;
};

/**
 * Real-time synchronization of a referee live match into the tournament's matches list.
 * Auto-marks the tournament status as 'Live' and dispatches update event to guest viewers.
 */
export const syncLiveMatchScore = (
  tournamentId: string,
  courtNumber: number,
  matchPhase: string,
  teamAName: string,
  teamBName: string,
  scoreA: string,
  scoreB: string,
  setDetail: string
): void => {
  const allTournaments = getStoredTournaments();
  const index = allTournaments.findIndex((t) => t.id === tournamentId);
  if (index === -1) return;

  const tourney = allTournaments[index];
  const matchId = `live-${tournamentId}-c${courtNumber}`;
  const existingMatches = tourney.matches || [];

  const roundCategory: 'final' | 'knockout' | 'grup' = matchPhase.toLowerCase().includes('final')
    ? 'final'
    : matchPhase.toLowerCase().includes('semi') || matchPhase.toLowerCase().includes('quarter') || matchPhase.toLowerCase().includes('perempat')
    ? 'knockout'
    : 'grup';

  const updatedMatch: TournamentMatch = {
    id: matchId,
    round: `${matchPhase} (Court ${courtNumber})`,
    roundCategory,
    court: `Court ${courtNumber}`,
    time: 'Sedang Berlangsung (Live)',
    teamA: teamAName,
    playersA: teamAName,
    teamB: teamBName,
    playersB: teamBName,
    scoreA,
    scoreB,
    setDetail,
    winner: 'live',
    status: 'Live'
  };

  // Replace existing match on this court or prepend
  const otherMatches = existingMatches.filter(
    (m) => m.id !== matchId && m.court !== `Court ${courtNumber}`
  );

  const updatedTournament: FullTournamentDetail = {
    ...tourney,
    status: 'Live',
    liveCourtNumber: courtNumber,
    matches: [updatedMatch, ...otherMatches]
  };

  allTournaments[index] = updatedTournament;

  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(allTournaments));
  } catch (err) {
    console.error('Error syncing live match score:', err);
  }

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: allTournaments, affectedId: tournamentId, liveUpdate: true }
    })
  );
};

/**
 * Finishes a match officially and publishes it to the guest system.
 * Updates match status to 'Selesai', records winners, and updates tournament podium if Grand Final.
 */
export const finishAndPublishMatch = (
  tournamentId: string,
  courtNumber: number,
  matchPhase: string,
  teamAName: string,
  teamBName: string,
  finalScoreA: string,
  finalScoreB: string,
  setDetail: string,
  winnerChoice: 'A' | 'B'
): { updatedTournament: FullTournamentDetail; isGrandFinal: boolean } => {
  const allTournaments = getStoredTournaments();
  const index = allTournaments.findIndex((t) => t.id === tournamentId);
  if (index === -1) {
    throw new Error('Tournament not found');
  }

  const tourney = allTournaments[index];
  const matchId = `finished-${tournamentId}-${Date.now()}`;
  const liveMatchId = `live-${tournamentId}-c${courtNumber}`;
  const existingMatches = tourney.matches || [];

  const winnerName = winnerChoice === 'A' ? teamAName : teamBName;
  const loserName = winnerChoice === 'A' ? teamBName : teamAName;

  const roundCategory: 'final' | 'knockout' | 'grup' = matchPhase.toLowerCase().includes('final')
    ? 'final'
    : matchPhase.toLowerCase().includes('semi') || matchPhase.toLowerCase().includes('quarter') || matchPhase.toLowerCase().includes('perempat')
    ? 'knockout'
    : 'grup';

  const finishedMatch: TournamentMatch = {
    id: matchId,
    round: `${matchPhase} (Court ${courtNumber})`,
    roundCategory,
    court: `Court ${courtNumber}`,
    time: 'Selesai',
    teamA: teamAName,
    playersA: teamAName,
    teamB: teamBName,
    playersB: teamBName,
    scoreA: finalScoreA,
    scoreB: finalScoreB,
    setDetail: `${setDetail} · Pemenang: ${winnerName} 🏆`,
    winner: winnerChoice,
    status: 'Selesai'
  };

  // Replace any previous live match on this court
  const cleanMatches = existingMatches.filter(
    (m) => m.id !== liveMatchId && !(m.court === `Court ${courtNumber}` && m.status === 'Live')
  );

  const updatedMatches = [finishedMatch, ...cleanMatches];

  // Check if it's Grand Final to update podium
  const isGrandFinal =
    matchPhase.toLowerCase().includes('grand final') ||
    (matchPhase.toLowerCase().includes('final') && !matchPhase.toLowerCase().includes('semi') && !matchPhase.toLowerCase().includes('perempat') && !matchPhase.toLowerCase().includes('quarter') && !matchPhase.toLowerCase().includes('3'));

  const isBronze = matchPhase.toLowerCase().includes('3') || matchPhase.toLowerCase().includes('bronze');

  let updatedWinners = { ...tourney.winners };

  if (isGrandFinal) {
    const existingPodium = updatedWinners.podium || [];
    const podiumFiltered = existingPodium.filter((p) => p.place !== '1' && p.place !== '2');

    const goldPodium: TournamentWinner = {
      place: '1',
      title: 'JUARA 1 (GOLD)',
      badgeColor: 'bg-amber-400',
      teamName: winnerName,
      p1: winnerName.split('&')[0]?.trim() || winnerName,
      p2: winnerName.split('&')[1]?.trim() || winnerName,
      club: 'LagiLagiPadel Club',
      prize: 'Rp 15.000.000 + Golden Cup Trophy',
      trophy: '🏆 Golden Trophy FIP',
      finalScore: `${finalScoreA} - ${finalScoreB}`,
      pointsEarned: 1000
    };

    const silverPodium: TournamentWinner = {
      place: '2',
      title: 'JUARA 2 (SILVER)',
      badgeColor: 'bg-neutral-300',
      teamName: loserName,
      p1: loserName.split('&')[0]?.trim() || loserName,
      p2: loserName.split('&')[1]?.trim() || loserName,
      club: 'LagiLagiPadel Club',
      prize: 'Rp 8.000.000 + Silver Plate',
      trophy: '🥈 Silver Trophy',
      finalScore: `${finalScoreA} - ${finalScoreB}`,
      pointsEarned: 600
    };

    updatedWinners = {
      ...updatedWinners,
      notes: `Grand Final resmi berakhir! Tim ${winnerName} dinobatkan sebagai Juara 1 (Gold) setelah mengalahkan ${loserName}.`,
      podium: [goldPodium, silverPodium, ...podiumFiltered]
    };
  } else if (isBronze) {
    const existingPodium = updatedWinners.podium || [];
    const podiumFiltered = existingPodium.filter((p) => p.place !== '3');

    const bronzePodium: TournamentWinner = {
      place: '3',
      title: 'JUARA 3 (BRONZE)',
      badgeColor: 'bg-amber-700',
      teamName: winnerName,
      p1: winnerName.split('&')[0]?.trim() || winnerName,
      p2: winnerName.split('&')[1]?.trim() || winnerName,
      club: 'LagiLagiPadel Club',
      prize: 'Rp 4.000.000 + Bronze Medal',
      trophy: '🥉 Bronze Trophy',
      finalScore: `${finalScoreA} - ${finalScoreB}`,
      pointsEarned: 350
    };

    updatedWinners = {
      ...updatedWinners,
      podium: [...podiumFiltered, bronzePodium]
    };
  }

  const updatedTournament: FullTournamentDetail = {
    ...tourney,
    status: isGrandFinal ? 'Selesai' : tourney.status,
    matches: updatedMatches,
    winners: updatedWinners
  };

  allTournaments[index] = updatedTournament;

  try {
    localStorage.setItem(TOURNAMENTS_STORAGE_KEY, JSON.stringify(allTournaments));
  } catch (err) {
    console.error('Error saving finished match:', err);
  }

  window.dispatchEvent(
    new CustomEvent('lagilagipadel_tournaments_updated', {
      detail: { tournaments: allTournaments, affectedId: tournamentId, finishedMatch: true }
    })
  );

  return { updatedTournament, isGrandFinal };
};
