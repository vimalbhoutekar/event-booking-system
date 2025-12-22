import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { addMinutes } from 'date-fns';
import { PrismaService } from '../prisma';
import { PaymentsService } from '../payments';
import { gstConfigFactory, bookingConfigFactory } from '../configs';
import {
  CreateBookingRequestDto,
  VerifyBookingPaymentDto,
  GetBookingsRequestDto,
} from './dto';
import { TicketsService } from '../tickets';
import { UtilsService } from '@Common';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
    private readonly ticketsService: TicketsService,
    private readonly utilsService: UtilsService,
    @Inject(gstConfigFactory.KEY)
    private readonly gstConfig: ConfigType<typeof gstConfigFactory>,
    @Inject(bookingConfigFactory.KEY)
    private readonly bookingConfig: ConfigType<typeof bookingConfigFactory>,
  ) {}

  /**
   * Create booking with payment order
   * Step 1: Create PENDING booking
   * Step 2: Create Razorpay order
   * Step 3: Return order details for frontend
   */
  async createBooking(userId: number, dto: CreateBookingRequestDto) {
    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      try {
        return await this._createBookingWithRetry(userId, dto);
      } catch (error) {
        attempt++;

        // If it's a conflict (optimistic locking), retry
        if (error instanceof ConflictException && attempt < MAX_RETRIES) {
          this.logger.warn(
            `Booking conflict, retrying... Attempt ${attempt}/${MAX_RETRIES}`,
          );
          await this.sleep(100 * attempt); // Exponential backoff
          continue;
        }

        // For other errors or max retries reached, throw
        throw error;
      }
    }

    throw new ConflictException(
      'Unable to create booking due to high demand. Please try again.',
    );
  }

  /**
   * Internal method for creating booking (with optimistic locking)
   */
  private async _createBookingWithRetry(
    userId: number,
    dto: CreateBookingRequestDto,
  ) {
    // Check for duplicate booking (idempotency)
    if (dto.idempotencyKey) {
      const existingBooking = await this.prisma.booking.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include: { payment: true },
      });

      if (existingBooking) {
        this.logger.log(`Idempotent request detected: ${dto.idempotencyKey}`);
        return this.formatBookingResponse(existingBooking);
      }
    }

    // Get event details
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId, isDeleted: false },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException('Event is not available for booking');
    }

    // Check seat availability
    if (event.availableSeats < dto.seatCount) {
      throw new BadRequestException(
        `Only ${event.availableSeats} seats available`,
      );
    }

    // ✅ FIX 1: Calculate pricing (FIXED variable names)
    const pricing = this.calculatePricing(
      event.basePrice,
      event.platformFee,
      dto.seatCount,
    );

    // Calculate expiry time (5 minutes from now)
    const expiresAt = addMinutes(new Date(), this.bookingConfig.expiryMinutes);

    // Start transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Step 1: Try to reduce seats (optimistic locking)
      const updatedEvent = await tx.event.updateMany({
        where: {
          id: dto.eventId,
          version: event.version, // Optimistic lock
          availableSeats: { gte: dto.seatCount }, // Double-check availability
        },
        data: {
          availableSeats: { decrement: dto.seatCount },
          version: { increment: 1 }, // Increment version
        },
      });

      // If no rows updated, conflict occurred
      if (updatedEvent.count === 0) {
        throw new ConflictException(
          'Seats no longer available. Please try again.',
        );
      }

      // Step 2: Create booking (PENDING status)
      const booking = await tx.booking.create({
        data: {
          userId,
          eventId: dto.eventId,
          seatCount: dto.seatCount,
          status: 'PENDING',
          idempotencyKey: dto.idempotencyKey,
          attendeeName: dto.attendeeName,
          attendeeEmail: dto.attendeeEmail,
          attendeePhone: dto.attendeePhone,
          baseAmount: pricing.baseAmount,
          platformFee: pricing.platformFee,
          totalAmount: pricing.totalAmount,
          organizerAmount: pricing.organizerAmount,
          expiresAt,
        },
      });

      this.logger.log(`Booking created: ${booking.bookingReference} (PENDING)`);

      return booking;
    });

    // Step 3: Create Razorpay order (outside transaction)
    const razorpayOrder = await this.paymentsService.createOrder(
      result.id,
      Number(result.totalAmount),
      result.currency,
    );

    // Return formatted response
    return {
      booking: this.formatBookingResponse(result),
      payment: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    };
  }

  /**
   * ✅ FIX 1: Calculate pricing with GST (PRODUCTION-GRADE)
   * Uses PAISE (smallest currency unit) to avoid floating-point errors
   */
  private calculatePricing(
    basePrice: Prisma.Decimal,
    platformFeePerSeat: Prisma.Decimal,
    seatCount: number,
  ) {
    // Convert to paise (smallest unit) - CRITICAL for precision
    const basePriceInPaise = Math.round(Number(basePrice) * 100);
    const platformFeePerSeatInPaise = Math.round(
      Number(platformFeePerSeat) * 100,
    );

    // All calculations in paise (integers - no floating point errors!)
    const baseAmountInPaise = basePriceInPaise * seatCount;
    let totalPlatformFeeInPaise = platformFeePerSeatInPaise * seatCount;

    // GST calculation (still in paise)
    if (this.gstConfig.enabled) {
      // Formula: (amount * rate) / 100
      // Example: ₹699.93 → 69993 paise, 18% GST = 12598 paise = ₹125.98
      const gstAmountInPaise = Math.round(
        (totalPlatformFeeInPaise * this.gstConfig.rate) / 100,
      );
      totalPlatformFeeInPaise = totalPlatformFeeInPaise + gstAmountInPaise;
    }

    const totalAmountInPaise = baseAmountInPaise + totalPlatformFeeInPaise;

    // Convert back to rupees for storage (Decimal type in DB)
    return {
      baseAmount: baseAmountInPaise / 100,
      platformFee: totalPlatformFeeInPaise / 100,
      totalAmount: totalAmountInPaise / 100,
      organizerAmount: baseAmountInPaise / 100,
    };
  }

  /**
   * ✅ FIX 2: Verify payment and confirm booking (WITH RETRY MECHANISM)
   * Called after user completes payment on Razorpay
   */
  async verifyAndConfirmBooking(userId: number, dto: VerifyBookingPaymentDto) {
    // Get booking
    const booking = await this.prisma.booking.findUnique({
      where: { bookingReference: dto.bookingReference },
      include: { payment: true, event: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check ownership
    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized access to booking');
    }

    // Check if already confirmed (idempotency)
    if (booking.status === 'CONFIRMED') {
      this.logger.log(`Booking already confirmed: ${booking.bookingReference}`);
      return {
        success: true,
        message: 'Booking already confirmed',
        booking: this.formatBookingResponse(booking),
      };
    }

    // Check if expired
    if (new Date() > booking.expiresAt && booking.status === 'PENDING') {
      throw new BadRequestException(
        'Booking expired. Please create a new booking.',
      );
    }

    // ✅ FIX 2A: Verify payment signature (PRODUCTION - MUST ENABLE!)

    let isValidSignature: boolean;

    if (this.utilsService.isProductionApp()) {
      // CRITICAL: MUST verify in production
      isValidSignature = this.paymentsService.verifyPaymentSignature({
        razorpay_order_id: dto.razorpay_order_id,
        razorpay_payment_id: dto.razorpay_payment_id,
        razorpay_signature: dto.razorpay_signature,
      });

      if (!isValidSignature) {
        this.logger.error('SECURITY: Invalid payment signature detected', {
          bookingId: booking.id,
          userId,
          orderId: dto.razorpay_order_id,
        });

        throw new BadRequestException('Payment verification failed');
      }
    } else {
      // Development: Log warning but allow
      this.logger.warn('DEV MODE: Skipping payment signature verification');
      isValidSignature = true;
    }

    // ✅ FIX 2B: Transaction with retry mechanism
    const MAX_RETRIES = 3;
    let attempt = 0;
    let lastError: any;
    let success = false;

    while (attempt < MAX_RETRIES && !success) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Update payment
          await this.paymentsService.confirmPayment(
            dto.razorpay_order_id,
            dto.razorpay_payment_id,
            dto.razorpay_signature,
          );

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

        // Success!
        success = true;
        this.logger.log(`✅ Booking confirmed: ${booking.bookingReference}`);
      } catch (error) {
        attempt++;
        lastError = error;

        this.logger.warn(
          `Transaction failed (attempt ${attempt}/${MAX_RETRIES}): ${error.message}`,
        );

        if (attempt < MAX_RETRIES) {
          await this.sleep(1000 * attempt); // Exponential backoff: 1s, 2s, 3s
        }
      }
    }

    // ✅ FIX 2C: Handle transaction failure gracefully
    if (!success) {
      this.logger.error(
        `Failed to confirm booking after ${MAX_RETRIES} attempts: ${booking.bookingReference}`,
        lastError,
      );

      // IMPORTANT: Payment is recorded, webhook/cron will complete it
      return {
        success: false,
        message:
          'Payment received. Booking confirmation is processing. You will receive confirmation shortly.',
        bookingReference: booking.bookingReference,
      };
    }

    // Generate ticket (async - don't block response)
    this.ticketsService.generateTicket(booking.id).catch((error) => {
      this.logger.error('Ticket generation failed:', error);
      // Don't throw - booking is already confirmed
    });

    // Fetch updated booking
    const updatedBooking = await this.prisma.booking.findUnique({
      where: { id: booking.id },
      include: { payment: true, event: true },
    });

    return {
      success: true,
      message: 'Booking confirmed successfully',
      booking: this.formatBookingResponse(updatedBooking),
    };
  }

  /**
   * Get user's bookings with pagination
   */
  async getUserBookings(userId: number, query: GetBookingsRequestDto) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.BookingWhereInput = {
      userId,
      isDeleted: false,
      ...(status && { status }),
    };

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              venue: true,
              coverImage: true,
            },
          },
          payment: {
            select: {
              status: true,
              paymentMethod: true,
              completedAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => this.formatBookingResponse(b)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get booking by reference
   */
  async getBookingByReference(userId: number, bookingReference: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        event: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized access to booking');
    }

    return this.formatBookingResponse(booking);
  }

  /**
   * Format booking response for API
   */
  private formatBookingResponse(booking: any) {
    return {
      id: booking.id,
      bookingReference: booking.bookingReference,
      status: booking.status,
      seatCount: booking.seatCount,
      baseAmount: Number(booking.baseAmount),
      platformFee: Number(booking.platformFee),
      totalAmount: Number(booking.totalAmount),
      expiresAt: booking.expiresAt,
      confirmedAt: booking.confirmedAt,
      createdAt: booking.createdAt,
      event: booking.event,
      payment: booking.payment,
      qrCode: booking.qrCode,
      ticketUrl: booking.ticketUrl,
    };
  }

  /**
   * Helper: Sleep for retry logic
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
