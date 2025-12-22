import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateBookingRequestDto {
  @ApiProperty({
    description: 'Event ID to book',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  eventId: number;

  @ApiProperty({
    description: 'Number of seats to book',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  seatCount: number;

  @ApiPropertyOptional({
    description: 'Idempotency key to prevent duplicate bookings',
    example: 'user123_event1_1638360000000',
  })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;

  @ApiPropertyOptional({
    description: 'Attendee name (if different from user)',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  attendeeName?: string;

  @ApiPropertyOptional({
    description: 'Attendee email (if different from user)',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail()
  attendeeEmail?: string;

  @ApiPropertyOptional({
    description: 'Attendee phone (if different from user)',
    example: '+919876543210',
  })
  @IsOptional()
  @IsString()
  attendeePhone?: string;
}

// DTO for verifying payment and confirming booking
export class VerifyBookingPaymentDto {
  @ApiProperty({
    description: 'Booking reference to verify',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  bookingReference: string;

  @ApiProperty({
    description: 'Razorpay Order ID',
    example: 'order_MNqR8zxPqZqKj4',
  })
  @IsString()
  razorpay_order_id: string;

  @ApiProperty({
    description: 'Razorpay Payment ID',
    example: 'pay_MNqR8zxPqZqKj4',
  })
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({
    description: 'Razorpay Signature for verification',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  })
  @IsString()
  razorpay_signature: string;
}
