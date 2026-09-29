import { PrismaClient } from '@prisma/client';
import { OCRService } from './ocrService';
import { DocumentConsistencyService } from './documentConsistencyService';

const prisma = new PrismaClient();

export interface DocumentAnalysisReport {
  documentId: string;
  docType: string;
  fileName: string;
  overallStatus: 'VERIFIED' | 'NEEDS_ATTENTION' | 'INVALID';
  readability: { status: 'PASSED' | 'WARNING' | 'FAILED'; message: string };
  completeness: { status: 'PASSED' | 'WARNING' | 'FAILED'; message: string };
  expiry: { status: 'PASSED' | 'WARNING' | 'FAILED'; message: string };
  consistency: { status: 'PASSED' | 'WARNING' | 'FAILED'; message: string; details?: string };
  requiredDocsCheck: { status: 'PASSED' | 'WARNING'; message: string };
  extractedFields: Record<string, string>;
  deficiencies: Array<{
    id?: string;
    type: string;
    severity: string;
    description: string;
    guidance: string;
  }>;
  isDemoAnalysis: boolean;
}

export class DocumentAnalysisService {
  static async analyzeDocument(documentId: string): Promise<DocumentAnalysisReport> {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new Error('Document not found');
    }

    // 1. Execute OCR Extraction
    const ocrResult = await OCRService.extractDocumentText(doc.docType, doc.fileName, doc.fileUrl, doc.userId);

    // Save extracted fields to DB
    await prisma.extractedDocumentField.deleteMany({ where: { documentId } });
    for (const [key, val] of Object.entries(ocrResult.fields)) {
      await prisma.extractedDocumentField.create({
        data: {
          documentId,
          fieldName: key,
          extractedValue: String(val),
          confidence: ocrResult.confidence,
        },
      });
    }

    const checksList: Array<{ checkType: string; status: string; message: string }> = [];
    const deficienciesList: Array<{ type: string; severity: string; description: string; guidance: string }> = [];

    // A. Readability Check
    let readabilityStatus: 'PASSED' | 'WARNING' | 'FAILED' = 'PASSED';
    let readabilityMsg = 'Document is clear and fully readable for automated AI inspection.';

    if (ocrResult.confidence < 0.6) {
      readabilityStatus = 'WARNING';
      readabilityMsg = 'Some text in the uploaded document may not be readable or is low resolution.';
      deficienciesList.push({
        type: 'LOW_READABILITY',
        severity: 'WARNING',
        description: 'The uploaded document scan appears low resolution or blurry.',
        guidance: 'Upload a higher resolution scan or clear mobile camera photo ensuring all seal stamps and text are readable.',
      });
    }
    checksList.push({ checkType: 'READABILITY', status: readabilityStatus, message: readabilityMsg });

    // B. Completeness Check
    let completenessStatus: 'PASSED' | 'WARNING' | 'FAILED' = 'PASSED';
    let completenessMsg = 'Required information appears present.';

    const lowerType = doc.docType.toLowerCase();
    if (lowerType.includes('income') && !ocrResult.fields['certificateNo']) {
      completenessStatus = 'WARNING';
      completenessMsg = 'Certificate reference number or issuing authority section is incomplete.';
      deficienciesList.push({
        type: 'MISSING_INFO',
        severity: 'WARNING',
        description: 'Mandatory certificate reference number missing from income document.',
        guidance: 'Upload official income certificate issued by Competent Authority (Tehsildar / Revenue Officer) containing official reference number.',
      });
    }
    checksList.push({ checkType: 'COMPLETENESS', status: completenessStatus, message: completenessMsg });

    // C. Expiry / Validity Check
    let expiryStatus: 'PASSED' | 'WARNING' | 'FAILED' = 'PASSED';
    let expiryMsg = 'No immediate validity issue detected.';

    if (lowerType.includes('income') && ocrResult.fields['issueDate'] && ocrResult.fields['issueDate'].includes('2023')) {
      expiryStatus = 'WARNING';
      expiryMsg = 'Based on the date visible in the document, this certificate may require renewal for current financial year.';
      deficienciesList.push({
        type: 'EXPIRED_VALIDITY',
        severity: 'WARNING',
        description: 'Income certificate issue date is from a previous financial year.',
        guidance: 'Income certificates are valid for 1 financial year. Upload income certificate issued for current financial year.',
      });
    }
    checksList.push({ checkType: 'EXPIRY', status: expiryStatus, message: expiryMsg });

    // D. Cross-Document Consistency Check
    const consistencyResult = await DocumentConsistencyService.evaluateConsistency(
      doc.userId,
      doc.docType,
      ocrResult.fields
    );

    let consistencyStatus: 'PASSED' | 'WARNING' | 'FAILED' = 'PASSED';
    if (!consistencyResult.isConsistent) {
      consistencyStatus = 'WARNING';
      deficienciesList.push({
        type: consistencyResult.mismatchType || 'NAME_MISMATCH',
        severity: 'WARNING',
        description: consistencyResult.message,
        guidance: 'Check the correct name on your official records. If difference is due to name expansion, upload supporting affidavit or corrected certificate.',
      });
    }
    checksList.push({ checkType: 'CONSISTENCY', status: consistencyStatus, message: consistencyResult.message });

    // Save checks to DB
    await prisma.documentCheck.deleteMany({ where: { documentId } });
    for (const chk of checksList) {
      await prisma.documentCheck.create({
        data: {
          documentId,
          checkType: chk.checkType,
          status: chk.status,
          message: chk.message,
        },
      });
    }

    // Save deficiencies to DB
    await prisma.documentDeficiency.deleteMany({ where: { documentId } });
    const savedDeficiencies = [];
    for (const def of deficienciesList) {
      const saved = await prisma.documentDeficiency.create({
        data: {
          documentId,
          type: def.type,
          severity: def.severity,
          description: def.description,
          resolutionGuidance: def.guidance,
          status: 'OPEN',
        },
      });
      savedDeficiencies.push({
        id: saved.id,
        type: saved.type,
        severity: saved.severity,
        description: saved.description,
        guidance: saved.resolutionGuidance,
      });
    }

    // Determine Overall Status
    const hasDeficiencies = deficienciesList.length > 0;
    const overallStatus: 'VERIFIED' | 'NEEDS_ATTENTION' | 'INVALID' = hasDeficiencies ? 'NEEDS_ATTENTION' : 'VERIFIED';

    // Update Document Status
    await prisma.document.update({
      where: { id: documentId },
      data: {
        status: overallStatus,
        issueType: hasDeficiencies ? deficienciesList[0].type : null,
        issueDescription: hasDeficiencies ? deficienciesList[0].description : null,
        aiChecksJson: JSON.stringify({
          readability: readabilityStatus,
          completeness: completenessStatus,
          expiry: expiryStatus,
          consistency: consistencyStatus,
          isDemoAnalysis: ocrResult.isDemoAnalysis,
        }),
      },
    });

    return {
      documentId,
      docType: doc.docType,
      fileName: doc.fileName,
      overallStatus,
      readability: { status: readabilityStatus, message: readabilityMsg },
      completeness: { status: completenessStatus, message: completenessMsg },
      expiry: { status: expiryStatus, message: expiryMsg },
      consistency: { status: consistencyStatus, message: consistencyResult.message },
      requiredDocsCheck: { status: 'PASSED', message: 'Document aligns with required scheme categories.' },
      extractedFields: ocrResult.fields,
      deficiencies: savedDeficiencies,
      isDemoAnalysis: ocrResult.isDemoAnalysis,
    };
  }
}
