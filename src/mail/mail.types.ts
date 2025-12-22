type VerificationCodeMailPayload = {
  username: string;
  code: string;
  expirationTime: string;
};

export type RegisterVerificationCodeMailTemplate = {
  name: 'register-verification-code';
  data: VerificationCodeMailPayload;
};

export type ResetPasswordVerificationCodeMailTemplate = {
  name: 'reset-password-verification-code';
  data: VerificationCodeMailPayload;
};

type WelcomeMailPayload = {
  firstname: string;
  email: string;
  role: 'USER' | 'ORGANIZER';
  appWebUrl: string;
};

export type WelcomeMailTemplate = {
  name: 'welcome';
  data: WelcomeMailPayload;
};

export type MailTemplate =
  | RegisterVerificationCodeMailTemplate
  | ResetPasswordVerificationCodeMailTemplate
  | WelcomeMailTemplate;

export type MailParams = { subject: string; template: MailTemplate };
