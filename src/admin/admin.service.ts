import { join } from 'node:path';
import { Cache } from 'cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Admin, AdminMeta, AdminStatus, Prisma } from '@prisma/client';
import { adminConfigFactory } from '@Config';
import {
  StorageService,
  UtilsService,
  ValidatedUser,
  UserType,
  getAccessGuardCacheKey,
} from '@Common';
import { PrismaService } from '../prisma';
import { TicketsService } from 'src/tickets';
import { BulkCancelEventDto, ManualReconcilePaymentDto } from './dto';
import { subHours, subMinutes } from 'date-fns';
import { CancellationsService } from 'src/cancellations';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @Inject(adminConfigFactory.KEY)
    private readonly config: ConfigType<typeof adminConfigFactory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly storageService: StorageService,
    private readonly ticketsService: TicketsService,
    private readonly cancellationsService: CancellationsService,
  ) {}

  private getProfileImageUrl(profileImage: string): string {
    return this.storageService.getFileUrl(
      profileImage,
      this.config.profileImagePath,
    );
  }

  private hashPassword(password: string): { salt: string; hash: string } {
    const salt = this.utilsService.generateSalt(this.config.passwordSaltLength);
    const hash = this.utilsService.hashPassword(
      password,
      salt,
      this.config.passwordHashLength,
    );
    return { salt, hash };
  }

  async isEmailExist(email: string, excludeAdminId?: number): Promise<boolean> {
    return (
      (await this.prisma.admin.count({
        where: {
          email: email.toLowerCase(),
          NOT: {
            id: excludeAdminId,
          },
        },
      })) !== 0
    );
  }

  async getById(adminId: number): Promise<Admin> {
    return await this.prisma.admin.findUniqueOrThrow({
      where: {
        id: adminId,
      },
    });
  }

  async getByEmail(email: string): Promise<Admin | null> {
    return await this.prisma.admin.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });
  }

  async getMetaById(adminId: number): Promise<AdminMeta> {
    return await this.prisma.adminMeta.findUniqueOrThrow({
      where: {
        adminId,
      },
    });
  }

  async authenticate(adminId: number, password: string): Promise<Admin> {
    const admin = await this.getById(adminId);
    const validation = await this.validateCredentials(admin.email, password);

    if (!validation === null) throw new Error('Admin not found');
    if (validation === false) throw new Error('Incorrect password');

    return admin;
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<ValidatedUser | false | null> {
    const admin = await this.getByEmail(email);
    if (!admin) return null;
    if (admin.status !== AdminStatus.ACTIVE) {
      throw new Error(
        'Your account has been temporarily suspended/blocked by the system',
      );
    }

    const adminMeta = await this.getMetaById(admin.id);
    const passwordHash = this.utilsService.hashPassword(
      password,
      adminMeta.passwordSalt || '',
      adminMeta.passwordHash
        ? adminMeta.passwordHash.length / 2
        : this.config.passwordHashLength,
    );

    if (adminMeta.passwordHash === passwordHash) {
      return {
        id: admin.id,
        type: UserType.Admin,
      };
    }

    return false;
  }

  async getProfile(adminId: number): Promise<Admin> {
    const admin = await this.getById(adminId);
    if (admin.profileImage) {
      admin.profileImage = this.getProfileImageUrl(admin.profileImage);
    }
    return admin;
  }

  async updateProfileDetails(
    adminId: number,
    data: {
      firstname?: string;
      lastname?: string;
      email?: string;
    },
    options?: { tx?: Prisma.TransactionClient },
  ): Promise<Admin> {
    const prismaClient = options?.tx ? options.tx : this.prisma;

    const admin = await prismaClient.admin.findUniqueOrThrow({
      where: { id: adminId },
    });
    if (data.email && (await this.isEmailExist(data.email, adminId))) {
      throw new Error('Email already exist');
    }

    return await prismaClient.admin.update({
      data: {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email && data.email.toLowerCase(),
      },
      where: {
        id: admin.id,
      },
    });
  }

  async updateProfileImage(
    adminId: number,
    profileImage: string,
  ): Promise<{ profileImage: string | null }> {
    const admin = await this.getById(adminId);

    return await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id: adminId },
        data: { profileImage },
      });

      // Remove previous profile image from storage
      if (admin.profileImage) {
        await this.storageService.removeFile(
          join(this.config.profileImagePath, admin.profileImage),
        );
      }
      await this.storageService.move(
        profileImage,
        this.config.profileImagePath,
      );

      return {
        profileImage: this.getProfileImageUrl(profileImage),
      };
    });
  }

  async changePassword(
    adminId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<Admin> {
    const admin = await this.getById(adminId);
    const adminMeta = await this.getMetaById(admin.id);

    const hashedPassword = this.utilsService.hashPassword(
      oldPassword,
      adminMeta.passwordSalt || '',
      adminMeta.passwordHash
        ? adminMeta.passwordHash.length / 2
        : this.config.passwordHashLength,
    );

    if (hashedPassword !== adminMeta.passwordHash)
      throw new Error('Password does not match');

    const { salt, hash } = this.hashPassword(newPassword);
    const passwordSalt = salt;
    const passwordHash = hash;

    await this.prisma.adminMeta.update({
      data: {
        passwordHash,
        passwordSalt,
      },
      where: {
        adminId,
      },
    });
    return admin;
  }

  async setStatus(userId: number, status: AdminStatus): Promise<Admin> {
    await this.cacheManager.del(
      getAccessGuardCacheKey({ id: userId, type: UserType.Admin }),
    );
    return await this.prisma.admin.update({
      data: { status },
      where: {
        id: userId,
      },
    });
  }

  /**
   * ✅ NEW: Manually reconcile payment (Admin override)
   * Last resort when all automated systems fail
   */

  async manualReconcilePayment(
    adminId: number,
    dto: ManualReconcilePaymentDto,
  ) {
    try {
      const admin = await this.getById(adminId);

      const booking = await this.prisma.booking.findUnique({
        where: { bookingReference: dto.bookingReference },
        include: { payment: true, event: true, user: true },
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      if (booking.status === 'CONFIRMED' || booking.status === 'ATTENDED') {
        throw new BadRequestException(
          'Booking already confirmed. No action needed.',
        );
      }

      // ✅ NULL CHECK - Ensures payment exists
      if (!booking.payment) {
        throw new BadRequestException(
          'No payment record found for this booking',
        );
      }

      // ✅ Now TypeScript knows payment exists, but we use ! for clarity
      if (booking.payment.status === 'COMPLETED') {
        throw new BadRequestException('Payment already completed.');
      }

      if (booking.payment.status === 'FAILED') {
        throw new BadRequestException('Cannot reconcile failed payments.');
      }

      if (!dto.razorpayPaymentId) {
        throw new BadRequestException('Razorpay payment ID is required');
      }

      if (!dto.reason || dto.reason.trim().length < 10) {
        throw new BadRequestException(
          'Detailed reason (min 10 chars) required',
        );
      }

      this.logger.warn(
        `⚠️  MANUAL RECONCILIATION initiated by admin ${admin.email} for booking ${booking.bookingReference}`,
      );

      await this.prisma.$transaction(async (tx) => {
        // ✅ Use ! operator
        await tx.payment.update({
          where: { id: booking.payment!.id },
          data: {
            razorpayPaymentId: dto.razorpayPaymentId,
            status: 'COMPLETED',
            paymentMethod: 'manual_reconciliation',
            completedAt: new Date(),
            errorDescription: `Manual reconciliation by Admin ID: ${adminId}, Email: ${admin.email}, Reason: ${dto.reason}`,
          },
        });

        await tx.booking.update({
          where: { id: booking.id },
          data: { status: 'CONFIRMED', confirmedAt: new Date() },
        });

        await tx.event.update({
          where: { id: booking.eventId },
          data: {
            totalBookings: { increment: 1 },
            totalRevenue: { increment: booking.totalAmount },
          },
        });
      });

      this.logger.log(
        `✅ Manual reconciliation successful: ${booking.bookingReference}`,
      );

      this.ticketsService.generateTicket(booking.id).catch((err) => {
        this.logger.error('Ticket generation failed:', err);
      });

      this.logger.warn(
        `AUDIT: Manual Payment Reconciliation | Booking: ${booking.bookingReference} | Admin: ${admin.email} | Razorpay Payment: ${dto.razorpayPaymentId} | Reason: ${dto.reason}`,
      );

      return {
        success: true,
        message: 'Payment reconciled and booking confirmed successfully',
        bookingReference: booking.bookingReference,
        reconciledBy: admin.email,
        timestamp: new Date().toISOString(),
        userEmail: booking.user.email,
        eventTitle: booking.event.title,
      };
    } catch (error) {
      this.logger.error('Manual reconciliation failed:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Manual reconciliation failed. Please contact tech support.',
      );
    }
  }

  /**
   * ✅ NEW: Get stuck payments for admin dashboard
   * Shows payments that may need manual intervention
   */
  async getStuckPayments() {
    try {
      const fifteenMinutesAgo = subMinutes(new Date(), 15);

      const stuckPayments = await this.prisma.payment.findMany({
        where: {
          status: 'PENDING',
          createdAt: { lt: fifteenMinutesAgo },
        },
        include: {
          booking: {
            include: {
              event: {
                select: {
                  id: true,
                  title: true,
                  eventDate: true,
                },
              },
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  email: true,
                  mobile: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to 100 most recent
      });

      return {
        total: stuckPayments.length,
        payments: stuckPayments.map((payment) => ({
          paymentId: payment.id,
          bookingReference: payment.booking.bookingReference,
          amount: Number(payment.amount),
          currency: payment.currency,
          razorpayOrderId: payment.razorpayOrderId,
          status: payment.status,
          createdAt: payment.createdAt,
          minutesStuck: Math.floor(
            (Date.now() - payment.createdAt.getTime()) / 60000,
          ),
          user: {
            name: `${payment.booking.user.firstname} ${payment.booking.user.lastname}`,
            email: payment.booking.user.email,
            mobile: payment.booking.user.mobile,
          },
          event: {
            title: payment.booking.event.title,
            date: payment.booking.event.eventDate,
          },
        })),
      };
    } catch (error) {
      this.logger.error('Error fetching stuck payments:', error);
      throw new BadRequestException('Failed to fetch stuck payments');
    }
  }

  /**
   * 🆕 Bulk cancel event and process refunds
   */
  async bulkCancelEvent(
    adminId: number,
    eventId: number,
    dto: BulkCancelEventDto,
  ) {
    const startTime = Date.now();

    try {
      const admin = await this.getById(adminId);

      // Get event details
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        include: {
          _count: { select: { bookings: true } },
        },
      });

      if (!event) {
        throw new BadRequestException('Event not found');
      }

      // Get all confirmed bookings
      const bookings = await this.prisma.booking.findMany({
        where: {
          eventId,
          status: 'CONFIRMED',
          isDeleted: false,
        },
        include: {
          payment: true,
          user: true,
        },
      });

      this.logger.warn(
        `⚠️  BULK CANCELLATION initiated by admin ${admin.email} for event: ${event.title} (${bookings.length} bookings)`,
      );

      const results = {
        eventId,
        eventTitle: event.title,
        totalBookings: bookings.length,
        refunded: 0,
        failed: 0,
        totalRefundAmount: 0,
        processedBy: admin.email,
        errors: [] as any[],
        processingTimeMs: 0,
      };

      // Cancel event first
      await this.prisma.event.update({
        where: { id: eventId },
        data: { status: 'CANCELLED' },
      });

      // Process refunds in batches (Razorpay rate limit: 600/min)
      const BATCH_SIZE = 100;
      const RATE_LIMIT_DELAY = 10000; // 10 seconds between batches

      for (let i = 0; i < bookings.length; i += BATCH_SIZE) {
        const batch = bookings.slice(i, i + BATCH_SIZE);

        this.logger.log(
          `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(bookings.length / BATCH_SIZE)}...`,
        );

        // Process batch concurrently (but respect rate limits)
        const batchResults = await Promise.allSettled(
          batch.map((booking) =>
            this.cancellationsService.cancelBooking(booking.userId, {
              bookingReference: booking.bookingReference,
              reason: dto.reason,
            }),
          ),
        );

        // Collect results
        batchResults.forEach((result, idx) => {
          const booking = batch[idx];

          if (result.status === 'fulfilled') {
            results.refunded++;
            results.totalRefundAmount += Number(booking.totalAmount);
          } else {
            results.failed++;
            results.errors.push({
              bookingId: booking.id,
              bookingReference: booking.bookingReference,
              userEmail: booking.user.email,
              error: result.reason?.message || 'Unknown error',
            });
          }
        });

        // Rate limit safety - wait between batches
        if (i + BATCH_SIZE < bookings.length) {
          this.logger.debug(`Waiting ${RATE_LIMIT_DELAY}ms for rate limit...`);
          await this.sleep(RATE_LIMIT_DELAY);
        }
      }

      results.processingTimeMs = Date.now() - startTime;

      this.logger.warn(
        `✅ Bulk cancellation completed: ${results.refunded} refunded, ${results.failed} failed, ${results.processingTimeMs}ms`,
      );

      // Audit log
      this.logger.warn(
        `AUDIT: Bulk Event Cancellation | Event: ${event.title} | Admin: ${admin.email} | Refunded: ${results.refunded}/${results.totalBookings} | Total: ₹${results.totalRefundAmount}`,
      );

      return results;
    } catch (error) {
      this.logger.error('Bulk cancellation failed:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Bulk cancellation failed. Please contact tech support.',
      );
    }
  }

  /**
   * 🆕 Get reconciliation dashboard metrics
   */
  async getReconciliationDashboard() {
    try {
      const now = new Date();
      const fifteenMinAgo = subMinutes(now, 15);
      const oneHourAgo = subHours(now, 1);
      const oneDayAgo = subHours(now, 24);

      // Parallel queries for performance
      const [
        stuckPayments15min,
        stuckPayments1hour,
        stuckPayments24hour,
        todayBookings,
        todayRevenue,
        pendingBookings,
      ] = await Promise.all([
        // Stuck payments (critical - needs immediate attention)
        this.prisma.payment.count({
          where: {
            status: 'PENDING',
            createdAt: { lt: fifteenMinAgo },
          },
        }),

        // Stuck payments (1 hour)
        this.prisma.payment.count({
          where: {
            status: 'PENDING',
            createdAt: { lt: oneHourAgo },
          },
        }),

        // Stuck payments (24 hours - serious issue)
        this.prisma.payment.count({
          where: {
            status: 'PENDING',
            createdAt: { lt: oneDayAgo },
          },
        }),

        // Today's bookings
        this.prisma.booking.count({
          where: {
            createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
            status: 'CONFIRMED',
          },
        }),

        // Today's revenue
        this.prisma.booking.aggregate({
          where: {
            createdAt: { gte: new Date(now.setHours(0, 0, 0, 0)) },
            status: 'CONFIRMED',
          },
          _sum: { totalAmount: true },
        }),

        // Currently pending bookings (waiting for payment)
        this.prisma.booking.count({
          where: {
            status: 'PENDING',
            expiresAt: { gt: now },
          },
        }),
      ]);

      // Health status determination
      let healthStatus: 'healthy' | 'warning' | 'critical';

      if (stuckPayments24hour > 100) {
        healthStatus = 'critical';
      } else if (stuckPayments1hour > 50) {
        healthStatus = 'warning';
      } else {
        healthStatus = 'healthy';
      }

      return {
        timestamp: now.toISOString(),
        health: healthStatus,
        stuckPayments: {
          last15min: stuckPayments15min,
          last1hour: stuckPayments1hour,
          last24hours: stuckPayments24hour,
          severity:
            stuckPayments24hour > 100
              ? 'critical'
              : stuckPayments1hour > 50
                ? 'warning'
                : 'normal',
        },
        todayMetrics: {
          confirmedBookings: todayBookings,
          totalRevenue: Number(todayRevenue._sum.totalAmount || 0),
          averageTicketValue:
            todayBookings > 0
              ? Number(todayRevenue._sum.totalAmount || 0) / todayBookings
              : 0,
        },
        currentMetrics: {
          pendingBookings,
          nextCronRun: this.getNextCronRunTime(),
        },
        alerts: this.generateAlerts(
          stuckPayments15min,
          stuckPayments1hour,
          stuckPayments24hour,
        ),
      };
    } catch (error) {
      this.logger.error('Error fetching reconciliation dashboard:', error);
      throw new BadRequestException('Failed to fetch dashboard metrics');
    }
  }

  /**
   * Helper: Generate alerts based on stuck payments
   */
  private generateAlerts(
    count15min: number,
    count1hour: number,
    count24hour: number,
  ) {
    const alerts = [];

    if (count24hour > 100) {
      alerts.push({
        level: 'critical',
        message: `${count24hour} payments stuck for >24 hours. Immediate action required!`,
        action: 'Run manual reconciliation or check Razorpay status',
      });
    }

    if (count1hour > 50) {
      alerts.push({
        level: 'warning',
        message: `${count1hour} payments stuck for >1 hour`,
        action: 'Monitor situation. May need manual intervention.',
      });
    }

    if (count15min > 20) {
      alerts.push({
        level: 'info',
        message: `${count15min} payments stuck for >15 minutes`,
        action: 'Normal. Cron job will reconcile automatically.',
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        level: 'success',
        message: 'All systems operational',
        action: 'No action needed',
      });
    }

    return alerts;
  }

  /**
   * Helper: Calculate next cron run time
   */
  private getNextCronRunTime(): string {
    const now = new Date();
    const minutes = now.getMinutes();
    const nextRun = new Date(now);

    // Cron runs every 5 minutes (0, 5, 10, 15, ...)
    const nextMinute = Math.ceil((minutes + 1) / 5) * 5;
    nextRun.setMinutes(nextMinute, 0, 0);

    return nextRun.toISOString();
  }

  /**
   * Helper: Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
