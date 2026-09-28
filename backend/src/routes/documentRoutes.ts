import { Router } from 'express';
import {
  getDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
  analyzeDocument,
  getDocumentChecks,
  getDocumentDeficiencies,
} from '../controllers/documentController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/documents', getDocuments);
router.get('/documents/readiness', getDocuments);
router.post('/documents/upload', uploadDocument);
router.get('/documents/:id', getDocumentById);
router.delete('/documents/:id', deleteDocument);
router.post('/documents/:id/analyze', analyzeDocument);
router.get('/documents/:id/checks', getDocumentChecks);
router.get('/documents/:id/deficiencies', getDocumentDeficiencies);
router.post('/documents/:id/recheck', analyzeDocument);

export default router;
