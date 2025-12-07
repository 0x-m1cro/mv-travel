"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  SlidersHorizontal, 
  ChevronDown,
  Wifi,
  Car,
  Utensils,
  Waves,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotel } from "@/lib/liteapi/types";
import { WishlistButton } from "@/components/shared";

interface ListViewCardProps {
  hotel: Hotel;
  className?: string;
}

export function ListViewCard({ hotel, className }: ListViewCardProps) {
  const primaryImage = hotel.images?.find((img) => img.isPrimary)?.url || hotel.images?.[0]?.url;

  // Sample amenities for display
  const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi className="h-3.5 w-3.5" />,
    parking: <Car className="h-3.5 w-3.5" />,
    restaurant: <Utensils className="h-3.5 w-3.5" />,
    pool: <Waves className="h-3.5 w-3.5" />,
  };

  return (
    <Link href={`/hotels/${hotel.id}`} className={cn("block", className)}>
      <div className="bg-white rounded-20 shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover group">
        <div className="flex flex-col sm:flex-row">
          {/* Image Container */}
          <div className="relative w-full sm:w-48 md:w-56 flex-shrink-0">
            <div className="aspect-card sm:aspect-square h-full">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              
              {/* Wishlist Button */}
              <div className="absolute top-3 right-3">
                <WishlistButton
                  hotelId={hotel.id}
                  hotelName={hotel.name}
                  starRating={hotel.starRating}
                  location={hotel.address?.city}
                  image={primaryImage}
                  minRate={hotel.minRate}
                  className="w-8 h-8"
                />
              </div>

              {/* Deal Badge */}
              <div className="absolute top-3 left-3 hotel-badge">
                Great Deal
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1">
              {/* Header with Rating */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  {/* Hotel Name */}
                  <h3 className="font-semibold text-foreground text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {hotel.name}
                  </h3>
                </div>

                {/* Guest Rating */}
                {hotel.reviews && (
                  <div className="flex flex-col items-end flex-shrink-0">
                    <div className="rating-badge">
                      {hotel.reviews.rating.toFixed(1)}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {hotel.reviews.count || 0} reviews
                    </span>
                  </div>
                )}
              </div>

              {/* Location */}
              {hotel.address?.city && (
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="line-clamp-1">
                    {hotel.address.city}
                    {hotel.address.country && `, ${hotel.address.country}`}
                  </span>
                </div>
              )}

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {hotel.amenities.slice(0, 4).map((amenity) => (
                    <span key={`amenity-${amenity}`} className="amenity-tag">
                      {amenityIcons[amenity.toLowerCase()] || <Check className="h-3.5 w-3.5" />}
                      <span className="capitalize">{amenity}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {hotel.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 hidden md:block">
                  {hotel.description}
                </p>
              )}
            </div>

            {/* Footer with Price */}
            <div className="flex items-end justify-between pt-3 mt-auto border-t border-border/50">
              <div>
                <span className="text-xs text-muted-foreground">From</span>
                {hotel.minRate ? (
                  <div className="flex items-baseline gap-1">
                    <span className="price-tag text-xl">${hotel.minRate.amount.toLocaleString()}</span>
                    <span className="price-tag-small">/ night</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Check availability</span>
                )}
              </div>
              <button 
                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-12 hover:bg-primary/90 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                View Deal
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface FiltersSortBarProps {
  totalResults: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFilterClick: () => void;
  activeFiltersCount?: number;
  className?: string;
}

export function FiltersSortBar({
  totalResults,
  sortBy,
  onSortChange,
  onFilterClick,
  activeFiltersCount = 0,
  className,
}: FiltersSortBarProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Guest Rating" },
    { value: "stars", label: "Star Rating" },
  ];

  const selectedSort = sortOptions.find(o => o.value === sortBy) || sortOptions[0];

  return (
    <div className={cn("filter-bar flex-wrap justify-between", className)}>
      {/* Results Count */}
      <div className="text-sm text-foreground">
        <span className="font-semibold">{totalResults}</span>
        <span className="text-muted-foreground"> properties found</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2 rounded-12 border-2 border-border hover:border-primary/50 transition-colors bg-white"
        >
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 rounded-12 border-2 border-border hover:border-primary/50 transition-colors bg-white min-w-[160px]"
          >
            <span className="text-sm font-medium flex-1 text-left">{selectedSort.label}</span>
            <ChevronDown className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              showSortDropdown && "rotate-180"
            )} />
          </button>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-16 shadow-card-hover z-50 py-2 min-w-[180px]">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                    option.value === sortBy && "text-primary font-medium"
                  )}
                  onClick={() => {
                    onSortChange(option.value);
                    setShowSortDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
