import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: req.user!.id },
      include: { user: { select: { name: true, email: true, mobile: true, avatarUrl: true } } },
    });
    return res.json({ success: true, profile });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const data = { ...req.body };
    // Strip forbidden fields & relations
    delete data.id;
    delete data.userId;
    delete data.user;
    delete data.role;
    delete data.emailVerified;
    delete data.emailVerifiedAt;
    delete data.createdAt;
    delete data.updatedAt;

    // Convert string numeric inputs to numbers or null if empty
    if (data.familyIncome !== undefined) {
      data.familyIncome = data.familyIncome !== null && data.familyIncome !== '' ? Number(data.familyIncome) : null;
    }
    if (data.academicMarks !== undefined) {
      data.academicMarks = data.academicMarks !== null && data.academicMarks !== '' ? Number(data.academicMarks) : null;
    }
    if (data.currentYear !== undefined) {
      data.currentYear = data.currentYear !== null && data.currentYear !== '' ? Number(data.currentYear) : null;
    }
    if (data.semester !== undefined) {
      data.semester = data.semester !== null && data.semester !== '' ? Number(data.semester) : null;
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId: req.user!.id },
      update: data,
      create: { userId: req.user!.id, ...data },
    });
    return res.json({ success: true, message: 'Profile updated successfully', profile });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getProfileCompletion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    const userDocuments = await prisma.document.findMany({
      where: { userId },
    });

    if (!profile) {
      return res.json({
        success: true,
        completionPercentage: 0,
        isComplete: false,
        sections: [
          { name: 'Personal information', completed: false, missing: ['Profile record missing'] },
          { name: 'Education', completed: false, missing: ['Institution & course details missing'] },
          { name: 'Income information', completed: false, missing: ['Family income missing'] },
          { name: 'ST-related eligibility', completed: false, missing: ['Tribe certificate information missing'] },
          { name: 'Career & Research interests', completed: false, missing: ['Career interests missing'] },
          { name: 'Document information', completed: false, missing: ['Documents missing'] },
        ],
      });
    }

    const sections: Array<{ id: string; name: string; completed: boolean; missing: string[] }> = [];

    // 1. Personal Info
    const personalMissing: string[] = [];
    if (!profile.user?.name) personalMissing.push('Full name');
    if (!profile.dob) personalMissing.push('Date of birth');
    if (!profile.gender) personalMissing.push('Gender');
    if (!profile.state) personalMissing.push('State');
    if (!profile.district) personalMissing.push('District');
    if (!profile.user?.mobile && !profile.user?.email) personalMissing.push('Contact information');

    sections.push({
      id: 'personal',
      name: 'Personal information',
      completed: personalMissing.length === 0,
      missing: personalMissing,
    });

    // 2. Education
    const educationMissing: string[] = [];
    if (!profile.institutionName) educationMissing.push('Institution name');
    if (!profile.courseName) educationMissing.push('Course name');
    if (!profile.degreeLevel) educationMissing.push('Degree level');
    if (!profile.academicMarks) educationMissing.push('CGPA / Academic percentage');

    sections.push({
      id: 'education',
      name: 'Education',
      completed: educationMissing.length === 0,
      missing: educationMissing,
    });

    // 3. Financial Info
    const financialMissing: string[] = [];
    if (!profile.familyIncome || profile.familyIncome <= 0) financialMissing.push('Annual family income');

    sections.push({
      id: 'financial',
      name: 'Income information',
      completed: financialMissing.length === 0,
      missing: financialMissing,
    });

    // 4. ST-related eligibility
    const eligibilityMissing: string[] = [];
    if (!profile.stCategory) eligibilityMissing.push('ST Category info');
    if (!profile.subTribe) eligibilityMissing.push('Sub-Tribe details');

    sections.push({
      id: 'eligibility',
      name: 'ST-related eligibility',
      completed: eligibilityMissing.length === 0,
      missing: eligibilityMissing,
    });

    // 5. Interests
    const interestsMissing: string[] = [];
    if (!profile.careerInterest) interestsMissing.push('Career interests');
    if (!profile.researchInterest) interestsMissing.push('Research interests');

    sections.push({
      id: 'interests',
      name: 'Career & Research interests',
      completed: interestsMissing.length === 0,
      missing: interestsMissing,
    });

    // 6. Documents
    const docsMissing: string[] = [];
    const docTypes = userDocuments.map((d) => d.docType.toLowerCase());
    if (!docTypes.some((t) => t.includes('tribe') || t.includes('caste') || t.includes('st'))) {
      docsMissing.push('ST Caste Certificate');
    }
    if (!docTypes.some((t) => t.includes('income'))) {
      docsMissing.push('Income Certificate');
    }

    sections.push({
      id: 'documents',
      name: 'Document information',
      completed: docsMissing.length === 0,
      missing: docsMissing,
    });

    const completedSectionsCount = sections.filter((s) => s.completed).length;
    const completionPercentage = Math.round((completedSectionsCount / sections.length) * 100);

    return res.json({
      success: true,
      completionPercentage,
      isComplete: completionPercentage >= 85,
      sections,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.applicationTask.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, tasks });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentRenewals = async (req: AuthRequest, res: Response) => {
  try {
    const renewals = await prisma.renewal.findMany({
      where: { userId: req.user!.id },
    });
    return res.json({ success: true, renewals });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAcademicRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: req.user!.id } });
    
    const roadmap = [
      {
        stage: 'Current Education',
        title: profile?.courseName || 'B.Tech Computer Science',
        institution: profile?.institutionName || 'NIT Rourkela',
        year: `Year ${profile?.currentYear || 3} (Semester ${profile?.semester || 5})`,
        status: 'IN_PROGRESS',
      },
      {
        stage: 'Current Active Funding',
        title: 'Top Class Education Scheme for ST Students',
        amount: '₹1,65,000 / year',
        status: 'ACTIVE',
      },
      {
        stage: 'Graduation Horizon (2027)',
        title: 'Postgraduate / Higher Research Preparation',
        action: 'AI recommends preparing GATE / GRE and research publications',
        status: 'UPCOMING',
      },
      {
        stage: 'Future Fellowship Opportunity',
        title: 'National Fellowship for ST Students (M.Phil / Ph.D)',
        stipend: '₹31,000 - ₹35,000 / month + HRA',
        eligibility: 'Potentially Eligible (94% Trajectory Alignment)',
        status: 'FUTURE_TARGET',
      },
      {
        stage: 'International Research Milestone',
        title: 'National Overseas Scholarship for ST Students',
        benefit: '₹15,400 USD / year + Overseas Tuition Grant',
        status: 'FUTURE_TARGET',
      },
    ];

    return res.json({ success: true, roadmap });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

