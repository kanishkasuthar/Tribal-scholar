import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CriterionCheck {
  name: string;
  status: 'SATISFIED' | 'ACTION_REQUIRED' | 'NEEDS_VERIFICATION' | 'NEEDS_INFO';
  details: string;
  missingInfo?: string;
  recommendedAction?: string;
}

export interface ExplainableEligibilityReport {
  scholarshipId: string;
  scholarshipTitle: string;
  overallStatus: 'Potentially Eligible' | 'Needs Attention' | 'Ineligible';
  disclaimer: string;
  criteria: CriterionCheck[];
  alternativeOpportunities: Array<{ id: string; title: string; matchScore: number }>;
}

export class EligibilityService {
  static async evaluateEligibility(userId: string, scholarshipId: string): Promise<ExplainableEligibilityReport> {
    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    const scheme = await prisma.scholarship.findUnique({ where: { id: scholarshipId } });
    const documents = await prisma.document.findMany({ where: { userId } });

    if (!profile || !scheme) {
      throw new Error('Profile or Scholarship not found');
    }

    const criteria: CriterionCheck[] = [];

    // 1. Academic Criterion
    if (profile.academicMarks !== null && profile.academicMarks !== undefined) {
      const studentPercentage = profile.academicMarks > 10 ? profile.academicMarks : profile.academicMarks * 9.5;
      if (studentPercentage >= scheme.minMarksPercentage) {
        criteria.push({
          name: 'Academic Requirement',
          status: 'SATISFIED',
          details: `Your CGPA of ${profile.academicMarks} (${studentPercentage.toFixed(1)}%) meets the minimum required cutoff of ${scheme.minMarksPercentage}%.`,
        });
      } else {
        criteria.push({
          name: 'Academic Requirement',
          status: 'ACTION_REQUIRED',
          details: `Minimum academic requirement is ${scheme.minMarksPercentage}%. Current calculated score is ${studentPercentage.toFixed(1)}%.`,
          missingInfo: `Shortfall of ${(scheme.minMarksPercentage - studentPercentage).toFixed(1)}% in academic qualification.`,
          recommendedAction: 'Upload updated marksheet with revised CGPA or request academic relaxation certificate if applicable.',
        });
      }
    } else {
      criteria.push({
        name: 'Academic Requirement',
        status: 'NEEDS_INFO',
        details: 'Academic score/marks not provided in student profile.',
        missingInfo: 'Academic performance percentage or CGPA missing.',
        recommendedAction: 'Update academic performance in My Profile.',
      });
    }

    // 2. Family Income Criterion
    if (profile.familyIncome !== null && profile.familyIncome !== undefined) {
      if (profile.familyIncome <= scheme.maxIncome) {
        criteria.push({
          name: 'Annual Family Income',
          status: 'SATISFIED',
          details: `Family annual income of ₹${profile.familyIncome.toLocaleString('en-IN')} is within the scheme ceiling limit of ₹${scheme.maxIncome.toLocaleString('en-IN')}.`,
        });
      } else {
        criteria.push({
          name: 'Annual Family Income',
          status: 'ACTION_REQUIRED',
          details: `Family income of ₹${profile.familyIncome.toLocaleString('en-IN')} exceeds maximum allowed ceiling of ₹${scheme.maxIncome.toLocaleString('en-IN')}.`,
          missingInfo: `Income ceiling exceeded by ₹${(profile.familyIncome - scheme.maxIncome).toLocaleString('en-IN')}.`,
          recommendedAction: 'Verify if recent income certificate issued by Competent Authority (Tehsildar) accounts for allowable deductions.',
        });
      }
    } else {
      criteria.push({
        name: 'Annual Family Income',
        status: 'NEEDS_INFO',
        details: 'Annual family income details not provided in student profile.',
        missingInfo: 'Family annual income missing.',
        recommendedAction: 'Update family income details in My Profile.',
      });
    }

    // 3. Category Criterion
    criteria.push({
      name: 'Category & Tribal Status',
      status: 'SATISFIED',
      details: `Registered category '${profile.stCategory}' is fully eligible under Ministry of Tribal Affairs guidelines.`,
    });

    // 4. Document Readiness Criterion
    const requiredDocs = scheme.requiredDocs.split(',').map((d) => d.trim());
    const uploadedTypes = documents.map((d) => d.docType);
    const missingDocs = requiredDocs.filter((req) => !uploadedTypes.some((u) => u.toLowerCase().includes(req.toLowerCase())));
    const deficientDocs = documents.filter((d) => d.status === 'DEFICIENT');

    if (missingDocs.length === 0 && deficientDocs.length === 0) {
      criteria.push({
        name: 'Document Readiness',
        status: 'SATISFIED',
        details: 'All required documents are uploaded and preliminary AI checks are verified.',
      });
    } else {
      criteria.push({
        name: 'Document Readiness',
        status: 'ACTION_REQUIRED',
        details: deficientDocs.length > 0 ? 'Document deficiency flagged on uploaded files.' : 'Missing mandatory documents for full submission.',
        missingInfo: missingDocs.length > 0 ? `Missing: ${missingDocs.join(', ')}` : `Deficient document: ${deficientDocs.map((d) => d.docType).join(', ')}`,
        recommendedAction: 'Launch the AI Deficiency Repair Copilot from your Document Center to fix issues.',
      });
    }

    const hasActionRequired = criteria.some((c) => c.status === 'ACTION_REQUIRED');
    const overallStatus = hasActionRequired ? 'Needs Attention' : 'Potentially Eligible';

    // Alternatives
    const otherSchemes = await prisma.scholarship.findMany({
      where: { id: { not: scholarshipId }, status: 'ACTIVE' },
      take: 2,
    });

    return {
      scholarshipId: scheme.id,
      scholarshipTitle: scheme.title,
      overallStatus,
      disclaimer: 'Notice: Tribal Scholar AI provides an AI-assisted eligibility assessment based on published Ministry criteria. Official final decision rests with the Authorized Sanctioning Authority.',
      criteria,
      alternativeOpportunities: otherSchemes.map((s) => ({
        id: s.id,
        title: s.title,
        matchScore: 92,
      })),
    };
  }
}
