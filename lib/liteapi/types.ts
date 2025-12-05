// LiteAPI Types based on Nuitee LiteAPI v3.0 documentation
// Reference: https://docs.liteapi.travel/reference/overview

// =============================================================================
// STATIC DATA TYPES (Hotels, Places)
// =============================================================================

export interface HotelStaticData {
  id: string;
  name: string;
  hotelDescription?: string;
  currency?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  zip?: string;
  main_photo?: string;
  stars?: number;
  hotelImportantInformation?: string;
  hotelFacilities?: string[];
}

export interface HotelDetailsResponse {
  data: HotelStaticData;
}

export interface HotelListResponse {
  data: HotelStaticData[];
  total?: number;
}

// Normalized Hotel type for frontend use
export interface Hotel {
  id: string;
  name: string;
  starRating: number;
  description?: string;
  address: {
    line1?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  images: HotelImage[];
  amenities?: string[];
  reviews?: {
    rating: number;
    count: number;
  };
  minRate?: {
    amount: number;
    currency: string;
  };
}

export interface HotelImage {
  url: string;
  caption?: string;
  isPrimary?: boolean;
}

// =============================================================================
// SEARCH / RATES TYPES
// =============================================================================

export interface SearchParams {
  hotelIds: string[];
  checkin: string;
  checkout: string;
  adults: number;
  children?: number;
  childrenAges?: number[];
  guestNationality: string;
  currency?: string;
  roomQuantity?: number;
}

export interface MinRatesSearchParams {
  hotelIds: string[];
  checkin: string;
  checkout: string;
  adults: number;
  children?: number;
  guestNationality: string;
  currency?: string;
}

// LiteAPI Full Rates Response
export interface RatesResponse {
  data: HotelRates[];
}

export interface HotelRates {
  hotelId: string;
  currency: string;
  roomTypes: RoomType[];
}

export interface RoomType {
  offerId: string;
  roomName?: string;
  rates: Rate[];
}

export interface Rate {
  rateId: string;
  rateType?: string;
  retailRate?: RatePrice;
  board?: string;
  boardName?: string;
  cancellationPolicies?: CancellationPolicyInfo;
  maxOccupancy?: number;
}

export interface RatePrice {
  total: TotalPrice[];
}

export interface TotalPrice {
  amount: number;
  currency: string;
}

export interface CancellationPolicyInfo {
  cancelPolicyInfos?: CancelPolicyInfo[];
  refundableTag?: string;
}

export interface CancelPolicyInfo {
  cancelTime?: string;
  amount?: number;
  currency?: string;
  type?: string;
}

// =============================================================================
// BOOKING TYPES
// =============================================================================

export interface PreBookRequest {
  offerId: string;
  usePaymentSdk?: boolean;
}

export interface PreBookResponse {
  data: {
    prebookId: string;
    hotelId?: string;
    roomName?: string;
    rate?: Rate;
    price?: TotalPrice;
    cancellationPolicies?: CancellationPolicyInfo;
  };
}

export interface BookingRequest {
  prebookId: string;
  guestInfo: GuestInfo;
  paymentMethod?: string;
  holderName?: string;
  paymentInfo?: PaymentInfo;
}

export interface GuestInfo {
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone?: string;
}

export interface PaymentInfo {
  card_number?: string;
  exp_month?: string;
  exp_year?: string;
  cvc?: string;
}

export interface BookingResponse {
  data: {
    bookingId: string;
    status: BookingStatus;
    hotelConfirmationCode?: string;
    hotel?: {
      hotelId: string;
      name: string;
    };
    checkin?: string;
    checkout?: string;
    guestInfo?: GuestInfo;
    rate?: Rate;
    price?: TotalPrice;
    cancellationPolicies?: CancellationPolicyInfo;
    createdAt?: string;
  };
}

export interface BookingListResponse {
  data: BookingResponse["data"][];
}

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed" | "failed";

// =============================================================================
// PLACES / CITIES TYPES (for destinations)
// =============================================================================

export interface CitySearchParams {
  countryCode: string;
  limit?: number;
}

export interface City {
  city: string;
  country?: string;
  countryCode?: string;
}

export interface CitiesResponse {
  data: City[];
}

// =============================================================================
// LEGACY / COMPATIBILITY TYPES
// =============================================================================

export interface SearchResponse {
  hotels: Hotel[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface AvailabilityParams {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children?: number;
  rooms?: number;
  currency?: string;
  guestNationality?: string;
}

export interface Room {
  offerId: string;
  name: string;
  description?: string;
  maxOccupancy: number;
  bedType?: string;
  amenities?: string[];
  images?: HotelImage[];
  rates: RoomRate[];
}

export interface RoomRate {
  rateId: string;
  boardType: string;
  boardName?: string;
  cancellationPolicy?: CancellationPolicy;
  price: {
    amount: number;
    currency: string;
  };
}

export interface CancellationPolicy {
  refundable: boolean;
  deadline?: string;
  description?: string;
}

export interface AvailabilityResponse {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  rooms: Room[];
  currency?: string;
}

export interface Booking {
  bookingId: string;
  status: BookingStatus;
  hotelName: string;
  hotelId?: string;
  checkIn: string;
  checkOut: string;
  guestInfo: GuestInfo;
  roomDetails: {
    roomName: string;
    boardType: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  cancellationPolicy?: CancellationPolicy;
  createdAt: string;
  confirmationNumber?: string;
}

// =============================================================================
// API RESPONSE WRAPPER
// =============================================================================

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
