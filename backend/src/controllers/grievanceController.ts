import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getUserGrievances = async (req: AuthRequest, res: Response) => {
  try {
    let whereClause: any = {};
    if (req.user!.role === 'STUDENT') {
      whereClause.userId = req.user!.id;
    }

    const grievances = await prisma.grievance.findMany({
      where: whereClause,
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, count: grievances.length, grievances });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createGrievance = async (req: AuthRequest, res: Response) => {
  try {
    const { category, subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'subject and description are required' });
    }

    const count = await prisma.grievance.count();
    const ticketId = `GRV-2026-${4412 + count + 1}`;

    const initialComments = JSON.stringify([
      {
        author: req.user!.name,
        role: req.user!.role,
        text: description,
        timestamp: new Date().toISOString(),
      },
    ]);

    const grievance = await prisma.grievance.create({
      data: {
        ticketId,
        userId: req.user!.id,
        category: category || 'Document Verification Delay',
        subject,
        description,
        currentAuthority: 'Ministry Helpline Nodal Officer',
        status: 'OPEN',
        commentsJson: initialComments,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Grievance ticket created successfully',
      grievance,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const addGrievanceComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text, newStatus } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'comment text is required' });
    }

    const grievance = await prisma.grievance.findUnique({ where: { id } });
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance ticket not found' });
    }

    const comments = JSON.parse(grievance.commentsJson || '[]');
    comments.push({
      author: req.user!.name,
      role: req.user!.role,
      text,
      timestamp: new Date().toISOString(),
    });

    const updated = await prisma.grievance.update({
      where: { id },
      data: {
        commentsJson: JSON.stringify(comments),
        status: newStatus || grievance.status,
      },
    });

    return res.json({ success: true, message: 'Comment added', grievance: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
