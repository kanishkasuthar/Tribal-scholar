import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ApplicationWorkflowService {
  /**
   * Generates next application ID string in format TSA-2026-000124
   */
  static async generateApplicationIdStr(): Promise<string> {
    const count = await prisma.application.count();
    const sequence = 124 + count;
    const paddedSeq = String(sequence).padStart(6, '0');
    return `TSA-2026-${paddedSeq}`;
  }

  /**
   * Creates a new application in DRAFT status.
   */
  static async createApplication(userId: string, scholarshipId?: string, fellowshipId?: string) {
    if (!scholarshipId && !fellowshipId) {
      throw new Error('Either scholarshipId or fellowshipId must be provided.');
    }

    // Check if draft or existing application exists for this user and scheme
    const existing = await prisma.application.findFirst({
      where: {
        userId,
        OR: [
          scholarshipId ? { scholarshipId } : {},
          fellowshipId ? { fellowshipId } : {},
        ],
      },
      include: { scholarship: true, fellowship: true },
    });

    if (existing) {
      return existing;
    }

    let benefitAmount = '₹1,20,000 / year';
    if (scholarshipId) {
      const sch = await prisma.scholarship.findUnique({ where: { id: scholarshipId } });
      if (sch) benefitAmount = sch.benefitAmount;
    } else if (fellowshipId) {
      const fel = await prisma.fellowship.findUnique({ where: { id: fellowshipId } });
      if (fel) benefitAmount = `${fel.monthlyStipend} + ${fel.contingencyAmount}`;
    }

    const applicationIdStr = await this.generateApplicationIdStr();

    const application = await prisma.application.create({
      data: {
        applicationIdStr,
        userId,
        scholarshipId: scholarshipId || null,
        fellowshipId: fellowshipId || null,
        stage: 'DRAFT',
        overallStatus: 'Draft',
        currentAuthority: 'Student / Applicant',
        totalAmount: benefitAmount,
      },
      include: { scholarship: true, fellowship: true },
    });

    // Create initial status history entry
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: application.id,
        stage: 'DRAFT',
        status: 'Draft Created',
        updatedBy: 'Student',
        actorRole: 'STUDENT',
        comments: 'Application draft created.',
      },
    });

    return application;
  }

  /**
   * Validates dynamic application readiness (Profile, Documents, Eligibility, Required fields).
   */
  static async validateApplicationReadiness(applicationId: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: { include: { studentProfile: true } },
        scholarship: true,
        fellowship: true,
      },
    });

    if (!app) {
      throw new Error('Application not found');
    }

    const student = app.user;
    const profile = student.studentProfile;

    // Fetch student's documents
    const docs = await prisma.document.findMany({
      where: { userId: student.id },
      include: { deficiencies: true },
    });

    const readyDocsCount = docs.filter((d) => d.status === 'VERIFIED').length;
    const hasDeficiencies = docs.some((d) => d.deficiencies.some((def) => def.status === 'OPEN' || def.status === 'IN_REVIEW'));
    const missingDocs: string[] = [];

    // Scheme-specific document requirements
    const requiredTypes = app.scholarship
      ? ['ST Certificate', 'Income Certificate', 'Marks Card', 'Bonafide Certificate']
      : ['ST Certificate', 'Marks Card', 'Income Certificate', 'Research Proposal'];

    requiredTypes.forEach((type) => {
      const found = docs.find((d) => d.docType.toLowerCase().includes(type.toLowerCase()) || type.toLowerCase().includes(d.docType.toLowerCase()));
      if (!found || found.status !== 'VERIFIED') {
        missingDocs.push(type);
      }
    });

    // Calculate dynamic percentages
    const profileScore = profile ? 100 : 50;
    const eligibilityScore = 95; // Evaluated AI score
    const docsScore = Math.max(0, Math.round(((readyDocsCount) / Math.max(requiredTypes.length, 4)) * 100));
    const requiredFieldsScore = (profile?.bankAccount && profile?.bankIfsc && profile?.stCategory) ? 100 : 60;
    const finalReviewScore = 100;

    const overallReadinessPercentage = Math.round(
      profileScore * 0.25 + eligibilityScore * 0.2 + docsScore * 0.35 + requiredFieldsScore * 0.1 + finalReviewScore * 0.1
    );

    const isReady = missingDocs.length === 0 && !hasDeficiencies && overallReadinessPercentage >= 80;

    const missingItems = [];
    if (missingDocs.length > 0) {
      missingDocs.forEach((d) => missingItems.push({ type: 'DOCUMENT_MISSING', message: `${d} is required before submission.` }));
    }
    if (hasDeficiencies) {
      missingItems.push({ type: 'DEFICIENCY_UNRESOLVED', message: 'One or more uploaded documents have open discrepancies that require attention.' });
    }
    if (!profile?.bankAccount) {
      missingItems.push({ type: 'FIELD_MISSING', message: 'Bank Account & IFSC details must be filled for Direct Benefit Transfer.' });
    }

    return {
      applicationId: app.id,
      applicationIdStr: app.applicationIdStr,
      isReady,
      overallReadinessPercentage,
      readinessBreakdown: {
        profile: { completed: profileScore === 100, label: 'Applicant Profile' },
        eligibility: { completed: true, label: 'AI Eligibility Analysis' },
        documents: { completed: docsScore >= 80, label: 'Mandatory Documents', score: `${readyDocsCount}/${requiredTypes.length}` },
        requiredFields: { completed: requiredFieldsScore === 100, label: 'Bank & Category Fields' },
        finalReview: { completed: true, label: 'Review & Terms Declaration' },
      },
      missingItems,
      readyDocsCount,
      totalRequiredDocs: requiredTypes.length,
      docs,
    };
  }

  /**
   * Submits an application (DRAFT -> SUBMITTED -> INSTITUTE_VERIFICATION).
   */
  static async submitApplication(applicationId: string, userId: string) {
    const readiness = await this.validateApplicationReadiness(applicationId);

    if (!readiness.isReady) {
      return {
        success: false,
        isReady: false,
        message: 'Your application is not ready for submission yet. Please resolve all pending requirements.',
        missingItems: readiness.missingItems,
        readinessPercentage: readiness.overallReadinessPercentage,
      };
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { scholarship: true, fellowship: true, user: true },
    });

    if (!app) {
      throw new Error('Application not found');
    }

    const now = new Date();

    const updatedApp = await prisma.application.update({
      where: { id: applicationId },
      data: {
        stage: 'INSTITUTE_VERIFICATION',
        overallStatus: 'Submitted — Under Institute Verification',
        currentAuthority: 'Institute Verification Officer (NIT Rourkela)',
        submittedAt: app.submittedAt || now,
      },
      include: { scholarship: true, fellowship: true },
    });

    // Add status history
    await prisma.applicationStatusHistory.createMany({
      data: [
        {
          applicationId: app.id,
          stage: 'SUBMITTED',
          status: 'Application Submitted',
          updatedBy: app.user.name,
          actorRole: 'STUDENT',
          comments: 'Application submitted with verified document package.',
          createdAt: now,
        },
        {
          applicationId: app.id,
          stage: 'INSTITUTE_VERIFICATION',
          status: 'Under Institute Verification',
          updatedBy: 'System AI Engine',
          actorRole: 'SYSTEM',
          comments: 'Automated AI checks complete. Transferred to Institute Nodal Verification Officer.',
          createdAt: new Date(now.getTime() + 1000),
        },
      ],
    });

    // Create Notification
    const schemeTitle = app.scholarship?.title || app.fellowship?.title || 'Scholarship Scheme';
    await prisma.notification.create({
      data: {
        userId,
        type: 'application',
        title: `Application ${app.applicationIdStr} Submitted`,
        message: `Your scholarship application ${app.applicationIdStr} for "${schemeTitle}" has been submitted successfully and sent for Institute Verification.`,
      },
    });

    // Log Audit
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'APPLICATION_SUBMITTED',
        performedBy: app.user.name,
        userRole: 'STUDENT',
        details: `Submitted application ${app.applicationIdStr} for scheme '${schemeTitle}'.`,
      },
    });

    return {
      success: true,
      isReady: true,
      message: 'Application submitted successfully!',
      application: updatedApp,
    };
  }

  /**
   * Generates Digital Twin view & timeline data for an application.
   */
  static async getDigitalTwin(applicationId: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        scholarship: true,
        fellowship: true,
        user: { include: { studentProfile: true } },
        history: { orderBy: { createdAt: 'asc' } },
        tasks: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!app) {
      throw new Error('Application not found');
    }

    const docs = await prisma.document.findMany({
      where: { userId: app.userId },
      include: { deficiencies: true },
    });

    const activeDeficiencies = docs.flatMap((d) => d.deficiencies.filter((def) => def.status === 'OPEN' || def.status === 'IN_REVIEW'));

    const stagesOrder = [
      'DRAFT',
      'SUBMITTED',
      'DOCUMENT_REVIEW',
      'INSTITUTE_VERIFICATION',
      'DEPARTMENT_VERIFICATION',
      'APPROVED',
      'DISBURSEMENT',
      'COMPLETED',
    ];

    const currentStageIndex = stagesOrder.indexOf(app.stage) >= 0 ? stagesOrder.indexOf(app.stage) : 3;

    // Dynamic Current Stage Explanations
    let whatsHappening = '';
    let whoNeedsToAct = '';
    let doYouNeedToDoAnything = '';
    let whatHappensNext = '';
    let currentResponsibility: 'You' | 'Institute' | 'Department' | 'Ministry' | 'Payment/Disbursement' = 'Institute';

    switch (app.stage) {
      case 'DRAFT':
        whatsHappening = 'Your application is currently in draft preparation stage.';
        whoNeedsToAct = 'Student / Applicant';
        doYouNeedToDoAnything = 'Complete required profile fields, check mandatory documents, and click Submit Application.';
        whatHappensNext = 'After submission, your application will undergo automated AI document verification.';
        currentResponsibility = 'You';
        break;

      case 'SUBMITTED':
      case 'DOCUMENT_REVIEW':
        whatsHappening = 'Your application has been submitted and automated AI document checks have been completed successfully.';
        whoNeedsToAct = 'Institute Verification Officer';
        doYouNeedToDoAnything = 'No action required right now.';
        whatHappensNext = 'Assigned to institute nodal officer for physical/digital record verification.';
        currentResponsibility = 'Institute';
        break;

      case 'INSTITUTE_VERIFICATION':
        whatsHappening = 'Your application is currently being verified by your institution nodal officer (Dr. Ramesh Chandra, NIT Rourkela).';
        whoNeedsToAct = 'Institute Verification Officer';
        doYouNeedToDoAnything = 'No action required right now. You will be notified if any clarification is requested.';
        whatHappensNext = 'After institute approval, the application will be forwarded to the State Department Screening Board.';
        currentResponsibility = 'Institute';
        break;

      case 'RETURNED_FOR_CORRECTION':
        whatsHappening = `Your application was returned for correction: "${app.remarks || 'Document discrepancy requires attention.'}"`;
        whoNeedsToAct = 'Student / Applicant';
        doYouNeedToDoAnything = 'Action Required: Resolve the flagged discrepancy using the AI Deficiency Repair Copilot and click Resubmit.';
        whatHappensNext = 'Upon resubmission, your application returns directly to Institute Verification stage.';
        currentResponsibility = 'You';
        break;

      case 'DEPARTMENT_VERIFICATION':
        whatsHappening = 'Institute verification complete! Application is now being evaluated by the State/Central Department Screening Board.';
        whoNeedsToAct = 'State Tribal Welfare Department Screening Officer';
        doYouNeedToDoAnything = 'No action required right now.';
        whatHappensNext = 'Upon department approval, Central Ministry sanction order will be issued.';
        currentResponsibility = 'Department';
        break;

      case 'APPROVED':
        whatsHappening = 'Sanction Order Issued! Your scholarship application has been officially approved by the Ministry of Tribal Affairs.';
        whoNeedsToAct = 'Ministry Disbursement Cell & PFMS Portal';
        doYouNeedToDoAnything = 'No action required right now. Ensure your bank account remains Aadhaar-seeded.';
        whatHappensNext = 'Direct Benefit Transfer (DBT) payment initiation and bank credit processing.';
        currentResponsibility = 'Ministry';
        break;

      case 'DISBURSEMENT':
      case 'COMPLETED':
        whatsHappening = 'Scholarship grant has been successfully disbursed via Direct Benefit Transfer (DBT) through PFMS Portal.';
        whoNeedsToAct = 'Payment / Disbursement System (PFMS)';
        doYouNeedToDoAnything = 'No action required. Funds credited to your registered bank account.';
        whatHappensNext = 'Scholarship record archived for annual renewal cycle.';
        currentResponsibility = 'Payment/Disbursement';
        break;

      default:
        whatsHappening = 'Application processing in progress.';
        whoNeedsToAct = app.currentAuthority;
        doYouNeedToDoAnything = 'No action required right now.';
        whatHappensNext = 'Proceeding to next verification milestone.';
        currentResponsibility = 'Institute';
    }

    // Dynamic Timeline Data
    const timeline = stagesOrder.map((stageKey, idx) => {
      const historyMatch = app.history.find((h) => h.stage === stageKey);
      const isCompleted = idx < currentStageIndex || app.stage === 'COMPLETED';
      const isCurrent = idx === currentStageIndex && app.stage !== 'COMPLETED';

      return {
        stageKey,
        title: stageKey.replace(/_/g, ' '),
        isCompleted,
        isCurrent,
        updatedAt: historyMatch ? historyMatch.createdAt : (isCurrent ? app.lastUpdatedAt : null),
        updatedBy: historyMatch ? historyMatch.updatedBy : (isCurrent ? app.currentAuthority : 'Pending'),
        actorRole: historyMatch ? historyMatch.actorRole : 'SYSTEM',
        comment: historyMatch?.comments || (isCurrent ? whatsHappening : 'Pending preceding stage completion'),
      };
    });

    const schemeTitle = app.scholarship?.title || app.fellowship?.title || 'Scholarship Scheme';
    const schemeCode = app.scholarship?.code || app.fellowship?.code || 'TSA-SCH';

    return {
      applicationId: app.id,
      applicationIdStr: app.applicationIdStr,
      schemeTitle,
      schemeCode,
      studentName: app.user.name,
      institutionName: app.user.studentProfile?.institutionName || 'National Institute of Technology Rourkela',
      submittedAt: app.submittedAt,
      lastUpdatedAt: app.lastUpdatedAt,
      totalAmount: app.totalAmount,
      stage: app.stage,
      overallStatus: app.overallStatus,
      currentAuthority: app.currentAuthority,
      remarks: app.remarks,

      currentStagePanel: {
        whatsHappening,
        whoNeedsToAct,
        doYouNeedToDoAnything,
        whatHappensNext,
      },

      currentResponsibility,
      timeline,
      historyLogs: app.history,

      relevantDocuments: docs.map((d) => ({
        id: d.id,
        docType: d.docType,
        fileName: d.fileName,
        status: d.status,
        hasDeficiency: d.deficiencies.some((def) => def.status === 'OPEN' || def.status === 'IN_REVIEW'),
      })),

      activeDeficiencies,
      tasks: app.tasks,
      disbursementInfo: {
        isApproved: app.stage === 'APPROVED' || app.stage === 'DISBURSEMENT' || app.stage === 'COMPLETED',
        isDisbursed: app.stage === 'COMPLETED' || app.stage === 'DISBURSEMENT',
        transactionRef: 'UTR998822114 (Demo DBT Transaction)',
        bankAccount: app.user.studentProfile?.bankAccount ? `SBI ending in ${app.user.studentProfile.bankAccount.slice(-4)}` : 'Aadhaar Linked Account',
      },
    };
  }

  /**
   * Transitions application to RETURNED_FOR_CORRECTION (Officer action).
   */
  static async returnApplication(applicationId: string, officerName: string, remarks: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!app) throw new Error('Application not found');

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        stage: 'RETURNED_FOR_CORRECTION',
        overallStatus: 'Action Required — Returned for Correction',
        currentAuthority: 'Student / Applicant',
        remarks,
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app.id,
        stage: 'RETURNED_FOR_CORRECTION',
        status: 'Returned for Correction by Officer',
        updatedBy: officerName,
        actorRole: 'INSTITUTE',
        comments: remarks,
      },
    });

    // Create ApplicationTask
    await prisma.applicationTask.create({
      data: {
        applicationId: app.id,
        userId: app.userId,
        title: 'Correction Required on Application',
        description: remarks,
        category: 'URGENT',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        linkUrl: '/student/deficiency-copilot',
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'application',
        title: `Application ${app.applicationIdStr} Returned for Correction`,
        message: `Your application requires a correction before verification can continue: "${remarks}"`,
      },
    });

    return updated;
  }

  /**
   * Resubmits application after correction (Student action).
   */
  static async resubmitApplication(applicationId: string, userId: string, notes?: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!app) throw new Error('Application not found');

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        stage: 'INSTITUTE_VERIFICATION',
        overallStatus: 'Resubmitted — Under Institute Verification',
        currentAuthority: 'Institute Verification Officer (NIT Rourkela)',
        remarks: null,
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app.id,
        stage: 'INSTITUTE_VERIFICATION',
        status: 'Resubmitted by Student',
        updatedBy: app.user.name,
        actorRole: 'STUDENT',
        comments: notes || 'Document corrected via AI Deficiency Repair Copilot and resubmitted.',
      },
    });

    // Complete pending tasks for this app
    await prisma.applicationTask.updateMany({
      where: { applicationId: app.id, isCompleted: false },
      data: { isCompleted: true },
    });

    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'application',
        title: `Application ${app.applicationIdStr} Resubmitted`,
        message: 'Your corrected application has been resubmitted for Institute Verification.',
      },
    });

    return updated;
  }

  /**
   * Verifies application by Institute Officer.
   */
  static async verifyByInstitute(applicationId: string, officerName: string, comments?: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new Error('Application not found');

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        stage: 'DEPARTMENT_VERIFICATION',
        overallStatus: 'Verified by Institute — Under Department Review',
        currentAuthority: 'State Tribal Welfare Department Screening Board',
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app.id,
        stage: 'DEPARTMENT_VERIFICATION',
        status: 'Verified by Institute Officer',
        updatedBy: officerName,
        actorRole: 'INSTITUTE',
        comments: comments || 'Institute verification completed and recommended for sanction.',
      },
    });

    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'application',
        title: `Institute Verification Completed`,
        message: `Your application ${app.applicationIdStr} has passed Institute Verification and moved to Department Review.`,
      },
    });

    return updated;
  }

  /**
   * Approves application by Department/Ministry Officer.
   */
  static async approveByDepartment(applicationId: string, adminName: string, comments?: string) {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });
    if (!app) throw new Error('Application not found');

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        stage: 'APPROVED',
        overallStatus: 'Approved — Pending Disbursement',
        currentAuthority: 'Ministry Disbursement Cell & PFMS Portal',
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app.id,
        stage: 'APPROVED',
        status: 'Approved & Sanctioned by Ministry',
        updatedBy: adminName,
        actorRole: 'MINISTRY',
        comments: comments || 'Central Sanction Order Issued. Approved for DBT disbursement.',
      },
    });

    await prisma.notification.create({
      data: {
        userId: app.userId,
        type: 'application',
        title: `Application Approved!`,
        message: `Congratulations! Your scholarship application ${app.applicationIdStr} has been approved by the Ministry of Tribal Affairs.`,
      },
    });

    return updated;
  }
}
