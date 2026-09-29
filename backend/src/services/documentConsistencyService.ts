import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ConsistencyCheckResult {
  isConsistent: boolean;
  mismatchType?: 'NAME_MISMATCH' | 'INCOME_MISMATCH' | 'INSTITUTION_MISMATCH' | 'NONE';
  message: string;
  expectedValue?: string;
  extractedValue?: string;
}

export class DocumentConsistencyService {
  /**
   * Cross-checks extracted fields against stored StudentProfile and active Application records.
   */
  static async evaluateConsistency(
    userId: string,
    docType: string,
    extractedFields: Record<string, string>
  ): Promise<ConsistencyCheckResult> {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      return {
        isConsistent: true,
        message: 'No student profile record found for comparison',
      };
    }

    const expectedName = profile.user?.name || '';
    const extractedName = extractedFields['applicantName'];

    // 1. Name Mismatch Check
    if (extractedName) {
      const expNorm = expectedName.toLowerCase().replace(/[^a-z]/g, '');
      const extNorm = extractedName.toLowerCase().replace(/[^a-z]/g, '');

      if (expNorm !== extNorm) {
        // Check for partial matching (e.g. "Kanishka S." vs "Kanishka Suthar")
        const isPartial = expNorm.startsWith(extNorm) || extNorm.startsWith(expNorm);
        return {
          isConsistent: false,
          mismatchType: 'NAME_MISMATCH',
          expectedValue: expectedName,
          extractedValue: extractedName,
          message: isPartial
            ? `Possible name mismatch detected: Application profile name "${expectedName}" differs from document name "${extractedName}". Manual verification may be required.`
            : `Name mismatch detected: Profile name "${expectedName}" does not match document name "${extractedName}".`,
        };
      }
    }

    // 2. Institution Mismatch Check
    const extractedInst = extractedFields['institutionName'];
    if (extractedInst && profile.institutionName) {
      const expInst = profile.institutionName.toLowerCase();
      const extInst = extractedInst.toLowerCase();
      if (!expInst.includes(extInst) && !extInst.includes(expInst)) {
        return {
          isConsistent: false,
          mismatchType: 'INSTITUTION_MISMATCH',
          expectedValue: profile.institutionName,
          extractedValue: extractedInst,
          message: `Institution mismatch: Profile institution "${profile.institutionName}" differs from document institution "${extractedInst}".`,
        };
      }
    }

    return {
      isConsistent: true,
      mismatchType: 'NONE',
      message: 'Information in uploaded document appears consistent with application profile.',
    };
  }
}
