import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InsightService {
  static async getMinistryAnalytics() {
    const totalApplications = await prisma.application.count();
    const approved = await prisma.application.count({ where: { stage: 'APPROVED' } });
    const disbursed = await prisma.application.count({ where: { stage: 'DISBURSED' } });
    const pendingInstitute = await prisma.application.count({ where: { stage: 'INSTITUTE_VERIFICATION' } });
    const pendingDepartment = await prisma.application.count({ where: { stage: 'DEPARTMENT_VERIFICATION' } });
    const returned = await prisma.application.count({ where: { stage: 'RETURNED' } });

    const totalScholarships = await prisma.scholarship.count();
    const totalFellowships = await prisma.fellowship.count();

    // AI Bottleneck & Risk System Insights
    const systemInsights = [
      {
        id: '1',
        title: 'Verification Bottleneck Identified',
        level: 'REVIEW_REQUIRED',
        description: 'Institute-level verification represents 64% of total pending workloads nationwide. Average turnaround time is currently 11.4 days (target: 7 days).',
        impactArea: 'Institutional Verification Cell',
        recommendedAction: 'Send automated reminder notifications to Nodal Verification Officers with >15 pending files.',
      },
      {
        id: '2',
        title: 'District Document Deficiency Spike',
        level: 'WARNING',
        description: 'Sundargarh District (Odisha) recorded a 28% increase in ST Certificate name mismatch flags due to recent revenue portal digital name format updates.',
        impactArea: 'District Revenue & Welfare Department',
        recommendedAction: 'Deploy AI Repair Copilot auto-clarification protocol for Tehsil Sundargarh ST certificates.',
      },
      {
        id: '3',
        title: 'Fellowship Application Growth',
        level: 'POSITIVE',
        description: 'National Fellowship for ST PhD Scholars experienced a 42% increase in research submissions from female ST scholars across Central Universities.',
        impactArea: 'Higher Education Research Cell',
        recommendedAction: 'Increase annual fellowship allocation quota for STEM disciplines.',
      },
    ];

    // State & District Distribution Data
    const stateDistribution = [
      { state: 'Odisha', applications: 1240, approved: 890, pending: 280, disbursedAmount: '₹3.8 Cr', deficiencyRate: '6.2%' },
      { state: 'Jharkhand', applications: 1080, approved: 760, pending: 240, disbursedAmount: '₹3.2 Cr', deficiencyRate: '7.1%' },
      { state: 'Chhattisgarh', applications: 950, approved: 680, pending: 210, disbursedAmount: '₹2.9 Cr', deficiencyRate: '5.8%' },
      { state: 'Madhya Pradesh', applications: 1420, approved: 990, pending: 350, disbursedAmount: '₹4.5 Cr', deficiencyRate: '8.4%' },
      { state: 'Assam', applications: 780, approved: 540, pending: 190, disbursedAmount: '₹2.1 Cr', deficiencyRate: '4.9%' },
      { state: 'Rajasthan', applications: 860, approved: 610, pending: 200, disbursedAmount: '₹2.6 Cr', deficiencyRate: '6.5%' },
    ];

    return {
      metrics: {
        totalApplications,
        approved,
        disbursed,
        pendingInstitute,
        pendingDepartment,
        returned,
        totalScholarships,
        totalFellowships,
        totalDisbursedFunds: '₹18.4 Crore',
        avgProcessingTimeDays: 8.5,
      },
      systemInsights,
      stateDistribution,
    };
  }
}
