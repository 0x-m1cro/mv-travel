import { NextRequest, NextResponse } from "next/server";
import { liteApiClient } from "@/lib/liteapi/client";

type RouteContext = {
  params: Promise<{ hotelId: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { hotelId } = await context.params;

    if (!hotelId) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Hotel ID is required" } },
        { status: 400 }
      );
    }

    const result = await liteApiClient.getHotelDetails(hotelId);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Get hotel API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
