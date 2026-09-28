import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MatchingService } from '../services/matchingService';
import { EligibilityService } from '../services/eligibilityService';

export const getMatchedOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const matches = await MatchingService.calculateMatchesForStudent(userId);
    return res.json({ success: true, count: matches.length, matches });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getExplainableEligibility = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id: scholarshipId } = req.params;
    const report = await EligibilityService.evaluateEligibility(userId, scholarshipId);
    return res.json({ success: true, report });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
