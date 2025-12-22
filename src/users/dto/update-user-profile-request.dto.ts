import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsStrongPassword } from 'class-validator';
import { UpdateUserProfileBaseRequestDto } from './update-user-profile-base-request.dto';

export class UpdateUserProfileRequestDto extends UpdateUserProfileBaseRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsStrongPassword()
  password?: string;
}
