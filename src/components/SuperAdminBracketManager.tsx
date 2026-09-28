import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Crown,
  Zap,
  Flame,
  CheckCircle2,
  Save,
  RotateCcw,
  Sparkles,
  Edit3,
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  Eye,
  AlertTriangle,
  X
} from 'lucide-react';
import { KnockoutMatch, PADEL_TOURNAMENTS_DATA } from '../data/padelProTournamentsData';
import { getStoredTournaments } from '../data/tournamentStorage';
import {
  KnockoutBracketData,
  getStoredBracket,
  saveStoredBracket,
  resetStoredBracket
} from '../data/bracketStorage';
import { KnockoutBracketVisualizer } from './KnockoutBracketVisualizer';

interface SuperAdminBracketManagerProps {
  initialTournamentId?: string;
  onBracketSaved?: () => void;
}

export const SuperAdminBracketManager: React.FC<SuperAdminBracketManagerProps> = ({
  initialTournamentId = 'rookie-mix',
  onBracketSaved
}) => {
  const [tournaments, setTournaments] = useState(() => getStoredTournaments());
  const [selectedTournament, setSelectedTournament] = useState<string>(initialTournamentId);
  const [bracketData, setBracketData] = useState<KnockoutBracketData>(() =>
    getStoredBracket(initialTournamentId)
  );
  const [activeRoundTab, setActiveRoundTab] = useState<
    'all' | 'roundOf16' | 'quarters' | 'semis' | 'finals'
  >('all');
  const [editingMatch, setEditingMatch] = useState<{
    match: KnockoutMatch;
    roundType: 'roundOf16' | 'quarters' | 'semis' | 'grandFinal' | 'bronzeMatch';
    index?: number;
  } | null>(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  // Sync when initialTournamentId prop changes
  useEffect(() => {
    if (initialTournamentId) {
      setSelectedTournament(initialTournamentId);
    }
  }, [initialTournamentId]);

  // Reactive listener for tournament updates
  useEffect(() => {
    const handleTournamentsUpdate = () => {
      const updated = getStoredTournaments();
      setTournaments(updated);
      if (!updated.some((t) => t.id === selectedTournament)) {
        setSelectedTournament(updated.length > 0 ? updated[0].id : '');
      }
    };
    window.addEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdate);
    return () => window.removeEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdate);
  }, [selectedTournament]);

  // Sync when tournament changes
  useEffect(() => {
    const data = getStoredBracket(selectedTournament);
    setBracketData(data);
  }, [selectedTournament]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Save changes to localStorage & trigger global update event
  const handleSaveAll = () => {
    saveStoredBracket(selectedTournament, bracketData);
    showToast(
      'Bagan sistem gugur (Knockout Bracket) berhasil disimpan dan diperbarui langsung ke halaman tamu!',
      'success'
    );
    if (onBracketSaved) onBracketSaved();
  };

  // Reset to original factory tournament bracket
  const handleResetBracket = () => {
    const defaultData = resetStoredBracket(selectedTournament);
    setBracketData(defaultData);
    showToast('Bagan sistem gugur berhasil dikembalikan ke data awal turnamen.', 'info');
    if (onBracketSaved) onBracketSaved();
  };

  // Smart Auto-Advance: Takes winners of each round and seeds them to subsequent rounds
  const handleAutoAdvance = () => {
    const updated: KnockoutBracketData = JSON.parse(JSON.stringify(bracketData));
    let advancedCount = 0;

    // 1. Advance R16 winners to Quarters
    if (updated.roundOf16 && updated.roundOf16.length === 8 && updated.quarters.length >= 4) {
      // QF1: R16-1 vs R16-2
      const w1 = updated.roundOf16[0].team1.isWinner
        ? updated.roundOf16[0].team1
        : updated.roundOf16[0].team2;
      const w2 = updated.roundOf16[1].team1.isWinner
        ? updated.roundOf16[1].team1
        : updated.roundOf16[1].team2;
      if (w1.name && w1.score) {
        updated.quarters[0].team1.name = w1.name;
        updated.quarters[0].team1.players = w1.players;
      }
      if (w2.name && w2.score) {
        updated.quarters[0].team2.name = w2.name;
        updated.quarters[0].team2.players = w2.players;
      }

      // QF2: R16-3 vs R16-4
      const w3 = updated.roundOf16[2].team1.isWinner
        ? updated.roundOf16[2].team1
        : updated.roundOf16[2].team2;
      const w4 = updated.roundOf16[3].team1.isWinner
        ? updated.roundOf16[3].team1
        : updated.roundOf16[3].team2;
      if (w3.name && w3.score) {
        updated.quarters[1].team1.name = w3.name;
        updated.quarters[1].team1.players = w3.players;
      }
      if (w4.name && w4.score) {
        updated.quarters[1].team2.name = w4.name;
        updated.quarters[1].team2.players = w4.players;
      }

      // QF3: R16-5 vs R16-6
      const w5 = updated.roundOf16[4].team1.isWinner
        ? updated.roundOf16[4].team1
        : updated.roundOf16[4].team2;
      const w6 = updated.roundOf16[5].team1.isWinner
        ? updated.roundOf16[5].team1
        : updated.roundOf16[5].team2;
      if (w5.name && w5.score) {
        updated.quarters[2].team1.name = w5.name;
        updated.quarters[2].team1.players = w5.players;
      }
      if (w6.name && w6.score) {
        updated.quarters[2].team2.name = w6.name;
        updated.quarters[2].team2.players = w6.players;
      }

      // QF4: R16-7 vs R16-8
      const w7 = updated.roundOf16[6].team1.isWinner
        ? updated.roundOf16[6].team1
        : updated.roundOf16[6].team2;
      const w8 = updated.roundOf16[7].team1.isWinner
        ? updated.roundOf16[7].team1
        : updated.roundOf16[7].team2;
      if (w7.name && w7.score) {
        updated.quarters[3].team1.name = w7.name;
        updated.quarters[3].team1.players = w7.players;
      }
      if (w8.name && w8.score) {
        updated.quarters[3].team2.name = w8.name;
        updated.quarters[3].team2.players = w8.players;
      }
      advancedCount += 8;
    }

    // 2. Advance Quarters winners to Semis
    if (updated.quarters && updated.quarters.length >= 4 && updated.semis.length >= 2) {
      // SF1: QF1 vs QF2
      const qf1W = updated.quarters[0].team1.isWinner
        ? updated.quarters[0].team1
        : updated.quarters[0].team2;
      const qf2W = updated.quarters[1].team1.isWinner
        ? updated.quarters[1].team1
        : updated.quarters[1].team2;
      if (qf1W.name && qf1W.score) {
        updated.semis[0].team1.name = qf1W.name;
        updated.semis[0].team1.players = qf1W.players;
      }
      if (qf2W.name && qf2W.score) {
        updated.semis[0].team2.name = qf2W.name;
        updated.semis[0].team2.players = qf2W.players;
      }

      // SF2: QF3 vs QF4
      const qf3W = updated.quarters[2].team1.isWinner
        ? updated.quarters[2].team1
        : updated.quarters[2].team2;
      const qf4W = updated.quarters[3].team1.isWinner
        ? updated.quarters[3].team1
        : updated.quarters[3].team2;
      if (qf3W.name && qf3W.score) {
        updated.semis[1].team1.name = qf3W.name;
        updated.semis[1].team1.players = qf3W.players;
      }
      if (qf4W.name && qf4W.score) {
        updated.semis[1].team2.name = qf4W.name;
        updated.semis[1].team2.players = qf4W.players;
      }
      advancedCount += 4;
    }

    // 3. Advance Semis to Grand Final and Bronze Match
    if (updated.semis && updated.semis.length >= 2) {
      const sf1Winner = updated.semis[0].team1.isWinner
        ? updated.semis[0].team1
        : updated.semis[0].team2;
      const sf1Loser = updated.semis[0].team1.isWinner
        ? updated.semis[0].team2
        : updated.semis[0].team1;

      const sf2Winner = updated.semis[1].team1.isWinner
        ? updated.semis[1].team1
        : updated.semis[1].team2;
      const sf2Loser = updated.semis[1].team1.isWinner
        ? updated.semis[1].team2
        : updated.semis[1].team1;

      // Grand Final
      if (sf1Winner.name && sf1Winner.score) {
        updated.grandFinal.team1.name = sf1Winner.name;
        updated.grandFinal.team1.players = sf1Winner.players;
      }
      if (sf2Winner.name && sf2Winner.score) {
        updated.grandFinal.team2.name = sf2Winner.name;
        updated.grandFinal.team2.players = sf2Winner.players;
      }

      // Bronze Match
      if (updated.bronzeMatch) {
        if (sf1Loser.name) {
          updated.bronzeMatch.team1.name = sf1Loser.name;
          updated.bronzeMatch.team1.players = sf1Loser.players;
        }
        if (sf2Loser.name) {
          updated.bronzeMatch.team2.name = sf2Loser.name;
          updated.bronzeMatch.team2.players = sf2Loser.players;
        }
      }
      advancedCount += 4;
    }

    setBracketData(updated);
    saveStoredBracket(selectedTournament, updated);
    showToast(
      `Otomatisasi berhasil! ${advancedCount} tim pemenang telah dimajukan ke babak berikutnya dan disimpan.`,
      'success'
    );
  };

  // Open Edit Modal for a match
  const handleOpenEditMatch = (
    match: KnockoutMatch,
    roundType: 'roundOf16' | 'quarters' | 'semis' | 'grandFinal' | 'bronzeMatch',
    index?: number
  ) => {
    setEditingMatch({
      match: JSON.parse(JSON.stringify(match)),
      roundType,
      index
    });
  };

  // Apply single match edit to the state
  const handleSaveMatchEdit = () => {
    if (!editingMatch) return;
    const { match, roundType, index } = editingMatch;
    const updated: KnockoutBracketData = JSON.parse(JSON.stringify(bracketData));

    if (roundType === 'grandFinal') {
      updated.grandFinal = match;
    } else if (roundType === 'bronzeMatch') {
      updated.bronzeMatch = match;
    } else if (roundType === 'roundOf16' && updated.roundOf16 && index !== undefined) {
      updated.roundOf16[index] = match;
    } else if (roundType === 'quarters' && index !== undefined) {
      updated.quarters[index] = match;
    } else if (roundType === 'semis' && index !== undefined) {
      updated.semis[index] = match;
    }

    setBracketData(updated);
    saveStoredBracket(selectedTournament, updated);
    setEditingMatch(null);
    showToast(`Pertandingan ${match.roundTitle} berhasil diperbarui!`, 'success');
  };

  // Inline quick winner toggler
  const handleToggleWinnerInline = (
    roundType: 'roundOf16' | 'quarters' | 'semis' | 'grandFinal' | 'bronzeMatch',
    index: number | undefined,
    winnerTeam: 1 | 2
  ) => {
    const updated: KnockoutBracketData = JSON.parse(JSON.stringify(bracketData));
    let target: KnockoutMatch;

    if (roundType === 'grandFinal') {
      target = updated.grandFinal;
    } else if (roundType === 'bronzeMatch' && updated.bronzeMatch) {
      target = updated.bronzeMatch;
    } else if (roundType === 'roundOf16' && updated.roundOf16 && index !== undefined) {
      target = updated.roundOf16[index];
    } else if (roundType === 'quarters' && index !== undefined) {
      target = updated.quarters[index];
    } else if (roundType === 'semis' && index !== undefined) {
      target = updated.semis[index];
    } else {
      return;
    }

    if (winnerTeam === 1) {
      target.team1.isWinner = true;
      target.team2.isWinner = false;
    } else {
      target.team1.isWinner = false;
      target.team2.isWinner = true;
    }
    target.status = 'Selesai';

    setBracketData(updated);
    saveStoredBracket(selectedTournament, updated);
    showToast(`Pemenang ${target.roundTitle} diset ke Tim ${winnerTeam}!`, 'info');
  };

  // Helper render for quick match item card
  const renderMatchRow = (
    match: KnockoutMatch,
    roundType: 'roundOf16' | 'quarters' | 'semis' | 'grandFinal' | 'bronzeMatch',
    index?: number
  ) => {
    return (
      <div
        key={match.id || index}
        className="p-4 rounded-2xl bg-white border border-[#D8DFDE] hover:border-[#006A6A] transition-all shadow-xs space-y-3"
      >
        {/* Match Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D8DFDE]">
          <div className="flex items-center gap-2">
            <span className="bg-[#006A6A] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider">
              {match.court || 'COURT #1'}
            </span>
            <span className="text-xs font-bold font-mono text-[#191C1C]">
              {match.roundTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#006A6A] font-semibold bg-[#E6F4F2] px-2 py-0.5 rounded-md">
              🕒 {match.time || '18:00'}
            </span>
            <button
              onClick={() => handleOpenEditMatch(match, roundType, index)}
              className="px-2.5 py-1 rounded-lg bg-[#006A6A]/10 hover:bg-[#006A6A] text-[#006A6A] hover:text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Skor & Detail</span>
            </button>
          </div>
        </div>

        {/* Teams and Quick Winner Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Team 1 Card */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              match.team1.isWinner
                ? 'bg-[#E6F4F2] border-[#006A6A]/50 text-[#004F4F]'
                : 'bg-[#F6FAF9] border-[#D8DFDE] text-[#475569]'
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#191C1C] truncate">
                  {match.team1.name || 'Tim 1 (Belum Diisi)'}
                </div>
                <div className="text-[11px] text-[#6F7978] truncate">
                  {match.team1.players || '-'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-base font-black text-[#006A6A] block">
                  {match.team1.score}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase">
                {match.team1.isWinner ? '🏆 PEMENANG RESMI' : 'Tim 1'}
              </span>
              <button
                type="button"
                onClick={() => handleToggleWinnerInline(roundType, index, 1)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  match.team1.isWinner
                    ? 'bg-[#006A6A] text-white'
                    : 'bg-white border border-[#D8DFDE] hover:border-[#006A6A] text-[#191C1C]'
                }`}
              >
                {match.team1.isWinner ? '✓ Juara / Lolos' : 'Pilih Pemenang'}
              </button>
            </div>
          </div>

          {/* Team 2 Card */}
          <div
            className={`p-3 rounded-xl border transition-all ${
              match.team2.isWinner
                ? 'bg-[#E6F4F2] border-[#006A6A]/50 text-[#004F4F]'
                : 'bg-[#F6FAF9] border-[#D8DFDE] text-[#475569]'
            }`}
          >
            <div className="flex items-start justify-between gap-1">
              <div className="min-w-0">
                <div className="font-bold text-sm text-[#191C1C] truncate">
                  {match.team2.name || 'Tim 2 (Belum Diisi)'}
                </div>
                <div className="text-[11px] text-[#6F7978] truncate">
                  {match.team2.players || '-'}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-base font-black text-[#006A6A] block">
                  {match.team2.score}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between">
              <span className="text-[10px] font-mono font-semibold uppercase">
                {match.team2.isWinner ? '🏆 PEMENANG RESMI' : 'Tim 2'}
              </span>
              <button
                type="button"
                onClick={() => handleToggleWinnerInline(roundType, index, 2)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  match.team2.isWinner
                    ? 'bg-[#006A6A] text-white'
                    : 'bg-white border border-[#D8DFDE] hover:border-[#006A6A] text-[#191C1C]'
                }`}
              >
                {match.team2.isWinner ? '✓ Juara / Lolos' : 'Pilih Pemenang'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : notification.type === 'info'
              ? 'bg-teal-50 border-teal-300 text-teal-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Control Bar: Tournament Selector & Action Buttons */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8DFDE] shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                SUPER ADMIN CONTROLLER
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6F4F2] text-[#006A6A] border border-[#006A6A]/30 text-[10px] font-mono font-bold uppercase">
                THEME-MATCHED KNOCKOUT TREE
              </span>
            </div>
            <h3 className="text-xl font-black text-[#191C1C] font-display">
              Manajemen Bagan Sistem Gugur (Knockout Bracket)
            </h3>
            <p className="text-xs text-[#6F7978]">
              Kelola peserta, skor, pemenang, nomor lapangan, dan waktu pertandingan untuk setiap babak.
              Perubahan langsung tersimpan ke sistem dan dapat dilihat oleh seluruh penonton.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleAutoAdvance}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Secara otomatis memajukan tim pemenang dari Round of 16 ke QF, Semifinal, dan Grand Final"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Advance Pemenang</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-[#006A6A] hover:bg-[#007A7C] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#006A6A]/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Bracket</span>
            </button>

            <button
              type="button"
              onClick={handleResetBracket}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#191C1C] font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-[#D8DFDE]"
              title="Reset ke data awal turnamen"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Tournament & Round Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#D8DFDE]">
          <div>
            <label className="block text-[#6F7978] font-mono text-[11px] uppercase font-bold mb-1">
              Pilih Turnamen yang Dikelola:
            </label>
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#D8DFDE] bg-[#F6FAF9] text-[#191C1C] font-semibold text-xs focus:outline-none focus:border-[#006A6A]"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location}) · [{t.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[#6F7978] font-mono text-[11px] uppercase font-bold mb-1">
              Filter Tampilan Babak:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveRoundTab('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeRoundTab === 'all'
                    ? 'bg-[#006A6A] text-white shadow-xs'
                    : 'bg-[#F6FAF9] text-[#3D5A57] border border-[#D8DFDE] hover:border-[#006A6A]'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setActiveRoundTab('roundOf16')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeRoundTab === 'roundOf16'
                    ? 'bg-[#006A6A] text-white shadow-xs'
                    : 'bg-[#F6FAF9] text-[#3D5A57] border border-[#D8DFDE] hover:border-[#006A6A]'
                }`}
              >
                Round of 16 (8)
              </button>
              <button
                type="button"
                onClick={() => setActiveRoundTab('quarters')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeRoundTab === 'quarters'
                    ? 'bg-[#006A6A] text-white shadow-xs'
                    : 'bg-[#F6FAF9] text-[#3D5A57] border border-[#D8DFDE] hover:border-[#006A6A]'
                }`}
              >
                Perempat Final (4)
              </button>
              <button
                type="button"
                onClick={() => setActiveRoundTab('semis')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeRoundTab === 'semis'
                    ? 'bg-[#006A6A] text-white shadow-xs'
                    : 'bg-[#F6FAF9] text-[#3D5A57] border border-[#D8DFDE] hover:border-[#006A6A]'
                }`}
              >
                Semifinal (2)
              </button>
              <button
                type="button"
                onClick={() => setActiveRoundTab('finals')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeRoundTab === 'finals'
                    ? 'bg-[#006A6A] text-white shadow-xs'
                    : 'bg-[#F6FAF9] text-[#3D5A57] border border-[#D8DFDE] hover:border-[#006A6A]'
                }`}
              >
                Final & Juara 3 (2)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* List of Match Cards for Super Admin to Edit */}
      <div className="space-y-6">
        {/* ROUND OF 16 SECTION */}
        {(activeRoundTab === 'all' || activeRoundTab === 'roundOf16') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#191C1C] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006A6A]" />
                <span>Round of 16 (Babak 16 Besar - 8 Pertandingan)</span>
              </h4>
              <span className="text-xs text-[#6F7978] font-mono">
                {bracketData.roundOf16?.length || 8} Pertandingan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bracketData.roundOf16 && bracketData.roundOf16.length === 8
                ? bracketData.roundOf16.map((m, idx) => renderMatchRow(m, 'roundOf16', idx))
                : [0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-500"
                    >
                      Pertandingan #{idx + 1} belum terkonfigurasi.
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* QUARTER FINALS SECTION */}
        {(activeRoundTab === 'all' || activeRoundTab === 'quarters') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#191C1C] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006A6A]" />
                <span>Quarter Finals (Perempat Final - 4 Pertandingan)</span>
              </h4>
              <span className="text-xs text-[#6F7978] font-mono">
                {bracketData.quarters.length} Pertandingan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bracketData.quarters.map((m, idx) => renderMatchRow(m, 'quarters', idx))}
            </div>
          </div>
        )}

        {/* SEMI FINALS SECTION */}
        {(activeRoundTab === 'all' || activeRoundTab === 'semis') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#6E4D8B] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#6E4D8B]" />
                <span>Semi Finals (Semifinal - 2 Pertandingan)</span>
              </h4>
              <span className="text-xs text-[#6F7978] font-mono">
                {bracketData.semis.length} Pertandingan
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bracketData.semis.map((m, idx) => renderMatchRow(m, 'semis', idx))}
            </div>
          </div>
        )}

        {/* FINALS SECTION */}
        {(activeRoundTab === 'all' || activeRoundTab === 'finals') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#854D0E] flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Puncak Penentuan: Grand Final & Perebutan Juara 3</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderMatchRow(bracketData.grandFinal, 'grandFinal')}
              {bracketData.bronzeMatch && renderMatchRow(bracketData.bronzeMatch, 'bronzeMatch')}
            </div>
          </div>
        )}
      </div>

      {/* LIVE PREVIEW SECTION: Knockout Bracket Visualizer with Real-time theme styling */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8DFDE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-base font-black text-[#191C1C] flex items-center gap-2 font-display">
              <Eye className="w-4 h-4 text-[#006A6A]" />
              <span>Preview Visual Bagan Sistem Gugur (Warna Tema Resmi)</span>
            </h4>
            <p className="text-xs text-[#6F7978]">
              Inilah tampilan yang akan langsung dilihat oleh pengunjung turnamen di halaman tamu.
              Klik kartu mana pun untuk langsung membuka formulir pengeditan.
            </p>
          </div>

          <span className="text-xs font-mono text-[#006A6A] bg-[#E6F4F2] px-3 py-1 rounded-lg font-bold border border-[#006A6A]/20">
            Interactive Admin Click-to-Edit
          </span>
        </div>

        {/* Live Visualizer with theme matching */}
        <KnockoutBracketVisualizer
          roundOf16={bracketData.roundOf16}
          quarters={bracketData.quarters}
          semis={bracketData.semis}
          grandFinal={bracketData.grandFinal}
          bronzeMatch={bracketData.bronzeMatch}
          tournamentName={PADEL_TOURNAMENTS_DATA[selectedTournament]?.name}
          isAdminMode={true}
          onEditMatch={(m, rType) => {
            // Find index if array
            let idx: number | undefined = undefined;
            if (rType === 'roundOf16' && bracketData.roundOf16) {
              idx = bracketData.roundOf16.findIndex((item) => item.id === m.id);
            } else if (rType === 'quarters') {
              idx = bracketData.quarters.findIndex((item) => item.id === m.id);
            } else if (rType === 'semis') {
              idx = bracketData.semis.findIndex((item) => item.id === m.id);
            }
            handleOpenEditMatch(
              m,
              rType as 'roundOf16' | 'quarters' | 'semis' | 'grandFinal' | 'bronzeMatch',
              idx !== -1 ? idx : undefined
            );
          }}
        />
      </div>

      {/* EDIT MATCH MODAL FOR SUPER ADMIN */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="max-w-lg w-full bg-white rounded-3xl border border-[#D8DFDE] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D8DFDE]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-[#006A6A] font-bold tracking-wider">
                  Super Admin Form
                </span>
                <h4 className="text-lg font-black text-[#191C1C] font-display">
                  Edit Pertandingan: {editingMatch.match.roundTitle}
                </h4>
              </div>
              <button
                onClick={() => setEditingMatch(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Match Meta: Court, Time, Status */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#6F7978] font-mono text-[10px] uppercase font-bold mb-1">
                  Lapangan (Court):
                </label>
                <select
                  value={editingMatch.match.court}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      match: { ...editingMatch.match, court: e.target.value }
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-[#D8DFDE] bg-[#F6FAF9] font-bold text-[#191C1C]"
                >
                  <option value="COURT #1">COURT #1</option>
                  <option value="COURT #2">COURT #2</option>
                  <option value="COURT #3">COURT #3</option>
                  <option value="COURT #4">COURT #4</option>
                  <option value="COURT #5">COURT #5</option>
                  <option value="COURT #6">COURT #6</option>
                  <option value="All In Padel Court 1">All In Padel Court 1</option>
                </select>
              </div>

              <div>
                <label className="block text-[#6F7978] font-mono text-[10px] uppercase font-bold mb-1">
                  Jam Tanding:
                </label>
                <input
                  type="text"
                  value={editingMatch.match.time}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      match: { ...editingMatch.match, time: e.target.value }
                    })
                  }
                  placeholder="14:30"
                  className="w-full px-2.5 py-2 rounded-xl border border-[#D8DFDE] bg-[#F6FAF9] font-mono font-bold text-[#191C1C]"
                />
              </div>

              <div>
                <label className="block text-[#6F7978] font-mono text-[10px] uppercase font-bold mb-1">
                  Status:
                </label>
                <select
                  value={editingMatch.match.status}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      match: {
                        ...editingMatch.match,
                        status: e.target.value as 'Selesai' | 'Live' | 'Dijadwalkan'
                      }
                    })
                  }
                  className="w-full px-2.5 py-2 rounded-xl border border-[#D8DFDE] bg-[#F6FAF9] font-bold text-[#191C1C]"
                >
                  <option value="Selesai">Selesai (Finished)</option>
                  <option value="Live">Live (Sedang Main)</option>
                  <option value="Dijadwalkan">Dijadwalkan</option>
                </select>
              </div>
            </div>

            {/* Team 1 Details */}
            <div className="p-4 rounded-2xl bg-[#F6FAF9] border border-[#D8DFDE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#006A6A] uppercase">
                  Data Tim 1 (Atas):
                </span>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#191C1C] cursor-pointer">
                  <input
                    type="radio"
                    name="winner_radio"
                    checked={editingMatch.match.team1.isWinner}
                    onChange={() =>
                      setEditingMatch({
                        ...editingMatch,
                        match: {
                          ...editingMatch.match,
                          team1: { ...editingMatch.match.team1, isWinner: true },
                          team2: { ...editingMatch.match.team2, isWinner: false },
                          status: 'Selesai'
                        }
                      })
                    }
                    className="w-4 h-4 text-[#006A6A]"
                  />
                  <span>Pemenang (Winner)</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="col-span-2">
                  <label className="block text-[#6F7978] text-[10px] mb-1">Nama Pasangan Tim:</label>
                  <input
                    type="text"
                    value={editingMatch.match.team1.name}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        match: {
                          ...editingMatch.match,
                          team1: { ...editingMatch.match.team1, name: e.target.value }
                        }
                      })
                    }
                    placeholder="Contoh: Merry & Fifi"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D8DFDE] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#6F7978] text-[10px] mb-1">Skor:</label>
                  <input
                    type="text"
                    value={editingMatch.match.team1.score}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        match: {
                          ...editingMatch.match,
                          team1: { ...editingMatch.match.team1, score: e.target.value }
                        }
                      })
                    }
                    placeholder="4"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D8DFDE] bg-white font-mono font-black text-center text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6F7978] text-[10px] mb-1">Nama Pemain Detail:</label>
                <input
                  type="text"
                  value={editingMatch.match.team1.players}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      match: {
                        ...editingMatch.match,
                        team1: { ...editingMatch.match.team1, players: e.target.value }
                      }
                    })
                  }
                  placeholder="Merry / Fifi"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D8DFDE] bg-white text-xs"
                />
              </div>
            </div>

            {/* Team 2 Details */}
            <div className="p-4 rounded-2xl bg-[#F6FAF9] border border-[#D8DFDE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#006A6A] uppercase">
                  Data Tim 2 (Bawah):
                </span>
                <label className="flex items-center gap-1.5 text-xs font-bold text-[#191C1C] cursor-pointer">
                  <input
                    type="radio"
                    name="winner_radio"
                    checked={editingMatch.match.team2.isWinner}
                    onChange={() =>
                      setEditingMatch({
                        ...editingMatch,
                        match: {
                          ...editingMatch.match,
                          team1: { ...editingMatch.match.team1, isWinner: false },
                          team2: { ...editingMatch.match.team2, isWinner: true },
                          status: 'Selesai'
                        }
                      })
                    }
                    className="w-4 h-4 text-[#006A6A]"
                  />
                  <span>Pemenang (Winner)</span>
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="col-span-2">
                  <label className="block text-[#6F7978] text-[10px] mb-1">Nama Pasangan Tim:</label>
                  <input
                    type="text"
                    value={editingMatch.match.team2.name}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        match: {
                          ...editingMatch.match,
                          team2: { ...editingMatch.match.team2, name: e.target.value }
                        }
                      })
                    }
                    placeholder="Contoh: Ari & Monaria"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D8DFDE] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#6F7978] text-[10px] mb-1">Skor:</label>
                  <input
                    type="text"
                    value={editingMatch.match.team2.score}
                    onChange={(e) =>
                      setEditingMatch({
                        ...editingMatch,
                        match: {
                          ...editingMatch.match,
                          team2: { ...editingMatch.match.team2, score: e.target.value }
                        }
                      })
                    }
                    placeholder="3"
                    className="w-full px-3 py-1.5 rounded-xl border border-[#D8DFDE] bg-white font-mono font-black text-center text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6F7978] text-[10px] mb-1">Nama Pemain Detail:</label>
                <input
                  type="text"
                  value={editingMatch.match.team2.players}
                  onChange={(e) =>
                    setEditingMatch({
                      ...editingMatch,
                      match: {
                        ...editingMatch.match,
                        team2: { ...editingMatch.match.team2, players: e.target.value }
                      }
                    })
                  }
                  placeholder="Ari / Monaria"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#D8DFDE] bg-white text-xs"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMatch(null)}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveMatchEdit}
                className="px-5 py-2 rounded-xl bg-[#006A6A] hover:bg-[#007A7C] text-white text-xs font-bold transition-all shadow-md shadow-[#006A6A]/20 cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simpan Perubahan Pertandingan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
