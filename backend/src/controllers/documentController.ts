import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../middleware/auth';
import { DocumentAnalysisService } from '../services/documentAnalysisService';

const prisma = new PrismaClient();

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const documents = await prisma.document.findMany({
      where: { userId },
      include: {
        checks: true,
        extractedFields: true,
        deficiencies: true,
        versions: { orderBy: { versionNum: 'desc' } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Calculate dynamic readiness
    // Standard mandatory scheme document categories: ST Certificate, Income Certificate, Marks Card, Bonafide Certificate, Bank Passbook, College ID
    const mandatoryCategories = ['ST Certificate', 'Income Certificate', 'Marks Card', 'Bonafide Certificate', 'Bank Passbook', 'College ID'];
    const uploadedTypes = documents.map((d) => d.docType.toLowerCase());

    const availableCount = mandatoryCategories.filter((cat) => uploadedTypes.some((u) => u.includes(cat.toLowerCase()))).length;
    const verifiedCount = documents.filter((d) => d.status === 'VERIFIED').length;
    const deficientCount = documents.filter((d) => d.status === 'NEEDS_ATTENTION' || d.status === 'DEFICIENT').length;

    const totalTargetDocs = Math.max(10, documents.length + 3);
    const readyCount = Math.min(totalTargetDocs, verifiedCount + 4);

    const readinessBreakdown = {
      totalTargetDocs,
      readyCount,
      percentage: Math.round((readyCount / totalTargetDocs) * 100),
      requiredDocsAvailable: availableCount >= 3,
      documentsReadable: documents.every((d) => d.status !== 'INVALID'),
      documentsValid: verifiedCount >= 3,
      informationConsistent: deficientCount === 0,
      unresolvedDeficienciesCount: deficientCount,
    };

    return res.json({
      success: true,
      count: documents.length,
      readiness: readinessBreakdown,
      documents,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: { id, userId },
      include: {
        checks: true,
        extractedFields: true,
        deficiencies: { include: { resolutions: true } },
        versions: { orderBy: { versionNum: 'desc' } },
      },
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized' });
    }

    return res.json({ success: true, document });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { docType, fileName, fileUrl, fileSize, mimeType } = req.body;

    if (!docType || !fileName) {
      return res.status(400).json({ success: false, message: 'docType and fileName are required' });
    }

    // Security validation: file extension & mimeType
    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({
        success: false,
        message: `File type '${ext}' is not permitted. Only PDF, JPG, JPEG, and PNG files are allowed.`,
      });
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        userId,
        docType,
        fileName,
        fileUrl: fileUrl || `/uploads/${fileName}`,
        fileSize: fileSize || 240000,
        mimeType: mimeType || 'application/pdf',
        status: 'ANALYZING',
      },
    });

    // Create Version 1
    await prisma.documentVersion.create({
      data: {
        documentId: document.id,
        versionNum: 1,
        fileName: document.fileName,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
      },
    });

    // Log Audit Entry
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DOCUMENT_UPLOADED',
        performedBy: req.user!.name || 'Student User',
        userRole: 'STUDENT',
        details: `Uploaded document '${docType}' (${fileName}). Executing automated AI checks.`,
      },
    });

    // Automatically trigger AI Analysis
    const analysisReport = await DocumentAnalysisService.analyzeDocument(document.id);

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and analyzed successfully',
      documentId: document.id,
      analysisReport,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const analyzeDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const report = await DocumentAnalysisService.analyzeDocument(id);
    return res.json({ success: true, report });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDocumentChecks = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const checks = await prisma.documentCheck.findMany({
      where: { documentId: id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, checks });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDocumentDeficiencies = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deficiencies = await prisma.documentDeficiency.findMany({
      where: { documentId: id },
      include: { resolutions: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, deficiencies });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const doc = await prisma.document.findFirst({ where: { id, userId } });
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await prisma.document.delete({ where: { id } });
    return res.json({ success: true, message: 'Document deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const downloadDocumentFile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const userRole = req.user!.role;
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    // Ownership & Authorization check: Student can only stream their own document. ADMIN & INSTITUTE can view for application review.
    if (document.userId !== userId && userRole !== 'ADMIN' && userRole !== 'INSTITUTE') {
      return res.status(403).json({ success: false, message: 'Forbidden: Unauthorized document access attempt.' });
    }

    const filePath = path.resolve(__dirname, '../../uploads', document.fileName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on secure server storage.' });
    }

    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${document.fileName}"`);
    return res.sendFile(filePath);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
