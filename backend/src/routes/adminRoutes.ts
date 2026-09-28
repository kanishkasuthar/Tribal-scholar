import { Router } from 'express';
import {
  getAdminDashboard,
  getAIInsights,
  getGeographicAnalytics,
  getSchemePerformance,
  getDisbursementAnalytics,
  getAdminApplications,
  getAuditLogs,
  createScheme,
} from '../controllers/adminController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/applications', getAdminApplications);
router.get('/ai-insights', getAIInsights);
router.get('/districts', getGeographicAnalytics);
router.get('/schemes', getSchemePerformance);
router.post('/schemes', createScheme);
router.get('/disbursement', getDisbursementAnalytics);
router.get('/audit-logs', getAuditLogs);

export default router;
