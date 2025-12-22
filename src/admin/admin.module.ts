import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma';
import { TicketsModule } from 'src/tickets';
import { CommonModule } from '@Common';
import { ConfigModule } from '@nestjs/config';
import { adminConfigFactory } from '@Config';
import { CancellationsModule } from 'src/cancellations';

@Module({
  imports: [
    PrismaModule,
    TicketsModule,
    CommonModule,
    CancellationsModule,
    ConfigModule.forFeature(adminConfigFactory),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
