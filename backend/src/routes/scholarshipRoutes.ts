import { Router } from 'express';
import { getAllScholarships, getScholarshipById, getAllFellowships, getFellowshipById } from '../controllers/scholarshipController';

const router = Router();

router.get('/scholarships', getAllScholarships);
router.get('/scholarships/:id', getScholarshipById);
router.get('/fellowships', getAllFellowships);
router.get('/fellowships/:id', getFellowshipById);

export default router;
