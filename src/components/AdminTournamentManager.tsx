import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  MapPin,
  Users,
  Award,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  getStoredTournaments,
  saveTournament,
  deleteTournament,
  updateTournamentStatus,
  resetToDefaultTournaments
} from '../data/tournamentStorage';
import { clearAllSystemData, resetAllSystemDataToDefault } from '../data/systemResetStorage';
import { getStoredMembers } from '../data/clubMembersStorage';
import { FullTournamentDetail } from '../data/padelProTournamentsData';

interface AdminTournamentManagerProps {
  onOpenTournamentDetail?: (tournamentId: string) => void;
  onNavigateToBracket?: (tournamentId: string) => void;
  onNavigateToReferee?: (tournamentId: string) => void;
}

export const AdminTournamentManager: React.FC<AdminTournamentManagerProps> = ({
  onOpenTournamentDetail,
  onNavigateToBracket,
  onNavigateToReferee
}) => {
  const [tournaments, setTournaments] = useState<FullTournamentDetail[]>(() =>
    getStoredTournaments()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'semua' | 'Live' | 'Akan Datang' | 'Selesai'>('semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournamentId, setEditingTournamentId] = useState<string | null>(null);
  const [tournamentToDelete, setTournamentToDelete] = useState<FullTournamentDetail | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [membersCount, setMembersCount] = useState<number>(() => getStoredMembers().length);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');
  const [formOrganizer, setFormOrganizer] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStatus, setFormStatus] = useState<'Live' | 'Akan Datang' | 'Selesai'>('Akan Datang');
  const [formCategories, setFormCategories] = useState('');
  const [formTotalCourts, setFormTotalCourts] = useState<number>(4);
  const [formTotalTeams, setFormTotalTeams] = useState<number>(32);
  const [formPrizePool, setFormPrizePool] = useState('');
  const [formRules, setFormRules] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Sync with storage events
  useEffect(() => {
    const handleTournamentsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.tournaments) {
        setTournaments(customEvent.detail.tournaments);
      } else {
        setTournaments(getStoredTournaments());
      }
    };

    const handleMembersUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.members) {
        setMembersCount(customEvent.detail.members.length);
      } else {
        setMembersCount(getStoredMembers().length);
      }
    };

    window.addEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdated);
    window.addEventListener('lagilagipadel_members_updated', handleMembersUpdated);
    return () => {
      window.removeEventListener('lagilagipadel_tournaments_updated', handleTournamentsUpdated);
      window.removeEventListener('lagilagipadel_members_updated', handleMembersUpdated);
    };
  }, []);

  // Quick Status Toggle Handler
  const handleQuickStatusChange = (
    tourney: FullTournamentDetail,
    newStatus: 'Live' | 'Akan Datang' | 'Selesai'
  ) => {
    if (tourney.status === newStatus) return;
    updateTournamentStatus(tourney.id, newStatus);
    showToast(`Status "${tourney.name}" berhasil diubah menjadi: ${newStatus}`);
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTournamentId(null);
    setFormId(`tourney-${Date.now().toString().slice(-6)}`);
    setFormName('');
    setFormOrganizer('LagiLagi Padel Solo');
    setFormLocation('Zing Padel Solo (4 Courts)');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStatus('Akan Datang');
    setFormCategories('Rookie Men, Rookie Women, Mixed Doubles');
    setFormTotalCourts(4);
    setFormTotalTeams(32);
    setFormPrizePool('Rp 20.000.000 + Trofi & Medali');
    setFormRules('Race to 4 Games · Golden Point Active · Auto Knockout Draw');
    setFormDescription('Kejuaraan padel komunitas resmi LagiLagiPadel dengan live scoring wasit dan bagan knockout terintegrasi.');
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (tourney: FullTournamentDetail) => {
    setEditingTournamentId(tourney.id);
    setFormId(tourney.id);
    setFormName(tourney.name);
    setFormOrganizer(tourney.organizer || 'MOTION');
    setFormLocation(tourney.location || 'All In Padel');
    setFormDate(tourney.date || '2026-09-06');
    setFormStatus(tourney.status || 'Akan Datang');
    setFormCategories(tourney.categories ? tourney.categories.join(', ') : 'Rookie Mix');
    setFormTotalCourts(tourney.totalCourts || 4);
    setFormTotalTeams(tourney.totalTeams || 32);
    setFormPrizePool(tourney.prizePool || 'Rp 10.000.000');
    setFormRules(tourney.rules || 'Race to 4 Games · Golden Point');
    setFormDescription(tourney.description || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Save Tournament Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formName.trim()) errors.name = 'Nama turnamen wajib diisi.';
    if (!formOrganizer.trim()) errors.organizer = 'Nama penyelenggara wajib diisi.';
    if (!formLocation.trim()) errors.location = 'Lokasi / venue wajib diisi.';
    if (!formDate.trim()) errors.date = 'Tanggal wajib diisi.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const categoriesArray = formCategories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    // Existing object if editing
    const existingTourney = editingTournamentId
      ? tournaments.find((t) => t.id === editingTournamentId)
      : null;

    const payload: FullTournamentDetail = {
      ...(existingTourney || ({} as FullTournamentDetail)),
      id: formId.trim() || `tourney-${Date.now()}`,
      name: formName.trim(),
      organizer: formOrganizer.trim(),
      location: formLocation.trim(),
      date: formDate.trim(),
      status: formStatus,
      categories: categoriesArray.length > 0 ? categoriesArray : ['Umum'],
      totalCourts: Number(formTotalCourts) || 4,
      totalTeams: Number(formTotalTeams) || 32,
      prizePool: formPrizePool.trim() || 'Trofi & Sertifikat',
      rules: formRules.trim() || 'Standar FIP / Race to 4 Games',
      description: formDescription.trim() || 'Turnamen resmi padel.',
      winners: existingTourney?.winners || {
        notes: `Turnamen ${formName} belum mencatatkan pemenang akhir.`,
        podium: []
      },
      participants: existingTourney?.participants || [],
      matches: existingTourney?.matches || [],
      knockoutBracket: existingTourney?.knockoutBracket || {
        quarters: [],
        semis: [],
        grandFinal: {
          id: 'gf-init',
          roundTitle: 'Grand Final',
          court: 'Court 1',
          time: '17:00',
          team1: { name: 'Finalis A', players: 'TBD', score: '-', isWinner: false },
          team2: { name: 'Finalis B', players: 'TBD', score: '-', isWinner: false },
          status: 'Dijadwalkan'
        }
      },
      groupStandings: existingTourney?.groupStandings || {
        pools: ['Pool A', 'Pool B'],
        standings: []
      }
    };

    saveTournament(payload);
    setIsModalOpen(false);
    showToast(
      editingTournamentId
        ? `Turnamen "${payload.name}" berhasil diperbarui!`
        : `Turnamen baru "${payload.name}" berhasil dibuat!`
    );
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (!tournamentToDelete) return;
    deleteTournament(tournamentToDelete.id);
    showToast(`Turnamen "${tournamentToDelete.name}" telah dihapus.`);
    setTournamentToDelete(null);
  };

  // Reset to default / Kosongkan data dialog
  const handleOpenResetModal = () => {
    setIsResetModalOpen(true);
  };

  // Perform Total Wipe (Kosongkan semua data)
  const handleConfirmClearAllData = () => {
    clearAllSystemData();
    setIsResetModalOpen(false);
    showToast('Seluruh data pemain, turnamen, bracket, halaman wasit & hasil skor, serta hall of fame telah berhasil dikosongkan!');
  };

  // Perform Demo Defaults Restore
  const handleConfirmRestoreDemo = () => {
    resetAllSystemDataToDefault();
    setIsResetModalOpen(false);
    showToast('Data sistem berhasil dipulihkan ke contoh turnamen dan pemain bawaan.');
  };

  // Filtered List
  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'semua' ? true : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Metric counts
  const liveCount = tournaments.filter((t) => t.status === 'Live').length;
  const upcomingCount = tournaments.filter((t) => t.status === 'Akan Datang').length;
  const completedCount = tournaments.filter((t) => t.status === 'Selesai').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl bg-white border border-[#006A6A]/30 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#006A6A] shrink-0" />
          <p className="text-xs text-[#191C1C] font-semibold leading-relaxed flex-1">
            {toastMsg}
          </p>
          <button
            onClick={() => setToastMsg(null)}
            className="text-[#6F7978] hover:text-[#191C1C] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DFDE]">
        <div>
          <div className="text-xs font-semibold text-[#006A6A] tracking-wider uppercase mb-0.5">
            Super Admin Control Center
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#191C1C] tracking-tight font-display flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#006A6A]" />
            Kelola Turnamen & Status Pertandingan
          </h2>
          <p className="text-xs text-[#3D5A57] mt-1 max-w-2xl">
            Buat kejuaraan baru, perbarui data kompetisi, hapus turnamen, serta ubah status pertandingan langsung (Live, Akan Datang, Selesai) secara seketika.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenResetModal}
            title="Reset default & kosongkan semua data pemain, turnamen, bracket, dan skoring"
            className="px-3 py-2 text-xs font-semibold text-[#BA1A1A] hover:bg-red-50 bg-white border border-[#BA1A1A]/30 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#BA1A1A]" />
            <span className="font-bold">Reset Default</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#006A6A] hover:bg-[#005252] rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Turnamen Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (Zero-Pill Discipline, Tabular Figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#D8DFDE] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#6F7978] uppercase tracking-wider">
            Total Turnamen
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[#191C1C] font-mono tabular-nums">
            {tournaments.length}
          </div>
          <div className="text-[11px] text-[#3D5A57] mt-0.5">
            Kompetisi terdaftar di sistem
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#006A6A]/30 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#006A6A] uppercase tracking-wider">
              Turnamen Live
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006A6A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006A6A]"></span>
            </span>
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[#006A6A] font-mono tabular-nums">
            {liveCount}
          </div>
          <div className="text-[11px] text-[#3D5A57] mt-0.5">
            Sedang bertanding di lapangan
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#D8DFDE] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#6E4D8B] uppercase tracking-wider">
            Akan Datang
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[#6E4D8B] font-mono tabular-nums">
            {upcomingCount}
          </div>
          <div className="text-[11px] text-[#3D5A57] mt-0.5">
            Tahap pendaftaran & drawing
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#D8DFDE] shadow-2xs">
          <div className="text-[11px] font-semibold text-[#6F7978] uppercase tracking-wider">
            Selesai / Arsip
          </div>
          <div className="mt-1 text-2xl font-extrabold text-[#191C1C] font-mono tabular-nums">
            {completedCount}
          </div>
          <div className="text-[11px] text-[#3D5A57] mt-0.5">
            Podium & rekap juara tercatat
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#D8DFDE] shadow-2xs">
        {/* Status Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1 p-1 bg-[#EEF4F3] rounded-lg overflow-x-auto">
          <button
            onClick={() => setStatusFilter('semua')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              statusFilter === 'semua'
                ? 'bg-white text-[#191C1C] shadow-2xs'
                : 'text-[#6F7978] hover:text-[#191C1C]'
            }`}
          >
            Semua ({tournaments.length})
          </button>
          <button
            onClick={() => setStatusFilter('Live')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'Live'
                ? 'bg-[#006A6A] text-white shadow-2xs'
                : 'text-[#6F7978] hover:text-[#191C1C]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Live ({liveCount})
          </button>
          <button
            onClick={() => setStatusFilter('Akan Datang')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'Akan Datang'
                ? 'bg-[#6E4D8B] text-white shadow-2xs'
                : 'text-[#6F7978] hover:text-[#191C1C]'
            }`}
          >
            <Clock className="w-3 h-3" />
            Akan Datang ({upcomingCount})
          </button>
          <button
            onClick={() => setStatusFilter('Selesai')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'Selesai'
                ? 'bg-[#3D5A57] text-white shadow-2xs'
                : 'text-[#6F7978] hover:text-[#191C1C]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Selesai ({completedCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6F7978] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari turnamen, venue, atau penyelenggara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-lg text-[#191C1C] placeholder-[#6F7978] focus:outline-none focus:border-[#006A6A] transition-all"
          />
        </div>
      </div>

      {/* Tournaments List Table & Cards */}
      <div className="bg-white rounded-xl border border-[#D8DFDE] shadow-2xs overflow-hidden">
        {filteredTournaments.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="w-10 h-10 text-[#6F7978]/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#191C1C]">Tidak Ada Turnamen Ditemukan</h3>
            <p className="text-xs text-[#3D5A57] mt-1 max-w-sm mx-auto">
              Tidak ada data yang cocok dengan filter atau kata kunci pencarian Anda.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-[#006A6A] hover:bg-[#005252] rounded-xl transition-all"
            >
              + Buat Turnamen Pertama
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#D8DFDE]">
            {filteredTournaments.map((tourney) => {
              return (
                <div
                  key={tourney.id}
                  className="p-4 sm:p-5 hover:bg-[#F6FAF9]/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* Left Column: Info & Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-[#006A6A]">
                        {tourney.organizer || 'MOTION'}
                      </span>
                      <span className="text-[#6F7978]" aria-hidden="true">·</span>
                      <span className="text-[#3D5A57] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#006A6A]" />
                        <span className="font-mono tabular-nums">{tourney.date}</span>
                      </span>
                      <span className="text-[#6F7978]" aria-hidden="true">·</span>
                      <span className="text-[#3D5A57] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#006A6A]" />
                        <span>{tourney.location}</span>
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-[#191C1C] font-display tracking-tight">
                      {tourney.name}
                    </h3>

                    {/* Metadata line without pills */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6F7978]">
                      <span>{tourney.categories?.join(', ') || 'Rookie Mix'}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{tourney.totalCourts} Lapangan</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{tourney.totalTeams} Tim</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#6E4D8B]">{tourney.prizePool}</span>
                    </div>
                  </div>

                  {/* Middle Column: Quick Status Switcher (Interactive 3-State Control) */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-[#6F7978] uppercase tracking-wider">
                        Status Pertandingan:
                      </div>
                      <div className="inline-flex p-1 bg-[#F0F5F5] border border-[#D8DFDE] rounded-xl gap-1">
                        {/* Live Button */}
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(tourney, 'Live')}
                          title="Ubah status ke Live (Sedang Bertanding)"
                          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                            tourney.status === 'Live'
                              ? 'bg-[#006A6A] text-white shadow-xs'
                              : 'text-[#6F7978] hover:text-[#191C1C] hover:bg-white/60'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              tourney.status === 'Live'
                                ? 'bg-emerald-300 animate-pulse'
                                : 'bg-[#6F7978]'
                            }`}
                          ></span>
                          <span>Live</span>
                        </button>

                        {/* Akan Datang Button */}
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(tourney, 'Akan Datang')}
                          title="Ubah status ke Akan Datang"
                          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                            tourney.status === 'Akan Datang'
                              ? 'bg-[#6E4D8B] text-white shadow-xs'
                              : 'text-[#6F7978] hover:text-[#191C1C] hover:bg-white/60'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>Akan Datang</span>
                        </button>

                        {/* Selesai Button */}
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(tourney, 'Selesai')}
                          title="Ubah status ke Selesai"
                          className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                            tourney.status === 'Selesai'
                              ? 'bg-[#3D5A57] text-white shadow-xs'
                              : 'text-[#6F7978] hover:text-[#191C1C] hover:bg-white/60'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Selesai</span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="flex items-center gap-1.5 pt-2 sm:pt-0">
                      {onOpenTournamentDetail && (
                        <button
                          onClick={() => onOpenTournamentDetail(tourney.id)}
                          title="Buka tampilan detail turnamen"
                          className="p-2 text-[#006A6A] hover:bg-[#EEF4F3] border border-[#D8DFDE] rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Lihat</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenEditModal(tourney)}
                        title="Edit data turnamen"
                        className="p-2 text-[#191C1C] hover:bg-[#EEF4F3] border border-[#D8DFDE] rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#006A6A]" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => setTournamentToDelete(tourney)}
                        title="Hapus turnamen ini"
                        className="p-2 text-[#BA1A1A] hover:bg-red-50 border border-[#D8DFDE] hover:border-red-200 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Hapus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Buat / Edit Turnamen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#D8DFDE] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#D8DFDE] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#006A6A]/10 flex items-center justify-center text-[#006A6A]">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#191C1C] font-display">
                    {editingTournamentId ? 'Edit Data Turnamen' : 'Buat Turnamen Baru'}
                  </h3>
                  <p className="text-xs text-[#3D5A57]">
                    Lengkapi identitas, kategori, status pertandingan, dan kuota tim.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-[#6F7978] hover:text-[#191C1C] rounded-lg hover:bg-[#EEF4F3] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveForm} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Nama Turnamen */}
              <div>
                <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                  Nama Turnamen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Solo Padel Championship 2026"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-[#BA1A1A] mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Status Pertandingan */}
              <div>
                <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1.5">
                  Status Turnamen
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <label
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                      formStatus === 'Akan Datang'
                        ? 'border-[#6E4D8B] bg-[#6E4D8B]/5 text-[#6E4D8B] font-bold'
                        : 'border-[#D8DFDE] bg-white text-[#6F7978] hover:bg-[#F6FAF9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="Akan Datang"
                      checked={formStatus === 'Akan Datang'}
                      onChange={() => setFormStatus('Akan Datang')}
                      className="sr-only"
                    />
                    <Clock className="w-4 h-4 mb-1" />
                    <span className="text-xs">Akan Datang</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                      formStatus === 'Live'
                        ? 'border-[#006A6A] bg-[#006A6A]/5 text-[#006A6A] font-bold'
                        : 'border-[#D8DFDE] bg-white text-[#6F7978] hover:bg-[#F6FAF9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="Live"
                      checked={formStatus === 'Live'}
                      onChange={() => setFormStatus('Live')}
                      className="sr-only"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mb-1 animate-pulse"></span>
                    <span className="text-xs">Live</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                      formStatus === 'Selesai'
                        ? 'border-[#3D5A57] bg-[#3D5A57]/5 text-[#3D5A57] font-bold'
                        : 'border-[#D8DFDE] bg-white text-[#6F7978] hover:bg-[#F6FAF9]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="Selesai"
                      checked={formStatus === 'Selesai'}
                      onChange={() => setFormStatus('Selesai')}
                      className="sr-only"
                    />
                    <CheckCircle2 className="w-4 h-4 mb-1" />
                    <span className="text-xs">Selesai</span>
                  </label>
                </div>
              </div>

              {/* Penyelenggara & Lokasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                    Penyelenggara *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: LagiLagi Padel Solo"
                    value={formOrganizer}
                    onChange={(e) => setFormOrganizer(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                    Lokasi / Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Zing Padel Solo (6 Courts)"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                  />
                </div>
              </div>

              {/* Tanggal & Total Hadiah */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                    Tanggal Pelaksanaan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 2026-10-15 atau 15 - 18 Okt 2026"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                    Total Hadiah (Prize Pool)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 25.000.000 + 4 Trofi Eksklusif"
                    value={formPrizePool}
                    onChange={(e) => setFormPrizePool(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                  />
                </div>
              </div>

              {/* Lapangan & Kuota Tim */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                    Jumlah Lapangan
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={formTotalCourts}
                    onChange={(e) => setFormTotalCourts(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A] font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                    Kuota Total Tim
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="128"
                    value={formTotalTeams}
                    onChange={(e) => setFormTotalTeams(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A] font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                  Kategori Peserta (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rookie Men, Rookie Women, Mixed Doubles"
                  value={formCategories}
                  onChange={(e) => setFormCategories(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                />
              </div>

              {/* Aturan & Format */}
              <div>
                <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                  Format Pertandingan & Aturan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Race to 4 Games · Golden Point Active · Auto Knockout"
                  value={formRules}
                  onChange={(e) => setFormRules(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-[#191C1C] uppercase tracking-wider mb-1">
                  Deskripsi Turnamen
                </label>
                <textarea
                  rows={3}
                  placeholder="Keterangan singkat tentang turnamen..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F6FAF9] border border-[#D8DFDE] rounded-xl text-[#191C1C] focus:outline-none focus:border-[#006A6A]"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-[#D8DFDE] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6F7978] hover:text-[#191C1C] bg-[#F6FAF9] rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#006A6A] hover:bg-[#005252] rounded-xl transition-all shadow-sm"
                >
                  {editingTournamentId ? 'Simpan Perubahan' : 'Terbitkan Turnamen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tournamentToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#BA1A1A]/30 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-[#BA1A1A] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#191C1C] text-center font-display">
              Hapus Turnamen?
            </h3>
            <p className="text-xs text-[#3D5A57] text-center mt-2">
              Apakah Anda yakin ingin menghapus turnamen{' '}
              <strong className="text-[#191C1C]">"{tournamentToDelete.name}"</strong>? Data jadwal, bagan, dan klasemen terkait turnamen ini akan dihapus dari peramban.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setTournamentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#6F7978] hover:text-[#191C1C] bg-[#F6FAF9] rounded-xl transition-colors flex-1"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-[#BA1A1A] hover:bg-red-700 rounded-xl transition-all shadow-sm flex-1"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Default / Kosongkan Data Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-[#BA1A1A]/30 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 my-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#D8DFDE]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#BA1A1A] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#191C1C] font-display">
                    Reset Default & Kosongkan Data
                  </h3>
                  <p className="text-xs text-[#3D5A57]">
                    Kelola data sistem: bersihkan total atau muat data demo.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="p-1 text-[#6F7978] hover:text-[#191C1C] rounded-lg hover:bg-[#EEF4F3] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current System Status Badges */}
            <div className="my-4 space-y-3">
              <div className="text-[11px] font-bold text-[#6F7978] uppercase tracking-wider">
                Status Data Saat Ini:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] text-center">
                  <div className="text-[10px] text-[#6F7978] font-bold uppercase">Turnamen</div>
                  <div className="text-lg font-extrabold text-[#191C1C] font-mono tabular-nums">{tournaments.length}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] text-center">
                  <div className="text-[10px] text-[#6F7978] font-bold uppercase">Pemain Klub</div>
                  <div className="text-lg font-extrabold text-[#191C1C] font-mono tabular-nums">{membersCount}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] text-center">
                  <div className="text-[10px] text-[#6F7978] font-bold uppercase">Hall of Fame</div>
                  <div className="text-xs font-bold text-[#6E4D8B] mt-1">Podium & Medali</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] text-center">
                  <div className="text-[10px] text-[#6F7978] font-bold uppercase">Wasit & Skor</div>
                  <div className="text-xs font-bold text-[#006A6A] mt-1">Skor 0 - 0 (Bersih)</div>
                </div>
              </div>
            </div>

            {/* Detailed Explanation */}
            <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 text-xs text-[#191C1C] space-y-1.5">
              <div className="font-bold flex items-center gap-1.5 text-[#BA1A1A]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Pilihan Tindakan Reset Sistem:</span>
              </div>
              <p className="text-[11px] text-[#3D5A57] leading-relaxed">
                Pilih opsi di bawah sesuai kebutuhan Anda. Tombol merah akan <strong>mengosongkan seluruh data</strong> pemain, turnamen, bagan, <strong>halaman lembar wasit & hasil skor pertandingan (0-0)</strong>, serta rekapitulasi <strong>Hall of Fame</strong> menjadi 0 sehingga sistem bersih tanpa sisa data demo bawaan.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2.5">
              {/* Primary Action requested by user */}
              <button
                type="button"
                onClick={handleConfirmClearAllData}
                className="w-full py-2.5 px-4 rounded-xl bg-[#BA1A1A] hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Kosongkan Semua Data (Pemain, Turnamen, Bracket, Halaman Wasit & Skor, Hall of Fame)</span>
              </button>

              {/* Secondary Demo Recovery Action */}
              <button
                type="button"
                onClick={handleConfirmRestoreDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#EEF4F3] border border-[#D8DFDE] text-[#006A6A] hover:text-[#005252] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Muat Ulang Contoh Data Demo Bawaan Pabrik</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-[#6F7978] hover:text-[#191C1C] transition-colors cursor-pointer"
              >
                Batalkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
