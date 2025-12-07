// Booking-related types for the Maldives OTA application

export interface Guest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: "Mr" | "Mrs" | "Ms" | "Dr";
}

export interface PrebookRequest {
  offerId: string;
  usePaymentSdk?: boolean;
}

export interface PrebookResponse {
  prebookId: string;
  secretKey: string;
  expiresAt: string;
  offer: {
    offerId: string;
    hotelId: string;
    roomId: string;
    price: {
      amount: number;
      currency: string;
    };
    cancellationPolicy: {
      refundable: boolean;
      cancelBefore?: string;
    };
  };
}

export interface BookingRequest {
  prebookId: string;
  secretKey?: string;
  guestInfo: Guest;
  paymentMethod?: string;
  holderName?: string;
  paymentInfo?: PaymentInfo;
}

export interface PaymentInfo {
  cardNumber?: string;
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

export interface BookingResponse {
  bookingId: string;
  hotelConfirmationCode: string;
  status: "confirmed" | "pending" | "cancelled";
  hotel: {
    id: string;
    name: string;
    address: string;
  };
  room: {
    id: string;
    name: string;
  };
  checkIn: string;
  checkOut: string;
  guests: Guest[];
  totalPrice: {
    amount: number;
    currency: string;
    breakdown: {
      basePrice: number;
      taxes: number;
      fees: number;
    };
  };
  cancellationPolicy: {
    refundable: boolean;
    cancelBefore?: string;
  };
}

export interface BookingLookup {
  bookingId: string;
  email?: string;
  lastName?: string;
}
