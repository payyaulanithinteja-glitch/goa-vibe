export type Region = 'North Goa' | 'South Goa' | 'Central Goa';
export type AudienceTag = 'Student Friendly' | 'Family & Elderly Friendly' | 'All Travelers';

export interface ItineraryItem {
  id: string;
  day: number;
  dayTitle: string;
  time: string;
  title: string;
  subtitle: string;
  region: Region;
  audienceTag: AudienceTag;
  category: 'Beach' | 'Culture & Heritage' | 'Culinary & Shack' | 'Nature & Sunset' | 'Market & Vibe';
  address: string;
  description: string;
  duration: string;
  estimatedCost: number; // in INR ₹
  accessibilityScore: number; // 1 to 5
  accessibilityNotes: string;
  seniorFriendly: boolean;
  studentDiscount: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  localTip: string;
  isCompleted?: boolean;
  isBookmarked?: boolean;
}

export interface BeachGuide {
  id: string;
  name: string;
  region: Region;
  audienceTag: AudienceTag;
  vibe: string;
  crowdLevel: 'Calm & Peaceful' | 'Moderate' | 'Bustling & Lively';
  swimmingSafety: 'Safe with Lifeguards' | 'Gentle Bay (Senior Friendly)' | 'Wading Only / Rocky';
  wheelchairAccess: boolean;
  elderlyRating: number; // 1-5
  shacksCount: number;
  bestTime: string;
  sunsetScore: number; // 1-10
  coordinates: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  highlights: string[];
  description: string;
  sunbedPrice: string;
}

export interface TravelFilters {
  region: 'All' | 'North Goa' | 'South Goa';
  audience: 'All' | 'Student Friendly' | 'Family & Elderly Friendly';
  seniorFriendlyOnly: boolean;
  wheelchairAccessOnly: boolean;
  studentDiscountOnly: boolean;
  maxCost: number;
  category: string;
}

export interface DaySchedule {
  dayNumber: number;
  dateLabel: string;
  title: string;
  region: Region;
  summary: string;
  heroImage: string;
  items: ItineraryItem[];
}
