import { LocationClub, Court, AddOnOption, OpenMatch, Coach, Tournament, ProductItem } from '../types';

export const LOCATIONS: LocationClub[] = [
  {
    id: 'kemang',
    name: 'Padel Pro Kemang',
    shortName: 'Kemang',
    city: 'Jakarta Selatan',
    address: 'Jl. Kemang II No. 15, Bangka, Mampang Prapatan, Jakarta Selatan 12730',
    googleMapsUrl: 'https://maps.google.com/?q=Kemang+Jakarta',
    phone: '+62 21 719 8820',
    whatsapp: '+62 811 8899 7233',
    hours: '06:00 – 24:00 Setiap Hari',
    courtsCount: 6,
    featuredCourt: 'Signature Pink Court & 5 Covered WPT Courts',
    description: 'Klub padel terlengkap di jantung Kemang dengan 6 lapangan berstandar World Padel Tour, rooftop viewing deck, kafe espresso & protein bar, serta suasana asri ramah hewan peliharaan (pet-friendly).',
    amenities: [
      'Iconic Signature Pink Court',
      'Panoramic Glass Anti-Reflective',
      'Rooftop Lounge & Viewing Deck',
      'Specialty Coffee & Smoothie Bar',
      'Locker Room dengan Rain Shower',
      'Pro Shop Peralatan Lengkap',
      'Pet Friendly Social Area',
      'Free High-Speed Wi-Fi'
    ],
    imageUrl: '/src/assets/images/padel_pink_court_1790169840764.jpg'
  },
  {
    id: 'satrio',
    name: 'Padel Pro Satrio Club',
    shortName: 'Satrio Club',
    city: 'Jakarta Selatan',
    address: 'Jl. Prof. DR. Satrio No. 18, Karet Semanggi, Setiabudi, Jakarta Selatan 12930',
    googleMapsUrl: 'https://maps.google.com/?q=Satrio+Kuningan+Jakarta',
    phone: '+62 21 522 9940',
    whatsapp: '+62 812 9988 5144',
    hours: '06:00 – 24:00 Setiap Hari',
    courtsCount: 4,
    featuredCourt: 'Tournament-Grade Indoor Arena',
    description: 'Fasilitas padel indoor premium di kawasan bisnis Kuningan Jakarta. Lapangan bebas cuaca berpendingin udara mikro dengan penerangan turnamen internasional dan executive meeting lounge.',
    amenities: [
      'Full Covered & Indoor Arena',
      'Sistem Pencahayaan Turnamen LED 800 Lux',
      'Executive Air-Conditioned F&B Lounge',
      'Valet & Dedicated Basement Parking',
      'Executive Locker & Towel Service',
      'Physio & Sports Massage Corner',
      'Corporate Event Booking Available'
    ],
    imageUrl: '/src/assets/images/club_lounge_cafe_1790169855985.jpg'
  }
];

export const COURTS: Court[] = [
  {
    id: 'court-kemang-pink',
    locationId: 'kemang',
    name: 'Court 1 — Iconic Pink Court',
    type: 'pink_signature',
    surface: 'WPT Super Court Pro Pink Monofilament',
    description: 'Lapangan signature pink yang menjadi ikon Padel Pro Indonesia. Menggunakan kaca tempered panoramik 12mm tanpa tiang sudut untuk visibilitas dan foto spektakuler.',
    isCovered: true,
    isAirConditioned: false,
    badge: 'Signature Court',
    hourlyRateOffPeak: 380000,
    hourlyRateStandard: 450000,
    hourlyRatePeak: 520000,
    imageUrl: '/src/assets/images/padel_pink_court_1790169840764.jpg'
  },
  {
    id: 'court-kemang-center',
    locationId: 'kemang',
    name: 'Court 2 — Center Court',
    type: 'panoramic',
    surface: 'Mondo Supercourt XN Official WPT Blue',
    description: 'Lapangan utama dengan tribun penonton dan pencahayaan intensif. Dirancang untuk pertandingan turnamen dan live broadcast.',
    isCovered: true,
    isAirConditioned: false,
    badge: 'Tournament Ready',
    hourlyRateOffPeak: 350000,
    hourlyRateStandard: 420000,
    hourlyRatePeak: 490000,
    imageUrl: '/src/assets/images/hero_padel_court_1790169815946.jpg'
  },
  {
    id: 'court-kemang-3',
    locationId: 'kemang',
    name: 'Court 3 — Alpha Court',
    type: 'panoramic',
    surface: 'Official Padel Pro Blue Turf',
    description: 'Lapangan panoramik modern dengan ventilasi udara optimal dan pantulan bola presisi.',
    isCovered: true,
    isAirConditioned: false,
    hourlyRateOffPeak: 340000,
    hourlyRateStandard: 400000,
    hourlyRatePeak: 470000
  },
  {
    id: 'court-kemang-4',
    locationId: 'kemang',
    name: 'Court 4 — Beta Court',
    type: 'standard',
    surface: 'Official Padel Pro Blue Turf',
    description: 'Ideal untuk latihan teknik, clinic, atau santai bareng teman dan keluarga.',
    isCovered: true,
    isAirConditioned: false,
    hourlyRateOffPeak: 320000,
    hourlyRateStandard: 380000,
    hourlyRatePeak: 450000
  },
  {
    id: 'court-kemang-5',
    locationId: 'kemang',
    name: 'Court 5 — Gamma Court',
    type: 'standard',
    surface: 'Official Padel Pro Blue Turf',
    description: 'Lapangan nyaman dengan ruang gerak leluasa di sisi luar.',
    isCovered: true,
    isAirConditioned: false,
    hourlyRateOffPeak: 320000,
    hourlyRateStandard: 380000,
    hourlyRatePeak: 450000
  },
  {
    id: 'court-kemang-6',
    locationId: 'kemang',
    name: 'Court 6 — Delta Court',
    type: 'standard',
    surface: 'Official Padel Pro Blue Turf',
    description: 'Cocok untuk private drill, sparring, atau latihan servis dan bandeja.',
    isCovered: true,
    isAirConditioned: false,
    hourlyRateOffPeak: 320000,
    hourlyRateStandard: 380000,
    hourlyRatePeak: 450000
  },
  {
    id: 'court-satrio-1',
    locationId: 'satrio',
    name: 'Satrio Court 1 — Grand Indoor Arena',
    type: 'indoor_wpt',
    surface: 'Mondo Supercourt XN Official WPT Blue',
    description: 'Lapangan indoor megah ber-AC sentral mikro, bebas angin dan hujan dengan pantulan kaca ultra-solid.',
    isCovered: true,
    isAirConditioned: true,
    badge: 'Full Indoor AC',
    hourlyRateOffPeak: 420000,
    hourlyRateStandard: 490000,
    hourlyRatePeak: 560000,
    imageUrl: '/src/assets/images/hero_padel_court_1790169815946.jpg'
  },
  {
    id: 'court-satrio-2',
    locationId: 'satrio',
    name: 'Satrio Court 2 — Club Arena',
    type: 'indoor_wpt',
    surface: 'Official Padel Pro Blue Turf',
    description: 'Lapangan kompetisi indoor yang nyaman untuk sesi siang bolong maupun malam hari setelah jam kantor.',
    isCovered: true,
    isAirConditioned: true,
    badge: 'Full Indoor AC',
    hourlyRateOffPeak: 400000,
    hourlyRateStandard: 470000,
    hourlyRatePeak: 540000
  }
];

export const ADD_ONS: AddOnOption[] = [
  {
    id: 'addon-racket-bullpadel',
    name: 'Sewa Raket Karbon Bullpadel',
    description: 'Raket resmi kelas kompetisi dengan protektor frame dan grip prima',
    price: 45000,
    type: 'racket'
  },
  {
    id: 'addon-racket-nox',
    name: 'Sewa Raket Nox ML10 Pro',
    description: 'Pilihan kontrol empuk dan sweet spot lebar bagi pemula & advance',
    price: 45000,
    type: 'racket'
  },
  {
    id: 'addon-balls-can',
    name: '1 Kaleng Bola Baru (3 Butir Bullpadel Next Pro)',
    description: 'Tekanan bola baru terjamin untuk pantulan kaca maksimal (milik Anda)',
    price: 95000,
    type: 'balls'
  },
  {
    id: 'addon-ballboy',
    name: 'Ball Boy & Feeder Resmi',
    description: 'Asisten pemungut bola dan feeder agar ritme permainan Anda non-stop',
    price: 60000,
    type: 'ballboy'
  },
  {
    id: 'addon-sparring',
    name: 'Sparring Partner / Hitting Partner',
    description: 'Pemain berperingkat klub untuk melengkapi tim Anda atau sparing rally',
    price: 250000,
    type: 'sparring'
  }
];

export const OPEN_MATCHES: OpenMatch[] = [
  {
    id: 'match-1',
    title: 'Kemang Pink Court Social Rally',
    locationName: 'Padel Pro Kemang',
    courtName: 'Court 1 — Iconic Pink Court',
    date: 'Hari Ini',
    time: '19:00 - 21:00',
    duration: '2 Jam',
    targetLevel: 'Level 2.0 - 3.0 (Intermediate)',
    levelNumeric: 2.5,
    hostName: 'Reza Pratama',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    totalSlots: 4,
    bookedSlots: 3,
    players: [
      { name: 'Reza Pratama (Host)', level: 2.8 },
      { name: 'Aldo Kusuma', level: 2.5 },
      { name: 'Dion Wicaksono', level: 3.0 }
    ],
    costPerPlayer: 130000,
    matchType: 'Friendly Doubles',
    notes: 'Butuh 1 pemain lagi buat genap doubles! Rally seru dan santai di Pink Court.'
  },
  {
    id: 'match-2',
    title: 'Satrio Indoor Power Doubles',
    locationName: 'Padel Pro Satrio Club',
    courtName: 'Satrio Court 1 (Indoor Arena)',
    date: 'Besok',
    time: '20:00 - 22:00',
    duration: '2 Jam',
    targetLevel: 'Level 3.5 - 4.5 (Advanced)',
    levelNumeric: 4.0,
    hostName: 'Kevin Wijaya',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    totalSlots: 4,
    bookedSlots: 2,
    players: [
      { name: 'Kevin Wijaya (Host)', level: 4.2 },
      { name: 'Farhan Setiadi', level: 3.8 }
    ],
    costPerPlayer: 140000,
    matchType: 'Competitive',
    notes: 'Sesi kompetitif intensif. Bandeja, smash, dan vibora konsisten.'
  },
  {
    id: 'match-3',
    title: 'Beginner Friendly Friday Morning',
    locationName: 'Padel Pro Kemang',
    courtName: 'Court 2 — Center Court',
    date: 'Jumat, 25 Sep',
    time: '07:00 - 09:00',
    duration: '2 Jam',
    targetLevel: 'Level 1.0 - 2.0 (Beginner / First Timers)',
    levelNumeric: 1.5,
    hostName: 'Nadira Putri',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    totalSlots: 4,
    bookedSlots: 2,
    players: [
      { name: 'Nadira Putri (Host)', level: 1.5 },
      { name: 'Clara Hartono', level: 1.2 }
    ],
    costPerPlayer: 95000,
    matchType: 'Friendly Doubles',
    notes: 'Sesi santai belajar rally dan adaptasi pantulan kaca. Pemula sangat diterima!'
  },
  {
    id: 'match-4',
    title: 'Satrio After-Office Mixed Doubles',
    locationName: 'Padel Pro Satrio Club',
    courtName: 'Satrio Court 2',
    date: 'Sabtu, 26 Sep',
    time: '18:00 - 20:00',
    duration: '2 Jam',
    targetLevel: 'Level 2.5 - 3.5 (Intermediate)',
    levelNumeric: 3.0,
    hostName: 'Aris & Maya',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    totalSlots: 4,
    bookedSlots: 3,
    players: [
      { name: 'Aris Nugroho (Host)', level: 3.2 },
      { name: 'Maya Santoso', level: 2.7 },
      { name: 'Bimo Aryo', level: 3.0 }
    ],
    costPerPlayer: 135000,
    matchType: 'Mixed Doubles',
    notes: 'Tersisa 1 spot untuk putri atau putra! Selesai main bisa lanjut santai di cafe lounge.'
  }
];

export const COACHES: Coach[] = [
  {
    id: 'coach-carlos',
    name: 'Coach Carlos Mendez',
    role: 'Head Coach Padel Pro Academy',
    nationality: 'Spanyol (Madrid)',
    experience: '12 Tahun Melatih Padel di Eropa & Asia',
    certification: 'FIP (International Padel Federation) Master Coach & RFE Padel Madrid',
    specialty: ['Vibora & Bandeja Masterclass', 'Tactical Court Positioning', 'High Performance Athlete'],
    hourlyRate: 650000,
    bio: 'Mantan pemain turnamen regional Spanyol dengan pengalaman membangun akademi padel di Marbella dan Dubai sebelum membidani Padel Pro Academy di Jakarta.',
    rating: 4.98,
    reviewsCount: 142,
    imageUrl: '/src/assets/images/padel_academy_coach_1790169870001.jpg'
  },
  {
    id: 'coach-dimas',
    name: 'Coach Dimas Pratama',
    role: 'Senior National Coach',
    nationality: 'Indonesia',
    experience: '6 Tahun Atlet & Pelatih Berprestasi',
    certification: 'Certified Padel Coach Level 2 & Sarjana Ilmu Keolahragaan',
    specialty: ['Beginner Fundamentals', 'Wall Rebound Adaptation', 'Footwork & Stamina'],
    hourlyRate: 450000,
    bio: 'Spesialis mengarahkan pemula dari nol hingga mahir bermain di lapangan kaca dengan metode drill yang menyenangkan dan minim cedera.',
    rating: 4.95,
    reviewsCount: 98,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'coach-elena',
    name: 'Coach Elena Rossi',
    role: 'Junior & Women Clinics Director',
    nationality: 'Italia / Spanyol',
    experience: '8 Tahun Pengembangan Atlet Muda',
    certification: 'European Padel Association Elite Coach',
    specialty: ['Junior Development (Ages 8-16)', 'Women Doubles Tactics', 'Hand-Eye Coordination'],
    hourlyRate: 550000,
    bio: 'Berfokus pada pembinaan regenerasi pemain muda Indonesia serta kelas eksklusif doubles perempuan dengan pendekatan biomekanika modern.',
    rating: 4.97,
    reviewsCount: 114,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80'
  }
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 'tourney-satrio-masters',
    title: 'Padel Pro Satrio Masters 2026',
    subtitle: 'Kejuaraan Padel Terbesar di Kawasan Bisnis Jakarta',
    locationName: 'Padel Pro Satrio Club (Indoor)',
    dateRange: '10 – 12 Oktober 2026',
    category: "Men's Open & Women's Open",
    maxTeams: 32,
    registeredTeams: 26,
    prizePool: 'Rp 35.000.000',
    registrationFee: 750000,
    format: 'Group Stage + Knockout Bracket (Best of 3 Sets)',
    status: 'Almost Full',
    highlights: [
      'Official WPT Scoring System',
      'Wasit FIP Berlisensi di Tiap Babak',
      'Live Streaming YouTube & Official Highlight Clip',
      'Goodie Bag Eksklusif Bullpadel untuk Seluruh Tim'
    ]
  },
  {
    id: 'tourney-friday-americano',
    title: 'Pink Court Friday Night Americano',
    subtitle: 'Social Mixer Berhadiah & DJ Lounge Night',
    locationName: 'Padel Pro Kemang',
    dateRange: 'Jumat, 2 Oktober 2026 (19:00 - 23:00)',
    category: 'Individual Entry (Level 2.0 - 3.5)',
    maxTeams: 24,
    registeredTeams: 18,
    prizePool: 'Rp 7.500.000 (Voucher Pro Shop & Trophy)',
    registrationFee: 250000,
    format: 'Rotational Americano (Partner berganti tiap 32 poin)',
    status: 'Open for Registration',
    highlights: [
      'Format Americano seru: kenalan dengan banyak pemain',
      'Free Flow Mocktails & BBQ Snack Bites',
      'Live Acoustic & DJ set di Rooftop Lounge'
    ]
  },
  {
    id: 'tourney-corporate-cup',
    title: 'Jakarta Corporate Padel League',
    subtitle: 'Ajang Networking & Sportivitas Antar Perusahaan',
    locationName: 'Kemang & Satrio Clubs',
    dateRange: '24 – 25 Oktober 2026',
    category: 'Corporate Doubles (Minimal 2 Karyawan / Tim)',
    maxTeams: 16,
    registeredTeams: 11,
    prizePool: 'Rp 20.000.000 + Piala Bergilir',
    registrationFee: 1200000,
    format: 'Round Robin + Championship Cup',
    status: 'Open for Registration',
    highlights: [
      'Media liputan khusus untuk branding perusahaan',
      'Sertifikat & Jersey Custom Padel Pro untuk 4 pemain',
      'Akses VIP Hospitality Lounge selama turnamen'
    ]
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-bullpadel-vertex',
    name: 'Bullpadel Vertex 04 2026 Edition',
    brand: 'Bullpadel',
    category: 'rackets',
    price: 4450000,
    originalPrice: 4890000,
    description: 'Raket resmi pilihan atlet profesional. Karbon XTend 12K dengan bentuk diamond agresif untuk power smash maksimal dan stabilitas vibora.',
    specs: {
      shape: 'Diamond',
      weight: '365 - 375 gram',
      balance: 'Tinggi (Power)',
      core: 'MultiEVA Dual Density',
      level: 'Advanced / Pro'
    },
    inStock: true,
    isBestseller: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  },
  {
    id: 'prod-nox-at10',
    name: 'Nox AT10 Genius 18K by Agustín Tapia',
    brand: 'Nox',
    category: 'rackets',
    price: 4750000,
    originalPrice: 5100000,
    description: 'Raket legendaris dengan permukaan bertekstur Rough Surface untuk putaran bola (spin) luar biasa dan kontrol presisi di segala sudut lapangan.',
    specs: {
      shape: 'Teardrop',
      weight: '360 - 375 gram',
      balance: 'Medium (Control & Power)',
      core: 'MLD Black EVA',
      level: 'Intermediate - Advanced'
    },
    inStock: true,
    isBestseller: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  },
  {
    id: 'prod-wilson-bela',
    name: 'Wilson Bela Pro V2.5 Red Edition',
    brand: 'Wilson',
    category: 'rackets',
    price: 4890000,
    description: 'Kolaborasi eksklusif dengan legenda Fernando Belasteguín. Material Primero Carbon Face untuk respons pukulan tajam dan kokoh.',
    specs: {
      shape: 'Diamond',
      weight: '370 gram',
      balance: 'Tinggi',
      core: 'Firm EVA Foam',
      level: 'Advanced / Competitive'
    },
    inStock: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  },
  {
    id: 'prod-balls-bullpadel-can',
    name: 'Bullpadel Next Pro Ball (Tube of 3)',
    brand: 'Bullpadel',
    category: 'balls',
    price: 115000,
    originalPrice: 135000,
    description: 'Bola resmi dengan wool felt berkualitas tinggi, pantulan stabil dan tahan lama di iklim tropis Indonesia.',
    specs: {
      level: 'Semua Level',
      core: 'High-Density Rubber Core'
    },
    inStock: true,
    isBestseller: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  },
  {
    id: 'prod-head-pro-s',
    name: 'Head Padel Pro S (Can of 3)',
    brand: 'Head',
    category: 'balls',
    price: 125000,
    description: 'Varian berkecepatan tinggi, pantulan lincah sangat cocok untuk lapangan tertutup (indoor) dan lapangan bertiup rendah.',
    specs: {
      level: 'Tournament Grade'
    },
    inStock: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  },
  {
    id: 'prod-padelpro-bag',
    name: 'Padel Pro Thermal Court Bag (Black & Rose)',
    brand: 'Padel Pro',
    category: 'bags',
    price: 1290000,
    originalPrice: 1550000,
    description: 'Tas raket berteknologi isolasi thermal ThermoGuard, kompartemen sepatu berventilasi, dan saku pakaian basah kedap air.',
    specs: {
      weight: 'Kapasitas 4 Raket + Perlengkapan'
    },
    inStock: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  },
  {
    id: 'prod-jersey-jkt',
    name: 'Padel Pro Jakarta Dry-Fit Performance Tee',
    brand: 'Padel Pro Official',
    category: 'apparel',
    price: 349000,
    description: 'Bahan mikro-pori berteknologi pendingin keringat cepat, elastisitas 4-arah untuk ayunan pukulan tanpa hambatan.',
    specs: {
      weight: 'Size S, M, L, XL, XXL'
    },
    inStock: true,
    imageUrl: '/src/assets/images/padel_pro_shop_1790169881620.jpg'
  }
];

export const MEMBERSHIP_PASSES = [
  {
    id: 'pass-rookie',
    name: 'Rookie Starter Pass',
    sessions: 5,
    price: 1750000,
    savingsText: 'Hemat Rp 350.000',
    validity: '30 Hari',
    perks: [
      '5 Jam Sewa Lapangan Off-Peak / Standard',
      'Gratis Sewa Raket Karbon di Setiap Sesi',
      '1 Kaleng Bola Baru Bullpadel',
      'Diskon 5% untuk Pembelian Pro Shop'
    ]
  },
  {
    id: 'pass-pro-club',
    name: 'Pro Club Player Pass',
    sessions: 15,
    price: 4950000,
    popular: true,
    savingsText: 'Hemat Rp 1.350.000',
    validity: '90 Hari',
    perks: [
      '15 Jam Sewa Lapangan (All Time Slots termasuk Peak)',
      'Akses Booking Prioritas H-7 Lebih Awal',
      'Gratis Sewa Raket & Handuk Setiap Sesi',
      'Diskon 12% Seluruh Produk Pro Shop',
      'Gratis 1 Sesi Group Clinic Akademi (90 Min)'
    ]
  },
  {
    id: 'pass-elite-black',
    name: 'Elite Black Pass (VIP Member)',
    sessions: 30,
    price: 9200000,
    savingsText: 'Hemat Rp 3.200.000',
    validity: '180 Hari',
    perks: [
      '30 Jam Fleksibel di Kemang & Satrio Clubs',
      'Prioritas Utama Booking H-14 di Pink Court',
      'Dedicated Locker Pribadi di Kemang / Satrio',
      '2x Private Coaching Session bareng Head Coach',
      'Undangan Eksklusif VIP Tournament & Exhibition Match'
    ]
  }
];

export const FAQ_LIST = [
  {
    question: 'Apa perbedaan padel dengan tenis lapangan biasa?',
    answer: 'Padel dimainkan di lapangan berukuran 10x20 meter yang dikelilingi dinding kaca tempered dan jaring besi. Bola yang memantul dari dinding kaca masih bisa dipukul balik, sehingga permainannya jauh lebih dinamis, cepat, dan tidak menghabiskan waktu memungut bola. Raket padel tidak bersenar (solid carbon) dan bolanya memiliki tekanan sedikit lebih rendah dari tenis.'
  },
  {
    question: 'Apakah pemula yang belum pernah bermain bisa langsung main?',
    answer: 'Sangat bisa! Padel terkenal sebagai olahraga raket paling ramah pemula di dunia. Dalam 15 menit pertama latihan, Anda sudah bisa melakukan rally seru bersama teman. Kami juga menyediakan sewa raket, bola, hingga sparring partner dan coach pendamping.'
  },
  {
    question: 'Bagaimana cara booking lapangan di Padel Pro?',
    answer: 'Pilih lokasi (Kemang atau Satrio), pilih tanggal, pilih lapangan (seperti Iconic Pink Court atau Center Court), lalu klik jam yang Anda inginkan. Anda bisa menambahkan sewa raket atau bola, lalu bayar secara instan via QRIS, Virtual Account, atau Kartu Kredit. Tiket digital langsung Anda terima via WhatsApp dan email.'
  },
  {
    question: 'Berapa tarif sewa lapangan di Padel Pro?',
    answer: 'Tarif sewa mulai dari Rp 320.000/jam untuk jam Off-Peak (06:00 - 12:00), Rp 380.000 - Rp 450.000/jam untuk jam Siang, dan Rp 450.000 - Rp 520.000/jam untuk jam Prime Peak (17:00 - 24:00). Biaya sewa raket karbon profesional adalah Rp 45.000/raket.'
  },
  {
    question: 'Apa itu fitur Open Match?',
    answer: 'Open Match adalah sistem matchmaking komunitas kami. Jika Anda tidak memiliki teman bermain atau butuh 1-2 orang untuk melengkapi kuartet doubles, Anda bisa membuat atau bergabung dengan Open Match sesuai level kemahiran Anda. Biaya sewa lapangan otomatis dibagi rata antar pemain.'
  },
  {
    question: 'Bagaimana kebijakan pembatalan dan reschedule booking?',
    answer: 'Reschedule atau pembatalan dapat dilakukan mandiri melalui link tiket WhatsApp minimal 24 jam sebelum jam main untuk mendapatkan pengembalian kredit 100%. Untuk kendala hujan di area outdoor, kredit otomatis di-refund penuh.'
  }
];
