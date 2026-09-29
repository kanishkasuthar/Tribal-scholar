import { PrismaClient } from '@prisma/client';
import { DocumentAnalysisService } from './documentAnalysisService';

const prisma = new PrismaClient();

export interface DeficiencyDetail {
  id: string;
  documentId: string;
  docType: string;
  fileName: string;
  fileUrl: string;
  type: string;
  severity: string;
  description: string;
  resolutionGuidance: string;
  status: 'OPEN' | 'RECHECKING' | 'RESOLVED';
  createdAt: Date;
  sideBySideComparison: {
    applicationName: string;
    documentName: string;
    applicationInstitution: string;
    documentInstitution?: string;
    applicationIncome: number | string;
    documentIncome?: string;
  };
}

export class DeficiencyRepairService {
  /**
   * Retrieves all document deficiencies for a student.
   */
  static async getStudentDeficiencies(userId: string) {
    const userDocs = await prisma.document.findMany({
      where: { userId },
      select: { id: true },
    });

    const docIds = userDocs.map((d) => d.id);

    const deficiencies = await prisma.documentDeficiency.findMany({
      where: { documentId: { in: docIds } },
      include: {
        document: true,
        resolutions: { orderBy: { resolvedAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return deficiencies;
  }

  /**
   * Retrieves details for a specific deficiency including side-by-side comparison data.
   */
  static async getDeficiencyById(deficiencyId: string): Promise<DeficiencyDetail> {
    const deficiency = await prisma.documentDeficiency.findUnique({
      where: { id: deficiencyId },
      include: {
        document: {
          include: {
            extractedFields: true,
            user: { include: { studentProfile: true } },
          },
        },
      },
    });

    if (!deficiency) {
      throw new Error('Deficiency record not found');
    }

    const doc = deficiency.document;
    const profile = doc.user.studentProfile;
    const fieldsMap: Record<string, string> = {};
    doc.extractedFields.forEach((f) => {
      fieldsMap[f.fieldName] = f.extractedValue;
    });

    return {
      id: deficiency.id,
      documentId: doc.id,
      docType: doc.docType,
      fileName: doc.fileName,
      fileUrl: doc.fileUrl,
      type: deficiency.type,
      severity: deficiency.severity,
      description: deficiency.description,
      resolutionGuidance: deficiency.resolutionGuidance,
      status: deficiency.status as any,
      createdAt: deficiency.createdAt,
      sideBySideComparison: {
        applicationName: doc.user?.name || 'Applicant',
        documentName: fieldsMap['applicantName'] || (doc.user?.name ? `${doc.user.name}` : 'Document Record'),
        applicationInstitution: profile?.institutionName || profile?.schoolName || 'Not provided',
        documentInstitution: fieldsMap['institutionName'] || 'Not provided',
        applicationIncome: profile?.familyIncome !== null && profile?.familyIncome !== undefined ? `₹${Number(profile.familyIncome).toLocaleString('en-IN')}` : 'Not provided',
        documentIncome: fieldsMap['incomeAmount'] ? `₹${Number(fieldsMap['incomeAmount']).toLocaleString('en-IN')}` : 'Not provided',
      },
    };
  }

  /**
   * Rechecks a deficiency after re-uploading a corrected document version.
   */
  static async recheckDeficiency(
    deficiencyId: string,
    correctedFileName?: string,
    correctedFileUrl?: string
  ) {
    const deficiency = await prisma.documentDeficiency.findUnique({
      where: { id: deficiencyId },
      include: { document: true },
    });

    if (!deficiency) {
      throw new Error('Deficiency record not found');
    }

    const doc = deficiency.document;

    // If a new corrected file was uploaded, create a DocumentVersion
    if (correctedFileName && correctedFileUrl) {
      const currentVersionCount = await prisma.documentVersion.count({
        where: { documentId: doc.id },
      });

      await prisma.documentVersion.create({
        data: {
          documentId: doc.id,
          versionNum: currentVersionCount + 1,
          fileName: correctedFileName,
          fileUrl: correctedFileUrl,
          fileSize: 350000,
          mimeType: 'application/pdf',
        },
      });

      // Update current document file attributes
      await prisma.document.update({
        where: { id: doc.id },
        data: {
          fileName: correctedFileName,
          fileUrl: correctedFileUrl,
          status: 'ANALYZING',
        },
      });
    }

    // Run AI Document Analysis on the updated document
    const analysisReport = await DocumentAnalysisService.analyzeDocument(doc.id);

    // Check if the deficiency is now resolved
    const stillHasThisDeficiency = analysisReport.deficiencies.some(
      (d) => d.type === deficiency.type
    );

    if (!stillHasThisDeficiency) {
      // Re-create or find resolved deficiency record for audit tracking
      let resolvedDefRecord = await prisma.documentDeficiency.findUnique({
        where: { id: deficiencyId },
      });

      if (!resolvedDefRecord) {
        resolvedDefRecord = await prisma.documentDeficiency.create({
          data: {
            id: deficiencyId,
            documentId: doc.id,
            type: deficiency.type,
            severity: deficiency.severity,
            description: deficiency.description,
            resolutionGuidance: deficiency.resolutionGuidance,
            status: 'RESOLVED',
          },
        });
      } else {
        resolvedDefRecord = await prisma.documentDeficiency.update({
          where: { id: deficiencyId },
          data: { status: 'RESOLVED' },
        });
      }

      // Create DeficiencyResolution Audit Record
      await prisma.deficiencyResolution.create({
        data: {
          deficiencyId: resolvedDefRecord.id,
          previousDocumentId: doc.id,
          correctedDocumentId: doc.id,
          resolutionStatus: 'RESOLVED',
          actionTaken: `Corrected document (${correctedFileName || doc.fileName}) rechecked and verified consistent by AI Engine.`,
        },
      });

      // Log in AuditLog
      await prisma.auditLog.create({
        data: {
          userId: doc.userId,
          action: 'DEFICIENCY_RESOLVED',
          performedBy: 'System AI Engine',
          userRole: 'SYSTEM',
          details: `Resolved deficiency '${deficiency.type}' for document '${doc.docType}'. Name/field consistency verified.`,
        },
      });

      return {
        success: true,
        isResolved: true,
        message: 'The corrected document is now consistent with the information available in your application.',
        previousIssue: deficiency.description,
        currentResult: 'No mismatch detected. Document verified.',
        analysisReport,
      };
    } else {
      return {
        success: true,
        isResolved: false,
        message: 'The issue still requires attention. Additional verification or corrected document upload is needed.',
        analysisReport,
      };
    }
  }
}
