import { Router } from 'express';
import {
  handleAssistantQuery,
  handleAssistantStream,
  handleAssistantContext,
  getAssistantSuggestions,
} from '../controllers/assistantController';
import { optionalAuth } from '../middleware/auth';

const router = Router();

router.use(optionalAuth);

router.post('/', handleAssistantQuery);
router.post('/assistant', handleAssistantQuery);
router.post('/message', handleAssistantQuery);
router.post('/stream', handleAssistantStream);
router.post('/context', handleAssistantContext);
router.get('/suggestions', getAssistantSuggestions);

export default router;


