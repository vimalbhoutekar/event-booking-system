// src/scheduler/scheduler.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { subMinutes } from 'date-fns';
import { PrismaService } from '../prisma';
import { PaymentsService } from '../payments';
import { TicketsService } from '../tickets';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  private isProcessingExpiry = false;
  private isProcessingReconciliation = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly ticketsService: TicketsService,
  ) {}

  /**
   * Cron job to expire old PENDING bookings
   * Runs every 1 minute
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async expireOldBookings() {
    if (this.isProcessingExpiry) {
      this.logger.debug('Previous expiry job still running - skipping');
      return;
    }

    this.isProcessingExpiry = true;

    try {
      const now = new Date();

      const expiredBookings = await this.prisma.booking.findMany({
        where: {
          status: 'PENDING',
          expiresAt: { lt: now },
          isDeleted: false,
        },
        select: {
          id: true,
          eventId: true,
          seatCount: true,
          bookingReference: true,
        },
      });

      if (expiredBookings.length === 0) {
        return;
      }

      this.logger.log(`Found ${expiredBookings.length} expired bookings`);

      const bookingIds = expiredBookings.map((b) => b.id);

      const seatsByEvent = expiredBookings.reduce(
        (acc, booking) => {
          if (!acc[booking.eventId]) {
            acc[booking.eventId] = 0;
          }
          acc[booking.eventId] += booking.seatCount;
          return acc;
        },
        {} as Record<number, number>,
      );

      await this.prisma.$transaction(async (tx) => {
        const updateResult = await tx.booking.updateMany({
          where: {
            id: { in: bookingIds },
            status: 'PENDING',
          },
          data: {
            status: 'EXPIRED',
          },
        });

        this.logger.debug(`Updated ${updateResult.count} bookings to EXPIRED`);

        if (updateResult.count > 0) {
          for (const [eventIdStr, seatCount] of Object.entries(seatsByEvent)) {
            const eventId = parseInt(eventIdStr, 10);

            await tx.event.update({
              where: { id: eventId },
              data: {
                availableSeats: { increment: seatCount },
              },
            });
          }
        }
      });

      this.logger.log(
        `Expired ${expiredBookings.length} bookings and released seats`,
      );
    } catch (error) {
      this.logger.error('Error expiring old bookings:', error);
    } finally {
      this.isProcessingExpiry = false;
    }
  }

  /**
   * ✅ PRODUCTION-READY: Reconcile stuck payments
   * Runs every 5 minutes - checks Razorpay for actual payment status
   * This is the FAILSAFE if both API and webhook failed!
   */
  @Cron('*/5 * * * *')
  async reconcileStuckPayments() {
    if (this.isProcessingReconciliation) {
      this.logger.debug('Previous reconciliation job still running - skipping');
      return;
    }

    this.isProcessingReconciliation = true;

    try {
      this.logger.log('🔄 Starting payment reconciliation...');

      // Find stuck payments (older than 10 minutes)
      const tenMinutesAgo = subMinutes(new Date(), 10);

      // Check total stuck count first
      const totalStuck = await this.prisma.payment.count({
        where: {
          status: 'PENDING',
          createdAt: { lt: tenMinutesAgo },
        },
      });

      if (totalStuck === 0) {
        this.logger.log('✅ No stuck payments found');
        return;
      }

      // Dynamic batch size based on load
      let batchSize = 50;
      if (totalStuck > 500) {
        batchSize = 200;
        this.logger.warn(
          `⚠️ High load detected: ${totalStuck} stuck payments. Using batch size ${batchSize}`,
        );
      }

      this.logger.log(
        `📊 Found ${totalStuck} stuck payments, processing batch of ${batchSize}...`,
      );

      // Fetch stuck payments
      const stuckPayments = await this.prisma.payment.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lt: tenMinutesAgo },
        },
        include: {
          booking: {
            include: { event: true },
          },
        },
        take: batchSize,
        orderBy: { createdAt: 'asc' }, // Process oldest first
      });

      let reconciledCount = 0;
      let failedCount = 0;

      // Process each stuck payment
      for (const payment of stuckPayments) {
        try {
          const result = await this.reconcilePayment(payment);

          if (result.success) {
            reconciledCount++;
          } else {
            failedCount++;
          }
        } catch (error) {
          this.logger.error(
            `❌ Error reconciling payment ${payment.id}:`,
            error.message,
          );
          failedCount++;
        }
      }

      this.logger.log(
        `✅ Reconciliation completed: ${reconciledCount} recovered, ${failedCount} failed`,
      );
    } catch (error) {
      this.logger.error('❌ Payment reconciliation job failed:', error);
    } finally {
      this.isProcessingReconciliation = false;
    }
  }

  /**
   * ✅ CORE LOGIC: Reconcile a single payment
   * Returns { success: boolean, message: string }
   */
  private async reconcilePayment(
    payment: any,
  ): Promise<{ success: boolean; message: string }> {
    const booking = payment.booking;

    // Validation: Check if Razorpay order ID exists
    if (!payment.razorpayOrderId) {
      this.logger.warn(
        `⚠️ Payment ${payment.id} has no Razorpay order ID - skipping`,
      );
      return { success: false, message: 'No order ID' };
    }

    // IDEMPOTENCY: Skip if booking already confirmed
    if (booking.status === 'CONFIRMED' || booking.status === 'ATTENDED') {
      this.logger.debug(`✓ Booking ${booking.id} already confirmed - skipping`);
      return { success: true, message: 'Already confirmed' };
    }

    // STEP 1: Fetch order details from Razorpay
    const razorpayOrder = await this.paymentsService.fetchOrderDetails(
      payment.razorpayOrderId,
    );

    if (!razorpayOrder) {
      this.logger.warn(
        `⚠️ Cannot fetch Razorpay order: ${payment.razorpayOrderId}`,
      );
      return { success: false, message: 'Order fetch failed' };
    }

    this.logger.debug(
      `📦 Order ${razorpayOrder.id} status: ${razorpayOrder.status}, attempts: ${razorpayOrder.attempts}`,
    );

    // STEP 2: Handle based on order status
    switch (razorpayOrder.status) {
      case 'paid':
        return await this.handlePaidOrder(payment, booking, razorpayOrder);

      case 'attempted':
        return await this.handleAttemptedOrder(payment, booking, razorpayOrder);

      case 'created':
        return await this.handleCreatedOrder(payment, booking);

      default:
        this.logger.warn(`⚠️ Unknown order status: ${razorpayOrder.status}`);
        return {
          success: false,
          message: `Unknown status: ${razorpayOrder.status}`,
        };
    }
  }

  /**
   * ✅ Handle PAID orders - Complete the booking!
   */
  private async handlePaidOrder(
    payment: any,
    booking: any,
    razorpayOrder: any,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`💰 Reconciling PAID order: ${razorpayOrder.id}`);

      // STEP 1: Fetch all payment attempts for this order
      const payments = await this.paymentsService.fetchOrderPayments(
        razorpayOrder.id,
      );

      if (payments.length === 0) {
        this.logger.warn(
          `⚠️ No payments found for paid order: ${razorpayOrder.id}`,
        );
        return { success: false, message: 'No payments found' };
      }

      // STEP 2: Find the successful payment (status = "captured")
      const successfulPayment = payments.find((p) => p.status === 'captured');

      if (!successfulPayment) {
        this.logger.warn(
          `⚠️ Order is paid but no captured payment found: ${razorpayOrder.id}`,
        );
        return { success: false, message: 'No captured payment' };
      }

      this.logger.log(
        `✅ Found captured payment: ${successfulPayment.id} via ${successfulPayment.method}`,
      );

      // STEP 3: Complete booking in transaction
      await this.prisma.$transaction(async (tx) => {
        // Update payment record
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            razorpayPaymentId: successfulPayment.id,
            status: 'COMPLETED',
            completedAt: new Date(),
            paymentMethod: successfulPayment.method,
            cardLast4: successfulPayment.card?.last4 || null,
            cardNetwork: successfulPayment.card?.network || null,
            bankName: successfulPayment.bank || null,
            upiId: successfulPayment.vpa || null,
            walletName: successfulPayment.wallet || null,
          },
        });

        // Update booking status
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(),
          },
        });

        // Update event statistics
        await tx.event.update({
          where: { id: booking.eventId },
          data: {
            totalBookings: { increment: 1 },
            totalRevenue: { increment: booking.totalAmount },
          },
        });
      });

      this.logger.log(`✅✅ RECONCILED booking: ${booking.bookingReference}`);

      // Generate ticket (async - don't block)
      this.ticketsService.generateTicket(booking.id).catch((err) => {
        this.logger.error(
          'Ticket generation failed during reconciliation:',
          err,
        );
      });

      return { success: true, message: 'Booking confirmed via reconciliation' };
    } catch (error) {
      this.logger.error(`❌ Error handling paid order:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * ✅ Handle ATTEMPTED orders - Mark as failed if expired
   */
  private async handleAttemptedOrder(
    payment: any,
    booking: any,
    razorpayOrder: any,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const now = new Date();

      // If booking expired, mark payment as failed
      if (now > booking.expiresAt) {
        this.logger.log(
          `⏰ Booking expired for attempted order: ${razorpayOrder.id}`,
        );

        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason:
              'Payment attempted but not completed within booking window',
          },
        });

        return { success: true, message: 'Marked as failed (expired)' };
      }

      // Still within expiry window - wait for user to complete
      this.logger.debug(
        `⏳ Payment still being attempted: ${razorpayOrder.id} (${razorpayOrder.attempts} attempts)`,
      );

      return { success: true, message: 'Still being attempted' };
    } catch (error) {
      this.logger.error(`❌ Error handling attempted order:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * ✅ Handle CREATED orders - No payment attempt yet
   */
  private async handleCreatedOrder(
    payment: any,
    booking: any,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const now = new Date();

      // If booking expired and no payment attempt, mark as failed
      if (now > booking.expiresAt) {
        this.logger.log(
          `⏰ Booking expired with no payment attempt: ${payment.razorpayOrderId}`,
        );

        await this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED',
            failureReason: 'No payment attempt within booking window',
          },
        });

        return { success: true, message: 'Marked as failed (no attempt)' };
      }

      // Still within window - user might still pay
      this.logger.debug(
        `⏳ Order created but no payment yet: ${payment.razorpayOrderId}`,
      );

      return { success: true, message: 'Waiting for payment' };
    } catch (error) {
      this.logger.error(`❌ Error handling created order:`, error);
      return { success: false, message: error.message };
    }
  }

  /**
   * Helper: Fetch Razorpay order details
   */
  private async fetchRazorpayOrder(orderId: string): Promise<any> {
    try {
      // This requires Razorpay instance access
      // We'll need to inject PaymentsService or create a shared Razorpay instance

      // For now, we'll use the payments service method
      // Note: This is a workaround - ideally we'd have direct order fetch

      // Since we don't have direct order fetch in PaymentsService,
      // let's add a note that this needs implementation

      this.logger.warn(`Order status fetch not implemented yet for ${orderId}`);
      return null;
    } catch (error) {
      this.logger.error(`Error fetching Razorpay order ${orderId}:`, error);
      return null;
    }
  }

  /**
   * Clean up very old expired bookings
   * Runs daily at 2 AM
   */
  @Cron('0 2 * * *')
  async cleanupOldExpiredBookings() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await this.prisma.booking.updateMany({
        where: {
          status: 'EXPIRED',
          createdAt: { lt: thirtyDaysAgo },
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      if (result.count > 0) {
        this.logger.log(`Soft deleted ${result.count} old expired bookings`);
      }
    } catch (error) {
      this.logger.error('Error cleaning up old bookings:', error);
    }
  }

  /**
   * Mark past events as COMPLETED
   * Runs every hour
   */
  @Cron(CronExpression.EVERY_HOUR)
  async markPastEventsCompleted() {
    try {
      const now = new Date();

      const result = await this.prisma.event.updateMany({
        where: {
          status: 'PUBLISHED',
          eventDate: { lt: now },
        },
        data: {
          status: 'COMPLETED',
        },
      });

      if (result.count > 0) {
        this.logger.log(`Marked ${result.count} past events as COMPLETED`);
      }
    } catch (error) {
      this.logger.error('Error marking past events:', error);
    }
  }
}
