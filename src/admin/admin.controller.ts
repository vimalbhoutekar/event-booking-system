// src/admin/admin.controller.ts

import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  AccessGuard,
  AuthenticatedRequest,
  BaseController,
  JwtAuthGuard,
  Roles,
  RolesGuard,
  UserType,
} from '@Common';
import { AdminService } from './admin.service';
import {
  AuthenticateRequestDto,
  ChangePasswordRequestDto,
  UpdateAdminProfileRequestDto,
  UpdateProfileImageRequestDto,
  ManualReconcilePaymentDto,
  BulkCancelEventDto, // ✅ NEW
} from './dto';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles(UserType.Admin)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('admin')
export class AdminController extends BaseController {
  constructor(private readonly adminService: AdminService) {
    super();
  }

  @Get()
  async getProfile(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return await this.adminService.getProfile(ctx.user.id);
  }

  @Patch()
  async updateProfileDetails(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateAdminProfileRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.updateProfileDetails(ctx.user.id, {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
    });
    return { status: 'success' };
  }

  @Post('profile-image')
  updateProfileImage(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileImageRequestDto,
  ) {
    const ctx = this.getContext(req);
    return this.adminService.updateProfileImage(ctx.user.id, data.profileImage);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() data: ChangePasswordRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.changePassword(
      ctx.user.id,
      data.oldPassword,
      data.newPassword,
    );
    return { status: 'success' };
  }

  @Post('authenticate')
  async authenticate(
    @Req() req: AuthenticatedRequest,
    @Body() data: AuthenticateRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.adminService.authenticate(ctx.user.id, data.password);
    return { status: 'success' };
  }

  /**
   * ✅ NEW: Manual payment reconciliation endpoint
   * For support team to manually confirm payments when all automated systems fail
   */
  @Post('reconcile-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Manually reconcile stuck payment (Support tool)',
    description:
      'Admin-only endpoint to manually confirm payments that failed automated reconciliation',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment manually reconciled successfully',
    schema: {
      example: {
        success: true,
        message: 'Payment reconciled and booking confirmed',
        bookingReference: '550e8400-e29b-41d4-a716-446655440000',
        reconciledBy: 'admin@example.com',
        timestamp: '2025-12-09T10:30:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid booking or payment already processed',
  })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async manualReconcilePayment(
    @Req() req: AuthenticatedRequest,
    @Body() dto: ManualReconcilePaymentDto,
  ) {
    const ctx = this.getContext(req);
    return await this.adminService.manualReconcilePayment(ctx.user.id, dto);
  }

  /**
   * 🆕 Bulk cancel event and process refunds
   * Critical for emergency event cancellations
   */
  @Post('events/:eventId/bulk-cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Bulk cancel event and refund all bookings (Emergency use)',
    description:
      'Cancels event and processes refunds for all confirmed bookings',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk cancellation processed',
    schema: {
      example: {
        eventId: 1,
        eventTitle: 'Tech Conference Mumbai',
        totalBookings: 150,
        refunded: 147,
        failed: 3,
        totalRefundAmount: 165000,
        processedBy: 'admin@example.com',
        errors: [{ bookingId: 45, error: 'Payment not found' }],
      },
    },
  })
  async bulkCancelEvent(
    @Req() req: AuthenticatedRequest,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: BulkCancelEventDto,
  ) {
    const ctx = this.getContext(req);
    return await this.adminService.bulkCancelEvent(ctx.user.id, eventId, dto);
  }

  /**
   * 🆕 Get real-time reconciliation dashboard
   * Shows system health metrics
   */
  @Get('dashboard/reconciliation')
  @ApiOperation({
    summary: 'Get payment reconciliation dashboard',
    description: 'Real-time metrics for stuck payments and system health',
  })
  async getReconciliationDashboard() {
    return await this.adminService.getReconciliationDashboard();
  }

  /**
   * ✅ NEW: Get stuck payments dashboard
   * Shows payments that need manual intervention
   */
  @Get('stuck-payments')
  @ApiOperation({
    summary: 'Get list of stuck payments needing manual review',
  })
  @ApiResponse({
    status: 200,
    description: 'List of stuck payments',
  })
  async getStuckPayments(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return await this.adminService.getStuckPayments();
  }
}
