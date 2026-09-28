import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { AdminInsightService } from '../services/adminInsightService';

const prisma = new PrismaClient();

/**
 * GET /api/admin/dashboard
 * Ministry high-level decision-support dashboard metrics and visual application pipeline.
 */
export const getAdminDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminInsightService.getMinistryDashboardData();
    return res.json({ success: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/ai-insights
 * AI System Insights and Bottleneck Detection.
 */
export const getAIInsights = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminInsightService.getAIBottleneckInsights();
    return res.json({ success: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/districts
 * Geographic India -> State -> District drill-down analytics.
 */
export const getGeographicAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminInsightService.getGeographicInsights();
    return res.json({ success: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/schemes
 * Scheme Performance breakdown for all scholarships & fellowships.
 */
export const getSchemePerformance = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminInsightService.getSchemePerformanceData();
    return res.json({ success: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/disbursement
 * Disbursement & DBT Portal Dashboard analytics.
 */
export const getDisbursementAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const data = await AdminInsightService.getDisbursementData();
    return res.json({ success: true, ...data });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/applications
 * Multi-filter application explorer for Ministry Admins.
 */
export const getAdminApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { stage, search } = req.query;

    const whereClause: any = {};
    if (stage) {
      whereClause.stage = String(stage);
    }
    if (search) {
      whereClause.OR = [
        { applicationIdStr: { contains: String(search) } },
        { user: { name: { contains: String(search) } } },
      ];
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        user: { include: { studentProfile: true } },
        scholarship: true,
        fellowship: true,
        history: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { lastUpdatedAt: 'desc' },
    });

    return res.json({ success: true, count: applications.length, applications });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/admin/audit-logs
 * Comprehensive System Audit Logs Ledger.
 */
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    return res.json({ success: true, count: logs.length, logs });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/admin/schemes
 * Creates a new scholarship scheme.
 */
export const createScheme = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    const scheme = await prisma.scholarship.create({
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        action: 'SCHEME_CREATED',
        performedBy: req.user!.name,
        userRole: 'ADMIN',
        details: `Created new scheme: ${scheme.title} (${scheme.code})`,
      },
    });

    return res.status(201).json({ success: true, message: 'New scheme published', scheme });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
