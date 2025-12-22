// src/health/health.controller.ts

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns system health status including database connectivity',
  })
  @ApiResponse({
    status: 200,
    description: 'System is healthy',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2025-12-09T12:00:00.000Z',
        checks: {
          database: 'up',
          system: 'up',
        },
      },
    },
  })
  async check() {
    const dbHealth = await this.checkDatabase();
    const systemHealth = await this.checkSystem();

    return {
      status: dbHealth && systemHealth ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbHealth ? 'up' : 'down',
        system: systemHealth ? 'up' : 'down',
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB',
      },
    };
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }

  private async checkSystem(): Promise<boolean> {
    try {
      const memoryUsage = process.memoryUsage().heapUsed;
      const maxMemory = 1024 * 1024 * 1024; // 1GB
      return memoryUsage < maxMemory;
    } catch {
      return false;
    }
  }
}
