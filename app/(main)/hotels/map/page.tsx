"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, X, List, Search, Star, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Hotel } from "@/lib/liteapi/types";

export default function MapViewPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/search?limit=50");
        const result = await response.json();
        
        if (result.success && result.data?.hotels) {
          setHotels(result.data.hotels);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-stix text-2xl font-bold flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Map View
              </h1>
              <span className="text-sm text-muted-foreground">
                {hotels.length} hotels
              </span>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/hotels">
                <List className="h-4 w-4 mr-2" />
                List View
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-cyan-50">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Simulated Map Background */}
            <div className="absolute inset-0">
              <div className="relative w-full h-full">
                {/* Map Grid Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Maldives Text Overlay */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                  <p className="text-6xl font-stix font-bold text-gray-200">Maldives</p>
                  <p className="text-xl text-gray-400 mt-2">Indian Ocean</p>
                </div>

                {/* Hotel Markers */}
                <div className="absolute inset-0 p-8">
                  {hotels.slice(0, 20).map((hotel, index) => {
                    // Generate pseudo-random positions for demo
                    const top = 20 + (index * 37) % 60;
                    const left = 15 + (index * 43) % 70;
                    
                    return (
                      <button
                        key={hotel.id}
                        onClick={() => setSelectedHotel(hotel)}
                        className="absolute group"
                        style={{ top: `${top}%`, left: `${left}%` }}
                      >
                        {/* Marker Pin */}
                        <div className="relative">
                          <MapPin className="h-8 w-8 text-primary drop-shadow-lg group-hover:scale-125 transition-transform" />
                          
                          {/* Price Badge */}
                          {hotel.minRate && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                              <div className="bg-white px-2 py-1 rounded-full shadow-lg border-2 border-primary text-xs font-bold text-primary group-hover:scale-110 transition-transform">
                                ${hotel.minRate.amount}
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Hotel Card */}
            {selectedHotel && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
                <Card className="shadow-2xl border-0 relative">
                  <button
                    onClick={() => setSelectedHotel(null)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center shadow-md z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: selectedHotel.starRating || 0 }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <h3 className="font-stix text-xl font-bold text-gray-900">
                          {selectedHotel.name}
                        </h3>
                        {selectedHotel.address?.city && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {selectedHotel.address.city}
                          </p>
                        )}
                      </div>

                      {selectedHotel.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {selectedHotel.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          {selectedHotel.minRate ? (
                            <p className="text-2xl font-bold text-primary">
                              ${selectedHotel.minRate.amount}
                              <span className="text-sm font-normal text-muted-foreground">/night</span>
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Check availability</p>
                          )}
                        </div>
                        <Button asChild className="rounded-xl">
                          <Link href={`/hotels/${selectedHotel.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Instructions Overlay */}
            {!selectedHotel && !isLoading && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-border/50">
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    Click on a marker to see hotel details
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
