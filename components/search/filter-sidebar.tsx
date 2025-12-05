"use client";

import { useState } from "react";
import { Sliders, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  onFilterChange?: (filters: Filters) => void;
  className?: string;
}

export interface Filters {
  priceRange: [number, number];
  starRating: number[];
  amenities: string[];
  boardType: string[];
}

const amenitiesList = [
  "Pool",
  "Spa",
  "Restaurant",
  "Bar",
  "Gym",
  "Beach Access",
  "Water Sports",
  "Diving Center",
  "Kids Club",
  "WiFi",
];

const boardTypes = [
  { value: "room-only", label: "Room Only" },
  { value: "breakfast", label: "Breakfast Included" },
  { value: "half-board", label: "Half Board" },
  { value: "full-board", label: "Full Board" },
  { value: "all-inclusive", label: "All Inclusive" },
];

export function FilterSidebar({ onFilterChange, className }: FilterSidebarProps) {
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 5000],
    starRating: [],
    amenities: [],
    boardType: [],
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleArrayFilter = <K extends keyof Filters>(
    key: K,
    value: string | number
  ) => {
    const currentArray = filters[key] as (string | number)[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as Filters[K]);
  };

  const clearFilters = () => {
    const defaultFilters: Filters = {
      priceRange: [0, 5000],
      starRating: [],
      amenities: [],
      boardType: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm border p-4", className)}>
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Filters
          </span>
          <span className="text-xs text-muted-foreground">
            {filters.starRating.length + filters.amenities.length + filters.boardType.length} selected
          </span>
        </Button>
      </div>

      <div className={cn("space-y-6", !isExpanded && "hidden lg:block", "lg:mt-0 mt-4")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Filters</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground"
          >
            Clear all
          </Button>
        </div>

        <Separator />

        {/* Star Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Star Rating</Label>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <Button
                key={stars}
                variant={filters.starRating.includes(stars) ? "default" : "outline"}
                size="sm"
                className="gap-1"
                onClick={() => toggleArrayFilter("starRating", stars)}
              >
                {stars}
                <Star className="h-3 w-3 fill-current" />
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Price per night</Label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                updateFilter("priceRange", [
                  parseInt(e.target.value) || 0,
                  filters.priceRange[1],
                ])
              }
              className="w-20 h-9 px-2 text-sm border rounded-md"
              placeholder="Min"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                updateFilter("priceRange", [
                  filters.priceRange[0],
                  parseInt(e.target.value) || 5000,
                ])
              }
              className="w-20 h-9 px-2 text-sm border rounded-md"
              placeholder="Max"
            />
            <span className="text-sm text-muted-foreground">USD</span>
          </div>
        </div>

        <Separator />

        {/* Board Type */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Board Type</Label>
          <div className="space-y-2">
            {boardTypes.map((board) => (
              <label
                key={board.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center",
                    filters.boardType.includes(board.value)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  )}
                  onClick={() => toggleArrayFilter("boardType", board.value)}
                >
                  {filters.boardType.includes(board.value) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{board.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Amenities */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div
                  className={cn(
                    "h-4 w-4 rounded border flex items-center justify-center",
                    filters.amenities.includes(amenity)
                      ? "bg-primary border-primary"
                      : "border-gray-300"
                  )}
                  onClick={() => toggleArrayFilter("amenities", amenity)}
                >
                  {filters.amenities.includes(amenity) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-xs">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
