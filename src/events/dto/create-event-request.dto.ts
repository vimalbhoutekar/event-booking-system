import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateEventRequestDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Tech Conference 2025',
    maxLength: 200,
  })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({
    description: 'Event description',
    example: 'Annual technology conference featuring industry leaders',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Total number of seats available',
    example: 100,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  totalSeats: number;

  @ApiPropertyOptional({
    description: 'Event status (defaults to DRAFT)',
    enum: EventStatus,
    example: EventStatus.DRAFT,
    default: EventStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({
    description: 'Event date and time',
    example: '2025-12-31T18:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  eventDate?: string;
}