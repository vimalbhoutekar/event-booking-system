import { registerAs } from '@nestjs/config';

export const bookingConfigFactory = registerAs('booking', () => ({
  expiryMinutes: parseInt(process.env.BOOKING_EXPIRY_MINUTES || '5', 10), // 5 min payment timeout
  cancellationHoursBeforeEvent: parseInt(
    process.env.CANCELLATION_HOURS_BEFORE_EVENT || '24',
    10,
  ), // 24 hours
  ticketStoragePath: process.env.TICKET_STORAGE_PATH || './uploads/tickets',
}));

export type BookingConfig = ReturnType<typeof bookingConfigFactory>;
