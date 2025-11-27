import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingRequestDto {
  @ApiProperty({
    description: 'Event ID to book tickets for',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  eventId: number;

  @ApiProperty({
    description: 'Number of seats to book',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1, { message: 'Seat count must be at least 1' })
  @Type(() => Number)
  seatCount: number;
}