"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hotel } from "@/lib/liteapi/types";
import { WishlistButton } from "@/components/shared";

interface RecommendedCardProps {
  hotel: Hotel;
  className?: string;
}

export function RecommendedCard({ hotel, className }: RecommendedCardProps) {
  const primaryImage = hotel.images?.find((img) => img.isPrimary)?.url || hotel.images?.[0]?.url;

  return (
    <Link href={`/hotels/${hotel.id}`} className={cn("block", className)}>
      <div className="bg-white rounded-20 shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover group">
        {/* Image Container */}
        <div className="relative aspect-card overflow-hidden">
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

          {/* Rating Badge */}
          {hotel.reviews && (
            <div className="absolute bottom-3 left-3 rating-badge">
              <Star className="h-3 w-3 fill-white" />
              <span>{hotel.reviews.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Star Rating */}
          <div className="flex items-center gap-0.5 mb-2">
            {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>

          {/* Hotel Name */}
          <h3 className="font-semibold text-foreground text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>

          {/* Location */}
          {hotel.address?.city && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{hotel.address.city}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">From</span>
            {hotel.minRate ? (
              <>
                <span className="price-tag">${hotel.minRate.amount.toLocaleString()}</span>
                <span className="price-tag-small">/ night</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Check availability</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

interface RecommendedCarouselProps {
  hotels: Hotel[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export function RecommendedCarousel({ 
  hotels, 
  title = "Recommended for You",
  subtitle,
  className 
}: RecommendedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className={cn("py-8", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground font-stix">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Carousel Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={cn(
              "carousel-control",
              !canScrollLeft && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={cn(
              "carousel-control",
              !canScrollRight && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-hidden px-4 sm:px-6 pb-2"
      >
        {hotels.map((hotel) => (
          <div key={hotel.id} className="flex-shrink-0 w-[280px]">
            <RecommendedCard hotel={hotel} />
          </div>
        ))}
      </div>
    </section>
  );
}
