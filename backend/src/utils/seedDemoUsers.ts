import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDemoUsers() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const demoAccounts = [
    {
      email: 'student@mota.gov.in',
      name: 'Kanishka Suthar',
      role: 'STUDENT',
      mobile: '+91 98765 43210',
    },
    {
      email: 'student@tribalscholar.gov.in',
      name: 'Kanishka Suthar',
      role: 'STUDENT',
      mobile: '+91 98765 43210',
    },
    {
      email: 'institute@mota.gov.in',
      name: 'Dr. Ramesh Chandra (NIT Rourkela)',
      role: 'INSTITUTE',
      mobile: '+91 98111 22334',
    },
    {
      email: 'officer@nitrkl.ac.in',
      name: 'Dr. Ramesh Chandra',
      role: 'INSTITUTE',
      mobile: '+91 98111 22334',
    },
    {
      email: 'admin@mota.gov.in',
      name: 'Rajeshwar Naik (Ministry Admin)',
      role: 'ADMIN',
      mobile: '+91 99999 88888',
    },
    {
      email: 'admin@tribal.gov.in',
      name: 'Rajeshwar Naik',
      role: 'ADMIN',
      mobile: '+91 99999 88888',
    },
  ];

  for (const acc of demoAccounts) {
    const user = await prisma.user.upsert({
      where: { email: acc.email },
      update: {
        password: hashedPassword,
        name: acc.name,
        role: acc.role,
        mobile: acc.mobile,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
      create: {
        email: acc.email,
        password: hashedPassword,
        name: acc.name,
        role: acc.role,
        mobile: acc.mobile,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    if (acc.role === 'STUDENT') {
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          stCategory: 'Scheduled Tribe',
          subTribe: 'Bhumij / Santhal',
          state: 'Odisha',
          district: 'Sundargarh',
          familyIncome: 180000,
          fatherName: 'Ramesh Suthar',
          gender: 'Female',
          dob: '2003-05-14',
          degreeLevel: 'Undergraduate',
          courseName: 'B.Tech Computer Science',
          institutionName: 'National Institute of Technology Rourkela',
          institutionCode: 'NITR-769008',
          currentYear: 3,
          semester: 5,
          academicMarks: 8.6,
          bankAccount: '987654321012',
          bankIfsc: 'SBIN0002110',
          bankName: 'State Bank of India',
          aadharLinked: true,
        },
      });
    }

    console.log(`✅ Demo User Ready: ${acc.email} (${acc.role})`);
  }
}

if (require.main === module) {
  seedDemoUsers()
    .then(() => {
      console.log('🎉 All demo users successfully seeded with password123');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error seeding demo users:', err);
      process.exit(1);
    });
}
