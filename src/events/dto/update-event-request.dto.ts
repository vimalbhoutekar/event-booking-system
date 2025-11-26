
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  MaxLength,
} from 'class-validator';
import { EventStatus } from '@prisma/client';

export class UpdateEventRequestDto {
  @ApiPropertyOptional({
    description: 'Event title',
    example: 'Tech Conference 2025 - Updated',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Updated description with more details',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Total number of seats (can only increase, not decrease below booked)',
    example: 150,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  totalSeats?: number;

  @ApiPropertyOptional({
    description: 'Event status',
    enum: EventStatus,
    example: EventStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({
    description: 'Event date and time (ISO 8601 format)',
    example: '2025-12-31T18:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  eventDate?: string;
}