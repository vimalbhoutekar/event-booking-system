import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '@prisma/client';

export class UpdateUserStatusDto {
  @ApiProperty({
    enum: UserStatus,
    enumName: 'UserStatus',
    description: 'New status for the user',
    example: UserStatus.ACTIVE,
  })
  @IsEnum(UserStatus, {
    message: 'Status must be either ACTIVE or BLOCKED',
  })
  status: UserStatus;
}
