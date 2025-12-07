// Search-related types for the Maldives OTA application

export interface SearchParams {
  destination?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
  currency?: string;
}

export interface VibeSearchParams {
  query: string; // Free-text AI search query
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
}

export interface SearchFilters {
  priceRange: [number, number];
  starRating: number[];
  amenities: string[];
  boardType: string[];
  cancellationPolicy: string[];
  transferType: string[];
  popularTags?: string[];
}

export interface SortOptions {
  sortBy: "recommended" | "price-low" | "price-high" | "rating" | "stars";
  direction?: "asc" | "desc";
}

export interface SearchResults {
  hotels: any[]; // Using any for now, will be Hotel type from liteapi
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore?: boolean;
}

export interface RecentSearch {
  id: string;
  type: "destination" | "vibe";
  query: string;
  destination?: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  timestamp: number;
}
