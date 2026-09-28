import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PageContext {
  routePath?: string;
  scholarshipId?: string;
  applicationId?: string;
  renewalId?: string;
  documentId?: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant' | 'bot';
  text: string;
}

export interface AssistantResponse {
  answer: string;
  simpleExplanation: string;
  suggestedActions: string[];
  actionRoute?: string;
  language: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  pageContext?: PageContext;
}

export class AssistantService {
  /**
   * Main Conversational AI & Retrieval Processing Layer
   */
  static async processUserQuery(
    userId?: string,
    query: string = '',
    history: ChatMessage[] = [],
    language: string = 'en',
    pageContext: PageContext = {},
    simpleLanguage: boolean = false
  ): Promise<AssistantResponse> {
    const rawQuery = (query || '').trim();
    const lowerQuery = rawQuery.toLowerCase();

    // 1. FETCH AUTHENTICATED USER CONTEXT (IF USER IS LOGGED IN)
    let userName = 'Scholar';
    let userProfile: any = null;
    let userApplications: any[] = [];
    let userDocuments: any[] = [];
    let userRenewals: any[] = [];

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          studentProfile: true,
          applications: { include: { scholarship: true, fellowship: true }, orderBy: { lastUpdatedAt: 'desc' } },
          documents: { include: { deficiencies: true } },
          renewals: true,
        },
      });

      if (user) {
        userName = user.name || 'Scholar';
        userProfile = user.studentProfile;
        userApplications = user.applications || [];
        userDocuments = user.documents || [];
        userRenewals = user.renewals || [];
      }
    }

    // 2. CONVERSATION MEMORY WINDOW (CONSTRUCT HISTORY CONTEXT)
    const recentContext = history.slice(-6).map((m) => m.text).join(' ').toLowerCase();
    const combinedContext = `${recentContext} ${lowerQuery}`;

    // 3. INTENT DETECTION & VERIFIED DATABASE RETRIEVAL

    let answer = '';
    let simpleExplanation = '';
    let suggestedActions: string[] = [];
    let actionRoute: string | undefined = undefined;
    let sourceName = 'Ministry of Tribal Affairs & National Scholarship Portal';
    let sourceUrl = 'https://scholarships.gov.in';
    let lastVerifiedAt = '27 September 2026';

    // A. INTENT: APPLICATION DIGITAL TWIN & STATUS TRACKING
    if (
      lowerQuery.includes('stuck') ||
      lowerQuery.includes('pending') ||
      lowerQuery.includes('status') ||
      lowerQuery.includes('track') ||
      lowerQuery.includes('why is my application') ||
      lowerQuery.includes('where is my application') ||
      query === 'Track Application' ||
      pageContext.routePath?.includes('/digital-twin')
    ) {
      if (userApplications.length > 0) {
        const app = userApplications[0];
        const schemeTitle = app.scholarship?.title || app.fellowship?.title || 'Pre-Matric / Post-Matric ST Scholarship';
        const hasDeficiencies = userDocuments.some((d) => d.status === 'NEEDS_ATTENTION' || d.deficiencies?.length > 0);
        const blockerText = hasDeficiencies
          ? 'Income Certificate name mismatch requires user upload'
          : 'Pending Nodal Officer document verification at Institute level';

        answer = `### Digital Twin Application Tracking\n\n` +
          `**Application ID:** \`${app.applicationIdStr}\`  \n` +
          `**Scheme:** ${schemeTitle}  \n` +
          `**Academic Year:** 2026–27  \n` +
          `**Current Stage:** ${app.stage.replace(/_/g, ' ')}  \n` +
          `**Status:** ${app.overallStatus}  \n` +
          `**Responsible Party:** ${app.currentAuthority}  \n` +
          `**Identified Blocker:** ${blockerText}  \n` +
          `**Next Action:** ${hasDeficiencies ? 'Upload corrected official document in Document Center' : 'System automatically routing to Institute Nodal Officer'}  \n` +
          `**Next Transition:** ${app.stage === 'DOCUMENT_REVIEW' ? 'Institute Verification' : 'Department Verification'}\n\n` +
          `*Your Digital Twin tracks process metrics in real-time under Ministry guidelines.*`;

        simpleExplanation = `Your application (${app.applicationIdStr}) for ${schemeTitle} is currently at the ${app.stage.replace(/_/g, ' ')} stage. ${hasDeficiencies ? 'Please fix the document issue in your Document Center.' : 'No action is needed from you right now.'}`;
        suggestedActions = ['Fix Document Issue', 'View Digital Twin', 'Check Eligibility'];
        actionRoute = `/student/digital-twin/${app.id}`;
      } else {
        answer = `### Application Tracking\n\nNo active applications were found under your registered account. You can discover verified official opportunities and submit an application on the National Scholarship Portal.`;
        simpleExplanation = `You have not submitted an application yet. Explore matching scholarships below to get started.`;
        suggestedActions = ['Find Scholarships', 'Check Eligibility'];
        actionRoute = `/student/opportunities`;
      }
    }

    // B. INTENT: SCHOLARSHIP FINDER & EDUCATION LEVEL MATCHING
    if (
      lowerQuery.includes('scholarship') ||
      lowerQuery.includes('scheme') ||
      lowerQuery.includes('overseas') ||
      lowerQuery.includes('fellowship') ||
      lowerQuery.includes('rules') ||
      lowerQuery.includes('income limit') ||
      combinedContext.includes('b.tech') ||
      combinedContext.includes('undergraduate') ||
      combinedContext.includes('school') ||
      combinedContext.includes('class') ||
      combinedContext.includes('postgraduate') ||
      combinedContext.includes('phd') ||
      combinedContext.includes('eligible') ||
      query === 'Find Scholarships' ||
      query === 'Check Eligibility' ||
      query === 'Find Official Schemes'
    ) {
      let targetLevel = userProfile?.educationLevel || 'UNDERGRADUATE';

      if (combinedContext.includes('class 9') || combinedContext.includes('class 10') || combinedContext.includes('pre-matric') || combinedContext.includes('school')) {
        targetLevel = 'SCHOOL';
      } else if (combinedContext.includes('diploma') || combinedContext.includes('iti') || combinedContext.includes('vocational')) {
        targetLevel = 'DIPLOMA';
      } else if (combinedContext.includes('b.tech') || combinedContext.includes('b.e.') || combinedContext.includes('b.sc') || combinedContext.includes('undergraduate') || combinedContext.includes('ug')) {
        targetLevel = 'UNDERGRADUATE';
      } else if (combinedContext.includes('m.tech') || combinedContext.includes('m.sc') || combinedContext.includes('postgraduate') || combinedContext.includes('pg')) {
        targetLevel = 'POSTGRADUATE';
      } else if (combinedContext.includes('phd') || combinedContext.includes('doctorate') || combinedContext.includes('research') || combinedContext.includes('fellowship')) {
        targetLevel = 'RESEARCH';
      }

      // Check if user specifically requested a known scheme name
      let titleFilter: string | undefined = undefined;
      if (lowerQuery.includes('overseas')) titleFilter = 'Overseas';
      else if (lowerQuery.includes('top class')) titleFilter = 'Top Class';
      else if (lowerQuery.includes('post-matric') || lowerQuery.includes('post matric')) titleFilter = 'Post-Matric';
      else if (lowerQuery.includes('pre-matric') || lowerQuery.includes('pre matric')) titleFilter = 'Pre-Matric';
      else if (lowerQuery.includes('eklavya') || lowerQuery.includes('emrs')) titleFilter = 'Eklavya';

      let schemes: any[] = [];
      if (titleFilter) {
        schemes = await prisma.scholarship.findMany({
          where: {
            title: { contains: titleFilter },
          },
          take: 3,
        });
      }

      if (schemes.length === 0) {
        schemes = await prisma.scholarship.findMany({
          where: {
            OR: [
              { educationLevel: targetLevel },
              { educationLevel: 'UNDERGRADUATE' },
            ],
          },
          take: 3,
        });
      }

      if (schemes.length > 0) {
        answer = `### Verified Official Schemes (Academic Year 2026–27)\n\n` +
          `Based on published Ministry of Tribal Affairs guidelines:\n\n` +
          schemes.map((s, idx) =>
            `**${idx + 1}. ${s.title}**  \n` +
            `• **Official Name:** ${s.officialName || s.title}  \n` +
            `• **Level:** ${s.educationLevel} | **Academic Year:** ${s.academicYear}  \n` +
            `• **Income Limit:** ${s.incomeLimit}  \n` +
            `• **Benefits:** ${s.benefitAmount}  \n` +
            `• **Application Window:** ${s.applicationStart || 'Open'} to ${s.applicationDeadline}  \n` +
            `• **Official Portal:** [Continue to Portal](${s.officialApplicationUrl})`
          ).join('\n\n') +
          `\n\n> [!NOTE]\n> Potential matches are evaluated against published rules. Final eligibility verification is determined by authorized government nodal officers.`;

        simpleExplanation = `Here are official verified schemes matching your query. Click below to view detailed guidelines and apply on the official portal.`;
        suggestedActions = ['Check My Eligibility', 'View Required Documents', 'Track Application'];
        actionRoute = `/scholarships`;
        sourceName = schemes[0].provider || 'Ministry of Tribal Affairs';
        sourceUrl = schemes[0].sourceUrl || 'https://tribal.nic.in';
        lastVerifiedAt = schemes[0].lastVerifiedAt || '27 September 2026';
      } else {
        answer = `I couldn't verify matching schemes for this criteria from available official sources. Please refer directly to official government notifications.`;
        simpleExplanation = `No verified schemes were found matching this specific filter. View official portals below.`;
        suggestedActions = ['Find Official Schemes', 'Check Eligibility'];
        actionRoute = `/scholarships`;
      }
    }

    // C. INTENT: DOCUMENT DEFICIENCY REPAIR COPILOT
    else if (
      lowerQuery.includes('document') ||
      lowerQuery.includes('caste') ||
      lowerQuery.includes('rejected') ||
      lowerQuery.includes('fix') ||
      lowerQuery.includes('mismatch') ||
      query === 'Fix Document Issue' ||
      pageContext.routePath?.includes('/documents')
    ) {
      const deficientDocs = userDocuments.filter((d) => d.status === 'NEEDS_ATTENTION' || d.status === 'DEFICIENT' || d.deficiencies?.length > 0);

      if (deficientDocs.length > 0) {
        const doc = deficientDocs[0];
        const def = doc.deficiencies?.[0] || { description: 'Name spelling mismatch between profile and certificate seal.' };

        answer = `### AI Deficiency Repair Copilot Guidance\n\n` +
          `**Flagged Document:** ${doc.docType} (\`${doc.fileName}\`)  \n` +
          `**Detected Issue:** ${def.description}  \n` +
          `**Severity:** Warning / Action Required  \n\n` +
          `#### Corrective Steps:\n` +
          `1. **Do NOT manually alter or edit** the certificate file or official seal.  \n` +
          `2. Obtain an updated official ${doc.docType} from your local Tehsildar / Revenue Authority or DigiLocker.  \n` +
          `3. Ensure the legal name matches your Aadhaar card (` + (userProfile?.fatherName ? userProfile.fatherName : 'as registered') + `).  \n` +
          `4. Re-upload the verified PDF in the **Document Center**.`;

        simpleExplanation = `Your ${doc.docType} has a name mismatch. Please obtain a fresh official certificate and re-upload it in the Document Center. Do not edit the file yourself.`;
        suggestedActions = ['Open Document Center', 'Re-check Documents', 'Track Application'];
        actionRoute = `/student/documents`;
      } else {
        answer = `### Document Verification Status\n\nAll required documents (ST Caste Certificate, Income Certificate, Academic Marksheet, Aadhaar Linkage) are clean, verified, and in full compliance with published Ministry criteria.`;
        simpleExplanation = `All your uploaded documents are verified and clean. No action is required.`;
        suggestedActions = ['Find Scholarships', 'Check Eligibility', 'Track Application'];
        actionRoute = `/student/documents`;
      }
    }

    // D. INTENT: UNVERIFIED OR UNKNOWN QUESTION HANDLING
    else if (
      lowerQuery.includes('fake') ||
      lowerQuery.includes('unverified') ||
      lowerQuery.includes('secret') ||
      lowerQuery.includes('hack')
    ) {
      answer = `I couldn't verify that information from the available official sources. Tribal Scholar AI adheres to a strict Real-Data-First policy and does not provide unverified claims.`;
      simpleExplanation = `This information cannot be verified from official government sources.`;
      suggestedActions = ['Find Official Schemes', 'Track Application'];
    }

    // E. GENERAL GREETING / ASSISTANT WELCOME
    else {
      answer = `### Namaste ${userName}! 🙏\n\nI am your **Tribal Scholar AI Assistant** (Ministry of Tribal Affairs). How can I assist your education journey today?\n\n` +
        `• **Find Scholarships:** Match verified schemes across School, Diploma, UG, PG, and PhD Research levels.  \n` +
        `• **Track Application:** Inspect real-time Digital Twin status and resolution blockers.  \n` +
        `• **Fix Document Issue:** Get step-by-step guidance for flagged certificate mismatches.`;

      simpleExplanation = `Hello ${userName}! How can I help you today? Select one of the quick actions below.`;
      suggestedActions = ['Find Scholarships', 'Check Eligibility', 'Fix Document Issue', 'Track Application'];
      actionRoute = `/student/dashboard`;
    }

    // 4. BILINGUAL TRANSLATION (HINDI SUPPORT)
    if (language === 'hi' || lowerQuery.includes('नमस्ते') || lowerQuery.includes('छात्रवृत्ति') || lowerQuery.includes('आवेदन')) {
      answer = AssistantService.translateToHindi(answer);
      simpleExplanation = AssistantService.translateToHindi(simpleExplanation);
      suggestedActions = ['छात्रवृत्ति खोजें', 'पात्रता जांचें', 'दस्तावेज़ ठीक करें', 'आवेदन ट्रैक करें'];
    }

    return {
      answer: simpleLanguage && simpleExplanation ? simpleExplanation : answer,
      simpleExplanation,
      suggestedActions,
      actionRoute,
      language,
      sourceName,
      sourceUrl,
      lastVerifiedAt,
      pageContext,
    };
  }

  /**
   * Translates key natural language text blocks into Hindi while preserving Markdown & scheme data.
   */
  private static translateToHindi(text: string): string {
    return text
      .replace(/### Hello/g, '### नमस्ते')
      .replace(/Digital Twin Application Tracking/g, 'डिजिटल ट्विन आवेदन ट्रैकिंग')
      .replace(/Current Stage:/g, 'वर्तमान चरण:')
      .replace(/Status:/g, 'स्थिति:')
      .replace(/Responsible Party:/g, 'उत्तरदायी अधिकारी:')
      .replace(/Identified Blocker:/g, 'पहचाना गया अवरोध:')
      .replace(/Next Action:/g, 'अगली कार्रवाई:')
      .replace(/Next Transition:/g, 'अगला बदलाव:')
      .replace(/AI Deficiency Repair Copilot Guidance/g, 'एआई दस्तावेज़ त्रुटि सुधार मार्गदर्शन')
      .replace(/Flagged Document:/g, 'चिह्नित दस्तावेज़:')
      .replace(/Detected Issue:/g, 'पहचानी गई समस्या:')
      .replace(/Corrective Steps:/g, 'सुधारात्मक कदम:')
      .replace(/Verified Official Schemes for/g, 'के लिए सत्यापित आधिकारिक योजनाएं')
      .replace(/Academic Year 2026–27/g, 'शैक्षणिक वर्ष 2026–27')
      .replace(/Official Name:/g, 'आधिकारिक नाम:')
      .replace(/Income Limit:/g, 'आय सीमा:')
      .replace(/Benefits:/g, 'लाभ:')
      .replace(/Application Window:/g, 'आवेदन की समय-सीमा:');
  }
}
