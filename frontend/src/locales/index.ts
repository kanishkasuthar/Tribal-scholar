/**
 * Centralized Multilingual Localization Dictionary for Tribal Scholar AI
 * Supporting English (en) & Hindi (hi) across the entire platform.
 */

export interface LocaleTranslations {
  // Navigation & Public Header
  govIndia: string;
  motaName: string;
  helpDesk: string;
  accessibility: string;
  home: string;
  scholarships: string;
  fellowships: string;
  trackJourney: string;
  resourcesHelp: string;
  aboutMoTA: string;
  signIn: string;
  register: string;
  studentPortal: string;
  dashboard: string;
  signOut: string;

  // Education Level Labels & Filters
  allLevels: string;
  school: string;
  diploma: string;
  undergraduate: string;
  postgraduate: string;
  research: string;
  professional: string;

  // Education Level Descriptions
  schoolDesc: string;
  diplomaDesc: string;
  ugDesc: string;
  pgDesc: string;
  researchDesc: string;
  professionalDesc: string;
  careerDesc: string;

  // Landing Page
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  exploreScholarships: string;
  viewDetails: string;
  applyNow: string;
  educationJourneyTitle: string;
  educationJourneySubtitle: string;
  digitalTwinBannerTitle: string;
  digitalTwinBannerSubtitle: string;
  deficiencyCopilotTitle: string;
  deficiencyCopilotSubtitle: string;
  processIntelligenceTitle: string;
  processIntelligenceSubtitle: string;

  // Scholarships & Discovery Page
  scholarshipPageTitle: string;
  scholarshipPageSubtitle: string;
  searchPlaceholder: string;
  filterLevel: string;
  filterType: string;
  filterState: string;
  minAmount: string;
  noResults: string;
  deadline: string;
  amount: string;
  perYear: string;
  eligibility: string;
  documentsRequired: string;

  // Student Portal Sidebar & Navigation
  myFunding: string;
  myProfile: string;
  matchedSchemes: string;
  documentCenter: string;
  deficiencyCopilot: string;
  applicationTwin: string;
  renewalCenter: string;
  progressTracker: string;
  academicRoadmap: string;
  grievances: string;
  reminders: string;
  notifications: string;
  settings: string;
  assistant: string;
  applications: string;

  // Student Profile Conditional Fields & Labels
  currentLevel: string;
  schoolStudent: string;
  ugStudent: string;
  pgStudent: string;
  researchStudent: string;
  schoolName: string;
  classGrade: string;
  boardName: string;
  degreeCourse: string;
  yearSemester: string;
  institutionName: string;
  academicPerformance: string;
  researchArea: string;
  researchInterestOptional: string;
  saveProfile: string;
  profileUpdated: string;
  personalInformation: string;
  casteCertificateNo: string;
  annualFamilyIncome: string;

  // Student Dashboard Adaptations
  recommendedScholarships: string;
  upcomingApplications: string;
  documentReadiness: string;
  academicProgress: string;
  applicationStatus: string;
  upcomingDeadlines: string;
  renewalAlerts: string;
  fellowshipsTitle: string;
  researchOpportunities: string;
  proposalDocuments: string;

  // Displayed Status Labels
  statusSubmitted: string;
  statusUnderReview: string;
  statusActionRequired: string;
  statusVerified: string;
  statusReturned: string;
  statusApproved: string;
  statusDisbursed: string;
  statusCompleted: string;

  // AI Assistant & Voice
  assistantTitle: string;
  assistantSubtitle: string;
  askAssistant: string;
  startVoice: string;
  listening: string;
  understanding: string;
  responding: string;
  simpleLanguage: string;
  highContrast: string;
  textSize: string;
  selectLanguage: string;

  // Validation & Messages
  requiredField: string;
  uploadIncome: string;
  uploadCaste: string;
  uploadMarksheet: string;
  enterValidEmail: string;
  enterValidPhone: string;

  // Admin & Institute Portals
  institutePortalTitle: string;
  adminPortalTitle: string;
  totalApplications: string;
  pendingVerification: string;
  deficienciesFlagged: string;
  disbursementsApproved: string;
  verifyStudent: string;
  flagDeficiency: string;
  actionCompleted: string;
  footerRights: string;
}

export const LOCALES: Record<'en' | 'hi', Record<string, string>> = {
  en: {
    // Navigation & Public Header
    govIndia: 'Government of India',
    motaName: 'Ministry of Tribal Affairs',
    helpDesk: 'Help Desk',
    accessibility: 'Accessibility',
    home: 'Home',
    scholarships: 'Scholarships',
    fellowships: 'Fellowships',
    trackJourney: 'Track Journey',
    resourcesHelp: 'Resources & Help',
    aboutMoTA: 'About MoTA',
    signIn: 'Sign In',
    register: 'Register',
    studentPortal: 'Student Portal',
    dashboard: 'Dashboard',
    signOut: 'Sign Out',

    // Education Level Labels & Filters
    allLevels: 'ALL LEVELS',
    school: 'SCHOOL',
    diploma: 'DIPLOMA / VOCATIONAL',
    undergraduate: 'UNDERGRADUATE',
    postgraduate: 'POSTGRADUATE',
    research: 'RESEARCH / PHD',
    professional: 'PROFESSIONAL',

    // Education Level Descriptions
    schoolDesc: 'Class 9 to 12 Pre-Matric & Post-Matric schemes',
    diplomaDesc: 'ITI, Polytechnic & Skill Vocational Grants',
    ugDesc: 'B.Tech, B.E., B.Sc., B.Com., B.A. & National Overseas Grants',
    pgDesc: 'M.Tech, M.E., M.Sc., M.Com., M.A., MBA Higher Studies Support',
    researchDesc: 'NFST Fellowship, M.Phil & PhD Research Funding',
    professionalDesc: 'Medical, Engineering, Law, Nursing & Management',
    careerDesc: 'Placement, Civil Services & Research Positions',

    // Landing Page
    heroBadge: 'Scholarship support for every stage of your education journey.',
    heroTitle: 'Intelligent Scholarship Support for Scheduled Tribe Students',
    heroSubtitle: 'From Class 9 secondary education to PhD research fellowships, MoTA supports every step of your academic progression with AI matching, deficiency repair, and seamless disbursement.',
    exploreScholarships: 'Explore Scholarships',
    viewDetails: 'View Details',
    applyNow: 'Apply Now',
    educationJourneyTitle: 'Complete Education Journey Support',
    educationJourneySubtitle: 'Empowering Scheduled Tribe students at every academic milestone from Class 9 to Postdoc.',
    digitalTwinBannerTitle: 'Autonomous Application Digital Twin',
    digitalTwinBannerSubtitle: 'Continuous verification and instant readiness scoring for guaranteed grant delivery.',
    deficiencyCopilotTitle: 'AI Deficiency Copilot',
    deficiencyCopilotSubtitle: 'Proactively identifies document mismatches and provides 1-click guided resolution.',
    processIntelligenceTitle: 'Process Intelligence Engine',
    processIntelligenceSubtitle: 'Real-time bottleneck detection and SLA tracking across institutional and ministry desks.',

    // Scholarships & Discovery Page
    scholarshipPageTitle: 'SCHOLARSHIPS & FELLOWSHIPS',
    scholarshipPageSubtitle: 'Opportunities across every stage of your education journey.',
    searchPlaceholder: 'Search scholarships by name, degree, level, state or keyword...',
    filterLevel: 'Education Level',
    filterType: 'Scholarship Type',
    filterState: 'State / UT',
    minAmount: 'Min Award Amount',
    noResults: 'No scholarships found matching your filter criteria.',
    deadline: 'Deadline',
    amount: 'Amount',
    perYear: 'per year',
    eligibility: 'Eligibility Criteria',
    documentsRequired: 'Required Documents',

    // Student Portal Sidebar & Navigation
    myFunding: 'My Funding Journey',
    myProfile: 'My Profile',
    matchedSchemes: 'AI Matched Schemes',
    documentCenter: 'Document Center',
    deficiencyCopilot: 'Deficiency Copilot',
    applicationTwin: 'Digital Twin',
    renewalCenter: 'Renewal Center',
    progressTracker: 'Academic Progress',
    academicRoadmap: 'Opportunity Roadmap',
    grievances: 'Grievance Desk',
    reminders: 'Deadline Reminders',
    notifications: 'Notifications',
    settings: 'Settings',
    assistant: 'AI Assistant',
    applications: 'My Applications',

    // Student Profile Conditional Fields & Labels
    currentLevel: 'Current Education Level',
    schoolStudent: 'School Student (Class 9-12)',
    ugStudent: 'Undergraduate (UG / Diploma / B.Tech / B.Sc / B.A)',
    pgStudent: 'Postgraduate (PG / M.Tech / M.Sc / M.A / MBA)',
    researchStudent: 'Research Scholar (M.Phil / PhD / Postdoc)',
    schoolName: 'School Name & District',
    classGrade: 'Current Class / Grade',
    boardName: 'Education Board (CBSE / ICSE / State Board)',
    degreeCourse: 'Degree / Course Name',
    yearSemester: 'Current Year / Semester',
    institutionName: 'University / College Name',
    academicPerformance: 'Academic Marks / CGPA (%)',
    researchArea: 'Research Area & Proposal Topic (Research Students Only)',
    researchInterestOptional: 'Research / Specialization Interests (Optional)',
    saveProfile: 'Save Profile Changes',
    profileUpdated: 'Student Profile updated successfully!',
    personalInformation: 'Personal & Category Details',
    casteCertificateNo: 'ST Caste Certificate Number',
    annualFamilyIncome: 'Annual Family Income (₹)',

    // Student Dashboard Adaptations
    recommendedScholarships: 'Recommended Scholarships for Your Level',
    upcomingApplications: 'Upcoming Application Deadlines',
    documentReadiness: 'Document Vault Readiness',
    academicProgress: 'Academic Progression Milestone',
    applicationStatus: 'Current Application Status',
    upcomingDeadlines: 'Impending Deadlines',
    renewalAlerts: 'Annual Scheme Renewals',
    fellowshipsTitle: 'Doctoral & Research Fellowships',
    researchOpportunities: 'Research & Publication Opportunities',
    proposalDocuments: 'Proposal & Research Verification',

    // Displayed Status Labels
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusActionRequired: 'Action Required',
    statusVerified: 'Verified',
    statusReturned: 'Returned for Correction',
    statusApproved: 'Approved',
    statusDisbursed: 'Disbursed',
    statusCompleted: 'Completed',

    // AI Assistant & Voice
    assistantTitle: 'Tribal Scholar AI Assistant',
    assistantSubtitle: 'Ask anything about your scholarship opportunities, eligibility, application status, or renewal rules.',
    askAssistant: 'Type or speak your question...',
    startVoice: 'Voice Input',
    listening: 'Listening to your voice...',
    understanding: 'Understanding query...',
    responding: 'Generating response...',
    simpleLanguage: 'Simple Explanation',
    highContrast: 'High Contrast Mode',
    textSize: 'Text Size',
    selectLanguage: 'Language Selector',

    // Validation & Messages
    requiredField: 'This field is required.',
    uploadIncome: 'Please upload your valid income certificate.',
    uploadCaste: 'Please upload your ST caste certificate.',
    uploadMarksheet: 'Please upload your latest academic marksheet.',
    enterValidEmail: 'Please enter a valid email address.',
    enterValidPhone: 'Please enter a valid 10-digit mobile number.',

    // Admin & Institute Portals
    institutePortalTitle: 'Nodal Institute Verification Desk',
    adminPortalTitle: 'Ministry Admin Management Portal',
    totalApplications: 'Total ST Applications Received',
    pendingVerification: 'Pending Desk Verification',
    deficienciesFlagged: 'Deficiencies Flagged by AI',
    disbursementsApproved: 'Direct Benefit Transfers Approved',
    verifyStudent: 'Verify Student Credentials',
    flagDeficiency: 'Flag Deficiency Notice',
    actionCompleted: 'Action executed successfully.',
    footerRights: 'All Rights Reserved. Designed for Ministry of Tribal Affairs, Government of India.',
  },

  hi: {
    // Navigation & Public Header
    govIndia: 'भारत सरकार',
    motaName: 'जनजातीय कार्य मंत्रालय',
    helpDesk: 'सहायता केंद्र',
    accessibility: 'सुगमता',
    home: 'होम',
    scholarships: 'छात्रवृत्तियाँ',
    fellowships: 'फेलोशिप',
    trackJourney: 'यात्रा ट्रैक करें',
    resourcesHelp: 'संसाधन और सहायता',
    aboutMoTA: 'जनजातीय कार्य मंत्रालय के बारे में',
    signIn: 'साइन इन',
    register: 'पंजीकरण',
    studentPortal: 'छात्र पोर्टल',
    dashboard: 'डैशबोर्ड',
    signOut: 'साइन आउट',

    // Education Level Labels & Filters
    allLevels: 'सभी स्तर',
    school: 'स्कूली शिक्षा',
    diploma: 'डिप्लोमा / व्यावसायिक',
    undergraduate: 'स्नातक (UG)',
    postgraduate: 'स्नातकोत्तर (PG)',
    research: 'शोध एवं पीएचडी',
    professional: 'व्यावसायिक शिक्षा',

    // Education Level Descriptions
    schoolDesc: 'कक्षा 9 से 12 तक प्री-मैट्रिक एवं पोस्ट-मैट्रिक योजनाएं',
    diplomaDesc: 'आईटीआई, पॉलिटेक्निक और कौशल विकास अनुदान',
    ugDesc: 'बी.टेक, बी.एससी, बी.कॉम, बी.ए. एवं राष्ट्रीय विदेशी अनुदान',
    pgDesc: 'एम.टेक, एम.एससी, एमबीए, एम.ए. उच्च शिक्षा सहायता',
    researchDesc: 'एनएफएसटी फेलोशिप, एम.फिल एवं पीएचडी शोध वित्तपोषण',
    professionalDesc: 'चिकित्सा, इंजीनियरिंग, कानून, नर्सिंग और प्रबंधन',
    careerDesc: 'प्लेसमेंट, सिविल सेवा और अनुसंधान पद',

    // Landing Page
    heroBadge: 'आपकी शिक्षा यात्रा के हर चरण के लिए छात्रवृत्ति सहायता।',
    heroTitle: 'अनुसूचित जनजाति के छात्रों के लिए बुद्धिमत्तापूर्ण छात्रवृत्ति सहायता',
    heroSubtitle: 'कक्षा 9 की स्कूली शिक्षा से लेकर पीएचडी शोध फेलोशिप तक, जनजातीय कार्य मंत्रालय AI मिलान, त्रुटि सुधार और सुगम भुगतान के साथ आपकी शैक्षणिक प्रगति का समर्थन करता है।',
    exploreScholarships: 'छात्रवृत्तियाँ देखें',
    viewDetails: 'विवरण देखें',
    applyNow: 'अभी आवेदन करें',
    educationJourneyTitle: 'संपूर्ण शिक्षा यात्रा में सहायता',
    educationJourneySubtitle: 'कक्षा 9 से लेकर पोस्टडॉक तक हर शैक्षणिक मील के पत्थर पर अनुसूचित जनजाति के छात्रों का सशक्तिकरण।',
    digitalTwinBannerTitle: 'स्वायत्त आवेदन डिजिटल ट्विन',
    digitalTwinBannerSubtitle: 'गारंटीकृत अनुदान वितरण के लिए निरंतर सत्यापन और तत्काल तैयारी स्कोरिंग।',
    deficiencyCopilotTitle: 'AI त्रुटि सुधार Copilot',
    deficiencyCopilotSubtitle: 'दस्तावेज़ विसंगतियों की सक्रिय रूप से पहचान करता है और 1-क्लिक निर्देशित समाधान प्रदान करता है।',
    processIntelligenceTitle: 'प्रक्रिया इंटेलिजेंस इंजन',
    processIntelligenceSubtitle: 'संस्थगत और मंत्रालय के स्तर पर वास्तविक समय की बाधा पहचान और सेवा स्तर ट्रैकिंग।',

    // Scholarships & Discovery Page
    scholarshipPageTitle: 'छात्रवृत्तियाँ और फेलोशिप',
    scholarshipPageSubtitle: 'आपकी शिक्षा यात्रा के हर चरण के लिए अवसर।',
    searchPlaceholder: 'नाम, डिग्री, स्तर, राज्य या कीवर्ड द्वारा छात्रवृत्ति खोजें...',
    filterLevel: 'शिक्षा का स्तर',
    filterType: 'छात्रवृत्ति का प्रकार',
    filterState: 'राज्य / केंद्र शासित प्रदेश',
    minAmount: 'न्यूनतम पुरस्कार राशि',
    noResults: 'आपके फ़िल्टर मानदंडों से मेल खाती कोई छात्रवृत्ति नहीं मिली।',
    deadline: 'अंतिम तिथि',
    amount: 'राशि',
    perYear: 'प्रति वर्ष',
    eligibility: 'पात्रता मानदंड',
    documentsRequired: 'आवश्यक दस्तावेज़',

    // Student Portal Sidebar & Navigation
    myFunding: 'मेरी छात्रवृत्ति यात्रा',
    myProfile: 'मेरी प्रोफ़ाइल',
    matchedSchemes: 'AI मिलान योजनाएं',
    documentCenter: 'दस्तावेज़ केंद्र',
    deficiencyCopilot: 'त्रुटि सुधार Copilot',
    applicationTwin: 'डिजिटल ट्विन',
    renewalCenter: 'नवीनीकरण केंद्र',
    progressTracker: 'शैक्षणिक प्रगति',
    academicRoadmap: 'अवसर रोडमैप',
    grievances: 'शिकायत निवारण',
    reminders: 'समय सीमा स्मरणपत्र',
    notifications: 'सूचनाएँ',
    settings: 'सेटिंग्स',
    assistant: 'AI सहायक',
    applications: 'मेरे आवेदन',

    // Student Profile Conditional Fields & Labels
    currentLevel: 'वर्तमान शिक्षा का स्तर',
    schoolStudent: 'स्कूली छात्र (कक्षा 9-12)',
    ugStudent: 'स्नातक (UG / डिप्लोमा / बी.टेक / बी.एससी / बी.ए)',
    pgStudent: 'स्नातकोत्तर (PG / एम.टेक / एम.एससी / एम.ए / एमबीए)',
    researchStudent: 'शोधार्थी (एम.फिल / पीएचडी / पोस्टडॉक)',
    schoolName: 'स्कूल का नाम और जिला',
    classGrade: 'वर्तमान कक्षा / ग्रेड',
    boardName: 'शिक्षा बोर्ड (सीबीएसई / आईसीएसई / राज्य बोर्ड)',
    degreeCourse: 'डिग्री / पाठ्यक्रम का नाम',
    yearSemester: 'वर्तमान वर्ष / सेमेस्टर',
    institutionName: 'विश्वविद्यालय / कॉलेज का नाम',
    academicPerformance: 'शैक्षणिक अंक / सीजीपीए (%)',
    researchArea: 'शोध क्षेत्र एवं प्रस्ताव विषय (केवल शोध छात्रों के लिए)',
    researchInterestOptional: 'शोध / विशेषज्ञता की रुचि (ऐच्छिक)',
    saveProfile: 'प्रोफ़ाइल परिवर्तन सहेजें',
    profileUpdated: 'छात्र प्रोफ़ाइल सफलतापूर्वक अद्यतन की गई!',
    personalInformation: 'व्यक्तिगत और श्रेणी विवरण',
    casteCertificateNo: 'जनजाति (ST) प्रमाण पत्र संख्या',
    annualFamilyIncome: 'वार्षिक पारिवारिक आय (₹)',

    // Student Dashboard Adaptations
    recommendedScholarships: 'आपके स्तर के लिए अनुशंसित छात्रवृत्तियाँ',
    upcomingApplications: 'आगामी आवेदन समय सीमाएं',
    documentReadiness: 'दस्तावेज़ वॉल्ट तैयारी',
    academicProgress: 'शैक्षणिक प्रगति का मील का पत्थर',
    applicationStatus: 'वर्तमान आवेदन की स्थिति',
    upcomingDeadlines: 'निकटतम समय सीमाएं',
    renewalAlerts: 'वार्षिक योजना नवीनीकरण',
    fellowshipsTitle: 'डॉक्टरेट एवं शोध फेलोशिप',
    researchOpportunities: 'अनुसंधान एवं प्रकाशन के अवसर',
    proposalDocuments: 'प्रस्ताव एवं शोध सत्यापन',

    // Displayed Status Labels
    statusSubmitted: 'जमा किया गया',
    statusUnderReview: 'समीक्षाधीन',
    statusActionRequired: 'कार्रवाई आवश्यक',
    statusVerified: 'सत्यापित',
    statusReturned: 'सुधार हेतु वापस किया गया',
    statusApproved: 'स्वीकृत',
    statusDisbursed: 'भुगतान किया गया',
    statusCompleted: 'पूर्ण',

    // AI Assistant & Voice
    assistantTitle: 'ट्राइबल स्कॉलर AI सहायक',
    assistantSubtitle: 'अपनी छात्रवृत्ति के अवसरों, पात्रता, आवेदन की स्थिति या नवीनीकरण नियमों के बारे में कुछ भी पूछें।',
    askAssistant: 'अपना प्रश्न टाइप करें या बोलें...',
    startVoice: 'आवाज़ से पूछें',
    listening: 'आपकी आवाज़ सुन रहा हूँ...',
    understanding: 'प्रश्न समझ रहा हूँ...',
    responding: 'उत्तर तैयार कर रहा हूँ...',
    simpleLanguage: 'सरल भाषा विवरण',
    highContrast: 'उच्च कंट्रास्ट मोड',
    textSize: 'अक्षर का आकार',
    selectLanguage: 'भाषा चयनकर्ता',

    // Validation & Messages
    requiredField: 'यह क्षेत्र अनिवार्य है।',
    uploadIncome: 'कृपया अपना वैध आय प्रमाण पत्र अपलोड करें।',
    uploadCaste: 'कृपया अपना एसटी जनजाति प्रमाण पत्र अपलोड करें।',
    uploadMarksheet: 'कृपया अपनी नवीनतम शैक्षणिक अंक तालिका अपलोड करें।',
    enterValidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें।',
    enterValidPhone: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।',

    // Admin & Institute Portals
    institutePortalTitle: 'नोडल संस्थान सत्यापन डेस्क',
    adminPortalTitle: 'मंत्रालय व्यवस्थापक प्रबंधन पोर्टल',
    totalApplications: 'प्राप्त कुल एसटी आवेदन',
    pendingVerification: 'सत्यापन लंबित',
    deficienciesFlagged: 'AI द्वारा चिह्नित त्रुटियाँ',
    disbursementsApproved: 'स्वीकृत प्रत्यक्ष लाभ हस्तांतरण (DBT)',
    verifyStudent: 'छात्र क्रेडेंशियल सत्यापित करें',
    flagDeficiency: 'त्रुटि नोटिस चिह्नित करें',
    actionCompleted: 'कार्रवाई सफलतापूर्वक निष्पादित की गई।',
    footerRights: 'सर्वाधिकार सुरक्षित। जनजातीय कार्य मंत्रालय, भारत सरकार के लिए डिजाइन किया गया।',
  }
};

export const getTranslation = (lang: 'en' | 'hi', key: keyof LocaleTranslations, fallback?: string): string => {
  if (LOCALES[lang] && LOCALES[lang][key]) {
    return LOCALES[lang][key];
  }
  if (LOCALES.en[key]) {
    return LOCALES.en[key];
  }
  return fallback || key;
};
