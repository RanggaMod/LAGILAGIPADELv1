export interface ClubMember {
  id: string; // Identitas unik system-wide, e.g. "LLP-MBR-001"
  name: string;
  nickname?: string;
  photoUrl: string;
  phone: string;
  email: string;
  club: string;
  city: string;
  rating: string;
  gender: 'Laki-laki' | 'Perempuan' | 'Mix';
  membershipTier: 'Rookie' | 'Pro Club' | 'Elite Black' | 'Official';
  joinedDate: string;
  status: 'Aktif' | 'Cuti' | 'Non-Aktif';

  // Parameter Khusus Admin: Lolos Fase Grup (Playoff Qualified)
  isGroupQualified: boolean;
  qualifiedTournament?: string;
  qualifiedPool?: string;
  qualifiedPhase?: string; // e.g. "Lolos ke Round of 16 (Top 2 Pool)", "Lolos Perempat Final"

  // Prestasi / Hubungan dengan Hall of Fame & Turnamen
  achievements: {
    gold: number;
    silver: number;
    bronze: number;
    tournaments: string[];
    partnerDefault?: string;
  };
}

const MEMBERS_STORAGE_KEY = 'lagilagipadel_club_members';

// Default initial club members dataset with real padel player portraits
export const DEFAULT_CLUB_MEMBERS: ClubMember[] = [
  {
    id: 'LLP-MBR-001',
    name: 'Kartika Aditoputro',
    nickname: 'Tika',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    phone: '0812-8822-9011',
    email: 'kartika.aditoputro@gmail.com',
    club: 'LagiLagi Padel Jakarta',
    city: 'Jakarta Selatan',
    rating: '3.4',
    gender: 'Perempuan',
    membershipTier: 'Elite Black',
    joinedDate: '15 Jan 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'F3 Rookie Men vol 2',
    qualifiedPool: 'Pool 1',
    qualifiedPhase: 'Juara 1 & Lolos Fase Grup Pool 1',
    achievements: {
      gold: 2,
      silver: 1,
      bronze: 0,
      tournaments: ['F3 Rookie Men vol 2', 'HDMC Champions', 'Rookie Fix Mix'],
      partnerDefault: 'Dodie Adam'
    }
  },
  {
    id: 'LLP-MBR-002',
    name: 'Dodie Adam Pratama',
    nickname: 'Dodie',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    phone: '0811-9988-1200',
    email: 'dodie.adam@gmail.com',
    club: 'LagiLagi Padel Jakarta',
    city: 'Jakarta Selatan',
    rating: '3.4',
    gender: 'Laki-laki',
    membershipTier: 'Elite Black',
    joinedDate: '10 Feb 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'F3 Rookie Men vol 2',
    qualifiedPool: 'Pool 1',
    qualifiedPhase: 'Juara 1 & Lolos Fase Grup Pool 1',
    achievements: {
      gold: 2,
      silver: 1,
      bronze: 0,
      tournaments: ['F3 Rookie Men vol 2', 'HDMC Champions'],
      partnerDefault: 'Kartika Aditoputro'
    }
  },
  {
    id: 'LLP-MBR-003',
    name: 'Olivia S.',
    nickname: 'Oliv',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    phone: '0813-7722-4411',
    email: 'olivia.s@padelpro.id',
    club: 'Kemang Padel Society',
    city: 'Jakarta Selatan',
    rating: '3.2',
    gender: 'Perempuan',
    membershipTier: 'Pro Club',
    joinedDate: '01 Mar 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool A',
    qualifiedPhase: 'Top 1 Pool A (Juara Grup)',
    achievements: {
      gold: 1,
      silver: 2,
      bronze: 1,
      tournaments: ['Rookie Fix Mix Motion', 'Beginner Showdown'],
      partnerDefault: 'Rico Prasetya'
    }
  },
  {
    id: 'LLP-MBR-004',
    name: 'Rico Prasetya',
    nickname: 'Rico',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    phone: '0812-3344-9988',
    email: 'rico.prasetya@yahoo.com',
    club: 'Kemang Padel Society',
    city: 'Jakarta Selatan',
    rating: '3.1',
    gender: 'Laki-laki',
    membershipTier: 'Pro Club',
    joinedDate: '12 Feb 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool A',
    qualifiedPhase: 'Top 1 Pool A (Juara Grup)',
    achievements: {
      gold: 1,
      silver: 2,
      bronze: 1,
      tournaments: ['Rookie Fix Mix Motion'],
      partnerDefault: 'Olivia S.'
    }
  },
  {
    id: 'LLP-MBR-005',
    name: 'Evan Wirawan',
    nickname: 'Evan',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    phone: '0818-4455-6677',
    email: 'evan.wirawan@gmail.com',
    club: 'Satrio Padel Club',
    city: 'Jakarta Selatan',
    rating: '3.3',
    gender: 'Laki-laki',
    membershipTier: 'Elite Black',
    joinedDate: '20 Jan 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'HDMC PADEL CHAMPIONS',
    qualifiedPool: 'Pool A',
    qualifiedPhase: 'Juara 1 HDMC & Runner Up F3',
    achievements: {
      gold: 1,
      silver: 1,
      bronze: 2,
      tournaments: ['HDMC PADEL CHAMPIONS', 'F3 Rookie Men vol 2'],
      partnerDefault: 'Ngoe Wijaya'
    }
  },
  {
    id: 'LLP-MBR-006',
    name: 'Ngoe Wijaya',
    nickname: 'Ngoe',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    phone: '0812-7711-2299',
    email: 'ngoe.wijaya@outlook.com',
    club: 'Satrio Padel Club',
    city: 'Jakarta Selatan',
    rating: '3.1',
    gender: 'Laki-laki',
    membershipTier: 'Pro Club',
    joinedDate: '22 Jan 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'HDMC PADEL CHAMPIONS',
    qualifiedPool: 'Pool A',
    qualifiedPhase: 'Juara 1 HDMC & Runner Up F3',
    achievements: {
      gold: 1,
      silver: 1,
      bronze: 2,
      tournaments: ['HDMC PADEL CHAMPIONS', 'F3 Rookie Men vol 2'],
      partnerDefault: 'Evan Wirawan'
    }
  },
  {
    id: 'LLP-MBR-007',
    name: 'Merry',
    nickname: 'Merry',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    phone: '0811-2233-4455',
    email: 'merry.padel@kemang.id',
    club: 'Kemang Padel Society',
    city: 'Jakarta Selatan',
    rating: '3.5',
    gender: 'Perempuan',
    membershipTier: 'Pro Club',
    joinedDate: '05 Feb 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool 1 (R16)',
    qualifiedPhase: 'Kampiun Juara 1 Gold Grand Final',
    achievements: {
      gold: 1,
      silver: 0,
      bronze: 0,
      tournaments: ['Rookie Fix Mix Motion x Winny Grosir'],
      partnerDefault: 'Fifi'
    }
  },
  {
    id: 'LLP-MBR-008',
    name: 'Fifi',
    nickname: 'Fifi',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    phone: '0812-3399-8811',
    email: 'fifi.kemang@gmail.com',
    club: 'Kemang Padel Society',
    city: 'Jakarta Selatan',
    rating: '3.4',
    gender: 'Perempuan',
    membershipTier: 'Pro Club',
    joinedDate: '10 Feb 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool 1 (R16)',
    qualifiedPhase: 'Kampiun Juara 1 Gold Grand Final',
    achievements: {
      gold: 1,
      silver: 0,
      bronze: 0,
      tournaments: ['Rookie Fix Mix Motion x Winny Grosir'],
      partnerDefault: 'Merry'
    }
  },
  {
    id: 'LLP-MBR-009',
    name: 'Nia',
    nickname: 'Nia',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    phone: '0813-9911-2244',
    email: 'nia.lagilagipadel@gmail.com',
    club: 'LagiLagi Padel Jakarta',
    city: 'Jakarta Selatan',
    rating: '3.3',
    gender: 'Perempuan',
    membershipTier: 'Elite Black',
    joinedDate: '01 Mar 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool 2 (R16)',
    qualifiedPhase: 'Runner-Up Grand Final Silver',
    achievements: {
      gold: 0,
      silver: 1,
      bronze: 0,
      tournaments: ['Rookie Fix Mix Motion x Winny Grosir'],
      partnerDefault: 'Sassa Rizki'
    }
  },
  {
    id: 'LLP-MBR-010',
    name: 'Sassa Rizki',
    nickname: 'Sassa',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    phone: '0812-7788-9900',
    email: 'sassa.rizki@gmail.com',
    club: 'LagiLagi Padel Jakarta',
    city: 'Jakarta Selatan',
    rating: '3.3',
    gender: 'Laki-laki',
    membershipTier: 'Elite Black',
    joinedDate: '03 Mar 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool 2 (R16)',
    qualifiedPhase: 'Runner-Up Grand Final Silver',
    achievements: {
      gold: 0,
      silver: 1,
      bronze: 0,
      tournaments: ['Rookie Fix Mix Motion x Winny Grosir'],
      partnerDefault: 'Nia'
    }
  },
  {
    id: 'LLP-MBR-011',
    name: 'Christina',
    nickname: 'Tina',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    phone: '0811-9922-3344',
    email: 'christina.satrio@gmail.com',
    club: 'Satrio Padel Club',
    city: 'Jakarta Selatan',
    rating: '3.2',
    gender: 'Perempuan',
    membershipTier: 'Pro Club',
    joinedDate: '15 Feb 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool 3',
    qualifiedPhase: 'Juara 3 Bronze Playoff',
    achievements: {
      gold: 0,
      silver: 0,
      bronze: 1,
      tournaments: ['Rookie Fix Mix Motion x Winny Grosir'],
      partnerDefault: 'Mega'
    }
  },
  {
    id: 'LLP-MBR-012',
    name: 'Mega',
    nickname: 'Mega',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    phone: '0812-8811-4433',
    email: 'mega.padel@satrio.com',
    club: 'Satrio Padel Club',
    city: 'Jakarta Selatan',
    rating: '3.1',
    gender: 'Perempuan',
    membershipTier: 'Pro Club',
    joinedDate: '18 Feb 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Rookie Fix Mix Motion x Winny Grosir',
    qualifiedPool: 'Pool 3',
    qualifiedPhase: 'Juara 3 Bronze Playoff',
    achievements: {
      gold: 0,
      silver: 0,
      bronze: 1,
      tournaments: ['Rookie Fix Mix Motion x Winny Grosir'],
      partnerDefault: 'Christina'
    }
  },
  {
    id: 'LLP-MBR-013',
    name: 'Bagas Pratama',
    nickname: 'Bagas',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    phone: '0811-3322-1100',
    email: 'bagas.pratama@gmail.com',
    club: 'LagiLagi Padel Club',
    city: 'Jakarta Selatan',
    rating: '2.4',
    gender: 'Laki-laki',
    membershipTier: 'Rookie',
    joinedDate: '01 Agu 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Beginner Men Showdown',
    qualifiedPool: 'Pool A',
    qualifiedPhase: 'Juara 1 Beginner Showdown (Lolos Pool A)',
    achievements: {
      gold: 1,
      silver: 0,
      bronze: 0,
      tournaments: ['Beginner Men Showdown'],
      partnerDefault: 'Dimas Wicaksono'
    }
  },
  {
    id: 'LLP-MBR-014',
    name: 'Dimas Wicaksono',
    nickname: 'Dimas',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    phone: '0812-4455-6677',
    email: 'dimas.wicaksono@gmail.com',
    club: 'LagiLagi Padel Club',
    city: 'Jakarta Selatan',
    rating: '2.4',
    gender: 'Laki-laki',
    membershipTier: 'Rookie',
    joinedDate: '02 Agu 2026',
    status: 'Aktif',
    isGroupQualified: true,
    qualifiedTournament: 'Beginner Men Showdown',
    qualifiedPool: 'Pool A',
    qualifiedPhase: 'Juara 1 Beginner Showdown (MVP)',
    achievements: {
      gold: 1,
      silver: 0,
      bronze: 0,
      tournaments: ['Beginner Men Showdown'],
      partnerDefault: 'Bagas Pratama'
    }
  },
  {
    id: 'LLP-MBR-015',
    name: 'Bimo Prasetyo',
    nickname: 'Bimo',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    phone: '0813-1122-3344',
    email: 'bimo.prasetyo@bdgpadel.com',
    club: 'Bandung Padel Arena',
    city: 'Bandung',
    rating: '3.0',
    gender: 'Laki-laki',
    membershipTier: 'Pro Club',
    joinedDate: '10 Jan 2026',
    status: 'Aktif',
    isGroupQualified: false, // Belum lolos fase grup di turnamen aktif terbaru
    qualifiedTournament: 'Rookie Fix Mix',
    qualifiedPool: 'Pool B (Peringkat 3)',
    qualifiedPhase: 'Tereliminasi di Babak Pool (Posisi 3)',
    achievements: {
      gold: 0,
      silver: 0,
      bronze: 1,
      tournaments: ['F3 Rookie Men vol 2'],
      partnerDefault: 'Farhan Hakim'
    }
  },
  {
    id: 'LLP-MBR-016',
    name: 'Farhan Hakim',
    nickname: 'Farhan',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
    phone: '0812-5566-7788',
    email: 'farhan.hakim@bdgpadel.com',
    club: 'Bandung Padel Arena',
    city: 'Bandung',
    rating: '2.9',
    gender: 'Laki-laki',
    membershipTier: 'Rookie',
    joinedDate: '15 Jan 2026',
    status: 'Aktif',
    isGroupQualified: false,
    qualifiedTournament: 'Rookie Fix Mix',
    qualifiedPool: 'Pool B (Peringkat 3)',
    qualifiedPhase: 'Tereliminasi di Babak Pool (Posisi 3)',
    achievements: {
      gold: 0,
      silver: 0,
      bronze: 1,
      tournaments: ['F3 Rookie Men vol 2'],
      partnerDefault: 'Bimo Prasetyo'
    }
  }
];

// Presets photo collection for easy avatar selection in admin portal
export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80'
];

/**
 * Get all stored club members from localStorage
 */
export const getStoredMembers = (): ClubMember[] => {
  try {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading stored club members:', err);
  }
  return DEFAULT_CLUB_MEMBERS;
};

/**
 * Clear all stored club members to empty list (0 players)
 */
export const clearAllMembers = (): void => {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify([]));
  } catch (err) {
    console.error('Error clearing club members:', err);
  }
  window.dispatchEvent(
    new CustomEvent('lagilagipadel_members_updated', {
      detail: { members: [] }
    })
  );
};

/**
 * Reset club members back to default list
 */
export const resetToDefaultMembers = (): ClubMember[] => {
  saveStoredMembers(DEFAULT_CLUB_MEMBERS);
  return DEFAULT_CLUB_MEMBERS;
};

/**
 * Save club members to localStorage and emit custom event
 */
export const saveStoredMembers = (members: ClubMember[]): void => {
  try {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(
      new CustomEvent('lagilagipadel_members_updated', {
        detail: { members }
      })
    );
  } catch (err) {
    console.error('Error saving club members:', err);
  }
};

/**
 * Add a new member
 */
export const addStoredMember = (newMember: ClubMember): ClubMember[] => {
  const current = getStoredMembers();
  const updated = [newMember, ...current];
  saveStoredMembers(updated);
  return updated;
};

/**
 * Update an existing member
 */
export const updateStoredMember = (updatedMember: ClubMember): ClubMember[] => {
  const current = getStoredMembers();
  const updated = current.map((m) => (m.id === updatedMember.id ? updatedMember : m));
  saveStoredMembers(updated);
  return updated;
};

/**
 * Delete a member
 */
export const deleteStoredMember = (memberId: string): ClubMember[] => {
  const current = getStoredMembers();
  const updated = current.filter((m) => m.id !== memberId);
  saveStoredMembers(updated);
  return updated;
};

/**
 * Toggle Lolos Fase Grup parameter
 */
export const toggleGroupQualifiedStatus = (
  memberId: string,
  isQualified: boolean,
  details?: { tournament?: string; pool?: string; phase?: string }
): ClubMember[] => {
  const current = getStoredMembers();
  const updated = current.map((m) => {
    if (m.id === memberId) {
      return {
        ...m,
        isGroupQualified: isQualified,
        qualifiedTournament: details?.tournament || m.qualifiedTournament,
        qualifiedPool: details?.pool || m.qualifiedPool,
        qualifiedPhase: details?.phase || (isQualified ? 'Lolos Fase Grup (Playoff Qualified)' : 'Belum Kualifikasi')
      };
    }
    return m;
  });
  saveStoredMembers(updated);
  return updated;
};

/**
 * Find player photo by name or member ID (system-wide lookup)
 */
export const lookupPlayerPhoto = (playerNameOrId: string, fallbackDefault?: string): string => {
  if (!playerNameOrId) {
    return fallbackDefault || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
  }

  const members = getStoredMembers();
  const clean = playerNameOrId.trim().toLowerCase();

  // 1. Direct ID match
  const byId = members.find((m) => m.id.toLowerCase() === clean);
  if (byId && byId.photoUrl) return byId.photoUrl;

  // 2. Exact or substring name match
  const byName = members.find((m) => {
    const memName = m.name.toLowerCase();
    const memNick = (m.nickname || '').toLowerCase();
    return (
      memName === clean ||
      clean.includes(memName) ||
      memName.includes(clean) ||
      (memNick && (memNick === clean || clean.includes(memNick)))
    );
  });
  if (byName && byName.photoUrl) return byName.photoUrl;

  // 3. Fallback based on hash for stability if no match
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % PRESET_AVATARS.length;
  return fallbackDefault || PRESET_AVATARS[idx];
};

/**
 * Find member by name
 */
export const lookupMemberByName = (name: string): ClubMember | undefined => {
  const members = getStoredMembers();
  const clean = name.trim().toLowerCase();
  return members.find((m) => {
    const memName = m.name.toLowerCase();
    return memName === clean || clean.includes(memName) || memName.includes(clean);
  });
};
