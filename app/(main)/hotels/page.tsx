"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Grid, List, SlidersHorizontal, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b py-4 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SearchForm variant="compact" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Unable to load hotels</p>
              <p className="text-sm text-yellow-700 mt-1">{error}</p>
              <p className="text-xs text-yellow-600 mt-2">
                Please try again later or contact support if the issue persists.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-stix text-2xl font-bold">Hotels in Maldives</h1>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${filteredHotels.length} properties found`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <Select value={sortBy} onValueChange={handleSort}>
                  <SelectTrigger className="w-44">
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
                <div className="hidden sm:flex items-center border rounded-md">
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="rounded-l-none"
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
