// src/payments/payments.controller.ts

import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { VerifyPaymentDto, PaymentWebhookDto } from './dto';
import { JwtAuthGuard } from '../common/guards';
import { AuthenticatedRequest } from '../common/types';
import { PrismaService } from '../prisma';
import { TicketsService } from '../tickets';
import { Logger } from '@nestjs/common';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly prisma: PrismaService,
    private readonly ticketsService: TicketsService,
  ) {}

  /**
   * Verify payment after user completes payment on Razorpay
   * This is called from frontend after successful payment
   */
  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify Razorpay payment signature' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified successfully',
  })
  async verifyPayment(
    @Body() verifyDto: VerifyPaymentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      // Step 1: Verify signature (security check)
      const isValidSignature =
        this.paymentsService.verifyPaymentSignature(verifyDto);

      if (!isValidSignature) {
        throw new BadRequestException('Invalid payment signature');
      }

      // Step 2: Confirm payment in database
      await this.paymentsService.confirmPayment(
        verifyDto.razorpay_order_id,
        verifyDto.razorpay_payment_id,
        verifyDto.razorpay_signature,
      );

      return {
        success: true,
        message: 'Payment verified successfully',
        razorpay_payment_id: verifyDto.razorpay_payment_id,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Payment verification failed');
    }
  }

  /**
   * ✅ ENHANCED: Webhook endpoint for Razorpay events
   * This is called by Razorpay when payment status changes
   * CRITICAL: This completes booking if API call failed!
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Razorpay webhook endpoint (called by Razorpay)',
  })
  async handleWebhook(
    @Body() webhookData: PaymentWebhookDto,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    try {
      // Verify webhook signature for security
      const payload = JSON.stringify(webhookData);
      const isValid = this.paymentsService.verifyWebhookSignature(
        payload,
        signature,
      );

      if (!isValid) {
        this.logger.error('Invalid webhook signature');
        throw new BadRequestException('Invalid webhook signature');
      }

      // Process webhook event based on event type
      const { event, payload: eventPayload } = webhookData;

      switch (event) {
        case 'payment.captured':
          await this.handlePaymentCaptured(eventPayload);
          break;

        case 'payment.failed':
          await this.handlePaymentFailed(eventPayload);
          break;

        case 'refund.processed':
          // Handle refund logic (future)
          this.logger.log('Refund processed webhook received');
          break;

        default:
          this.logger.log(`Unhandled webhook event: ${event}`);
      }

      return { status: 'ok' };
    } catch (error) {
      this.logger.error('Webhook processing error:', error);
      throw new BadRequestException('Webhook processing failed');
    }
  }

  /**
   * ✅ CRITICAL: Handle successful payment webhook
   * This is the SAFETY NET if API call failed!
   */
  private async handlePaymentCaptured(payload: any) {
    try {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      this.logger.log(`Webhook: payment.captured for order ${orderId}`);

      // Get payment record
      const paymentRecord = await this.prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
        include: { booking: { include: { event: true } } },
      });

      if (!paymentRecord) {
        this.logger.error(`Payment record not found for order: ${orderId}`);
        return;
      }

      const booking = paymentRecord.booking;

      // ✅ IDEMPOTENCY CHECK - Skip if already confirmed
      if (booking.status === 'CONFIRMED' || booking.status === 'ATTENDED') {
        this.logger.log(
          `Booking ${booking.id} already confirmed (webhook replay) - skipping`,
        );
        return;
      }

      // ✅ SAFETY NET - Complete the booking transaction
      this.logger.log(
        `Webhook completing booking: ${booking.bookingReference}`,
      );

      await this.prisma.$transaction(async (tx) => {
        // Update payment
        await tx.payment.update({
          where: { id: paymentRecord.id },
          data: {
            razorpayPaymentId: paymentId,
            status: 'COMPLETED',
            completedAt: new Date(),
            paymentMethod: payment.method || 'webhook_capture',
          },
        });

        // Update booking
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: 'CONFIRMED',
            confirmedAt: new Date(),
          },
        });

        // Update event stats
        await tx.event.update({
          where: { id: booking.eventId },
          data: {
            totalBookings: { increment: 1 },
            totalRevenue: { increment: booking.totalAmount },
          },
        });
      });

      this.logger.log(
        `✅ Webhook recovered booking: ${booking.bookingReference}`,
      );

      // Generate ticket (async - don't block webhook)
      this.ticketsService.generateTicket(booking.id).catch((err) => {
        this.logger.error('Ticket generation failed in webhook:', err);
      });
    } catch (error) {
      this.logger.error('Error handling payment.captured:', error);
      // Don't throw - webhook will retry
    }
  }

  /**
   * Handle failed payment webhook
   */
  private async handlePaymentFailed(payload: any) {
    try {
      const payment = payload.payment.entity;
      const orderId = payment.order_id;
      const failureReason = payment.error_description || 'Payment failed';
      const failureCode = payment.error_code;

      this.logger.log(`Webhook: payment.failed for order ${orderId}`);

      await this.paymentsService.handlePaymentFailure(
        orderId,
        failureReason,
        failureCode,
      );
    } catch (error) {
      this.logger.error('Error handling payment.failed:', error);
    }
  }
}
