import { NextRequest, NextResponse } from "next/server";
import { liteApiClient } from "@/lib/liteapi/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const hotelId = searchParams.get("hotelId") || "";
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const adults = parseInt(searchParams.get("adults") || "2");
    const children = parseInt(searchParams.get("children") || "0") || undefined;
    const currency = searchParams.get("currency") || "USD";
    const guestNationality = searchParams.get("guestNationality") || "US";

    // Validate required parameters
    if (!hotelId) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Hotel ID is required" } },
        { status: 400 }
      );
    }

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Check-in and check-out dates are required" } },
        { status: 400 }
      );
    }

    const result = await liteApiClient.checkAvailability({
      hotelId,
      checkIn,
      checkOut,
      adults,
      children,
      currency,
      guestNationality,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Availability API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
