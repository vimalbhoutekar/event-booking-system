import { registerAs } from '@nestjs/config';

export const gstConfigFactory = registerAs('gst', () => ({
  enabled: process.env.GST_ENABLED === 'true', // Toggle for GST
  rate: parseFloat(process.env.GST_RATE || '18'), // 18% GST
  platformCommissionRate: parseFloat(
    process.env.PLATFORM_COMMISSION_RATE || '10',
  ), // 10% commission
}));

export type GstConfig = ReturnType<typeof gstConfigFactory>;
