import React from 'react';
import { Phone, Mail, Instagram, Trophy, Award, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate?: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="border-t border-[#D8DFDE] bg-white text-[#6F7978] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#006A6A] flex items-center justify-center font-black text-white text-xs shadow-xs">
                LLP
              </div>
              <span className="text-xl font-black text-[#191C1C] tracking-tight font-display">
                LagiLagi<span className="text-[#006A6A]">Padel</span>
              </span>
            </div>

            <p className="text-[#3D5A57] text-xs leading-relaxed max-w-sm">
              Platform resmi manajemen turnamen padel, live scoring wasit digital, bagan gugur (knockout bracket), undian grup, dan rekapitulasi Hall of Fame di Indonesia berstandar regulasi Federasi Padel Internasional (FIP).
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] flex items-center justify-center text-[#3D5A57] hover:text-[#006A6A] hover:border-[#006A6A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/6281188997233"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] flex items-center justify-center text-[#3D5A57] hover:text-[#006A6A] hover:border-[#006A6A] transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:turnamen@lagilagipadel.id"
                className="w-8 h-8 rounded-xl bg-[#F6FAF9] border border-[#D8DFDE] flex items-center justify-center text-[#3D5A57] hover:text-[#006A6A] hover:border-[#006A6A] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Fitur Turnamen & Wasit */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#191C1C] font-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#006A6A]" />
              <span>Sistem Turnamen</span>
            </h4>
            <ul className="space-y-2 text-[#3D5A57]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006A6A]" />
                <span>Bagan Sistem Gugur (Bracket)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006A6A]" />
                <span>Undian Grup & Klasemen Poin</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006A6A]" />
                <span>Lembar Skoring Wasit Digital</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006A6A]" />
                <span>Hall of Fame & Rekap Juara</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006A6A]" />
                <span>Sinkronisasi Data Member Pemain</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Regulasi & Dukungan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#191C1C] font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E4D8B]" />
              <span>Regulasi Pertandingan</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#191C1C] block font-medium">Format Pertandingan:</span>
                <span className="text-[#3D5A57]">FIP Standard, Race to 4/6 Games, Golden Point 40-40.</span>
              </div>
              <div>
                <span className="text-[#191C1C] block font-medium">Verifikasi Skor:</span>
                <span className="text-[#3D5A57]">Divalidasi langsung oleh wasit & panitia resmi.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#D8DFDE] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#6F7978] text-[11px]">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#006A6A]" />
            <span>Sistem Turnamen & Skoring Terpadu LagiLagiPadel</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#191C1C] cursor-pointer">Regulasi Pertandingan FIP</span>
            <span>·</span>
            <span className="hover:text-[#191C1C] cursor-pointer">Panduan Wasit Lapangan</span>
            <span>·</span>
            <span className="hover:text-[#191C1C] cursor-pointer">Hak Cipta Turnamen</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
