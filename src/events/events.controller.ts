import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import {
  CreateEventRequestDto,
  UpdateEventRequestDto,
  GetEventsRequestDto,
  GetOrganizerEventsRequestDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UserRoleGuard, UserRoles } from '../common/guards/user-role.guard';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest, BaseController } from '@Common';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Events')
@Controller('events')
export class EventsController extends BaseController {
  constructor(private readonly eventsService: EventsService) {
    super();
  }

  @Get()
  @CacheTTL(1)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'Events retrieved successfully',
    schema: {
      example: {
        data: [
          {
            id: 1,
            title: 'Tech Conference 2025',
            description: 'Amazing event',
            totalSeats: 100,
            availableSeats: 50,
            status: 'PUBLISHED',
            eventDate: '2025-12-31T18:00:00Z',
            organizerId: 5,
            organizer: {
              id: 5,
              firstname: 'John',
              lastname: 'Doe',
              email: 'john@example.com',
            },
            _count: { bookings: 50 },
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
  async getAllEvents(@Query() query: GetEventsRequestDto) {
    return this.eventsService.getAllEvents(query);
  }

  @Get(':id')
  @CacheTTL(1)
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiResponse({ status: 200, description: 'Event retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getEventById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event (Organizer only)' })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      example: {
        id: 1,
        title: 'Tech Conference 2025',
        description: 'Amazing event',
        totalSeats: 100,
        availableSeats: 100,
        status: 'DRAFT',
        eventDate: '2025-12-31T18:00:00Z',
        organizerId: 5,
        createdAt: '2025-11-26T12:00:00Z',
        updatedAt: '2025-11-26T12:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Not logged in' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only organizers can create events',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input' })
  async createEvent(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateEventRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.eventsService.createEvent(ctx.user.id, dto);
  }

  @Get('organizer/my-events')
  @CacheTTL(1)
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my events (Organizer only)' })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Organizer role required',
  })
  async getMyEvents(
    @Request() req: AuthenticatedRequest,
    @Query() query: GetOrganizerEventsRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.eventsService.getOrganizerEvents(ctx.user.id, query);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update event (Owner organizer only)' })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the event owner' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid update' })
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
    @Body() dto: UpdateEventRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.eventsService.updateEvent(id, ctx.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles(UserRole.ORGANIZER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete event (Owner organizer only)' })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    schema: {
      example: {
        message: 'Event deleted successfully',
        eventId: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Not the event owner' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Bad Request - Event has bookings' })
  async deleteEvent(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const ctx = this.getContext(req);
    return this.eventsService.deleteEvent(id, ctx.user.id);
  }
}
