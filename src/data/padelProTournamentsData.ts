export interface TournamentWinner {
  place: '1' | '2' | '3' | 'harapan';
  title: string; // e.g. "JUARA 1 (GOLD)", "JUARA 2 (SILVER)", "JUARA 3 (BRONZE)"
  badgeColor: string;
  teamName: string;
  p1: string;
  p2: string;
  club: string;
  prize: string;
  trophy: string;
  finalScore?: string;
  pointsEarned: number;
}

export interface TournamentParticipant {
  seed: number;
  teamName: string;
  p1: string;
  p2: string;
  category: string;
  club: string;
  city: string;
  pool: string;
  rating: string;
  status: 'Confirmed' | 'Check-in' | 'Playoff' | 'Eliminated';
}

export interface TournamentMatch {
  id: string;
  round: string; // "Babak Grup - Pool A", "Perempat Final", "Semifinal", "Grand Final", "Perebutan Juara 3"
  roundCategory: 'grup' | 'knockout' | 'final';
  court: string;
  time: string;
  teamA: string;
  playersA: string;
  teamB: string;
  playersB: string;
  scoreA: string;
  scoreB: string;
  setDetail?: string;
  winner: 'A' | 'B' | 'live' | 'scheduled';
  status: 'Selesai' | 'Live' | 'Dijadwalkan';
}

export interface KnockoutMatch {
  id: string;
  roundTitle: string;
  court: string;
  time: string;
  team1: { name: string; players: string; score: string; isWinner: boolean; seed?: string };
  team2: { name: string; players: string; score: string; isWinner: boolean; seed?: string };
  status: 'Selesai' | 'Live' | 'Dijadwalkan';
  note?: string;
}

export interface PoolTeamStanding {
  id: string;
  pos: number;
  name: string;
  p1: string;
  p2: string;
  pool: string;
  played: number;
  won: number;
  lost: number;
  gamesWon: number;
  gamesLost: number;
  gameDiff: number;
  points: number;
  isQualified: boolean;
}

export interface FullTournamentDetail {
  id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  status: 'Live' | 'Selesai' | 'Akan Datang';
  categories: string[];
  totalCourts: number;
  rules: string;
  totalTeams: number;
  prizePool: string;
  description: string;
  liveCourtNumber?: number;

  // 5 SUB-SECTIONS AS REQUESTED
  winners: {
    podium: TournamentWinner[];
    mvp?: { name: string; award: string; stat: string };
    notes?: string;
  };
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  knockoutBracket: {
    roundOf16?: KnockoutMatch[];
    quarters: KnockoutMatch[];
    semis: KnockoutMatch[];
    grandFinal: KnockoutMatch;
    bronzeMatch?: KnockoutMatch;
  };
  groupStandings: {
    pools: string[];
    standings: PoolTeamStanding[];
  };
}

export const PADEL_TOURNAMENTS_DATA: Record<string, FullTournamentDetail> = {
  'rookie-mix': {
    id: 'rookie-mix',
    name: 'Rookie Fix Mix Motion x Winny Grosir',
    organizer: 'MOTION',
    location: 'All In Padel (4 Courts)',
    date: '2026-09-06',
    status: 'Live',
    categories: ['Rookie Fix Mix (8 Pools, 32 Teams)'],
    totalCourts: 4,
    totalTeams: 32,
    prizePool: 'Rp 21.000.000 + 4 Trofi Eksklusif',
    rules: 'Race to 4 Games · Golden Point Active · Auto Knockout Draw',
    description: 'Turnamen ganda campuran rookie paling bergengsi kolaborasi Motion x Winny Grosir dengan siaran online skoring wasit langsung.',
    liveCourtNumber: 2,

    winners: {
      notes: 'Turnamen Rookie Fix Mix telah selesai dengan seru! Pasangan Merry & Fifi keluar sebagai Juara 1 setelah menaklukkan Nia & Sassa Rizki.',
      podium: [
        {
          place: '1',
          title: 'JUARA 1 (GOLD CHAMPION)',
          badgeColor: 'gold',
          teamName: 'Merry & Fifi',
          p1: 'Merry',
          p2: 'Fifi',
          club: 'Kemang Padel Society',
          prize: 'Rp 12.000.000 + Trofi Emas Motion x Winny Grosir + 2 Raket Babolat',
          trophy: 'Trofi Emas Bergilir',
          finalScore: 'Menang 6 - 1 atas Nia & Sassa Rizki',
          pointsEarned: 1000
        },
        {
          place: '2',
          title: 'JUARA 2 (RUNNER UP SILVER)',
          badgeColor: 'silver',
          teamName: 'Nia & Sassa Rizki',
          p1: 'Nia',
          p2: 'Sassa Rizki',
          club: 'LagiLagi Padel Jakarta',
          prize: 'Rp 6.000.000 + Trofi Perak Motion + Voucher Pro Shop',
          trophy: 'Trofi Perak',
          finalScore: 'Kalah 1 - 6 di Grand Final',
          pointsEarned: 700
        },
        {
          place: '3',
          title: 'JUARA 3 (BRONZE MEDAL)',
          badgeColor: 'bronze',
          teamName: 'Christina & Mega',
          p1: 'Christina',
          p2: 'Mega',
          club: 'Satrio Padel Club',
          prize: 'Rp 3.000.000 + Medali Perunggu + Tas Padel Bullpadel',
          trophy: 'Medali Perunggu Resmi',
          finalScore: 'Menang 6 - 3 atas Chaz & Iphz',
          pointsEarned: 500
        },
        {
          place: 'harapan',
          title: 'PERINGKAT 4 (BRONZE PLAYOFF)',
          badgeColor: 'slate',
          teamName: 'Chaz & Iphz',
          p1: 'Chaz',
          p2: 'Iphz',
          club: 'Bandung Padel Arena',
          prize: 'Voucher Membership 1 Bulan LagiLagiPadel',
          trophy: 'Piagam Penghargaan 4 Besar',
          finalScore: 'Kalah 3 - 6 di perebutan tempat ke-3',
          pointsEarned: 350
        }
      ],
      mvp: {
        name: 'Olivia S.',
        award: 'Most Valuable Player (MVP) & Best Smash Winner',
        stat: '18 Unforced Error terendah & 24 Clean Winners'
      }
    },

    participants: [
      { seed: 1, teamName: 'Olivia & Rico', p1: 'Olivia S.', p2: 'Rico Prasetya', category: 'Rookie Fix Mix', club: 'Kemang Padel Society', city: 'Jakarta Selatan', pool: 'Pool A', rating: '3.2', status: 'Playoff' },
      { seed: 2, teamName: 'Kartika & Dodie Adam', p1: 'Kartika Aditoputro', p2: 'Dodie Adam', category: 'Rookie Fix Mix', club: 'LagiLagi Padel Jakarta', city: 'Jakarta Selatan', pool: 'Pool B', rating: '3.4', status: 'Playoff' },
      { seed: 3, teamName: 'Evan & Ngoe', p1: 'Evan Wirawan', p2: 'Ngoe Wijaya', category: 'Rookie Fix Mix', club: 'Satrio Padel Club', city: 'Jakarta Selatan', pool: 'Pool B', rating: '3.1', status: 'Playoff' },
      { seed: 4, teamName: 'Erde & Sie Jiang', p1: 'Erde Pratama', p2: 'Sie Jiang', category: 'Rookie Fix Mix', club: 'Bali Padel Academy', city: 'Denpasar', pool: 'Pool A', rating: '3.0', status: 'Playoff' },
      { seed: 5, teamName: 'Bimo & Farhan', p1: 'Bimo Prasetyo', p2: 'Farhan Hakim', category: 'Rookie Fix Mix', club: 'Bandung Padel Arena', city: 'Bandung', pool: 'Pool B', rating: '2.9', status: 'Playoff' },
      { seed: 6, teamName: 'Fery & Tania', p1: 'Fery Gunawan', p2: 'Tania Christie', category: 'Rookie Fix Mix', club: 'Padel Hub Surabaya', city: 'Surabaya', pool: 'Pool A', rating: '2.8', status: 'Confirmed' },
      { seed: 7, teamName: 'Hanung & Ria', p1: 'Hanung Bramantyo', p2: 'Ria Zaskia', category: 'Rookie Fix Mix', club: 'Padeloka', city: 'Jakarta Barat', pool: 'Pool A', rating: '2.7', status: 'Confirmed' },
      { seed: 8, teamName: 'Reza & Kevin', p1: 'Reza Rahardian', p2: 'Kevin Julio', category: 'Rookie Fix Mix', club: 'Kemang Padel Society', city: 'Jakarta Selatan', pool: 'Pool B', rating: '2.8', status: 'Confirmed' },
      { seed: 9, teamName: 'Ardi & Gilang', p1: 'Ardi Bakrie', p2: 'Gilang Dirga', category: 'Rookie Fix Mix', club: 'All In Padel', city: 'Jakarta Utara', pool: 'Pool C', rating: '2.9', status: 'Confirmed' },
      { seed: 10, teamName: 'Tommy & David', p1: 'Tommy Kurniawan', p2: 'David Bayu', category: 'Rookie Fix Mix', club: 'Zing Solo', city: 'Solo', pool: 'Pool C', rating: '3.0', status: 'Playoff' },
      { seed: 11, teamName: 'Bagas & Dimas', p1: 'Bagas Pratama', p2: 'Dimas Wicaksono', category: 'Rookie Fix Mix', club: 'LagiLagi Padel', city: 'Jakarta Selatan', pool: 'Pool D', rating: '3.1', status: 'Playoff' },
      { seed: 12, teamName: 'Rendy & Surya', p1: 'Rendy Pandugo', p2: 'Surya Insomnia', category: 'Rookie Fix Mix', club: 'Padel Pro Kemang', city: 'Jakarta Selatan', pool: 'Pool D', rating: '2.8', status: 'Confirmed' }
    ],

    matches: [
      { id: 'm-gf', round: 'Grand Final (Gold Match)', roundCategory: 'final', court: 'Court 1', time: '16:30 WIB', teamA: 'Olivia & Rico', playersA: 'Olivia / Rico', teamB: 'Kartika & Dodie Adam', playersB: 'Kartika / Dodie', scoreA: '6', scoreB: '4', setDetail: 'Set 1: 6-4, Set 2: 3-2 (Live)', winner: 'live', status: 'Live' },
      { id: 'm-br', round: 'Perebutan Tempat ke-3 (Bronze)', roundCategory: 'final', court: 'Court 2', time: '15:15 WIB', teamA: 'Evan & Ngoe', playersA: 'Evan / Ngoe', teamB: 'Bimo & Farhan', playersB: 'Bimo / Farhan', scoreA: '6', scoreB: '3', setDetail: '6 - 3', winner: 'A', status: 'Selesai' },
      { id: 'm-sf1', round: 'Semifinal 1', roundCategory: 'knockout', court: 'Court 1', time: '14:00 WIB', teamA: 'Olivia & Rico', playersA: 'Olivia / Rico', teamB: 'Tommy & David', playersB: 'Tommy / David', scoreA: '6', scoreB: '4', setDetail: '6 - 4', winner: 'A', status: 'Selesai' },
      { id: 'm-sf2', round: 'Semifinal 2', roundCategory: 'knockout', court: 'Court 2', time: '14:00 WIB', teamA: 'Kartika & Dodie Adam', playersA: 'Kartika / Dodie', teamB: 'Bagas & Dimas', playersB: 'Bagas / Dimas', scoreA: '6', scoreB: '3', setDetail: '6 - 3', winner: 'A', status: 'Selesai' },
      { id: 'm-qf1', round: 'Perempat Final 1', roundCategory: 'knockout', court: 'Court 1', time: '12:30 WIB', teamA: 'Olivia & Rico', playersA: 'Olivia / Rico', teamB: 'Evan & Ngoe', playersB: 'Evan / Ngoe', scoreA: '4', scoreB: '2', setDetail: 'Race to 4: 4 - 2', winner: 'A', status: 'Selesai' },
      { id: 'm-qf2', round: 'Perempat Final 2', roundCategory: 'knockout', court: 'Court 2', time: '12:30 WIB', teamA: 'Kartika & Dodie Adam', playersA: 'Kartika / Dodie', teamB: 'Erde & Sie Jiang', playersB: 'Erde / Sie Jiang', scoreA: '4', scoreB: '1', setDetail: 'Race to 4: 4 - 1', winner: 'A', status: 'Selesai' },
      { id: 'm-pa1', round: 'Babak Grup - Pool A Match 1', roundCategory: 'grup', court: 'Court 1', time: '09:00 WIB', teamA: 'Olivia & Rico', playersA: 'Olivia / Rico', teamB: 'Fery & Tania', playersB: 'Fery / Tania', scoreA: '4', scoreB: '1', setDetail: '4 - 1 (Golden Point)', winner: 'A', status: 'Selesai' },
      { id: 'm-pa2', round: 'Babak Grup - Pool A Match 2', roundCategory: 'grup', court: 'Court 2', time: '09:00 WIB', teamA: 'Erde & Sie Jiang', playersA: 'Erde / Sie Jiang', teamB: 'Hanung & Ria', playersB: 'Hanung / Ria', scoreA: '4', scoreB: '2', setDetail: '4 - 2', winner: 'A', status: 'Selesai' },
      { id: 'm-pb1', round: 'Babak Grup - Pool B Match 1', roundCategory: 'grup', court: 'Court 3', time: '09:45 WIB', teamA: 'Kartika & Dodie Adam', playersA: 'Kartika / Dodie', teamB: 'Reza & Kevin', playersB: 'Reza / Kevin', scoreA: '4', scoreB: '0', setDetail: '4 - 0 (Clean Sheet)', winner: 'A', status: 'Selesai' },
      { id: 'm-pb2', round: 'Babak Grup - Pool B Match 2', roundCategory: 'grup', court: 'Court 4', time: '09:45 WIB', teamA: 'Evan & Ngoe', playersA: 'Evan / Ngoe', teamB: 'Bimo & Farhan', playersB: 'Bimo / Farhan', scoreA: '4', scoreB: '2', setDetail: '4 - 2', winner: 'A', status: 'Selesai' }
    ],

    knockoutBracket: {
      roundOf16: [
        {
          id: 'r16-1',
          roundTitle: 'Round of 16 #1',
          court: 'COURT #1',
          time: '18:36',
          team1: { name: 'Merry & Fifi', players: 'Merry / Fifi', score: '4', isWinner: true },
          team2: { name: 'Ari & Monaria', players: 'Ari / Monaria', score: '3', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'r16-2',
          roundTitle: 'Round of 16 #2',
          court: 'COURT #2',
          time: '15:45',
          team1: { name: 'Esty & Nova', players: 'Esty / Nova', score: '2', isWinner: false },
          team2: { name: 'Gaby & Ichi', players: 'Gaby / Ichi', score: '4', isWinner: true },
          status: 'Selesai'
        },
        {
          id: 'r16-3',
          roundTitle: 'Round of 16 #3',
          court: 'COURT #3',
          time: '11:19',
          team1: { name: 'Gaia & Syla', players: 'Gaia / Syla', score: '4', isWinner: true },
          team2: { name: 'Ch & Marcia', players: 'Ch / Marcia', score: '2', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'r16-4',
          roundTitle: 'Round of 16 #4',
          court: 'COURT #4',
          time: '14:53',
          team1: { name: 'Christina & Mega', players: 'Christina / Mega', score: '4', isWinner: true },
          team2: { name: 'Meri Okta & Saralis', players: 'Meri Okta / Saralis', score: '2', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'r16-5',
          roundTitle: 'Round of 16 #5',
          court: 'COURT #1',
          time: '09:58',
          team1: { name: 'Clarina & Fang2', players: 'Clarina / Fang2', score: '1', isWinner: false },
          team2: { name: 'Chaz & Iphz', players: 'Chaz / Iphz', score: '4', isWinner: true },
          status: 'Selesai'
        },
        {
          id: 'r16-6',
          roundTitle: 'Round of 16 #6',
          court: 'COURT #2',
          time: '18:07',
          team1: { name: 'Asih & Mama Eni', players: 'Asih / Mama Eni', score: '3', isWinner: false },
          team2: { name: 'Frescha & Phe', players: 'Frescha / Phe', score: '4', isWinner: true },
          status: 'Selesai'
        },
        {
          id: 'r16-7',
          roundTitle: 'Round of 16 #7',
          court: 'COURT #3',
          time: '11:32',
          team1: { name: 'Maya & Sella', players: 'Maya / Sella', score: '3', isWinner: false },
          team2: { name: 'Nia & Sassa Rizki', players: 'Nia / Sassa Rizki', score: '4', isWinner: true },
          status: 'Selesai'
        },
        {
          id: 'r16-8',
          roundTitle: 'Round of 16 #8',
          court: 'COURT #4',
          time: '16:06',
          team1: { name: 'La Maula & Tyas', players: 'La Maula / Tyas', score: '4', isWinner: true },
          team2: { name: 'Riri & Gita', players: 'Riri / Gita', score: '2', isWinner: false },
          status: 'Selesai'
        }
      ],
      quarters: [
        {
          id: 'qf-1',
          roundTitle: 'Quarter Final 1',
          court: 'COURT #1',
          time: '06:24',
          team1: { name: 'Merry & Fifi', players: 'Merry / Fifi', score: '4', isWinner: true },
          team2: { name: 'Gaby & Ichi', players: 'Gaby / Ichi', score: '0', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'qf-2',
          roundTitle: 'Quarter Final 2',
          court: 'COURT #2',
          time: '10:33',
          team1: { name: 'Gaia & Syla', players: 'Gaia / Syla', score: '0', isWinner: false },
          team2: { name: 'Christina & Mega', players: 'Christina / Mega', score: '4', isWinner: true },
          status: 'Selesai'
        },
        {
          id: 'qf-3',
          roundTitle: 'Quarter Final 3',
          court: 'COURT #3',
          time: '14:02',
          team1: { name: 'Chaz & Iphz', players: 'Chaz / Iphz', score: '4', isWinner: true },
          team2: { name: 'Frescha & Phe', players: 'Frescha / Phe', score: '2', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'qf-4',
          roundTitle: 'Quarter Final 4',
          court: 'COURT #4',
          time: '16:06',
          team1: { name: 'Nia & Sassa Rizki', players: 'Nia / Sassa Rizki', score: '4', isWinner: true },
          team2: { name: 'La Maula & Tyas', players: 'La Maula / Tyas', score: '3', isWinner: false },
          status: 'Selesai'
        }
      ],
      semis: [
        {
          id: 'sf-1',
          roundTitle: 'Semi Final 1',
          court: 'COURT #1',
          time: '17:30',
          team1: { name: 'Merry & Fifi', players: 'Merry / Fifi', score: '4', isWinner: true },
          team2: { name: 'Christina & Mega', players: 'Christina / Mega', score: '3', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'sf-2',
          roundTitle: 'Semi Final 2',
          court: 'COURT #2',
          time: '10:31',
          team1: { name: 'Chaz & Iphz', players: 'Chaz / Iphz', score: '2', isWinner: false },
          team2: { name: 'Nia & Sassa Rizki', players: 'Nia / Sassa Rizki', score: '4', isWinner: true },
          status: 'Selesai'
        }
      ],
      grandFinal: {
        id: 'gf-1',
        roundTitle: 'Grand Final (Juara 1 & 2)',
        court: 'COURT #2',
        time: '14:39',
        team1: { name: 'Merry & Fifi', players: 'Merry / Fifi', score: '6', isWinner: true },
        team2: { name: 'Nia & Sassa Rizki', players: 'Nia / Sassa Rizki', score: '1', isWinner: false },
        status: 'Selesai'
      },
      bronzeMatch: {
        id: 'bm-1',
        roundTitle: 'Perebutan Juara 3',
        court: 'COURT #1',
        time: '20:28',
        team1: { name: 'Christina & Mega', players: 'Christina / Mega', score: '6', isWinner: true },
        team2: { name: 'Chaz & Iphz', players: 'Chaz / Iphz', score: '3', isWinner: false },
        status: 'Selesai'
      }
    },

    groupStandings: {
      pools: ['Semua Pool', 'Pool A', 'Pool B', 'Pool C', 'Pool D'],
      standings: [
        { id: '1', pos: 1, name: 'Olivia & Rico', p1: 'Olivia S.', p2: 'Rico Prasetya', pool: 'Pool A', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 4, gameDiff: +8, points: 6, isQualified: true },
        { id: '2', pos: 2, name: 'Erde & Sie Jiang', p1: 'Erde Pratama', p2: 'Sie Jiang', pool: 'Pool A', played: 3, won: 2, lost: 1, gamesWon: 10, gamesLost: 7, gameDiff: +3, points: 4, isQualified: true },
        { id: '3', pos: 3, name: 'Fery & Tania', p1: 'Fery Gunawan', p2: 'Tania Christie', pool: 'Pool A', played: 3, won: 1, lost: 2, gamesWon: 7, gamesLost: 9, gameDiff: -2, points: 2, isQualified: false },
        { id: '4', pos: 4, name: 'Hanung & Ria', p1: 'Hanung Bramantyo', p2: 'Ria Zaskia', pool: 'Pool A', played: 3, won: 0, lost: 3, gamesWon: 3, gamesLost: 12, gameDiff: -9, points: 0, isQualified: false },

        { id: '5', pos: 1, name: 'Kartika & Dodie Adam', p1: 'Kartika Aditoputro', p2: 'Dodie Adam', pool: 'Pool B', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 2, gameDiff: +10, points: 6, isQualified: true },
        { id: '6', pos: 2, name: 'Evan & Ngoe', p1: 'Evan Wirawan', p2: 'Ngoe Wijaya', pool: 'Pool B', played: 3, won: 2, lost: 1, gamesWon: 10, gamesLost: 6, gameDiff: +4, points: 4, isQualified: true },
        { id: '7', pos: 3, name: 'Bimo & Farhan', p1: 'Bimo Prasetyo', p2: 'Farhan Hakim', pool: 'Pool B', played: 3, won: 1, lost: 2, gamesWon: 6, gamesLost: 10, gameDiff: -4, points: 2, isQualified: false },
        { id: '8', pos: 4, name: 'Reza & Kevin', p1: 'Reza Rahardian', p2: 'Kevin Julio', pool: 'Pool B', played: 3, won: 0, lost: 3, gamesWon: 2, gamesLost: 12, gameDiff: -10, points: 0, isQualified: false },

        { id: '9', pos: 1, name: 'Tommy & David', p1: 'Tommy Kurniawan', p2: 'David Bayu', pool: 'Pool C', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 5, gameDiff: +7, points: 6, isQualified: true },
        { id: '10', pos: 2, name: 'Ardi & Gilang', p1: 'Ardi Bakrie', p2: 'Gilang Dirga', pool: 'Pool C', played: 3, won: 2, lost: 1, gamesWon: 9, gamesLost: 7, gameDiff: +2, points: 4, isQualified: true },

        { id: '11', pos: 1, name: 'Bagas & Dimas', p1: 'Bagas Pratama', p2: 'Dimas Wicaksono', pool: 'Pool D', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 4, gameDiff: +8, points: 6, isQualified: true },
        { id: '12', pos: 2, name: 'Rendy & Surya', p1: 'Rendy Pandugo', p2: 'Surya Insomnia', pool: 'Pool D', played: 3, won: 2, lost: 1, gamesWon: 9, gamesLost: 8, gameDiff: +1, points: 4, isQualified: true }
      ]
    }
  },

  'f3-rookie-men': {
    id: 'f3-rookie-men',
    name: 'F3 Rookie Men vol 2',
    organizer: 'F3',
    location: 'Padeloka (4 Courts)',
    date: '2026-09-12',
    status: 'Selesai',
    categories: ['Rookie Men (12 Pools, 48 Teams)'],
    totalCourts: 4,
    totalTeams: 48,
    prizePool: 'Rp 17.500.000 + Piala F3 Official',
    rules: 'Total 4 Games · Golden Point on 40-40',
    description: 'Edisi kedua kejuaraan Rookie Men F3 yang menghadirkan 48 pasangan dari seluruh Jabodetabek & Bandung.',

    winners: {
      notes: 'Turnamen telah selesai secara resmi pada 12 September 2026 di Padeloka dengan penyerahan trofi resmi F3.',
      podium: [
        {
          place: '1',
          title: 'JUARA 1 (GOLD CHAMPION)',
          badgeColor: 'gold',
          teamName: 'Kartika & Dodie Adam',
          p1: 'Kartika Aditoputro',
          p2: 'Dodie Adam Pratama',
          club: 'LagiLagi Padel Jakarta',
          prize: 'Rp 10.000.000 + Piala Bergilir Emas F3 Vol. 2 + Set Raket Head Pro',
          trophy: 'Piala Bergilir F3 Rookie Men',
          finalScore: 'Menang 6 - 4, 6 - 3 vs Evan & Ngoe',
          pointsEarned: 1000
        },
        {
          place: '2',
          title: 'JUARA 2 (RUNNER-UP SILVER)',
          badgeColor: 'silver',
          teamName: 'Evan & Ngoe',
          p1: 'Evan Wirawan',
          p2: 'Ngoe Wijaya',
          club: 'Satrio Padel Club',
          prize: 'Rp 5.000.000 + Piala Perak F3 + Goodie Bag Premium',
          trophy: 'Piala Perak F3',
          finalScore: 'Kalah 4 - 6, 3 - 6 di Grand Final',
          pointsEarned: 700
        },
        {
          place: '3',
          title: 'JUARA 3 (BRONZE MEDAL)',
          badgeColor: 'bronze',
          teamName: 'Bimo & Farhan',
          p1: 'Bimo Prasetyo',
          p2: 'Farhan Hakim',
          club: 'Bandung Padel Arena',
          prize: 'Rp 2.500.000 + Medali Perunggu Resmi F3',
          trophy: 'Medali Perunggu F3',
          finalScore: 'Menang 7 - 5 vs Rio & Hendra',
          pointsEarned: 500
        }
      ],
      mvp: {
        name: 'Kartika Aditoputro',
        award: 'F3 Rookie Men MVP',
        stat: 'Akurasi smash 88% dan 36 smash winners sepanjang turnamen'
      }
    },

    participants: [
      { seed: 1, teamName: 'Kartika & Dodie Adam', p1: 'Kartika Aditoputro', p2: 'Dodie Adam', category: 'Rookie Men', club: 'LagiLagi Padel Jakarta', city: 'Jakarta Selatan', pool: 'Pool 1', rating: '3.4', status: 'Confirmed' },
      { seed: 2, teamName: 'Evan & Ngoe', p1: 'Evan Wirawan', p2: 'Ngoe Wijaya', category: 'Rookie Men', club: 'Satrio Padel Club', city: 'Jakarta Selatan', pool: 'Pool 2', rating: '3.3', status: 'Confirmed' },
      { seed: 3, teamName: 'Bimo & Farhan', p1: 'Bimo Prasetyo', p2: 'Farhan Hakim', category: 'Rookie Men', club: 'Bandung Padel Arena', city: 'Bandung', pool: 'Pool 3', rating: '3.0', status: 'Confirmed' },
      { seed: 4, teamName: 'Rio & Hendra', p1: 'Rio Febrian', p2: 'Hendra Susanto', category: 'Rookie Men', club: 'Padeloka', city: 'Jakarta Barat', pool: 'Pool 4', rating: '2.9', status: 'Confirmed' },
      { seed: 5, teamName: 'Rico & Arya', p1: 'Rico Prasetya', p2: 'Arya Wijaya', category: 'Rookie Men', club: 'Kemang Padel Society', city: 'Jakarta Selatan', pool: 'Pool 1', rating: '3.1', status: 'Confirmed' },
      { seed: 6, teamName: 'Marco & Doni', p1: 'Marco Lie', p2: 'Doni Saputra', category: 'Rookie Men', club: 'Zing Solo', city: 'Solo', pool: 'Pool 2', rating: '2.8', status: 'Confirmed' },
      { seed: 7, teamName: 'Kevin & Randy', p1: 'Kevin Julio', p2: 'Randy Pangalila', category: 'Rookie Men', club: 'All In Padel', city: 'Jakarta Utara', pool: 'Pool 3', rating: '2.9', status: 'Confirmed' },
      { seed: 8, teamName: 'Bagas & Dimas', p1: 'Bagas Pratama', p2: 'Dimas Wicaksono', category: 'Rookie Men', club: 'LagiLagi Padel', city: 'Jakarta Selatan', pool: 'Pool 4', rating: '3.0', status: 'Confirmed' }
    ],

    matches: [
      { id: 'f3-gf', round: 'Grand Final', roundCategory: 'final', court: 'Court 1', time: '18:00 WIB', teamA: 'Kartika & Dodie Adam', playersA: 'Kartika / Dodie', teamB: 'Evan & Ngoe', playersB: 'Evan / Ngoe', scoreA: '2', scoreB: '0', setDetail: '6-4, 6-3', winner: 'A', status: 'Selesai' },
      { id: 'f3-br', round: 'Perebutan Juara 3', roundCategory: 'final', court: 'Court 2', time: '17:00 WIB', teamA: 'Bimo & Farhan', playersA: 'Bimo / Farhan', teamB: 'Rio & Hendra', playersB: 'Rio / Hendra', scoreA: '1', scoreB: '0', setDetail: '7 - 5', winner: 'A', status: 'Selesai' },
      { id: 'f3-sf1', round: 'Semifinal 1', roundCategory: 'knockout', court: 'Court 1', time: '15:30 WIB', teamA: 'Kartika & Dodie Adam', playersA: 'Kartika / Dodie', teamB: 'Bimo & Farhan', playersB: 'Bimo / Farhan', scoreA: '6', scoreB: '2', setDetail: '6 - 2', winner: 'A', status: 'Selesai' },
      { id: 'f3-sf2', round: 'Semifinal 2', roundCategory: 'knockout', court: 'Court 2', time: '15:30 WIB', teamA: 'Evan & Ngoe', playersA: 'Evan / Ngoe', teamB: 'Rio & Hendra', playersB: 'Rio / Hendra', scoreA: '6', scoreB: '4', setDetail: '6 - 4', winner: 'A', status: 'Selesai' }
    ],

    knockoutBracket: {
      quarters: [
        {
          id: 'f3-q1',
          roundTitle: 'Perempat Final 1',
          court: 'Court 1',
          time: '14:00 WIB',
          team1: { name: 'Kartika & Dodie Adam', players: 'Kartika / Dodie', score: '6', isWinner: true },
          team2: { name: 'Rico & Arya', players: 'Rico / Arya', score: '2', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'f3-q2',
          roundTitle: 'Perempat Final 2',
          court: 'Court 2',
          time: '14:00 WIB',
          team1: { name: 'Bimo & Farhan', players: 'Bimo / Farhan', score: '6', isWinner: true },
          team2: { name: 'Kevin & Randy', players: 'Kevin / Randy', score: '4', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'f3-q3',
          roundTitle: 'Perempat Final 3',
          court: 'Court 3',
          time: '14:00 WIB',
          team1: { name: 'Evan & Ngoe', players: 'Evan / Ngoe', score: '6', isWinner: true },
          team2: { name: 'Marco & Doni', players: 'Marco / Doni', score: '1', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'f3-q4',
          roundTitle: 'Perempat Final 4',
          court: 'Court 4',
          time: '14:00 WIB',
          team1: { name: 'Rio & Hendra', players: 'Rio / Hendra', score: '6', isWinner: true },
          team2: { name: 'Bagas & Dimas', players: 'Bagas / Dimas', score: '5', isWinner: false },
          status: 'Selesai'
        }
      ],
      semis: [
        {
          id: 'f3-s1',
          roundTitle: 'Semifinal 1',
          court: 'Court 1',
          time: '15:30 WIB',
          team1: { name: 'Kartika & Dodie Adam', players: 'Kartika / Dodie', score: '6', isWinner: true },
          team2: { name: 'Bimo & Farhan', players: 'Bimo / Farhan', score: '2', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'f3-s2',
          roundTitle: 'Semifinal 2',
          court: 'Court 2',
          time: '15:30 WIB',
          team1: { name: 'Evan & Ngoe', players: 'Evan / Ngoe', score: '6', isWinner: true },
          team2: { name: 'Rio & Hendra', players: 'Rio / Hendra', score: '4', isWinner: false },
          status: 'Selesai'
        }
      ],
      grandFinal: {
        id: 'f3-g1',
        roundTitle: 'Grand Final (F3 Trophy)',
        court: 'Padeloka Court 1',
        time: '18:00 WIB',
        team1: { name: 'Kartika & Dodie Adam', players: 'Kartika / Dodie', score: '2', isWinner: true },
        team2: { name: 'Evan & Ngoe', players: 'Evan / Ngoe', score: '0', isWinner: false },
        status: 'Selesai',
        note: 'Skor set: 6-4, 6-3 · Kartika & Dodie Adam Juara 1'
      },
      bronzeMatch: {
        id: 'f3-b1',
        roundTitle: 'Perebutan Juara 3',
        court: 'Padeloka Court 2',
        time: '17:00 WIB',
        team1: { name: 'Bimo & Farhan', players: 'Bimo / Farhan', score: '7', isWinner: true },
        team2: { name: 'Rio & Hendra', players: 'Rio / Hendra', score: '5', isWinner: false },
        status: 'Selesai'
      }
    },

    groupStandings: {
      pools: ['Semua Pool', 'Pool 1', 'Pool 2', 'Pool 3', 'Pool 4'],
      standings: [
        { id: 'f3-p1', pos: 1, name: 'Kartika & Dodie Adam', p1: 'Kartika Aditoputro', p2: 'Dodie Adam', pool: 'Pool 1', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 1, gameDiff: +11, points: 6, isQualified: true },
        { id: 'f3-p2', pos: 2, name: 'Rico & Arya', p1: 'Rico Prasetya', p2: 'Arya Wijaya', pool: 'Pool 1', played: 3, won: 2, lost: 1, gamesWon: 9, gamesLost: 6, gameDiff: +3, points: 4, isQualified: true },
        { id: 'f3-p3', pos: 1, name: 'Evan & Ngoe', p1: 'Evan Wirawan', p2: 'Ngoe Wijaya', pool: 'Pool 2', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 3, gameDiff: +9, points: 6, isQualified: true },
        { id: 'f3-p4', pos: 2, name: 'Marco & Doni', p1: 'Marco Lie', p2: 'Doni Saputra', pool: 'Pool 2', played: 3, won: 2, lost: 1, gamesWon: 8, gamesLost: 7, gameDiff: +1, points: 4, isQualified: true },
        { id: 'f3-p5', pos: 1, name: 'Bimo & Farhan', p1: 'Bimo Prasetyo', p2: 'Farhan Hakim', pool: 'Pool 3', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 4, gameDiff: +8, points: 6, isQualified: true },
        { id: 'f3-p6', pos: 2, name: 'Kevin & Randy', p1: 'Kevin Julio', p2: 'Randy Pangalila', pool: 'Pool 3', played: 3, won: 2, lost: 1, gamesWon: 9, gamesLost: 8, gameDiff: +1, points: 4, isQualified: true },
        { id: 'f3-p7', pos: 1, name: 'Rio & Hendra', p1: 'Rio Febrian', p2: 'Hendra Susanto', pool: 'Pool 4', played: 3, won: 3, lost: 0, gamesWon: 12, gamesLost: 5, gameDiff: +7, points: 6, isQualified: true },
        { id: 'f3-p8', pos: 2, name: 'Bagas & Dimas', p1: 'Bagas Pratama', p2: 'Dimas Wicaksono', pool: 'Pool 4', played: 3, won: 2, lost: 1, gamesWon: 10, gamesLost: 7, gameDiff: +3, points: 4, isQualified: true }
      ]
    }
  },

  'hdmc-champions': {
    id: 'hdmc-champions',
    name: 'HDMC PADEL CHAMPIONS',
    organizer: 'THE GOOD VIBES CLUB',
    location: 'ZING PADEL SOLO (6 Courts)',
    date: '2026-08-29',
    status: 'Selesai',
    categories: ['Rookie Men', 'Rookie Women', 'Low Bronze Mix', 'Veteran 40+'],
    totalCourts: 6,
    totalTeams: 36,
    prizePool: 'Rp 26.000.000 + Piala HDMC Solo',
    rules: 'Group Pools of 3 · Top 2 Qualify',
    description: 'Kejuaraan padel akbar di Solo dengan 4 kategori serentak didukung oleh Zing Padel dan The Good Vibes Club.',

    winners: {
      notes: 'Juara kategori Rookie Men HDMC Champions Solo diraih oleh pasangan Evan Wirawan & Ngoe Wijaya.',
      podium: [
        {
          place: '1',
          title: 'JUARA 1 (GOLD CHAMPION)',
          badgeColor: 'gold',
          teamName: 'Evan & Ngoe',
          p1: 'Evan Wirawan',
          p2: 'Ngoe Wijaya',
          club: 'Satrio Padel Club Jakarta',
          prize: 'Rp 15.000.000 + Trofi HDMC Champions Cup + Staycation Voucher Solo',
          trophy: 'Trofi HDMC Solo 2026',
          finalScore: 'Menang 6 - 3, 6 - 4 vs Arya & Indra',
          pointsEarned: 1000
        },
        {
          place: '2',
          title: 'JUARA 2 (RUNNER-UP SILVER)',
          badgeColor: 'silver',
          teamName: 'Arya & Indra',
          p1: 'Arya Wijaya',
          p2: 'Indra Kusuma',
          club: 'Zing Padel Solo',
          prize: 'Rp 7.500.000 + Trofi Runner Up + Raket Dunlop',
          trophy: 'Trofi Runner-Up HDMC',
          finalScore: 'Kalah 3 - 6, 4 - 6 di Grand Final',
          pointsEarned: 700
        },
        {
          place: '3',
          title: 'JUARA 3 (BRONZE MEDAL)',
          badgeColor: 'bronze',
          teamName: 'Doni & Marco',
          p1: 'Doni Saputra',
          p2: 'Marco Lie',
          club: 'Yogyakarta Padel Arena',
          prize: 'Rp 3.500.000 + Medali Perunggu',
          trophy: 'Medali Perunggu HDMC',
          finalScore: 'Menang 6 - 4 vs Surya & Gani',
          pointsEarned: 500
        }
      ],
      mvp: {
        name: 'Evan Wirawan',
        award: 'HDMC Best Defensive Player',
        stat: 'Save rate 92% di bola sudut dinding kaca'
      }
    },

    participants: [
      { seed: 1, teamName: 'Evan & Ngoe', p1: 'Evan Wirawan', p2: 'Ngoe Wijaya', category: 'Rookie Men', club: 'Satrio Padel Club', city: 'Jakarta Selatan', pool: 'Pool A', rating: '3.3', status: 'Confirmed' },
      { seed: 2, teamName: 'Arya & Indra', p1: 'Arya Wijaya', p2: 'Indra Kusuma', category: 'Rookie Men', club: 'Zing Padel Solo', city: 'Solo', pool: 'Pool B', rating: '3.2', status: 'Confirmed' },
      { seed: 3, teamName: 'Doni & Marco', p1: 'Doni Saputra', p2: 'Marco Lie', category: 'Rookie Men', club: 'Yogyakarta Padel Arena', city: 'Yogyakarta', pool: 'Pool A', rating: '3.0', status: 'Confirmed' },
      { seed: 4, teamName: 'Surya & Gani', p1: 'Surya Insomnia', p2: 'Gani Pratama', category: 'Rookie Men', club: 'Semarang Padel', city: 'Semarang', pool: 'Pool B', rating: '2.9', status: 'Confirmed' }
    ],

    matches: [
      { id: 'hdmc-gf', round: 'Grand Final', roundCategory: 'final', court: 'Court 1', time: '19:00 WIB', teamA: 'Evan & Ngoe', playersA: 'Evan / Ngoe', teamB: 'Arya & Indra', playersB: 'Arya / Indra', scoreA: '2', scoreB: '0', setDetail: '6-3, 6-4', winner: 'A', status: 'Selesai' },
      { id: 'hdmc-bm', round: 'Perebutan Juara 3', roundCategory: 'final', court: 'Court 2', time: '17:30 WIB', teamA: 'Doni & Marco', playersA: 'Doni / Marco', teamB: 'Surya & Gani', playersB: 'Surya / Gani', scoreA: '6', scoreB: '4', setDetail: '6 - 4', winner: 'A', status: 'Selesai' }
    ],

    knockoutBracket: {
      quarters: [],
      semis: [
        {
          id: 'h-s1',
          roundTitle: 'Semifinal 1',
          court: 'Court 1',
          time: '15:00 WIB',
          team1: { name: 'Evan & Ngoe', players: 'Evan / Ngoe', score: '6', isWinner: true },
          team2: { name: 'Surya & Gani', players: 'Surya / Gani', score: '2', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'h-s2',
          roundTitle: 'Semifinal 2',
          court: 'Court 2',
          time: '15:00 WIB',
          team1: { name: 'Arya & Indra', players: 'Arya / Indra', score: '6', isWinner: true },
          team2: { name: 'Doni & Marco', players: 'Doni / Marco', score: '4', isWinner: false },
          status: 'Selesai'
        }
      ],
      grandFinal: {
        id: 'h-gf',
        roundTitle: 'Grand Final HDMC Champions',
        court: 'Zing Padel Solo Court 1',
        time: '19:00 WIB',
        team1: { name: 'Evan & Ngoe', players: 'Evan / Ngoe', score: '2', isWinner: true },
        team2: { name: 'Arya & Indra', players: 'Arya / Indra', score: '0', isWinner: false },
        status: 'Selesai',
        note: 'Evan & Ngoe Juara 1 HDMC Champions Solo'
      },
      bronzeMatch: {
        id: 'h-bm',
        roundTitle: 'Perebutan Juara 3',
        court: 'Court 2',
        time: '17:30 WIB',
        team1: { name: 'Doni & Marco', players: 'Doni / Marco', score: '6', isWinner: true },
        team2: { name: 'Surya & Gani', players: 'Surya / Gani', score: '4', isWinner: false },
        status: 'Selesai'
      }
    },

    groupStandings: {
      pools: ['Semua Pool', 'Pool A', 'Pool B'],
      standings: [
        { id: 'h-p1', pos: 1, name: 'Evan & Ngoe', p1: 'Evan Wirawan', p2: 'Ngoe Wijaya', pool: 'Pool A', played: 2, won: 2, lost: 0, gamesWon: 8, gamesLost: 2, gameDiff: +6, points: 4, isQualified: true },
        { id: 'h-p2', pos: 2, name: 'Doni & Marco', p1: 'Doni Saputra', p2: 'Marco Lie', pool: 'Pool A', played: 2, won: 1, lost: 1, gamesWon: 5, gamesLost: 6, gameDiff: -1, points: 2, isQualified: true },
        { id: 'h-p3', pos: 1, name: 'Arya & Indra', p1: 'Arya Wijaya', p2: 'Indra Kusuma', pool: 'Pool B', played: 2, won: 2, lost: 0, gamesWon: 8, gamesLost: 3, gameDiff: +5, points: 4, isQualified: true },
        { id: 'h-p4', pos: 2, name: 'Surya & Gani', p1: 'Surya Insomnia', p2: 'Gani Pratama', pool: 'Pool B', played: 2, won: 1, lost: 1, gamesWon: 6, gamesLost: 6, gameDiff: 0, points: 2, isQualified: true }
      ]
    }
  },

  'beginner-showdown': {
    id: 'beginner-showdown',
    name: 'Beginner Men Showdown',
    organizer: 'GOOD VIBES CLUB',
    location: 'Padeloka (3 Courts)',
    date: '2026-09-05',
    status: 'Selesai',
    categories: ['Man Beginner'],
    totalCourts: 3,
    totalTeams: 24,
    prizePool: 'Rp 9.000.000 + Trofi Pemula',
    rules: 'Pool 8 · Qualifiers 2 per pool',
    description: 'Ajang ramah pemain pemula untuk membangun jam terbang turnamen resmi dengan format pertandingan kompetitif.',

    winners: {
      notes: 'Selamat kepada Bagas & Dimas keluar sebagai kampiun Beginner Men Showdown di Padeloka.',
      podium: [
        {
          place: '1',
          title: 'JUARA 1 (BEGINNER CHAMPION)',
          badgeColor: 'gold',
          teamName: 'Bagas & Dimas',
          p1: 'Bagas Pratama',
          p2: 'Dimas Wicaksono',
          club: 'LagiLagi Padel Club',
          prize: 'Rp 5.000.000 + Trofi Beginner Champion + Voucher Coaching',
          trophy: 'Trofi Emas Beginner Showdown',
          finalScore: 'Menang 6 - 3 atas Hendra & Rio',
          pointsEarned: 800
        },
        {
          place: '2',
          title: 'JUARA 2 (RUNNER-UP)',
          badgeColor: 'silver',
          teamName: 'Hendra & Rio',
          p1: 'Hendra Susanto',
          p2: 'Rio Febrian',
          club: 'Padeloka Club',
          prize: 'Rp 2.500.000 + Trofi Perak',
          trophy: 'Trofi Runner-Up',
          finalScore: 'Kalah 3 - 6 di Final',
          pointsEarned: 550
        },
        {
          place: '3',
          title: 'JUARA 3 (BRONZE)',
          badgeColor: 'bronze',
          teamName: 'Jonathan & Felix',
          p1: 'Jonathan K.',
          p2: 'Felix Tan',
          club: 'Kemang Padel Society',
          prize: 'Rp 1.500.000 + Medali Perunggu',
          trophy: 'Medali Perunggu',
          finalScore: 'Menang 6 - 2 atas David & Chris',
          pointsEarned: 400
        }
      ],
      mvp: {
        name: 'Dimas Wicaksono',
        award: 'Beginner of the Tournament',
        stat: 'Tingkat pengembalian bola servis 94%'
      }
    },

    participants: [
      { seed: 1, teamName: 'Bagas & Dimas', p1: 'Bagas Pratama', p2: 'Dimas Wicaksono', category: 'Man Beginner', club: 'LagiLagi Padel', city: 'Jakarta Selatan', pool: 'Pool A', rating: '2.4', status: 'Confirmed' },
      { seed: 2, teamName: 'Hendra & Rio', p1: 'Hendra Susanto', p2: 'Rio Febrian', category: 'Man Beginner', club: 'Padeloka Club', city: 'Jakarta Barat', pool: 'Pool B', rating: '2.3', status: 'Confirmed' },
      { seed: 3, teamName: 'Jonathan & Felix', p1: 'Jonathan K.', p2: 'Felix Tan', category: 'Man Beginner', club: 'Kemang Padel', city: 'Jakarta Selatan', pool: 'Pool A', rating: '2.1', status: 'Confirmed' },
      { seed: 4, teamName: 'David & Chris', p1: 'David Bayu', p2: 'Chris Laurent', category: 'Man Beginner', club: 'All In Padel', city: 'Jakarta Utara', pool: 'Pool B', rating: '2.0', status: 'Confirmed' }
    ],

    matches: [
      { id: 'b-gf', round: 'Grand Final', roundCategory: 'final', court: 'Court 1', time: '17:00 WIB', teamA: 'Bagas & Dimas', playersA: 'Bagas / Dimas', teamB: 'Hendra & Rio', playersB: 'Hendra / Rio', scoreA: '6', scoreB: '3', setDetail: '6 - 3', winner: 'A', status: 'Selesai' },
      { id: 'b-bm', round: 'Perebutan Juara 3', roundCategory: 'final', court: 'Court 2', time: '16:00 WIB', teamA: 'Jonathan & Felix', playersA: 'Jonathan / Felix', teamB: 'David & Chris', playersB: 'David / Chris', scoreA: '6', scoreB: '2', setDetail: '6 - 2', winner: 'A', status: 'Selesai' }
    ],

    knockoutBracket: {
      quarters: [],
      semis: [
        {
          id: 'b-s1',
          roundTitle: 'Semifinal 1',
          court: 'Court 1',
          time: '14:30 WIB',
          team1: { name: 'Bagas & Dimas', players: 'Bagas / Dimas', score: '6', isWinner: true },
          team2: { name: 'David & Chris', players: 'David / Chris', score: '1', isWinner: false },
          status: 'Selesai'
        },
        {
          id: 'b-s2',
          roundTitle: 'Semifinal 2',
          court: 'Court 2',
          time: '14:30 WIB',
          team1: { name: 'Hendra & Rio', players: 'Hendra / Rio', score: '6', isWinner: true },
          team2: { name: 'Jonathan & Felix', players: 'Jonathan / Felix', score: '3', isWinner: false },
          status: 'Selesai'
        }
      ],
      grandFinal: {
        id: 'b-gf',
        roundTitle: 'Grand Final Beginner Showdown',
        court: 'Padeloka Court 1',
        time: '17:00 WIB',
        team1: { name: 'Bagas & Dimas', players: 'Bagas / Dimas', score: '6', isWinner: true },
        team2: { name: 'Hendra & Rio', players: 'Hendra / Rio', score: '3', isWinner: false },
        status: 'Selesai',
        note: 'Bagas & Dimas Juara 1'
      },
      bronzeMatch: {
        id: 'b-bm',
        roundTitle: 'Perebutan Juara 3',
        court: 'Court 2',
        time: '16:00 WIB',
        team1: { name: 'Jonathan & Felix', players: 'Jonathan / Felix', score: '6', isWinner: true },
        team2: { name: 'David & Chris', players: 'David / Chris', score: '2', isWinner: false },
        status: 'Selesai'
      }
    },

    groupStandings: {
      pools: ['Semua Pool', 'Pool A', 'Pool B'],
      standings: [
        { id: 'b-p1', pos: 1, name: 'Bagas & Dimas', p1: 'Bagas Pratama', p2: 'Dimas Wicaksono', pool: 'Pool A', played: 2, won: 2, lost: 0, gamesWon: 8, gamesLost: 1, gameDiff: +7, points: 4, isQualified: true },
        { id: 'b-p2', pos: 2, name: 'Jonathan & Felix', p1: 'Jonathan K.', p2: 'Felix Tan', pool: 'Pool A', played: 2, won: 1, lost: 1, gamesWon: 5, gamesLost: 6, gameDiff: -1, points: 2, isQualified: true },
        { id: 'b-p3', pos: 1, name: 'Hendra & Rio', p1: 'Hendra Susanto', p2: 'Rio Febrian', pool: 'Pool B', played: 2, won: 2, lost: 0, gamesWon: 8, gamesLost: 2, gameDiff: +6, points: 4, isQualified: true },
        { id: 'b-p4', pos: 2, name: 'David & Chris', p1: 'David Bayu', p2: 'Chris Laurent', pool: 'Pool B', played: 2, won: 1, lost: 1, gamesWon: 4, gamesLost: 6, gameDiff: -2, points: 2, isQualified: true }
      ]
    }
  }
};
