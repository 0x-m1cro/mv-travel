"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Star,
  MapPin,
  Wifi,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Sparkles,
  Users,
  Calendar,
  Check,
  ChevronLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addDays } from "date-fns";
import type { Hotel, AvailabilityResponse, Room } from "@/lib/liteapi/types";

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  restaurant: UtensilsCrossed,
  pool: Waves,
  gym: Dumbbell,
  spa: Sparkles,
};

type PageProps = {
  params: Promise<{ hotelId: string }>;
};

export default function HotelDetailPage({ params }: PageProps) {
  const { hotelId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Booking form state
  const [checkIn, setCheckIn] = useState(
    searchParams.get("checkIn") || format(addDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("checkOut") || format(addDays(new Date(), 14), "yyyy-MM-dd")
  );
  const [guests, setGuests] = useState(parseInt(searchParams.get("adults") || "2"));

  // Fetch hotel details
  useEffect(() => {
    const fetchHotel = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/hotels/${hotelId}`);
        const result = await response.json();

        if (result.success && result.data) {
          setHotel(result.data);
        } else {
          setError(result.error?.message || "Failed to load hotel details");
        }
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setError("Failed to connect to the server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  // Check availability
  const checkAvailability = async () => {
    setIsLoadingRooms(true);
    setAvailability(null);

    try {
      const params = new URLSearchParams({
        hotelId,
        checkIn,
        checkOut,
        adults: guests.toString(),
        guestNationality: "US",
        currency: "USD",
      });

      const response = await fetch(`/api/availability?${params.toString()}`);
      const result = await response.json();

      if (result.success && result.data) {
        setAvailability(result.data);
      } else {
        setAvailability(null);
      }
    } catch (err) {
      console.error("Error checking availability:", err);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const handleSelectRoom = (room: Room, rateId: string) => {
    const params = new URLSearchParams({
      hotelId,
      offerId: room.offerId,
      rateId,
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/booking?${params.toString()}`);
  };

  if (isLoading) {
    return <HotelDetailSkeleton />;
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gray-50 border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/hotels" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to search results
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h1 className="font-stix text-2xl font-bold mb-2">Unable to load hotel</h1>
            <p className="text-muted-foreground mb-4">{error || "Hotel not found"}</p>
            <Button asChild>
              <Link href="/hotels">Browse Hotels</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const primaryImage = hotel.images?.find((img) => img.isPrimary)?.url || hotel.images?.[0]?.url;

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/hotels" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to search results
            </Link>
          </Button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-100">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={hotel.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
      </div>

      {/* Hotel Info */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                {hotel.address?.city && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {hotel.address.city}, {hotel.address.country || "Maldives"}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-stix text-3xl md:text-4xl font-bold">{hotel.name}</h1>
              
              {hotel.reviews && (
                <div className="flex items-center gap-4 mt-4">
                  <Badge className="bg-primary text-white px-3 py-1">
                    <Star className="h-4 w-4 fill-white mr-1" />
                    {hotel.reviews.rating}
                  </Badge>
                  <span className="text-muted-foreground">
                    Based on {hotel.reviews.count} reviews
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            {hotel.description && (
              <>
                <div>
                  <h2 className="font-stix text-2xl font-semibold mb-4">About This Resort</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {hotel.description}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <>
                <div>
                  <h2 className="font-stix text-2xl font-semibold mb-4">Amenities & Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hotel.amenities.map((amenity) => {
                      const IconComponent = amenityIcons[amenity.toLowerCase()] || Check;
                      return (
                        <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Rooms Section */}
            <div>
              <h2 className="font-stix text-2xl font-semibold mb-6">Available Rooms</h2>
              
              {/* Availability Check Form */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Check-in</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Check-out</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={checkAvailability} disabled={isLoadingRooms} className="w-full">
                        {isLoadingRooms ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Check Availability"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rooms List */}
              {availability && availability.rooms.length > 0 ? (
                <div className="space-y-4">
                  {availability.rooms.map((room) => (
                    <Card key={room.offerId} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{room.name}</h3>
                            {room.description && (
                              <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Up to {room.maxOccupancy} guests
                              </span>
                              {room.bedType && <span>{room.bedType}</span>}
                            </div>

                            {room.amenities && room.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {room.amenities.slice(0, 4).map((amenity) => (
                                  <Badge key={amenity} variant="secondary" className="text-xs">
                                    {amenity}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Rates */}
                          <div className="space-y-3 min-w-[200px]">
                            {room.rates.map((rate) => (
                              <div key={rate.rateId} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {rate.boardName || rate.boardType}
                                  </span>
                                  {rate.cancellationPolicy?.refundable && (
                                    <Badge variant="outline" className="text-xs text-green-600">
                                      Refundable
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-end justify-between">
                                  <div>
                                    <span className="text-xl font-bold text-primary">
                                      ${rate.price.amount.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-muted-foreground block">
                                      {rate.price.currency}
                                    </span>
                                  </div>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleSelectRoom(room, rate.rateId)}
                                  >
                                    Select
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : availability ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">No rooms available for the selected dates.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try different dates or contact the hotel.</p>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-muted-foreground">Select your dates and check availability to see room options.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Book Your Stay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Check-out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Separator />

                {hotel.minRate && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Starting from</span>
                      <span className="font-semibold">
                        ${hotel.minRate.amount.toLocaleString()}/night
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={checkAvailability}
                  disabled={isLoadingRooms}
                >
                  {isLoadingRooms ? "Checking..." : "Check Availability"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation available on select rates
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function HotelDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Skeleton className="aspect-[21/9] rounded-xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Separator />
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
