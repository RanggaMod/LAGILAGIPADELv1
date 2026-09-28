export type Language = 'id' | 'en';

export interface LocationClub {
  id: string;
  name: string;
  shortName: string;
  city: string;
  address: string;
  googleMapsUrl: string;
  phone: string;
  whatsapp: string;
  hours: string;
  courtsCount: number;
  featuredCourt: string;
  description: string;
  amenities: string[];
  imageUrl: string;
}

export interface Court {
  id: string;
  locationId: string;
  name: string;
  type: 'panoramic' | 'standard' | 'pink_signature' | 'indoor_wpt';
  surface: string;
  description: string;
  isCovered: boolean;
  isAirConditioned: boolean;
  badge?: string;
  hourlyRateOffPeak: number; // 06:00 - 12:00
  hourlyRateStandard: number; // 12:00 - 17:00
  hourlyRatePeak: number; // 17:00 - 24:00
  imageUrl?: string;
}

export interface TimeSlot {
  time: string; // "07:00"
  tier: 'off_peak' | 'standard' | 'peak';
  price: number;
  available: boolean;
  courtId: string;
  reservedBy?: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'racket' | 'balls' | 'ballboy' | 'sparring';
  selectedCount?: number;
}

export interface BookingReservation {
  id: string;
  location: LocationClub;
  court: Court;
  date: string;
  startTime: string;
  durationMinutes: number;
  totalPrice: number;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  addOns: { item: AddOnOption; count: number }[];
  status: 'confirmed' | 'pending';
  paymentMethod: 'qris' | 'va' | 'card';
  createdAt: string;
}

export interface OpenMatch {
  id: string;
  title: string;
  locationName: string;
  courtName: string;
  date: string;
  time: string;
  duration: string;
  targetLevel: string; // e.g., "Level 2.0 - 3.0 (Intermediate)"
  levelNumeric: number;
  hostName: string;
  hostAvatar: string;
  totalSlots: number;
  bookedSlots: number;
  players: { name: string; level: number; avatar?: string }[];
  costPerPlayer: number;
  matchType: 'Friendly Doubles' | 'Competitive' | 'Americano Practice' | 'Mixed Doubles';
  notes: string;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  nationality: string;
  experience: string;
  certification: string;
  specialty: string[];
  hourlyRate: number;
  bio: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
}

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  locationName: string;
  dateRange: string;
  category: string;
  maxTeams: number;
  registeredTeams: number;
  prizePool: string;
  registrationFee: number;
  format: string;
  status: 'Open for Registration' | 'Almost Full' | 'Upcoming' | 'Completed';
  highlights: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  brand: string;
  category: 'rackets' | 'balls' | 'bags' | 'apparel' | 'accessories';
  price: number;
  originalPrice?: number;
  description: string;
  specs: {
    shape?: string;
    weight?: string;
    balance?: string;
    core?: string;
    level?: string;
  };
  inStock: boolean;
  isBestseller?: boolean;
  imageUrl: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
