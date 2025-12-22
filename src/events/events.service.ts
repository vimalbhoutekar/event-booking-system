import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma';
import { gstConfigFactory } from '../configs';
import { GSTUtil } from '../common/utils';
import {
  CreateEventRequestDto,
  UpdateEventRequestDto,
  GetEventsRequestDto,
  GetOrganizerEventsRequestDto,
} from './dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(gstConfigFactory.KEY)
    private readonly gstConfig: ConfigType<typeof gstConfigFactory>,
  ) {}

  /**
   * Create new event
   * Automatically calculates platform fee and final price with GST
   */
  async createEvent(organizerId: number, dto: CreateEventRequestDto) {
    // Calculate pricing with GST
    const pricing = GSTUtil.calculatePricing(
      dto.basePrice,
      this.gstConfig.platformCommissionRate,
      this.gstConfig.rate,
      this.gstConfig.enabled,
    );

    const event = await this.prisma.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        totalSeats: dto.totalSeats,
        availableSeats: dto.totalSeats, // Initially all seats available
        basePrice: pricing.basePrice,
        platformFee: pricing.platformFee,
        finalPrice: pricing.finalPrice,
        currency: 'INR',
        category: dto.category,
        tags: dto.tags,
        venue: dto.venue,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        eventDate: dto.eventDate ? new Date(dto.eventDate) : null,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        duration: dto.duration,
        cancellationAllowed: dto.cancellationAllowed ?? true,
        cancellationDeadline: dto.cancellationDeadline,
        cancellationCharges: dto.cancellationCharges,
        status: dto.status || 'DRAFT',
        organizerId,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        organizer: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Event created: ${event.id} - ${event.title}`);

    return this.formatEventResponse(event);
  }

  /**
   * Update event
   * Recalculates pricing if basePrice changes
   */
  async updateEvent(
    eventId: number,
    organizerId: number,
    dto: UpdateEventRequestDto,
  ) {
    // Check if event exists and belongs to organizer
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: eventId, isDeleted: false },
    });

    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }

    if (existingEvent.organizerId !== organizerId) {
      throw new ForbiddenException('You can only update your own events');
    }

    // Check if event has bookings (restrict some updates)
    const bookingCount = await this.prisma.booking.count({
      where: { eventId, status: 'CONFIRMED' },
    });

    if (bookingCount > 0 && dto.basePrice !== undefined) {
      throw new BadRequestException(
        'Cannot change price after confirmed bookings exist',
      );
    }

    // Recalculate pricing if basePrice is being updated
    let pricingUpdate = {};
    if (dto.basePrice !== undefined) {
      const pricing = GSTUtil.calculatePricing(
        dto.basePrice,
        this.gstConfig.platformCommissionRate,
        this.gstConfig.rate,
        this.gstConfig.enabled,
      );

      pricingUpdate = {
        basePrice: pricing.basePrice,
        platformFee: pricing.platformFee,
        finalPrice: pricing.finalPrice,
      };
    }

    // Prepare update data
    const updateData: Prisma.EventUpdateInput = {
      ...pricingUpdate,
      ...(dto.title && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.category && { category: dto.category }),
      ...(dto.tags && { tags: dto.tags }),
      ...(dto.venue !== undefined && { venue: dto.venue }),
      ...(dto.address !== undefined && { address: dto.address }),
      ...(dto.city !== undefined && { city: dto.city }),
      ...(dto.state !== undefined && { state: dto.state }),
      ...(dto.country !== undefined && { country: dto.country }),
      ...(dto.eventDate && { eventDate: new Date(dto.eventDate) }),
      ...(dto.startTime && { startTime: new Date(dto.startTime) }),
      ...(dto.endTime && { endTime: new Date(dto.endTime) }),
      ...(dto.duration !== undefined && { duration: dto.duration }),
      ...(dto.cancellationAllowed !== undefined && {
        cancellationAllowed: dto.cancellationAllowed,
      }),
      ...(dto.cancellationDeadline !== undefined && {
        cancellationDeadline: dto.cancellationDeadline,
      }),
      ...(dto.cancellationCharges !== undefined && {
        cancellationCharges: dto.cancellationCharges,
      }),
      ...(dto.status && { status: dto.status }),
      ...(dto.status === 'PUBLISHED' &&
        !existingEvent.publishedAt && { publishedAt: new Date() }),
    };

    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        organizer: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(`Event updated: ${eventId}`);

    return this.formatEventResponse(updatedEvent);
  }

  /**
   * Get all published events (public)
   */
  async getAllEvents(query: GetEventsRequestDto) {
    const { page = 1, limit = 10, status, organizerId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      isDeleted: false,
      ...(status && { status }),
      ...(organizerId && { organizerId }),
    };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          organizer: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events.map((e) => this.formatEventResponse(e)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get single event by ID
   */
  async getEventById(eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId, isDeleted: false },
      include: {
        organizer: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
            businessName: true,
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.formatEventResponse(event);
  }

  /**
   * Get organizer's events
   */
  async getOrganizerEvents(
    organizerId: number,
    query: GetOrganizerEventsRequestDto,
  ) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {
      organizerId,
      isDeleted: false,
      ...(status && { status }),
    };

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          _count: {
            select: { bookings: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events.map((e) => this.formatEventResponse(e)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Delete event (soft delete)
   */
  async deleteEvent(eventId: number, organizerId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId, isDeleted: false },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    // Check for confirmed bookings
    const confirmedBookings = await this.prisma.booking.count({
      where: {
        eventId,
        status: 'CONFIRMED',
      },
    });

    if (confirmedBookings > 0) {
      throw new BadRequestException(
        'Cannot delete event with confirmed bookings',
      );
    }

    // Soft delete
    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: organizerId,
      },
    });

    this.logger.log(`Event deleted: ${eventId}`);

    return {
      message: 'Event deleted successfully',
      eventId,
    };
  }

  /**
   * Format event response for API
   */
  private formatEventResponse(event: any) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      totalSeats: event.totalSeats,
      availableSeats: event.availableSeats,
      basePrice: Number(event.basePrice),
      platformFee: Number(event.platformFee),
      finalPrice: Number(event.finalPrice),
      currency: event.currency,
      category: event.category,
      tags: event.tags,
      venue: event.venue,
      address: event.address,
      city: event.city,
      state: event.state,
      country: event.country,
      eventDate: event.eventDate,
      startTime: event.startTime,
      endTime: event.endTime,
      duration: event.duration,
      cancellationAllowed: event.cancellationAllowed,
      cancellationDeadline: event.cancellationDeadline,
      cancellationCharges: Number(event.cancellationCharges || 0),
      status: event.status,
      totalBookings: event.totalBookings,
      totalRevenue: Number(event.totalRevenue),
      organizer: event.organizer,
      bookingCount: event._count?.bookings,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      publishedAt: event.publishedAt,
    };
  }
}
