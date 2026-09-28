import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllScholarships = async (req: Request, res: Response) => {
  try {
    const { search, degreeLevel, maxIncome, category } = req.query;

    let whereClause: any = { status: 'ACTIVE' };

    if (search) {
      whereClause.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { provider: { contains: String(search) } },
        { requiredDocs: { contains: String(search) } },
      ];
    }

    if (degreeLevel && degreeLevel !== 'ALL') {
      whereClause.degreeLevel = { contains: String(degreeLevel) };
    }

    const scholarships = await prisma.scholarship.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: scholarships.length, scholarships });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getScholarshipById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scholarship = await prisma.scholarship.findUnique({ where: { id } });

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship scheme not found' });
    }

    return res.json({ success: true, scholarship });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllFellowships = async (req: Request, res: Response) => {
  try {
    const { search, academicLevel, researchArea, institutionType, state, eligibility } = req.query;

    let whereClause: any = { status: 'ACTIVE' };

    if (search) {
      whereClause.OR = [
        { title: { contains: String(search) } },
        { description: { contains: String(search) } },
        { field: { contains: String(search) } },
        { eligibilityCriteria: { contains: String(search) } },
      ];
    }

    if (academicLevel && academicLevel !== 'ALL') {
      whereClause.degreeLevel = { contains: String(academicLevel) };
    }

    if (researchArea && researchArea !== 'ALL') {
      whereClause.field = { contains: String(researchArea) };
    }

    const fellowships = await prisma.fellowship.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, count: fellowships.length, fellowships });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFellowshipById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fellowship = await prisma.fellowship.findUnique({ where: { id } });

    if (!fellowship) {
      return res.status(404).json({ success: false, message: 'Fellowship scheme not found' });
    }

    return res.json({ success: true, fellowship });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
