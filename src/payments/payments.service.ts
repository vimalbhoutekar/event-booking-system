// src/payments/payments.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma';
import { razorpayConfigFactory } from '../configs';
import { UtilsService } from '@Common';
import {
  RazorpayOrderRequest,
  RazorpayOrderResponse,
  RazorpayPaymentVerification,
  RazorpayPaymentDetails,
} from './interfaces';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpayInstance: Razorpay;

  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService, // ✅ ADDED
    @Inject(razorpayConfigFactory.KEY)
    private readonly razorpayConfig: ConfigType<typeof razorpayConfigFactory>,
  ) {
    // Initialize Razorpay instance
    this.razorpayInstance = new Razorpay({
      key_id: this.razorpayConfig.keyId,
      key_secret: this.razorpayConfig.keySecret,
    });

    this.logger.log('Razorpay instance initialized');
  }

  /**
   * ✅ FIX 1: Create Razorpay Order (PAISE conversion)
   * This is called when user clicks "Pay Now"
   */
  async createOrder(
    bookingId: number,
    amountInRupees: number,
    currency: string = 'INR',
  ): Promise<RazorpayOrderResponse> {
    try {
      // Get booking details
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { event: true },
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      // ✅ FIX: Convert rupees to paise (Razorpay uses smallest currency unit)
      const amountInPaise = Math.round(amountInRupees * 100);

      // Create order request
      const orderRequest: RazorpayOrderRequest = {
        amount: amountInPaise, // ✅ Already in paise
        currency: currency,
        receipt: booking.bookingReference,
        notes: {
          bookingId: bookingId.toString(),
          eventId: booking.eventId.toString(),
          eventTitle: booking.event.title,
          seatCount: booking.seatCount.toString(),
        },
      };

      // Create order in Razorpay
      const order = await this.razorpayInstance.orders.create(orderRequest);

      this.logger.log(
        `Razorpay order created: ${order.id} for booking ${bookingId}`,
      );

      // ✅ FIX: Save order ID in payment record (UPSERT for safety)
      await this.prisma.payment.upsert({
        where: { bookingId },
        create: {
          bookingId,
          amount: amountInRupees, // Store in rupees
          currency: currency,
          status: 'PENDING',
          razorpayOrderId: order.id,
        },
        update: {
          razorpayOrderId: order.id,
          status: 'PENDING',
        },
      });

      return order as RazorpayOrderResponse;
    } catch (error) {
      this.logger.error('Error creating Razorpay order:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to create payment order. Please try again.',
      );
    }
  }

  /**
   * Verify Razorpay payment signature
   * This is critical for security - prevents fake payment confirmations
   */
  verifyPaymentSignature(data: RazorpayPaymentVerification): boolean {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        data;

      // Create signature using order_id and payment_id
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;

      // Generate HMAC SHA256 signature
      const generatedSignature = crypto
        .createHmac('sha256', this.razorpayConfig.keySecret)
        .update(text)
        .digest('hex');

      // Compare signatures (timing-safe comparison)
      const isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature),
      );

      if (isValid) {
        this.logger.log(
          `✅ Payment signature verified for order ${razorpay_order_id}`,
        );
      } else {
        this.logger.warn(
          `❌ Invalid payment signature for order ${razorpay_order_id}`,
        );
      }

      return isValid;
    } catch (error) {
      this.logger.error('Error verifying payment signature:', error);
      return false;
    }
  }

  /**
   * Fetch payment details from Razorpay
   * Used to get payment method, card details, etc.
   */
  async fetchPaymentDetails(
    paymentId: string,
  ): Promise<RazorpayPaymentDetails | null> {
    try {
      const payment = await this.razorpayInstance.payments.fetch(paymentId);

      this.logger.log(`Fetched payment details for ${paymentId}`);

      return payment as RazorpayPaymentDetails;
    } catch (error) {
      this.logger.error(
        `Error fetching payment details for ${paymentId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * ✅ FIX 2: Update payment record after successful verification
   * This confirms the payment in our database
   */
  async confirmPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
  ): Promise<void> {
    try {
      // Try to fetch payment details (will fail in test mode with dummy payment ID)
      let paymentDetails: RazorpayPaymentDetails | null = null;

      // ✅ Only fetch in production (dev mode may have dummy IDs)
      if (this.utilsService.isProductionApp()) {
        try {
          paymentDetails = await this.fetchPaymentDetails(razorpayPaymentId);
          this.logger.log('Payment details fetched from Razorpay');
        } catch (error) {
          this.logger.warn(`Could not fetch payment details: ${error.message}`);
        }
      } else {
        // Dev mode - use test data
        this.logger.warn('DEV MODE: Using test payment data');
        paymentDetails = {
          method: 'test_payment',
          card: null,
          bank: null,
          vpa: null,
          wallet: null,
        } as any;
      }

      // Update payment record using updateMany (safer than update)
      const updatedPayment = await this.prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          razorpayPaymentId,
          razorpaySignature,
          status: 'COMPLETED',
          paymentMethod: paymentDetails?.method || 'unknown',
          cardLast4: paymentDetails?.card?.last4 || null,
          cardNetwork: paymentDetails?.card?.network || null,
          bankName: paymentDetails?.bank || null,
          upiId: paymentDetails?.vpa || null,
          walletName: paymentDetails?.wallet || null,
          completedAt: new Date(),
        },
      });

      if (updatedPayment.count === 0) {
        this.logger.error(
          `Payment record not found for order: ${razorpayOrderId}`,
        );
        throw new BadRequestException('Payment record not found');
      }

      this.logger.log(`✅ Payment confirmed: ${razorpayPaymentId}`);
    } catch (error) {
      this.logger.error('Error confirming payment:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to confirm payment');
    }
  }

  /**
   * Handle payment failure
   * Updates payment record with failure reason
   */
  async handlePaymentFailure(
    razorpayOrderId: string,
    failureReason: string,
    failureCode?: string,
  ): Promise<void> {
    try {
      await this.prisma.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status: 'FAILED',
          failureReason,
          failureCode,
        },
      });

      this.logger.warn(
        `Payment failed for order ${razorpayOrderId}: ${failureReason}`,
      );
    } catch (error) {
      this.logger.error('Error handling payment failure:', error);
    }
  }

  /**
   * Process refund (for cancellations)
   */
  async initiateRefund(
    paymentId: string,
    amountInRupees?: number,
  ): Promise<string | null> {
    try {
      const refundRequest: any = {
        payment_id: paymentId,
      };

      if (amountInRupees) {
        // ✅ FIX: Partial refund (convert to paise)
        refundRequest.amount = Math.round(amountInRupees * 100);
      }

      const refund = await this.razorpayInstance.payments.refund(
        paymentId,
        refundRequest,
      );

      this.logger.log(
        `Refund initiated: ${refund.id} for payment ${paymentId}`,
      );

      return refund.id;
    } catch (error) {
      this.logger.error(
        `Error initiating refund for payment ${paymentId}:`,
        error,
      );
      return null;
    }
  }

  /**
   * Verify webhook signature (for webhook events)
   * Used when Razorpay sends payment status updates
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.razorpayConfig.webhookSecret)
        .update(payload)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature),
      );
    } catch (error) {
      this.logger.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  /**
   * ✅ NEW METHOD 1: Fetch Razorpay Order Details
   * Used in reconciliation to check order status
   */
  async fetchOrderDetails(
    orderId: string,
  ): Promise<RazorpayOrderResponse | null> {
    try {
      const order = await this.razorpayInstance.orders.fetch(orderId);

      this.logger.log(
        `Fetched order details: ${orderId} - Status: ${order.status}`,
      );

      return order as RazorpayOrderResponse;
    } catch (error) {
      this.logger.error(`Error fetching order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * ✅ NEW METHOD 2: Fetch All Payment Attempts for an Order
   * Returns list of all payment attempts (failed + successful)
   */
  async fetchOrderPayments(orderId: string): Promise<RazorpayPaymentDetails[]> {
    try {
      const response =
        await this.razorpayInstance.orders.fetchPayments(orderId);

      const payments = response.items || [];

      this.logger.log(
        `Fetched ${payments.length} payment(s) for order ${orderId}`,
      );

      return payments as RazorpayPaymentDetails[];
    } catch (error) {
      this.logger.error(`Error fetching payments for order ${orderId}:`, error);
      return [];
    }
  }
}
