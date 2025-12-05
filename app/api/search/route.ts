import { NextRequest, NextResponse } from "next/server";
import { liteApiClient } from "@/lib/liteapi/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const checkIn = searchParams.get("checkIn") || "";
    const checkOut = searchParams.get("checkOut") || "";
    const adults = parseInt(searchParams.get("adults") || "2");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get Maldives hotels from LiteAPI
    const result = await liteApiClient.getMaldivesHotels({
      checkin: checkIn || undefined,
      checkout: checkOut || undefined,
      adults: adults || undefined,
      limit,
      offset,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        hotels: result.data?.hotels || [],
        totalCount: result.data?.total || 0,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
