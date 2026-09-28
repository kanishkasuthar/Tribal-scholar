import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { ApplicationWorkflowService } from '../services/applicationWorkflowService';

const prisma = new PrismaClient();

export const getInstituteDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const totalAssigned = await prisma.application.count();
    const pendingVerification = await prisma.application.count({
      where: { stage: 'INSTITUTE_VERIFICATION' },
    });
    const approved = await prisma.application.count({
      where: { stage: { in: ['DEPARTMENT_VERIFICATION', 'APPROVED', 'DISBURSEMENT', 'COMPLETED'] } },
    });
    const returned = await prisma.application.count({
      where: { stage: 'RETURNED_FOR_CORRECTION' },
    });

    const pendingQueue = await prisma.application.findMany({
      where: { stage: 'INSTITUTE_VERIFICATION' },
      include: {
        user: { include: { studentProfile: true } },
        scholarship: true,
        fellowship: true,
        history: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { submittedAt: 'asc' },
    });

    return res.json({
      success: true,
      stats: {
        totalAssigned,
        pendingVerification,
        approved,
        returned,
        avgProcessingTimeDays: 4.2,
      },
      pendingQueue,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyApplicationByOfficer = async (req: AuthRequest, res: Response) => {
  try {
    const { applicationId, action, comments } = req.body; // action: 'APPROVE' | 'RETURN_CORRECTION' | 'VERIFY'

    if (!applicationId || !action) {
      return res.status(400).json({ success: false, message: 'applicationId and action are required' });
    }

    const application = await prisma.application.findFirst({
      where: { OR: [{ id: applicationId }, { applicationIdStr: applicationId }] },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    let updatedApp;
    if (action === 'RETURN_CORRECTION' || action === 'RETURN') {
      updatedApp = await ApplicationWorkflowService.returnApplication(
        application.id,
        req.user!.name,
        comments || 'Document verification discrepancy requires student correction.'
      );
    } else {
      updatedApp = await ApplicationWorkflowService.verifyByInstitute(
        application.id,
        req.user!.name,
        comments || 'Institute verification completed and recommended for central approval.'
      );
    }

    return res.json({
      success: true,
      message: `Application verification process updated via ${action}`,
      application: updatedApp,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
