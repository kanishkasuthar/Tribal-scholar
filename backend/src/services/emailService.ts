import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

export interface EmailDiagnostics {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUserConfigured: boolean;
  smtpPassConfigured: boolean;
  emailFrom: string;
  resendApiKeyConfigured: boolean;
  provider: string;
}

class EmailService {
  private resend: Resend | null = null;

  constructor() {
    this.initClient();
  }

  /**
   * Get dynamic configuration from environment variables.
   * Uses RESEND_API_KEY (or SMTP_PASS fallback) for Resend HTTPS API.
   */
  private getConfig() {
    dotenv.config();
    const apiKey = (process.env.RESEND_API_KEY || process.env.SMTP_PASS || '').trim();
    const from = (process.env.EMAIL_FROM || 'onboarding@resend.dev').trim();

    return { apiKey, from };
  }

  /**
   * Initialize Resend HTTPS API Client
   */
  public initClient() {
    this.printDiagnostics();
    const cfg = this.getConfig();

    if (cfg.apiKey) {
      try {
        this.resend = new Resend(cfg.apiKey);
        console.log('✅ [EMAIL SERVICE INIT]: SUCCESS — Resend HTTPS API client initialized');
      } catch (err: any) {
        console.error('❌ [EMAIL SERVICE INIT]: FAILED —', err?.message || err);
        this.resend = null;
      }
    } else {
      console.warn('⚠️ [EMAIL SERVICE INIT]: RESEND_API_KEY not configured in environment.');
      this.resend = null;
    }
  }

  /**
   * Safe development diagnostic reporting without exposing secret values
   */
  public getDiagnostics(): EmailDiagnostics {
    const cfg = this.getConfig();
    const isConfigured = Boolean(cfg.apiKey);
    return {
      smtpHost: 'api.resend.com',
      smtpPort: 443,
      smtpSecure: true,
      smtpUserConfigured: isConfigured,
      smtpPassConfigured: isConfigured,
      emailFrom: cfg.from,
      resendApiKeyConfigured: isConfigured,
      provider: 'Resend HTTPS API',
    };
  }

  public printDiagnostics(): void {
    const cfg = this.getConfig();
    const keyLoaded = Boolean(cfg.apiKey);

    console.log('\n📧 =======================================================');
    console.log('📧 TRIBAL SCHOLAR AI — EMAIL SERVICE (RESEND HTTPS API)');
    console.log('📧 =======================================================');
    console.log(`RESEND_API_KEY_LOADED=${keyLoaded}`);
    console.log(`EMAIL_FROM=${cfg.from}`);
    console.log(`PROVIDER=Resend HTTPS API (https://api.resend.com)`);
    console.log('📧 =======================================================\n');
  }

  /**
   * Safe transport/client verification
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
    const isConfigured = Boolean(cfg.apiKey);

    if (!isConfigured) {
      return {
        success: false,
        provider: 'Resend HTTPS API (api.resend.com)',
        hostConfigured: true,
        portConfigured: true,
        userConfigured: false,
        passConfigured: false,
        safeError: {
          code: 'EAUTH_MISSING',
          message: 'RESEND_API_KEY environment variable is missing',
        },
      };
    }

    return {
      success: true,
      provider: 'Resend HTTPS API (api.resend.com)',
      hostConfigured: true,
      portConfigured: true,
      userConfigured: true,
      passConfigured: true,
    };
  }

  /**
   * Send 6-digit Email Verification OTP via Resend HTTPS API
   */
  async sendVerificationOTP(email: string, name: string, otp: string): Promise<boolean> {
    const cfg = this.getConfig();

    const maskedDomain = email.includes('@') ? email.split('@')[1] : 'unknown';
    console.log(`[OTP] Dispatching email verification via Resend HTTPS API to domain: ${maskedDomain}`);

    if (!cfg.apiKey) {
      console.error('[OTP] EMAIL_SEND_FAILED: RESEND_API_KEY missing in environment');
      return false;
    }

    if (!this.resend) {
      this.initClient();
    }

    if (!this.resend) {
      console.error('[OTP] EMAIL_SEND_FAILED: Resend client could not be initialized');
      return false;
    }

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

    try {
      const { data, error } = await this.resend.emails.send({
        from: cfg.from,
        to: [email],
        subject,
        html,
      });

      if (error) {
        console.error(`[OTP] EMAIL_SEND_FAILED: ${error.message || 'Resend API error'}`);
        return false;
      }

      if (data?.id) {
        console.log(`[OTP] EMAIL_SEND_SUCCESS: Email dispatched via Resend HTTPS API (id: ${data.id})`);
        return true;
      }

      console.error('[OTP] EMAIL_SEND_FAILED: Resend API returned no email ID');
      return false;
    } catch (error: any) {
      console.error(`[OTP] EMAIL_SEND_FAILED: ${error?.message || 'Resend API request exception'}`);
      return false;
    }
  }

  /**
   * Test Email Delivery Function via Resend HTTPS API
   */
  async sendTestEmail(targetEmail: string): Promise<{ success: boolean; messageId?: string; accepted?: any; error?: string; details?: any }> {
    const cfg = this.getConfig();

    if (!cfg.apiKey) {
      return {
        success: false,
        error: 'RESEND_API_KEY missing in environment variables.',
      };
    }

    if (!this.resend) {
      this.initClient();
    }

    if (!this.resend) {
      return { success: false, error: 'Could not initialize Resend API client.' };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: cfg.from,
        to: [targetEmail],
        subject: 'Tribal Scholar AI — Email Delivery Test',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #DDD3C5; border-radius: 10px; max-width: 600px; margin: 0 auto; background-color: #FCFAF5;">
            <div style="background-color: #5B1720; color: #FFFDF8; padding: 16px; text-align: center; border-radius: 6px;">
              <h2 style="margin: 0; font-size: 20px;">Tribal Scholar AI</h2>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #C49A44;">SIH 2026 Prototype</p>
            </div>
            <div style="padding: 20px 0; color: #292522;">
              <h3 style="color: #7A1F2B; margin-top: 0;">Email Delivery Test</h3>
              <p style="font-size: 14px; line-height: 1.5; color: #3D352E;">This is a test email from the Tribal Scholar AI platform via Resend HTTPS API.</p>
              <p style="font-size: 12px; color: #6B6259;">Timestamp: ${new Date().toISOString()}</p>
            </div>
          </div>
        `,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Resend API returned error',
        };
      }

      if (data?.id) {
        return {
          success: true,
          messageId: data.id,
          accepted: [targetEmail],
        };
      }

      return {
        success: false,
        error: 'No message ID returned from Resend API',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Resend API request error',
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
   * Send Notification Email via Resend HTTPS API
   */
  async sendNotificationEmail(email: string, subject: string, content: string): Promise<boolean> {
    const cfg = this.getConfig();
    if (!cfg.apiKey) return false;
    if (!this.resend) this.initClient();
    if (!this.resend) return false;

    try {
      const { data, error } = await this.resend.emails.send({
        from: cfg.from,
        to: [email],
        subject,
        html: `<div style="font-family: Arial; padding: 20px;">${content}</div>`,
      });
      return !error && Boolean(data?.id);
    } catch (err: any) {
      console.error('❌ [NOTIFICATION EMAIL]: FAILED:', err?.message || err);
      return false;
    }
  }
}

export const emailService = new EmailService();
