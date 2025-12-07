"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { Calendar, Users, Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSearchStore } from "@/store";

interface SearchFormProps {
  className?: string;
  variant?: "default" | "compact" | "hero";
}

const destinations = [
  { value: "male", label: "Malé Atoll" },
  { value: "ari", label: "Ari Atoll" },
  { value: "baa", label: "Baa Atoll" },
  { value: "lhaviyani", label: "Lhaviyani Atoll" },
  { value: "noonu", label: "Noonu Atoll" },
  { value: "raa", label: "Raa Atoll" },
  { value: "all", label: "All Maldives" },
];

export function SearchForm({ className, variant = "default" }: SearchFormProps) {
  const router = useRouter();
  const { searchMode, setSearchMode } = useSearchStore();
  const [destination, setDestination] = useState("all");
  const [checkIn, setCheckIn] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(addDays(new Date(), 14), "yyyy-MM-dd"));
  const [guests, setGuests] = useState("2");
  const [rooms] = useState("1");
  const [vibeQuery, setVibeQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchMode === "vibe" && vibeQuery.trim()) {
      // AI/Vibe search - navigate to results with vibe query
      const params = new URLSearchParams({
        mode: "vibe",
        q: vibeQuery,
        checkIn,
        checkOut,
        adults: guests,
      });
      router.push(`/hotels?${params.toString()}`);
    } else {
      // Regular destination search
      const params = new URLSearchParams({
        destination,
        checkIn,
        checkOut,
        adults: guests,
        rooms,
      });
      router.push(`/hotels?${params.toString()}`);
    }
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className={cn("w-full", className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="pl-10 h-11 rounded-xl border-2 border-border/60 focus:border-primary bg-white">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {destinations.map((dest) => (
                  <SelectItem key={dest.value} value={dest.value} className="rounded-lg">
                    {dest.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="gap-2 h-11 rounded-xl px-6 shadow-md hover:shadow-lg">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </form>
    );
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "bg-white rounded-2xl p-5 md:p-6 transition-all",
        isHero && "shadow-2xl border border-border/30",
        !isHero && "shadow-lg border border-border/50",
        className
      )}
    >
      {/* Search Mode Toggle (only for hero variant) */}
      {isHero && (
        <div className="mb-6">
          <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as "destination" | "vibe")} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-11 rounded-xl">
              <TabsTrigger value="destination" className="rounded-lg gap-2">
                <MapPin className="h-4 w-4" />
                Destination
              </TabsTrigger>
              <TabsTrigger value="vibe" className="rounded-lg gap-2">
                <Sparkles className="h-4 w-4" />
                Vibe Search
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {searchMode === "vibe" && isHero ? (
        // AI/Vibe Search Mode
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vibe-query" className="text-sm font-semibold text-gray-700">
              Describe your perfect getaway
            </Label>
            <div className="relative">
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                id="vibe-query"
                type="text"
                placeholder="E.g., romantic overwater villas with private pool..."
                value={vibeQuery}
                onChange={(e) => setVibeQuery(e.target.value)}
                className="pl-11 h-14 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50 text-base"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Try: &quot;luxury resort with spa&quot;, &quot;budget-friendly beach villa&quot;, &quot;honeymoon suite with private pool&quot;
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Check-in */}
            <div className="space-y-2">
              <Label htmlFor="checkin-vibe" className="text-sm font-semibold text-gray-700">
                Check-in
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input
                  id="checkin-vibe"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50"
                />
              </div>
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <Label htmlFor="checkout-vibe" className="text-sm font-semibold text-gray-700">
                Check-out
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input
                  id="checkout-vibe"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                  className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label htmlFor="guests-vibe" className="text-sm font-semibold text-gray-700">
                Guests
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="rounded-lg">
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* AI Search Button */}
          <Button
            type="submit"
            disabled={!vibeQuery.trim()}
            className="w-full gap-2 h-12 rounded-xl shadow-lg hover:shadow-xl transition-all text-base font-semibold"
            size="lg"
          >
            <Sparkles className="h-5 w-5" />
            Search with AI
          </Button>
        </div>
      ) : (
        // Regular Destination Search Mode
        <div className={cn(
          "grid gap-4",
          isHero
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
        )}>
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-semibold text-gray-700">
              Destination
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50">
                  <SelectValue placeholder="Where to?" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {destinations.map((dest) => (
                    <SelectItem key={dest.value} value={dest.value} className="rounded-lg">
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

        {/* Check-in */}
        <div className="space-y-2">
          <Label htmlFor="checkin" className="text-sm font-semibold text-gray-700">
            Check-in
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              id="checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <Label htmlFor="checkout" className="text-sm font-semibold text-gray-700">
            Check-out
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Input
              id="checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-sm font-semibold text-gray-700">
            Guests
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="pl-10 h-12 rounded-xl border-2 border-border/60 focus:border-primary hover:border-primary/50 transition-colors bg-gray-50/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="rounded-lg">
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button
              type="submit"
              className={cn(
                "w-full gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all",
                isHero && "h-12 text-base font-semibold"
              )}
              size={isHero ? "lg" : "default"}
            >
              <Search className="h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
