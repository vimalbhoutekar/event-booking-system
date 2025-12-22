import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class BulkCancelEventDto {
  @ApiProperty({
    description: 'Reason for event cancellation (required for audit trail)',
    example:
      'Venue unavailable due to technical issues. Full refund will be processed.',
    minLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20, {
    message: 'Cancellation reason must be at least 20 characters',
  })
  reason: string;
}
