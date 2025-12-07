"use client";

import { useState } from "react";
import { Search, Mail, User, Calendar, MapPin, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookingDetails {
  bookingId: string;
  hotelConfirmationCode?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail?: string;
  hotelName?: string;
  roomName?: string;
  checkin?: string;
  checkout?: string;
  status?: string;
}

export default function BookingLookupPage() {
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setBooking(null);

    try {
      const response = await fetch(`/api/booking/${bookingId}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Verify email matches if provided
        if (email && result.data.data?.guestEmail !== email) {
          setError("Email does not match booking records");
        } else {
          setBooking(result.data.data);
        }
      } else {
        setError(result.error?.message || "Booking not found");
      }
    } catch (err) {
      console.error("Error looking up booking:", err);
      setError("Failed to search for booking. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Search className="h-4 w-4" />
            Find Your Booking
          </div>
          <h1 className="font-stix text-3xl md:text-4xl font-bold text-gray-900">
            Booking Lookup
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Retrieve your booking details using your booking ID and email address
          </p>
        </div>

        {/* Search Form */}
        <Card className="border-0 shadow-xl mb-8">
          <CardHeader>
            <CardTitle>Search for Your Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bookingId">Booking ID *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="bookingId"
                    type="text"
                    placeholder="e.g., BK123456"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your booking ID was sent to your email after booking
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  For security verification
                </p>
              </div>

              <Button
                type="submit"
                disabled={!bookingId || isSearching}
                className="w-full h-12 rounded-xl shadow-lg hover:shadow-xl"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Booking
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800 text-center font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        {booking && (
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary to-cyan-600 text-white rounded-t-xl">
              <CardTitle className="text-2xl">Booking Confirmed</CardTitle>
              <p className="text-white/90 text-sm mt-2">
                Booking ID: {booking.bookingId}
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Guest Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {booking.guestFirstName} {booking.guestLastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.guestEmail}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Hotel Info */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Hotel Details
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="font-semibold text-xl">{booking.hotelName || "Hotel Name"}</p>
                  <p className="text-sm text-muted-foreground">
                    Hotel Confirmation: {booking.hotelConfirmationCode || "N/A"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Stay Details */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Stay Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{booking.checkin || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{booking.checkout || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{booking.roomName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{booking.status || "Confirmed"}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button variant="outline" className="flex-1 rounded-xl">
                  Download Confirmation
                </Button>
                <Button variant="outline" className="flex-1 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancel Booking
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Can't find your booking? Contact our support team.
            </p>
            <Button variant="outline" className="rounded-xl">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
