// Razorpay Order Interface
export interface RazorpayOrderRequest {
  amount: number; // in paise (₹100 = 10000 paise)
  currency: string;
  receipt: string; // booking reference
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string; // order_xxxxx
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

// Razorpay Payment Verification
export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Razorpay Payment Details
export interface RazorpayPaymentDetails {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  status: string;
  order_id: string;
  method: string;
  description: string;
  card?: {
    id: string;
    entity: string;
    name: string;
    last4: string;
    network: string;
    type: string;
  };
  bank?: string;
  wallet?: string;
  vpa?: string; // UPI ID
  email: string;
  contact: string;
  created_at: number;
}

// Razorpay Refund
export interface RazorpayRefundRequest {
  payment_id: string;
  amount?: number; // Optional - full refund if not provided
  notes?: Record<string, string>;
}

export interface RazorpayRefundResponse {
  id: string; // rfnd_xxxxx
  entity: string;
  amount: number;
  currency: string;
  payment_id: string;
  receipt: string | null;
  status: string;
  created_at: number;
}

// Razorpay Webhook Event
export interface RazorpayWebhookEvent {
  entity: string;
  account_id: string;
  event: string; // payment.captured, payment.failed, etc.
  contains: string[];
  payload: {
    payment: {
      entity: RazorpayPaymentDetails;
    };
    order?: {
      entity: RazorpayOrderResponse;
    };
  };
  created_at: number;
}
