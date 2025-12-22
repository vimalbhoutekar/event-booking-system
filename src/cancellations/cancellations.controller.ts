import {
  Controller,
  Post,
  Get,
  Body,
  Param,
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
import { CancellationsService } from './cancellations.service';
import { CancelBookingRequestDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedRequest, BaseController } from '@Common';

@ApiTags('Cancellations')
@Controller('cancellations')
export class CancellationsController extends BaseController {
  constructor(private readonly cancellationsService: CancellationsService) {
    super();
  }

  /**
   * Cancel a confirmed booking
   * Refund logic:
   * - 3+ hours before event: Partial refund (with cancellation charges)
   * - Less than 3 hours: Can cancel but NO refund
   */
  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a confirmed booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    schema: {
      example: {
        success: true,
        message:
          'Booking cancelled successfully. Refund of ₹950 will be processed within 5-7 business days.',
        cancellation: {
          id: 1,
          bookingReference: '550e8400-e29b-41d4-a716-446655440000',
          originalAmount: 1118,
          cancellationFee: 168,
          refundAmount: 950,
          refundStatus: 'PENDING',
          hoursUntilEvent: 48,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Booking cannot be cancelled (already cancelled, not confirmed, or past event)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Not logged in' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CancelBookingRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.cancellationsService.cancelBooking(ctx.user.id, dto);
  }

  /**
   * Get cancellation details for a booking
   */
  @Get(':bookingReference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cancellation details' })
  @ApiResponse({
    status: 200,
    description: 'Cancellation details retrieved',
    schema: {
      example: {
        booking: {
          bookingReference: '550e8400-e29b-41d4-a716-446655440000',
          status: 'CANCELLED',
          eventTitle: 'Tech Conference 2025',
        },
        cancellation: {
          originalAmount: 1118,
          cancellationFee: 168,
          refundAmount: 950,
          refundStatus: 'PENDING',
          cancelledAt: '2025-12-06T12:00:00Z',
          reason: 'Unable to attend',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 404,
    description: 'Booking or cancellation not found',
  })
  async getCancellationDetails(
    @Request() req: AuthenticatedRequest,
    @Param('bookingReference') bookingReference: string,
  ) {
    const ctx = this.getContext(req);
    return this.cancellationsService.getCancellationDetails(
      ctx.user.id,
      bookingReference,
    );
  }
}
