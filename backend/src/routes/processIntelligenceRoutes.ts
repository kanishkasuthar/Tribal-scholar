import { Router } from 'express';
import {
  getProcessIntelligenceReport,
  getStudentPreventiveIntelligence,
  getInstituteProcessIntelligence,
} from '../controllers/processIntelligenceController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

// Admin / Ministry view
router.get('/report', authorizeRoles('ADMIN'), getProcessIntelligenceReport);

// Student view
router.get('/preventive', authorizeRoles('STUDENT', 'ADMIN'), getStudentPreventiveIntelligence);

// Institute view
router.get('/institute', authorizeRoles('INSTITUTE', 'ADMIN'), getInstituteProcessIntelligence);

export default router;
