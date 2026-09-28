import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import {
  getStudentFunding,
  getFundingHistory,
  getStudentRenewals,
  getRenewalById,
  submitRenewalApplication,
  getStudentProgress,
  updateStudentProgress,
  getStudentRoadmap,
  simulateRoadmapScenario,
  getResearchInterests,
  updateResearchInterests,
} from '../controllers/studentLifecycleController';

const router = Router();

// Protect all student lifecycle routes
router.use(authenticateJWT);
router.use(authorizeRoles('STUDENT'));

router.get('/funding', getStudentFunding);
router.get('/funding/history', getFundingHistory);

router.get('/renewals', getStudentRenewals);
router.get('/renewals/:id', getRenewalById);
router.post('/renewals/:id/submit', submitRenewalApplication);

router.get('/progress', getStudentProgress);
router.put('/progress', updateStudentProgress);

router.get('/roadmap', getStudentRoadmap);
router.post('/roadmap/scenario', simulateRoadmapScenario);

router.get('/research-interests', getResearchInterests);
router.put('/research-interests', updateResearchInterests);

export default router;
