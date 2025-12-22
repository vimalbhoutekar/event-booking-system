import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma';
import { OtpModule } from '../otp';
import { CommonModule, StorageService } from '@Common';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    OtpModule,
    CommonModule,
    MulterModule.registerAsync({
      imports: [CommonModule],
      useFactory: (storageService: StorageService) => ({
        ...storageService.defaultMulterOptions,
      }),
      inject: [StorageService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
