// ============================================
// src/bookings/bookings.service.ts
// ============================================

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { BookingStatus, EventStatus } from '@prisma/client';
import { CreateBookingRequestDto, GetBookingsRequestDto } from './dto';

@Injectable()
export class BookingsService {
  // Maximum retry attempts for optimistic locking
  private readonly MAX_RETRIES = 3;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a booking with optimistic locking and retry logic
   * This prevents race conditions when multiple users book simultaneously
   */
  async createBooking(userId: number, dto: CreateBookingRequestDto) {
    const { eventId, seatCount } = dto;

    // Validate seat count
    if (seatCount < 1) {
      throw new BadRequestException('Seat count must be at least 1');
    }

    // Retry logic for handling concurrent bookings
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        // Attempt booking with optimistic locking
        const booking = await this.attemptBooking(userId, eventId, seatCount);
        return {
          success: true,
          message: 'Booking confirmed successfully',
          data: booking,
        };
      } catch (error) {
        // If this is a concurrency conflict, retry
        if (
          error.code === 'P2034' || // Prisma optimistic locking error
          error.message?.includes('version') ||
          error.message?.includes('conflict')
        ) {
          if (attempt < this.MAX_RETRIES) {
            // Wait a bit before retrying (exponential backoff)
            await this.sleep(attempt * 50); // 50ms, 100ms, 150ms
            continue; // Retry
          } else {
            // Max retries exceeded
            throw new ConflictException(
              'Booking failed due to high demand. Please try again.',
            );
          }
        }

        // For other errors, throw immediately
        throw error;
      }
    }
  }

  /**
   * Attempt to create a booking using optimistic locking
   * Uses database-level version checking to prevent race conditions
   */
  private async attemptBooking(
    userId: number,
    eventId: number,
    seatCount: number,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Fetch event with current version (FOR UPDATE to lock row)
      const event = await tx.event.findUnique({
        where: { id: eventId },
        select: {
          id: true,
          title: true,
          availableSeats: true,
          totalSeats: true,
          status: true,
          version: true, // ← Optimistic locking field
          eventDate: true,
          organizerId: true,
        },
      });

      // Step 2: Validate event exists
      if (!event) {
        throw new NotFoundException(`Event with ID ${eventId} not found`);
      }

      // Step 3: Validate event status
      if (event.status !== EventStatus.PUBLISHED) {
        throw new BadRequestException(
          `Event is not available for booking. Current status: ${event.status}`,
        );
      }

      // Step 4: Check if event date has passed
      if (event.eventDate && new Date(event.eventDate) < new Date()) {
        throw new BadRequestException('Cannot book past events');
      }

      // Step 5: Check seat availability
      if (event.availableSeats < seatCount) {
        throw new ConflictException(
          `Not enough seats available. Requested: ${seatCount}, Available: ${event.availableSeats}`,
        );
      }

      // Step 6: Update event seats with version check (OPTIMISTIC LOCKING!)
      const updatedEvent = await tx.event.updateMany({
        where: {
          id: eventId,
          version: event.version, // ← Check version hasn't changed
        },
        data: {
          availableSeats: event.availableSeats - seatCount,
          version: event.version + 1, // ← Increment version
        },
      });

      // Step 7: Check if update succeeded (version matched)
      if (updatedEvent.count === 0) {
        // Version mismatch - someone else modified the event
        throw new ConflictException(
          'Booking conflict detected. Please try again.',
        );
      }

      // Step 8: Create booking record
      const booking = await tx.booking.create({
        data: {
          userId,
          eventId,
          seatCount,
          status: BookingStatus.CONFIRMED,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              organizerId: true,
            },
          },
        },
      });

      return booking;
    });
  }

  /**
   * Get all bookings for a user
   */
  async getUserBookings(userId: number, query: GetBookingsRequestDto) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              eventDate: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single booking by reference
   */
  async getBookingByReference(bookingReference: string, userId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            eventDate: true,
            status: true,
            organizerId: true,
          },
        },
        user: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Users can only view their own bookings
    // Organizers can view bookings for their events
    if (
      booking.userId !== userId &&
      booking.event.organizerId !== userId
    ) {
      throw new ForbiddenException(
        'You do not have permission to view this booking',
      );
    }

    return booking;
  }

  /**
   * Cancel a booking - releases seats back to event
   */
  async cancelBooking(bookingReference: string, userId: number) {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Find booking
      const booking = await tx.booking.findUnique({
        where: { bookingReference },
        include: {
          event: true,
        },
      });

      if (!booking) {
        throw new NotFoundException('Booking not found');
      }

      // Step 2: Check ownership
      if (booking.userId !== userId) {
        throw new ForbiddenException(
          'You can only cancel your own bookings',
        );
      }

      // Step 3: Check if already cancelled
      if (booking.status === BookingStatus.CANCELLED) {
        throw new BadRequestException('Booking is already cancelled');
      }

      // Step 4: Check if event has passed
      if (
        booking.event.eventDate &&
        new Date(booking.event.eventDate) < new Date()
      ) {
        throw new BadRequestException('Cannot cancel booking for past events');
      }

      // Step 5: Release seats back (with optimistic locking)
      const updatedEvent = await tx.event.updateMany({
        where: {
          id: booking.eventId,
          version: booking.event.version,
        },
        data: {
          availableSeats: booking.event.availableSeats + booking.seatCount,
          version: booking.event.version + 1,
        },
      });

      if (updatedEvent.count === 0) {
        throw new ConflictException(
          'Cancellation conflict. Please try again.',
        );
      }

      // Step 6: Update booking status
      const cancelledBooking = await tx.booking.update({
        where: { bookingReference },
        data: {
          status: BookingStatus.CANCELLED,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Booking cancelled successfully. Seats have been released.',
        data: cancelledBooking,
      };
    });
  }

  /**
   * Helper function to sleep/delay
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}