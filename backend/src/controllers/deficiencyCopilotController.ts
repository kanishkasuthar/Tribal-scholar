import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { DeficiencyRepairService } from '../services/deficiencyRepairService';

export const getDeficiencyCopilotOverview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const deficiencies = await DeficiencyRepairService.getStudentDeficiencies(userId);
    
    const openCount = deficiencies.filter((d) => d.status === 'OPEN' || d.status === 'RECHECKING').length;
    const resolvedCount = deficiencies.filter((d) => d.status === 'RESOLVED').length;

    return res.json({
      success: true,
      openCount,
      resolvedCount,
      deficiencies,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDeficiencyCopilotById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const detail = await DeficiencyRepairService.getDeficiencyById(id);
    return res.json({ success: true, detail });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const recheckDeficiencyCopilot = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { correctedFileName, correctedFileUrl } = req.body;

    const result = await DeficiencyRepairService.recheckDeficiency(id, correctedFileName, correctedFileUrl);
    return res.json({ success: true, result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
