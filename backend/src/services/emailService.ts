import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export interface EmailDiagnostics {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUserConfigured: boolean;
  smtpPassConfigured: boolean;
  emailFrom: string;
}

class EmailService {
  private transporter: any = null;
  private isVerified = false;

  constructor() {
    this.initTransporter();
  }

  /**
   * Get dynamic SMTP Config from environment variables
   */
  private getConfig() {
    dotenv.config();
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = (process.env.SMTP_USER || process.env.SMTP_USERNAME || '').trim();
    const pass = (process.env.SMTP_PASS || process.env.SMTP_PASSWORD || '').trim();
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    // Sender Address: For Gmail SMTP, sender address must match the authenticated account user
    let from = (process.env.EMAIL_FROM || '').trim();
    if (!from || from.includes('no-reply@mota.gov.in')) {
      if (user && user.includes('@gmail.com')) {
        from = `Tribal Scholar AI <${user}>`;
      } else if (!from) {
        from = 'Ministry of Tribal Affairs <no-reply@mota.gov.in>';
      }
    }

    return { host, port, user, pass, secure, from };
  }

  /**
   * Safe development diagnostic reporting required variables without exposing secret values
   */
  public getDiagnostics(): EmailDiagnostics {
    const cfg = this.getConfig();
    return {
      smtpHost: cfg.host,
      smtpPort: cfg.port,
      smtpSecure: cfg.secure,
      smtpUserConfigured: Boolean(cfg.user),
      smtpPassConfigured: Boolean(cfg.pass),
      emailFrom: cfg.from,
    };
  }

  public printDiagnostics(): void {
    const cfg = this.getConfig();
    const userLoaded = Boolean(cfg.user);
    const passLoaded = Boolean(cfg.pass);
    const configured = userLoaded && passLoaded;

    console.log('\n📧 =======================================================');
    console.log('📧 TRIBAL SCHOLAR AI — EMAIL SERVICE SMTP DIAGNOSTICS');
    console.log('📧 =======================================================');
    console.log(`SMTP_USER_LOADED=${userLoaded}`);
    console.log(`SMTP_PASSWORD_LOADED=${passLoaded}`);
    console.log(`SMTP_HOST=${cfg.host}`);
    console.log(`SMTP_PORT=${cfg.port}`);
    console.log(`SMTP_CONFIGURED=${configured}`);
    console.log('📧 =======================================================\n');
  }

  /**
   * Safe transport verification for development diagnostics
   */
  public async verifyTransport(): Promise<{
    success: boolean;
    provider: string;
    hostConfigured: boolean;
    portConfigured: boolean;
    userConfigured: boolean;
    passConfigured: boolean;
    safeError?: {
      code?: string;
      responseCode?: number;
      command?: string;
      message?: string;
    };
  }> {
    const cfg = this.getConfig();
    const hostConfigured = Boolean(cfg.host);
    const portConfigured = Boolean(cfg.port);
    const userConfigured = Boolean(cfg.user);
    const passConfigured = Boolean(cfg.pass);

    console.log('\n=======================================================');
    console.log('EMAIL TRANSPORT TEST');
    console.log('Provider: Gmail (Nodemailer SMTP)');
    console.log(`Host: ${hostConfigured ? 'configured' : 'missing'}`);
    console.log(`Port: ${portConfigured ? 'configured' : 'missing'}`);
    console.log(`User: ${userConfigured ? 'configured' : 'missing'}`);
    console.log(`Password: ${passConfigured ? 'configured' : 'missing'}`);

    if (!userConfigured || !passConfigured) {
      console.log('Transport verification: FAILED');
      console.log('Reason: SMTP_USER or SMTP_PASS missing in backend/.env');
      return {
        success: false,
        provider: 'Gmail (Nodemailer SMTP)',
        hostConfigured,
        portConfigured,
        userConfigured,
        passConfigured,
        safeError: {
          code: 'EAUTH_MISSING',
          message: 'SMTP_USER or SMTP_PASS environment variables are missing in backend/.env',
        },
      };
    }

    try {
      const testTransporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: {
          user: cfg.user,
          pass: cfg.pass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      return await new Promise((resolve) => {
        testTransporter.verify((error: any) => {
          if (error) {
            console.log('Transport verification: FAILED');
            console.log(`error.code: ${error.code || 'N/A'}`);
            console.log(`error.responseCode: ${error.responseCode || 'N/A'}`);
            console.log(`error.command: ${error.command || 'N/A'}`);
            console.log(`error.message: ${error.message || 'N/A'}`);

            resolve({
              success: false,
              provider: 'Gmail (Nodemailer SMTP)',
              hostConfigured,
              portConfigured,
              userConfigured,
              passConfigured,
              safeError: {
                code: error.code,
                responseCode: error.responseCode,
                command: error.command,
                message: error.message,
              },
            });
          } else {
            console.log('Transport verification: SUCCESS');
            console.log('SMTP transport verified successfully.');
            resolve({
              success: true,
              provider: 'Gmail (Nodemailer SMTP)',
              hostConfigured,
              portConfigured,
              userConfigured,
              passConfigured,
            });
          }
        });
      });
    } catch (err: any) {
      console.log('Transport verification: FAILED');
      return {
        success: false,
        provider: 'Gmail (Nodemailer SMTP)',
        hostConfigured,
        portConfigured,
        userConfigured,
        passConfigured,
        safeError: {
          code: err?.code || 'UNKNOWN',
          message: err?.message || 'Failed to initialize SMTP transport',
        },
      };
    }
  }

  /**
   * Initialize SMTP Transporter
   */
  public initTransporter() {
    this.printDiagnostics();
    const cfg = this.getConfig();

    if (cfg.user && cfg.pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: cfg.host,
          port: cfg.port,
          secure: cfg.secure,
          auth: {
            user: cfg.user,
            pass: cfg.pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        console.log('[EMAIL SERVICE INIT]: SUCCESS — Transporter configured');

        this.transporter.verify((error: any) => {
          if (error) {
            this.isVerified = false;
            console.error('❌ [SMTP VERIFICATION]: FAILED —', error.message);
          } else {
            this.isVerified = true;
            console.log(`✅ [SMTP VERIFICATION]: SUCCESS — Ready for ${cfg.host}:${cfg.port}`);
          }
        });
      } catch (err: any) {
        console.error('❌ [EMAIL SERVICE INIT]: FAILED —', err?.message || err);
      }
    } else {
      console.warn('⚠️ [EMAIL SERVICE INIT]: SMTP_USER or SMTP_PASS not set in backend/.env.');
      console.warn('⚠️ Real email delivery to Gmail recipients requires SMTP credentials in backend/.env.');
    }
  }

  /**
   * Send 6-digit Email Verification OTP
   */
  async sendVerificationOTP(email: string, name: string, otp: string): Promise<boolean> {
    const cfg = this.getConfig();

    const subject = 'Tribal Scholar AI - Verify Your Email';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #DDD3C5; border-radius: 12px; overflow: hidden; background-color: #FCFAF5;">
        <div style="background-color: #5B1720; color: #FFFDF8; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700;">Tribal Scholar AI</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #C49A44; font-weight: 600;">Ministry of Tribal Affairs</p>
        </div>
        <div style="padding: 28px 24px; color: #292522;">
          <p style="font-size: 14px; font-weight: 600; margin-top: 0;">Dear ${name},</p>
          <p style="font-size: 14px; line-height: 1.5; color: #3D352E;">Your email verification code is:</p>
          
          <div style="text-align: center; margin: 28px 0;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #7A1F2B; background-color: #F7F1E6; padding: 14px 28px; border-radius: 10px; border: 1px solid #DDD3C5; display: inline-block;">${otp}</span>
          </div>

          <p style="font-size: 13px; color: #6B6259; line-height: 1.6; margin-bottom: 0;">
            • This code expires in <strong>5 minutes</strong>.<br>
            • If you did not request this verification, you can ignore this email.
          </p>
        </div>
        <div style="background-color: #5B1720; color: #F2E9DC; padding: 14px; text-align: center; font-size: 11px;">
          © 2026 Ministry of Tribal Affairs. Tribal Scholar AI.
        </div>
      </div>
    `;

    console.log(`[OTP] Email send started for: ${email}`);

    if (!cfg.user || !cfg.pass) {
      console.error("EMAIL_SEND_FAILED", {
        code: 'EAUTH_MISSING',
        responseCode: undefined,
        command: 'AUTH',
        message: 'SMTP_USER or SMTP_PASS is missing in backend/.env',
      });
      return false;
    }

    if (!this.transporter) {
      this.initTransporter();
    }

    if (!this.transporter) {
      console.error("EMAIL_SEND_FAILED", {
        code: 'ETRANSPORTER_UNINITIALIZED',
        responseCode: undefined,
        command: 'INIT',
        message: 'SMTP transporter could not be initialized',
      });
      return false;
    }

    try {
      const info = await this.transporter.sendMail({
        from: cfg.from,
        to: email,
        subject,
        html,
      });

      console.log("EMAIL_SEND_SUCCESS", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });

      const isAccepted = Array.isArray(info.accepted) && info.accepted.length > 0;

      if (isAccepted) {
        return true;
      } else {
        console.error("EMAIL_SEND_FAILED", {
          code: 'RECIPIENT_REJECTED',
          responseCode: undefined,
          command: 'RCPT TO',
          message: `Provider rejected recipient address ${email}`,
        });
        return false;
      }
    } catch (error: any) {
      console.error("EMAIL_SEND_FAILED", {
        code: error.code,
        responseCode: error.responseCode,
        command: error.command,
        message: error.message,
      });
      return false;
    }
  }

  /**
   * Development-Only Test Email Delivery Function
   */
  async sendTestEmail(targetEmail: string): Promise<{ success: boolean; messageId?: string; accepted?: any; error?: string; details?: any }> {
    const cfg = this.getConfig();

    if (!cfg.user || !cfg.pass) {
      console.error('[OTP] TEST_EMAIL_FAILED: SMTP_USER or SMTP_PASS missing in backend/.env');
      return {
        success: false,
        error: 'SMTP_USER or SMTP_PASS is not configured in backend/.env. Real email delivery is impossible until SMTP credentials are provided.',
      };
    }

    if (!this.transporter) {
      this.initTransporter();
    }

    if (!this.transporter) {
      return { success: false, error: 'Could not initialize SMTP transporter.' };
    }

    try {
      console.log(`[OTP] Test email send started for: ${targetEmail}`);
      const info = await this.transporter.sendMail({
        from: cfg.from,
        to: targetEmail,
        subject: 'Tribal Scholar AI — Email Delivery Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #DDD3C5; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #FCFAF5;">
            <div style="background-color: #5B1720; color: #FFFDF8; padding: 16px; text-align: center; border-radius: 6px;">
              <h2 style="margin: 0; font-size: 20px;">Tribal Scholar AI</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #C49A44;">Ministry of Tribal Affairs</p>
            </div>
            <div style="padding: 20px 0; color: #292522;">
              <h3 style="color: #7A1F2B; margin-top: 0;">Email Delivery Test</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #3D352E;">This is a test email from the Tribal Scholar AI development environment.</p>
              <p style="font-size: 12px; color: #6B6259;">Timestamp: ${new Date().toISOString()}</p>
            </div>
          </div>
        `,
      });

      const isAccepted = Array.isArray(info.accepted) && info.accepted.length > 0;
      if (isAccepted) {
        console.log(`[OTP] Test email provider response: ACCEPTED (Message ID: ${info.messageId})`);
        return {
          success: true,
          messageId: info.messageId,
          accepted: info.accepted,
        };
      } else {
        console.error(`[OTP] TEST_EMAIL_FAILED: Provider did not accept address ${targetEmail}`);
        return {
          success: false,
          error: `Provider did not accept target address: ${targetEmail}`,
          details: info,
        };
      }
    } catch (err: any) {
      console.error(`[OTP] TEST_EMAIL_FAILED: ${err?.message || err}`);
      return {
        success: false,
        error: err?.message || 'SMTP transmission error',
      };
    }
  }

  /**
   * Send Password Reset OTP
   */
  async sendPasswordResetOTP(email: string, otp: string): Promise<boolean> {
    return this.sendVerificationOTP(email, 'Scholar', otp);
  }

  /**
   * Send Notification Email
   */
  async sendNotificationEmail(email: string, subject: string, content: string): Promise<boolean> {
    const cfg = this.getConfig();
    if (!cfg.user || !cfg.pass || !this.transporter) return false;

    try {
      await this.transporter.sendMail({
        from: cfg.from,
        to: email,
        subject,
        html: `<div style="font-family: Arial; padding: 20px;">${content}</div>`,
      });
      return true;
    } catch (err: any) {
      console.error('❌ [NOTIFICATION EMAIL]: FAILED:', err?.message || err);
      return false;
    }
  }
}

export const emailService = new EmailService();
