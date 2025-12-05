import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) {
    // In development without secret, log warning but allow
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Webhook handler for booking confirmations
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-webhook-signature");
    
    // Verify webhook signature for security
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }
    
    const body = JSON.parse(rawBody);

    // Handle different webhook events
    switch (body.type) {
      case "booking.confirmed":
        await handleBookingConfirmed(body.data);
        break;
      case "booking.cancelled":
        await handleBookingCancelled(body.data);
        break;
      case "booking.modified":
        await handleBookingModified(body.data);
        break;
      default:
        // Unknown webhook type - acknowledge but don't process
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleBookingConfirmed(data: Record<string, unknown>) {
  // TODO: Implement booking confirmation logic
  // - Send confirmation email via Supabase
  // - Update booking status in database
  // - Send account activation email if new user
  void data; // Acknowledge parameter for future implementation
}

async function handleBookingCancelled(data: Record<string, unknown>) {
  // TODO: Implement booking cancellation logic
  // - Send cancellation email
  // - Process refund if applicable
  void data; // Acknowledge parameter for future implementation
}

async function handleBookingModified(data: Record<string, unknown>) {
  // TODO: Implement booking modification logic
  // - Send modification confirmation email
  // - Update booking details
  void data; // Acknowledge parameter for future implementation
}
