import { Router } from 'express';
import { getProfile, updateProfile, getProfileCompletion, getStudentTasks, getStudentRenewals, getAcademicRoadmap } from '../controllers/studentController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.get('/me/profile-completion', getProfileCompletion);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/tasks', getStudentTasks);
router.get('/renewals', getStudentRenewals);
router.get('/roadmap', getAcademicRoadmap);

export default router;

