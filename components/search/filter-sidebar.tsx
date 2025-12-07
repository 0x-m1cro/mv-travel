"use client";

import { useState } from "react";
import { Sliders, Star, Check, X } from "lucide-react";
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
  cancellationPolicy: string[];
  transferType: string[];
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

const cancellationPolicies = [
  { value: "refundable", label: "Free Cancellation" },
  { value: "non-refundable", label: "Non-Refundable" },
  { value: "partial-refund", label: "Partial Refund" },
];

const transferTypes = [
  { value: "speedboat", label: "Speedboat Transfer" },
  { value: "seaplane", label: "Seaplane Transfer" },
  { value: "domestic-flight", label: "Domestic Flight" },
  { value: "no-transfer", label: "No Transfer Needed" },
];

export function FilterSidebar({ onFilterChange, className }: FilterSidebarProps) {
  const [filters, setFilters] = useState<Filters>({
    priceRange: [0, 5000],
    starRating: [],
    amenities: [],
    boardType: [],
    cancellationPolicy: [],
    transferType: [],
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
      cancellationPolicy: [],
      transferType: [],
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const activeFiltersCount = filters.starRating.length + filters.amenities.length + filters.boardType.length + filters.cancellationPolicy.length + filters.transferType.length;

  return (
    <div className={cn("bg-white rounded-2xl shadow-lg border border-border/50 p-5", className)}>
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="w-full justify-between rounded-xl h-12 border-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            <span className="font-medium">Filters</span>
          </span>
          {activeFiltersCount > 0 && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      <div className={cn("space-y-6", !isExpanded && "hidden lg:block", "lg:mt-0 mt-5")}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-destructive rounded-lg"
            >
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <Separator className="bg-border/60" />

        {/* Star Rating */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-900">Star Rating</Label>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <Button
                key={stars}
                variant={filters.starRating.includes(stars) ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-1 rounded-xl transition-all",
                  filters.starRating.includes(stars) 
                    ? "shadow-md" 
                    : "border-2 hover:border-primary/50"
                )}
                onClick={() => toggleArrayFilter("starRating", stars)}
              >
                {stars}
                <Star className={cn(
                  "h-3.5 w-3.5",
                  filters.starRating.includes(stars) ? "fill-white text-white" : "fill-amber-400 text-amber-400"
                )} />
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-900">Price per night</Label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  updateFilter("priceRange", [
                    parseInt(e.target.value) || 0,
                    filters.priceRange[1],
                  ])
                }
                className="w-full h-10 pl-7 pr-3 text-sm border-2 rounded-xl transition-colors focus:outline-none focus:border-primary hover:border-primary/50"
                placeholder="Min"
              />
            </div>
            <span className="text-muted-foreground font-medium">—</span>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  updateFilter("priceRange", [
                    filters.priceRange[0],
                    parseInt(e.target.value) || 5000,
                  ])
                }
                className="w-full h-10 pl-7 pr-3 text-sm border-2 rounded-xl transition-colors focus:outline-none focus:border-primary hover:border-primary/50"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Board Type */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-900">Board Type</Label>
          <div className="space-y-2">
            {boardTypes.map((board) => (
              <label
                key={board.value}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                    filters.boardType.includes(board.value)
                      ? "bg-primary border-primary"
                      : "border-gray-300 group-hover:border-primary/50"
                  )}
                  onClick={() => toggleArrayFilter("boardType", board.value)}
                >
                  {filters.boardType.includes(board.value) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{board.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Cancellation Policy */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-900">Cancellation Policy</Label>
          <div className="space-y-2">
            {cancellationPolicies.map((policy) => (
              <label
                key={policy.value}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                    filters.cancellationPolicy.includes(policy.value)
                      ? "bg-primary border-primary"
                      : "border-gray-300 group-hover:border-primary/50"
                  )}
                  onClick={() => toggleArrayFilter("cancellationPolicy", policy.value)}
                >
                  {filters.cancellationPolicy.includes(policy.value) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{policy.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Transfer Type */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-900">Transfer Type</Label>
          <div className="space-y-2">
            {transferTypes.map((transfer) => (
              <label
                key={transfer.value}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                    filters.transferType.includes(transfer.value)
                      ? "bg-primary border-primary"
                      : "border-gray-300 group-hover:border-primary/50"
                  )}
                  onClick={() => toggleArrayFilter("transferType", transfer.value)}
                >
                  {filters.transferType.includes(transfer.value) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{transfer.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-border/60" />

        {/* Amenities */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-gray-900">Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesList.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 cursor-pointer group py-1"
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                    filters.amenities.includes(amenity)
                      ? "bg-primary border-primary"
                      : "border-gray-300 group-hover:border-primary/50"
                  )}
                  onClick={() => toggleArrayFilter("amenities", amenity)}
                >
                  {filters.amenities.includes(amenity) && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <span className="text-xs text-gray-700 group-hover:text-gray-900 transition-colors">{amenity}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
