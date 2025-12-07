"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  hotelId: string;
  hotelName: string;
  starRating: number;
  location?: string;
  image?: string;
  minRate?: {
    amount: number;
    currency: string;
  };
  variant?: "icon" | "button";
  className?: string;
}

export function WishlistButton({
  hotelId,
  hotelName,
  starRating,
  location,
  image,
  minRate,
  variant = "icon",
  className,
}: WishlistButtonProps) {
  const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const inWishlist = isInWishlist(hotelId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inWishlist) {
      removeItem(hotelId);
    } else {
      addItem({
        id: hotelId,
        hotelId,
        hotelName,
        starRating,
        location,
        image,
        minRate,
      });
    }
  };

  if (variant === "button") {
    return (
      <Button
        variant={inWishlist ? "default" : "outline"}
        size="lg"
        onClick={handleToggle}
        className={cn(
          "gap-2 rounded-xl transition-all",
          inWishlist && "bg-red-500 hover:bg-red-600",
          className
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            inWishlist && "fill-white",
            isAnimating && "scale-125"
          )}
        />
        {inWishlist ? "Saved" : "Save to Wishlist"}
      </Button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:scale-110 transition-all group",
        inWishlist && "bg-red-50",
        className
      )}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          inWishlist ? "fill-red-500 text-red-500" : "text-gray-600 group-hover:text-red-500",
          isAnimating && "scale-125"
        )}
      />
    </button>
  );
}
