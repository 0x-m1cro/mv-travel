import { create } from "zustand";
import { SearchParams, VibeSearchParams, SearchFilters, SortOptions } from "@/types";

interface SearchState {
  // Search mode
  searchMode: "destination" | "vibe";
  setSearchMode: (mode: "destination" | "vibe") => void;

  // Destination search
  searchParams: SearchParams;
  setSearchParams: (params: Partial<SearchParams>) => void;

  // Vibe search
  vibeSearchParams: VibeSearchParams | null;
  setVibeSearchParams: (params: VibeSearchParams) => void;

  // Filters
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Sort
  sortOptions: SortOptions;
  setSortOptions: (options: SortOptions) => void;

  // Recent searches
  recentSearches: Array<{
    id: string;
    type: "destination" | "vibe";
    query: string;
    timestamp: number;
  }>;
  addRecentSearch: (search: { type: "destination" | "vibe"; query: string }) => void;
  clearRecentSearches: () => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  priceRange: [0, 10000],
  starRating: [],
  amenities: [],
  boardType: [],
  cancellationPolicy: [],
  transferType: [],
};

const DEFAULT_SORT: SortOptions = {
  sortBy: "recommended",
};

export const useSearchStore = create<SearchState>((set) => ({
  searchMode: "destination",
  setSearchMode: (mode) => set({ searchMode: mode }),

  searchParams: {
    checkIn: "",
    checkOut: "",
    adults: 2,
    rooms: 1,
  },
  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  vibeSearchParams: null,
  setVibeSearchParams: (params) => set({ vibeSearchParams: params }),

  filters: DEFAULT_FILTERS,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  sortOptions: DEFAULT_SORT,
  setSortOptions: (options) => set({ sortOptions: options }),

  recentSearches: [],
  addRecentSearch: (search) =>
    set((state) => {
      const newSearch = {
        ...search,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      const filtered = state.recentSearches.filter(
        (s) => s.query !== search.query
      );
      return {
        recentSearches: [newSearch, ...filtered].slice(0, 5), // Keep only 5 recent searches
      };
    }),
  clearRecentSearches: () => set({ recentSearches: [] }),
}));
