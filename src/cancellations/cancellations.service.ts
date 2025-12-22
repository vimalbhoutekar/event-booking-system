import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { differenceInHours } from 'date-fns';
// import { PrismaService } from '../prisma';
import { PaymentsService } from '../payments';
import { CancelBookingRequestDto } from './dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class CancellationsService {
  private readonly logger = new Logger(CancellationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Cancel a confirmed booking
   * Logic:
   * - 3+ hours before event: Partial refund (with cancellation charges)
   * - Less than 3 hours: Can cancel but NO refund
   */
  async cancelBooking(userId: number, dto: CancelBookingRequestDto) {
    // Get booking with event details
    const booking = await this.prisma.booking.findUnique({
      where: { bookingReference: dto.bookingReference },
      include: {
        event: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check ownership
    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized access to booking');
    }

    // Check if already cancelled
    if (booking.status === 'CANCELLED' || booking.status === 'REFUNDED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    // Only CONFIRMED bookings can be cancelled
    // PENDING bookings will auto-expire
    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Only confirmed bookings can be cancelled');
    }

    // Check if event date exists (MUST exist for cancellation)
    if (!booking.event.eventDate) {
      throw new BadRequestException(
        'Cannot process cancellation - Event date is not set. Please contact support.',
      );
    }

    // Check if event has already happened
    if (new Date() > booking.event.eventDate) {
      throw new BadRequestException('Cannot cancel past events');
    }

    // Calculate time difference
    const hoursUntilEvent = differenceInHours(
      booking.event.eventDate,
      new Date(),
    );

    // Cancellation deadline: 3 hours before event
    const CANCELLATION_DEADLINE_HOURS = 3;

    // Calculate refund
    const refundCalculation = this.calculateRefund(
      Number(booking.totalAmount),
      Number(booking.platformFee),
      hoursUntilEvent,
      CANCELLATION_DEADLINE_HOURS,
      Number(booking.event.cancellationCharges || 0),
    );

    // Process cancellation in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create cancellation record
      const cancellation = await tx.cancellation.create({
        data: {
          bookingId: booking.id,
          reason: dto.reason,
          cancelledBy: 'USER',
          originalAmount: booking.totalAmount,
          cancellationFee: refundCalculation.cancellationFee,
          refundAmount: refundCalculation.refundAmount,
          platformFeeRefunded: refundCalculation.platformFeeRefunded,
          refundStatus:
            refundCalculation.refundAmount > 0 ? 'PENDING' : 'REJECTED',
        },
      });

      // Update booking status
      const newStatus =
        refundCalculation.refundAmount > 0 ? 'CANCELLED' : 'CANCELLED';
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: newStatus,
          isDeleted: false, // Soft delete set to false (we keep the record)
        },
      });

      // Release seats back to event
      await tx.event.update({
        where: { id: booking.eventId },
        data: {
          availableSeats: { increment: booking.seatCount },
          totalBookings: { decrement: 1 },
          totalRevenue: { decrement: booking.totalAmount },
        },
      });

      return cancellation;
    });

    this.logger.log(
      `Booking cancelled: ${booking.bookingReference} - Refund: ₹${refundCalculation.refundAmount}`,
    );

    // Initiate refund if eligible
    if (
      refundCalculation.refundAmount > 0 &&
      booking.payment?.razorpayPaymentId
    ) {
      try {
        const refundId = await this.paymentsService.initiateRefund(
          booking.payment.razorpayPaymentId,
          refundCalculation.refundAmount,
        );

        if (refundId) {
          // Update cancellation with refund ID
          await this.prisma.cancellation.update({
            where: { id: result.id },
            data: {
              refundId,
              refundStatus: 'APPROVED',
            },
          });

          this.logger.log(`Refund initiated: ${refundId}`);
        }
      } catch (error) {
        this.logger.error('Refund initiation failed:', error);
        // Don't throw - cancellation is already processed
      }
    }

    return {
      success: true,
      message: this.getCancellationMessage(
        hoursUntilEvent,
        CANCELLATION_DEADLINE_HOURS,
        refundCalculation.refundAmount,
      ),
      cancellation: {
        id: result.id,
        bookingReference: booking.bookingReference,
        originalAmount: Number(result.originalAmount),
        cancellationFee: Number(result.cancellationFee),
        refundAmount: Number(result.refundAmount),
        refundStatus: result.refundStatus,
        hoursUntilEvent,
      },
    };
  }

  /**
   * Calculate refund amount based on timing and cancellation policy
   */
  private calculateRefund(
    totalAmount: number,
    platformFee: number,
    hoursUntilEvent: number,
    deadlineHours: number,
    cancellationChargePercent: number,
  ) {
    let refundAmount = 0;
    let cancellationFee = 0;
    let platformFeeRefunded = 0;

    // Case 1: Less than 3 hours - NO REFUND
    if (hoursUntilEvent < deadlineHours) {
      refundAmount = 0;
      cancellationFee = totalAmount;
      platformFeeRefunded = 0;
    }
    // Case 2: 3+ hours - Partial refund with cancellation charges
    else {
      // Calculate cancellation fee (percentage of total amount)
      cancellationFee = (totalAmount * cancellationChargePercent) / 100;

      // Refund = Total - Cancellation Fee
      refundAmount = totalAmount - cancellationFee;

      // Platform fee refunded (if applicable)
      platformFeeRefunded = platformFee;
    }

    return {
      refundAmount: Math.round(refundAmount * 100) / 100, // Round to 2 decimals
      cancellationFee: Math.round(cancellationFee * 100) / 100,
      platformFeeRefunded: Math.round(platformFeeRefunded * 100) / 100,
    };
  }

  /**
   * Get user-friendly cancellation message
   */
  private getCancellationMessage(
    hoursUntilEvent: number,
    deadlineHours: number,
    refundAmount: number,
  ): string {
    if (hoursUntilEvent < deadlineHours) {
      return `Booking cancelled. No refund available as cancellation is within ${deadlineHours} hours of the event.`;
    }

    if (refundAmount > 0) {
      return `Booking cancelled successfully. Refund of ₹${refundAmount} will be processed within 5-7 business days.`;
    }

    return 'Booking cancelled successfully.';
  }

  /**
   * Get cancellation details by booking reference
   */
  async getCancellationDetails(userId: number, bookingReference: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        cancellation: true,
        event: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized access');
    }

    if (!booking.cancellation) {
      throw new NotFoundException('No cancellation found for this booking');
    }

    return {
      booking: {
        bookingReference: booking.bookingReference,
        status: booking.status,
        eventTitle: booking.event.title,
      },
      cancellation: {
        originalAmount: Number(booking.cancellation.originalAmount),
        cancellationFee: Number(booking.cancellation.cancellationFee),
        refundAmount: Number(booking.cancellation.refundAmount),
        refundStatus: booking.cancellation.refundStatus,
        cancelledAt: booking.cancellation.createdAt,
        reason: booking.cancellation.reason,
      },
    };
  }
}
