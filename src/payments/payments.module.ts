import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PrismaModule } from 'src/prisma';
import { razorpayConfigFactory } from '@Config';
import { TicketsModule } from 'src/tickets';
import { CommonModule } from '@Common';

@Module({
  imports: [
    PrismaModule,
    CommonModule,
    TicketsModule,
    ConfigModule.forFeature(razorpayConfigFactory),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
