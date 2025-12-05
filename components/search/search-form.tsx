"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays } from "date-fns";
import { Calendar, Users, Search, MapPin } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const [destination, setDestination] = useState("all");
  const [checkIn, setCheckIn] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));
  const [checkOut, setCheckOut] = useState(format(addDays(new Date(), 14), "yyyy-MM-dd"));
  const [guests, setGuests] = useState("2");
  const [rooms] = useState("1");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      destination,
      checkIn,
      checkOut,
      adults: guests,
      rooms,
    });
    router.push(`/hotels?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className={cn("w-full", className)}>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.value} value={dest.value}>
                    {dest.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="gap-2">
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
        "bg-white rounded-xl shadow-lg p-4 md:p-6",
        isHero && "shadow-2xl",
        className
      )}
    >
      <div className={cn(
        "grid gap-4",
        isHero
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-5"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5"
      )}>
        {/* Destination */}
        <div className="space-y-2">
          <Label htmlFor="destination" className="text-sm font-medium">
            Destination
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Where to?" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.value} value={dest.value}>
                    {dest.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Check-in */}
        <div className="space-y-2">
          <Label htmlFor="checkin" className="text-sm font-medium">
            Check-in
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="checkin"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={format(new Date(), "yyyy-MM-dd")}
              className="pl-10"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="space-y-2">
          <Label htmlFor="checkout" className="text-sm font-medium">
            Check-out
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="checkout"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn}
              className="pl-10"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <Label htmlFor="guests" className="text-sm font-medium">
            Guests
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="pl-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
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
              "w-full gap-2",
              isHero && "h-10 text-base"
            )}
            size={isHero ? "lg" : "default"}
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}
