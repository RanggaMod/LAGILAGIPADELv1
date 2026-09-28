import React from 'react';
import { Trophy, Zap, Flame, Crown, Check, Clock, Radio } from 'lucide-react';
import { KnockoutMatch } from '../data/padelProTournamentsData';
import { lookupPlayerPhoto } from '../data/clubMembersStorage';

interface KnockoutBracketVisualizerProps {
  roundOf16?: KnockoutMatch[];
  quarters: KnockoutMatch[];
  semis: KnockoutMatch[];
  grandFinal: KnockoutMatch;
  bronzeMatch?: KnockoutMatch;
  tournamentName?: string;
  onEditMatch?: (match: KnockoutMatch, roundType: string) => void;
  isAdminMode?: boolean;
}

export const KnockoutBracketVisualizer: React.FC<KnockoutBracketVisualizerProps> = ({
  roundOf16,
  quarters,
  semis,
  grandFinal,
  bronzeMatch,
  onEditMatch,
  isAdminMode = false
}) => {
  // If no roundOf16 in current tournament, generate demo/fallback roundOf16 so visual is always complete
  const effectiveR16: KnockoutMatch[] =
    roundOf16 && roundOf16.length === 8
      ? roundOf16
      : [
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
        ];

  const effectiveQuarters: KnockoutMatch[] =
    quarters && quarters.length >= 4
      ? quarters.slice(0, 4)
      : [
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
        ];

  const effectiveSemis: KnockoutMatch[] =
    semis && semis.length >= 2
      ? semis.slice(0, 2)
      : [
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
        ];

  // Render Status Badge
  const renderStatusBadge = (status: string) => {
    if (status === 'Live') {
      return (
        <span className="bg-red-50 border border-red-200 text-red-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Radio className="w-2.5 h-2.5 animate-pulse text-red-600" />
          <span>LIVE</span>
        </span>
      );
    }
    if (status === 'Dijadwalkan') {
      return (
        <span className="bg-neutral-50 border border-neutral-200 text-neutral-600 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-neutral-500" />
          <span>SCHEDULED</span>
        </span>
      );
    }
    return (
      <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
        <Check className="w-2.5 h-2.5 text-emerald-600" />
        <span>FINISHED</span>
      </span>
    );
  };

  // Helper renderer for a single match card with App Theme (Teal / M3)
  const renderMatchCard = (
    match: KnockoutMatch,
    roundType: string,
    customWidthClass = 'w-[230px]'
  ) => {
    return (
      <div
        onClick={() => isAdminMode && onEditMatch && onEditMatch(match, roundType)}
        className={`${customWidthClass} h-[96px] bg-white rounded-2xl border border-[#D8DFDE] hover:border-[#006A6A] p-2.5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group ${
          isAdminMode ? 'cursor-pointer ring-2 ring-transparent hover:ring-[#006A6A]/40' : ''
        }`}
      >
        {/* Top Header: Court Tag & Status */}
        <div className="flex items-center justify-between">
          <span className="bg-[#006A6A] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs">
            {match.court || 'COURT #1'}
          </span>
          <div className="flex items-center gap-1.5">
            {renderStatusBadge(match.status)}
            {isAdminMode && (
              <span className="text-[9px] font-mono text-[#006A6A] bg-[#E6F4F2] px-1.5 py-0.5 rounded font-bold">
                Edit
              </span>
            )}
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-1">
          {/* Team 1 */}
          <div
            className={`flex items-center justify-between px-2 py-0.5 rounded-lg text-xs transition-colors ${
              match.team1.isWinner
                ? 'bg-[#E6F4F2] border border-[#006A6A]/40 text-[#004F4F] font-bold'
                : 'text-[#475569] font-medium'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-1">
              {match.team1.isWinner ? (
                <Trophy className="w-3 h-3 text-amber-600 shrink-0" />
              ) : null}
              <img
                src={lookupPlayerPhoto(match.team1.name || match.team1.players)}
                alt={match.team1.name}
                className="w-4 h-4 rounded-full object-cover border border-[#CBD5D4] shrink-0"
              />
              <span className="truncate text-[11px] leading-tight">{match.team1.name}</span>
            </div>
            <span className={`font-mono text-xs shrink-0 ${match.team1.isWinner ? 'font-black text-[#006A6A]' : 'font-bold'}`}>
              {match.team1.score}
            </span>
          </div>

          {/* Team 2 */}
          <div
            className={`flex items-center justify-between px-2 py-0.5 rounded-lg text-xs transition-colors ${
              match.team2.isWinner
                ? 'bg-[#E6F4F2] border border-[#006A6A]/40 text-[#004F4F] font-bold'
                : 'text-[#475569] font-medium'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-1">
              {match.team2.isWinner ? (
                <Trophy className="w-3 h-3 text-amber-600 shrink-0" />
              ) : null}
              <img
                src={lookupPlayerPhoto(match.team2.name || match.team2.players)}
                alt={match.team2.name}
                className="w-4 h-4 rounded-full object-cover border border-[#CBD5D4] shrink-0"
              />
              <span className="truncate text-[11px] leading-tight">{match.team2.name}</span>
            </div>
            <span className={`font-mono text-xs shrink-0 ${match.team2.isWinner ? 'font-black text-[#006A6A]' : 'font-bold'}`}>
              {match.team2.score}
            </span>
          </div>
        </div>

        {/* Bottom Time & Round Info */}
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#6F7978] font-mono truncate max-w-[130px]">
            {match.roundTitle}
          </span>
          <span className="font-mono font-bold text-[#006A6A] leading-none">
            {match.time || '18:00'}
          </span>
        </div>
      </div>
    );
  };

  // Main Teal Theme Connector Color
  const connectorColor = '#006A6A';

  return (
    <div className="w-full space-y-4">
      {/* Scrollable Indicator Pill for Mobile / Small Screens */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#6F7978] px-1 gap-2">
        <span className="font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#006A6A]" />
          <span>Format turnamen sistem gugur resmi (Official Knockout Tree Draw)</span>
        </span>
        <span className="bg-[#EEF4F3] border border-[#D8DFDE] text-[#006A6A] font-semibold text-[11px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
          <span>⇄ Geser horizontal untuk melihat seluruh babak</span>
        </span>
      </div>

      {/* Main X-Scrollable Container */}
      <div className="overflow-x-auto pb-6 scrollbar-thin">
        <div className="min-w-[1260px] p-6 rounded-3xl bg-[#F6FAF9] border border-[#D8DFDE] shadow-xs space-y-6">
          {/* Header Badges Row matching App Theme */}
          <div className="grid grid-cols-[230px_40px_230px_40px_230px_40px_260px] items-center">
            {/* Round 1: Round of 16 */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F4F2] border border-[#006A6A]/30 text-[#006A6A] text-xs font-extrabold tracking-wider uppercase shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>ROUND OF 16</span>
              </div>
            </div>
            <div />

            {/* Round 2: Quarter Finals */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E6F4F2] border border-[#006A6A]/30 text-[#006A6A] text-xs font-extrabold tracking-wider uppercase shadow-xs">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>QUARTER FINALS</span>
              </div>
            </div>
            <div />

            {/* Round 3: Semi Finals (Violet/Purple Accent) */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F3DAFF]/70 border border-[#6E4D8B]/30 text-[#6E4D8B] text-xs font-extrabold tracking-wider uppercase shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-current text-[#6E4D8B]" />
                <span>SEMI FINALS</span>
              </div>
            </div>
            <div />

            {/* Round 4: Grand Final & Juara 3 (Golden/Crown) */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FEF08A] border border-amber-300 text-[#854D0E] text-xs font-black tracking-wider uppercase shadow-xs">
                <Crown className="w-3.5 h-3.5 text-amber-700" />
                <span>FINAL & JUARA 3</span>
                <Trophy className="w-3.5 h-3.5 text-amber-700" />
              </div>
            </div>
          </div>

          {/* Tree Structure Layout */}
          <div className="grid grid-cols-[230px_40px_230px_40px_230px_40px_260px] items-stretch">
            {/* ========================================================
                COLUMN 1: ROUND OF 16 (8 Matches in 4 Pairs)
               ======================================================== */}
            <div className="flex flex-col gap-6">
              {/* Pair 1 */}
              <div className="flex flex-col gap-3">
                {renderMatchCard(effectiveR16[0], 'roundOf16')}
                {renderMatchCard(effectiveR16[1], 'roundOf16')}
              </div>

              {/* Pair 2 */}
              <div className="flex flex-col gap-3">
                {renderMatchCard(effectiveR16[2], 'roundOf16')}
                {renderMatchCard(effectiveR16[3], 'roundOf16')}
              </div>

              {/* Pair 3 */}
              <div className="flex flex-col gap-3">
                {renderMatchCard(effectiveR16[4], 'roundOf16')}
                {renderMatchCard(effectiveR16[5], 'roundOf16')}
              </div>

              {/* Pair 4 */}
              <div className="flex flex-col gap-3">
                {renderMatchCard(effectiveR16[6], 'roundOf16')}
                {renderMatchCard(effectiveR16[7], 'roundOf16')}
              </div>
            </div>

            {/* ========================================================
                CONNECTOR 1: Round of 16 -> Quarter Finals
               ======================================================== */}
            <div className="flex flex-col gap-6">
              {/* Pair 1 to QF1 */}
              <div className="h-[204px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 40 204" fill="none">
                  <path
                    d="M 0,48 H 22 V 102 H 40"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 0,156 H 22 V 102"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Pair 2 to QF2 */}
              <div className="h-[204px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 40 204" fill="none">
                  <path
                    d="M 0,48 H 22 V 102 H 40"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 0,156 H 22 V 102"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Pair 3 to QF3 */}
              <div className="h-[204px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 40 204" fill="none">
                  <path
                    d="M 0,48 H 22 V 102 H 40"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 0,156 H 22 V 102"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Pair 4 to QF4 */}
              <div className="h-[204px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 40 204" fill="none">
                  <path
                    d="M 0,48 H 22 V 102 H 40"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 0,156 H 22 V 102"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* ========================================================
                COLUMN 2: QUARTER FINALS (4 Matches)
               ======================================================== */}
            <div className="flex flex-col gap-6">
              {/* QF 1 */}
              <div className="h-[204px] flex items-center">
                {renderMatchCard(effectiveQuarters[0], 'quarters')}
              </div>

              {/* QF 2 */}
              <div className="h-[204px] flex items-center">
                {renderMatchCard(effectiveQuarters[1], 'quarters')}
              </div>

              {/* QF 3 */}
              <div className="h-[204px] flex items-center">
                {renderMatchCard(effectiveQuarters[2], 'quarters')}
              </div>

              {/* QF 4 */}
              <div className="h-[204px] flex items-center">
                {renderMatchCard(effectiveQuarters[3], 'quarters')}
              </div>
            </div>

            {/* ========================================================
                CONNECTOR 2: Quarter Finals -> Semi Finals
               ======================================================== */}
            <div className="flex flex-col gap-6">
              {/* QF 1 & QF 2 to SF 1 */}
              <div className="h-[432px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 40 432" fill="none">
                  <path
                    d="M 0,102 H 22 V 216 H 40"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 0,330 H 22 V 216"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* QF 3 & QF 4 to SF 2 */}
              <div className="h-[432px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 40 432" fill="none">
                  <path
                    d="M 0,102 H 22 V 216 H 40"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 0,330 H 22 V 216"
                    stroke={connectorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* ========================================================
                COLUMN 3: SEMI FINALS (2 Matches)
               ======================================================== */}
            <div className="flex flex-col gap-6">
              {/* SF 1 */}
              <div className="h-[432px] flex items-center">
                {renderMatchCard(effectiveSemis[0], 'semis')}
              </div>

              {/* SF 2 */}
              <div className="h-[432px] flex items-center">
                {renderMatchCard(effectiveSemis[1], 'semis')}
              </div>
            </div>

            {/* ========================================================
                CONNECTOR 3: Semi Finals -> Finals
               ======================================================== */}
            <div className="h-[888px] flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 40 888" fill="none">
                {/* From SF 1 Center (y=216) -> down to Grand Final entry (y=420) */}
                <path
                  d="M 0,216 H 22 V 420 H 40"
                  stroke={connectorColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* From SF 2 Center (y=672) -> up to Grand Final entry (y=420) */}
                <path
                  d="M 0,672 H 22 V 420"
                  stroke={connectorColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Branch line into Bronze Match */}
                <path
                  d="M 22,545 H 40"
                  stroke={connectorColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* ========================================================
                COLUMN 4: GRAND FINAL & PEREBUTAN JUARA 3
               ======================================================== */}
            <div className="h-[888px] flex flex-col justify-center gap-6">
              {/* Grand Final Card */}
              <div
                onClick={() => isAdminMode && onEditMatch && onEditMatch(grandFinal, 'grandFinal')}
                className={`w-[260px] ${isAdminMode ? 'cursor-pointer' : ''}`}
              >
                {/* Golden Badge attached to Grand Final */}
                <div className="bg-[#FEF08A] border border-amber-300 rounded-t-2xl px-3 py-1.5 flex items-center justify-between text-[11px] font-black tracking-wider uppercase text-[#854D0E] shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-amber-700" />
                    <span>GRAND FINAL (JUARA 1 & 2)</span>
                  </div>
                  {isAdminMode && (
                    <span className="text-[9px] font-mono bg-amber-200/80 px-1.5 py-0.5 rounded font-bold">
                      Edit
                    </span>
                  )}
                </div>

                <div className="bg-white rounded-b-2xl border-2 border-amber-400 p-3 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#006A6A] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                      {grandFinal.court || 'COURT #2'}
                    </span>
                    {renderStatusBadge(grandFinal.status)}
                  </div>

                  <div className="space-y-1.5">
                    {/* Winner Team */}
                    <div
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
                        grandFinal.team1.isWinner
                          ? 'bg-[#FEF3C7] border border-amber-300 text-[#191C1C] font-bold'
                          : 'text-[#475569] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        {grandFinal.team1.isWinner && (
                          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <img
                          src={lookupPlayerPhoto(grandFinal.team1.name || grandFinal.team1.players)}
                          alt={grandFinal.team1.name}
                          className="w-5 h-5 rounded-full object-cover border border-amber-300 shrink-0 shadow-xs"
                        />
                        <span className="truncate text-xs">{grandFinal.team1.name}</span>
                      </div>
                      <span className="font-mono text-sm font-black shrink-0">
                        {grandFinal.team1.score}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
                        grandFinal.team2.isWinner
                          ? 'bg-[#FEF3C7] border border-amber-300 text-[#191C1C] font-bold'
                          : 'text-[#475569] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-1">
                        {grandFinal.team2.isWinner && (
                          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <img
                          src={lookupPlayerPhoto(grandFinal.team2.name || grandFinal.team2.players)}
                          alt={grandFinal.team2.name}
                          className="w-5 h-5 rounded-full object-cover border border-amber-300 shrink-0 shadow-xs"
                        />
                        <span className="truncate text-xs">{grandFinal.team2.name}</span>
                      </div>
                      <span className="font-mono text-sm font-bold shrink-0">
                        {grandFinal.team2.score}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px]">
                    <span className="text-[#6F7978] font-mono">
                      {grandFinal.roundTitle || 'Championship Match'}
                    </span>
                    <span className="font-mono font-bold text-[#006A6A]">
                      {grandFinal.time || '14:39'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Perebutan Juara 3 Card */}
              {bronzeMatch && (
                <div
                  onClick={() => isAdminMode && onEditMatch && onEditMatch(bronzeMatch, 'bronzeMatch')}
                  className={`w-[260px] ${isAdminMode ? 'cursor-pointer' : ''}`}
                >
                  {/* Bronze Badge attached */}
                  <div className="bg-[#FFEDD5] border border-orange-300 rounded-t-2xl px-3 py-1.5 flex items-center justify-between text-[11px] font-black tracking-wider uppercase text-[#9A3412] shadow-xs">
                    <div className="flex items-center gap-1.5">
                      <span>🥉</span>
                      <span>PEREBUTAN JUARA 3</span>
                    </div>
                    {isAdminMode && (
                      <span className="text-[9px] font-mono bg-orange-200/80 px-1.5 py-0.5 rounded font-bold">
                        Edit
                      </span>
                    )}
                  </div>

                  <div className="bg-white rounded-b-2xl border-2 border-orange-300 p-3 shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-[#006A6A] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                        {bronzeMatch.court || 'COURT #1'}
                      </span>
                      {renderStatusBadge(bronzeMatch.status)}
                    </div>

                    <div className="space-y-1.5">
                      {/* Winner 3rd */}
                      <div
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
                          bronzeMatch.team1.isWinner
                            ? 'bg-[#FEF3C7] border border-amber-300 text-[#191C1C] font-bold'
                            : 'text-[#475569] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          {bronzeMatch.team1.isWinner && (
                            <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <img
                            src={lookupPlayerPhoto(bronzeMatch.team1.name || bronzeMatch.team1.players)}
                            alt={bronzeMatch.team1.name}
                            className="w-5 h-5 rounded-full object-cover border border-orange-300 shrink-0 shadow-xs"
                          />
                          <span className="truncate text-xs">{bronzeMatch.team1.name}</span>
                        </div>
                        <span className="font-mono text-sm font-black shrink-0">
                          {bronzeMatch.team1.score}
                        </span>
                      </div>

                      {/* 4th Place */}
                      <div
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-colors ${
                          bronzeMatch.team2.isWinner
                            ? 'bg-[#FEF3C7] border border-amber-300 text-[#191C1C] font-bold'
                            : 'text-[#475569] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-1">
                          {bronzeMatch.team2.isWinner && (
                            <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                          <img
                            src={lookupPlayerPhoto(bronzeMatch.team2.name || bronzeMatch.team2.players)}
                            alt={bronzeMatch.team2.name}
                            className="w-5 h-5 rounded-full object-cover border border-orange-300 shrink-0 shadow-xs"
                          />
                          <span className="truncate text-xs">{bronzeMatch.team2.name}</span>
                        </div>
                        <span className="font-mono text-sm font-bold shrink-0">
                          {bronzeMatch.team2.score}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-[#6F7978] font-mono">
                        {bronzeMatch.roundTitle || 'Bronze Playoff'}
                      </span>
                      <span className="font-mono font-bold text-[#006A6A]">
                        {bronzeMatch.time || '20:28'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
