import { Router } from 'express';
import { getMatchedOpportunities, getExplainableEligibility } from '../controllers/matchingController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/matching/opportunities', getMatchedOpportunities);
router.post('/matching/analyze', getMatchedOpportunities);
router.get('/matching/recommendations', getMatchedOpportunities);
router.get('/matching/opportunities/:id/explanation', getExplainableEligibility);
router.get('/eligibility/:id', getExplainableEligibility);

export default router;

