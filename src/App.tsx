/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsBar } from './components/StatsBar';
import { LearningFormula } from './components/LearningFormula';
import { DualInterfacesSection } from './components/DualInterfacesSection';
import { MouseMasterGame } from './components/MouseMasterGame';
import { CurriculumRoadmap } from './components/CurriculumRoadmap';
import { OfflineArchitecture } from './components/OfflineArchitecture';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { StudentTerminalModal } from './components/StudentTerminalModal';
import { TeacherProjectorModal } from './components/TeacherProjectorModal';
import { HardwareGalleryModal } from './components/HardwareGalleryModal';
import { WeekDetailModal } from './components/WeekDetailModal';
import { LabConsultationModal } from './components/LabConsultationModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { CurriculumWeek, UserRole } from './types';

function MainApp() {
  const { userProfile, role } = useAuth();
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRolePreset, setAuthRolePreset] = useState<UserRole>('student');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [activeWeekForModal, setActiveWeekForModal] = useState<CurriculumWeek | null>(null);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);

  const handleOpenStudent = (weekNum?: number) => {
    if (weekNum) setSelectedWeekNumber(weekNum);
    setIsStudentModalOpen(true);
  };

  const handleOpenTeacher = (weekNum?: number) => {
    if (weekNum) setSelectedWeekNumber(weekNum);
    setIsTeacherModalOpen(true);
  };

  const handleOpenAdmin = () => {
    if (!userProfile) {
      setAuthRolePreset('admin');
      setIsAuthModalOpen(true);
      return;
    }
    setIsAdminModalOpen(true);
  };

  const handleOpenAuth = (roleToSelect: UserRole = 'student') => {
    setAuthRolePreset(roleToSelect);
    setIsAuthModalOpen(true);
  };

  const handleOpenMouseGame = () => {
    const el = document.getElementById('interfaces-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#001d36] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        onOpenStudent={() => handleOpenStudent(1)}
        onOpenTeacher={() => handleOpenTeacher(1)}
        onOpenAdmin={handleOpenAdmin}
        onOpenAuth={() => handleOpenAuth('student')}
        onOpenHardware={() => setIsHardwareModalOpen(true)}
        onOpenMouseGame={handleOpenMouseGame}
      />

      <main className="flex-1">
        {userProfile && (
          <div className="bg-[#eaf7ff] border-b border-[#d3e9fa] py-2 px-4 text-xs font-semibold text-[#0061a4]">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span>👋 Akwaaba, <strong>{userProfile.displayName}</strong></span>
                {userProfile.regNo && <span className="bg-[#0061a4] text-white font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-full">{userProfile.regNo}</span>}
                {userProfile.course && <span className="hidden sm:inline bg-white px-2 py-0.5 rounded-full border border-[#d3e9fa] text-[#001d36] text-[11px] font-bold truncate max-w-[260px]">{userProfile.course}</span>}
                <span className="bg-[#087443] text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full">{role} Access</span>
                {userProfile.paymentStatus && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${userProfile.paymentStatus === 'FULLY PAID' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>{userProfile.paymentStatus}</span>}
                {userProfile.authProvider === 'whatsapp' && <span className="bg-[#25D366] text-[#003816] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1"><span>💬</span><span>{userProfile.phoneNumber || 'WhatsApp Verified'}</span></span>}
              </div>
              <div className="flex items-center gap-2">
                {role === 'admin' && <button onClick={() => setIsAdminModalOpen(true)} className="text-[#654800] hover:underline font-bold text-[11px]">🏛️ Open Admin Portal</button>}
                {role === 'teacher' && <button onClick={() => handleOpenTeacher(1)} className="text-[#087443] hover:underline font-bold text-[11px]">👨‍🏫 Open Projector Deck</button>}
                {role === 'student' && <button onClick={() => handleOpenStudent(1)} className="text-[#0061a4] hover:underline font-bold text-[11px]">🎒 Open Learning Portal</button>}
              </div>
            </div>
          </div>
        )}

        <Hero onOpenStudent={() => handleOpenStudent(1)} onOpenTeacher={() => handleOpenTeacher(1)} />
        <StatsBar />
        <LearningFormula
          onOpenTeacher={() => handleOpenTeacher(1)}
          onOpenHardware={() => setIsHardwareModalOpen(true)}
          onOpenStudent={() => handleOpenStudent(1)}
          onOpenMouseGame={() => handleOpenStudent(3)}
        />
        <DualInterfacesSection onOpenStudent={() => handleOpenStudent(1)} onOpenTeacher={() => handleOpenTeacher(1)} />
        <MouseMasterGame onOpenStudent={() => handleOpenStudent(2)} />
        <CurriculumRoadmap onSelectWeek={(week) => setActiveWeekForModal(week)} />
        <OfflineArchitecture />
        <CtaBanner onOpenStudent={() => handleOpenStudent(1)} onOpenConsultation={() => setIsConsultationModalOpen(true)} />
      </main>

      <Footer onOpenStudent={() => handleOpenStudent(1)} onOpenTeacher={() => handleOpenTeacher(1)} onOpenHardware={() => setIsHardwareModalOpen(true)} />

      <StudentTerminalModal isOpen={isStudentModalOpen} onClose={() => setIsStudentModalOpen(false)} initialWeek={selectedWeekNumber} />
      <TeacherProjectorModal isOpen={isTeacherModalOpen} onClose={() => setIsTeacherModalOpen(false)} initialWeek={selectedWeekNumber} />
      <AdminDashboardModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} defaultRole={authRolePreset} />
      <HardwareGalleryModal isOpen={isHardwareModalOpen} onClose={() => setIsHardwareModalOpen(false)} />
      <WeekDetailModal week={activeWeekForModal} onClose={() => setActiveWeekForModal(null)} onOpenStudent={(wNum) => handleOpenStudent(wNum)} onOpenTeacher={(wNum) => handleOpenTeacher(wNum)} />
      <LabConsultationModal isOpen={isConsultationModalOpen} onClose={() => setIsConsultationModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return <AuthProvider><MainApp /></AuthProvider>;
}
