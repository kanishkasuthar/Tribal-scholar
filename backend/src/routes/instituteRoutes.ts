import { Router } from 'express';
import { getInstituteDashboard, verifyApplicationByOfficer } from '../controllers/instituteController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRoles('INSTITUTE', 'ADMIN'));

router.get('/dashboard', getInstituteDashboard);
router.post('/verify', verifyApplicationByOfficer);

export default router;
