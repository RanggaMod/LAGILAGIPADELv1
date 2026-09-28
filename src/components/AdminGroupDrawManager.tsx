import React, { useState, useEffect } from 'react';
import {
  Shuffle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  Users,
  ShieldCheck,
  ChevronDown,
  Trash2,
  Plus,
  ArrowRight,
  RefreshCw,
  Trophy,
  Save,
  AlertCircle
} from 'lucide-react';
import {
  PoolGroupData,
  GroupTeamItem,
  getStoredTournamentGroups,
  saveStoredTournamentGroups,
  randomizeTeamsToPools,
  resetStoredTournamentGroups
} from '../data/tournamentGroupStorage';
import { PADEL_TOURNAMENTS_DATA } from '../data/padelProTournamentsData';
import { getStoredTournaments } from '../data/tournamentStorage';
import { getStoredMembers, lookupPlayerPhoto } from '../data/clubMembersStorage';

interface AdminGroupDrawManagerProps {
  initialTournamentId?: string;
  onGroupsSaved?: () => void;
}

export const AdminGroupDrawManager: React.FC<AdminGroupDrawManagerProps> = ({
  initialTournamentId = 'rookie-mix',
  onGroupsSaved
}) => {
  const [tournaments, setTournaments] = useState(() => getStoredTournaments());
  const [selectedTourneyId, setSelectedTourneyId] = useState<string>(initialTournamentId);
  const [poolsData, setPoolsData] = useState<PoolGroupData[]>(() =>
    getStoredTournamentGroups(initialTournamentId)
  );

  // Sync if initialTournamentId prop changes
  useEffect(() => {
    if (initialTournamentId) {
      setSelectedTourneyId(initialTournamentId);
    }
  }, [initialTournamentId]);

  // Reactive listener for tournament creation/edit/deletion and members update
  useEffect(() => {
    const handleTournamentsUpdate = () => {
      const updated = getStoredTournaments();
      setTournaments(updated);
      if (!updated.some((t) => t.id === selectedTourneyId)) {
        setSelectedTourneyId(updated.length > 0 ? updated[0].id : '');
      }
    };
    const handleGroupsUpdate = () => {
      if (selectedTourneyId) {
        setPoolsData(getStoredTournamentGroups(selectedTourneyId));
      } else {
        setPoolsData([]);
      }
    };
    window.addEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdate);
    window.addEventListener('lagilagipadel_members_updated', handleGroupsUpdate);
    window.addEventListener('lagilagipadel_groups_updated', handleGroupsUpdate);
    return () => {
      window.removeEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdate);
      window.removeEventListener('lagilagipadel_members_updated', handleGroupsUpdate);
      window.removeEventListener('lagilagipadel_groups_updated', handleGroupsUpdate);
    };
  }, [selectedTourneyId]);

  // Available pools list
  const [targetPools, setTargetPools] = useState<string[]>(['Pool A', 'Pool B', 'Pool C', 'Pool D']);

  // Selection of teams to randomize
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([]);

  // Randomize preview state
  const [randomizedPreview, setRandomizedPreview] = useState<PoolGroupData[] | null>(null);
  const [randomIteration, setRandomIteration] = useState<number>(0);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load tournament pools when tournament changes
  useEffect(() => {
    const data = getStoredTournamentGroups(selectedTourneyId);
    setPoolsData(data);
    const names = data.map((p) => p.poolName);
    if (names.length > 0) {
      setTargetPools(names);
    }
    // Select all teams by default
    const allIds: string[] = [];
    data.forEach((p) => p.teams.forEach((t) => allIds.push(t.id)));
    setSelectedTeamIds(allIds);
    setRandomizedPreview(null);
  }, [selectedTourneyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Extract all teams across all pools
  const allTeams: GroupTeamItem[] = [];
  poolsData.forEach((p) => {
    p.teams.forEach((t) => allTeams.push(t));
  });

  // Toggle selection for individual team
  const toggleSelectTeam = (teamId: string) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTeamIds(allTeams.map((t) => t.id));
  };

  const handleDeselectAll = () => {
    setSelectedTeamIds([]);
  };

  // 1. Generate Random Draw for the selected teams
  const handleGenerateRandomDraw = () => {
    const teamsToRandomize = allTeams.filter((t) => selectedTeamIds.includes(t.id));

    if (teamsToRandomize.length === 0) {
      alert('Pilih minimal 2 pemain / pasangan terlebih dahulu untuk diacak ke dalam grup.');
      return;
    }

    if (targetPools.length === 0) {
      alert('Harap tentukan minimal 1 Pool / Grup tujuan.');
      return;
    }

    const preview = randomizeTeamsToPools(teamsToRandomize, targetPools);

    // If there are unselected teams, keep them in their original or unassigned pool
    const unselectedTeams = allTeams.filter((t) => !selectedTeamIds.includes(t.id));
    if (unselectedTeams.length > 0) {
      unselectedTeams.forEach((t, i) => {
        const pIdx = i % targetPools.length;
        preview[pIdx].teams.push(t);
      });
    }

    setRandomizedPreview(preview);
    setRandomIteration((prev) => prev + 1);
    showToast(`Undian acak ke-${randomIteration + 1} berhasil dibuat! Tinjau hasil di bawah.`);
  };

  // 2. Generate another fresh random draw (Kocok Ulang / Buat Acakan Baru)
  const handleRegenerateRandomDraw = () => {
    handleGenerateRandomDraw();
  };

  // 3. Apply and Save the randomized groups (Terapkan Hasil Acakan)
  const handleApplyRandomDraw = () => {
    if (!randomizedPreview) return;

    saveStoredTournamentGroups(selectedTourneyId, randomizedPreview);
    setPoolsData(randomizedPreview);
    setRandomizedPreview(null);
    showToast(
      'Hasil undian acak grup berhasil diterapkan dan disimpan! Halaman tamu otomatis diperbarui.',
    );
    if (onGroupsSaved) onGroupsSaved();
  };

  // Cancel preview
  const handleCancelPreview = () => {
    setRandomizedPreview(null);
    showToast('Pratinjau acakan dibatalkan.');
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (window.confirm('Kembalikan susunan grup turnamen ini ke pembagian default?')) {
      const def = resetStoredTournamentGroups(selectedTourneyId);
      setPoolsData(def);
      setRandomizedPreview(null);
      showToast('Susunan grup dikembalikan ke data awal.');
      if (onGroupsSaved) onGroupsSaved();
    }
  };

  // Manual Move Team to Another Pool
  const handleMoveTeam = (teamId: string, targetPoolName: string) => {
    const current = randomizedPreview || poolsData;
    let movedTeam: GroupTeamItem | null = null;

    const newPools = current.map((p) => {
      const match = p.teams.find((t) => t.id === teamId);
      if (match) {
        movedTeam = { ...match, pool: targetPoolName };
        return {
          ...p,
          teams: p.teams.filter((t) => t.id !== teamId)
        };
      }
      return p;
    });

    if (movedTeam) {
      const targetPool = newPools.find((p) => p.poolName === targetPoolName);
      if (targetPool) {
        targetPool.teams.push(movedTeam);
      }
    }

    if (randomizedPreview) {
      setRandomizedPreview(newPools);
    } else {
      setPoolsData(newPools);
      saveStoredTournamentGroups(selectedTourneyId, newPools);
      if (onGroupsSaved) onGroupsSaved();
    }
    showToast(`Tim berhasil dipindahkan ke ${targetPoolName}!`);
  };

  const displayData = randomizedPreview || poolsData;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs font-bold text-emerald-700 underline"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Admin Controller Box */}
      <div className="p-6 rounded-3xl bg-white border border-[#D8DFDE] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#006A6A]/10 text-[#006A6A] font-mono font-bold text-[10px] uppercase">
                ADMIN GROUP & DRAW SYSTEM
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-[10px]">
                LIVE RE-SHUFFLE ACTIVE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#191C1C] font-display flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#006A6A]" />
              <span>Penerapan Pemain ke Grup & Undian Acak (Group Randomizer)</span>
            </h2>
            <p className="text-xs text-[#6F7978]">
              Terapkan pemain ke dalam Pool atau lakukan pengacakan undian otomatis secara adil ke grup turnamen.
            </p>
          </div>

          {/* Tournament Selection Dropdown */}
          <div className="space-y-1 shrink-0">
            <label className="block text-[11px] font-mono text-[#3D5A57] font-bold uppercase">
              Pilih Turnamen:
            </label>
            <select
              value={selectedTourneyId}
              onChange={(e) => setSelectedTourneyId(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] text-xs font-bold text-[#191C1C] focus:outline-none focus:border-[#006A6A] cursor-pointer"
            >
              {tournaments.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.location}) · [{t.status}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TEAM SELECTION & RANDOMIZER ACTION SECTION */}
        <div className="p-5 rounded-2xl bg-[#F6FAF9] border border-[#D8DFDE] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-mono font-bold text-[#191C1C] uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#006A6A]" />
                <span>Pilih Pemain yang Akan Diundi / Diacak ({selectedTeamIds.length} dari {allTeams.length} Terpilih)</span>
              </h4>
              <p className="text-[11px] text-[#6F7978]">
                Centang pemain yang ingin Anda acak ke grup, lalu tekan tombol acak grup.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D8DFDE] text-xs font-semibold text-[#191C1C] hover:bg-[#EEF4F3] cursor-pointer"
              >
                Pilih Semua
              </button>
              <button
                type="button"
                onClick={handleDeselectAll}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#D8DFDE] text-xs font-semibold text-[#6F7978] hover:bg-[#EEF4F3] cursor-pointer"
              >
                Batal Pilih
              </button>
            </div>
          </div>

          {/* Quick Select Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-2 bg-white rounded-xl border border-[#D8DFDE]">
            {allTeams.map((team) => {
              const isSelected = selectedTeamIds.includes(team.id);
              const p1Photo = lookupPlayerPhoto(team.p1);
              return (
                <div
                  key={team.id}
                  onClick={() => toggleSelectTeam(team.id)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EEF4F3] border-[#006A6A] ring-1 ring-[#006A6A]/30 text-[#006A6A]'
                      : 'bg-white border-[#D8DFDE] text-[#6F7978] opacity-70 hover:opacity-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 rounded text-[#006A6A] focus:ring-0 cursor-pointer pointer-events-none"
                  />
                  <img
                    src={p1Photo}
                    alt={team.p1}
                    className="w-7 h-7 rounded-lg object-cover border border-[#D8DFDE]"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold truncate text-[#191C1C]">{team.name}</div>
                    <div className="text-[9px] text-[#6F7978] truncate">{team.pool || 'Tanpa Grup'}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTION BUTTON: ACAK PEMAIN KE GRUP */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#D8DFDE]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#6F7978]">Pool Tujuan:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {targetPools.map((p) => (
                  <span
                    key={p}
                    className="px-2.5 py-0.5 rounded-md bg-white border border-[#D8DFDE] text-[11px] font-bold text-[#006A6A] font-mono"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateRandomDraw}
              className="px-5 py-2.5 rounded-xl bg-[#006A6A] hover:bg-[#007A7C] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Shuffle className="w-4 h-4 animate-spin-reverse" />
              <span>Acak Pemain ke Grup (Kocok Undian Otomatis)</span>
            </button>
          </div>
        </div>

        {/* RANDOMIZED PREVIEW BANNER & BUTTONS AS REQUESTED */}
        {randomizedPreview && (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-md space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center font-black">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-900 font-mono tracking-wider">
                      Pratinjau Hasil Undian Acak (Acakan #{randomIteration})
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                      BELUM DITERAPKAN
                    </span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Pemain telah diacak secara merata ke dalam {targetPools.length} pool. Pilih tombol di bawah untuk menerapkan atau mengocok ulang.
                  </p>
                </div>
              </div>

              {/* TWO CORE BUTTONS REQUESTED BY USER */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* 1. TERAPKAN HASIL ACAKAN */}
                <button
                  type="button"
                  onClick={handleApplyRandomDraw}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Terapkan Hasil Acakan Ini ✓</span>
                </button>

                {/* 2. BUAT ACAKAN BARU (KOCOK ULANG) */}
                <button
                  type="button"
                  onClick={handleRegenerateRandomDraw}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Buat Acakan Baru (Kocok Ulang)</span>
                </button>

                {/* BATALKAN */}
                <button
                  type="button"
                  onClick={handleCancelPreview}
                  className="px-3 py-2.5 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold cursor-pointer"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POOL GROUPS DISPLAY GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#191C1C] flex items-center gap-2">
              <span>Susunan Grup Turnamen</span>
              {randomizedPreview ? (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono text-[10px] font-bold border border-amber-300">
                  Pratinjau Hasil Acakan
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
                  Aktif di Halaman Tamu
                </span>
              )}
            </h3>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs font-semibold text-[#6F7978] hover:text-[#BA1A1A] transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Susunan Grup Default</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayData.map((poolGroup) => (
              <div
                key={poolGroup.poolName}
                className="p-5 rounded-2xl bg-white border border-[#D8DFDE] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#D8DFDE]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#006A6A]" />
                    <h4 className="text-sm font-black text-[#191C1C] font-display">
                      {poolGroup.poolName}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#006A6A] bg-[#EEF4F3] px-2.5 py-0.5 rounded-lg border border-[#D8DFDE]">
                    {poolGroup.teams.length} Tim
                  </span>
                </div>

                <div className="space-y-2">
                  {poolGroup.teams.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#6F7978] italic">
                      Belum ada tim di {poolGroup.poolName}.
                    </div>
                  ) : (
                    poolGroup.teams.map((team, idx) => {
                      const p1Photo = lookupPlayerPhoto(team.p1);
                      return (
                        <div
                          key={team.id}
                          className="p-3 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] flex items-center justify-between gap-3 hover:bg-white transition-all shadow-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-[#EEF4F3] text-[#006A6A] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <img
                              src={p1Photo}
                              alt={team.p1}
                              className="w-9 h-9 rounded-xl object-cover border border-[#D8DFDE] shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-[#191C1C] truncate">
                                {team.name}
                              </div>
                              <div className="text-[10px] text-[#6F7978] truncate">
                                {team.p1} & {team.p2} · <span className="font-mono text-[#006A6A] font-bold">NTRP {team.rating || '3.0'}</span>
                              </div>
                              {team.member1Id && (
                                <div className="text-[9px] font-mono text-[#006A6A] truncate">
                                  ID: {team.member1Id}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Move to other pool dropdown */}
                          <div className="shrink-0 flex items-center gap-1.5">
                            <select
                              value={poolGroup.poolName}
                              onChange={(e) => handleMoveTeam(team.id, e.target.value)}
                              className="text-[10px] font-mono font-semibold py-1 px-2 rounded-lg bg-white border border-[#D8DFDE] text-[#3D5A57] cursor-pointer"
                              title="Pindahkan tim ini ke pool lain"
                            >
                              {targetPools.map((pName) => (
                                <option key={pName} value={pName}>
                                  Pindah ke {pName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
