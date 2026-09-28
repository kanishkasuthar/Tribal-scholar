import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { LifecycleInsightService } from '../services/lifecycleInsightService';

const prisma = new PrismaClient();

/**
 * GET /api/student/funding
 * Retrieves student active funding journey overview.
 */
export const getStudentFunding = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const fundingData = await LifecycleInsightService.getStudentFundingSummary(userId);
    return res.json({ success: true, ...fundingData });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/funding/history
 * Tabular funding history and chronological timeline.
 */
export const getFundingHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const applications = await prisma.application.findMany({
      where: { userId },
      include: { scholarship: true, fellowship: true, history: { orderBy: { createdAt: 'desc' } } },
      orderBy: { submittedAt: 'desc' },
    });

    const timeline = applications.map((app) => ({
      id: app.id,
      applicationIdStr: app.applicationIdStr,
      title: app.scholarship?.title || app.fellowship?.title || 'Scholarship Scheme',
      year: app.submittedAt ? new Date(app.submittedAt).getFullYear() : 2026,
      stage: app.stage,
      overallStatus: app.overallStatus,
      totalAmount: app.totalAmount,
      isDemoData: true,
    }));

    return res.json({ success: true, count: timeline.length, history: timeline });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/renewals
 * Dynamic renewal readiness score and requirements checklist.
 */
export const getStudentRenewals = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const renewalDetails = await LifecycleInsightService.getRenewalDetails(userId);
    return res.json({ success: true, ...renewalDetails });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/renewals/:id
 * Renewal application details for submission.
 */
export const getRenewalById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const renewalDetails = await LifecycleInsightService.getRenewalDetails(userId, id);
    if (!renewalDetails) {
      return res.status(404).json({ success: false, message: 'Renewal record not found' });
    }
    return res.json({ success: true, ...renewalDetails });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/student/renewals/:id/submit
 * Submits the scholarship renewal application.
 */
export const submitRenewalApplication = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { comments } = req.body;

    const renewal = await prisma.scholarshipRenewal.findFirst({
      where: { id, userId },
      include: { scholarship: true },
    });

    if (!renewal) {
      return res.status(404).json({ success: false, message: 'Renewal record not found' });
    }

    const updatedRenewal = await prisma.scholarshipRenewal.update({
      where: { id },
      data: {
        status: 'SUBMITTED',
        submittedAt: new Date(),
        readinessPercentage: 100,
      },
    });

    // Mark renewal requirements as PASSED
    await prisma.renewalRequirement.updateMany({
      where: { renewalId: id },
      data: { status: 'PASSED' },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId,
        type: 'renewal',
        title: `Renewal Submitted: ${renewal.scholarship?.title}`,
        message: 'Your scholarship renewal application has been submitted and forwarded for institute verification.',
      },
    });

    // Log Audit Trail
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'RENEWAL_SUBMITTED',
        performedBy: req.user!.name,
        userRole: 'STUDENT',
        details: `Submitted renewal application for ${renewal.scholarship?.title}. Comments: ${comments || 'None'}`,
      },
    });

    return res.json({
      success: true,
      message: 'Renewal application submitted successfully!',
      renewal: updatedRenewal,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/progress
 * Academic progress record and renewal criteria comparison.
 */
export const getStudentProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let progress = await prisma.studentProgress.findFirst({ where: { userId } });

    if (!progress) {
      progress = await prisma.studentProgress.create({
        data: {
          userId,
          academicYear: '2025-26',
          semester: 5,
          cgpaOrPercentage: 8.6,
          previousCgpa: 8.4,
          completedSemesters: 4,
          achievementsJson: JSON.stringify(['Dean’s Merit List 2025', 'Smart India Hackathon Winner 2025']),
        },
      });
    }

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });

    // Neutral academic threshold check
    const minRenewalThreshold = 60.0; // percentage equivalent or 6.0 CGPA
    const isAboveThreshold = (progress.cgpaOrPercentage * 10) >= minRenewalThreshold;

    return res.json({
      success: true,
      progress: {
        ...progress,
        achievements: JSON.parse(progress.achievementsJson || '[]'),
      },
      profile,
      renewalThresholdCheck: {
        requiredPercentage: `${minRenewalThreshold}%`,
        studentCurrentScore: `${progress.cgpaOrPercentage * 10}% (${progress.cgpaOrPercentage} CGPA)`,
        isAboveThreshold,
        statusLabel: isAboveThreshold ? '✓ Currently above stated renewal threshold' : '⚠ Below renewal requirement threshold',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/student/progress
 * Updates academic progress record.
 */
export const updateStudentProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { semester, cgpaOrPercentage, achievements } = req.body;

    const progress = await prisma.studentProgress.upsert({
      where: { id: req.body.id || 'new-id' },
      update: {
        semester: Number(semester),
        cgpaOrPercentage: Number(cgpaOrPercentage),
        achievementsJson: JSON.stringify(achievements || []),
      },
      create: {
        userId,
        semester: Number(semester),
        cgpaOrPercentage: Number(cgpaOrPercentage),
        achievementsJson: JSON.stringify(achievements || []),
      },
    });

    return res.json({ success: true, message: 'Academic progress updated', progress });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/roadmap
 * Visual academic funding roadmap and future opportunities.
 */
export const getStudentRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    const researchInt = await prisma.researchInterest.findFirst({ where: { userId } });

    const scholarships = await prisma.scholarship.findMany({ where: { status: 'ACTIVE' } });
    const fellowships = await prisma.fellowship.findMany({ where: { status: 'ACTIVE' } });

    const milestoneFlow = [
      { step: 1, title: 'CURRENT EDUCATION', subtitle: `${profile?.degreeLevel || 'Undergraduate'} — ${profile?.courseName || 'B.Tech'}` },
      { step: 2, title: 'ACTIVE SCHOLARSHIP', subtitle: profile?.scholarshipHistory || 'Top Class Education Scheme' },
      { step: 3, title: 'GRADUATION MILESTONE', subtitle: 'Target Completion: June 2027' },
      { step: 4, title: 'POSTGRADUATE / RESEARCH', subtitle: 'M.Tech / Ph.D. Research Entry' },
      { step: 5, title: 'FELLOWSHIP OPPORTUNITY', subtitle: 'National Fellowship for ST Scholars' },
    ];

    const currentOpportunities = scholarships.filter((s) => s.degreeLevel === profile?.degreeLevel);
    const futureOpportunities = [
      ...scholarships.filter((s) => s.degreeLevel === 'Postgraduate' || s.degreeLevel === 'Doctorate'),
      ...fellowships,
    ];

    return res.json({
      success: true,
      profile,
      researchInterest: researchInt,
      milestoneFlow,
      currentOpportunities,
      futureOpportunities,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/student/roadmap/scenario
 * Runs What-If scenario simulation without mutating profile.
 */
export const simulateRoadmapScenario = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { scenarioPath } = req.body;
    const result = await LifecycleInsightService.simulateRoadmapScenario(userId, scenarioPath);
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/student/research-interests
 * Retrieves student research interests.
 */
export const getResearchInterests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let research = await prisma.researchInterest.findFirst({ where: { userId } });

    if (!research) {
      research = await prisma.researchInterest.create({
        data: {
          userId,
          domain: 'Computer Science & AI',
          interest: 'Artificial Intelligence for Tribal Language Preservation & Land Records',
          keywordsJson: JSON.stringify(['AI', 'NLP', 'Indigenous Knowledge', 'Tribal Governance']),
        },
      });
    }

    return res.json({
      success: true,
      researchInterest: {
        ...research,
        keywords: JSON.parse(research.keywordsJson || '[]'),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/student/research-interests
 * Updates research interests explicitly provided by student.
 */
export const updateResearchInterests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { domain, interest, keywords } = req.body;

    const research = await prisma.researchInterest.upsert({
      where: { id: req.body.id || 'new-id' },
      update: {
        domain,
        interest,
        keywordsJson: JSON.stringify(keywords || []),
      },
      create: {
        userId,
        domain,
        interest,
        keywordsJson: JSON.stringify(keywords || []),
      },
    });

    return res.json({
      success: true,
      message: 'Research interests updated successfully',
      researchInterest: {
        ...research,
        keywords: JSON.parse(research.keywordsJson || '[]'),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
