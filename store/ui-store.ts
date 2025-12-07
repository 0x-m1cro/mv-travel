import { create } from "zustand";

interface UIState {
  // Modal states
  isSearchModalOpen: boolean;
  isFilterModalOpen: boolean;
  isAuthModalOpen: boolean;

  // Loading states
  isSearching: boolean;
  isBooking: boolean;

  // Error states
  error: string | null;

  // Actions
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  setSearching: (loading: boolean) => void;
  setBooking: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSearchModalOpen: false,
  isFilterModalOpen: false,
  isAuthModalOpen: false,
  isSearching: false,
  isBooking: false,
  error: null,

  openSearchModal: () => set({ isSearchModalOpen: true }),
  closeSearchModal: () => set({ isSearchModalOpen: false }),
  openFilterModal: () => set({ isFilterModalOpen: true }),
  closeFilterModal: () => set({ isFilterModalOpen: false }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setSearching: (loading) => set({ isSearching: loading }),
  setBooking: (loading) => set({ isBooking: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
