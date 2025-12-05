"use client";

import { HotelCard } from "./hotel-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Hotel } from "@/lib/liteapi/types";

interface HotelListProps {
  hotels: Hotel[];
  isLoading?: boolean;
  variant?: "default" | "grid";
}

export function HotelList({ hotels, isLoading, variant = "default" }: HotelListProps) {
  if (isLoading) {
    return (
      <div className={variant === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <HotelCardSkeleton key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hotels found matching your criteria.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search for a different destination.
        </p>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} variant="featured" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
}

function HotelCardSkeleton({ variant }: { variant: "default" | "grid" }) {
  if (variant === "grid") {
    return (
      <div className="rounded-xl border overflow-hidden">
        <Skeleton className="aspect-[4/3]" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row rounded-xl border overflow-hidden">
      <Skeleton className="aspect-[4/3] md:aspect-auto md:w-72 md:h-52" />
      <div className="flex-1 p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  );
}
