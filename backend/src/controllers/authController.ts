import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../config';
import { AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';

const prisma = new PrismaClient();

/**
 * 1. SEND / RESEND OTP FOR EMAIL VERIFICATION
 * (5 minutes expiry, 60s cooldown, max 5 attempts, cryptographically secure 6-digit OTP, bcrypt hash)
 */
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please enter your full legal name.' });
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Check if user already exists and is verified
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    // Check 60s resend cooldown
    const existingVerification = await prisma.emailVerification.findUnique({ where: { email: cleanEmail } });
    if (existingVerification && existingVerification.otpLastSentAt) {
      const timeDiffMs = Date.now() - new Date(existingVerification.otpLastSentAt).getTime();
      if (timeDiffMs < 60000) {
        const secondsLeft = Math.ceil((60000 - timeDiffMs) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${secondsLeft} seconds before requesting a new verification code.`,
        });
      }
    }

    // Generate cryptographically secure 6-digit OTP code & Hash it
    const generatedOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(generatedOtp, 10);
    const passwordHash = await bcrypt.hash(password, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const isDemoOtpMode = process.env.DEMO_OTP_MODE === 'true';

    // Upsert into EmailVerification model
    await prisma.emailVerification.upsert({
      where: { email: cleanEmail },
      update: {
        otpHash,
        otpExpiresAt: expiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
        name: name.trim(),
        passwordHash,
      },
      create: {
        email: cleanEmail,
        otpHash,
        otpExpiresAt: expiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
        name: name.trim(),
        passwordHash,
      },
    });

    if (isDemoOtpMode) {
      // SIH SEMIFINAL DEMO MODE: Return demoOtp to registration frontend
      const domain = cleanEmail.includes('@') ? cleanEmail.split('@')[1] : 'domain';
      console.log(`[DEMO MODE] Registration OTP generated for domain: ${domain}`);

      // Attempt background email delivery if provider configured, but do not block or fail demo
      emailService.sendVerificationOTP(cleanEmail, name.trim(), generatedOtp).catch(() => false);

      return res.status(200).json({
        success: true,
        message: 'Verification code generated for SIH semifinal demonstration.',
        email: cleanEmail,
        demoOtp: generatedOtp,
      });
    }

    // PRODUCTION / STANDARD MODE: Send real OTP via Resend HTTPS API
    console.log('[OTP] Email send started via Resend HTTPS API');
    const emailSent = await emailService.sendVerificationOTP(cleanEmail, name.trim(), generatedOtp);

    if (!emailSent) {
      console.error('[OTP] EMAIL_SEND_FAILED: Email service could not send message to provider');
      return res.status(400).json({
        success: false,
        message: 'Unable to send verification email. Please try again.',
        emailDeliveryError: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
    });
  } catch (error: any) {
    console.error('❌ sendOtp Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating your account. Please try again.',
    });
  }
};


/**
 * 2. VERIFY OTP & CREATE VERIFIED ACCOUNT
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (cleanOtp.length !== 6 || !/^\d+$/.test(cleanOtp)) {
      return res.status(400).json({ success: false, message: 'Verification code must be a 6-digit number.' });
    }

    const record = await prisma.emailVerification.findUnique({ where: { email: cleanEmail } });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: 'This email is awaiting verification. You can resend the OTP.',
      });
    }

    // Check failed attempts limit (max 5)
    if (record.otpAttempts >= 5) {
      await prisma.emailVerification.delete({ where: { email: cleanEmail } });
      return res.status(400).json({
        success: false,
        message: 'Maximum verification attempts exceeded (5/5). Please request a new verification code.',
      });
    }

    // Check 5-minute expiry
    if (new Date() > new Date(record.otpExpiresAt)) {
      await prisma.emailVerification.delete({ where: { email: cleanEmail } });
      return res.status(400).json({
        success: false,
        message: 'Your verification code has expired. Please request a new code.',
      });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(cleanOtp, record.otpHash);
    if (!isMatch) {
      const newAttempts = record.otpAttempts + 1;
      await prisma.emailVerification.update({
        where: { email: cleanEmail },
        data: { otpAttempts: newAttempts },
      });
      const remaining = Math.max(0, 5 - newAttempts);
      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. Please try again (${remaining} attempt${remaining === 1 ? '' : 's'} remaining).`,
      });
    }

    // OTP Verified! Check duplicate account one last time
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      await prisma.emailVerification.delete({ where: { email: cleanEmail } });
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please sign in.',
      });
    }

    // Atomic transaction for User + StudentProfile creation with emailVerified = true
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: cleanEmail,
          password: record.passwordHash,
          name: record.name,
          role: 'STUDENT',
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });

    // Cleanup verification record
    await prisma.emailVerification.delete({ where: { email: cleanEmail } });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Email verified successfully. Your account has been created.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('❌ verifyOtp Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while verifying your account. Please try again.',
    });
  }
};

/**
 * 3. DIRECT REGISTRATION (BACKWARD COMPATIBLE FLOW)
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = 'STUDENT', mobile } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please enter your full legal name.' });
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists. Please sign in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          name: name.trim(),
          role: 'STUDENT',
          mobile: mobile ? String(mobile).trim() : null,
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      });

      await tx.studentProfile.create({
        data: {
          userId: newUser.id,
        },
      });

      return newUser;
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('❌ Registration Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while creating your account. Please try again.',
    });
  }
};

/**
 * 4. LOGIN
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
    }

    // Email verification check
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        emailVerified: false,
        email: user.email,
        message: 'Please verify your email before signing in.',
      });
    }

    // Role selection mismatch check
    if (role && typeof role === 'string' && role.trim().length > 0) {
      const requestedRole = role.trim().toUpperCase();
      if (user.role !== requestedRole) {
        const portalName =
          user.role === 'STUDENT'
            ? 'Student Portal'
            : user.role === 'INSTITUTE'
            ? 'Institute Portal'
            : 'Admin Portal';
        const roleLabel =
          user.role === 'INSTITUTE' ? 'an Institute' : user.role === 'ADMIN' ? 'an Admin' : 'a Student';

        return res.status(403).json({
          success: false,
          roleMismatch: true,
          registeredRole: user.role,
          message: `This account is registered as ${roleLabel} account. Please select ${portalName}.`,
        });
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error: any) {
    console.error('❌ Login Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong during login. Please try again.',
    });
  }
};

/**
 * 5. FORGOT PASSWORD
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a password reset code has been sent.',
      });
    }

    const resetOtp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(resetOtp, 10);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.emailVerification.upsert({
      where: { email: cleanEmail },
      update: {
        otpHash,
        otpExpiresAt: expiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
        name: user.name,
        passwordHash: user.password,
      },
      create: {
        email: cleanEmail,
        otpHash,
        otpExpiresAt: expiresAt,
        otpAttempts: 0,
        otpLastSentAt: new Date(),
        name: user.name,
        passwordHash: user.password,
      },
    });

    await emailService.sendVerificationOTP(cleanEmail, user.name, resetOtp);

    return res.json({
      success: true,
      message: 'Password reset verification code sent to your email.',
    });
  } catch (error: any) {
    console.error('❌ forgotPassword Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while requesting password reset. Please try again.',
    });
  }
};

/**
 * 6. RESET PASSWORD
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, verification code, and new password are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const record = await prisma.emailVerification.findUnique({ where: { email: cleanEmail } });
    if (!record || new Date() > new Date(record.otpExpiresAt)) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset code.' });
    }

    const isMatch = await bcrypt.compare(cleanOtp, record.otpHash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect reset code. Please try again.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword },
    });

    await prisma.emailVerification.delete({ where: { email: cleanEmail } });

    return res.json({
      success: true,
      message: 'Password reset successfully. You can now sign in with your new password.',
    });
  } catch (error: any) {
    console.error('❌ resetPassword Controller Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while resetting password. Please try again.',
    });
  }
};

/**
 * 5. GET ME
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        studentProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mobile: user.mobile,
        avatarUrl: user.avatarUrl,
        studentProfile: user.studentProfile,
      },
    });
  } catch (error: any) {
    console.error('❌ getMe Controller Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user profile.' });
  }
};

/**
 * 6. DEVELOPMENT-ONLY TEST EMAIL ENDPOINT
 */
export const testEmail = async (req: Request, res: Response) => {
  try {
    const { to } = req.body || {};
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid "to" email address in JSON body.' });
    }

    const result = await emailService.sendTestEmail(to.trim());
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error || "Email delivery failed.",
        details: result.details
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${to.trim()}`,
      messageId: result.messageId,
      accepted: result.accepted
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || 'Failed to execute email test.' });
  }
};

/**
 * 7. GET EMAIL SMTP DIAGNOSTICS (DEV ONLY)
 */
export const getEmailDiagnostics = async (_req: Request, res: Response) => {
  const diag = emailService.getDiagnostics();
  return res.status(200).json({
    success: true,
    diagnostics: {
      SMTP_HOST: diag.smtpHost ? `configured (${diag.smtpHost})` : 'not configured',
      SMTP_PORT: diag.smtpPort ? `configured (${diag.smtpPort})` : 'not configured',
      SMTP_SECURE: diag.smtpSecure ? 'true (TLS/SSL)' : 'false (STARTTLS)',
      SMTP_USER: diag.smtpUserConfigured ? 'configured' : 'not configured',
      SMTP_PASS: diag.smtpPassConfigured ? 'configured' : 'not configured',
      EMAIL_FROM: diag.emailFrom ? `configured (${diag.emailFrom})` : 'not configured',
    },
  });
};

/**
 * 8. TEST SMTP TRANSPORTER VERIFICATION DIRECTLY (DEV ONLY)
 */
export const verifyTransportEndpoint = async (_req: Request, res: Response) => {
  try {
    const result = await emailService.verifyTransport();
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Error executing transport verification',
    });
  }
};

/**
 * 9. GET CURRENT PENDING DEVELOPMENT OTP (DEV ONLY - DISABLED IN PRODUCTION)
 */
export const getCurrentDevOtp = async (_req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'Development OTP endpoint is disabled.',
  });
};




