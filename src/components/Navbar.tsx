import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Laptop, 
  WifiOff, 
  Award, 
  Menu, 
  X, 
  Sparkles,
  Presentation,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenStudent: () => void;
  onOpenTeacher: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenHardware: () => void;
  onOpenMouseGame: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenStudent,
  onOpenTeacher,
  onOpenAdmin,
  onOpenAuth,
  onOpenHardware,
  onOpenMouseGame
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { userProfile, role, logout } = useAuth();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D3E9FA] shadow-xs">
      {/* Top Classroom Connectivity Strip */}
      <div className="bg-[#005932] text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[#9af7b9] font-semibold">
              <WifiOff className="w-3.5 h-3.5" />
              Offline-ready classroom PWA enabled
            </span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline text-white/90">
              Designed for Ghana Smart Schools & Low-Bandwidth Labs
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#7ed99e] animate-pulse"></span>
              <span>Accra Lab Server: Online</span>
            </div>
            <div className="flex items-center gap-1 text-[#9af7b9]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MoE GES Curriculum Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus-visible:outline-hidden"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#087443] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Laptop className="w-5 h-5 text-[#9af7b9]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-[#001d36]">
                Owrafix
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e9fff6] text-[#087443] px-1.5 py-0.5 rounded-md border border-[#9af7b9]/50">
                Labs
              </span>
            </div>
            <p className="text-[11px] text-[#001d36]/60 font-medium">
              Junior Computer School
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#001d36]/80">
          <button 
            onClick={() => scrollToSection('formula-section')}
            className="hover:text-[#087443] transition-colors cursor-pointer"
          >
            About Programme
          </button>
          <button 
            onClick={() => scrollToSection('roadmap-section')}
            className="hover:text-[#087443] transition-colors cursor-pointer"
          >
            12-Week Curriculum
          </button>
          <button 
            onClick={onOpenStudent}
            className="hover:text-[#2196F3] transition-colors cursor-pointer flex items-center gap-1"
          >
            Student Quest
          </button>
          <button 
            onClick={onOpenTeacher}
            className="hover:text-[#087443] transition-colors cursor-pointer flex items-center gap-1"
          >
            Teacher Deck
          </button>
          <button 
            onClick={onOpenAdmin}
            className="hover:text-[#654800] transition-colors cursor-pointer flex items-center gap-1"
          >
            Admin Portal
          </button>
          <button 
            onClick={onOpenHardware}
            className="hover:text-[#087443] transition-colors cursor-pointer"
          >
            Hardware Lab
          </button>
        </nav>

        {/* Action Buttons & Auth Pill */}
        <div className="hidden sm:flex items-center gap-3">
          
          {userProfile ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="bg-[#f8f9ff] border-2 border-[#d3e9fa] hover:border-[#087443] rounded-xl px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold ${
                  role === 'admin' ? 'bg-[#ffdea4] text-[#654800]' : role === 'teacher' ? 'bg-[#e9fff6] text-[#087443]' : 'bg-[#eaf7ff] text-[#0061a4]'
                }`}>
                  {role === 'admin' ? '🏛️' : role === 'teacher' ? '👨‍🏫' : '🎒'}
                </div>
                <div className="text-left">
                  <div className="text-xs font-extrabold text-[#001d36] truncate max-w-[110px]">
                    {userProfile.displayName?.split(' ')[0] || 'User'}
                  </div>
                  <div className="text-[10px] font-bold uppercase text-[#087443] leading-none">
                    {role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#17324d]/60" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white border-2 border-[#001d36] rounded-2xl shadow-xl p-2 z-50 animate-in zoom-in-95">
                  <div className="px-3 py-2 border-b border-[#eef4ff]">
                    <div className="text-xs font-extrabold text-[#001d36] truncate">
                      {userProfile.displayName}
                    </div>
                    <div className="text-[10px] text-[#17324d]/70 truncate flex items-center gap-1 font-mono">
                      {userProfile.authProvider === 'whatsapp' ? (
                        <span className="text-[#128C7E] font-bold">🟢 WhatsApp: {userProfile.phoneNumber}</span>
                      ) : (
                        userProfile.email || 'Classroom User'
                      )}
                    </div>
                  </div>

                  <div className="py-1 text-xs font-bold text-[#001d36]">
                    <button
                      onClick={() => { setUserDropdownOpen(false); onOpenStudent(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#eaf7ff] hover:text-[#0061a4] flex items-center gap-2"
                    >
                      <span>🎒</span>
                      <span>Student Terminal</span>
                    </button>
                    <button
                      onClick={() => { setUserDropdownOpen(false); onOpenTeacher(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#e9fff6] hover:text-[#087443] flex items-center gap-2"
                    >
                      <span>👨‍🏫</span>
                      <span>Teacher Projector</span>
                    </button>
                    <button
                      onClick={() => { setUserDropdownOpen(false); onOpenAdmin(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#fff8e7] hover:text-[#654800] flex items-center gap-2"
                    >
                      <span>🏛️</span>
                      <span>Admin & MoE Dashboard</span>
                    </button>
                    <button
                      onClick={() => { setUserDropdownOpen(false); onOpenAuth(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f8f9ff] flex items-center gap-2"
                    >
                      <span>🔄</span>
                      <span>Switch Role / Account</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#eef4ff]">
                    <button
                      onClick={() => { setUserDropdownOpen(false); logout(); }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-[#ba1a1a] hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-chunky-white px-3.5 py-2 text-xs font-extrabold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs border-[#128C7E]/40 hover:border-[#128C7E]"
            >
              <div className="w-4 h-4 rounded-full bg-[#25D366] text-[#003816] flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 2C6.511 2 2.016 6.477 2.016 11.979c0 1.954.566 3.778 1.547 5.323L2 22l4.898-1.527c1.477.893 3.208 1.408 5.133 1.408 5.52 0 10.015-4.477 10.015-9.979C22.046 6.477 17.551 2 12.031 2zm0 18.232c-1.68 0-3.238-.49-4.557-1.332l-.326-.208-2.983.931.956-2.898-.225-.349c-.933-1.442-1.428-3.13-1.428-4.887 0-4.664 3.812-8.46 8.563-8.46 4.75 0 8.562 3.796 8.562 8.46 0 4.664-3.812 8.443-8.563 8.443zm4.698-6.315c-.258-.129-1.527-.751-1.764-.837-.237-.086-.409-.129-.581.129-.172.258-.667.837-.818 1.009-.151.172-.301.193-.559.064-.258-.129-1.089-.4-2.074-1.275-.768-.682-1.286-1.525-1.437-1.783-.151-.258-.016-.397.113-.526.116-.115.258-.301.387-.451.129-.151.172-.258.258-.43.086-.172.043-.323-.022-.451-.064-.129-.581-1.397-.796-1.913-.209-.502-.421-.433-.581-.442-.151-.008-.323-.01-.495-.01-.172 0-.451.064-.688.323-.237.258-.903.882-.903 2.15 0 1.268.924 2.494 1.053 2.666.129.172 1.819 2.766 4.406 3.879.616.265 1.097.423 1.472.542.619.196 1.182.168 1.627.102.496-.074 1.527-.624 1.742-1.226.215-.602.215-1.118.151-1.226-.064-.107-.236-.172-.494-.301z"/>
                </svg>
              </div>
              <span>WhatsApp Login</span>
            </button>
          )}

          <button
            onClick={onOpenStudent}
            className="btn-chunky-blue px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={onOpenTeacher}
            className="btn-chunky-green px-3.5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Projector Mode</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#001d36] hover:bg-[#eef4ff] cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#D3E9FA] px-4 pt-3 pb-5 space-y-3">
          
          {userProfile && (
            <div className="p-3 bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold text-[#001d36]">
                  {userProfile.displayName}
                </div>
                <div className="text-[10px] text-[#087443] font-bold uppercase">
                  Role: {role}
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="text-xs font-bold text-[#ba1a1a] hover:underline"
              >
                Log Out
              </button>
            </div>
          )}

          <div className="flex flex-col gap-2 font-medium text-sm text-[#001d36]">
            {!userProfile && (
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="text-left px-3 py-2.5 rounded-xl bg-[#25D366] text-[#003816] font-extrabold flex items-center justify-between shadow-xs border border-[#003816]/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white text-[#003816] flex items-center justify-center text-xs">
                    💬
                  </div>
                  <span>WhatsApp Login (Student / Teacher / Admin)</span>
                </div>
                <span className="text-xs">➔</span>
              </button>
            )}
            <button 
              onClick={() => scrollToSection('formula-section')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#eef4ff]"
            >
              About Programme
            </button>
            <button 
              onClick={() => scrollToSection('roadmap-section')}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#eef4ff]"
            >
              12-Week Curriculum
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#eef4ff] text-[#654800] font-bold"
            >
              Admin & MoE Portal
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenHardware(); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#eef4ff]"
            >
              Hardware Gallery
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenMouseGame(); }}
              className="text-left px-3 py-2 rounded-lg hover:bg-[#eef4ff]"
            >
              Mouse Master Game
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenStudent(); }}
              className="w-full btn-chunky-blue py-3 rounded-xl text-center font-bold text-sm"
            >
              Student Portal — Enter Classroom
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTeacher(); }}
              className="w-full btn-chunky-green py-3 rounded-xl text-center font-bold text-sm"
            >
              Teacher Portal — Projector Mode
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
