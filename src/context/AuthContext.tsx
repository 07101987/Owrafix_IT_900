import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { AppUser, UserRole } from '../types';
import { 
  findRegisteredApplicantByPhone, 
  findRegisteredApplicantByRegNo, 
  RegisteredApplicant, 
  INITIAL_REGISTERED_APPLICANTS 
} from '../data/registeredStudents';

export interface WhatsAppVerificationState {
  phoneNumber: string;
  code: string;
  expiresAt: number;
  whatsappUrl: string;
  role: UserRole;
  displayName: string;
  applicant?: RegisteredApplicant;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: AppUser | null;
  loading: boolean;
  role: UserRole;
  authProvider: 'whatsapp' | 'google' | 'demo' | null;
  registeredApplicants: RegisteredApplicant[];
  loginWithWhatsApp: (phoneNumber: string, role?: UserRole, customName?: string) => Promise<AppUser>;
  loginWithApplicant: (applicant: RegisteredApplicant) => Promise<AppUser>;
  loginWithRegistrationNo: (regNo: string) => Promise<AppUser>;
  requestWhatsAppOtp: (phoneNumber: string, role?: UserRole, customName?: string) => Promise<WhatsAppVerificationState>;
  verifyWhatsAppOtp: (enteredOtp: string, state: WhatsAppVerificationState) => Promise<AppUser>;
  loginWithWhatsAppQR: (deskId: string, role: UserRole, customName?: string) => Promise<AppUser>;
  loginWithGoogle: (defaultRole?: UserRole) => Promise<void>;
  loginWithDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (newRole: UserRole) => Promise<void>;
  saveStudentXP: (xpGained: number, badgeUnlocked?: string, weekCompleted?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to normalize Ghanaian and international phone numbers
export function formatGhanaPhoneNumber(rawPhone: string): string {
  const cleaned = rawPhone.trim().replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+233${cleaned.substring(1)}`;
  }
  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('233')) {
      return `+${cleaned}`;
    }
    return `+233${cleaned}`;
  }
  return cleaned;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    // 1. First check if a WhatsApp session or demo session is saved in local storage (vital for offline African labs)
    const storedWhatsAppUser = localStorage.getItem('owrafix_whatsapp_user');
    const storedDemoUser = localStorage.getItem('owrafix_demo_user');

    if (storedWhatsAppUser) {
      try {
        const parsed = JSON.parse(storedWhatsAppUser) as AppUser;
        setUserProfile(parsed);
        setLoading(false);
        // Async verify against Firestore in the background
        const uid = parsed.uid;
        getDoc(doc(db, 'users', uid)).then((snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data() as AppUser);
          }
        }).catch((err) => {
          console.warn('Firestore offline: using cached WhatsApp session', err);
        });
        return;
      } catch (e) {
        console.error('Failed to parse cached WhatsApp profile', e);
      }
    } else if (storedDemoUser) {
      try {
        setUserProfile(JSON.parse(storedDemoUser));
        setLoading(false);
        return;
      } catch {
        // ignore
      }
    }

    // 2. Firebase Auth listener for Google Auth
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setCurrentUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as AppUser);
          } else {
            const defaultRole: UserRole = fbUser.email?.includes('admin') || fbUser.email === 'sowora@gmail.com' 
              ? 'admin' 
              : 'student';
            
            const newProfile: AppUser = {
              uid: fbUser.uid,
              email: fbUser.email,
              authProvider: 'google',
              displayName: fbUser.displayName || (defaultRole === 'admin' ? 'Lab Administrator' : 'Young Learner'),
              photoURL: fbUser.photoURL,
              role: defaultRole,
              schoolName: 'St. Kizito Basic School',
              grade: 'Primary 5B',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Firestore user fetch failed (offline fallback):', err);
          setUserProfile({
            uid: fbUser.uid,
            email: fbUser.email,
            authProvider: 'google',
            displayName: fbUser.displayName || 'Ghana Lab Student',
            photoURL: fbUser.photoURL,
            role: 'student',
            schoolName: 'St. Kizito Basic School',
            grade: 'Primary 5B'
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Request WhatsApp OTP
  const requestWhatsAppOtp = async (
    rawPhone: string,
    fallbackRole?: UserRole,
    customName?: string
  ): Promise<WhatsAppVerificationState> => {
    const formattedPhone = formatGhanaPhoneNumber(rawPhone);
    const matchedApplicant = findRegisteredApplicantByPhone(rawPhone) || findRegisteredApplicantByPhone(formattedPhone);

    const roleToUse: UserRole = matchedApplicant ? matchedApplicant.role : (fallbackRole || 'student');
    const resolvedName = customName?.trim() || (matchedApplicant ? matchedApplicant.name : (
      roleToUse === 'student' ? 'Kwame Mensah' :
      roleToUse === 'teacher' ? 'Mr. Emmanuel Boateng' :
      'Owrafix Lab Coordinator'
    ));

    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins validity

    const courseInfo = matchedApplicant ? `\nCourse: ${matchedApplicant.course}\nReg No: ${matchedApplicant.regNo}\nStatus: ${matchedApplicant.paymentStatus}` : '';

    // Direct WhatsApp Message link: opens WhatsApp with pre-filled verification code to Owrafix Bot
    const whatsappText = encodeURIComponent(
      `🇬🇭 *OWRAFIX VENTURES TRAINING PORTAL*\n\n` +
      `Hello ${resolvedName}!\n` +
      `Your 6-digit classroom access OTP is: *${generatedOtp}*${courseInfo}\n\n` +
      `Role: ${roleToUse.toUpperCase()}\n` +
      `Valid for 5 minutes. Official Owrafix Training Portal.`
    );
    const whatsappUrl = `https://wa.me/?text=${whatsappText}`;

    return {
      phoneNumber: formattedPhone,
      code: generatedOtp,
      expiresAt,
      whatsappUrl,
      role: roleToUse,
      displayName: resolvedName,
      applicant: matchedApplicant
    };
  };

  // Verify WhatsApp OTP and sign in
  const verifyWhatsAppOtp = async (
    enteredOtp: string,
    state: WhatsAppVerificationState
  ): Promise<AppUser> => {
    if (Date.now() > state.expiresAt) {
      throw new Error('This WhatsApp code has expired. Please request a new code.');
    }

    if (enteredOtp.trim() !== state.code.trim()) {
      throw new Error('Incorrect WhatsApp 6-digit code. Please check your WhatsApp messages and try again.');
    }

    if (state.applicant) {
      return await loginWithApplicant(state.applicant);
    }

    return await loginWithWhatsApp(state.phoneNumber, state.role, state.displayName);
  };

  // Direct login with a registered applicant record
  const loginWithApplicant = async (applicant: RegisteredApplicant): Promise<AppUser> => {
    setLoading(true);
    const uid = `reg_${applicant.regNo.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const profileData: AppUser = {
      uid,
      email: `${applicant.regNo.toLowerCase()}@owrafix.edu.gh`,
      phoneNumber: applicant.formattedPhone,
      authProvider: 'whatsapp',
      displayName: applicant.name,
      photoURL: null,
      role: applicant.role,
      schoolName: 'OWRAFIX Ventures Training Hub, Accra',
      grade: applicant.course,
      regNo: applicant.regNo,
      profession: applicant.profession,
      course: applicant.course,
      courseFee: applicant.courseFee,
      totalDue: applicant.totalDue,
      totalPaid: applicant.totalPaid,
      balance: applicant.balance,
      paymentStatus: applicant.paymentStatus,
      enrolmentStatus: applicant.enrolmentStatus,
      paymentReference: applicant.paymentReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, profileData, { merge: true });
    } catch (e) {
      console.warn('Firestore offline fallback for registered applicant:', e);
    }

    setUserProfile(profileData);
    localStorage.setItem('owrafix_whatsapp_user', JSON.stringify(profileData));
    localStorage.removeItem('owrafix_demo_user');
    setLoading(false);
    return profileData;
  };

  // Login by Registration Number (e.g. OWR-2026-0001)
  const loginWithRegistrationNo = async (regNo: string): Promise<AppUser> => {
    const applicant = findRegisteredApplicantByRegNo(regNo);
    if (!applicant) {
      throw new Error(`Registration number "${regNo}" was not found in OWRAFIX Ventures Training Register.`);
    }
    return await loginWithApplicant(applicant);
  };

  // Login With WhatsApp (Direct / after verification)
  const loginWithWhatsApp = async (
    rawPhone: string, 
    fallbackRole: UserRole = 'student', 
    customName?: string
  ): Promise<AppUser> => {
    setLoading(true);
    const matchedApplicant = findRegisteredApplicantByPhone(rawPhone);
    if (matchedApplicant) {
      return await loginWithApplicant(matchedApplicant);
    }

    const formattedPhone = formatGhanaPhoneNumber(rawPhone);
    const cleanDigits = formattedPhone.replace(/[^0-9]/g, '');
    const uid = `whatsapp_${cleanDigits}`;

    const defaultNames: Record<UserRole, string> = {
      student: 'Registered Pupil',
      teacher: 'Classroom Teacher',
      admin: 'Administrator'
    };

    const finalName = customName?.trim() || defaultNames[fallbackRole];

    const profileData: AppUser = {
      uid,
      email: null,
      phoneNumber: formattedPhone,
      authProvider: 'whatsapp',
      displayName: finalName,
      photoURL: null,
      role: fallbackRole,
      schoolName: 'OWRAFIX Ventures Learning Hub',
      grade: fallbackRole === 'student' ? 'Digital Foundations' : fallbackRole === 'teacher' ? 'AI for Teachers' : 'Management Lead',
      enrolmentStatus: 'REGISTERED',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const existing = snap.data() as AppUser;
        const merged: AppUser = {
          ...existing,
          phoneNumber: formattedPhone,
          authProvider: 'whatsapp',
          role: fallbackRole,
          updatedAt: new Date().toISOString()
        };
        await updateDoc(userRef, { role: fallbackRole, updatedAt: new Date().toISOString() });
        setUserProfile(merged);
        localStorage.setItem('owrafix_whatsapp_user', JSON.stringify(merged));
        localStorage.removeItem('owrafix_demo_user');
        setLoading(false);
        return merged;
      } else {
        await setDoc(userRef, profileData);
      }
    } catch (e) {
      console.warn('Firestore offline fallback for WhatsApp login:', e);
    }

    setUserProfile(profileData);
    localStorage.setItem('owrafix_whatsapp_user', JSON.stringify(profileData));
    localStorage.removeItem('owrafix_demo_user');
    setLoading(false);
    return profileData;
  };

  // Login with WhatsApp QR (Classroom Desk Instant Scan)
  const loginWithWhatsAppQR = async (
    deskId: string, 
    role: UserRole, 
    customName?: string
  ): Promise<AppUser> => {
    // Map to the actual registered applicants in the dashboard:
    // Student -> Bertha Kwakyewah (OWR-2026-0003, Nurse, Digital Foundations & AI Mastery)
    // Teacher -> Test Applicant (OWR-2026-0001, Teacher, AI for Professionals)
    // Admin   -> Florence Owora (OWR-2026-0002, Administrator, Digital Skills)
    const applicantMap: Record<UserRole, RegisteredApplicant> = {
      student: INITIAL_REGISTERED_APPLICANTS[2],
      teacher: INITIAL_REGISTERED_APPLICANTS[0],
      admin: INITIAL_REGISTERED_APPLICANTS[1]
    };
    return await loginWithApplicant(applicantMap[role]);
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'student') => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const userDocRef = doc(db, 'users', fbUser.uid);
      const snap = await getDoc(userDocRef);
      
      let finalRole = preferredRole;
      if (fbUser.email === 'sowora@gmail.com' || fbUser.email?.includes('admin')) {
        finalRole = 'admin';
      }

      if (!snap.exists()) {
        const newProfile: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          authProvider: 'google',
          displayName: fbUser.displayName || (finalRole === 'teacher' ? 'Classroom Teacher' : 'Young Learner'),
          photoURL: fbUser.photoURL,
          role: finalRole,
          schoolName: 'St. Kizito Basic School',
          grade: 'Primary 5B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      } else {
        setUserProfile(snap.data() as AppUser);
      }
      localStorage.removeItem('owrafix_demo_user');
      localStorage.removeItem('owrafix_whatsapp_user');
    } catch (err) {
      console.error('Google sign-in error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async (role: UserRole) => {
    setLoading(true);
    const demoProfiles: Record<UserRole, AppUser> = {
      student: {
        uid: 'demo-student-kwame',
        email: 'kwame.mensah@stkizito.edu.gh',
        phoneNumber: '+233245550192',
        authProvider: 'demo',
        displayName: 'Kwame Mensah',
        photoURL: null,
        role: 'student',
        schoolName: 'St. Kizito Basic School, Osu',
        grade: 'Primary 5B',
        createdAt: new Date().toISOString()
      },
      teacher: {
        uid: 'demo-teacher-boateng',
        email: 'mr.boateng@stkizito.edu.gh',
        phoneNumber: '+233208883401',
        authProvider: 'demo',
        displayName: 'Mr. Emmanuel Boateng',
        photoURL: null,
        role: 'teacher',
        schoolName: 'St. Kizito Basic School, Osu',
        grade: 'ICT Dept Lead',
        createdAt: new Date().toISOString()
      },
      admin: {
        uid: 'demo-admin-owrafix',
        email: 'admin@owrafix.edu.gh',
        phoneNumber: '+233541129904',
        authProvider: 'demo',
        displayName: 'Administrator (MoE / GES Lead)',
        photoURL: null,
        role: 'admin',
        schoolName: 'Accra Learning Lab Hub',
        grade: 'Regional Coordinator',
        createdAt: new Date().toISOString()
      }
    };

    const demo = demoProfiles[role];
    setUserProfile(demo);
    localStorage.setItem('owrafix_demo_user', JSON.stringify(demo));
    localStorage.removeItem('owrafix_whatsapp_user');
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('owrafix_demo_user');
    localStorage.removeItem('owrafix_whatsapp_user');
    setUserProfile(null);
    if (currentUser) {
      await fbSignOut(auth);
    }
  };

  const updateUserRole = async (newRole: UserRole) => {
    if (!userProfile) return;
    const updated: AppUser = { ...userProfile, role: newRole, updatedAt: new Date().toISOString() };
    setUserProfile(updated);
    if (currentUser && currentUser.uid === userProfile.uid) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), { role: newRole });
      } catch (e) {
        console.warn('Could not update role in Firestore:', e);
      }
    } else {
      if (updated.authProvider === 'whatsapp') {
        localStorage.setItem('owrafix_whatsapp_user', JSON.stringify(updated));
      } else {
        localStorage.setItem('owrafix_demo_user', JSON.stringify(updated));
      }
    }
  };

  const saveStudentXP = async (xpGained: number, badgeUnlocked?: string, weekCompleted?: number) => {
    if (!userProfile) return;
    const uid = userProfile.uid;

    try {
      const progRef = doc(db, 'studentProgress', uid);
      const snap = await getDoc(progRef);
      let currentXp = 340;
      let currentBadges: string[] = ['First Boot Explorer', 'Precision Pilot'];
      let completedWeeks: number[] = [1, 2];

      if (snap.exists()) {
        const data = snap.data();
        currentXp = data.xp || 340;
        currentBadges = data.badges || currentBadges;
        completedWeeks = data.completedWeeks || completedWeeks;
      }

      const newXp = currentXp + xpGained;
      const newBadges = badgeUnlocked && !currentBadges.includes(badgeUnlocked)
        ? [...currentBadges, badgeUnlocked]
        : currentBadges;
      const newWeeks = weekCompleted && !completedWeeks.includes(weekCompleted)
        ? [...completedWeeks, weekCompleted]
        : completedWeeks;

      await setDoc(progRef, {
        uid,
        xp: newXp,
        level: Math.floor(newXp / 100) + 1,
        badges: newBadges,
        completedWeeks: newWeeks,
        lastActive: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Offline: Student progress saved locally:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        role: userProfile?.role || 'student',
        authProvider: userProfile?.authProvider || null,
        registeredApplicants: INITIAL_REGISTERED_APPLICANTS,
        loginWithWhatsApp,
        loginWithApplicant,
        loginWithRegistrationNo,
        requestWhatsAppOtp,
        verifyWhatsAppOtp,
        loginWithWhatsAppQR,
        loginWithGoogle,
        loginWithDemo,
        logout,
        updateUserRole,
        saveStudentXP
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
