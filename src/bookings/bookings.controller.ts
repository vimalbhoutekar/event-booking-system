// ============================================
// src/bookings/bookings.controller.ts
// ============================================

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingRequestDto, GetBookingsRequestDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRoleGuard, UserRoles } from '../common/guards/user-role.guard';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest, BaseController } from '@Common';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController extends BaseController {
  constructor(private readonly bookingsService: BookingsService) {
    super();
  }

  /**
   * POST /bookings - Create a new booking
   * Protected: USER and ORGANIZER roles can book
   */
  @Post()
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.USER, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Book seats for an event',
    description:
      'Creates a booking with optimistic locking to prevent double booking. Includes automatic retry logic for concurrent requests.',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    schema: {
      example: {
        success: true,
        message: 'Booking confirmed successfully',
        data: {
          id: 1,
          userId: 5,
          eventId: 10,
          seatCount: 2,
          status: 'CONFIRMED',
          bookingReference: '7f3a8b2c-4d1e-9a0f-6c5b-8e7d9f0a1b2c',
          createdAt: '2025-11-26T12:00:00Z',
          event: {
            id: 10,
            title: 'Tech Conference 2025',
            eventDate: '2025-12-31T18:00:00Z',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input or event not bookable',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Event does not exist',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Not enough seats or booking conflict',
  })
  async createBooking(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateBookingRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.createBooking(ctx.user.id, dto);
  }

  /**
   * GET /bookings - Get user's bookings
   * Protected: Users can view their own bookings
   */
  @Get()
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.USER, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my bookings',
    description: 'Retrieve all bookings for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            userId: 5,
            eventId: 10,
            seatCount: 2,
            status: 'CONFIRMED',
            bookingReference: '7f3a8b2c-4d1e-9a0f-6c5b-8e7d9f0a1b2c',
            createdAt: '2025-11-26T12:00:00Z',
            event: {
              id: 10,
              title: 'Tech Conference 2025',
              eventDate: '2025-12-31T18:00:00Z',
              status: 'PUBLISHED',
            },
          },
        ],
        meta: {
          total: 1,
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
   * GET /bookings/:bookingReference - Get single booking by reference
   * Protected: Users can view their own bookings, organizers can view bookings for their events
   */
  @Get(':bookingReference')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.USER, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get booking by reference',
    description: 'Retrieve booking details using booking reference ID',
  })
  @ApiParam({
    name: 'bookingReference',
    description: 'Booking reference UUID',
    example: '7f3a8b2c-4d1e-9a0f-6c5b-8e7d9f0a1b2c',
  })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingByReference(
    @Param('bookingReference') bookingReference: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.getBookingByReference(
      bookingReference,
      ctx.user.id,
    );
  }

  /**
   * DELETE /bookings/:bookingReference - Cancel a booking
   * Protected: Users can cancel their own bookings only
   */
  @Delete(':bookingReference')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.USER, UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cancel a booking',
    description:
      'Cancel a booking and release seats back to the event. Uses optimistic locking to ensure data consistency.',
  })
  @ApiParam({
    name: 'bookingReference',
    description: 'Booking reference UUID',
    example: '7f3a8b2c-4d1e-9a0f-6c5b-8e7d9f0a1b2c',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    schema: {
      example: {
        success: true,
        message: 'Booking cancelled successfully. Seats have been released.',
        data: {
          id: 1,
          userId: 5,
          eventId: 10,
          seatCount: 2,
          status: 'CANCELLED',
          bookingReference: '7f3a8b2c-4d1e-9a0f-6c5b-8e7d9f0a1b2c',
          event: {
            id: 10,
            title: 'Tech Conference 2025',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Already cancelled or past event' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not your booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  @ApiResponse({ status: 409, description: 'Conflict - Cancellation conflict, retry' })
  async cancelBooking(
    @Param('bookingReference') bookingReference: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const ctx = this.getContext(req);
    return this.bookingsService.cancelBooking(bookingReference, ctx.user.id);
  }
}