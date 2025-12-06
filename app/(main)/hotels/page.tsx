"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchForm, FilterSidebar, type Filters } from "@/components/search";
import { ListViewCard, FiltersSortBar, FloatingMapButton } from "@/components/travel";
import { RecommendedCard } from "@/components/travel";
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

  // Calculate active filters count
  const getActiveFiltersCount = useCallback(() => {
    // This is a placeholder - in real implementation, track filters state
    return 0;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24 pt-[72px]">
      {/* Search Header */}
      <div className="bg-white shadow-header border-b border-border/50 py-4 sticky top-[72px] z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchForm variant="compact" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-5 bg-amber-50 border border-amber-200 rounded-20 flex items-start gap-4 shadow-card">
            <div className="w-10 h-10 rounded-12 bg-amber-100 flex items-center justify-center flex-shrink-0">
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
                className="mt-4 rounded-12 border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={fetchHotels}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`w-full lg:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Results */}
          <div className="flex-1">
            {/* Page Title */}
            <div className="mb-4">
              <h1 className="font-stix text-2xl md:text-3xl font-bold text-foreground">Hotels in Maldives</h1>
            </div>

            {/* Filter/Sort Bar */}
            <FiltersSortBar
              totalResults={filteredHotels.length}
              sortBy={sortBy}
              onSortChange={handleSort}
              onFilterClick={() => setShowFilters(!showFilters)}
              activeFiltersCount={getActiveFiltersCount()}
              className="mb-6"
            />

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-4 py-2 rounded-12 text-sm font-medium transition-colors ${
                  viewMode === "list" 
                    ? "bg-primary text-white" 
                    : "bg-white border-2 border-border hover:border-primary/50"
                }`}
              >
                <List className="h-4 w-4" />
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-12 text-sm font-medium transition-colors ${
                  viewMode === "grid" 
                    ? "bg-primary text-white" 
                    : "bg-white border-2 border-border hover:border-primary/50"
                }`}
              >
                <Grid className="h-4 w-4" />
                Grid
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-20 shadow-card p-4 animate-pulse">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-48 h-40 bg-gray-200 rounded-16"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 rounded w-24 mt-4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hotel List View */}
            {!isLoading && viewMode === "list" && (
              <div className="space-y-4">
                {filteredHotels.map((hotel) => (
                  <ListViewCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}

            {/* Hotel Grid View */}
            {!isLoading && viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHotels.map((hotel) => (
                  <RecommendedCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredHotels.length === 0 && (
              <div className="text-center py-16 bg-white rounded-20 border border-border/50 shadow-card">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">No hotels found matching your criteria</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your filters or search for a different destination.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Map Button */}
      <FloatingMapButton 
        onClick={() => {
          // TODO: Implement map view
          console.log("Open map view");
        }}
      />
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hotels...</p>
        </div>
      </div>
    }>
      <HotelsContent />
    </Suspense>
  );
}
