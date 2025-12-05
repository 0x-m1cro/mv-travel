import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, MapPin, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchForm } from "@/components/search";
import { liteApiClient } from "@/lib/liteapi/client";
import type { Hotel } from "@/lib/liteapi/types";

// Static data for destinations and testimonials (CMS content)
const destinations = [
  {
    name: "Malé Atoll",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=600",
    hotels: 45,
  },
  {
    name: "Ari Atoll",
    image: "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=600",
    hotels: 32,
  },
  {
    name: "Baa Atoll",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    hotels: 18,
  },
  {
    name: "Lhaviyani Atoll",
    image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=600",
    hotels: 12,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    text: "An absolutely magical experience! The booking process was seamless and the resort exceeded all expectations.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    location: "Singapore",
    text: "Best vacation of our lives. MV Travel made everything so easy. Will definitely use them again!",
    rating: 5,
  },
  {
    name: "Emma Williams",
    location: "London, UK",
    text: "From start to finish, the service was impeccable. The Maldives is paradise and this team knows it well.",
    rating: 5,
  },
];

const features = [
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description: "We guarantee the best rates for your Maldives getaway.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our travel experts are available round the clock to assist you.",
  },
  {
    icon: Award,
    title: "Curated Selection",
    description: "Only the finest resorts hand-picked by our team of experts.",
  },
];

// Fetch featured hotels from LiteAPI
async function getFeaturedHotels(): Promise<Hotel[]> {
  try {
    const result = await liteApiClient.getMaldivesHotels({ limit: 6 });
    if (result.success && result.data?.hotels) {
      return result.data.hotels.slice(0, 3);
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
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920"
            alt="Maldives Paradise"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="font-stix text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Discover Paradise in the Maldives
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-xl">
              Experience crystal-clear waters, pristine beaches, and world-class luxury resorts. 
              Your dream vacation awaits in the tropical paradise of the Maldives.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link href="/hotels">
                  Explore Hotels
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                <Link href="/destinations">View Destinations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form Section */}
      <section className="relative z-20 -mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <SearchForm variant="hero" />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="mt-1 text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-stix text-3xl md:text-4xl font-bold">
                Featured Resorts
              </h2>
              <p className="mt-2 text-muted-foreground">
                Handpicked luxury accommodations for an unforgettable stay
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/hotels">View All Hotels</Link>
            </Button>
          </div>

          {featuredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel) => {
                const primaryImage = hotel.images?.find((img) => img.isPrimary)?.url || hotel.images?.[0]?.url;
                return (
                  <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
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
                            <span className="text-gray-400">No image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-stix text-xl font-semibold">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            {hotel.address?.city && (
                              <span className="text-sm text-white/80">• {hotel.address.city}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {hotel.description || "Experience luxury in the heart of the Maldives"}
                        </p>
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm text-muted-foreground">From</span>
                          {hotel.minRate ? (
                            <span className="text-xl font-bold text-primary">
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
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-muted-foreground mb-4">
                Featured hotels are loading from LiteAPI...
              </p>
              <Button asChild>
                <Link href="/hotels">Browse All Hotels</Link>
              </Button>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link href="/hotels">View All Hotels</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-stix text-3xl md:text-4xl font-bold">
              Explore Maldives Destinations
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              From the bustling capital to remote private islands, discover the diverse atolls of the Maldives
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.name} href={`/destinations/${destination.name.toLowerCase().replace(" ", "-")}`}>
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-stix text-xl font-semibold">{destination.name}</h3>
                    <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {destination.hotels} hotels
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-stix text-3xl md:text-4xl font-bold">
              What Our Travelers Say
            </h2>
            <p className="mt-2 text-muted-foreground">
              Real experiences from real travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">&quot;{testimonial.text}&quot;</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-stix text-3xl md:text-4xl font-bold text-white">
            Ready for Your Maldives Adventure?
          </h2>
          <p className="mt-4 text-white/90 max-w-2xl mx-auto">
            Start planning your dream vacation today. Our team of travel experts is ready to help you create the perfect getaway.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/hotels">Browse Hotels</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/about">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
