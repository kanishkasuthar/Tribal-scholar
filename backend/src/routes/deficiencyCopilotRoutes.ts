import { Router } from 'express';
import {
  getDeficiencyCopilotOverview,
  getDeficiencyCopilotById,
  recheckDeficiencyCopilot,
} from '../controllers/deficiencyCopilotController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/deficiency-copilot', getDeficiencyCopilotOverview);
router.get('/deficiency-copilot/:id', getDeficiencyCopilotById);
router.post('/deficiency-copilot/:id/recheck', recheckDeficiencyCopilot);

export default router;
