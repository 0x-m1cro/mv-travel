// Wishlist-related types for the Maldives OTA application

export interface WishlistItem {
  hotelId: string;
  hotelName: string;
  starRating: number;
  location?: string;
  image?: string;
  minRate?: {
    amount: number;
    currency: string;
  };
  addedAt: number; // Timestamp
}

export interface WishlistState {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, "addedAt">) => void;
  removeItem: (hotelId: string) => void;
  isInWishlist: (hotelId: string) => boolean;
  clearWishlist: () => void;
}
