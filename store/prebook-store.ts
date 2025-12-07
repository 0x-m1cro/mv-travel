import { create } from "zustand";
import { PrebookResponse } from "@/types";

interface PrebookState {
  prebookData: PrebookResponse | null;
  setPrebookData: (data: PrebookResponse) => void;
  clearPrebookData: () => void;
  isExpired: () => boolean;
}

export const usePrebookStore = create<PrebookState>((set, get) => ({
  prebookData: null,

  setPrebookData: (data) => {
    set({ prebookData: data });
  },

  clearPrebookData: () => {
    set({ prebookData: null });
  },

  isExpired: () => {
    const data = get().prebookData;
    if (!data) return true;
    return new Date(data.expiresAt) < new Date();
  },
}));
