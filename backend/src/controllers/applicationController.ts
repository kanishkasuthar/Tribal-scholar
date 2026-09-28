import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ApplicationWorkflowService } from '../services/applicationWorkflowService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/applications
 * Returns all applications for the authenticated student.
 */
export const getUserApplications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        scholarship: true,
        fellowship: true,
        history: { orderBy: { createdAt: 'desc' } },
        tasks: { where: { isCompleted: false } },
      },
      orderBy: { lastUpdatedAt: 'desc' },
    });

    return res.json({ success: true, count: applications.length, applications });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/applications
 * Creates a new application draft for a scholarship or fellowship.
 */
export const createApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { scholarshipId, fellowshipId } = req.body;

    const application = await ApplicationWorkflowService.createApplication(
      userId,
      scholarshipId,
      fellowshipId
    );

    return res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application,
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/applications/:id
 * Fetches application detail and readiness breakdown for preparation page.
 */
export const getApplicationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const application = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationIdStr: id }],
        ...(req.user!.role === 'STUDENT' ? { userId } : {}),
      },
      include: {
        scholarship: true,
        fellowship: true,
        user: { include: { studentProfile: true } },
        history: { orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized access' });
    }

    const readiness = await ApplicationWorkflowService.validateApplicationReadiness(application.id);

    return res.json({
      success: true,
      application,
      readiness,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/applications/:id/submit
 * Runs backend validation and submits the application.
 */
export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify ownership
    const app = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationIdStr: id }],
        userId,
      },
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    const result = await ApplicationWorkflowService.submitApplication(app.id, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/applications/:id/digital-twin
 * Returns complete live Application Digital Twin payload.
 */
export const getDigitalTwin = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const app = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationIdStr: id }],
        ...(req.user!.role === 'STUDENT' ? { userId } : {}),
      },
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const digitalTwin = await ApplicationWorkflowService.getDigitalTwin(app.id);

    return res.json({ success: true, digitalTwin });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/applications/:id/return
 * Institute Officer endpoint to return an application for correction.
 */
export const returnApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    if (req.user!.role !== 'INSTITUTE' && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Officer role required' });
    }

    if (!remarks) {
      return res.status(400).json({ success: false, message: 'Correction remarks are required.' });
    }

    const app = await prisma.application.findFirst({
      where: { OR: [{ id }, { applicationIdStr: id }] },
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const updated = await ApplicationWorkflowService.returnApplication(app.id, req.user!.name, remarks);

    return res.json({
      success: true,
      message: 'Application returned for student correction',
      application: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/applications/:id/resubmit
 * Student submits document correction.
 */
export const resubmitApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { notes } = req.body;

    const app = await prisma.application.findFirst({
      where: {
        OR: [{ id }, { applicationIdStr: id }],
        userId,
      },
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const updated = await ApplicationWorkflowService.resubmitApplication(app.id, userId, notes);

    return res.json({
      success: true,
      message: 'Application resubmitted successfully',
      application: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/applications/:id/status
 * Officer transition endpoint with strict permission enforcement.
 */
export const updateApplicationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { action, remarks } = req.body; // VERIFY, APPROVE, DISBURSE, RETURN
    const role = req.user!.role;

    if (role !== 'INSTITUTE' && role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Only authorized officers can update status' });
    }

    const app = await prisma.application.findFirst({
      where: { OR: [{ id }, { applicationIdStr: id }] },
    });

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    let updated;
    if (action === 'RETURN') {
      updated = await ApplicationWorkflowService.returnApplication(app.id, req.user!.name, remarks || 'Correction requested by officer.');
    } else if (action === 'VERIFY') {
      updated = await ApplicationWorkflowService.verifyByInstitute(app.id, req.user!.name, remarks);
    } else if (action === 'APPROVE') {
      updated = await ApplicationWorkflowService.approveByDepartment(app.id, req.user!.name, remarks);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid transition action' });
    }

    return res.json({
      success: true,
      message: `Application status updated via ${action}`,
      application: updated,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
