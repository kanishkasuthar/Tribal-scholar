import nodemailer, { Transporter } from 'nodemailer';
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
  private transporter: Transporter | null = null;
  private isVerified = false;

  constructor() {
    this.initTransporter();
  }

  /**
   * Get dynamic SMTP Config from environment variables.
   * Defaults to Resend SMTP configuration on port 465 with secure TLS.
   */
  private getConfig() {
    dotenv.config();
    const host = (process.env.SMTP_HOST || 'smtp.resend.com').trim();
    const port = Number(process.env.SMTP_PORT) || 465;
    const user = (process.env.SMTP_USER || process.env.SMTP_USERNAME || 'resend').trim();
    const pass = (process.env.SMTP_PASS || process.env.RESEND_API_KEY || process.env.SMTP_PASSWORD || '').trim();
    const secure = process.env.SMTP_SECURE === 'false' ? false : (port === 465 || process.env.SMTP_SECURE === 'true');
    const from = (process.env.EMAIL_FROM || 'onboarding@resend.dev').trim();

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
    console.log(`SMTP_SECURE=${cfg.secure}`);
    console.log(`SMTP_CONFIGURED=${configured}`);
    console.log('📧 =======================================================\n');
  }

  /**
   * Helper to create Nodemailer Transporter with strict connection/socket timeouts
   */
  private createTransporterInstance(cfg: ReturnType<typeof this.getConfig>): Transporter {
    return nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: {
        user: cfg.user,
        pass: cfg.pass,
      },
      connectionTimeout: 10000, // 10s connection timeout
      greetingTimeout: 10000,   // 10s greeting timeout
      socketTimeout: 15000,     // 15s socket activity timeout
    });
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
    console.log('EMAIL TRANSPORT VERIFICATION');
    console.log(`Host: ${cfg.host}`);
    console.log(`Port: ${cfg.port}`);
    console.log(`Secure TLS: ${cfg.secure}`);
    console.log(`User Configured: ${userConfigured}`);
    console.log(`Pass Configured: ${passConfigured}`);

    if (!userConfigured || !passConfigured) {
      console.log('Transport verification: FAILED (Credentials missing)');
      return {
        success: false,
        provider: `${cfg.host} (Nodemailer SMTP)`,
        hostConfigured,
        portConfigured,
        userConfigured,
        passConfigured,
        safeError: {
          code: 'EAUTH_MISSING',
          message: 'SMTP_USER or SMTP_PASS environment variables are missing',
        },
      };
    }

    try {
      const testTransporter = this.createTransporterInstance(cfg);

      return await new Promise((resolve) => {
        testTransporter.verify((error: any) => {
          if (error) {
            console.log('Transport verification: FAILED');
            console.log(`error.code: ${error.code || 'N/A'}`);
            console.log(`error.message: ${error.message || 'N/A'}`);

            resolve({
              success: false,
              provider: `${cfg.host} (Nodemailer SMTP)`,
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
            resolve({
              success: true,
              provider: `${cfg.host} (Nodemailer SMTP)`,
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
        provider: `${cfg.host} (Nodemailer SMTP)`,
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
        this.transporter = this.createTransporterInstance(cfg);

        console.log('[EMAIL SERVICE INIT]: SUCCESS — Transporter configured');

        this.transporter.verify((error: any) => {
          if (error) {
            this.isVerified = false;
            console.error('❌ [SMTP VERIFICATION]: FAILED —', error.message || error);
          } else {
            this.isVerified = true;
            console.log(`✅ [SMTP VERIFICATION]: SUCCESS — Connected to ${cfg.host}:${cfg.port}`);
          }
        });
      } catch (err: any) {
        console.error('❌ [EMAIL SERVICE INIT]: FAILED —', err?.message || err);
      }
    } else {
      console.warn('⚠️ [EMAIL SERVICE INIT]: SMTP credentials not fully configured in environment.');
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
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #C49A44; font-weight: 600;">Ministry of Tribal Affairs Alignment</p>
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
          © 2026 Tribal Scholar AI Initiative. SIH 2026 Prototype.
        </div>
      </div>
    `;

    const maskedDomain = email.includes('@') ? email.split('@')[1] : 'unknown';
    console.log(`[OTP] Dispatching email verification to domain: ${maskedDomain}`);

    if (!cfg.user || !cfg.pass) {
      console.error("[OTP] EMAIL_SEND_FAILED: SMTP credentials missing");
      return false;
    }

    if (!this.transporter) {
      this.initTransporter();
    }

    if (!this.transporter) {
      console.error("[OTP] EMAIL_SEND_FAILED: SMTP transporter could not be initialized");
      return false;
    }

    try {
      // Race sendMail against a 16s hard safety timeout so HTTP requests never hang indefinitely
      const sendPromise = this.transporter.sendMail({
        from: cfg.from,
        to: email,
        subject,
        html,
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('SMTP transmission timed out after 16 seconds')), 16000)
      );

      const info: any = await Promise.race([sendPromise, timeoutPromise]);

      const isAccepted = Array.isArray(info?.accepted) && info.accepted.length > 0;
      if (isAccepted || info?.messageId) {
        console.log(`[OTP] EMAIL_SEND_SUCCESS: Email dispatched via ${cfg.host}:${cfg.port}`);
        return true;
      } else {
        console.error("[OTP] EMAIL_SEND_FAILED: Recipient address rejected by SMTP server");
        return false;
      }
    } catch (error: any) {
      console.error(`[OTP] EMAIL_SEND_FAILED: ${error?.message || 'SMTP transmission error'}`);
      return false;
    }
  }

  /**
   * Test Email Delivery Function
   */
  async sendTestEmail(targetEmail: string): Promise<{ success: boolean; messageId?: string; accepted?: any; error?: string; details?: any }> {
    const cfg = this.getConfig();

    if (!cfg.user || !cfg.pass) {
      return {
        success: false,
        error: 'SMTP credentials missing in environment variables.',
      };
    }

    if (!this.transporter) {
      this.initTransporter();
    }

    if (!this.transporter) {
      return { success: false, error: 'Could not initialize SMTP transporter.' };
    }

    try {
      const info = await this.transporter.sendMail({
        from: cfg.from,
        to: targetEmail,
        subject: 'Tribal Scholar AI — Email Delivery Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #DDD3C5; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #FCFAF5;">
            <div style="background-color: #5B1720; color: #FFFDF8; padding: 16px; text-align: center; border-radius: 6px;">
              <h2 style="margin: 0; font-size: 20px;">Tribal Scholar AI</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #C49A44;">SIH 2026 Prototype</p>
            </div>
            <div style="padding: 20px 0; color: #292522;">
              <h3 style="color: #7A1F2B; margin-top: 0;">Email Delivery Test</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #3D352E;">This is a test email from the Tribal Scholar AI platform.</p>
              <p style="font-size: 12px; color: #6B6259;">Timestamp: ${new Date().toISOString()}</p>
            </div>
          </div>
        `,
      });

      const isAccepted = Array.isArray(info.accepted) && info.accepted.length > 0;
      if (isAccepted || info.messageId) {
        return {
          success: true,
          messageId: info.messageId,
          accepted: info.accepted,
        };
      } else {
        return {
          success: false,
          error: `Provider rejected target address: ${targetEmail}`,
        };
      }
    } catch (err: any) {
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
