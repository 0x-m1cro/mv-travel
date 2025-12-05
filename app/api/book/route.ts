import { NextRequest, NextResponse } from "next/server";
import { liteApiClient } from "@/lib/liteapi/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Step 1: Pre-book the rate (required by LiteAPI)
    const prebookResult = await liteApiClient.preBook({
      offerId: body.offerId,
      usePaymentSdk: body.usePaymentSdk || false,
    });

    if (!prebookResult.success || !prebookResult.data?.data?.prebookId) {
      return NextResponse.json(
        { 
          success: false, 
          error: prebookResult.error || { code: "PREBOOK_FAILED", message: "Failed to pre-book the rate" } 
        },
        { status: 400 }
      );
    }

    // Step 2: Create the booking
    const bookingResult = await liteApiClient.createBooking({
      prebookId: prebookResult.data.data.prebookId,
      guestInfo: {
        guestFirstName: body.guestInfo?.firstName,
        guestLastName: body.guestInfo?.lastName,
        guestEmail: body.guestInfo?.email,
        guestPhone: body.guestInfo?.phone,
      },
      paymentMethod: body.paymentMethod,
      holderName: body.holderName,
      paymentInfo: body.paymentInfo,
    });

    if (!bookingResult.success) {
      return NextResponse.json(bookingResult, { status: 500 });
    }

    return NextResponse.json(bookingResult, { status: 201 });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// Pre-book endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.offerId) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Offer ID is required" } },
        { status: 400 }
      );
    }

    const result = await liteApiClient.preBook({
      offerId: body.offerId,
      usePaymentSdk: body.usePaymentSdk || false,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Prebook API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
