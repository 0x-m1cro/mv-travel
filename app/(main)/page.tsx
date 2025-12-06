import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Shield, Clock, Award, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSection, RecommendedCarousel } from "@/components/travel";
import { liteApiClient } from "@/lib/liteapi/client";
import type { Hotel } from "@/lib/liteapi/types";

// Static data for destinations and testimonials (CMS content)
const destinations = [
  {
    name: "Malé Atoll",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600",
    hotels: 45,
    tagline: "Heart of Maldives",
  },
  {
    name: "Ari Atoll",
    image: "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=600",
    hotels: 32,
    tagline: "Diving Paradise",
  },
  {
    name: "Baa Atoll",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    hotels: 18,
    tagline: "UNESCO Biosphere",
  },
  {
    name: "Lhaviyani Atoll",
    image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=600",
    hotels: 12,
    tagline: "Hidden Gem",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    text: "An absolutely magical experience! The booking process was seamless and the resort exceeded all expectations.",
    rating: 5,
    avatar: "S",
  },
  {
    name: "Michael Chen",
    location: "Singapore",
    text: "Best vacation of our lives. MV Travel made everything so easy. Will definitely use them again!",
    rating: 5,
    avatar: "M",
  },
  {
    name: "Emma Williams",
    location: "London, UK",
    text: "From start to finish, the service was impeccable. The Maldives is paradise and this team knows it well.",
    rating: 5,
    avatar: "E",
  },
];

const features = [
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description: "We guarantee the best rates for your Maldives getaway.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our travel experts are available round the clock to assist you.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Curated Selection",
    description: "Only the finest resorts hand-picked by our team of experts.",
    color: "from-amber-500 to-orange-500",
  },
];

// Fetch featured hotels from LiteAPI
async function getFeaturedHotels(): Promise<Hotel[]> {
  try {
    const result = await liteApiClient.getMaldivesHotels({ limit: 8 });
    if (result.success && result.data?.hotels) {
      return result.data.hotels.slice(0, 8);
    }
  } catch (error) {
    console.error("Error fetching featured hotels:", error);
  }
  return [];
}

export default async function HomePage() {
  // Fetch featured hotels from LiteAPI
  const featuredHotels = await getFeaturedHotels();
  
  return (
    <div className="flex flex-col">
      {/* New Hero Section with integrated search card */}
      <HeroSection />

      {/* Recommended Hotels Carousel */}
      {featuredHotels.length > 0 && (
        <RecommendedCarousel 
          hotels={featuredHotels} 
          title="Recommended for You"
          subtitle="Hand-picked luxury accommodations"
          className="bg-white"
        />
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-border/50"
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Heart className="h-4 w-4" />
                Hand-picked for you
              </div>
              <h2 className="font-stix text-3xl md:text-4xl font-bold text-gray-900">
                Featured Resorts
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg">
                Handpicked luxury accommodations for an unforgettable Maldivian experience
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex rounded-xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all">
              <Link href="/hotels">View All Hotels</Link>
            </Button>
          </div>

          {featuredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHotels.map((hotel) => {
                const primaryImage = hotel.images?.find((img) => img.isPrimary)?.url || hotel.images?.[0]?.url;
                return (
                  <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group h-full border-0 shadow-lg">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                        <div className="absolute top-4 right-4">
                          <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-900 shadow-lg">
                            {hotel.starRating}★ Resort
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-stix text-xl font-semibold drop-shadow-lg">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            {hotel.address?.city && (
                              <span className="text-sm text-white/80 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {hotel.address.city}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {hotel.description || "Experience luxury in the heart of the Maldives"}
                        </p>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-muted-foreground">From</span>
                          {hotel.minRate ? (
                            <span className="text-2xl font-bold text-primary">
                              ${hotel.minRate.amount.toLocaleString()}
                              <span className="text-sm font-normal text-muted-foreground">/night</span>
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Check availability</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-border/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-6">
                Featured hotels are loading from LiteAPI...
              </p>
              <Button asChild className="rounded-xl">
                <Link href="/hotels">Browse All Hotels</Link>
              </Button>
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Button asChild className="rounded-xl">
              <Link href="/hotels">View All Hotels</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MapPin className="h-4 w-4" />
              Popular Destinations
            </div>
            <h2 className="font-stix text-3xl md:text-4xl font-bold text-gray-900">
              Explore Maldives Atolls
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              From the bustling capital to remote private islands, discover the diverse beauty of the Maldives archipelago
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.name} href={`/destinations/${destination.name.toLowerCase().replace(" ", "-")}`}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                      {destination.tagline}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="font-stix text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm text-white/80 mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {destination.hotels} properties
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-4">
              <Star className="h-4 w-4 fill-amber-500" />
              Testimonials
            </div>
            <h2 className="font-stix text-3xl md:text-4xl font-bold text-gray-900">
              What Our Travelers Say
            </h2>
            <p className="mt-3 text-muted-foreground">
              Real experiences from real travelers who explored paradise with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6 hover:shadow-xl transition-all duration-300 border border-border/50">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-cyan-600 to-teal-600 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white/90 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Start Your Journey Today
          </div>
          <h2 className="font-stix text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto">
            Ready for Your Maldives Adventure?
          </h2>
          <p className="mt-6 text-white/90 max-w-2xl mx-auto text-lg">
            Start planning your dream vacation today. Our team of travel experts is ready to help you create the perfect tropical getaway.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button size="xl" variant="secondary" asChild className="rounded-xl shadow-lg hover:shadow-xl bg-white text-primary hover:bg-gray-100">
              <Link href="/hotels">Browse Hotels</Link>
            </Button>
            <Button size="xl" variant="outline" className="bg-transparent text-white border-2 border-white/40 hover:bg-white/10 rounded-xl backdrop-blur-sm" asChild>
              <Link href="/about">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
