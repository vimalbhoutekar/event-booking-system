import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TicketsService } from './tickets.service';
import { PrismaModule } from '../prisma';
import { bookingConfigFactory } from '../configs';

@Module({
  imports: [PrismaModule, ConfigModule.forFeature(bookingConfigFactory)],
  providers: [TicketsService],
  exports: [TicketsService], // Export so BookingsService can use it
})
export class TicketsModule {}
