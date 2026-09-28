import { UserRole } from '../types';

export interface RegisteredApplicant {
  regNo: string;
  name: string;
  phone: string; // e.g. "244000044"
  formattedPhone: string; // e.g. "+233244000044"
  displayPhone: string; // e.g. "024 400 0044"
  profession: string;
  role: UserRole;
  course: string;
  courseFee: number;
  totalDue: number;
  totalPaid: number;
  balance: number;
  paymentStatus: 'FULLY PAID' | 'PARTIALLY PAID' | 'PENDING' | 'UNPAID';
  enrolmentStatus: 'REGISTERED' | 'ACTIVE' | 'COMPLETED';
  paymentReference?: string;
  avatarEmoji: string;
}

export interface TrainingFinancialSummary {
  programmeTitle: string;
  subtitle: string;
  totalApplicants: number;
  fullyPaid: number;
  partiallyPaid: number;
  unpaid: number;
  totalPaid: number;
  outstanding: number;
  expectedCourseRevenue: number;
  registrationFee: number;
  momoName: string;
  momoPhone: string;
  merchantId: string;
}

export const OWRAFIX_FINANCIAL_SUMMARY: TrainingFinancialSummary = {
  programmeTitle: 'OWRAFIX VENTURES – TRAINING REGISTRATION MANAGEMENT DASHBOARD',
  subtitle: 'Practical Digital Skills & Entrepreneurship Training Programme',
  totalApplicants: 3,
  fullyPaid: 0,
  partiallyPaid: 2,
  unpaid: 1,
  totalPaid: 100,
  outstanding: 2050,
  expectedCourseRevenue: 2000,
  registrationFee: 50,
  momoName: 'OWRAFIX Ventures',
  momoPhone: '0552834129',
  merchantId: '972184'
};

export const OWRAFIX_COURSES = [
  { name: 'Digital Foundations & AI Mastery — Complete Beginner — 12 Weeks', fee: 900, applicants: 1, expectedRevenue: 900 },
  { name: 'AI for Professionals — 8 Weeks', fee: 700, applicants: 1, expectedRevenue: 700 },
  { name: 'Digital Skills & Computer Mastery for Students — 8 Weeks', fee: 400, applicants: 0, expectedRevenue: 0 },
  { name: 'Digital Skills for SHS Leavers — 8 Weeks', fee: 400, applicants: 1, expectedRevenue: 400 },
  { name: 'AI for Teachers — 8 Weeks', fee: 650, applicants: 0, expectedRevenue: 0 },
  { name: 'AI for Business & Entrepreneurs — 8 Weeks', fee: 700, applicants: 0, expectedRevenue: 0 },
  { name: 'Graphic Design & Digital Content Creation — 12 Weeks', fee: 900, applicants: 0, expectedRevenue: 0 }
];

export const INITIAL_REGISTERED_APPLICANTS: RegisteredApplicant[] = [
  {
    regNo: 'OWR-2026-0001',
    name: 'Test Applicant',
    phone: '244000044',
    formattedPhone: '+233244000044',
    displayPhone: '024 400 0044',
    profession: 'Teacher',
    role: 'teacher',
    course: 'AI for Professionals — GH₵500',
    courseFee: 700,
    totalDue: 750,
    totalPaid: 50,
    balance: 700,
    paymentStatus: 'PARTIALLY PAID',
    enrolmentStatus: 'REGISTERED',
    paymentReference: 'MM-TX-9721-01',
    avatarEmoji: '👨‍🏫'
  },
  {
    regNo: 'OWR-2026-0002',
    name: 'Florence Owora',
    phone: '249361104',
    formattedPhone: '+233249361104',
    displayPhone: '024 936 1104',
    profession: 'Administrator',
    role: 'admin',
    course: 'Digital Skills for SHS Leavers — GH₵400',
    courseFee: 400,
    totalDue: 450,
    totalPaid: 50,
    balance: 400,
    paymentStatus: 'PARTIALLY PAID',
    enrolmentStatus: 'REGISTERED',
    paymentReference: 'MM-TX-9721-02',
    avatarEmoji: '🏛️'
  },
  {
    regNo: 'OWR-2026-0003',
    name: 'Bertha Kwakyewah',
    phone: '544090932',
    formattedPhone: '+233544090932',
    displayPhone: '054 409 0932',
    profession: 'Nurse',
    role: 'student',
    course: 'Digital Foundations & AI Mastery — Complete Beginner — 12 Weeks — GH₵900',
    courseFee: 900,
    totalDue: 950,
    totalPaid: 0,
    balance: 950,
    paymentStatus: 'PENDING',
    enrolmentStatus: 'REGISTERED',
    paymentReference: 'PENDING-MOMO',
    avatarEmoji: '🎒'
  }
];

/**
 * Normalizes phone numbers to compare against the applicant database.
 * Handles inputs like '0244000044', '244000044', '+233244000044', '024 400 0044', etc.
 */
export function normalizePhoneForMatching(phone: string): string {
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  if (digitsOnly.startsWith('233') && digitsOnly.length === 12) {
    return digitsOnly.substring(3); // e.g. "244000044"
  }
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    return digitsOnly.substring(1); // e.g. "244000044"
  }
  return digitsOnly;
}

export function findRegisteredApplicantByPhone(phone: string): RegisteredApplicant | undefined {
  const matchDigits = normalizePhoneForMatching(phone);
  return INITIAL_REGISTERED_APPLICANTS.find((applicant) => {
    return normalizePhoneForMatching(applicant.phone) === matchDigits;
  });
}

export function findRegisteredApplicantByRegNo(regNo: string): RegisteredApplicant | undefined {
  const clean = regNo.trim().toUpperCase();
  return INITIAL_REGISTERED_APPLICANTS.find((applicant) => applicant.regNo.toUpperCase() === clean);
}
