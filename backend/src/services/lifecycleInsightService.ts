import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class LifecycleInsightService {
  /**
   * Evaluates student's active funding, renewal readiness, and lifecycle stage.
   */
  static async getStudentFundingSummary(userId: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        applications: {
          include: {
            scholarship: true,
            fellowship: true,
            history: { orderBy: { createdAt: 'desc' } },
          },
          orderBy: { submittedAt: 'desc' },
        },
        scholarshipRenewals: {
          include: {
            scholarship: true,
            requirements: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Student user not found');
    }

    // Active Scholarships (Stage APPROVED, DISBURSEMENT, COMPLETED or INSTITUTE_VERIFICATION)
    const activeApplications = user.applications.filter(
      (a) => a.stage === 'APPROVED' || a.stage === 'DISBURSEMENT' || a.stage === 'INSTITUTE_VERIFICATION' || a.stage === 'COMPLETED'
    );

    // Renewals Due
    const activeRenewals = user.scholarshipRenewals.filter((r) => r.status === 'RENEWAL_OPEN' || r.status === 'PREPARATION');

    // Future Opportunities (Scholarships or Fellowships suitable for next academic step)
    const allScholarships = await prisma.scholarship.findMany({ where: { status: 'ACTIVE' } });
    const allFellowships = await prisma.fellowship.findMany({ where: { status: 'ACTIVE' } });

    const currentLevel = profile?.degreeLevel || 'Undergraduate';
    const isDoctorateOrPG = currentLevel === 'Postgraduate' || currentLevel === 'Doctorate';

    const futureOpportunities = [
      ...allScholarships.filter((s) => s.degreeLevel.includes('Postgraduate') || s.degreeLevel.includes('Doctorate')),
      ...allFellowships.map((f) => ({
        id: f.id,
        code: f.code,
        title: f.title,
        type: 'FELLOWSHIP',
        degreeLevel: f.degreeLevel,
        benefitAmount: `${f.monthlyStipend} + ${f.contingencyAmount}`,
        description: f.description,
      })),
    ].slice(0, 4);

    // Natural-language AI Lifecycle Insights based strictly on database records
    const aiInsights: string[] = [];
    if (activeRenewals.length > 0) {
      const ren = activeRenewals[0];
      const missingCount = ren.requirements.filter((rq) => rq.status === 'WARNING' || rq.status === 'PENDING').length;
      aiInsights.push(
        `Your renewal window for ${ren.scholarship?.title || 'Scholarship'} is open. Readiness is at ${ren.readinessPercentage}%. ${missingCount} item(s) require your attention before ${ren.renewalDeadline}.`
      );
    } else {
      aiInsights.push('Your active scholarships are currently up to date. No immediate renewal action is required.');
    }

    if (profile?.researchInterest) {
      aiInsights.push(
        `Based on your research interest in "${profile.researchInterest}", you are well-positioned for upcoming Doctoral and Overseas ST Research Fellowships.`
      );
    }

    return {
      profile,
      activeApplications,
      activeRenewals,
      futureOpportunities,
      aiInsights,
    };
  }

  /**
   * Computes dynamic renewal readiness score and requirements breakdown.
   */
  static async getRenewalDetails(userId: string, renewalId?: string) {
    let renewal;
    if (renewalId) {
      renewal = await prisma.scholarshipRenewal.findFirst({
        where: { id: renewalId, userId },
        include: { scholarship: true, requirements: true, previousApplication: true },
      });
    } else {
      renewal = await prisma.scholarshipRenewal.findFirst({
        where: { userId },
        include: { scholarship: true, requirements: true, previousApplication: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!renewal) {
      return null;
    }

    const passedCount = renewal.requirements.filter((r) => r.status === 'PASSED').length;
    const totalCount = renewal.requirements.length || 1;
    const dynamicReadiness = Math.round((passedCount / totalCount) * 100);

    // Calculate days remaining to deadline
    const deadlineDate = new Date(renewal.renewalDeadline);
    const currentDate = new Date();
    const diffTime = deadlineDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Transparent Attention Level (No black box prediction)
    let attentionLevel = 'GREEN';
    let attentionLabel = '🟢 Ready';
    let attentionReason = 'All renewal criteria and documents are in order.';

    if (daysRemaining < 0) {
      attentionLevel = 'EXPIRED';
      attentionLabel = '🔴 Action Overdue / Deadline Passed';
      attentionReason = 'Renewal deadline has passed. Contact the Ministry Helpline or Institute Nodal Officer for extension guidance.';
    } else if (dynamicReadiness < 80 && daysRemaining <= 30) {
      attentionLevel = 'WARNING';
      attentionLabel = '🟠 Action Required — Deadline Approaching';
      attentionReason = `Renewal deadline is in ${daysRemaining} days. Complete pending documents to reach 100% readiness.`;
    } else if (dynamicReadiness < 100) {
      attentionLevel = 'ATTENTION';
      attentionLabel = '🟡 Documents Needed';
      attentionReason = 'Additional documents are required before submitting your renewal application.';
    }

    return {
      renewal: {
        ...renewal,
        readinessPercentage: dynamicReadiness,
        daysRemaining: Math.max(0, daysRemaining),
        isExpired: daysRemaining < 0,
      },
      attention: {
        level: attentionLevel,
        label: attentionLabel,
        reason: attentionReason,
      },
    };
  }

  /**
   * Generates What-If Scenario simulator output for student roadmap exploration.
   */
  static async simulateRoadmapScenario(userId: string, scenarioPath: string) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    const currentDegree = profile?.degreeLevel || 'Undergraduate';

    let simulatedTargetLevel = 'Postgraduate';
    let pathTitle = 'Master’s Degree & Higher Studies Path';
    let opportunities: any[] = [];

    switch (scenarioPath) {
      case 'POSTGRADUATE':
        simulatedTargetLevel = 'Postgraduate';
        pathTitle = 'Postgraduate Degree Path (M.Tech / M.Sc / MBA)';
        opportunities = await prisma.scholarship.findMany({
          where: { degreeLevel: { contains: 'Postgraduate' } },
        });
        break;
      case 'RESEARCH':
        simulatedTargetLevel = 'Doctorate / M.Phil';
        pathTitle = 'Doctoral Research & Ph.D. Fellowship Path';
        opportunities = await prisma.fellowship.findMany({
          where: { degreeLevel: { contains: 'Doctorate' } },
        });
        break;
      case 'OVERSEAS':
        simulatedTargetLevel = 'Overseas Studies';
        pathTitle = 'National Overseas Global Scholarship Path';
        opportunities = await prisma.scholarship.findMany({
          where: { title: { contains: 'Overseas' } },
        });
        break;
      default:
        simulatedTargetLevel = 'Postgraduate';
        pathTitle = 'Higher Education & Research Path';
        opportunities = await prisma.scholarship.findMany({ take: 3 });
        break;
    }

    return {
      isScenarioExploration: true,
      labelNote: 'Scenario Exploration Mode — This simulation does NOT alter your official student profile.',
      scenarioPath,
      pathTitle,
      simulatedTargetLevel,
      relevantOpportunities: opportunities.map((op: any) => ({
        id: op.id,
        code: op.code,
        title: op.title,
        degreeLevel: op.degreeLevel,
        financialBenefit: op.benefitAmount || op.monthlyStipend,
        requirements: 'Milestone required: Completion of current ' + currentDegree + ' degree',
        preparationAdvice: 'Maintain academic marks ≥ 65% and build strong faculty recommendation letters.',
      })),
    };
  }
}
