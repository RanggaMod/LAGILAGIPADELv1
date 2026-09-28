# Laman Admin Manajemen Turnamen (Buat, Edit, Hapus & Status Pertandingan)

Solusi terpadu untuk pengurus dan super admin LagiLagiPadel dalam mengelola siklus hidup turnamen padel secara menyeluruh: membuat turnamen baru, memperbarui detail dan kategori, menghapus turnamen lama, serta mengubah status turnamen (Live, Akan Datang, Selesai) secara instan dan reaktif.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> - **Integrasi Portal**: Menu **Kelola Turnamen** akan diintegrasikan langsung sebagai tab utama di dalam **Portal Admin & Wasit** (dapat diakses dengan akun resmi `admin`, `wasit`, atau `panitia` serta tombol akses cepat dari dashboard turnamen).
> - **Penyimpanan Persisten (localStorage)**: Semua perubahan (pembuatan turnamen baru, edit data, penghapusan, dan pergantian status) disimpan secara persisten di penyimpanan peramban lokal (`localStorage`) dan memancarkan event `lagilagipadel_tournaments_updated` agar tampilan publik tamu, live hub, dan bagan visualizer langsung ter-update seketika tanpa perlu memuat ulang halaman.
> - **Status 3 Tingkat**: Mendukung status **Live** (sedang berlangsung dengan live court badge), **Akan Datang** (pendaftaran/jadwal belum dimulai), dan **Selesai** (arsip dengan daftar pemenang & podium) dengan tombol quick toggle 1-klik di tabel admin.

---

## 1. Overview & Core Concept

- **Apa Fungsinya**: Menyediakan dasbor admin khusus (*Admin Tournament Manager*) dengan antarmuka formulir interaktif untuk membuat turnamen baru (nama, kategori, venue, jumlah lapangan & kuota tim, tanggal, hadiah, format/aturan), mengedit turnamen yang ada, menghapus turnamen dengan dialog konfirmasi aman, serta mengubah status turnamen (`Live` / `Akan Datang` / `Selesai`) dengan switch instan.
- **Target Pengguna**: Super Admin, Panitia Pelaksana Turnamen, dan Wasit Pertandingan LagiLagiPadel (Solo & Jakarta).
- **Nilai Tambah**: Menghilangkan ketergantungan pada data statis/hardcoded sehingga panitia bebas menambah turnamen kapan saja dan langsung mengatur alur pertandingan secara real-time.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Akses & Autentikasi**:
   - Admin membuka portal lewat tombol "Portal Wasit & Super Admin" di header turnamen.
   - Masuk ke tab baru: **Kelola Turnamen** (ikon *Trophy / Settings*).
2. **Daftar & Filter Turnamen**:
   - Menampilkan tabel/kartu turnamen dengan filter status: *Semua*, *Live*, *Akan Datang*, *Selesai*, serta kolom pencarian instan berdasarkan nama turnamen atau lokasi.
   - Pada setiap baris terdapat **Quick Status Switcher** (tiga tombol radio/segmen kompak: `Live` 🟢, `Akan Datang` 🟡, `Selesai` ⚪) untuk mengubah status dengan satu kali klik tanpa harus membuka modal formulir.
3. **Pembuatan Turnamen Baru (+ Buat Turnamen)**:
   - Klik tombol utama `+ Buat Turnamen Baru` yang membuka slide-over drawer / modal responsif.
   - Mengisi identitas turnamen: Nama, Penyelenggara, Venue/Lokasi (contoh: Zing Padel Solo, All In Padel), Rentang Tanggal, Kategori Peserta (Rookie Mix, Open Men, dsb.), Format Aturan (Race to 4, Golden Point, dll.), Total Lapangan, Kuota Tim, dan Total Hadiah.
   - Status awal dapat dipilih: *Akan Datang* atau *Live*.
   - Saat disimpan, sistem secara otomatis menginisialisasi struktur pool grup, bagan knockout kosong, dan mendaftarkannya ke sistem.
4. **Edit & Hapus Turnamen**:
   - Tombol **Edit** membuka formulir dengan data turnamen yang sudah terisi untuk pengubahan cepat.
   - Tombol **Hapus** memicu dialog konfirmasi keselamatan (*modal dialog*) untuk mencegah penghapusan yang tidak disengaja.

### Visual Identity & Theme (SaaS Dashboard Constitution)

- **Canvas & Tone**: Background netral bersih `#F6FAF9` dengan surface card putih `#FFFFFF` dan aksen brand utama Deep Emerald `#006A6A` dan Cool Slate `#3D5A57`.
- **Zero-Pill Discipline**: Metadata turnamen disajikan dengan tipografi bersih tanpa bungkusan pil statis, menggunakan pemisah subtil (`·` atau `/`) dan angka tabular (`tabular-nums font-mono`).
- **Interactive Segmented Controls**: Status switcher dirancang sebagai segmented button kompak dengan transisi warna halus:
  - `Live`: Aksen emerald lembut dengan indikator pulsasi hijau halus.
  - `Akan Datang`: Aksen amber/gold yang elegan dengan ikon kalender/jam.
  - `Selesai`: Warna netral tenang dengan centang abu-abu.
- **Rhythm & Spatial Math**: Spacing konsisten 16px–24px, radius kontainer serasi (nested radius $r_{inner} = r_{outer} - padding$), serta tata letak responsif desktop 1440px dan perangkat seluler.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Persistent Tournament Engine (`src/data/tournamentStorage.ts`)**
  - *Chosen Approach*: Menyimpan daftar turnamen dalam `localStorage` (`padelpro_custom_tournaments`) yang diinisialisasi awal dengan data turnamen eksisting (`PADEL_TOURNAMENTS_DATA`), dipadukan dengan Custom DOM Event (`lagilagipadel_tournaments_updated`).
  - *Why*: Data langsung tersimpan di browser pengguna tanpa memerlukan setup backend database yang rumit, namun dapat dimodifikasi secara dinamis kapan saja dan langsung sinkron ke seluruh komponen (Guest View, Detail Turnamen, Bracket, dan Referee).
- **Decision 2: Quick Status Switcher di Baris Tabel**
  - *Chosen Approach*: Tombol ganti status diletakkan langsung di setiap baris tabel turnamen selain di dalam modal edit.
  - *Why*: Panitia turnamen sering kali perlu mengubah status pertandingan dari "Akan Datang" ke "Live" saat babak pertama dimulai, atau ke "Selesai" saat seremoni podium, tanpa harus membuka formulir edit yang panjang.
- **Decision 3: Pemisahan Komponen `AdminTournamentManager.tsx`**
  - *Chosen Approach*: Membuat komponen terdedikasi `AdminTournamentManager.tsx` yang diimpor ke dalam `RefereeAdminPortal.tsx` dan dapat diakses dari tab navigasi admin.
  - *Why*: Menjaga modularitas kode yang bersih, menghindari pembengkakan file, dan mempermudah pengujian serta penambahan fitur di masa depan.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                      LagiLagiPadel App                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│  PadelProTournamentApp (UI)  │       │  RefereeAdminPortal (Admin)  │
│  - Guest View                │       │  - Member Klub Tab           │
│  - Filter Status Turnamen    │       │  - Undian Grup Tab           │
│  - Detail, Bracket & Skor    │       │  - Bagan Knockout Tab        │
└──────────────▲───────────────┘       │  - NEW: Kelola Turnamen Tab  │
               │                       │    [AdminTournamentManager]  │
               │                       └──────────────┬───────────────┘
               │                                      │
               │  window Event:                       │  CRUD Operations:
               │  "lagilagipadel_tournaments_updated" │  create, edit, delete,
               │                                      │  quick-status-toggle
               └──────────────────────┬───────────────┘
                                      │
                       ┌──────────────▼──────────────┐
                       │  src/data/tournamentStorage │
                       │  - getStoredTournaments()   │
                       │  - saveTournament()         │
                       │  - deleteTournament()       │
                       │  - updateTournamentStatus() │
                       │  - localStorage persistence │
                       └─────────────────────────────┘
```

### Data Model (`FullTournamentDetail` Extended)

```typescript
export interface FullTournamentDetail {
  id: string;
  name: string;
  organizer: string;
  location: string;
  date: string;
  status: 'Live' | 'Selesai' | 'Akan Datang'; // Mendukung 'Akan Datang'
  categories: string[];
  totalCourts: number;
  totalTeams: number;
  prizePool: string;
  rules: string;
  description: string;
  liveCourtNumber?: number;
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
```

### File Changes Summary

1. `src/data/tournamentStorage.ts` (NEW): Modul manajemen penyimpanan turnamen dengan sinkronisasi reaktif ke `localStorage`.
2. `src/components/AdminTournamentManager.tsx` (NEW): Komponen antarmuka admin lengkap dengan daftar turnamen, quick status switcher, modal Buat & Edit, filter & pencarian, serta dialog konfirmasi hapus.
3. `src/components/RefereeAdminPortal.tsx`: Menambahkan tab "Kelola Turnamen" ke dalam portal admin dan memasang komponen `AdminTournamentManager`.
4. `src/components/PadelProTournamentApp.tsx`: Memperbarui daftar turnamen publik agar mengambil data reaktif dari `tournamentStorage` dan mendukung filter tab status (`Live`, `Akan Datang`, `Selesai`).
5. `src/data/padelProTournamentsData.ts`: Menyesuaikan tipe status turnamen agar menyertakan `'Akan Datang'`.

---

## 5. Verification Plan

1. **Verifikasi Fungsional Buat Turnamen**:
   - Buka portal Admin -> Tab "Kelola Turnamen".
   - Tekan tombol "+ Buat Turnamen Baru", isi data turnamen (misal: "Solo Padel Championship 2026", status: "Akan Datang").
   - Simpan dan pastikan turnamen baru langsung muncul di tabel admin serta di daftar turnamen publik.
2. **Verifikasi Quick Status Toggle**:
   - Klik tombol status `Live`, `Akan Datang`, dan `Selesai` secara bergantian pada salah satu turnamen.
   - Verifikasi badge dan status di tampilan publik langsung berubah sesuai pilihan secara real-time.
3. **Verifikasi Edit Data**:
   - Edit salah satu turnamen (ubah hadiah, nama, atau kategori), simpan, dan pastikan perubahan ter-update.
4. **Verifikasi Hapus Turnamen**:
   - Klik tombol hapus pada turnamen uji coba, konfirmasi pada modal dialog, pastikan turnamen terhapus dari daftar dan local storage.
5. **Verifikasi Build**:
   - Jalankan `compile_applet` untuk memastikan tidak ada kesalahan kompilasi TypeScript atau CSS.
