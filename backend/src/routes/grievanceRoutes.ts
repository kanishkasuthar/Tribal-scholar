import { Router } from 'express';
import { getUserGrievances, createGrievance, addGrievanceComment } from '../controllers/grievanceController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/grievances', getUserGrievances);
router.post('/grievances', createGrievance);
router.post('/grievances/:id/comment', addGrievanceComment);

export default router;
