"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, MapPin, Users, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "BK123456";

  // Mock confirmation data
  const bookingDetails = {
    bookingId,
    hotelName: "Soneva Fushi Resort & Spa",
    roomName: "Beach Villa",
    location: "Baa Atoll, Maldives",
    checkIn: "December 15, 2024",
    checkOut: "December 20, 2024",
    nights: 5,
    guests: 2,
    guestName: "John Doe",
    email: "john@example.com",
    total: 7875,
    status: "Confirmed",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="font-stix text-3xl font-bold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your reservation has been successfully completed
          </p>
        </div>

        {/* Confirmation Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Booking Reference</p>
                <p className="text-2xl font-bold font-mono">{bookingDetails.bookingId}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                {bookingDetails.status}
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4">
              <div>
                <h2 className="font-stix text-xl font-semibold">{bookingDetails.hotelName}</h2>
                <p className="text-muted-foreground">{bookingDetails.roomName}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{bookingDetails.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{bookingDetails.guests} Adults</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{bookingDetails.checkIn}</p>
                    <p className="text-xs text-muted-foreground">From 2:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{bookingDetails.checkOut}</p>
                    <p className="text-xs text-muted-foreground">Until 12:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount Paid</p>
                <p className="text-2xl font-bold text-primary">
                  ${bookingDetails.total.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{bookingDetails.nights} nights</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notice */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Confirmation email sent</p>
                <p className="text-sm text-blue-700">
                  A confirmation email has been sent to{" "}
                  <span className="font-medium">{bookingDetails.email}</span> with all the
                  details of your booking.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download Confirmation
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/dashboard">View My Bookings</Link>
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-4">Important Information</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Please present your booking confirmation at check-in</li>
            <li>• A valid photo ID is required for all guests</li>
            <li>• Airport transfers can be arranged through the resort</li>
            <li>• For any changes, please contact us at least 48 hours before check-in</li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Need help with your booking?
          </p>
          <Button variant="link" asChild>
            <Link href="/faq">View FAQ</Link>
          </Button>
          <span className="text-muted-foreground mx-2">or</span>
          <Button variant="link" asChild>
            <Link href="/about#contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
