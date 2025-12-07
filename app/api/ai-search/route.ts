import { NextRequest, NextResponse } from "next/server";
import { processVibeSearch } from "@/lib/gemini/client";
import { liteApiClient } from "@/lib/liteapi/client";

/**
 * AI/Vibe Search API Route
 * Process natural language queries and return matching hotels
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, checkIn, checkOut, adults, children, rooms } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Query is required" } },
        { status: 400 }
      );
    }

    // Step 1: Process vibe search with Gemini AI
    const vibeResult = await processVibeSearch(query);

    // Step 2: Convert AI results to LiteAPI search params
    // Build search query from AI-extracted terms
    const searchQuery = vibeResult.searchTerms.join(" ");

    // Get all Maldives hotels
    const hotelsResult = await liteApiClient.getMaldivesHotels({
      checkin: checkIn,
      checkout: checkOut,
      adults: adults || 2,
      limit: 100, // Get more results for better filtering
    });

    if (!hotelsResult.success || !hotelsResult.data?.hotels) {
      return NextResponse.json(
        {
          success: false,
          error: hotelsResult.error || { code: "SEARCH_FAILED", message: "Failed to search hotels" },
        },
        { status: 500 }
      );
    }

    // Step 3: Filter hotels based on AI-extracted criteria
    let filteredHotels = hotelsResult.data.hotels;

    // Apply star rating filter if AI suggested it
    if (vibeResult.starRating && vibeResult.starRating.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) =>
        vibeResult.starRating?.includes(hotel.starRating)
      );
    }

    // Apply price range filter if AI suggested it
    if (vibeResult.priceRange && Array.isArray(vibeResult.priceRange)) {
      const [min, max] = vibeResult.priceRange;
      filteredHotels = filteredHotels.filter((hotel) => {
        if (!hotel.minRate) return true;
        return hotel.minRate.amount >= min && hotel.minRate.amount <= max;
      });
    }

    // Filter by amenities if AI extracted them
    if (vibeResult.amenities.length > 0) {
      filteredHotels = filteredHotels.filter((hotel) => {
        if (!hotel.amenities) return false;
        return vibeResult.amenities.some((amenity) =>
          hotel.amenities?.some((a) =>
            a.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    // Sort by relevance (hotels matching more criteria come first)
    filteredHotels = filteredHotels.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Score based on matching amenities
      vibeResult.amenities.forEach((amenity) => {
        if (a.amenities?.some((am) => am.toLowerCase().includes(amenity.toLowerCase()))) {
          scoreA++;
        }
        if (b.amenities?.some((am) => am.toLowerCase().includes(amenity.toLowerCase()))) {
          scoreB++;
        }
      });

      // Score based on star rating preference
      if (vibeResult.starRating) {
        if (vibeResult.starRating.includes(a.starRating)) scoreA++;
        if (vibeResult.starRating.includes(b.starRating)) scoreB++;
      }

      return scoreB - scoreA;
    });

    // Limit results
    const limitedResults = filteredHotels.slice(0, 50);

    return NextResponse.json({
      success: true,
      data: {
        hotels: limitedResults,
        totalCount: limitedResults.length,
        vibeAnalysis: {
          searchTerms: vibeResult.searchTerms,
          amenities: vibeResult.amenities,
          tags: vibeResult.tags,
          appliedFilters: {
            starRating: vibeResult.starRating,
            priceRange: vibeResult.priceRange,
          },
        },
      },
    });
  } catch (error) {
    console.error("AI Search API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
