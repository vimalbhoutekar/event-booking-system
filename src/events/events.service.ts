import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { EventStatus } from '@prisma/client';
import {
  CreateEventRequestDto,
  UpdateEventRequestDto,
  GetEventsRequestDto,
  GetOrganizerEventsRequestDto,
} from './dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents(query: GetEventsRequestDto) {
    const { page = 1, limit = 10, status, organizerId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (organizerId) {
      where.organizerId = organizerId;
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
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
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async getOrganizerEvents(organizerId: number, query: GetOrganizerEventsRequestDto) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = { organizerId };

    if (status) {
      where.status = status;
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { bookings: true },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createEvent(organizerId: number, dto: CreateEventRequestDto) {
    const { title, description, totalSeats, status, eventDate } = dto;

    if (totalSeats < 1) {
      throw new BadRequestException('Total seats must be at least 1');
    }

    const event = await this.prisma.event.create({
      data: {
        title,
        description,
        totalSeats,
        availableSeats: totalSeats,
        status: status || EventStatus.DRAFT,
        eventDate: eventDate ? new Date(eventDate) : null,
        organizerId,
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

    return event;
  }

  async updateEvent(
    eventId: number,
    organizerId: number,
    dto: UpdateEventRequestDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only update your own events');
    }

    const updateData: any = {};

    if (dto.title) {
      updateData.title = dto.title;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description;
    }

    if (dto.status) {
      updateData.status = dto.status;
    }

    if (dto.eventDate) {
      updateData.eventDate = new Date(dto.eventDate);
    }

    if (dto.totalSeats !== undefined) {
      const bookedSeats = event.totalSeats - event.availableSeats;

      if (dto.totalSeats < bookedSeats) {
        throw new BadRequestException(
          `Cannot reduce total seats below ${bookedSeats} (already booked seats)`,
        );
      }

      const newAvailableSeats = dto.totalSeats - bookedSeats;

      updateData.totalSeats = dto.totalSeats;
      updateData.availableSeats = newAvailableSeats;
    }

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

    return updatedEvent;
  }

  async deleteEvent(eventId: number, organizerId: number) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    if (event.organizerId !== organizerId) {
      throw new ForbiddenException('You can only delete your own events');
    }

    if (event._count.bookings > 0) {
      throw new BadRequestException(
        'Cannot delete event with existing bookings. Cancel all bookings first or mark event as cancelled.',
      );
    }
    await this.prisma.event.delete({
      where: { id: eventId },
    });

    return {
      message: 'Event deleted successfully',
      eventId,
    };
  }
}
