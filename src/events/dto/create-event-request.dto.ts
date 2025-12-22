import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsPositive,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EventStatus, EventCategory } from '@prisma/client';

export class CreateEventRequestDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Tech Conference 2025',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'An amazing tech conference featuring industry leaders',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Total number of seats',
    example: 100,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  totalSeats: number;

  @ApiProperty({
    description: 'Base ticket price (set by organizer)',
    example: 500,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({
    description: 'Event category',
    enum: EventCategory,
    example: EventCategory.CONFERENCE,
  })
  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @ApiPropertyOptional({
    description: 'Event tags for search',
    example: ['technology', 'networking', 'innovation'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Venue name',
    example: 'Convention Center',
  })
  @IsOptional()
  @IsString()
  venue?: string;

  @ApiPropertyOptional({
    description: 'Full address',
    example: '123 Main Street, Downtown',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Mumbai',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'State',
    example: 'Maharashtra',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'India',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    description: 'Event date (ISO format)',
    example: '2025-12-31T18:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @ApiPropertyOptional({
    description: 'Start time (ISO format)',
    example: '2025-12-31T18:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({
    description: 'End time (ISO format)',
    example: '2025-12-31T22:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({
    description: 'Duration in minutes',
    example: 240,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  duration?: number;

  @ApiPropertyOptional({
    description: 'Allow cancellation',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  cancellationAllowed?: boolean;

  @ApiPropertyOptional({
    description: 'Cancellation deadline in hours before event',
    example: 24,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  cancellationDeadline?: number;

  @ApiPropertyOptional({
    description: 'Cancellation charges percentage',
    example: 15,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  cancellationCharges?: number;

  @ApiPropertyOptional({
    description: 'Event status',
    enum: EventStatus,
    example: EventStatus.DRAFT,
    default: EventStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
