import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, IsNotEmpty } from 'class-validator';

// DTO for creating booking with payment
export class CreateRazorpayOrderDto {
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

  @ApiProperty({
    description: 'Idempotency key to prevent duplicate bookings',
    example: 'user123_event1_1638360000000',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  idempotencyKey?: string;
}

// DTO for verifying payment
export class VerifyPaymentDto {
  @ApiProperty({
    description: 'Razorpay Order ID',
    example: 'order_MNqR8zxPqZqKj4',
  })
  @IsString()
  @IsNotEmpty()
  razorpay_order_id: string;

  @ApiProperty({
    description: 'Razorpay Payment ID',
    example: 'pay_MNqR8zxPqZqKj4',
  })
  @IsString()
  @IsNotEmpty()
  razorpay_payment_id: string;

  @ApiProperty({
    description: 'Razorpay Signature for verification',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  })
  @IsString()
  @IsNotEmpty()
  razorpay_signature: string;
}

// DTO for webhook events
export class PaymentWebhookDto {
  @ApiProperty({
    description: 'Webhook event data from Razorpay',
  })
  event: string;

  payload: any;
}
