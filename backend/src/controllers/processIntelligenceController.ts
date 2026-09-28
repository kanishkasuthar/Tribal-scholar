import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ProcessIntelligenceService } from '../services/processIntelligenceService';

/**
 * GET /api/process-intelligence/report (or /api/admin/process-intelligence)
 * Returns complete Process Intelligence Report for Admin decision support.
 */
export const getProcessIntelligenceReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await ProcessIntelligenceService.generateIntelligenceReport();
    return res.json({
      success: true,
      report,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate Process Intelligence Report',
    });
  }
};

/**
 * GET /api/process-intelligence/preventive
 * Returns student-facing preventive intelligence and renewal safeguards.
 */
export const getStudentPreventiveIntelligence = async (req: AuthRequest, res: Response) => {
  try {
    const report = await ProcessIntelligenceService.generateIntelligenceReport();
    return res.json({
      success: true,
      preventiveIntelligence: report.preventiveIntelligence,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch Preventive Intelligence',
    });
  }
};

/**
 * GET /api/process-intelligence/institute
 * Returns institute-level bottleneck alerts & root cause patterns.
 */
export const getInstituteProcessIntelligence = async (req: AuthRequest, res: Response) => {
  try {
    const report = await ProcessIntelligenceService.generateIntelligenceReport();
    return res.json({
      success: true,
      summary: report.summary,
      bottleneckAlerts: report.bottleneckAlerts.filter(
        (b) => b.stage === 'Institute Verification' || b.stage === 'Document Deficiency Resubmission'
      ),
      rootCausePatterns: report.rootCausePatterns,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch Institute Process Intelligence',
    });
  }
};
