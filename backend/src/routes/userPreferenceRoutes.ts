import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { getUserPreferences, updateUserPreferences } from '../controllers/userPreferenceController';

const router = Router();

router.get('/user/preferences', authenticateJWT, getUserPreferences);
router.put('/user/preferences', authenticateJWT, updateUserPreferences);

export default router;
