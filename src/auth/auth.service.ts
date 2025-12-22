import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { OtpTransport, User, UserRole } from '@prisma/client';
import { JwtPayload, UserType } from '@Common';
import { SendCodeRequestType } from './dto';
import { UsersService } from '../users';
import {
  OtpContext,
  OtpService,
  SendCodeResponse,
  VerifyCodeResponse,
} from '../otp';
import { MailService } from 'src/mail';
import { appConfigFactory } from '@Config';
import { ConfigType } from '@nestjs/config';

export type ValidAuthResponse = {
  accessToken: string;
  type: UserType;
};

export type InvalidVerifyCodeResponse = {
  email: VerifyCodeResponse;
  mobile?: VerifyCodeResponse;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly mailService: MailService, // ADD THIS
    @Inject(appConfigFactory.KEY) // ADD THIS
    private readonly appConfig: ConfigType<typeof appConfigFactory>,
  ) {}

  private generateJwt(payload: JwtPayload, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  async sendCode(
    target: string,
    transport: OtpTransport,
    type: SendCodeRequestType,
  ): Promise<SendCodeResponse> {
    if (type === SendCodeRequestType.Register) {
      if (
        transport === OtpTransport.EMAIL &&
        (await this.usersService.isEmailExist(target))
      ) {
        throw new Error('Email already in use');
      }
      if (
        transport === OtpTransport.MOBILE &&
        (await this.usersService.isMobileExist(target))
      ) {
        throw new Error('Mobile already in use');
      }

      return await this.otpService.send({
        context: OtpContext.Register,
        target,
        ...(transport === OtpTransport.EMAIL
          ? {
              transport,
              transportParams: {
                username: 'User',
              },
            }
          : { transport }),
      });
    }

    throw new Error('Unknown send code request type found');
  }

  async login(userId: number, type: UserType): Promise<ValidAuthResponse> {
    const user = await this.usersService.getById(userId);
    return {
      accessToken: this.generateJwt({
        sub: userId,
        type,
        role: user.role,
      }),
      type,
    };
  }

  async registerUser(data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    dialCode?: string;
    mobile?: string;
    country: string;
    emailVerificationCode: string;
    mobileVerificationCode?: string;
    role?: UserRole;
  }): Promise<InvalidVerifyCodeResponse | ValidAuthResponse> {
    const [verifyEmailOtpResponse, verifyMobileOtpResponse] = await Promise.all(
      [
        this.otpService.verify(
          data.emailVerificationCode,
          data.email,
          OtpTransport.EMAIL,
        ),
        data.mobile &&
          this.otpService.verify(
            data.mobileVerificationCode || '',
            data.mobile,
            OtpTransport.MOBILE,
          ),
      ],
    );
    if (
      !verifyEmailOtpResponse.status ||
      (verifyMobileOtpResponse && !verifyMobileOtpResponse.status)
    ) {
      return {
        email: verifyEmailOtpResponse,
        mobile: verifyMobileOtpResponse || undefined,
      };
    }

    const user = await this.usersService.create({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      dialCode: data.dialCode,
      mobile: data.mobile,
      country: data.country,
      role: data.role,
    });

    // Send welcome email (non-blocking - don't await)
    this.mailService
      .send({
        to: user.email,
        subject: `Welcome to Event Booking System, ${user.firstname}!`,
        mailBodyOrTemplate: {
          name: 'welcome',
          data: {
            firstname: user.firstname,
            email: user.email,
            role: user.role,
            appWebUrl: this.appConfig.appWebUrl || 'http://localhost:9001',
          },
        },
      })
      .catch((err) => {
        // Log error but don't fail registration
        console.error('Failed to send welcome email:', err);
      });

    return {
      accessToken: this.generateJwt({
        sub: user.id,
        type: UserType.User,
        role: user.role,
      }),
      type: UserType.User,
    };
  }

  async forgotPassword(
    email?: string,
    mobile?: string,
  ): Promise<{ email?: SendCodeResponse; mobile?: SendCodeResponse }> {
    return await this.usersService.sendResetPasswordVerificationCode(
      email,
      mobile,
    );
  }

  async resetPassword(
    code: string,
    newPassword: string,
    mobile?: string,
    email?: string,
  ): Promise<User> {
    return await this.usersService.resetPassword(
      code,
      newPassword,
      mobile,
      email,
    );
  }
}
