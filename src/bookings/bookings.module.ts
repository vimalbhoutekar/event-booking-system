import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from 'src/prisma';
import { PaymentsModule } from 'src/payments';
import { bookingConfigFactory, gstConfigFactory } from '@Config';
import { TicketsModule } from 'src/tickets';

@Module({
  imports: [
    PrismaModule,
    PaymentsModule, // Import PaymentsModule to use PaymentsService
    TicketsModule,
    ConfigModule.forFeature(gstConfigFactory),
    ConfigModule.forFeature(bookingConfigFactory),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService], // Export for other modules
})
export class BookingsModule {}
