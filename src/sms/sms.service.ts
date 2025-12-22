import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { smsConfigFactory } from '@Config';

export interface Fast2SMSResponse {
  return: boolean;
  request_id: string;
  message: string[];
}

@Injectable()
export class SmsService {
  constructor(
    @Inject(smsConfigFactory.KEY)
    private readonly config: ConfigType<typeof smsConfigFactory>,
  ) {}

  async send(mobile: string, text: string): Promise<void> {
    try {
      // Remove country code if present (+91)
      const cleanMobile = mobile.replace(/^\+91/, '').replace(/\s/g, '');

      // Validate Indian mobile number (10 digits)
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        throw new Error(`Invalid Indian mobile number: ${mobile}`);
      }

      const response = await axios.post<Fast2SMSResponse>(
        this.config.fast2sms.apiUrl,
        {
          route: 'v3',
          sender_id: this.config.fast2sms.senderId,
          message: text,
          language: 'english',
          flash: 0,
          numbers: cleanMobile,
        },
        {
          headers: {
            authorization: this.config.fast2sms.apiKey,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.data.return) {
        throw new Error(
          `Fast2SMS API Error: ${response.data.message.join(', ')}`,
        );
      }

      console.log(`✅ SMS sent successfully to ${cleanMobile}`);
      console.log(`Request ID: ${response.data.request_id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Fast2SMS Error:', error.response?.data || error.message);
        throw new Error(
          `Failed to send SMS: ${error.response?.data?.message || error.message}`,
        );
      }
      throw error;
    }
  }
}
