import { registerAs } from '@nestjs/config';

export const smsConfigFactory = registerAs('sms', () => ({
  fast2sms: {
    apiKey: process.env.FAST2SMS_API_KEY,
    senderId: process.env.FAST2SMS_SENDER_ID || 'FSTSMS',
    apiUrl: 'https://www.fast2sms.com/dev/bulkV2',
  },
}));
