// src/admin/dto/manual-reconcile-payment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ManualReconcilePaymentDto {
  @ApiProperty({
    description: 'Booking reference to reconcile',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  bookingReference: string;

  @ApiProperty({
    description: 'Razorpay payment ID (verified from Razorpay dashboard)',
    example: 'pay_MNqR8zxPqZqKj4',
  })
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @ApiProperty({
    description:
      'Detailed reason for manual reconciliation (min 10 characters)',
    example:
      'Payment confirmed on Razorpay dashboard but webhook and cron failed. Customer contacted support with payment screenshot.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10, {
    message: 'Reason must be at least 10 characters for audit trail',
  })
  reason: string;
}
