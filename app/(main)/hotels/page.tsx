"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List, SlidersHorizontal, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm, FilterSidebar, type Filters } from "@/components/search";
import { HotelList } from "@/components/hotels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Hotel } from "@/lib/liteapi/types";

function HotelsContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      const checkIn = searchParams.get("checkIn");
      const checkOut = searchParams.get("checkOut");
      const adults = searchParams.get("adults");
      
      if (checkIn) params.set("checkIn", checkIn);
      if (checkOut) params.set("checkOut", checkOut);
      if (adults) params.set("adults", adults);
      params.set("limit", "50");

      const response = await fetch(`/api/search?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data?.hotels) {
        setHotels(result.data.hotels);
        setFilteredHotels(result.data.hotels);
      } else {
        setError(result.error?.message || "Failed to load hotels. Please check your API configuration.");
        setHotels([]);
        setFilteredHotels([]);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
      setError("Failed to connect to the server. Please try again later.");
      setHotels([]);
      setFilteredHotels([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const handleFilterChange = useCallback((filters: Filters) => {
    let filtered = [...hotels];

    // Apply star rating filter
    if (filters.starRating.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.starRating.includes(hotel.starRating)
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (hotel) =>
        !hotel.minRate ||
        (hotel.minRate.amount >= filters.priceRange[0] &&
          hotel.minRate.amount <= filters.priceRange[1])
    );

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        filters.amenities.some((amenity) =>
          hotel.amenities?.some(
            (a) => a.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    setFilteredHotels(filtered);
  }, [hotels]);

  const handleSort = (value: string) => {
    setSortBy(value);
    const sorted = [...filteredHotels];

    switch (value) {
      case "price-low":
        sorted.sort((a, b) => (a.minRate?.amount || 0) - (b.minRate?.amount || 0));
        break;
      case "price-high":
        sorted.sort((a, b) => (b.minRate?.amount || 0) - (a.minRate?.amount || 0));
        break;
      case "rating":
        sorted.sort((a, b) => (b.reviews?.rating || 0) - (a.reviews?.rating || 0));
        break;
      case "stars":
        sorted.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
        break;
      default:
        // Keep original order for "recommended"
        break;
    }

    setFilteredHotels(sorted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Search Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-border/50 py-4 sticky top-18 z-40 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchForm variant="compact" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Unable to load hotels</p>
              <p className="text-sm text-amber-700 mt-1">{error}</p>
              <p className="text-xs text-amber-600 mt-2">
                Please try again later or contact support if the issue persists.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 rounded-xl border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={fetchHotels}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-stix text-2xl md:text-3xl font-bold text-gray-900">Hotels in Maldives</h1>
                <p className="text-muted-foreground mt-1">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      Loading properties...
                    </span>
                  ) : (
                    `${filteredHotels.length} properties found`
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden rounded-xl border-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-48 h-10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="stars">Star Rating</SelectItem>
                    <SelectItem value="rating">Guest Rating</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="hidden sm:flex items-center border-2 border-border/60 rounded-xl overflow-hidden">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-none h-10 w-10"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Hotel List */}
            <HotelList
              hotels={filteredHotels}
              isLoading={isLoading}
              variant={viewMode === "grid" ? "grid" : "default"}
            />

            {/* Empty State */}
            {!isLoading && !error && filteredHotels.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-border/50 shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">No hotels found matching your criteria</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or search for a different destination.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hotels...</p>
        </div>
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}
