import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WishlistItem, WishlistState } from "@/types";

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.hotelId === item.hotelId);
        if (!existingItem) {
          set((state) => ({
            items: [
              ...state.items,
              {
                ...item,
                addedAt: Date.now(),
              },
            ],
          }));
        }
      },

      removeItem: (hotelId) => {
        set((state) => ({
          items: state.items.filter((item) => item.hotelId !== hotelId),
        }));
      },

      isInWishlist: (hotelId) => {
        return get().items.some((item) => item.hotelId === hotelId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: "mv-travel-wishlist", // localStorage key
    }
  )
);
