import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CreateBookingRequestDto,
  VerifyBookingPaymentDto,
  GetBookingsRequestDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedRequest, BaseController } from '@Common';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController extends BaseController {
  constructor(private readonly bookingsService: BookingsService) {
    super();
  }

  /**
   * Create new booking with payment order
   * Step 1 of payment flow
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create booking and get payment order' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully with Razorpay order',
    schema: {
      example: {
        booking: {
          id: 1,
          bookingReference: '550e8400-e29b-41d4-a716-446655440000',
          status: 'PENDING',
          seatCount: 2,
          baseAmount: 1000,
          platformFee: 118,
          totalAmount: 1118,
          expiresAt: '2025-12-06T12:05:00Z',
        },
        payment: {
          orderId: 'order_MNqR8zxPqZqKj4',
          amount: 111800,
          currency: 'INR',
          razorpayKeyId: 'rzp_test_xxxxx',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input or seats not available',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Not logged in' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Seats no longer available',
  })
  async createBooking(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateBookingRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.createBooking(ctx.user.id, dto);
  }

  /**
   * Verify payment and confirm booking
   * Step 2 of payment flow (called after Razorpay payment)
   */
  @Post('verify-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify payment and confirm booking' })
  @ApiResponse({
    status: 200,
    description: 'Payment verified and booking confirmed',
    schema: {
      example: {
        success: true,
        message: 'Booking confirmed successfully',
        booking: {
          id: 1,
          bookingReference: '550e8400-e29b-41d4-a716-446655440000',
          status: 'CONFIRMED',
          seatCount: 2,
          totalAmount: 1118,
          confirmedAt: '2025-12-06T12:03:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid signature or booking expired',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async verifyPayment(
    @Request() req: AuthenticatedRequest,
    @Body() dto: VerifyBookingPaymentDto,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.verifyAndConfirmBooking(ctx.user.id, dto);
  }

  /**
   * Get all bookings for logged-in user
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my bookings' })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            bookingReference: '550e8400-e29b-41d4-a716-446655440000',
            status: 'CONFIRMED',
            seatCount: 2,
            totalAmount: 1118,
            event: {
              id: 1,
              title: 'Tech Conference 2025',
              eventDate: '2025-12-31T18:00:00Z',
              venue: 'Convention Center',
            },
          },
        ],
        meta: {
          total: 10,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyBookings(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetBookingsRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.getUserBookings(ctx.user.id, query);
  }

  /**
   * Get single booking by reference
   */
  @Get(':reference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get booking by reference' })
  @ApiResponse({
    status: 200,
    description: 'Booking details retrieved',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingByReference(
    @Request() req: AuthenticatedRequest,
    @Param('reference') reference: string,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.getBookingByReference(ctx.user.id, reference);
  }
}
