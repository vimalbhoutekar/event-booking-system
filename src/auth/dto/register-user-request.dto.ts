import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsEnum,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterUserRequestDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Strong password',
    example: 'SecurePass@123',
  })
  @IsStrongPassword()
  password: string;

  @ApiPropertyOptional({
    description: 'Country dial code',
    example: '+91',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dialCode?: string;

  @ApiPropertyOptional({
    description: 'Mobile number',
    example: '9876543210',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, {
    message:
      'The mobile number you entered is invalid, please provide a valid mobile number',
  })
  mobile?: string;

  @ApiProperty({
    description: 'User country',
    example: 'India',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Email verification code (OTP)',
    example: '123456',
  })
  @IsString()
  emailVerificationCode: string;

  @ApiPropertyOptional({
    description: 'Mobile verification code (OTP)',
    example: '654321',
  })
  @IsOptional()
  @IsString()
  mobileVerificationCode?: string;

  @ApiPropertyOptional({
    description: 'User role - USER (default) or ORGANIZER (for event creators)',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role must be either USER or ORGANIZER',
  })
  role?: UserRole;
}