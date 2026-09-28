import { Router } from 'express';
import { register, login, getMe, sendOtp, verifyOtp, forgotPassword, resetPassword, testEmail, getEmailDiagnostics, verifyTransportEndpoint, getCurrentDevOtp } from '../controllers/authController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/resend-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/verify-email', verifyOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/test-email', testEmail);
router.post('/dev/test-email', testEmail);
router.get('/email-diagnostics', getEmailDiagnostics);
router.get('/dev/verify-transport', verifyTransportEndpoint);
router.get('/verify-transport', verifyTransportEndpoint);
router.get('/dev/current-otp', getCurrentDevOtp);
router.get('/current-otp', getCurrentDevOtp);
router.get('/me', authenticateJWT, getMe);

export default router;


