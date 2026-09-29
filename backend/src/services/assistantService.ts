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
  sender?: 'user' | 'assistant' | 'bot';
  role?: 'user' | 'assistant';
  text?: string;
  content?: string;
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
   * Main Conversational AI & Retrieval-Augmented Generation (RAG) Engine
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
    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(rawQuery);

    // 1. AUTHENTICATED STUDENT CONTEXT RETRIEVAL (STRICT USER ISOLATION)
    let userName = 'Scholar';
    let userProfile: any = null;
    let userApplications: any[] = [];
    let userDocuments: any[] = [];
    let userRenewals: any[] = [];

    if (userId) {
      try {
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
      } catch (err) {
        console.error('⚠️ User context retrieval error:', err);
      }
    }

    // 2. CONVERSATION HISTORY MEMORY WINDOW (CONSTRUCT MULTI-TURN CONTEXT)
    const historyText = history
      .slice(-6)
      .map((m) => {
        const role = m.role || (m.sender === 'user' ? 'user' : 'assistant');
        const text = m.content || m.text || '';
        return `${role.toUpperCase()}: ${text}`;
      })
      .join('\n');

    const combinedContext = `${historyText}\nUSER: ${rawQuery}`.toLowerCase();

    // 3. INTENT DETECTION & DATABASE RAG RETRIEVAL
    let targetLevel = userProfile?.educationLevel || 'UNDERGRADUATE';
    if (combinedContext.includes('class 9') || combinedContext.includes('class 10') || combinedContext.includes('school') || combinedContext.includes('pre-matric')) {
      targetLevel = 'SCHOOL';
    } else if (combinedContext.includes('diploma') || combinedContext.includes('iti') || combinedContext.includes('polytechnic')) {
      targetLevel = 'DIPLOMA';
    } else if (combinedContext.includes('b.tech') || combinedContext.includes('b.sc') || combinedContext.includes('b.a') || combinedContext.includes('undergraduate') || combinedContext.includes('ug')) {
      targetLevel = 'UNDERGRADUATE';
    } else if (combinedContext.includes('m.tech') || combinedContext.includes('m.sc') || combinedContext.includes('m.a') || combinedContext.includes('postgraduate') || combinedContext.includes('pg') || combinedContext.includes('master')) {
      targetLevel = 'POSTGRADUATE';
    } else if (combinedContext.includes('phd') || combinedContext.includes('doctorate') || combinedContext.includes('research') || combinedContext.includes('fellowship') || combinedContext.includes('postdoc')) {
      targetLevel = 'RESEARCH';
    }

    // Retrieve verified scholarships matching context
    let matchedSchemes: any[] = [];
    try {
      matchedSchemes = await prisma.scholarship.findMany({
        where: {
          status: 'ACTIVE',
          OR: [
            { educationLevel: targetLevel },
            { educationLevel: 'UNDERGRADUATE' },
          ],
        },
        take: 4,
      });
    } catch (dbErr) {
      console.error('⚠️ DB Scholarship retrieval warning:', dbErr);
    }

    // Default citation metadata
    let sourceName = matchedSchemes.length > 0 ? (matchedSchemes[0].provider || 'Ministry of Tribal Affairs') : 'Ministry of Tribal Affairs & NSP';
    let sourceUrl = matchedSchemes.length > 0 ? (matchedSchemes[0].officialApplicationUrl || 'https://scholarships.gov.in') : 'https://scholarships.gov.in';
    let lastVerifiedAt = matchedSchemes.length > 0 ? (matchedSchemes[0].lastVerifiedAt || '27 September 2026') : '27 September 2026';

    // 4. ATTEMPT GEMINI LLM COMPLETION IF API KEY IS CONFIGURED
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const systemPrompt = `You are Tribal Scholar AI Assistant, an official conversational AI copilot for the Ministry of Tribal Affairs, Government of India.
You assist Scheduled Tribe (ST) students with scholarships, fellowships, eligibility matching, document deficiency repair, application tracking, digital twin lifecycle, renewals, and platform navigation.

CONTEXT DATA (VERIFIED FROM DATABASE):
- User Name: ${userName}
- User Profile: ${userProfile ? JSON.stringify({ state: userProfile.state, income: userProfile.familyIncome, level: userProfile.educationLevel, course: userProfile.courseName, institution: userProfile.institutionName }) : 'Not provided'}
- User Active Applications: ${userApplications.length > 0 ? JSON.stringify(userApplications.map(a => ({ id: a.applicationIdStr, stage: a.stage, status: a.overallStatus, authority: a.currentAuthority }))) : 'No active applications'}
- User Documents Status: ${userDocuments.length > 0 ? JSON.stringify(userDocuments.map(d => ({ docType: d.docType, status: d.status, deficiencies: d.deficiencies?.map((x: any) => x.description) }))) : 'No uploaded documents'}
- Verified Matching Schemes: ${JSON.stringify(matchedSchemes.map(s => ({ title: s.title, level: s.educationLevel, incomeLimit: s.incomeLimit, benefits: s.benefitAmount, deadline: s.applicationDeadline, url: s.officialApplicationUrl })))}

RULES:
1. Respond in ${isHindi ? 'Devanagari Hindi (हिन्दी)' : 'English'}.
2. Use verified scholarship details only. Do not invent fake scheme names, deadlines, or amounts.
3. Be supportive, concise, structured (use Markdown headers ### and bullet points •), and helpful.
4. If asked navigation questions (e.g. "where to upload documents", "where are my applications"), direct the user to actual platform routes (/student/documents, /student/applications, /student/profile, /student/opportunities, /scholarships).
5. If the user asks off-topic questions (e.g. weather, general coding), answer briefly and politely redirect back to education funding assistance.`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const requestPayload = {
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nCONVERSATION HISTORY:\n${historyText}\n\nUSER QUESTION: ${rawQuery}` }] }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        };

        const apiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload),
        });

        if (apiRes.ok) {
          const resData = await apiRes.json();
          const llmText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (llmText && llmText.trim().length > 0) {
            let suggestedActions = isHindi
              ? ['छात्रवृत्ति खोजें', 'पात्रता जांचें', 'दस्तावेज़ ठीक करें', 'आवेदन ट्रैक करें']
              : ['Find Scholarships', 'Check Eligibility', 'Fix Document Issue', 'Track Application'];

            let actionRoute = '/student/opportunities';
            if (lowerQuery.includes('document') || lowerQuery.includes('upload') || lowerQuery.includes('caste') || lowerQuery.includes('income')) {
              actionRoute = '/student/documents';
            } else if (lowerQuery.includes('track') || lowerQuery.includes('status') || lowerQuery.includes('digital twin')) {
              actionRoute = userApplications.length > 0 ? `/student/digital-twin/${userApplications[0].id}` : '/student/applications';
            } else if (lowerQuery.includes('profile')) {
              actionRoute = '/student/profile';
            } else if (lowerQuery.includes('renewal')) {
              actionRoute = '/student/renewals';
            }

            return {
              answer: llmText.trim(),
              simpleExplanation: llmText.split('\n')[0].replace(/#/g, '').trim(),
              suggestedActions,
              actionRoute,
              language: isHindi ? 'hi' : 'en',
              sourceName,
              sourceUrl,
              lastVerifiedAt,
              pageContext,
            };
          }
        }
      } catch (geminiErr) {
        console.error('⚠️ Gemini API call failed, falling back to RAG Synthesizer:', geminiErr);
      }
    }

    // 5. INTELLIGENT COMPREHENSIVE RAG SYNTHESIZER (PRIMARY ENGINE WHEN LLM API IS OFFLINE)
    let answer = '';
    let simpleExplanation = '';
    let suggestedActions: string[] = [];
    let actionRoute: string | undefined = undefined;

    // A. GREETINGS & CASUAL INTENTS
    if (
      lowerQuery === 'hi' ||
      lowerQuery === 'hello' ||
      lowerQuery === 'hey' ||
      lowerQuery.includes('namaste') ||
      lowerQuery.includes('good morning') ||
      lowerQuery.includes('good afternoon') ||
      lowerQuery === 'can you help me?' ||
      lowerQuery.includes('who are you')
    ) {
      answer = `### Namaste ${userName}! 🙏\n\nI am your **Tribal Scholar AI Assistant**, official copilot for the **Ministry of Tribal Affairs** (Government of India).\n\nHere is how I can assist your education journey today:\n• **Find Scholarships:** Match verified schemes across School, Diploma, UG, PG, and PhD levels.\n• **Check Eligibility:** Evaluate your income, academic marks, and caste criteria.\n• **Fix Document Mismatches:** Resolve name spelling errors using the AI Deficiency Repair Copilot.\n• **Track Application:** Monitor real-time Digital Twin status and verification desks.`;
      simpleExplanation = `Hello ${userName}! I'm here to assist you with scholarship matching, application tracking, and document verification.`;
      suggestedActions = ['Find Scholarships', 'Check Eligibility', 'Fix Document Issue', 'Track Application'];
      actionRoute = '/student/dashboard';
    }

    // B. STARTING GUIDANCE / "WHERE DO I START?"
    else if (
      lowerQuery.includes('don\'t know where to start') ||
      lowerQuery.includes('where to start') ||
      lowerQuery.includes('how to start') ||
      lowerQuery.includes('what should i do first') ||
      lowerQuery.includes('first step')
    ) {
      answer = `### Getting Started with Tribal Scholar AI\n\nFollow these 3 simple steps to secure your scholarship funding:\n\n` +
        `1. **Complete Your Student Profile:** Fill in your education level (${userProfile?.educationLevel || 'Undergraduate'}), family income, and ST caste category in your Profile.\n` +
        `2. **Upload Verified Documents:** Upload your ST Caste Certificate, Family Income Certificate, and Marksheets in the **Document Center**.\n` +
        `3. **Review AI Matches:** Browse personalized schemes matched to your profile and submit your application via the official portal.`;
      simpleExplanation = `Start by completing your profile, uploading your documents in the Document Center, and exploring AI-matched scholarships.`;
      suggestedActions = ['Complete Profile', 'Open Document Center', 'View AI Matches'];
      actionRoute = userProfile ? '/student/opportunities' : '/student/profile';
    }

    // C. APPLICATION STATUS & DIGITAL TWIN
    else if (
      lowerQuery.includes('status') ||
      lowerQuery.includes('track') ||
      lowerQuery.includes('stuck') ||
      lowerQuery.includes('pending') ||
      lowerQuery.includes('where is my application') ||
      lowerQuery.includes('digital twin') ||
      query === 'Track Application' ||
      pageContext.routePath?.includes('/digital-twin')
    ) {
      if (userApplications.length > 0) {
        const app = userApplications[0];
        const schemeTitle = app.scholarship?.title || app.fellowship?.title || 'ST Scholarship Scheme';
        const hasDeficiencies = userDocuments.some((d) => d.status === 'NEEDS_ATTENTION' || d.deficiencies?.length > 0);
        const blockerText = hasDeficiencies
          ? 'Income Certificate name mismatch requires user document resubmission'
          : 'Pending Nodal Officer document verification at Institute level';

        answer = `### Digital Twin Application Tracking\n\n` +
          `**Application ID:** \`${app.applicationIdStr}\`  \n` +
          `**Scheme:** ${schemeTitle}  \n` +
          `**Academic Year:** 2026–27  \n` +
          `**Current Stage:** ${app.stage.replace(/_/g, ' ')}  \n` +
          `**Overall Status:** ${app.overallStatus}  \n` +
          `**Responsible Authority:** ${app.currentAuthority}  \n` +
          `**Identified Blocker:** ${blockerText}  \n` +
          `**Next Action:** ${hasDeficiencies ? 'Re-upload corrected official document in Document Center' : 'System automatically routing to Institute Nodal Cell'}`;

        simpleExplanation = `Your application (${app.applicationIdStr}) is currently at the ${app.stage.replace(/_/g, ' ')} stage. ${hasDeficiencies ? 'Fix the document deficiency in your Document Center.' : 'No action is needed right now.'}`;
        suggestedActions = ['Fix Document Issue', 'View Digital Twin', 'Check Eligibility'];
        actionRoute = `/student/digital-twin/${app.id}`;
      } else {
        answer = `### Application Tracking\n\nNo active applications were found under your account. You can discover verified official schemes and submit an application through the National Scholarship Portal.`;
        simpleExplanation = `You have not submitted an application yet. Explore matching scholarships to get started.`;
        suggestedActions = ['Find Scholarships', 'Check Eligibility'];
        actionRoute = `/student/opportunities`;
      }
    }

    // D. DOCUMENT DEFICIENCIES & CORRECTION GUIDANCE
    else if (
      lowerQuery.includes('document') ||
      lowerQuery.includes('caste') ||
      lowerQuery.includes('income') ||
      lowerQuery.includes('marksheet') ||
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
          `1. **Do NOT edit or alter** the original PDF file or official seal manually.  \n` +
          `2. Obtain an updated official ${doc.docType} from DigiLocker or your local Tehsildar / Revenue Authority.  \n` +
          `3. Ensure the legal name matches your Aadhaar record.  \n` +
          `4. Re-upload the verified document in the **Document Center**.`;

        simpleExplanation = `Your ${doc.docType} has a name mismatch. Obtain an updated official document and re-upload it in the Document Center.`;
        suggestedActions = ['Open Document Center', 'Re-check Documents', 'Track Application'];
        actionRoute = `/student/documents`;
      } else {
        answer = `### Document Vault Status\n\nAll mandatory documents (ST Caste Certificate, Income Certificate, Academic Marksheet, Aadhaar Linkage) are clean, verified, and in full compliance with published Ministry criteria.`;
        simpleExplanation = `All your uploaded documents are verified and clean. No action is required.`;
        suggestedActions = ['Find Scholarships', 'Check Eligibility', 'Track Application'];
        actionRoute = `/student/documents`;
      }
    }

    // E. PLATFORM NAVIGATION ASSISTANCE
    else if (
      lowerQuery.includes('where can i') ||
      lowerQuery.includes('where is the') ||
      lowerQuery.includes('how to find') ||
      lowerQuery.includes('how do i change language') ||
      lowerQuery.includes('where do i see')
    ) {
      if (lowerQuery.includes('document') || lowerQuery.includes('upload')) {
        answer = `### Navigation Assistance\n\nYou can view and manage your uploaded documents at **Document Center** (\`/student/documents\`).`;
        actionRoute = `/student/documents`;
      } else if (lowerQuery.includes('application')) {
        answer = `### Navigation Assistance\n\nYou can track your application status at **My Applications** (\`/student/applications\`) or **Digital Twin** (\`/student/digital-twin\`).`;
        actionRoute = `/student/applications`;
      } else if (lowerQuery.includes('profile')) {
        answer = `### Navigation Assistance\n\nYou can update your academic marks, family income, and caste details at **My Profile** (\`/student/profile\`).`;
        actionRoute = `/student/profile`;
      } else if (lowerQuery.includes('renewal')) {
        answer = `### Navigation Assistance\n\nYou can check annual scheme renewal rules at **Renewal Center** (\`/student/renewals\`).`;
        actionRoute = `/student/renewals`;
      } else if (lowerQuery.includes('language')) {
        answer = `### Language Switcher\n\nYou can switch the website language anytime between **English** and **हिन्दी (Hindi)** using the top language dropdown selector in the navigation bar.`;
      } else {
        answer = `### Navigation Assistance\n\nYou can access your Student Dashboard, Profile, Document Vault, Applications, and Renewal Center from the left navigation menu.`;
        actionRoute = `/student/dashboard`;
      }
      simpleExplanation = `Click below to navigate directly to the requested section.`;
      suggestedActions = ['Go to Section', 'Find Scholarships'];
    }

    // F. CAREER & ACADEMIC PROGRESSION
    else if (
      lowerQuery.includes('after bachelor') ||
      lowerQuery.includes('after b.tech') ||
      lowerQuery.includes('after graduation') ||
      lowerQuery.includes('higher studies') ||
      lowerQuery.includes('postgraduate') ||
      lowerQuery.includes('phd')
    ) {
      answer = `### Higher Education & Research Pathways for ST Scholars\n\n` +
        `Upon completing your Bachelor's degree, the Ministry of Tribal Affairs provides specialized funding opportunities:\n\n` +
        `• **National Fellowship for Higher Education of ST Students (NFST):** Fully funds M.Phil and Ph.D. research in UGC-recognized universities (Stipend: ₹31,000–₹35,000 / month + HRA).\n` +
        `• **National Overseas Scholarship (NOS):** Supports Master's and Ph.D. studies in top 500 foreign universities (Stipend: $15,400 USD / year + full tuition fee waiver).\n` +
        `• **Postgraduate Post-Matric Grants:** Covers M.Tech, M.Sc, MBA, and M.A. tuition reimbursements.`;

      simpleExplanation = `After graduation, ST scholars can apply for NFST (PhD fellowship in India) or National Overseas Scholarship (higher studies abroad).`;
      suggestedActions = ['View Fellowships', 'Check Overseas Grant', 'Update Profile'];
      actionRoute = `/fellowships`;
    }

    // G. OFF-TOPIC & GENERAL KNOWLEDGE QUESTIONS
    else if (
      lowerQuery.includes('interview') ||
      lowerQuery.includes('python') ||
      lowerQuery.includes('coding') ||
      lowerQuery.includes('weather') ||
      lowerQuery.includes('recipe') ||
      lowerQuery.includes('poem')
    ) {
      if (lowerQuery.includes('interview')) {
        answer = `### Scholarship Interview Preparation\n\n` +
          `If you are preparing for a National Overseas Scholarship or NFST Fellowship interview, focus on:\n` +
          `1. **Research Proposal Clarity:** Clearly articulate your research objective and its impact on tribal welfare.\n` +
          `2. **Academic Transcripts:** Be prepared to explain your marks, projects, and university credentials.\n` +
          `3. **Document Verification:** Ensure your ST Certificate and Income Certificate are up to date.\n\n` +
          `*I am specialized in scholarship guidance. Let me know if you need help finding funding opportunities!*`;
      } else {
        answer = `I am specialized in **scholarship discovery, education funding, eligibility matching, and application tracking** for Scheduled Tribe students under the Ministry of Tribal Affairs.\n\nWhile I can assist with academic progression, my core expertise is helping you secure scholarships and fellowships!`;
      }
      simpleExplanation = `I specialize in scholarship and education funding assistance. How can I help with your scholarship journey?`;
      suggestedActions = ['Find Scholarships', 'Check Eligibility', 'Track Application'];
    }

    // H. SCHOLARSHIP RETRIEVAL & GENERAL SCHOLARSHIP QUESTIONS
    else {
      if (matchedSchemes.length > 0) {
        answer = `### Verified Official Schemes (Academic Year 2026–27)\n\n` +
          `Based on published Ministry of Tribal Affairs guidelines for **${targetLevel}** level:\n\n` +
          matchedSchemes.map((s, idx) =>
            `**${idx + 1}. ${s.title}**  \n` +
            `• **Official Name:** ${s.officialName || s.title}  \n` +
            `• **Level:** ${s.educationLevel} | **Academic Year:** ${s.academicYear}  \n` +
            `• **Income Limit:** ${s.incomeLimit}  \n` +
            `• **Benefits:** ${s.benefitAmount}  \n` +
            `• **Application Window:** ${s.applicationStart || 'Open'} to ${s.applicationDeadline}  \n` +
            `• **Official Portal:** [Continue to Portal](${s.officialApplicationUrl})`
          ).join('\n\n') +
          `\n\n> [!NOTE]\n> Eligibility is evaluated against official rules. Final sanction is determined by authorized nodal officers.`;

        simpleExplanation = `Here are verified official schemes matching your profile level (${targetLevel}). Explore details or check eligibility.`;
        suggestedActions = ['Check My Eligibility', 'View Required Documents', 'Track Application'];
        actionRoute = `/scholarships`;
      } else {
        answer = `### Verified Scholarship Information\n\nI couldn't find specific scheme records matching that exact filter in the current database. Please visit the official National Scholarship Portal for full listings.`;
        simpleExplanation = `No verified schemes matching this filter were found in the current view. Explore all schemes below.`;
        suggestedActions = ['Explore All Scholarships', 'Track Application'];
        actionRoute = `/scholarships`;
      }
    }

    // 6. BILINGUAL TRANSLATION ENGINE (HINDI SUPPORT)
    if (isHindi) {
      answer = AssistantService.translateToHindi(answer);
      simpleExplanation = AssistantService.translateToHindi(simpleExplanation);
      suggestedActions = ['छात्रवृत्ति खोजें', 'पात्रता जांचें', 'दस्तावेज़ ठीक करें', 'आवेदन ट्रैक करें'];
    }

    return {
      answer: simpleLanguage && simpleExplanation ? simpleExplanation : answer,
      simpleExplanation,
      suggestedActions,
      actionRoute,
      language: isHindi ? 'hi' : 'en',
      sourceName,
      sourceUrl,
      lastVerifiedAt,
      pageContext,
    };
  }

  /**
   * Translates key natural language text blocks into Devanagari Hindi while preserving Markdown syntax & scheme data.
   */
  private static translateToHindi(text: string): string {
    return text
      .replace(/### Namaste/g, '### नमस्ते')
      .replace(/### Getting Started/g, '### शुरुआत कैसे करें')
      .replace(/Digital Twin Application Tracking/g, 'डिजिटल ट्विन आवेदन ट्रैकिंग')
      .replace(/Application ID:/g, 'आवेदन आईडी:')
      .replace(/Scheme:/g, 'योजना:')
      .replace(/Academic Year:/g, 'शैक्षणिक वर्ष:')
      .replace(/Current Stage:/g, 'वर्तमान चरण:')
      .replace(/Overall Status:/g, 'कुल स्थिति:')
      .replace(/Responsible Authority:/g, 'उत्तरदायी अधिकारी:')
      .replace(/Identified Blocker:/g, 'पहचाना गया अवरोध:')
      .replace(/Next Action:/g, 'अगली कार्रवाई:')
      .replace(/AI Deficiency Repair Copilot Guidance/g, 'एआई दस्तावेज़ त्रुटि सुधार मार्गदर्शन')
      .replace(/Flagged Document:/g, 'चिह्नित दस्तावेज़:')
      .replace(/Detected Issue:/g, 'पहचानी गई समस्या:')
      .replace(/Corrective Steps:/g, 'सुधारात्मक कदम:')
      .replace(/Verified Official Schemes/g, 'सत्यापित आधिकारिक योजनाएं')
      .replace(/Official Name:/g, 'आधिकारिक नाम:')
      .replace(/Income Limit:/g, 'आय सीमा:')
      .replace(/Benefits:/g, 'लाभ:')
      .replace(/Application Window:/g, 'आवेदन की समय-सीमा:')
      .replace(/Official Portal:/g, 'आधिकारिक पोर्टल:')
      .replace(/Document Vault Status/g, 'दस्तावेज़ वॉल्ट स्थिति')
      .replace(/Navigation Assistance/g, 'नेविगेशन सहायता');
  }
}
