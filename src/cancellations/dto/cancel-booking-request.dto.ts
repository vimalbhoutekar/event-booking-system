import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CancelBookingRequestDto {
  @ApiProperty({
    description: 'Booking reference to cancel',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  bookingReference: string;

  @ApiPropertyOptional({
    description: 'Reason for cancellation',
    example: 'Unable to attend due to personal reasons',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
