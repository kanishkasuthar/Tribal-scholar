import { Router } from 'express';
import {
  getUserApplications,
  createApplication,
  getApplicationById,
  submitApplication,
  getDigitalTwin,
  returnApplication,
  resubmitApplication,
  updateApplicationStatus,
} from '../controllers/applicationController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/applications', getUserApplications);
router.post('/applications', createApplication);
router.post('/applications/apply', createApplication);
router.get('/applications/:id', getApplicationById);
router.post('/applications/:id/submit', submitApplication);
router.get('/applications/:id/digital-twin', getDigitalTwin);
router.get('/applications/:id/timeline', getDigitalTwin);
router.post('/applications/:id/return', returnApplication);
router.post('/applications/:id/resubmit', resubmitApplication);
router.post('/applications/:id/status', updateApplicationStatus);

export default router;
