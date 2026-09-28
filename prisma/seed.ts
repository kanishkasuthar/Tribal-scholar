import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Tribal Scholar AI Database Seeding...');

  // Clean database
  await prisma.auditLog.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.renewalRequirement.deleteMany();
  await prisma.scholarshipRenewal.deleteMany();
  await prisma.studentProgress.deleteMany();
  await prisma.researchInterest.deleteMany();
  await prisma.renewal.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.applicationTask.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.deficiencyResolution.deleteMany();
  await prisma.documentDeficiency.deleteMany();
  await prisma.extractedDocumentField.deleteMany();
  await prisma.documentCheck.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.document.deleteMany();
  await prisma.fellowship.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.institute.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('student123', 10);
  const hashedOfficerPassword = await bcrypt.hash('officer123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  // 1. Create Users
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@tribalscholar.gov.in',
      password: hashedPassword,
      name: 'Kanishka Suthar',
      role: 'STUDENT',
      mobile: '+91 98765 43210 (Demo)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  });

  const studentUser2 = await prisma.user.create({
    data: {
      email: 'birsa.munda@tribalscholar.gov.in',
      password: hashedPassword,
      name: 'Birsa Munda',
      role: 'STUDENT',
      mobile: '+91 94321 87654 (Demo)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
  });

  const studentUser3 = await prisma.user.create({
    data: {
      email: 'sunita.oraon@tribalscholar.gov.in',
      password: hashedPassword,
      name: 'Sunita Oraon',
      role: 'STUDENT',
      mobile: '+91 91234 56789 (Demo)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    },
  });

  const instituteOfficerUser = await prisma.user.create({
    data: {
      email: 'officer@nitrkl.ac.in',
      password: hashedOfficerPassword,
      name: 'Dr. Ramesh Chandra',
      role: 'INSTITUTE',
      mobile: '+91 98111 22334 (Demo)',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tribal.gov.in',
      password: hashedAdminPassword,
      name: 'Rajeshwar Naik',
      role: 'ADMIN',
      mobile: '+91 99999 88888 (Demo)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
  });

  // 2. Student Profiles
  await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      stCategory: 'Scheduled Tribe (Santhal)',
      subTribe: 'Santhal',
      state: 'Odisha',
      district: 'Sundargarh',
      pincode: '770037',
      familyIncome: 180000,
      fatherName: 'Ramesh Suthar',
      gender: 'Female',
      dob: '2003-05-14',
      degreeLevel: 'Undergraduate',
      courseName: 'B.Tech Computer Science & Engineering',
      institutionName: 'National Institute of Technology Rourkela',
      institutionCode: 'NITR-769008',
      currentYear: 3,
      semester: 5,
      academicMarks: 8.6,
      bankAccount: '987654321012',
      bankIfsc: 'SBIN0002110',
      bankName: 'State Bank of India',
      aadharLinked: true,
      researchInterest: 'Artificial Intelligence & Tribal Welfare Tech',
      careerInterest: 'Software Engineering & Public Technology',
      scholarshipHistory: 'Post-Matric ST Scholarship 2024 (Disbursed)',
    },
  });

  await prisma.studentProfile.create({
    data: {
      userId: studentUser2.id,
      stCategory: 'Scheduled Tribe (Munda)',
      subTribe: 'Munda',
      state: 'Jharkhand',
      district: 'Ranchi',
      pincode: '834001',
      familyIncome: 140000,
      fatherName: 'Soman Munda',
      gender: 'Male',
      dob: '2001-11-20',
      degreeLevel: 'Postgraduate',
      courseName: 'M.Sc Data Science',
      institutionName: 'Ranchi University',
      institutionCode: 'RU-834001',
      currentYear: 2,
      semester: 3,
      academicMarks: 8.9,
      bankAccount: '112233445566',
      bankIfsc: 'CNRB0001234',
      bankName: 'Canara Bank',
      aadharLinked: true,
      researchInterest: 'Predictive Analytics for Rural Development',
      careerInterest: 'Data Science Specialist',
      scholarshipHistory: 'National Fellowship for ST Students 2024',
    },
  });

  await prisma.studentProfile.create({
    data: {
      userId: studentUser3.id,
      stCategory: 'Scheduled Tribe (Oraon)',
      subTribe: 'Oraon',
      state: 'Chhattisgarh',
      district: 'Jaspur',
      pincode: '496331',
      familyIncome: 210000,
      fatherName: 'Budhu Oraon',
      gender: 'Female',
      dob: '2004-02-10',
      degreeLevel: 'Undergraduate',
      courseName: 'MBBS',
      institutionName: 'AIIMS Raipur',
      institutionCode: 'AIIMSR-492099',
      currentYear: 2,
      semester: 4,
      academicMarks: 82.5,
      bankAccount: '556677889900',
      bankIfsc: 'PUNB0123400',
      bankName: 'Punjab National Bank',
      aadharLinked: true,
      researchInterest: 'Tribal Healthcare & Epidemiology',
      careerInterest: 'Medical Officer / Clinical Researcher',
      scholarshipHistory: 'Top Class Education for ST Students 2024',
    },
  });

  // 3. Create Institutes
  const nitRourkela = await prisma.institute.create({
    data: {
      code: 'NITR-769008',
      name: 'National Institute of Technology Rourkela',
      state: 'Odisha',
      district: 'Sundargarh',
      nodalOfficerName: 'Dr. Ramesh Chandra',
      nodalOfficerEmail: 'officer@nitrkl.ac.in',
    },
  });

  await prisma.institute.create({
    data: {
      code: 'RU-834001',
      name: 'Ranchi University',
      state: 'Jharkhand',
      district: 'Ranchi',
      nodalOfficerName: 'Prof. Anil Kumar',
      nodalOfficerEmail: 'nodal@ranchiuniversity.ac.in',
    },
  });

  // 4. Create Scholarships (15+ items)
  const sch1 = await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-001',
      title: 'National Overseas Scholarship for ST Students 2026',
      type: 'SCHOLARSHIP',
      provider: 'Ministry of Tribal Affairs',
      category: 'Scheduled Tribes',
      degreeLevel: 'Postgraduate / Doctorate',
      maxIncome: 600000,
      minMarksPercentage: 60.0,
      benefitAmount: '₹15,400 USD / year + Tuition Fee & Travel Allowance',
      deadline: '2026-10-31',
      description: 'Provides financial assistance to selected ST students for pursuing Master’s level courses, Ph.D. and Post-Doctoral research programmes abroad.',
      requiredDocs: 'ST Certificate, Income Certificate, Passport Copy, Admission Letter, Academic Transcripts, Recommendation Letter',
      status: 'ACTIVE',
    },
  });

  const sch2 = await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-002',
      title: 'Top Class Education Scheme for ST Students',
      type: 'SCHOLARSHIP',
      provider: 'Ministry of Tribal Affairs',
      category: 'Scheduled Tribes',
      degreeLevel: 'Undergraduate',
      maxIncome: 600000,
      minMarksPercentage: 65.0,
      benefitAmount: 'Full Tuition Fee + ₹45,000 / annum living allowance + ₹5,000 computer grant',
      deadline: '2026-11-15',
      description: 'Fully funds premier institutes like IITs, NITs, IIMs, AIIMS, and NLUs for bright ST undergraduate students.',
      requiredDocs: 'ST Certificate, Family Income Certificate, JEE/NEET Rank Card, Institution Bonafide Certificate, Bank Passbook',
      status: 'ACTIVE',
    },
  });

  const sch3 = await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-003',
      title: 'Post-Matric Scholarship for ST Students (State & Central)',
      type: 'SCHOLARSHIP',
      provider: 'State Government & Ministry of Tribal Affairs',
      category: 'Scheduled Tribes',
      degreeLevel: 'Undergraduate / Diploma',
      maxIncome: 250000,
      minMarksPercentage: 50.0,
      benefitAmount: '₹1,20,000 / year + Maintenance Allowance',
      deadline: '2026-09-30',
      description: 'Comprehensive financial support for post-secondary education of ST students studying in recognized schools/universities.',
      requiredDocs: 'ST Certificate, Income Certificate, Marksheet of Last Qualifying Exam, Bonafide Certificate, Aadhaar Copy',
      status: 'ACTIVE',
    },
  });

  const sch4 = await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-004',
      title: 'National Fellowship & Scholarship for Higher Education of ST Students',
      type: 'FELLOWSHIP',
      provider: 'Ministry of Tribal Affairs',
      category: 'Scheduled Tribes',
      degreeLevel: 'Doctorate',
      maxIncome: 600000,
      minMarksPercentage: 55.0,
      benefitAmount: '₹31,000 / month JRF + ₹35,000 / month SRF + HRA + Contingency',
      deadline: '2026-12-01',
      description: 'Supports ST candidates pursuing regular and full-time M.Phil. and Ph.D. courses in Sciences, Humanities, Engineering, and Technology.',
      requiredDocs: 'ST Certificate, M.Phil/Ph.D. Admission Letter, Research Proposal, Master’s Degree Certificate, Caste Verification',
      status: 'ACTIVE',
    },
  });

  const sch5 = await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-005',
      title: 'Pre-Matric Scholarship Scheme for ST Students (Class IX & X)',
      type: 'SCHOLARSHIP',
      provider: 'Ministry of Tribal Affairs',
      category: 'Scheduled Tribes',
      degreeLevel: 'Secondary School',
      maxIncome: 250000,
      minMarksPercentage: 40.0,
      benefitAmount: '₹3,500 / year (Hostellers) / ₹2,250 (Day Scholars)',
      deadline: '2026-10-15',
      description: 'Reduces school dropout rates among ST students of Class 9 and 10 and improves enrollment ratios.',
      requiredDocs: 'ST Certificate, Income Certificate, Previous Class Report Card, Bank Account Details',
      status: 'ACTIVE',
    },
  });

  await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-006',
      title: 'Eklavya Model Residential School Merit Scholarship',
      type: 'SCHOLARSHIP',
      provider: 'National Education Society for Tribal Students (NESTS)',
      category: 'Scheduled Tribes',
      degreeLevel: 'Secondary / Senior Secondary',
      maxIncome: 200000,
      minMarksPercentage: 75.0,
      benefitAmount: '₹50,000 / annum + Higher Studies Mentorship',
      deadline: '2026-11-01',
      description: 'Incentivizes academic excellence among students from Eklavya Model Residential Schools (EMRS) across India.',
      requiredDocs: 'EMRS School ID, ST Certificate, Class 10/12 Board Marksheet, Aadhaar',
      status: 'ACTIVE',
    },
  });

  await prisma.scholarship.create({
    data: {
      code: 'ST-SCH-007',
      title: 'Tribal Innovation & Research Excellence Grant 2026',
      type: 'FELLOWSHIP',
      provider: 'Ministry of Tribal Affairs & Department of Science & Technology',
      category: 'Scheduled Tribes',
      degreeLevel: 'Postgraduate / Doctorate',
      maxIncome: 500000,
      minMarksPercentage: 70.0,
      benefitAmount: '₹2,50,000 Project Seed Fund + ₹20,000 Monthly Research Stipend',
      deadline: '2026-12-15',
      description: 'Grants for ST researchers developing technology solutions for indigenous health, agriculture, handicraft, and sustainable forestry.',
      requiredDocs: 'ST Certificate, Project Synopsis, Institution Endorsement, Recommendation Letter',
      status: 'ACTIVE',
    },
  });

  // 5. Create Fellowships (8+ items)
  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-001',
      title: 'National Fellowship for ST Students (M.Phil & Ph.D)',
      field: 'All Academic Disciplines',
      degreeLevel: 'Doctorate / M.Phil',
      monthlyStipend: '₹31,000 / month (JRF) / ₹35,000 / month (SRF)',
      contingencyAmount: '₹25,000 / annum (Humanities) / ₹30,000 / annum (Science)',
      durationMonths: 60,
      description: 'Pivotal national scheme providing financial backing for 750 ST scholars every year pursuing doctoral degrees.',
      eligibilityCriteria: 'ST Category Certificate, Valid Registration in Ph.D. at UGC recognized university, Family Income < 6 Lakhs/year.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-002',
      title: 'Post-Doctoral Fellowship for ST Scholars in STEM',
      field: 'Science, Technology, Engineering & Mathematics',
      degreeLevel: 'Post-Doctoral',
      monthlyStipend: '₹54,000 / month + HRA',
      contingencyAmount: '₹2,00,000 / annum',
      durationMonths: 36,
      description: 'Encourages advanced research careers among ST PhD holders in leading national labs (CSIR, IITs, IISc).',
      eligibilityCriteria: 'PhD degree awarded in last 3 years, ST Certificate, Published Research Papers in Indexed Journals.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-003',
      title: 'ICSSR-MoTA Senior Tribal Culture & Governance Fellowship',
      field: 'Social Sciences, Tribal Studies & Anthropology',
      degreeLevel: 'Doctorate / Senior Research',
      monthlyStipend: '₹40,000 / month',
      contingencyAmount: '₹50,000 / annum',
      durationMonths: 24,
      description: 'Promotes deep documentation and research into tribal governance, languages, indigenous knowledge systems, and land rights.',
      eligibilityCriteria: 'Master’s degree with 55% marks, ST Certificate, Approved research proposal on Tribal Heritage/Policy.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-004',
      title: 'DST-MoTA Young Tribal Scientist Fellowship in Clean Energy',
      field: 'STEM & Renewable Energy Technology',
      degreeLevel: 'Post-Doctoral',
      monthlyStipend: '₹58,000 / month + HRA',
      contingencyAmount: '₹3,00,000 / annum',
      durationMonths: 36,
      description: 'Fosters cutting-edge research in solar, biomass, and micro-grid energy systems for remote tribal habitations.',
      eligibilityCriteria: 'PhD in Engineering/Physics, ST Category Certificate, Institutional Endorsement from IIT or IISc.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-005',
      title: 'National Overseas Doctoral Research Fellowship for ST Scholars',
      field: 'International Studies & STEM',
      degreeLevel: 'Doctorate / Master’s',
      monthlyStipend: '$1,540 USD / month + Tuition Fee Waiver',
      contingencyAmount: '$1,800 USD / annum Equipment Allowance',
      durationMonths: 48,
      description: 'Full overseas funding for top-ranking ST students admitted to QS Top 500 Global Universities.',
      eligibilityCriteria: 'Admission letter from QS Top 500 University, ST Certificate, Family Income < ₹6,00,000/year.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-006',
      title: 'ICMR-MoTA Indigenous Tribal Health & Epidemiology Research Fellowship',
      field: 'Medical Sciences & Public Health',
      degreeLevel: 'Doctorate / Post-Graduate',
      monthlyStipend: '₹35,000 / month (SRF) + HRA',
      contingencyAmount: '₹1,00,000 / annum Fieldwork Grant',
      durationMonths: 36,
      description: 'Supports medical and public health researchers investigating sickle cell disease, malnutrition, and endemic tribal health challenges.',
      eligibilityCriteria: 'MBBS/MD/M.Sc Medical Science with 60% marks, ST Category Certificate, ICMR/AIIMS Research Approval.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-007',
      title: 'NESTS Tribal Education Systems Innovation Fellowship',
      field: 'Humanities & Education Policy',
      degreeLevel: 'M.Phil / Doctorate',
      monthlyStipend: '₹31,000 / month + HRA',
      contingencyAmount: '₹40,000 / annum',
      durationMonths: 24,
      description: 'Research grant for developing multilingual pedagogy and digital learning tools for Eklavya Model Residential Schools.',
      eligibilityCriteria: 'Master’s degree in Education/Linguistics with 55% marks, ST Certificate.',
      status: 'ACTIVE',
    },
  });

  await prisma.fellowship.create({
    data: {
      code: 'ST-FEL-008',
      title: 'CSIR-MoTA Forest Ecology & Sustainable Tribal Livelihoods Fellowship',
      field: 'Environmental Science & Forestry',
      degreeLevel: 'Doctorate / Post-Doctoral',
      monthlyStipend: '₹42,000 / month + HRA',
      contingencyAmount: '₹1,50,000 / annum Laboratory & Field Grant',
      durationMonths: 36,
      description: 'Dedicated fellowship for researchers formulating sustainable harvesting policies for Minor Forest Produce (MFP) and agro-forestry.',
      eligibilityCriteria: 'M.Sc Forestry/Botany/Environmental Science with 60% marks, ST Certificate.',
      status: 'ACTIVE',
    },
  });

  // 6. Documents for Student Kanishka Suthar
  // Scenario B: Name Mismatch (ST Certificate)
  const docST = await prisma.document.create({
    data: {
      userId: studentUser.id,
      docType: 'ST Certificate',
      fileName: 'st_caste_certificate_kanishka.pdf',
      fileUrl: '/uploads/st_caste_certificate_kanishka.pdf',
      fileSize: 450000,
      mimeType: 'application/pdf',
      status: 'NEEDS_ATTENTION',
      issueType: 'NAME_MISMATCH',
      issueDescription: 'The certificate shows "Kanishka S." whereas application profile registration is "Kanishka Suthar".',
      aiChecksJson: JSON.stringify({
        readability: 'PASSED',
        completeness: 'PASSED',
        expiry: 'PASSED',
        consistency: 'WARNING',
        isDemoAnalysis: true,
      }),
    },
  });

  await prisma.documentVersion.create({
    data: {
      documentId: docST.id,
      versionNum: 1,
      fileName: docST.fileName,
      fileUrl: docST.fileUrl,
      fileSize: docST.fileSize,
      mimeType: docST.mimeType,
    },
  });

  await prisma.extractedDocumentField.createMany({
    data: [
      { documentId: docST.id, fieldName: 'applicantName', extractedValue: 'Kanishka S.', confidence: 0.96 },
      { documentId: docST.id, fieldName: 'fatherName', extractedValue: 'Ramesh Suthar', confidence: 0.94 },
      { documentId: docST.id, fieldName: 'casteCategory', extractedValue: 'Scheduled Tribe (Santhal)', confidence: 0.98 },
      { documentId: docST.id, fieldName: 'certificateNo', extractedValue: 'ST/2023/88102', confidence: 0.95 },
    ],
  });

  await prisma.documentCheck.createMany({
    data: [
      { documentId: docST.id, checkType: 'READABILITY', status: 'PASSED', message: 'Document text is clear and readable.' },
      { documentId: docST.id, checkType: 'COMPLETENESS', status: 'PASSED', message: 'Required information appears present.' },
      { documentId: docST.id, checkType: 'EXPIRY', status: 'PASSED', message: 'No immediate validity issue detected.' },
      { documentId: docST.id, checkType: 'CONSISTENCY', status: 'WARNING', message: 'Possible mismatch: Application "Kanishka Suthar" vs Document "Kanishka S."' },
    ],
  });

  const defST = await prisma.documentDeficiency.create({
    data: {
      documentId: docST.id,
      type: 'NAME_MISMATCH',
      severity: 'WARNING',
      description: 'The name visible in the uploaded ST Certificate ("Kanishka S.") differs from the name in your application profile ("Kanishka Suthar").',
      resolutionGuidance: 'Upload a corrected official ST Certificate or an expanded name affidavit endorsed by Tehsildar.',
      status: 'OPEN',
    },
  });

  // Scenario A: Clean Document (Income Certificate)
  const docIncome = await prisma.document.create({
    data: {
      userId: studentUser.id,
      docType: 'Income Certificate',
      fileName: 'family_income_certificate_2025-26.pdf',
      fileUrl: '/uploads/family_income_certificate_2025-26.pdf',
      fileSize: 320000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      aiChecksJson: JSON.stringify({
        readability: 'PASSED',
        completeness: 'PASSED',
        expiry: 'PASSED',
        consistency: 'PASSED',
        isDemoAnalysis: true,
      }),
    },
  });

  await prisma.documentVersion.create({
    data: {
      documentId: docIncome.id,
      versionNum: 1,
      fileName: docIncome.fileName,
      fileUrl: docIncome.fileUrl,
      fileSize: docIncome.fileSize,
      mimeType: docIncome.mimeType,
    },
  });

  await prisma.extractedDocumentField.createMany({
    data: [
      { documentId: docIncome.id, fieldName: 'applicantName', extractedValue: 'Kanishka Suthar', confidence: 0.98 },
      { documentId: docIncome.id, fieldName: 'incomeAmount', extractedValue: '180000', confidence: 0.97 },
      { documentId: docIncome.id, fieldName: 'certificateNo', extractedValue: 'INC/2025/4412', confidence: 0.96 },
    ],
  });

  await prisma.documentCheck.createMany({
    data: [
      { documentId: docIncome.id, checkType: 'READABILITY', status: 'PASSED', message: 'Document text is clear.' },
      { documentId: docIncome.id, checkType: 'COMPLETENESS', status: 'PASSED', message: 'Required information appears present.' },
      { documentId: docIncome.id, checkType: 'EXPIRY', status: 'PASSED', message: 'No immediate validity issue detected.' },
      { documentId: docIncome.id, checkType: 'CONSISTENCY', status: 'PASSED', message: 'Information in uploaded document appears consistent.' },
    ],
  });

  // Scenario C: Marks Card
  const docMarks = await prisma.document.create({
    data: {
      userId: studentUser.id,
      docType: 'Marks Card',
      fileName: 'nit_rourkela_sem4_marksheet.pdf',
      fileUrl: '/uploads/nit_rourkela_sem4_marksheet.pdf',
      fileSize: 580000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      aiChecksJson: JSON.stringify({
        readability: 'PASSED',
        completeness: 'PASSED',
        expiry: 'PASSED',
        consistency: 'PASSED',
        isDemoAnalysis: true,
      }),
    },
  });

  await prisma.documentVersion.create({
    data: {
      documentId: docMarks.id,
      versionNum: 1,
      fileName: docMarks.fileName,
      fileUrl: docMarks.fileUrl,
      fileSize: docMarks.fileSize,
      mimeType: docMarks.mimeType,
    },
  });

  // Scenario D: Bonafide Certificate
  const docBonafide = await prisma.document.create({
    data: {
      userId: studentUser.id,
      docType: 'Bonafide Certificate',
      fileName: 'nitrkl_bonafide_2025-26.pdf',
      fileUrl: '/uploads/nitrkl_bonafide_2025-26.pdf',
      fileSize: 210000,
      mimeType: 'application/pdf',
      status: 'VERIFIED',
      aiChecksJson: JSON.stringify({
        readability: 'PASSED',
        completeness: 'PASSED',
        expiry: 'PASSED',
        consistency: 'PASSED',
        isDemoAnalysis: true,
      }),
    },
  });

  await prisma.documentVersion.create({
    data: {
      documentId: docBonafide.id,
      versionNum: 1,
      fileName: docBonafide.fileName,
      fileUrl: docBonafide.fileUrl,
      fileSize: docBonafide.fileSize,
      mimeType: docBonafide.mimeType,
    },
  });



  // 7. Applications for Student Kanishka Suthar (Phase 3 Demo Scenarios)

  // Scenario A: TSA-2026-000124 — Under Institute Verification
  const appA = await prisma.application.create({
    data: {
      applicationIdStr: 'TSA-2026-000124',
      userId: studentUser.id,
      scholarshipId: sch2.id,
      stage: 'INSTITUTE_VERIFICATION',
      overallStatus: 'Under Institute Verification',
      currentAuthority: 'Institute Nodal Verification Cell (NIT Rourkela)',
      totalAmount: '₹1,65,000 / year',
      submittedAt: new Date('2026-09-20T10:30:00Z'),
    },
  });

  await prisma.applicationStatusHistory.createMany({
    data: [
      {
        applicationId: appA.id,
        stage: 'DRAFT',
        status: 'Draft Created',
        updatedBy: 'Kanishka Suthar',
        actorRole: 'STUDENT',
        comments: 'Application draft created for Top Class Education Scheme.',
        createdAt: new Date('2026-09-18T09:00:00Z'),
      },
      {
        applicationId: appA.id,
        stage: 'SUBMITTED',
        status: 'Application Submitted',
        updatedBy: 'Kanishka Suthar',
        actorRole: 'STUDENT',
        comments: 'Application submitted with all mandatory verified documents.',
        createdAt: new Date('2026-09-20T10:30:00Z'),
      },
      {
        applicationId: appA.id,
        stage: 'DOCUMENT_REVIEW',
        status: 'AI Document Review Passed',
        updatedBy: 'System AI Engine',
        actorRole: 'SYSTEM',
        comments: 'Automated AI checks complete. Document readiness score: 100%.',
        createdAt: new Date('2026-09-20T10:32:00Z'),
      },
      {
        applicationId: appA.id,
        stage: 'INSTITUTE_VERIFICATION',
        status: 'Institute Verification In Progress',
        updatedBy: 'Dr. Ramesh Chandra',
        actorRole: 'INSTITUTE',
        comments: 'Assigned to Dr. Ramesh Chandra (Nodal Verification Officer, NIT Rourkela). Awaiting final seal.',
        createdAt: new Date('2026-09-21T14:15:00Z'),
      },
    ],
  });

  // Scenario B: TSA-2026-000125 — Returned for Correction
  const appB = await prisma.application.create({
    data: {
      applicationIdStr: 'TSA-2026-000125',
      userId: studentUser.id,
      scholarshipId: sch4.id,
      stage: 'RETURNED_FOR_CORRECTION',
      overallStatus: 'Action Required — Returned for Correction',
      currentAuthority: 'Student / Applicant',
      totalAmount: '₹31,000 / month',
      remarks: 'The name visible in the uploaded ST Certificate ("Kanishka S.") differs from your application profile ("Kanishka Suthar"). Please upload a corrected certificate or supporting affidavit.',
      submittedAt: new Date('2026-09-22T11:00:00Z'),
    },
  });

  await prisma.applicationStatusHistory.createMany({
    data: [
      {
        applicationId: appB.id,
        stage: 'SUBMITTED',
        status: 'Application Submitted',
        updatedBy: 'Kanishka Suthar',
        actorRole: 'STUDENT',
        comments: 'Submitted application for National Fellowship for ST Scholars.',
        createdAt: new Date('2026-09-22T11:00:00Z'),
      },
      {
        applicationId: appB.id,
        stage: 'INSTITUTE_VERIFICATION',
        status: 'Under Institute Verification',
        updatedBy: 'Dr. Ramesh Chandra',
        actorRole: 'INSTITUTE',
        comments: 'Reviewing ST Caste certificate against University records.',
        createdAt: new Date('2026-09-23T09:30:00Z'),
      },
      {
        applicationId: appB.id,
        stage: 'RETURNED_FOR_CORRECTION',
        status: 'Returned for Correction',
        updatedBy: 'Dr. Ramesh Chandra',
        actorRole: 'INSTITUTE',
        comments: 'Document discrepancy: Name mismatch on ST Certificate ("Kanishka S."). Action required by student via Deficiency Repair Copilot.',
        createdAt: new Date('2026-09-24T16:20:00Z'),
      },
    ],
  });

  // Scenario C: TSA-2026-000126 — Approved
  const appC = await prisma.application.create({
    data: {
      applicationIdStr: 'TSA-2026-000126',
      userId: studentUser.id,
      scholarshipId: sch1.id,
      stage: 'APPROVED',
      overallStatus: 'Approved — Pending Disbursement',
      currentAuthority: 'Ministry of Tribal Affairs (Disbursement Cell)',
      totalAmount: '₹15,400 USD / year',
      submittedAt: new Date('2026-08-15T09:00:00Z'),
    },
  });

  await prisma.applicationStatusHistory.createMany({
    data: [
      {
        applicationId: appC.id,
        stage: 'SUBMITTED',
        status: 'Application Submitted',
        updatedBy: 'Kanishka Suthar',
        actorRole: 'STUDENT',
        comments: 'Application submitted for National Overseas Scholarship.',
        createdAt: new Date('2026-08-15T09:00:00Z'),
      },
      {
        applicationId: appC.id,
        stage: 'INSTITUTE_VERIFICATION',
        status: 'Institute Verification Completed',
        updatedBy: 'Dr. Ramesh Chandra',
        actorRole: 'INSTITUTE',
        comments: 'Institute verified academic credentials and passport copy.',
        createdAt: new Date('2026-08-20T11:00:00Z'),
      },
      {
        applicationId: appC.id,
        stage: 'DEPARTMENT_VERIFICATION',
        status: 'State Department Verification Completed',
        updatedBy: 'State Tribal Welfare Committee',
        actorRole: 'DEPARTMENT',
        comments: 'State screening committee approved candidates overseas eligibility.',
        createdAt: new Date('2026-09-01T15:00:00Z'),
      },
      {
        applicationId: appC.id,
        stage: 'APPROVED',
        status: 'Ministry Sanction Approved',
        updatedBy: 'Rajeshwar Naik (Ministry Nodal Officer)',
        actorRole: 'MINISTRY',
        comments: 'Central Sanction Order Issued. Application approved for overseas disbursement.',
        createdAt: new Date('2026-09-15T10:00:00Z'),
      },
    ],
  });

  // Scenario D: TSA-2026-000127 — Completed & Disbursed
  const appD = await prisma.application.create({
    data: {
      applicationIdStr: 'TSA-2026-000127',
      userId: studentUser.id,
      scholarshipId: sch3.id,
      stage: 'COMPLETED',
      overallStatus: 'Disbursed & Completed',
      currentAuthority: 'PFMS Direct Benefit Transfer Portal',
      totalAmount: '₹1,20,000',
      submittedAt: new Date('2025-10-10T10:00:00Z'),
    },
  });

  await prisma.applicationStatusHistory.createMany({
    data: [
      {
        applicationId: appD.id,
        stage: 'SUBMITTED',
        status: 'Application Submitted',
        updatedBy: 'Kanishka Suthar',
        actorRole: 'STUDENT',
        comments: 'Submitted for Post-Matric ST Scholarship 2024-25.',
        createdAt: new Date('2025-10-10T10:00:00Z'),
      },
      {
        applicationId: appD.id,
        stage: 'APPROVED',
        status: 'Sanction Order Issued',
        updatedBy: 'State Welfare Ministry',
        actorRole: 'MINISTRY',
        comments: 'Sanctioned ₹1,20,000.',
        createdAt: new Date('2025-11-15T14:00:00Z'),
      },
      {
        applicationId: appD.id,
        stage: 'DISBURSEMENT',
        status: 'DBT Payment Disbursed',
        updatedBy: 'PFMS System',
        actorRole: 'SYSTEM',
        comments: 'Ref No UTR998822114 credited to SBI account ending 1012.',
        createdAt: new Date('2025-12-01T09:30:00Z'),
      },
      {
        applicationId: appD.id,
        stage: 'COMPLETED',
        status: 'Cycle Completed',
        updatedBy: 'System AI Engine',
        actorRole: 'SYSTEM',
        comments: 'Scholarship cycle marked complete.',
        createdAt: new Date('2025-12-05T12:00:00Z'),
      },
    ],
  });

  // 8. Tasks & Personalized Actions
  await prisma.applicationTask.create({
    data: {
      userId: studentUser.id,
      title: 'Fix ST Certificate Name Mismatch',
      description: 'Your uploaded ST certificate has "Kanishka S." whereas profile is "Kanishka Suthar". Upload an affidavit or expanded name certificate.',
      category: 'URGENT',
      deadline: '2026-10-05',
      isCompleted: false,
      linkUrl: '/student/deficiency-copilot',
    },
  });

  await prisma.applicationTask.create({
    data: {
      userId: studentUser.id,
      title: 'Upload Semester 5 Bonafide Copy',
      description: 'Required for upcoming Top Class Education renewal cycle.',
      category: 'ACTION_REQUIRED',
      deadline: '2026-10-20',
      isCompleted: false,
      linkUrl: '/student/renewals',
    },
  });

  await prisma.applicationTask.create({
    data: {
      userId: studentUser.id,
      title: 'Explore National Overseas Fellowship for ST Scholars',
      description: 'Matching AI recommends this scheme for your final year PG planning.',
      category: 'UPCOMING',
      deadline: '2026-11-30',
      isCompleted: false,
      linkUrl: '/student/opportunities',
    },
  });

  // 9. Notifications
  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'document',
      title: 'AI Deficiency Copilot Flagged Document Issue',
      message: 'Name mismatch detected on ST Certificate. Click to launch AI Repair Copilot.',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'application',
      title: 'Application ST-2026-88910 Sent to Institute Verification',
      message: 'Your application has been received by NIT Rourkela verification officer.',
      isRead: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: studentUser.id,
      type: 'renewal',
      title: 'Renewal Window Opening Soon',
      message: 'Your 2026-27 renewal readiness is currently at 72%. Complete pending marksheets to achieve 100%.',
      isRead: false,
    },
  });

  // 10. Renewals
  await prisma.renewal.create({
    data: {
      userId: studentUser.id,
      currentScholarshipId: sch2.id,
      readinessScore: 72,
      missingRequirements: 'Previous semester marksheet (Sem 5), Updated Bonafide Certificate with College Seal',
      deadline: '2026-10-31',
      status: 'NEEDS_ACTION',
    },
  });

  // 11. Grievance
  await prisma.grievance.create({
    data: {
      ticketId: 'GRV-2026-4412',
      userId: studentUser.id,
      category: 'Document Verification Delay',
      subject: 'Institute level verification pending for more than 10 business days',
      description: 'Submitted application ST-2026-88910 on 12th Sept 2026. The institute verification status has not changed.',
      currentAuthority: 'Nodal Officer, NIT Rourkela',
      status: 'IN_PROGRESS',
      commentsJson: JSON.stringify([
        {
          author: 'Kanishka Suthar',
          role: 'STUDENT',
          text: 'Kindly expedite the verification process as the deadline is approaching.',
          timestamp: '2026-09-15T10:30:00Z',
        },
        {
          author: 'Dr. Ramesh Chandra (Nodal Officer)',
          role: 'INSTITUTE',
          text: 'Document deficiency detected on ST Caste Certificate. Once student resolves name mismatch via AI Repair Copilot, approval will be granted.',
          timestamp: '2026-09-18T14:15:00Z',
        },
      ]),
    },
  });

  // 12. Audit Log Entries
  await prisma.auditLog.create({
    data: {
      userId: studentUser.id,
      action: 'APPLICATION_CREATED',
      performedBy: 'Kanishka Suthar',
      userRole: 'STUDENT',
      details: 'Created application ST-2026-88910 for Top Class Education Scheme for ST Students',
      ipAddress: '106.210.45.12',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: studentUser.id,
      action: 'AI_DOCUMENT_CHECK',
      performedBy: 'System AI Engine',
      userRole: 'SYSTEM',
      details: 'Evaluated 4 documents for student Kanishka Suthar. Document Readiness Score: 85%. Flagged ST Certificate name mismatch.',
      ipAddress: '127.0.0.1',
    },
  });

  // 13. Phase 5 Seed Data: Scholarship Renewal & Progress
  const schRen = await prisma.scholarshipRenewal.create({
    data: {
      userId: studentUser.id,
      scholarshipId: sch2.id,
      previousApplicationId: appA.id,
      status: 'RENEWAL_OPEN',
      renewalDeadline: '2026-10-18',
      readinessPercentage: 78,
    },
  });

  await prisma.renewalRequirement.createMany({
    data: [
      {
        renewalId: schRen.id,
        requirementType: 'ACADEMIC',
        title: 'Current Academic Record',
        description: 'CGPA must be ≥ 60.0% (Current record: 8.6 / 86%)',
        status: 'PASSED',
        required: true,
        actionText: 'Academic requirement met',
      },
      {
        renewalId: schRen.id,
        requirementType: 'DOCUMENT',
        title: 'ST Category Eligibility Verification',
        description: 'Scheduled Tribe Caste Certificate verified on portal file',
        status: 'PASSED',
        required: true,
        actionText: 'Caste verification valid',
      },
      {
        renewalId: schRen.id,
        requirementType: 'DOCUMENT',
        title: 'Previous Semester Marksheet',
        description: 'Semester 4 & 5 certified grade sheet required',
        status: 'WARNING',
        required: true,
        actionText: 'Upload semester 5 grade sheet',
      },
      {
        renewalId: schRen.id,
        requirementType: 'DOCUMENT',
        title: 'Institution Bonafide Certificate',
        description: 'Current academic year 2026-27 bonafide seal',
        status: 'WARNING',
        required: true,
        actionText: 'Upload bonafide certificate with College Stamp',
      },
      {
        renewalId: schRen.id,
        requirementType: 'APPLICATION',
        title: 'Renewal Application Submission',
        description: 'Verify current info and submit renewal form',
        status: 'PENDING',
        required: true,
        actionText: 'Complete Renewal Form',
      },
    ],
  });

  await prisma.studentProgress.create({
    data: {
      userId: studentUser.id,
      academicYear: '2025-26',
      semester: 5,
      cgpaOrPercentage: 8.6,
      previousCgpa: 8.4,
      completedSemesters: 4,
      achievementsJson: JSON.stringify(['Dean’s Merit List 2025', 'Smart India Hackathon Winner 2025', 'ST STEM Research Scholar Award']),
    },
  });

  await prisma.researchInterest.create({
    data: {
      userId: studentUser.id,
      domain: 'Computer Science & AI',
      interest: 'Artificial Intelligence for Tribal Language Preservation & Land Records',
      keywordsJson: JSON.stringify(['AI', 'NLP', 'Indigenous Knowledge', 'Tribal Governance']),
    },
  });

  console.log('✅ Tribal Scholar AI Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
