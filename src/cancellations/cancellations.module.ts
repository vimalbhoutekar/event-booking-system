import { Module } from '@nestjs/common';
import { CancellationsService } from './cancellations.service';
import { CancellationsController } from './cancellations.controller';
import { PrismaModule } from '../prisma';
import { PaymentsModule } from '../payments';

@Module({
  imports: [
    PrismaModule,
    PaymentsModule, // For refund processing
  ],
  controllers: [CancellationsController],
  providers: [CancellationsService],
  exports: [CancellationsService], // Export for other modules if needed
})
export class CancellationsModule {}
