import Image from "next/image";
import Link from "next/link";
import { MapPin, Hotel, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    id: "male-atoll",
    name: "Malé Atoll",
    description: "The most accessible atoll, home to the capital city and some of the most famous luxury resorts in the world.",
    image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=1200",
    hotels: 45,
    highlights: ["Airport proximity", "Capital city", "Diverse resorts", "Water sports"],
    popularResorts: ["Gili Lankanfushi", "One&Only Reethi Rah", "Anantara Veli"],
  },
  {
    id: "ari-atoll",
    name: "Ari Atoll",
    description: "One of the largest atolls, famous for incredible diving, whale shark sightings, and stunning natural beauty.",
    image: "https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=1200",
    hotels: 32,
    highlights: ["Whale sharks", "Manta rays", "Excellent diving", "White sand beaches"],
    popularResorts: ["Conrad Rangali", "LUX* South Ari", "Centara Grand"],
  },
  {
    id: "baa-atoll",
    name: "Baa Atoll",
    description: "A UNESCO Biosphere Reserve with some of the richest marine life in the Maldives and world-class eco-resorts.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    hotels: 18,
    highlights: ["UNESCO site", "Hanifaru Bay", "Manta season", "Eco-resorts"],
    popularResorts: ["Soneva Fushi", "Four Seasons Landaa", "Amilla Maldives"],
  },
  {
    id: "lhaviyani-atoll",
    name: "Lhaviyani Atoll",
    description: "Known for its pristine dive sites, shipwrecks, and less crowded waters perfect for underwater exploration.",
    image: "https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=1200",
    hotels: 12,
    highlights: ["Shipwreck diving", "Pristine reefs", "Quiet atmosphere", "Local islands"],
    popularResorts: ["Hurawalhi", "Kanuhura", "Kuredu"],
  },
  {
    id: "noonu-atoll",
    name: "Noonu Atoll",
    description: "A remote paradise with exclusive resorts, perfect for those seeking ultimate privacy and tranquility.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200",
    hotels: 8,
    highlights: ["Secluded beaches", "Privacy", "Luxury resorts", "Romantic getaways"],
    popularResorts: ["Cheval Blanc", "Velaa Private Island", "Soneva Jani"],
  },
  {
    id: "raa-atoll",
    name: "Raa Atoll",
    description: "Home to the famous Maldivian fish processing, traditional culture, and increasingly popular resort destinations.",
    image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1200",
    hotels: 10,
    highlights: ["Local culture", "Traditional fishing", "Unspoiled nature", "Value resorts"],
    popularResorts: ["InterContinental", "Emerald Maldives", "You & Me"],
  },
];

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920"
            alt="Maldives Atolls"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="font-stix text-4xl md:text-5xl font-bold">
            Explore Maldives Destinations
          </h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Discover the unique character of each atoll and find your perfect paradise
          </p>
        </div>
      </section>

      {/* Map Overview */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`#${dest.id}`}
                className="p-4 bg-white rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="font-medium text-sm">{dest.name}</p>
                <p className="text-xs text-muted-foreground">{dest.hotels} hotels</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Detail */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {destinations.map((destination, index) => (
              <div
                key={destination.id}
                id={destination.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                      <Hotel className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{destination.hotels} Hotels</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="font-stix text-3xl font-bold mb-4">{destination.name}</h2>
                  <p className="text-muted-foreground mb-6">{destination.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Popular Resorts</h3>
                    <div className="space-y-2">
                      {destination.popularResorts.map((resort) => (
                        <div key={resort} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">{resort}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asChild>
                    <Link href={`/hotels?destination=${destination.id}`}>
                      Explore Hotels
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Maldives */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-stix text-3xl md:text-4xl font-bold">Why Choose the Maldives?</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              A collection of 1,192 islands forming 26 atolls, the Maldives offers unparalleled beauty and experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">26</div>
                <div className="text-white/80">Natural Atolls</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-white/80">Crystal Clear Water</div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">30°C</div>
                <div className="text-white/80">Year-Round Warmth</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
