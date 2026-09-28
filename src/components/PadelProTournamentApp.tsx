import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Medal,
  Play,
  RotateCcw,
  Search,
  Users,
  Calendar,
  MapPin,
  Flame,
  CheckCircle2,
  ChevronRight,
  Shield,
  ShieldCheck,
  Layers,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Award,
  Activity,
  Clock,
  Filter,
  Maximize2,
  Minimize2,
  Plus
} from 'lucide-react';
import { PADEL_TOURNAMENTS_DATA, FullTournamentDetail } from '../data/padelProTournamentsData';
import { RefereeAdminPortal } from './RefereeAdminPortal';
import { KnockoutBracketVisualizer } from './KnockoutBracketVisualizer';
import { getStoredBracket, KnockoutBracketData } from '../data/bracketStorage';
import { getStoredTournaments } from '../data/tournamentStorage';
import { lookupPlayerPhoto, lookupMemberByName, getStoredMembers, ClubMember } from '../data/clubMembersStorage';
import { getStoredTournamentGroups, PoolGroupData } from '../data/tournamentGroupStorage';
import { getStoredRefereeState, RefereeScoringState } from '../data/refereeStorage';

interface TeamData {
  id: string;
  name: string;
  p1: string;
  p2: string;
  pool: string;
  won: number;
  lost: number;
  points: number;
  gameDiff: number;
}

type TournamentSubTab = 'juara' | 'peserta' | 'hasil' | 'bracket' | 'klasemen';

export const PadelProTournamentApp: React.FC = () => {
  // Guest view tabs (Tamu / Pengunjung hanya melihat Turnamen & Bagan serta Hall of Fame)
  const [activeTab, setActiveTab] = useState<'tournaments' | 'halloffame'>('tournaments');
  const [selectedTournament, setSelectedTournament] = useState<string>('rookie-mix');
  const [openedTournamentId, setOpenedTournamentId] = useState<string | null>(null);

  // Dedicated Admin / Referee Portal State
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);

  // Full Screen States for Boxes
  const [isHubFullscreen, setIsHubFullscreen] = useState<boolean>(false);
  const [isBracketFullscreen, setIsBracketFullscreen] = useState<boolean>(false);
  const [isStandingsFullscreen, setIsStandingsFullscreen] = useState<boolean>(false);

  const hubRef = useRef<HTMLDivElement>(null);
  const bracketRef = useRef<HTMLDivElement>(null);
  const standingsRef = useRef<HTMLDivElement>(null);

  const toggleHubFullscreen = () => {
    if (!isHubFullscreen) {
      setIsHubFullscreen(true);
      try {
        if (hubRef.current && !document.fullscreenElement) {
          hubRef.current.requestFullscreen?.().catch(() => {});
        }
      } catch (e) {}
    } else {
      setIsHubFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      } catch (e) {}
    }
  };

  const toggleBracketFullscreen = () => {
    if (!isBracketFullscreen) {
      setIsBracketFullscreen(true);
      try {
        if (bracketRef.current && !document.fullscreenElement) {
          bracketRef.current.requestFullscreen?.().catch(() => {});
        }
      } catch (e) {}
    } else {
      setIsBracketFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      } catch (e) {}
    }
  };

  const toggleStandingsFullscreen = () => {
    if (!isStandingsFullscreen) {
      setIsStandingsFullscreen(true);
      try {
        if (standingsRef.current && !document.fullscreenElement) {
          standingsRef.current.requestFullscreen?.().catch(() => {});
        }
      } catch (e) {}
    } else {
      setIsStandingsFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      } catch (e) {}
    }
  };

  // Keyboard Escape listener to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHubFullscreen) setIsHubFullscreen(false);
        if (isBracketFullscreen) setIsBracketFullscreen(false);
        if (isStandingsFullscreen) setIsStandingsFullscreen(false);
      }
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        if (isHubFullscreen) setIsHubFullscreen(false);
        if (isBracketFullscreen) setIsBracketFullscreen(false);
        if (isStandingsFullscreen) setIsStandingsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isHubFullscreen, isBracketFullscreen, isStandingsFullscreen]);

  // Sub-tabs for tournament details as requested:
  // DAFTAR JUARA, LIST PESERTA, HASIL PERTANDINGAN, BRACKET KNOCK OUT, KLASEMEN GRUP
  const [tournamentSubTab, setTournamentSubTab] = useState<TournamentSubTab>('juara');
  const [participantSearch, setParticipantSearch] = useState<string>('');
  const [poolFilter, setPoolFilter] = useState<string>('Semua Pool');
  const [matchFilter, setMatchFilter] = useState<'semua' | 'grup' | 'knockout' | 'final'>('semua');

  // Persistent & reactive Tournaments List (synchronized with Admin Tournament Manager)
  const [storedTournaments, setStoredTournaments] = useState<FullTournamentDetail[]>(() =>
    getStoredTournaments()
  );
  const [guestStatusFilter, setGuestStatusFilter] = useState<'semua' | 'Live' | 'Akan Datang' | 'Selesai'>('semua');

  // Active tournament detail data from dynamic storage
  const activeTourney: FullTournamentDetail =
    storedTournaments.find((t) => t.id === (openedTournamentId || selectedTournament)) ||
    PADEL_TOURNAMENTS_DATA[openedTournamentId || selectedTournament] ||
    storedTournaments[0] ||
    PADEL_TOURNAMENTS_DATA['rookie-mix'];

  // Persistent & reactive Knockout Bracket (synchronized with Super Admin edits)
  const currentTourneyId = openedTournamentId || selectedTournament || 'rookie-mix';
  const [liveKnockoutBracket, setLiveKnockoutBracket] = useState<KnockoutBracketData>(() =>
    getStoredBracket(currentTourneyId)
  );

  // Persistent & reactive Club Members & Group Draws
  const [liveClubMembers, setLiveClubMembers] = useState<ClubMember[]>(() => getStoredMembers());
  const [liveGroupPools, setLiveGroupPools] = useState<PoolGroupData[]>(() =>
    getStoredTournamentGroups(currentTourneyId)
  );

  useEffect(() => {
    setLiveKnockoutBracket(getStoredBracket(currentTourneyId));
    setLiveGroupPools(getStoredTournamentGroups(currentTourneyId));
  }, [currentTourneyId]);

  useEffect(() => {
    const handleBracketUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.tournamentId === currentTourneyId) {
        setLiveKnockoutBracket(customEvent.detail.bracket);
      }
    };
    const handleMembersUpdated = () => {
      setLiveClubMembers(getStoredMembers());
    };
    const handleGroupsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.tournamentId === currentTourneyId) {
        setLiveGroupPools(customEvent.detail.pools);
      } else {
        setLiveGroupPools(getStoredTournamentGroups(currentTourneyId));
      }
    };
    const handleTournamentsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.tournaments) {
        setStoredTournaments(customEvent.detail.tournaments);
      } else {
        setStoredTournaments(getStoredTournaments());
      }
    };
    const handleRefereeStateChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.state) {
        setLiveReferee(customEvent.detail.state);
      } else {
        setLiveReferee(getStoredRefereeState());
      }
    };

    window.addEventListener('lagilagipadel_bracket_updated', handleBracketUpdated);
    window.addEventListener('lagilagipadel_members_updated', handleMembersUpdated);
    window.addEventListener('lagilagipadel_groups_updated', handleGroupsUpdated);
    window.addEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdated);
    window.addEventListener('lagilagipadel_referee_state_changed', handleRefereeStateChanged);
    window.addEventListener('lagilagipadel_scoring_reset', handleRefereeStateChanged);
    return () => {
      window.removeEventListener('lagilagipadel_bracket_updated', handleBracketUpdated);
      window.removeEventListener('lagilagipadel_members_updated', handleMembersUpdated);
      window.removeEventListener('lagilagipadel_groups_updated', handleGroupsUpdated);
      window.removeEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdated);
      window.removeEventListener('lagilagipadel_referee_state_changed', handleRefereeStateChanged);
      window.removeEventListener('lagilagipadel_scoring_reset', handleRefereeStateChanged);
    };
  }, [currentTourneyId]);

  // Reactive state for referee live electronic scoring
  const [liveReferee, setLiveReferee] = useState<RefereeScoringState>(() => getStoredRefereeState());
  const pointLabels = ['0', '15', '30', '40'];

  // Hall of fame search query
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [tournamentSearchQuery, setTournamentSearchQuery] = useState('');

  // Filtered tournament list for guest view
  const tournamentsList = storedTournaments.filter((item) => {
    if (guestStatusFilter === 'semua') return true;
    return item.status === guestStatusFilter;
  });

  // Teams & Pool Table Data (empty if no tournaments exist)
  const poolTeams: TeamData[] =
    storedTournaments.length === 0
      ? []
      : [
          { id: '1', name: 'Olivia & Rico', p1: 'Olivia', p2: 'Rico', pool: 'Pool A', won: 3, lost: 0, points: 6, gameDiff: +8 },
          { id: '2', name: 'Erde & Sie Jiang', p1: 'Erde', p2: 'Sie Jiang', pool: 'Pool A', won: 2, lost: 1, points: 4, gameDiff: +3 },
          { id: '3', name: 'Fery & Tania', p1: 'Fery', p2: 'Tania', pool: 'Pool A', won: 1, lost: 2, points: 2, gameDiff: -2 },
          { id: '4', name: 'Hanung & Ria', p1: 'Hanung', p2: 'Ria', pool: 'Pool A', won: 0, lost: 3, points: 0, gameDiff: -9 },
          { id: '5', name: 'Kartika & Dodie Adam', p1: 'Kartika Aditoputro', p2: 'Dodie Adam', pool: 'Pool B', won: 3, lost: 0, points: 6, gameDiff: +10 },
          { id: '6', name: 'Evan & Ngoe', p1: 'Evan', p2: 'Ngoe', pool: 'Pool B', won: 2, lost: 1, points: 4, gameDiff: +4 },
          { id: '7', name: 'Bimo & Farhan', p1: 'Bimo', p2: 'Farhan', pool: 'Pool B', won: 1, lost: 2, points: 2, gameDiff: -4 },
          { id: '8', name: 'Reza & Kevin', p1: 'Reza', p2: 'Kevin', pool: 'Pool B', won: 0, lost: 3, points: 0, gameDiff: -10 }
        ];

  // Hall of Fame Players (Dynamically linked to Club Members system-wide)
  const hallOfFamePlayers = liveClubMembers
    .filter((m) => {
      const hasAchievements =
        (m.achievements?.gold || 0) > 0 ||
        (m.achievements?.silver || 0) > 0 ||
        (m.achievements?.bronze || 0) > 0 ||
        m.isGroupQualified;
      if (!hasAchievements) return false;

      if (!playerSearchQuery.trim()) return true;
      const q = playerSearchQuery.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        (m.nickname && m.nickname.toLowerCase().includes(q)) ||
        m.id.toLowerCase().includes(q) ||
        (m.achievements?.partnerDefault && m.achievements.partnerDefault.toLowerCase().includes(q)) ||
        m.club.toLowerCase().includes(q)
      );
    });

  // Hall of Fame Tournaments with Podium Data
  const finishedTournaments = storedTournaments.filter((t) => {
    const hasPodium = t.winners?.podium && t.winners.podium.length > 0;
    const isFinished = t.status === 'Selesai';
    if (!hasPodium && !isFinished) return false;
    if (!tournamentSearchQuery.trim()) return true;
    const q = tournamentSearchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.organizer.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q)
    );
  });

  if (showAdminPortal) {
    return (
      <RefereeAdminPortal
        onBackToGuest={() => {
          setShowAdminPortal(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="bg-[#F6FAF9] text-[#191C1C] min-h-screen selection:bg-[#006A6A] selection:text-white">
      {/* Top Header matching Material 3 theme */}
      <div className="border-b border-[#D8DFDE] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#006A6A] flex items-center justify-center font-black text-white text-xs tracking-wider shadow-sm">
              LLP
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg sm:text-xl font-black tracking-tight font-display text-[#191C1C]">
                LagiLagi<span className="text-[#006A6A]">Padel</span>
              </span>
              <span className="text-[10px] font-semibold text-[#6F7978] uppercase tracking-wider mt-0.5">
                Portal Turnamen & Hasil Resmi
              </span>
            </div>
          </div>

          {/* Guest Subnav Tabs (Tamu hanya melihat Turnamen & Bagan serta Hall of Fame) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('tournaments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tournaments'
                  ? 'bg-[#006A6A] text-white shadow-xs'
                  : 'text-[#3D5A57] hover:text-[#191C1C] bg-white border border-[#D8DFDE]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Turnamen & Bagan</span>
            </button>

            <button
              onClick={() => setActiveTab('halloffame')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'halloffame'
                  ? 'bg-[#6E4D8B] text-white shadow-xs'
                  : 'text-[#3D5A57] hover:text-[#191C1C] bg-white border border-[#D8DFDE]'
              }`}
            >
              <Medal className="w-3.5 h-3.5" />
              <span>Hall of Fame</span>
            </button>

            {/* Tombol Terpisah Khusus Portal Wasit & Admin Pertandingan */}
            <button
              onClick={() => {
                setShowAdminPortal(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="ml-2 sm:ml-4 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-[#191C1C] hover:bg-neutral-800 text-white shadow-xs border border-neutral-700"
              title="Portal Khusus Wasit & Admin Pertandingan"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Portal Wasit & Admin</span>
              <span className="sm:hidden">Wasit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner with Oceanic Teal & Violet theme */}
      <section className="py-12 sm:py-16 text-center max-w-4xl mx-auto px-4 space-y-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006A6A]/10 border border-[#006A6A]/30 text-[#006A6A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#006A6A]" />
            Selamat Datang di LagiLagiPadel
          </span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-[#191C1C] font-display">
          LagiLagi<span className="text-[#006A6A]">Padel</span>
        </h1>

        <p className="text-sm sm:text-base text-[#3D5A57] font-medium max-w-xl mx-auto leading-relaxed">
          Informasi Turnamen Resmi, Bagan Knockout, Jadwal & Klasemen Pool
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setActiveTab('tournaments');
              setOpenedTournamentId(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#006A6A] hover:bg-[#007A7C] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#006A6A]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-white" />
            <span>Lihat Turnamen</span>
          </button>
          <button
            onClick={() => setActiveTab('halloffame')}
            className="px-5 py-2.5 rounded-xl bg-[#6E4D8B] hover:bg-[#8562A4] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#6E4D8B]/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Medal className="w-4 h-4 text-white" />
            <span>Hall of Fame</span>
          </button>
        </div>
      </section>

      {/* REAL-TIME LIVE SCORING BANNER FROM REFEREE */}
      {liveReferee && !liveReferee.isCleared && (liveReferee.courtScoreA > 0 || liveReferee.courtScoreB > 0 || liveReferee.gamesTeamA > 0 || liveReferee.gamesTeamB > 0) && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 animate-in slide-in-from-top-3 duration-300">
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#191C1C] via-[#05201E] to-[#191C1C] text-white border-2 border-red-500/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-36 h-36 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              {/* Header Badge */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black tracking-wider uppercase animate-pulse shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE SKOR WASIT RESMI
                  </span>
                  <span className="text-xs font-mono font-bold text-teal-300">
                    Court #{liveReferee.activeCourt} · {liveReferee.matchPhase}
                  </span>
                  {liveReferee.goldenPointActive && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-black uppercase animate-bounce">
                      ⚡ Golden Point
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-300 font-mono">
                  {storedTournaments.find((t) => t.id === liveReferee.selectedTourneyId)?.name || 'Pertandingan Sedang Berlangsung (Live)'}
                </p>
              </div>

              {/* Live Match Scoreboard Matrix */}
              <div className="flex items-center gap-3 sm:gap-6 bg-white/5 border border-white/10 p-3 sm:p-4 rounded-2xl flex-wrap justify-center">
                {/* Team A */}
                <div className="text-right min-w-[120px]">
                  <div className="flex items-center justify-end gap-1.5">
                    {liveReferee.currentServer === 'A' && (
                      <span className="text-[10px] bg-teal-400 text-teal-950 font-bold px-1.5 py-0.2 rounded-md font-mono">
                        🎾 SERVE
                      </span>
                    )}
                    <span className="text-sm sm:text-base font-extrabold text-white truncate block">
                      {liveReferee.teamAName}
                    </span>
                  </div>
                  <div className="text-[11px] text-teal-200 font-mono mt-0.5">
                    Set: <span className="font-bold text-white">{liveReferee.currentSetA}</span> · Games: <span className="font-bold text-white">{liveReferee.gamesTeamA}</span>
                  </div>
                </div>

                {/* Score Big Display */}
                <div className="px-3.5 sm:px-5 py-1.5 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 text-center shadow-inner">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-teal-300 tracking-wider">
                    {pointLabels[liveReferee.courtScoreA] || '0'}
                  </span>
                  <span className="text-sm font-bold text-neutral-500">:</span>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-teal-300 tracking-wider">
                    {pointLabels[liveReferee.courtScoreB] || '0'}
                  </span>
                </div>

                {/* Team B */}
                <div className="text-left min-w-[120px]">
                  <div className="flex items-center justify-start gap-1.5">
                    <span className="text-sm sm:text-base font-extrabold text-white truncate block">
                      {liveReferee.teamBName}
                    </span>
                    {liveReferee.currentServer === 'B' && (
                      <span className="text-[10px] bg-teal-400 text-teal-950 font-bold px-1.5 py-0.2 rounded-md font-mono">
                        🎾 SERVE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-teal-200 font-mono mt-0.5">
                    Set: <span className="font-bold text-white">{liveReferee.currentSetB}</span> · Games: <span className="font-bold text-white">{liveReferee.gamesTeamB}</span>
                  </div>
                </div>
              </div>

              {/* Quick View Button */}
              <div className="shrink-0 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    const targetTourney = liveReferee.selectedTourneyId || (storedTournaments[0] && storedTournaments[0].id) || 'rookie-mix';
                    setOpenedTournamentId(targetTourney);
                    setSelectedTournament(targetTourney);
                    setTournamentSubTab('hasil');
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Buka Hasil Pertandingan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: TOURNAMENTS & BRACKETS */}
      {activeTab === 'tournaments' && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          {/* KONDISI 1: HALAMAN AWAL (KETIKA BELUM DI KLIK APAPUN) */}
          {openedTournamentId === null ? (
            <div className="space-y-12 animate-in fade-in duration-200">
              {/* Tournament Cards Portfolio */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#191C1C] flex items-center gap-2 font-display">
                      <Trophy className="w-5 h-5 text-[#006A6A]" />
                      <span>Daftar Turnamen Padel</span>
                    </h2>
                    <p className="text-xs text-[#6F7978] mt-0.5">
                      Pilih kejuaraan untuk melihat bagan sistem gugur, live skor, jadwal, dan klasemen.
                    </p>
                  </div>

                  {/* Filter tabs & Admin Quick Access */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex p-1 bg-white border border-[#D8DFDE] rounded-xl gap-1 shadow-2xs">
                      {(['semua', 'Live', 'Akan Datang', 'Selesai'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setGuestStatusFilter(st)}
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                            guestStatusFilter === st
                              ? 'bg-[#006A6A] text-white shadow-2xs'
                              : 'text-[#6F7978] hover:text-[#191C1C]'
                          }`}
                        >
                          {st === 'semua' ? `Semua (${storedTournaments.length})` : st}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminPortal(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#191C1C] hover:bg-neutral-800 text-white shadow-xs flex items-center gap-1.5 cursor-pointer"
                      title="Buka panel admin untuk membuat atau mengedit turnamen"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Kelola Turnamen</span>
                    </button>
                  </div>
                </div>

                {tournamentsList.length === 0 ? (
                  <div className="p-10 sm:p-12 text-center rounded-2xl bg-white border border-[#D8DFDE] shadow-xs space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#006A6A]/10 text-[#006A6A] flex items-center justify-center mx-auto">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#191C1C]">
                      {storedTournaments.length === 0 ? 'Belum Ada Turnamen Aktif' : 'Tidak Ada Turnamen Ditemukan'}
                    </h3>
                    <p className="text-xs text-[#3D5A57] max-w-md mx-auto leading-relaxed">
                      {storedTournaments.length === 0
                        ? 'Seluruh data turnamen telah dikosongkan. Gunakan tombol di bawah untuk membuat turnamen baru dari awal atau muat data demo dari panel admin.'
                        : 'Tidak ada turnamen yang cocok dengan filter status terpilih.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminPortal(true);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="mt-2 px-4 py-2 text-xs font-bold text-white bg-[#006A6A] hover:bg-[#005252] rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Buat Turnamen / Buka Admin</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {tournamentsList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedTournament(item.id);
                          setOpenedTournamentId(item.id);
                          setTournamentSubTab('juara');
                          setPoolFilter('Semua Pool');
                          setParticipantSearch('');
                          setMatchFilter('semua');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="p-5 rounded-2xl border border-[#D8DFDE] bg-white hover:border-[#006A6A] hover:shadow-md transition-all cursor-pointer shadow-xs group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs font-mono text-[#006A6A] uppercase font-bold">
                            {item.organizer}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                              item.status === 'Live'
                                ? 'bg-[#BA1A1A] text-white animate-pulse'
                                : item.status === 'Akan Datang'
                                ? 'bg-[#6E4D8B]/15 text-[#6E4D8B] border border-[#6E4D8B]/30'
                                : 'bg-[#006A6A]/10 text-[#006A6A] border border-[#006A6A]/30'
                            }`}
                          >
                            {item.status === 'Live' ? '⚡ LIVE' : item.status === 'Akan Datang' ? '⏳ AKAN DATANG' : '✓ SELESAI'}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-[#191C1C] mb-2 font-display group-hover:text-[#006A6A] transition-colors">
                          {item.name}
                        </h3>

                        <div className="space-y-1.5 text-xs text-[#3D5A57] mb-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-[#006A6A]" />
                            <span>{item.location} ({item.totalCourts} Courts)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[#6F7978]" />
                            <span>{item.date}</span>
                          </div>
                          <div className="text-[11px] text-[#6F7978]">
                            Format: {item.rules}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[#D8DFDE] text-xs">
                          <span className="text-[#006A6A] font-semibold flex items-center gap-1 group-hover:underline">
                            Klik untuk Buka Bagan & Pool
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#6F7978] group-hover:text-[#006A6A] group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Pool Standings (Tampilan Default Halaman Awal) */}
              <div
                ref={standingsRef}
                className={
                  isStandingsFullscreen
                    ? 'fixed inset-0 z-50 overflow-y-auto bg-[#F6FAF9] p-6 sm:p-10 space-y-6 shadow-2xl animate-in fade-in duration-200'
                    : 'p-6 rounded-2xl bg-white border border-[#D8DFDE] space-y-6 shadow-xs'
                }
              >
                {/* Full Screen Top Banner */}
                {isStandingsFullscreen && (
                  <div className="bg-[#191C1C] text-white px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono font-bold tracking-wider uppercase text-emerald-300">
                        Mode Layar Penuh: Klasemen Pool & Sistem Gugur
                      </span>
                      <span className="text-neutral-400 hidden sm:inline">
                        · Tekan tombol [Esc] pada keyboard atau tombol merah untuk keluar
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleStandingsFullscreen}
                      className="px-3.5 py-1.5 rounded-xl bg-[#BA1A1A] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Keluar Full Screen</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#191C1C] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#006A6A]" />
                      <span>Klasemen Pool & Sistem Gugur (Rookie Fix Mix)</span>
                    </h3>
                    <p className="text-xs text-[#6F7978] mt-0.5">
                      Top 2 dari setiap Pool otomatis lolos ke Babak 16 Besar (Knockout Draw).
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                      <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span>Turnamen Sedang Berlangsung</span>
                    </div>

                    {/* Tombol Full Screen Klasemen */}
                    <button
                      type="button"
                      onClick={toggleStandingsFullscreen}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                        isStandingsFullscreen
                          ? 'bg-[#BA1A1A] hover:bg-red-700 text-white'
                          : 'bg-white hover:bg-[#EEF4F3] border border-[#D8DFDE] text-[#191C1C] hover:text-[#006A6A]'
                      }`}
                      title={isStandingsFullscreen ? 'Keluar dari Mode Full Screen (Esc)' : 'Buka kotak klasemen ini dalam mode Layar Penuh'}
                    >
                      {isStandingsFullscreen ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Keluar Full Screen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-[#006A6A]" />
                          <span>Full Screen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Standings Table */}
                <div className="overflow-x-auto rounded-xl border border-[#D8DFDE]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#EEF4F3] border-b border-[#D8DFDE] text-[#6F7978] font-mono text-[11px] uppercase">
                        <th className="py-2.5 px-3">Pos</th>
                        <th className="py-2.5 px-3">Pasangan Pemain</th>
                        <th className="py-2.5 px-3">Pool</th>
                        <th className="py-2.5 px-3 text-center">Menang</th>
                        <th className="py-2.5 px-3 text-center">Kalah</th>
                        <th className="py-2.5 px-3 text-center">Selisih Game</th>
                        <th className="py-2.5 px-3 text-right">Poin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D8DFDE] bg-white">
                      {poolTeams.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-[#6F7978]">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-[#191C1C]">Data Klasemen Kosong</p>
                              <p className="text-[11px] text-[#6F7978]">
                                Belum ada pertandingan aktif untuk ditampilkan dalam tabel klasemen.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        poolTeams.map((team, idx) => {
                          const isQualified = idx % 4 < 2;

                          return (
                            <tr key={team.id} className="hover:bg-[#F6FAF9] transition-colors">
                              <td className="py-3 px-3 font-mono font-bold text-[#191C1C]">
                                <span className={`inline-block w-5 h-5 text-center leading-5 rounded-md ${isQualified ? 'bg-[#006A6A] text-white' : 'text-[#6F7978]'}`}>
                                  {idx + 1}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-[#191C1C]">{team.name}</div>
                                <div className="text-[11px] text-[#6F7978]">{team.p1} / {team.p2}</div>
                              </td>
                              <td className="py-3 px-3 font-mono text-[#6F7978]">{team.pool}</td>
                              <td className="py-3 px-3 text-center font-mono text-[#191C1C]">{team.won}</td>
                              <td className="py-3 px-3 text-center font-mono text-[#6F7978]">{team.lost}</td>
                              <td className="py-3 px-3 text-center font-mono text-[#006A6A] font-bold">
                                {team.gameDiff > 0 ? `+${team.gameDiff}` : team.gameDiff}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-bold text-[#191C1C] text-sm">
                                {team.points}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Knockout Bracket Visual (Tampilan Default Halaman Awal) */}
              <div className="p-6 rounded-2xl bg-white border border-[#D8DFDE] space-y-6 shadow-xs">
                <h3 className="text-lg font-bold text-[#191C1C] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#006A6A]" />
                  <span>Bagan Sistem Gugur (Knockout Bracket)</span>
                </h3>

                {storedTournaments.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#6F7978] bg-[#F6FAF9] rounded-xl border border-[#D8DFDE] space-y-1">
                    <Trophy className="w-8 h-8 text-[#006A6A]/40 mx-auto mb-1.5" />
                    <p className="font-bold text-[#191C1C]">Bagan Sistem Gugur Kosong</p>
                    <p className="text-[11px] text-[#6F7978]">
                      Belum ada turnamen atau pertandingan sistem gugur yang dijadwalkan.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    {/* Quarter Final */}
                    <div className="space-y-4">
                      <span className="text-[#6F7978] uppercase font-mono text-[11px] block font-semibold">
                        Perempat Final (Race to 4)
                      </span>
                      <div className="p-3 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] space-y-2">
                        <div className="flex justify-between font-bold text-[#191C1C]">
                          <span>Olivia & Rico (Pool A)</span>
                          <span className="text-[#006A6A] font-mono">4</span>
                        </div>
                        <div className="flex justify-between text-[#6F7978]">
                          <span>Evan & Ngoe (Pool B)</span>
                          <span className="font-mono">2</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] space-y-2">
                        <div className="flex justify-between font-bold text-[#191C1C]">
                          <span>Kartika & Dodie (Pool B)</span>
                          <span className="text-[#006A6A] font-mono">4</span>
                        </div>
                        <div className="flex justify-between text-[#6F7978]">
                          <span>Erde & Sie Jiang (Pool A)</span>
                          <span className="font-mono">1</span>
                        </div>
                      </div>
                    </div>

                    {/* Semi Final */}
                    <div className="space-y-4">
                      <span className="text-[#6F7978] uppercase font-mono text-[11px] block font-semibold">
                        Semifinal (Race to 6)
                      </span>
                      <div className="p-3.5 rounded-xl bg-[#F6FAF9] border border-[#006A6A]/40 space-y-2.5">
                        <div className="flex justify-between font-bold text-[#191C1C]">
                          <span>Olivia & Rico</span>
                          <span className="text-[#006A6A] font-mono">6</span>
                        </div>
                        <div className="flex justify-between text-[#6F7978]">
                          <span>Kartika & Dodie</span>
                          <span className="font-mono">4</span>
                        </div>
                        <div className="text-[10px] text-[#6F7978] font-mono pt-1 border-t border-[#D8DFDE]">
                          Court 2 · Selesai
                        </div>
                      </div>
                    </div>

                    {/* Grand Final */}
                    <div className="space-y-4">
                      <span className="text-[#6E4D8B] uppercase font-mono text-[11px] block flex items-center gap-1 font-bold">
                        <Trophy className="w-3.5 h-3.5 text-[#6E4D8B]" />
                        Grand Final (Gold Match)
                      </span>
                      <div className="p-4 rounded-xl bg-gradient-to-b from-[#6E4D8B]/10 to-[#F6FAF9] border border-[#6E4D8B]/40 space-y-3 shadow-sm">
                        <div className="flex justify-between font-bold text-[#191C1C] text-sm">
                          <span>Olivia & Rico</span>
                          <span className="text-[#6E4D8B] font-mono font-black">6</span>
                        </div>
                        <div className="flex justify-between text-[#3D5A57]">
                          <span>Team F3 Men Champion</span>
                          <span className="font-mono font-bold">4</span>
                        </div>
                        <div className="pt-2 border-t border-[#D8DFDE] flex items-center justify-between text-[11px]">
                          <span className="text-[#6E4D8B] font-bold">🏆 JUARA 1 (GOLD)</span>
                          <span className="text-[#6F7978] font-mono">All In Padel Court 1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* KONDISI 2: PINDAH HALAMAN (HALAMAN DEDIKASI DETAIL TURNAMEN DENGAN 5 TOMBOL) */
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Top Navigation & Breadcrumbs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D8DFDE]">
                <button
                  onClick={() => {
                    setOpenedTournamentId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-[#EEF4F3] border border-[#D8DFDE] text-[#006A6A] hover:text-[#007A7C] text-xs font-bold transition-all shadow-xs cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Kembali ke Daftar Turnamen</span>
                </button>

                <div className="text-xs text-[#6F7978] font-mono flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => {
                      setOpenedTournamentId(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:underline hover:text-[#006A6A] cursor-pointer"
                  >
                    Daftar Turnamen
                  </button>
                  <span>/</span>
                  <span className="text-[#191C1C] font-bold">{activeTourney.name}</span>
                </div>
              </div>

              {/* DEDICATED TOURNAMENT DETAIL HUB WITH 5 BUTTONS */}
              <div
                id="tournament-hub"
                ref={hubRef}
                className={
                  isHubFullscreen
                    ? 'fixed inset-0 z-50 overflow-y-auto bg-[#F6FAF9] p-6 sm:p-10 space-y-8 shadow-2xl animate-in fade-in duration-200'
                    : 'p-6 sm:p-8 rounded-3xl bg-white border border-[#D8DFDE] space-y-8 shadow-sm'
                }
              >
                {/* Full Screen Top Banner */}
                {isHubFullscreen && (
                  <div className="bg-[#191C1C] text-white px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-mono font-bold tracking-wider uppercase text-emerald-300">
                        Mode Layar Penuh: Pusat Informasi & Bagan Turnamen
                      </span>
                      <span className="text-neutral-400 hidden sm:inline">
                        · Tekan tombol [Esc] pada keyboard atau tombol merah untuk keluar
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleHubFullscreen}
                      className="px-3.5 py-1.5 rounded-xl bg-[#BA1A1A] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                      <span>Keluar Full Screen</span>
                    </button>
                  </div>
                )}

                {/* Header: Selected Tournament Info */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D8DFDE]">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#006A6A]/10 border border-[#006A6A]/30 text-[#006A6A] text-[11px] font-mono font-bold uppercase">
                        {activeTourney.organizer}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                          activeTourney.status === 'Live'
                            ? 'bg-[#BA1A1A] text-white animate-pulse'
                            : activeTourney.status === 'Akan Datang'
                            ? 'bg-[#6E4D8B] text-white'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {activeTourney.status === 'Live'
                          ? '⚡ LIVE TOURNAMENT'
                          : activeTourney.status === 'Akan Datang'
                          ? '⏳ AKAN DATANG / TERJADWAL'
                          : '✓ TURNAMEN SELESAI'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-[#191C1C] font-display">
                      {activeTourney.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#3D5A57] pt-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#006A6A]" />
                        <span>{activeTourney.location}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#6F7978]" />
                        <span>{activeTourney.date}</span>
                      </span>
                      <span className="flex items-center gap-1.5 font-mono text-[#006A6A] font-bold">
                        <Trophy className="w-3.5 h-3.5 text-[#006A6A]" />
                        <span>Hadiah: {activeTourney.prizePool}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto flex-wrap">
                    {activeTourney.status === 'Live' && (
                      <button
                        onClick={() => setTournamentSubTab('hasil')}
                        className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Activity className="w-4 h-4 text-red-600 animate-pulse" />
                        <span>Lihat Skor Pertandingan Live</span>
                      </button>
                    )}

                    {/* Tombol Full Screen Tournament Hub */}
                    <button
                      type="button"
                      onClick={toggleHubFullscreen}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isHubFullscreen
                          ? 'bg-[#BA1A1A] hover:bg-red-700 text-white'
                          : 'bg-white hover:bg-[#EEF4F3] border border-[#D8DFDE] text-[#191C1C] hover:text-[#006A6A]'
                      }`}
                      title={isHubFullscreen ? 'Keluar Mode Layar Penuh (Esc)' : 'Buka kotak turnamen ini dalam mode Layar Penuh (Full Screen)'}
                    >
                      {isHubFullscreen ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Keluar Full Screen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-[#006A6A]" />
                          <span>Full Screen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* THE 5 BUTTONS MENU */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#6F7978] uppercase font-bold tracking-wider">
                      Menu Informasi Turnamen (Pilih untuk Membuka):
                    </span>
                    <span className="text-[11px] font-mono text-[#006A6A] font-semibold">
                      5 Menu Lengkap Tersedia
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    {[
                      { id: 'juara', label: 'DAFTAR JUARA', icon: Trophy, desc: 'Podium & Hadiah' },
                      { id: 'peserta', label: 'LIST PESERTA', icon: Users, desc: `${activeTourney.participants.length} Pasangan` },
                      { id: 'hasil', label: 'HASIL PERTANDINGAN', icon: Activity, desc: `${activeTourney.matches.length} Match` },
                      { id: 'bracket', label: 'BRACKET KNOCK OUT', icon: Sparkles, desc: 'Bagan Playoff' },
                      { id: 'klasemen', label: 'KLASEMEN GRUP', icon: Layers, desc: 'Pool Standings' }
                    ].map((btn) => {
                      const isActive = tournamentSubTab === btn.id;
                      const Icon = btn.icon;

                      return (
                        <button
                          key={btn.id}
                          onClick={() => setTournamentSubTab(btn.id as TournamentSubTab)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                            isActive
                              ? 'bg-[#006A6A] border-[#006A6A] text-white shadow-md shadow-[#006A6A]/20 ring-2 ring-[#006A6A]/25'
                              : 'bg-[#F6FAF9] hover:bg-white border-[#D8DFDE] hover:border-[#006A6A]/50 text-[#191C1C]'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#006A6A]'}`} />
                            <span
                              className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-white border border-[#D8DFDE] text-[#6F7978]'
                              }`}
                            >
                              {btn.desc}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-black tracking-tight">
                            {btn.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TAB CONTENT 1: DAFTAR JUARA */}
                {tournamentSubTab === 'juara' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    {activeTourney.winners.notes && (
                      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                        activeTourney.status === 'Live'
                          ? 'bg-amber-50 border-amber-300 text-amber-900'
                          : 'bg-[#EEF4F3] border-[#D8DFDE] text-[#191C1C]'
                      }`}>
                        <Award className={`w-5 h-5 shrink-0 ${activeTourney.status === 'Live' ? 'text-amber-600' : 'text-[#006A6A]'}`} />
                        <div className="text-xs leading-relaxed">
                          <strong className="block font-bold">Catatan Resmi Panitia Turnamen:</strong>
                          <span>{activeTourney.winners.notes}</span>
                        </div>
                      </div>
                    )}

                    {/* Podium Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {activeTourney.winners.podium.slice(0, 3).map((win, idx) => {
                        const isGold = win.place === '1';
                        const isSilver = win.place === '2';
                        const isBronze = win.place === '3';

                        return (
                          <div
                            key={idx}
                            className={`p-5 rounded-2xl border relative overflow-hidden transition-all shadow-xs flex flex-col justify-between ${
                              isGold
                                ? 'bg-gradient-to-b from-[#6E4D8B]/10 to-white border-[#6E4D8B]/40 ring-1 ring-[#6E4D8B]/30'
                                : isSilver
                                ? 'bg-gradient-to-b from-[#006A6A]/10 to-white border-[#006A6A]/30'
                                : 'bg-white border-[#D8DFDE]'
                            }`}
                          >
                            {/* Gold accent badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 ${
                                  isGold
                                    ? 'bg-[#6E4D8B] text-white shadow-xs'
                                    : isSilver
                                    ? 'bg-[#006A6A] text-white shadow-xs'
                                    : 'bg-[#F6FAF9] text-[#3D5A57] border border-[#D8DFDE]'
                                }`}
                              >
                                <span>{isGold ? '🥇' : isSilver ? '🥈' : '🥉'}</span>
                                <span>{win.title}</span>
                              </span>
                              <span className="text-[10px] font-mono text-[#006A6A] font-bold">
                                +{win.pointsEarned} Pts FIP
                              </span>
                            </div>

                            <div className="space-y-1 mb-4">
                              <h4 className="text-base sm:text-lg font-black text-[#191C1C] font-display">
                                {win.teamName}
                              </h4>
                              <p className="text-xs text-[#6F7978]">
                                Pemain: {win.p1} & {win.p2}
                              </p>
                              <p className="text-xs font-semibold text-[#006A6A]">
                                Klub: {win.club}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-[#D8DFDE] space-y-2 text-xs">
                              <div>
                                <span className="text-[10px] text-[#6F7978] uppercase font-mono block">Hadiah & Trofi:</span>
                                <span className="font-bold text-[#191C1C]">{win.prize}</span>
                              </div>
                              {win.finalScore && (
                                <div className="p-2 rounded-lg bg-[#F6FAF9] border border-[#D8DFDE] text-[11px]">
                                  <span className="text-[#6F7978]">Rekap Skor: </span>
                                  <span className="font-mono font-bold text-[#006A6A]">{win.finalScore}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* MVP / Best Player Banner */}
                    {activeTourney.winners.mvp && (
                      <div className="p-5 rounded-2xl bg-white border border-[#D8DFDE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#6E4D8B]/10 border border-[#6E4D8B]/30 flex items-center justify-center text-[#6E4D8B] shrink-0">
                            <Medal className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase font-bold text-[#6E4D8B] tracking-wider block">
                              PENGHARGAAN KHUSUS WASIT & KOMITE:
                            </span>
                            <h4 className="text-sm sm:text-base font-bold text-[#191C1C]">
                              {activeTourney.winners.mvp.award} — <span className="text-[#006A6A]">{activeTourney.winners.mvp.name}</span>
                            </h4>
                            <p className="text-xs text-[#6F7978] mt-0.5">
                              Statistik: {activeTourney.winners.mvp.stat}
                            </p>
                          </div>
                        </div>

                        <div className="text-xs font-mono text-[#006A6A] bg-[#EEF4F3] px-3.5 py-2 rounded-xl border border-[#D8DFDE] font-semibold text-center shrink-0">
                          Sertifikat MVP Resmi
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB CONTENT 2: LIST PESERTA */}
                {tournamentSubTab === 'peserta' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* Search & Pool Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="relative max-w-sm w-full">
                        <Search className="w-4 h-4 text-[#6F7978] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Cari nama pemain, partner, klub..."
                          value={participantSearch}
                          onChange={(e) => setParticipantSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#D8DFDE] text-xs text-[#191C1C] placeholder-[#6F7978] focus:outline-none focus:border-[#006A6A]"
                        />
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        <Filter className="w-3.5 h-3.5 text-[#6F7978] shrink-0" />
                        <span className="text-xs font-mono text-[#6F7978] shrink-0">Filter Pool:</span>
                        {activeTourney.groupStandings.pools.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPoolFilter(p)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              poolFilter === p
                                ? 'bg-[#006A6A] text-white shadow-xs'
                                : 'bg-[#F6FAF9] text-[#6F7978] hover:text-[#191C1C] border border-[#D8DFDE]'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table of Participants */}
                    <div className="overflow-x-auto rounded-2xl border border-[#D8DFDE]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#EEF4F3] border-b border-[#D8DFDE] text-[#6F7978] font-mono text-[11px] uppercase">
                            <th className="py-3 px-3.5 text-center">Seed / No</th>
                            <th className="py-3 px-3 text-center">Foto</th>
                            <th className="py-3 px-4">Pasangan Pemain & ID Member</th>
                            <th className="py-3 px-3 text-center">Rating</th>
                            <th className="py-3 px-4">Asal Klub & Kota</th>
                            <th className="py-3 px-3 text-center">Pool</th>
                            <th className="py-3 px-3.5 text-center">Status & Kualifikasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8DFDE] bg-white">
                          {activeTourney.participants
                            .filter((item) => {
                              const matchesSearch =
                                participantSearch === '' ||
                                item.teamName.toLowerCase().includes(participantSearch.toLowerCase()) ||
                                item.p1.toLowerCase().includes(participantSearch.toLowerCase()) ||
                                item.p2.toLowerCase().includes(participantSearch.toLowerCase()) ||
                                item.club.toLowerCase().includes(participantSearch.toLowerCase()) ||
                                item.city.toLowerCase().includes(participantSearch.toLowerCase());

                              const matchesPool =
                                poolFilter === 'Semua Pool' || item.pool === poolFilter;

                              return matchesSearch && matchesPool;
                            })
                            .map((team, idx) => {
                              const mem1 = lookupMemberByName(team.p1);
                              const mem2 = lookupMemberByName(team.p2);
                              const p1Photo = mem1?.photoUrl || lookupPlayerPhoto(team.p1);
                              const p2Photo = mem2?.photoUrl || lookupPlayerPhoto(team.p2);
                              const isQualified =
                                (mem1?.isGroupQualified || mem2?.isGroupQualified) || team.status === 'Playoff';

                              return (
                                <tr key={idx} className="hover:bg-[#F6FAF9] transition-colors">
                                  <td className="py-3.5 px-3.5 text-center font-mono font-bold text-[#191C1C]">
                                    <span className="inline-block w-6 h-6 leading-6 rounded-md bg-[#EEF4F3] border border-[#D8DFDE] text-[#006A6A]">
                                      #{team.seed}
                                    </span>
                                  </td>

                                  {/* Player Photos */}
                                  <td className="py-3.5 px-3 text-center">
                                    <div className="flex items-center justify-center -space-x-2">
                                      <img
                                        src={p1Photo}
                                        alt={team.p1}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                                        title={team.p1}
                                      />
                                      <img
                                        src={p2Photo}
                                        alt={team.p2}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                                        title={team.p2}
                                      />
                                    </div>
                                  </td>

                                  {/* Team & Member IDs */}
                                  <td className="py-3.5 px-4">
                                    <div className="font-bold text-[#191C1C] text-sm">{team.teamName}</div>
                                    <div className="text-[11px] text-[#6F7978] flex items-center gap-1.5 flex-wrap mt-0.5">
                                      <span>
                                        {mem1?.id && (
                                          <span className="px-1.5 py-0.2 rounded bg-[#006A6A]/10 text-[#006A6A] font-mono text-[9px] font-bold mr-1">
                                            {mem1.id}
                                          </span>
                                        )}
                                        {team.p1}
                                      </span>
                                      <span>&</span>
                                      <span>
                                        {mem2?.id && (
                                          <span className="px-1.5 py-0.2 rounded bg-[#006A6A]/10 text-[#006A6A] font-mono text-[9px] font-bold mr-1">
                                            {mem2.id}
                                          </span>
                                        )}
                                        {team.p2}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="py-3.5 px-3 text-center font-mono font-bold text-[#006A6A]">
                                    {team.rating}
                                  </td>

                                  <td className="py-3.5 px-4 text-[#3D5A57]">
                                    <div className="font-semibold">{team.club}</div>
                                    <div className="text-[11px] text-[#6F7978]">{team.city}</div>
                                  </td>

                                  <td className="py-3.5 px-3 text-center font-mono font-bold text-[#191C1C]">
                                    {team.pool}
                                  </td>

                                  {/* Status & Special Qualified Parameter */}
                                  <td className="py-3.5 px-3.5 text-center">
                                    <div className="space-y-1 inline-flex flex-col items-center">
                                      <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                          isQualified
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                            : 'bg-[#006A6A]/10 text-[#006A6A] border border-[#006A6A]/30'
                                        }`}
                                      >
                                        {isQualified ? '✓ Lolos Fase Grup (Playoff)' : team.status}
                                      </span>
                                      {isQualified && (
                                        <span className="text-[9px] text-emerald-800 font-mono font-bold">
                                          Playoff Qualified
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 3: HASIL PERTANDINGAN */}
                {tournamentSubTab === 'hasil' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* Round Filter */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-mono text-[#6F7978]">Filter Kategori Babak:</span>
                      <div className="flex items-center gap-2">
                        {[
                          { id: 'semua', label: 'Semua Babak' },
                          { id: 'grup', label: 'Babak Pool / Grup' },
                          { id: 'knockout', label: 'Knockout / Playoff' },
                          { id: 'final', label: 'Grand Final & Bronze' }
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setMatchFilter(f.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              matchFilter === f.id
                                ? 'bg-[#006A6A] text-white shadow-xs'
                                : 'bg-[#F6FAF9] text-[#6F7978] hover:text-[#191C1C] border border-[#D8DFDE]'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Match Cards List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeTourney.matches
                        .filter((m) => matchFilter === 'semua' || m.roundCategory === matchFilter)
                        .map((match) => (
                          <div
                            key={match.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              match.status === 'Live'
                                ? 'bg-gradient-to-r from-red-50 to-white border-red-300 ring-1 ring-red-400'
                                : 'bg-white border-[#D8DFDE] shadow-xs'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D8DFDE]">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono font-bold text-[#006A6A]">
                                  {match.round}
                                </span>
                                <span className="text-[10px] text-[#6F7978]">· {match.court}</span>
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  match.status === 'Live'
                                    ? 'bg-red-600 text-white animate-pulse'
                                    : 'bg-[#EEF4F3] text-[#3D5A57]'
                                }`}
                              >
                                {match.status === 'Live' ? '● LIVE' : match.time}
                              </span>
                            </div>

                            {/* Teams & Score display */}
                            <div className="space-y-2.5">
                              {/* Team A */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className={`text-xs font-bold ${match.winner === 'A' ? 'text-[#006A6A]' : 'text-[#191C1C]'}`}>
                                    {match.teamA} {match.winner === 'A' && '🏆'}
                                  </div>
                                  <div className="text-[10px] text-[#6F7978]">{match.playersA}</div>
                                </div>
                                <span className={`text-base font-black font-mono px-2.5 py-1 rounded-lg ${
                                  match.winner === 'A' ? 'bg-[#006A6A] text-white' : 'bg-[#F6FAF9] text-[#191C1C] border border-[#D8DFDE]'
                                }`}>
                                  {match.scoreA}
                                </span>
                              </div>

                              {/* Team B */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className={`text-xs font-bold ${match.winner === 'B' ? 'text-[#006A6A]' : 'text-[#191C1C]'}`}>
                                    {match.teamB} {match.winner === 'B' && '🏆'}
                                  </div>
                                  <div className="text-[10px] text-[#6F7978]">{match.playersB}</div>
                                </div>
                                <span className={`text-base font-black font-mono px-2.5 py-1 rounded-lg ${
                                  match.winner === 'B' ? 'bg-[#006A6A] text-white' : 'bg-[#F6FAF9] text-[#191C1C] border border-[#D8DFDE]'
                                }`}>
                                  {match.scoreB}
                                </span>
                              </div>
                            </div>

                            {match.setDetail && (
                              <div className="mt-3 pt-2 border-t border-[#D8DFDE] flex items-center justify-between text-[11px] text-[#6F7978]">
                                <span>Rincian Set / Game:</span>
                                <span className="font-mono font-semibold text-[#006A6A]">{match.setDetail}</span>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* TAB CONTENT 4: BRACKET KNOCK OUT */}
                {tournamentSubTab === 'bracket' && (
                  <div
                    ref={bracketRef}
                    className={`space-y-6 animate-in fade-in duration-200 ${
                      isBracketFullscreen
                        ? 'fixed inset-0 z-50 overflow-y-auto bg-[#F6FAF9] p-6 sm:p-10 shadow-2xl'
                        : ''
                    }`}
                  >
                    {/* Full Screen Top Banner for Bracket */}
                    {isBracketFullscreen && (
                      <div className="bg-[#191C1C] text-white px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-2.5 text-xs">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="font-mono font-bold tracking-wider uppercase text-emerald-300">
                            Mode Layar Penuh: Bagan Sistem Gugur (Knockout Bracket Tree)
                          </span>
                          <span className="text-neutral-400 hidden sm:inline">
                            · Tekan tombol [Esc] pada keyboard atau tombol merah untuk keluar
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleBracketFullscreen}
                          className="px-3.5 py-1.5 rounded-xl bg-[#BA1A1A] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Keluar Full Screen</span>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-[#191C1C] flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#006A6A]" />
                          <span>Bagan Sistem Gugur (Knockout Bracket Tree)</span>
                        </h4>
                        <p className="text-xs text-[#6F7978] mt-0.5">
                          Visual bagan playoff resmi untuk menentukan sang juara.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Tombol Ubah Bracket untuk Super Admin */}
                        <button
                          type="button"
                          onClick={() => {
                            setShowAdminPortal(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#006A6A]/10 hover:bg-[#006A6A] text-[#006A6A] hover:text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer border border-[#006A6A]/20"
                          title="Masuk sebagai Super Admin untuk mengisi atau mengubah tim dan skor bagan sistem gugur"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Ubah Bracket (Super Admin)</span>
                        </button>

                        {/* Tombol Full Screen Bagan */}
                        <button
                          type="button"
                          onClick={toggleBracketFullscreen}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                            isBracketFullscreen
                              ? 'bg-[#BA1A1A] hover:bg-red-700 text-white'
                              : 'bg-white hover:bg-[#EEF4F3] border border-[#D8DFDE] text-[#191C1C] hover:text-[#006A6A]'
                          }`}
                          title={isBracketFullscreen ? 'Keluar Mode Layar Penuh (Esc)' : 'Buka bagan sistem gugur ini dalam mode Layar Penuh (Full Screen)'}
                        >
                          {isBracketFullscreen ? (
                            <>
                              <Minimize2 className="w-3.5 h-3.5" />
                              <span>Keluar Full Screen</span>
                            </>
                          ) : (
                            <>
                              <Maximize2 className="w-3.5 h-3.5 text-[#006A6A]" />
                              <span>Full Screen</span>
                            </>
                          )}
                        </button>

                        <span className="text-xs font-mono text-[#006A6A] bg-[#EEF4F3] px-3 py-1 rounded-lg font-bold border border-[#D8DFDE]">
                          Official Draw
                        </span>
                      </div>
                    </div>

                    {/* Render X-Scrollable Knockout Bracket Visualizer matching tournament screenshot & theme colors */}
                    <KnockoutBracketVisualizer
                      roundOf16={liveKnockoutBracket.roundOf16}
                      quarters={liveKnockoutBracket.quarters}
                      semis={liveKnockoutBracket.semis}
                      grandFinal={liveKnockoutBracket.grandFinal}
                      bronzeMatch={liveKnockoutBracket.bronzeMatch}
                      tournamentName={activeTourney.name}
                    />
                  </div>
                )}

                {/* TAB CONTENT 5: KLASEMEN GRUP */}
                {tournamentSubTab === 'klasemen' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-bold text-[#191C1C] flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#006A6A]" />
                          <span>Klasemen Pool & Sistem Gugur</span>
                        </h4>
                        <p className="text-xs text-[#6F7978] mt-0.5">
                          Top 2 dari setiap Pool otomatis lolos ke Babak Playoff (Knockout Draw).
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                        {activeTourney.groupStandings.pools.map((p) => (
                          <button
                            key={p}
                            onClick={() => setPoolFilter(p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                              poolFilter === p
                                ? 'bg-[#006A6A] text-white shadow-xs'
                                : 'bg-[#F6FAF9] text-[#6F7978] hover:text-[#191C1C] border border-[#D8DFDE]'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Standings Table */}
                    <div className="overflow-x-auto rounded-2xl border border-[#D8DFDE]">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#EEF4F3] border-b border-[#D8DFDE] text-[#6F7978] font-mono text-[11px] uppercase">
                            <th className="py-3 px-3.5 text-center">Pos</th>
                            <th className="py-3 px-4">Pasangan Pemain</th>
                            <th className="py-3 px-3 text-center">Pool</th>
                            <th className="py-3 px-3 text-center">Main</th>
                            <th className="py-3 px-3 text-center">Menang</th>
                            <th className="py-3 px-3 text-center">Kalah</th>
                            <th className="py-3 px-3 text-center">Selisih Game</th>
                            <th className="py-3 px-4 text-right">Poin</th>
                            <th className="py-3 px-3 text-center">Kualifikasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8DFDE] bg-white">
                          {activeTourney.groupStandings.standings
                            .filter((t) => poolFilter === 'Semua Pool' || t.pool === poolFilter)
                            .map((team, idx) => (
                              <tr key={team.id} className="hover:bg-[#F6FAF9] transition-colors">
                                <td className="py-3 px-3.5 text-center font-mono font-bold text-[#191C1C]">
                                  <span
                                    className={`inline-block w-6 h-6 text-center leading-6 rounded-md ${
                                      team.isQualified
                                        ? 'bg-[#006A6A] text-white'
                                        : 'bg-[#EEF4F3] text-[#6F7978]'
                                    }`}
                                  >
                                    {team.pos}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={lookupPlayerPhoto(team.name || team.p1)}
                                      alt={team.name}
                                      className="w-7 h-7 rounded-full object-cover border border-[#D8DFDE] shadow-2xs shrink-0"
                                    />
                                    <div>
                                      <div className="font-bold text-[#191C1C] text-sm">{team.name}</div>
                                      <div className="text-[11px] text-[#6F7978]">{team.p1} / {team.p2}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-[#6F7978]">{team.pool}</td>
                                <td className="py-3 px-3 text-center font-mono text-[#191C1C]">{team.played}</td>
                                <td className="py-3 px-3 text-center font-mono text-[#191C1C] font-semibold">{team.won}</td>
                                <td className="py-3 px-3 text-center font-mono text-[#6F7978]">{team.lost}</td>
                                <td className="py-3 px-3 text-center font-mono text-[#006A6A] font-bold">
                                  {team.gameDiff > 0 ? `+${team.gameDiff}` : team.gameDiff}
                                </td>
                                <td className="py-3 px-4 text-right font-mono font-black text-[#191C1C] text-sm">
                                  {team.points}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {team.isQualified ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      ✓ Lolos Playoff
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-[#6F7978] font-mono">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="text-xs text-[#6F7978] font-mono bg-[#F6FAF9] p-3 rounded-xl border border-[#D8DFDE] flex items-center justify-between flex-wrap gap-2">
                      <span>Aturan Klasemen: Win = 2 Pts, Loss = 0 Pts · Tiebreaker: Head to Head lalu Selisih Game</span>
                      <span className="text-[#006A6A] font-bold">Golden Point Active di Deuce (40-40)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Back Button */}
              <div className="pt-4 pb-8 flex justify-center">
                <button
                  onClick={() => {
                    setOpenedTournamentId(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white hover:bg-[#EEF4F3] border border-[#D8DFDE] text-[#006A6A] text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Halaman Awal Turnamen</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: HALL OF FAME */}
      {activeTab === 'halloffame' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 space-y-10">
          <div>
            <div className="flex items-center gap-2 text-2xl font-black text-[#191C1C] font-display">
              <Medal className="w-6 h-6 text-[#6E4D8B]" />
              <span>Hall of Fame LagiLagiPadel</span>
            </div>
            <p className="text-sm text-[#3D5A57] mt-1">
              Juara & podium turnamen yang sudah selesai di Indonesia.
            </p>
          </div>

          {/* Section: Cari Pemain */}
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#191C1C] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#006A6A]" />
                <span>Cari Pemain</span>
              </h3>
              <p className="text-xs text-[#6F7978] mt-0.5">
                Cek riwayat & prestasi pemain dari turnamen-turnamen yang sudah direkap.
              </p>
            </div>

            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#6F7978] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nama pemain (misal: Kartika, Rico, Olivia)..."
                value={playerSearchQuery}
                onChange={(e) => setPlayerSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D8DFDE] text-xs text-[#191C1C] placeholder-[#6F7978] focus:outline-none focus:border-[#006A6A]"
              />
            </div>

            {/* Players Roster Cards */}
            {hallOfFamePlayers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#D8DFDE] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#006A6A]/10 text-[#006A6A] flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#191C1C]">
                  {liveClubMembers.length === 0 ? 'Belum Ada Pemain di Hall of Fame' : 'Pemain Tidak Ditemukan'}
                </div>
                <p className="text-[11px] text-[#6F7978] max-w-sm mx-auto">
                  {liveClubMembers.length === 0
                    ? 'Seluruh daftar pemain dan catatan prestasi telah dikosongkan melalui Reset Default.'
                    : 'Tidak ada pemain berprestasi yang cocok dengan kata kunci pencarian.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hallOfFamePlayers.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-[#D8DFDE] space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Player Photo Uploaded by Admin */}
                      <img
                        src={p.photoUrl || lookupPlayerPhoto(p.name)}
                        alt={p.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm ring-1 ring-[#D8DFDE] shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-[#006A6A] bg-[#006A6A]/10 px-2 py-0.5 rounded-md">
                            {p.id}
                          </span>
                          {p.isGroupQualified && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 rounded-md">
                              ✓ Lolos Fase Grup
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-[#191C1C] truncate mt-1">
                          {p.name}
                        </h4>
                        <p className="text-xs text-[#3D5A57] truncate">
                          Partner: {p.achievements?.partnerDefault || '-'} · <span className="font-mono text-[#006A6A] font-bold">NTRP {p.rating}</span>
                        </p>
                      </div>

                      {/* Medals */}
                      <div className="flex items-center gap-1 font-mono text-xs shrink-0">
                        {(p.achievements?.gold || 0) > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-[#6E4D8B]/15 text-[#6E4D8B] border border-[#6E4D8B]/30 font-bold" title="Juara 1 Emas">
                            🥇 {p.achievements.gold}
                          </span>
                        )}
                        {(p.achievements?.silver || 0) > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-[#006A6A]/10 text-[#006A6A] border border-[#006A6A]/30 font-bold" title="Juara 2 Perak">
                            🥈 {p.achievements.silver}
                          </span>
                        )}
                        {(p.achievements?.bronze || 0) > 0 && (
                          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 border border-orange-300 font-bold" title="Juara 3 Perunggu">
                            🥉 {p.achievements.bronze}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-[#6F7978] pt-2 border-t border-[#D8DFDE] flex items-center justify-between">
                      <span className="truncate">
                        <span className="font-semibold text-[#191C1C]">Klub: </span>
                        {p.club} ({p.city})
                      </span>
                      <span className="text-[10px] text-[#006A6A] font-semibold shrink-0 font-mono">
                        {p.achievements?.tournaments?.length || 1} Turnamen
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Cari Turnamen */}
          <div className="space-y-4 pt-6 border-t border-[#D8DFDE]">
            <div>
              <h3 className="text-base font-bold text-[#191C1C] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#6E4D8B]" />
                <span>Cari Turnamen & Podium Juara</span>
              </h3>
              <p className="text-xs text-[#6F7978] mt-0.5">
                Ketik nama turnamen untuk melihat daftar juara 1, 2, dan 3 per kategori.
              </p>
            </div>

            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-[#6F7978] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nama turnamen (misal: Rookie, HDMC, F3)..."
                value={tournamentSearchQuery}
                onChange={(e) => setTournamentSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#D8DFDE] text-xs text-[#191C1C] placeholder-[#6F7978] focus:outline-none focus:border-[#006A6A]"
              />
            </div>

            {finishedTournaments.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#D8DFDE] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#6E4D8B]/10 text-[#6E4D8B] flex items-center justify-center mx-auto">
                  <Trophy className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#191C1C]">
                  {storedTournaments.length === 0 ? 'Belum Ada Rekap Turnamen Selesai' : 'Turnamen Tidak Ditemukan'}
                </div>
                <p className="text-[11px] text-[#6F7978] max-w-sm mx-auto">
                  {storedTournaments.length === 0
                    ? 'Seluruh rekapitulasi podium juara dan turnamen telah dikosongkan melalui Reset Default.'
                    : 'Tidak ada rekap turnamen yang cocok dengan kata kunci pencarian.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {finishedTournaments.map((t) => {
                  const podium = t.winners?.podium || [];
                  const gold = podium.find((p) => p.place === '1');
                  const silver = podium.find((p) => p.place === '2');
                  const bronze = podium.find((p) => p.place === '3');

                  return (
                    <div key={t.id} className="p-5 rounded-2xl bg-white border border-[#D8DFDE] space-y-4 shadow-xs">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <div className="font-bold text-[#191C1C] text-sm">
                            {t.name}
                          </div>
                          <div className="text-[11px] text-[#6F7978]">
                            {t.organizer} · {t.location} · {t.date}
                          </div>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#006A6A]/10 text-[#006A6A] border border-[#006A6A]/30">
                          ✓ REKAP PODIUM
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-[#6E4D8B]/10 border border-[#6E4D8B]/30 space-y-1">
                          <span className="text-[#6E4D8B] font-bold block">🥇 JUARA 1 (GOLD)</span>
                          <span className="font-bold text-[#191C1C] block uppercase truncate">
                            {gold ? gold.teamName || `${gold.p1} / ${gold.p2}` : 'TBD'}
                          </span>
                          <span className="text-[11px] text-[#3D5A57] block truncate">
                            {gold?.prize || 'Piala & Hadiah'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#006A6A]/10 border border-[#006A6A]/30 space-y-1">
                          <span className="text-[#006A6A] font-bold block">🥈 JUARA 2 (SILVER)</span>
                          <span className="font-bold text-[#191C1C] block uppercase truncate">
                            {silver ? silver.teamName || `${silver.p1} / ${silver.p2}` : 'TBD'}
                          </span>
                          <span className="text-[11px] text-[#3D5A57] block truncate">
                            {silver?.prize || 'Piala & Hadiah'}
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] space-y-1">
                          <span className="text-[#3D5A57] font-bold block">🥉 JUARA 3 (BRONZE)</span>
                          <span className="font-bold text-[#191C1C] block uppercase truncate">
                            {bronze ? bronze.teamName || `${bronze.p1} / ${bronze.p2}` : 'TBD'}
                          </span>
                          <span className="text-[11px] text-[#6F7978] block truncate">
                            {bronze?.prize || 'Medali Perunggu'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
