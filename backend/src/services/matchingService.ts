import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MatchedCriterion {
  category: 'ST Category' | 'Academic Score' | 'Course Level' | 'Family Income' | 'State/Institution' | 'Required Documents';
  weight: number;
  earned: number;
  isSatisfied: boolean;
  reason: string;
}

export interface MatchResult {
  scholarshipId: string;
  title: string;
  officialName?: string | null;
  code: string;
  type: string;
  provider: string;
  ministry: string;
  department: string;
  educationLevel: string;
  eligibility: string;
  benefits: string;
  academicYear: string;
  applicationStart?: string | null;
  applicationDeadline: string;
  officialApplicationUrl: string;
  officialGuidelineUrl: string;
  sourceUrl: string;
  lastVerifiedAt: string;
  benefitAmount: string;
  deadline: string;
  description: string;
  matchPercentage: number;
  recommendationCategory: 'HIGH MATCH' | 'POSSIBLE MATCH' | 'LOW MATCH';
  eligibilityStatus: 'Potentially Eligible' | 'Needs Verification' | 'Action Required';
  matchedCriteria: MatchedCriterion[];
  unmetCriteria: string[];
  missingInformation: string[];
  requiredDocs: string[];
  shortReason: string;
}

export class MatchingService {
  static async calculateMatchesForStudent(userId: string): Promise<MatchResult[]> {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('Student profile not found');
    }

    const scholarships = await prisma.scholarship.findMany({
      where: { status: 'ACTIVE' },
    });

    const userDocuments = await prisma.document.findMany({
      where: { userId },
    });

    const uploadedDocTypes = userDocuments.map((d) => d.docType.toLowerCase());

    const matchResults: MatchResult[] = scholarships.map((scheme) => {
      let totalScore = 0;
      const matchedCriteria: MatchedCriterion[] = [];
      const unmetCriteria: string[] = [];
      const missingInformation: string[] = [];

      // 1. ST / Category Requirement (25%)
      const isST = profile.stCategory ? (profile.stCategory.toLowerCase().includes('tribe') || profile.stCategory.toLowerCase().includes('st')) : false;
      if (isST) {
        totalScore += 25;
        matchedCriteria.push({
          category: 'ST Category',
          weight: 25,
          earned: 25,
          isSatisfied: true,
          reason: 'ST Category requirement satisfied',
        });
      } else {
        if (!profile.stCategory) {
          missingInformation.push('ST Category information not provided');
        } else {
          unmetCriteria.push('Category does not explicitly state Scheduled Tribe');
        }
        matchedCriteria.push({
          category: 'ST Category',
          weight: 25,
          earned: 0,
          isSatisfied: false,
          reason: profile.stCategory ? 'Scheduled Tribe status verification pending' : 'ST Category not provided',
        });
      }

      // 2. Academic Requirement (20%)
      if (profile.academicMarks !== null && profile.academicMarks !== undefined) {
        const studentPercentage = profile.academicMarks > 10 ? profile.academicMarks : profile.academicMarks * 9.5;
        if (studentPercentage >= scheme.minMarksPercentage) {
          totalScore += 20;
          matchedCriteria.push({
            category: 'Academic Score',
            weight: 20,
            earned: 20,
            isSatisfied: true,
            reason: `Academic score (${studentPercentage.toFixed(1)}%) meets required threshold of ${scheme.minMarksPercentage}%`,
          });
        } else {
          unmetCriteria.push(`Academic score (${studentPercentage.toFixed(1)}%) is below minimum cutoff of ${scheme.minMarksPercentage}%`);
          matchedCriteria.push({
            category: 'Academic Score',
            weight: 20,
            earned: 5,
            isSatisfied: false,
            reason: `Academic score (${studentPercentage.toFixed(1)}%) falls below cutoff`,
          });
        }
      } else {
        missingInformation.push('Academic score/marks not provided');
        matchedCriteria.push({
          category: 'Academic Score',
          weight: 20,
          earned: 0,
          isSatisfied: false,
          reason: 'Academic marks not provided',
        });
      }

      // 3. Course / Education Level Requirement (20%)
      const studentDegree = profile.educationLevel || profile.degreeLevel || '';
      if (studentDegree) {
        const schemeDegree = scheme.degreeLevel.toLowerCase();
        const degreeMatch = schemeDegree.includes(studentDegree.toLowerCase()) || studentDegree.toLowerCase().includes(schemeDegree) || schemeDegree.includes('undergraduate') || schemeDegree.includes('all');
        
        if (degreeMatch) {
          totalScore += 20;
          matchedCriteria.push({
            category: 'Course Level',
            weight: 20,
            earned: 20,
            isSatisfied: true,
            reason: `Course level (${studentDegree}) matches scheme target degree level`,
          });
        } else {
          unmetCriteria.push(`Degree level (${studentDegree}) differs from scheme target (${scheme.degreeLevel})`);
          matchedCriteria.push({
            category: 'Course Level',
            weight: 20,
            earned: 5,
            isSatisfied: false,
            reason: `Degree level differs from requirement`,
          });
        }
      } else {
        missingInformation.push('Course / Education level not provided');
        matchedCriteria.push({
          category: 'Course Level',
          weight: 20,
          earned: 0,
          isSatisfied: false,
          reason: 'Education level not provided',
        });
      }

      // 4. Family Income Requirement (15%)
      if (profile.familyIncome !== null && profile.familyIncome !== undefined) {
        if (profile.familyIncome <= scheme.maxIncome) {
          totalScore += 15;
          matchedCriteria.push({
            category: 'Family Income',
            weight: 15,
            earned: 15,
            isSatisfied: true,
            reason: `Family income (₹${profile.familyIncome.toLocaleString('en-IN')}) is within eligible limit (₹${scheme.maxIncome.toLocaleString('en-IN')})`,
          });
        } else {
          unmetCriteria.push(`Family annual income exceeds scheme limit of ₹${scheme.maxIncome.toLocaleString('en-IN')}`);
          matchedCriteria.push({
            category: 'Family Income',
            weight: 15,
            earned: 0,
            isSatisfied: false,
            reason: `Income exceeds ceiling of ₹${scheme.maxIncome.toLocaleString('en-IN')}`,
          });
        }
      } else {
        missingInformation.push('Family annual income not provided');
        matchedCriteria.push({
          category: 'Family Income',
          weight: 15,
          earned: 0,
          isSatisfied: false,
          reason: 'Family income not provided',
        });
      }

      // 5. State / Institution Requirement (10%)
      if (profile.state || profile.institutionName || profile.schoolName) {
        totalScore += 10;
        matchedCriteria.push({
          category: 'State/Institution',
          weight: 10,
          earned: 10,
          isSatisfied: true,
          reason: `State (${profile.state || 'N/A'}) and Institution (${profile.institutionName || profile.schoolName || 'N/A'}) details evaluated`,
        });
      } else {
        missingInformation.push('State or Institution profile details incomplete');
        matchedCriteria.push({
          category: 'State/Institution',
          weight: 10,
          earned: 0,
          isSatisfied: false,
          reason: `State/Institution details not provided`,
        });
      }

      // 6. Required Documents (10%)
      const reqDocsList = scheme.requiredDocs.split(',').map((s) => s.trim());
      const missingDocs = reqDocsList.filter((doc) => !uploadedDocTypes.some((u) => u.includes(doc.toLowerCase())));

      if (missingDocs.length === 0) {
        totalScore += 10;
        matchedCriteria.push({
          category: 'Required Documents',
          weight: 10,
          earned: 10,
          isSatisfied: true,
          reason: 'All required document categories are uploaded in Document Center',
        });
      } else {
        missingInformation.push(`Missing document uploads: ${missingDocs.join(', ')}`);
        const partialScore = Math.max(0, 10 - missingDocs.length * 3);
        totalScore += partialScore;
        matchedCriteria.push({
          category: 'Required Documents',
          weight: 10,
          earned: partialScore,
          isSatisfied: false,
          reason: `${missingDocs.length} required document(s) pending verification`,
        });
      }

      const matchPercentage = Math.round(Math.min(98, Math.max(30, totalScore)));

      let recommendationCategory: 'HIGH MATCH' | 'POSSIBLE MATCH' | 'LOW MATCH' = 'HIGH MATCH';
      let eligibilityStatus: 'Potentially Eligible' | 'Needs Verification' | 'Action Required' = 'Potentially Eligible';

      if (matchPercentage >= 80) {
        recommendationCategory = 'HIGH MATCH';
        eligibilityStatus = missingDocs.length > 0 ? 'Needs Verification' : 'Potentially Eligible';
      } else if (matchPercentage >= 55) {
        recommendationCategory = 'POSSIBLE MATCH';
        eligibilityStatus = 'Needs Verification';
      } else {
        recommendationCategory = 'LOW MATCH';
        eligibilityStatus = 'Action Required';
      }

      const shortReason = matchedCriteria.filter(c => c.isSatisfied).slice(0, 2).map(c => c.reason).join(' • ') || 'Potentially eligible scheme';

      return {
        scholarshipId: scheme.id,
        title: scheme.title,
        officialName: scheme.officialName || scheme.title,
        code: scheme.code,
        type: scheme.type,
        provider: scheme.provider,
        ministry: scheme.ministry,
        department: scheme.department,
        educationLevel: scheme.educationLevel,
        eligibility: scheme.eligibility,
        benefits: scheme.benefits,
        academicYear: scheme.academicYear,
        applicationStart: scheme.applicationStart,
        applicationDeadline: scheme.applicationDeadline || scheme.deadline,
        officialApplicationUrl: scheme.officialApplicationUrl,
        officialGuidelineUrl: scheme.officialGuidelineUrl,
        sourceUrl: scheme.sourceUrl,
        lastVerifiedAt: scheme.lastVerifiedAt,
        benefitAmount: scheme.benefitAmount,
        deadline: scheme.deadline,
        description: scheme.description,
        matchPercentage,
        recommendationCategory,
        eligibilityStatus,
        matchedCriteria,
        unmetCriteria,
        missingInformation,
        requiredDocs: reqDocsList,
        shortReason,
      };
    });

    return matchResults.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}

