"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format, addDays } from "date-fns";
import { Calendar, Users, Search, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

const destinations = [
  { value: "all", label: "All Maldives" },
  { value: "male", label: "Malé Atoll" },
  { value: "ari", label: "Ari Atoll" },
  { value: "baa", label: "Baa Atoll" },
  { value: "lhaviyani", label: "Lhaviyani Atoll" },
];

export function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();
  const [destination, setDestination] = useState("all");
  const [checkIn, setCheckIn] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(addDays(new Date(), 14), "yyyy-MM-dd"));
  const [guests, setGuests] = useState("2");
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults: guests,
      rooms: "1",
    });
    router.push(`/hotels?${params.toString()}`);
  };

  const selectedDestination = destinations.find(d => d.value === destination);

  return (
    <section className={cn("relative min-h-[85vh] flex flex-col pt-[72px]", className)}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1920"
          alt="Maldives Paradise"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient */}
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end pb-8 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl w-full">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3 font-stix">
              Find Your Paradise
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto">
              Discover luxury resorts and pristine beaches in the Maldives
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-28 shadow-search-card p-4 sm:p-6 mx-auto max-w-4xl">
            <form onSubmit={handleSearch}>
              {/* Mobile: Stacked Layout */}
              <div className="flex flex-col gap-3 sm:hidden">
                {/* Destination */}
                <div className="search-field relative">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
                    >
                      <span className="text-xs text-muted-foreground block">Where to?</span>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{selectedDestination?.label}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  {showDestinationDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-16 shadow-card-hover z-50 py-2">
                      {destinations.map((dest) => (
                        <button
                          key={dest.value}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                          onClick={() => {
                            setDestination(dest.value);
                            setShowDestinationDropdown(false);
                          }}
                        >
                          {dest.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="search-field">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground block">Check-in</span>
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={format(new Date(), "yyyy-MM-dd")}
                          className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="search-field">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground block">Check-out</span>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn}
                          className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="search-field">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground block">Guests</span>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num.toString()}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-12 flex items-center justify-center gap-2 transition-colors"
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>

              {/* Desktop: Horizontal Layout */}
              <div className="hidden sm:flex items-center gap-3">
                {/* Destination */}
                <div className="search-field flex-1 relative">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => setShowDestinationDropdown(!showDestinationDropdown)}
                    >
                      <span className="text-xs text-muted-foreground block">Where to?</span>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{selectedDestination?.label}</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  {showDestinationDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-16 shadow-card-hover z-50 py-2 min-w-[200px]">
                      {destinations.map((dest) => (
                        <button
                          key={dest.value}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
                          onClick={() => {
                            setDestination(dest.value);
                            setShowDestinationDropdown(false);
                          }}
                        >
                          {dest.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Check-in */}
                <div className="search-field w-36">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">Check-in</span>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={format(new Date(), "yyyy-MM-dd")}
                        className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Check-out */}
                <div className="search-field w-36">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">Check-out</span>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn}
                        className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="search-field w-32">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-muted-foreground block">Guests</span>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full bg-transparent border-0 p-0 text-sm font-medium focus:outline-none appearance-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num.toString()}>
                            {num} {num === 1 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-12 flex items-center justify-center gap-2 transition-colors flex-shrink-0"
                >
                  <Search className="h-5 w-5" />
                  <span className="hidden lg:inline">Search</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
