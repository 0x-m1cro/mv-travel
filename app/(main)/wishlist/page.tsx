"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, X, Star, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlistStore } from "@/store";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Heart className="h-4 w-4 fill-primary" />
            Your Collection
          </div>
          <h1 className="font-stix text-3xl md:text-4xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="mt-3 text-muted-foreground">
            {items.length === 0
              ? "Your saved resorts will appear here"
              : `You have ${items.length} saved ${items.length === 1 ? "resort" : "resorts"}`}
          </p>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-border/50 shadow-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/10 to-cyan-500/10 flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-stix text-2xl font-semibold text-gray-900 mb-3">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Start exploring our collection of luxury Maldives resorts and save your favorites for later.
            </p>
            <Button asChild className="rounded-xl px-8 shadow-lg hover:shadow-xl">
              <Link href="/hotels">
                <Sparkles className="h-4 w-4 mr-2" />
                Discover Resorts
              </Link>
            </Button>
          </div>
        )}

        {/* Wishlist Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.hotelId)}
                  className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all group/btn"
                  aria-label="Remove from wishlist"
                >
                  <X className="h-4 w-4 text-gray-600 group-hover/btn:text-red-600" />
                </button>

                <Link href={`/hotels/${item.hotelId}`}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.hotelName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    
                    {/* Star Rating Badge */}
                    <div className="absolute top-3 left-3">
                      <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-900 shadow-lg">
                        {item.starRating}★ Resort
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-stix text-xl font-semibold drop-shadow-lg line-clamp-2">
                        {item.hotelName}
                      </h3>
                      {item.location && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-white/80">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-muted-foreground">From</span>
                      {item.minRate ? (
                        <span className="text-2xl font-bold text-primary">
                          ${item.minRate.amount.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground">/night</span>
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Check availability</span>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Looking for more options?
            </p>
            <Button variant="outline" asChild className="rounded-xl border-2 hover:bg-primary hover:text-white hover:border-primary">
              <Link href="/hotels">Browse All Resorts</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
