import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Wifi, UtensilsCrossed, Waves } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Hotel } from "@/lib/liteapi/types";

interface HotelCardProps {
  hotel: Hotel;
  variant?: "default" | "compact" | "featured";
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  restaurant: UtensilsCrossed,
  pool: Waves,
};

export function HotelCard({ hotel, variant = "default" }: HotelCardProps) {
  const primaryImage = hotel.images?.find((img) => img.isPrimary)?.url || hotel.images?.[0]?.url;
  
  if (variant === "compact") {
    return (
      <Link href={`/hotels/${hotel.id}`}>
        <Card className="overflow-hidden hover:shadow-md transition-shadow group">
          <div className="flex gap-4 p-3">
            <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={hotel.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{hotel.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {hotel.minRate && (
                <p className="mt-1 text-sm">
                  From{" "}
                  <span className="font-semibold text-primary">
                    {formatCurrency(hotel.minRate.amount, hotel.minRate.currency)}
                  </span>
                  /night
                </p>
              )}
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/hotels/${hotel.id}`}>
        <Card className="overflow-hidden hover:shadow-xl transition-all group h-full">
          <div className="relative aspect-[4/3]">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="font-stix text-xl font-semibold">{hotel.name}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: hotel.starRating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                {hotel.address?.city && (
                  <span className="text-sm text-white/80">
                    • {hotel.address.city}
                  </span>
                )}
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            {hotel.minRate && (
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-xl font-bold text-primary">
                  {formatCurrency(hotel.minRate.amount, hotel.minRate.currency)}
                  <span className="text-sm font-normal text-muted-foreground">/night</span>
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/hotels/${hotel.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all group">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:w-72 flex-shrink-0">
            {primaryImage ? (
              <Image
                src={primaryImage}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center min-h-[200px]">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            {hotel.reviews && (
              <Badge className="absolute top-3 left-3 bg-white text-gray-900">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {hotel.reviews.rating.toFixed(1)}
              </Badge>
            )}
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-4 md:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-stix text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {hotel.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {Array.from({ length: hotel.starRating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {hotel.address?.city && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {hotel.address.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {hotel.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {hotel.description}
                </p>
              )}

              {/* Amenities */}
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotel.amenities.slice(0, 4).map((amenity) => {
                    const IconComponent = amenityIcons[amenity.toLowerCase()];
                    return (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                        {amenity}
                      </Badge>
                    );
                  })}
                  {hotel.amenities.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{hotel.amenities.length - 4} more
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Price & CTA */}
            <div className="flex items-end justify-between mt-4 pt-4 border-t">
              <div>
                {hotel.minRate && (
                  <>
                    <span className="text-sm text-muted-foreground">From</span>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(hotel.minRate.amount, hotel.minRate.currency)}
                    </p>
                    <span className="text-xs text-muted-foreground">per night</span>
                  </>
                )}
              </div>
              <Button>View Details</Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}
