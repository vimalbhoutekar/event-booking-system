import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PrismaModule } from '../prisma';
import { PaymentsModule } from 'src/payments';
import { TicketsModule } from 'src/tickets';

@Module({
  imports: [PrismaModule, PaymentsModule, TicketsModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
