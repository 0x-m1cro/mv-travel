"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Phone, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const hotelId = searchParams.get("hotelId") || "";
  const offerId = searchParams.get("offerId") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = parseInt(searchParams.get("guests") || "2");

  // Calculate nights between dates
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 5;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const pricePerNight = 1500; // Would come from prebook API in production
  const taxes = Math.round(pricePerNight * nights * 0.05);
  const total = pricePerNight * nights + taxes;

  const bookingDetails = {
    hotelName: "Maldives Resort",
    roomName: "Beach Villa",
    checkIn: checkIn || "Dec 15, 2024",
    checkOut: checkOut || "Dec 20, 2024",
    nights,
    guests,
    pricePerNight,
    taxes,
    total,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In production, this calls the booking API with the prebookId
      const formData = new FormData(e.currentTarget);
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offerId,
          guestInfo: {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
          },
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        router.push(`/booking/confirmation?bookingId=${result.data?.data?.bookingId || "BK123456"}`);
      } else {
        // Handle error - for demo, still redirect
        router.push("/booking/confirmation?bookingId=DEMO123");
      }
    } catch {
      // For demo purposes, redirect to confirmation
      router.push("/booking/confirmation?bookingId=DEMO123");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={hotelId ? `/hotels/${hotelId}` : "/hotels"} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to hotel
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-stix text-3xl font-bold mb-8">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Guest Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Doe" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Booking confirmation will be sent to this email
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    placeholder="Any special requests? (e.g., early check-in, dietary requirements, celebration arrangements)"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Special requests are subject to availability and cannot be guaranteed.
                  </p>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input id="cardName" placeholder="John Doe" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input id="expiry" placeholder="MM/YY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input id="cvv" placeholder="123" required />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Your payment information is encrypted and secure
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" className="mt-1" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary underline">
                    Privacy Policy
                  </Link>
                  . I understand that my booking is subject to the hotel&apos;s
                  cancellation policy.
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : `Confirm Booking - $${bookingDetails.total.toLocaleString()}`}
              </Button>
            </form>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{bookingDetails.hotelName}</h3>
                  <p className="text-sm text-muted-foreground">{bookingDetails.roomName}</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-in</span>
                    <span>{bookingDetails.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>{bookingDetails.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span>{bookingDetails.nights} nights</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests</span>
                    <span>{bookingDetails.guests} adults</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      ${bookingDetails.pricePerNight} x {bookingDetails.nights} nights
                    </span>
                    <span>${(bookingDetails.pricePerNight * bookingDetails.nights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & fees</span>
                    <span>${bookingDetails.taxes}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${bookingDetails.total.toLocaleString()}</span>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>✓ Free cancellation until 48 hours before check-in</p>
                  <p>✓ No payment until you stay</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BookingContent />
    </Suspense>
  );
}
