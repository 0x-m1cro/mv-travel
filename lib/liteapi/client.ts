import {
  SearchParams,
  MinRatesSearchParams,
  RatesResponse,
  HotelRates,
  PreBookRequest,
  PreBookResponse,
  BookingRequest,
  BookingResponse,
  BookingListResponse,
  ApiResponse,
  Hotel,
  HotelStaticData,
  HotelListResponse,
  HotelDetailsResponse,
  AvailabilityParams,
  AvailabilityResponse,
  Room,
  CitiesResponse,
} from "./types";
import { liteApiCache, CACHE_TTL } from "./cache";

const LITEAPI_BASE_URL = process.env.LITEAPI_BASE_URL || "https://api.liteapi.travel/v3.0";
const LITEAPI_API_KEY = process.env.LITEAPI_API_KEY || "";

interface RequestOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  cache?: boolean;
  cacheTTL?: number;
}

// Helper to normalize hotel data from LiteAPI to our frontend format
function normalizeHotel(hotel: HotelStaticData, minRate?: { amount: number; currency: string }): Hotel {
  return {
    id: hotel.id,
    name: hotel.name,
    starRating: hotel.stars || 0,
    description: hotel.hotelDescription,
    address: {
      line1: hotel.address,
      city: hotel.city,
      country: hotel.country,
      postalCode: hotel.zip,
    },
    location: {
      latitude: hotel.latitude || 0,
      longitude: hotel.longitude || 0,
    },
    images: hotel.main_photo
      ? [{ url: hotel.main_photo, isPrimary: true }]
      : [],
    amenities: hotel.hotelFacilities || [],
    minRate,
  };
}

class LiteApiClient {
  private baseUrl: string;
  private apiKey: string;
  private maxRetries = 3;
  private retryDelay = 1000;
  private isDevelopment = process.env.NODE_ENV === "development";

  constructor() {
    this.baseUrl = LITEAPI_BASE_URL;
    this.apiKey = LITEAPI_API_KEY;
  }

  // Safe logging - only in development
  private log(message: string, ...args: unknown[]) {
    if (this.isDevelopment) {
      console.log(`[LiteAPI] ${message}`, ...args);
    }
  }

  private logError(message: string, error?: unknown) {
    if (this.isDevelopment) {
      console.error(`[LiteAPI] ${message}`, error);
    }
    // In production, you would send to a logging service
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Check cache for GET requests
    if (options.method === "GET" && options.cache !== false) {
      const cacheKey = liteApiCache.generateKey(endpoint, {});
      const cached = liteApiCache.get<T>(cacheKey);
      if (cached) {
        return { success: true, data: cached };
      }
    }

    // Check if API key is configured
    if (!this.apiKey) {
      return {
        success: false,
        error: {
          code: "CONFIG_ERROR",
          message: "Hotel data service is not configured. Please contact support.",
        },
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: options.method,
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.apiKey,
            Accept: "application/json",
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error?.message || errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();

        // Cache successful GET responses
        if (options.method === "GET" && options.cache !== false) {
          const cacheKey = liteApiCache.generateKey(endpoint, {});
          liteApiCache.set(cacheKey, data, options.cacheTTL || CACHE_TTL.SEARCH);
        }

        return { success: true, data: data as T };
      } catch (error) {
        lastError = error as Error;
        this.logError(
          `Request failed (attempt ${attempt + 1}/${this.maxRetries})`,
          error
        );

        if (attempt < this.maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.retryDelay * (attempt + 1))
          );
        }
      }
    }

    return {
      success: false,
      error: {
        code: "REQUEST_FAILED",
        message: lastError?.message || "Request failed after retries",
      },
    };
  }

  // =============================================================================
  // STATIC DATA ENDPOINTS
  // =============================================================================

  /**
   * Get list of hotels by country code
   * GET /data/hotels
   */
  async getHotelsByCountry(
    countryCode: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<ApiResponse<HotelListResponse>> {
    const cacheKey = liteApiCache.generateKey("hotels-country", { countryCode, limit, offset });
    const cached = liteApiCache.get<HotelListResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams({
      countryCode,
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const result = await this.request<HotelListResponse>(
      `/data/hotels?${queryParams.toString()}`,
      { method: "GET", cache: false }
    );

    if (result.success && result.data) {
      liteApiCache.set(cacheKey, result.data, CACHE_TTL.STATIC_DATA);
    }

    return result;
  }

  /**
   * Get list of hotels by city
   * GET /data/hotels
   */
  async getHotelsByCity(
    cityName: string,
    countryCode: string,
    limit: number = 100
  ): Promise<ApiResponse<HotelListResponse>> {
    const cacheKey = liteApiCache.generateKey("hotels-city", { cityName, countryCode, limit });
    const cached = liteApiCache.get<HotelListResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const queryParams = new URLSearchParams({
      cityName,
      countryCode,
      limit: limit.toString(),
    });

    const result = await this.request<HotelListResponse>(
      `/data/hotels?${queryParams.toString()}`,
      { method: "GET", cache: false }
    );

    if (result.success && result.data) {
      liteApiCache.set(cacheKey, result.data, CACHE_TTL.STATIC_DATA);
    }

    return result;
  }

  /**
   * Get hotel details by ID
   * GET /data/hotel
   */
  async getHotelDetails(hotelId: string): Promise<ApiResponse<Hotel>> {
    const cacheKey = liteApiCache.generateKey("hotel-details", { hotelId });
    const cached = liteApiCache.get<Hotel>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const result = await this.request<HotelDetailsResponse>(
      `/data/hotel?hotelId=${hotelId}`,
      { method: "GET", cache: false }
    );

    if (result.success && result.data?.data) {
      const normalizedHotel = normalizeHotel(result.data.data);
      liteApiCache.set(cacheKey, normalizedHotel, CACHE_TTL.HOTEL_DETAILS);
      return { success: true, data: normalizedHotel };
    }

    return {
      success: false,
      error: result.error || { code: "NOT_FOUND", message: "Hotel not found" },
    };
  }

  /**
   * Get cities by country code
   * GET /data/cities
   */
  async getCitiesByCountry(countryCode: string): Promise<ApiResponse<CitiesResponse>> {
    const cacheKey = liteApiCache.generateKey("cities", { countryCode });
    const cached = liteApiCache.get<CitiesResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const result = await this.request<CitiesResponse>(
      `/data/cities?countryCode=${countryCode}`,
      { method: "GET", cache: false }
    );

    if (result.success && result.data) {
      liteApiCache.set(cacheKey, result.data, CACHE_TTL.STATIC_DATA);
    }

    return result;
  }

  // =============================================================================
  // SEARCH / RATES ENDPOINTS
  // =============================================================================

  /**
   * Search for hotel rates
   * POST /hotels/rates
   */
  async searchRates(params: SearchParams): Promise<ApiResponse<RatesResponse>> {
    const cacheKey = liteApiCache.generateKey("rates", params as unknown as Record<string, unknown>);
    const cached = liteApiCache.get<RatesResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    const body = {
      hotelIds: params.hotelIds,
      checkin: params.checkin,
      checkout: params.checkout,
      occupancies: [
        {
          adults: params.adults,
          children: params.children ? [params.children] : undefined,
        },
      ],
      guestNationality: params.guestNationality,
      currency: params.currency || "USD",
    };

    const result = await this.request<RatesResponse>("/hotels/rates", {
      method: "POST",
      body,
      cache: false,
    });

    if (result.success && result.data) {
      liteApiCache.set(cacheKey, result.data, CACHE_TTL.AVAILABILITY);
    }

    return result;
  }

  /**
   * Get minimum rates for hotels (useful for search results)
   * POST /hotels
   */
  async getMinRates(params: MinRatesSearchParams): Promise<ApiResponse<{ data: Array<{ hotelId: string; currency: string; price: number }> }>> {
    const body = {
      hotelIds: params.hotelIds,
      checkin: params.checkin,
      checkout: params.checkout,
      occupancies: [{ adults: params.adults, children: params.children }],
      guestNationality: params.guestNationality,
      currency: params.currency || "USD",
    };

    return this.request("/hotels", {
      method: "POST",
      body,
      cache: false,
    });
  }

  /**
   * Check availability for a specific hotel (combines static data + rates)
   */
  async checkAvailability(params: AvailabilityParams): Promise<ApiResponse<AvailabilityResponse>> {
    const cacheKey = liteApiCache.generateKey("availability", params as unknown as Record<string, unknown>);
    const cached = liteApiCache.get<AvailabilityResponse>(cacheKey);
    if (cached) {
      return { success: true, data: cached };
    }

    // Get rates for the hotel
    const ratesResult = await this.searchRates({
      hotelIds: [params.hotelId],
      checkin: params.checkIn,
      checkout: params.checkOut,
      adults: params.adults,
      children: params.children,
      guestNationality: params.guestNationality || "US",
      currency: params.currency || "USD",
    });

    if (!ratesResult.success || !ratesResult.data?.data) {
      return {
        success: false,
        error: ratesResult.error || { code: "NO_AVAILABILITY", message: "No rooms available" },
      };
    }

    const hotelRates = ratesResult.data.data.find((h: HotelRates) => h.hotelId === params.hotelId);
    if (!hotelRates) {
      return {
        success: false,
        error: { code: "NO_AVAILABILITY", message: "No rooms available for this hotel" },
      };
    }

    // Transform rates to rooms
    const rooms: Room[] = hotelRates.roomTypes.map((roomType) => ({
      offerId: roomType.offerId,
      name: roomType.roomName || "Room",
      maxOccupancy: roomType.rates[0]?.maxOccupancy || params.adults,
      rates: roomType.rates.map((rate) => ({
        rateId: rate.rateId,
        boardType: rate.board || "room_only",
        boardName: rate.boardName,
        cancellationPolicy: {
          refundable: rate.cancellationPolicies?.refundableTag === "refundable",
          description: rate.cancellationPolicies?.cancelPolicyInfos?.[0]?.type,
        },
        price: {
          amount: rate.retailRate?.total?.[0]?.amount || 0,
          currency: rate.retailRate?.total?.[0]?.currency || hotelRates.currency,
        },
      })),
    }));

    const availability: AvailabilityResponse = {
      hotelId: params.hotelId,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      rooms,
      currency: hotelRates.currency,
    };

    liteApiCache.set(cacheKey, availability, CACHE_TTL.AVAILABILITY);
    return { success: true, data: availability };
  }

  // =============================================================================
  // BOOKING ENDPOINTS
  // =============================================================================

  /**
   * Pre-book a rate (required before booking)
   * POST /rates/prebook
   */
  async preBook(params: PreBookRequest): Promise<ApiResponse<PreBookResponse>> {
    return this.request("/rates/prebook", {
      method: "POST",
      body: params,
      cache: false,
    });
  }

  /**
   * Create a booking
   * POST /rates/book
   */
  async createBooking(params: BookingRequest): Promise<ApiResponse<BookingResponse>> {
    return this.request("/rates/book", {
      method: "POST",
      body: params,
      cache: false,
    });
  }

  /**
   * Get booking details by ID
   * GET /bookings/{bookingId}
   */
  async getBooking(bookingId: string): Promise<ApiResponse<BookingResponse>> {
    return this.request(`/bookings/${bookingId}`, {
      method: "GET",
      cache: false,
    });
  }

  /**
   * Get list of bookings
   * GET /bookings
   */
  async listBookings(guestId?: string): Promise<ApiResponse<BookingListResponse>> {
    const queryParams = guestId ? `?guestId=${guestId}` : "";
    return this.request(`/bookings${queryParams}`, {
      method: "GET",
      cache: false,
    });
  }

  /**
   * Cancel a booking
   * PUT /bookings/{bookingId}
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<BookingResponse>> {
    return this.request(`/bookings/${bookingId}`, {
      method: "PUT",
      body: { status: "cancelled" },
      cache: false,
    });
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Get Maldives hotels with optional rates
   * Convenience method for the Maldives-only platform
   */
  async getMaldivesHotels(
    options?: {
      checkin?: string;
      checkout?: string;
      adults?: number;
      limit?: number;
      offset?: number;
    }
  ): Promise<ApiResponse<{ hotels: Hotel[]; total: number }>> {
    // Get static hotel data for Maldives (MV)
    const hotelsResult = await this.getHotelsByCountry("MV", options?.limit || 50, options?.offset || 0);
    
    if (!hotelsResult.success || !hotelsResult.data?.data) {
      return {
        success: false,
        error: hotelsResult.error || { code: "FETCH_ERROR", message: "Failed to fetch hotels" },
      };
    }

    const hotelDataList = hotelsResult.data.data;

    // If dates provided, get rates
    if (options?.checkin && options?.checkout) {
      const hotelIds = hotelDataList.map((h) => h.id);
      
      try {
        const minRatesResult = await this.getMinRates({
          hotelIds,
          checkin: options.checkin,
          checkout: options.checkout,
          adults: options.adults || 2,
          guestNationality: "US",
          currency: "USD",
        });

        if (minRatesResult.success && minRatesResult.data?.data) {
          const ratesMap = new Map(
            minRatesResult.data.data.map((r: { hotelId: string; price: number; currency: string }) => [
              r.hotelId,
              { amount: r.price, currency: r.currency },
            ])
          );

          const hotelsWithRates = hotelDataList.map((hotel) =>
            normalizeHotel(hotel, ratesMap.get(hotel.id))
          );

          return {
            success: true,
            data: {
              hotels: hotelsWithRates,
              total: hotelsResult.data.total || hotelDataList.length,
            },
          };
        }
      } catch (error) {
        this.logError("Error fetching rates", error);
        // Continue without rates
      }
    }

    // Return hotels without rates
    const hotels = hotelDataList.map((hotel) => normalizeHotel(hotel));
    return {
      success: true,
      data: {
        hotels,
        total: hotelsResult.data.total || hotelDataList.length,
      },
    };
  }
}

// Export singleton instance
export const liteApiClient = new LiteApiClient();

// Export types
export * from "./types";
