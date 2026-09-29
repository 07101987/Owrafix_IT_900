import { UserRole } from '../types';

export interface RegisteredApplicant {
  regNo: string;
  name: string;
  phone: string;
  formattedPhone: string;
  displayPhone: string;
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

/** Offline fallback records. The classroom can still operate when Google is unavailable. */
export const INITIAL_REGISTERED_APPLICANTS: RegisteredApplicant[] = [
  {
    regNo: 'OWR-2026-0001', name: 'Test Applicant', phone: '244000044', formattedPhone: '+233244000044', displayPhone: '024 400 0044', profession: 'Teacher', role: 'teacher',
    course: 'AI for Professionals — GH₵500', courseFee: 700, totalDue: 750, totalPaid: 50, balance: 700, paymentStatus: 'PARTIALLY PAID', enrolmentStatus: 'REGISTERED', paymentReference: 'MM-TX-9721-01', avatarEmoji: '👨‍🏫'
  },
  {
    regNo: 'OWR-2026-0002', name: 'Florence Owora', phone: '249361104', formattedPhone: '+233249361104', displayPhone: '024 936 1104', profession: 'Administrator', role: 'admin',
    course: 'Digital Skills for SHS Leavers — GH₵400', courseFee: 400, totalDue: 450, totalPaid: 50, balance: 400, paymentStatus: 'PARTIALLY PAID', enrolmentStatus: 'REGISTERED', paymentReference: 'MM-TX-9721-02', avatarEmoji: '🏛️'
  },
  {
    regNo: 'OWR-2026-0003', name: 'Bertha Kwakyewah', phone: '544090932', formattedPhone: '+233544090932', displayPhone: '054 409 0932', profession: 'Nurse', role: 'student',
    course: 'Digital Foundations & AI Mastery — Complete Beginner — 12 Weeks — GH₵900', courseFee: 900, totalDue: 950, totalPaid: 0, balance: 950, paymentStatus: 'PENDING', enrolmentStatus: 'REGISTERED', paymentReference: 'PENDING-MOMO', avatarEmoji: '🎒'
  }
];

export const GOOGLE_REGISTRATION_API_URL = import.meta.env.VITE_GOOGLE_REGISTRATION_API_URL || '';
const LIVE_CACHE_KEY = 'owrafix_live_registered_applicants';

function getCachedLiveApplicants(): RegisteredApplicant[] {
  try {
    const cached = localStorage.getItem(LIVE_CACHE_KEY);
    if (!cached) return [];
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getActiveApplicants(): RegisteredApplicant[] {
  const live = getCachedLiveApplicants();
  return live.length ? live : INITIAL_REGISTERED_APPLICANTS;
}

function applyLiveApplicants(normalized: RegisteredApplicant[]): void {
  INITIAL_REGISTERED_APPLICANTS.splice(0, INITIAL_REGISTERED_APPLICANTS.length, ...normalized);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('owrafix:students-updated', {
      detail: { count: normalized.length }
    }));
  }
}

export async function refreshRegisteredApplicants(): Promise<RegisteredApplicant[]> {
  if (!GOOGLE_REGISTRATION_API_URL || typeof window === 'undefined') return getActiveApplicants();

  try {
    const separator = GOOGLE_REGISTRATION_API_URL.includes('?') ? '&' : '?';
    const response = await fetch(`${GOOGLE_REGISTRATION_API_URL}${separator}action=list&t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Registration service returned ${response.status}`);

    const payload = await response.json();
    const records = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.students)
        ? payload.students
        : Array.isArray(payload.data)
          ? payload.data
          : [];

    if (!records.length) throw new Error('Registration service returned no student records.');

    const normalized = records.map(normalizeApplicant).filter(Boolean) as RegisteredApplicant[];
    if (normalized.length) {
      localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify(normalized));
      applyLiveApplicants(normalized);
      return normalized;
    }
  } catch (error) {
    console.warn('Live Google registration sync unavailable; using cached/offline register.', error);
  }

  return getActiveApplicants();
}

function normalizeApplicant(raw: any): RegisteredApplicant | null {
  if (!raw) return null;
  const regNo = String(raw.regNo ?? raw.registrationNo ?? raw.registrationNumber ?? '').trim();
  const name = String(raw.name ?? raw.fullName ?? raw.full_name ?? '').trim();
  const phone = String(raw.phone ?? raw.phoneNumber ?? raw.whatsapp ?? raw.whatsappNumber ?? '').trim();
  if (!regNo || !name) return null;

  const normalizedPhone = normalizePhoneForMatching(phone);
  const formattedPhone = normalizedPhone ? `+233${normalizedPhone}` : phone;
  const course = String(raw.course ?? raw.programme ?? raw.program ?? 'Digital Skills & Computer Mastery for Students — 8 Weeks');
  const courseFee = Number(raw.courseFee ?? raw.fee ?? 0) || 0;
  const totalDue = Number(raw.totalDue ?? raw.amountDue ?? courseFee) || courseFee;
  const totalPaid = Number(raw.totalPaid ?? raw.amountPaid ?? 0) || 0;
  const balance = Number(raw.balance ?? Math.max(totalDue - totalPaid, 0));
  const rawRole = String(raw.role ?? 'student').toLowerCase();
  const role: UserRole = rawRole === 'admin' || rawRole === 'teacher' ? rawRole : 'student';
  const rawPayment = String(raw.paymentStatus ?? raw.payment_status ?? 'PENDING').toUpperCase();
  const paymentStatus: RegisteredApplicant['paymentStatus'] = rawPayment === 'FULLY PAID' || rawPayment === 'PARTIALLY PAID' || rawPayment === 'UNPAID' ? rawPayment : 'PENDING';
  const rawEnrollment = String(raw.enrolmentStatus ?? raw.enrollmentStatus ?? 'REGISTERED').toUpperCase();
  const enrolmentStatus: RegisteredApplicant['enrolmentStatus'] = rawEnrollment === 'ACTIVE' || rawEnrollment === 'COMPLETED' ? rawEnrollment : 'REGISTERED';

  return {
    regNo,
    name,
    phone: normalizedPhone || phone,
    formattedPhone,
    displayPhone: String(raw.displayPhone ?? phone),
    profession: String(raw.profession ?? raw.occupation ?? ''),
    role,
    course,
    courseFee,
    totalDue,
    totalPaid,
    balance,
    paymentStatus,
    enrolmentStatus,
    paymentReference: raw.paymentReference ?? raw.reference ?? undefined,
    avatarEmoji: role === 'teacher' ? '👨‍🏫' : role === 'admin' ? '🏛️' : '🎒'
  };
}

if (typeof window !== 'undefined') void refreshRegisteredApplicants();

export function normalizePhoneForMatching(phone: string): string {
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  if (digitsOnly.startsWith('233') && digitsOnly.length === 12) return digitsOnly.substring(3);
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) return digitsOnly.substring(1);
  return digitsOnly;
}

export function findRegisteredApplicantByPhone(phone: string): RegisteredApplicant | undefined {
  const matchDigits = normalizePhoneForMatching(phone);
  return getActiveApplicants().find((applicant) => normalizePhoneForMatching(applicant.phone) === matchDigits);
}

export function findRegisteredApplicantByRegNo(regNo: string): RegisteredApplicant | undefined {
  const clean = regNo.trim().toUpperCase();
  return getActiveApplicants().find((applicant) => applicant.regNo.toUpperCase() === clean);
}
