export type UserRole = 'student' | 'teacher' | 'admin';

export interface AppUser {
  uid: string;
  email: string | null;
  phoneNumber?: string | null;
  authProvider?: 'whatsapp' | 'google' | 'demo';
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  schoolName?: string;
  grade?: string;
  regNo?: string;
  profession?: string;
  course?: string;
  courseFee?: number;
  totalDue?: number;
  totalPaid?: number;
  balance?: number;
  paymentStatus?: 'FULLY PAID' | 'PARTIALLY PAID' | 'PENDING' | 'UNPAID';
  enrolmentStatus?: 'REGISTERED' | 'ACTIVE' | 'COMPLETED';
  paymentReference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface CurriculumWeek {
  weekNumber: number;
  title: string;
  category: 'hardware' | 'basics' | 'software' | 'safety' | 'creative';
  mcqCount: number;
  description: string;
  workstationTask: string;
  badgeName: string;
  badgeIcon: string;
  colorTheme: string;
  slides: {
    title: string;
    bigConcept: string;
    keyTakeaway: string;
    teacherNotes: string;
    actionPrompt: string;
  }[];
  questions: Question[];
}

export interface StudentProfile {
  name: string;
  schoolName: string;
  grade: string;
  xp: number;
  level: number;
  badges: string[];
  streakDays: number;
  completedWeeks: number[];
}

export interface WorkstationTelemetry {
  id: number;
  studentName: string;
  seatNumber: string;
  currentTask: string;
  status: 'active' | 'needs-help' | 'completed' | 'idle';
  score: number;
  lastActive: string;
  uid?: string;
}
