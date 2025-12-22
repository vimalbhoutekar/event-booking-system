import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UpdateProfileImageRequestDto {
  @ApiProperty({
    description:
      'Filename returned from /upload endpoint (MD5 hash with extension)',
    example: 'd5f8a9b3c2e1f4a6b7c8d9e0f1a2b3c4.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-f0-9]{32}\.(jpg|jpeg|png)$/, {
    message:
      'Invalid filename format. Must be a 32-character hash with jpg/jpeg/png extension.',
  })
  filename: string;
}
