import React, { useState } from 'react';
import { 
  Sparkles, 
  Presentation, 
  CheckCircle, 
  XCircle, 
  Lock, 
  FileText, 
  Users, 
  Check, 
  ExternalLink,
  Volume2
} from 'lucide-react';

interface DualInterfacesProps {
  onOpenStudent: () => void;
  onOpenTeacher: () => void;
}

export const DualInterfacesSection: React.FC<DualInterfacesProps> = ({
  onOpenStudent,
  onOpenTeacher
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [xpBonus, setXpBonus] = useState(340);

  const handleSelect = (option: 'A' | 'B') => {
    setSelectedOption(option);
    setShowFeedback(true);
    if (option === 'B') {
      setXpBonus((prev) => (prev === 340 ? 360 : prev));
    }
  };

  return (
    <section id="interfaces-section" className="py-20 bg-white border-t border-[#d3e9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#005932]">
            TAILORED INTERFACES
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001d36] tracking-tight">
            Designed for Two Sides of the Lab
          </h2>
          <p className="text-base sm:text-lg text-[#17324d]/80 font-normal">
            Children get an adventurous quest interface; educators receive seamless classroom control without clunky spreadsheets.
          </p>
        </div>

        {/* 2-Column Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Card 1: Student Experience */}
          <div className="bg-[#f8f9ff] border-2 border-[#d3e9fa] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#2196F3] transition-colors">
            <div>
              {/* Header with XP Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0061a4] uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-[#2196F3]" />
                  <span>Student Experience</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#fff8e7] border border-[#ffc857] text-[#654800] px-3 py-1 rounded-full text-xs font-extrabold">
                  <span>⭐</span>
                  <span className="font-mono tabular-nums">{xpBonus} XP</span>
                  <span className="text-[#654800]/70 font-semibold">• Level 3</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#001d36] tracking-tight mb-2">
                “Quest Terminal” for Young Coders
              </h3>
              <p className="text-sm text-[#17324d]/80 leading-relaxed mb-6">
                Tactile oversized interactive buttons, friendly instant error messages, 
                animated level progressions, and zero confusing advertisements.
              </p>

              {/* Live Interactive Practice Module Preview */}
              <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 mb-6 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-[#0061a4] pb-3 mb-3 border-b border-[#eef4ff]">
                  <span className="uppercase tracking-wider">Practice Check #2.1</span>
                  <span className="text-[#087443] bg-[#e9fff6] px-2 py-0.5 rounded-md">Week 2: Mouse Mastery</span>
                </div>

                <div className="text-base sm:text-lg font-extrabold text-[#001d36] mb-4">
                  Which mouse button opens the shortcut action menu?
                </div>

                {/* Interactive Option Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => handleSelect('A')}
                    className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-left flex items-center justify-between border-2 transition-all cursor-pointer ${
                      selectedOption === 'A'
                        ? 'bg-[#fff1f1] border-[#ba1a1a] text-[#ba1a1a]'
                        : 'bg-[#f8f9ff] border-[#d3e9fa] text-[#001d36] hover:border-[#2196F3]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-white border border-[#d3e9fa] flex items-center justify-center font-bold text-xs">
                        A
                      </span>
                      <span>Left Click Button</span>
                    </div>
                    {selectedOption === 'A' && <XCircle className="w-4 h-4 shrink-0 text-[#ba1a1a]" />}
                  </button>

                  <button
                    onClick={() => handleSelect('B')}
                    className={`py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-left flex items-center justify-between border-2 transition-all cursor-pointer ${
                      selectedOption === 'B'
                        ? 'bg-[#e9fff6] border-[#087443] text-[#087443]'
                        : 'bg-[#f8f9ff] border-[#d3e9fa] text-[#001d36] hover:border-[#087443]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-white border border-[#d3e9fa] flex items-center justify-center font-bold text-xs">
                        B
                      </span>
                      <span>Right Click Button</span>
                    </div>
                    {selectedOption === 'B' && <CheckCircle className="w-4 h-4 shrink-0 text-[#087443]" />}
                  </button>
                </div>

                {/* Instant Feedback Callout */}
                {showFeedback && (
                  <div className={`text-xs p-3 rounded-xl mb-4 font-semibold ${
                    selectedOption === 'B' 
                      ? 'bg-[#e9fff6] text-[#087443] border border-[#9af7b9]' 
                      : 'bg-[#fff8e7] text-[#654800] border border-[#ffc857]'
                  }`}>
                    {selectedOption === 'B' ? (
                      <div className="flex items-center gap-1.5">
                        <span>🌟 <strong>Correct!</strong> Middle finger right-click triggers the context action menu (+20 XP)!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span>💡 Left click selects and opens; try the <strong>Right Click</strong> button for the menu!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Progress Indicator */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#17324d]">
                    <span>Weekly Module Progress</span>
                    <span className="text-[#087443] font-mono tabular-nums">75% Complete</span>
                  </div>
                  <div className="w-full h-3 bg-[#eef4ff] rounded-full overflow-hidden p-0.5 border border-[#d3e9fa]">
                    <div className="h-full bg-[#087443] rounded-full w-[75%] transition-all duration-500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={onOpenStudent}
              className="w-full btn-chunky-blue py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Launch Student Terminal Demo</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Teacher Deck & Analytics */}
          <div className="bg-[#f8f9ff] border-2 border-[#d3e9fa] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-[#087443] transition-colors">
            <div>
              {/* Header with Lab Sync Pill */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#005932] uppercase tracking-wide">
                  <Presentation className="w-4 h-4 text-[#087443]" />
                  <span>Teacher Deck & Analytics</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-[#e9fff6] border border-[#9af7b9] text-[#087443] px-3 py-1 rounded-full text-xs font-extrabold">
                  <span className="w-2 h-2 rounded-full bg-[#087443] animate-pulse"></span>
                  <span>Lab Sync: Active</span>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#001d36] tracking-tight mb-2">
                Dual-Display Projector Control
              </h3>
              <p className="text-sm text-[#17324d]/80 leading-relaxed mb-6">
                Teachers see prompt notes, timing markers, and live workstation telemetry. 
                The class wall projector sees only beautiful clean 48px lesson slides.
              </p>

              {/* Projector Deck Visual Preview */}
              <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl overflow-hidden mb-6 shadow-xs">
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900 group">
                  <img
                    src="/src/assets/images/teacher_projector_lab_1790527359831.jpg"
                    alt="Teacher demonstrating lesson on classroom projector"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Top pill */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
                    <Presentation className="w-3.5 h-3.5 text-[#9af7b9]" />
                    <span>Projector: High-Contrast Lesson Deck</span>
                  </div>

                  {/* Class telemetry stat */}
                  <div className="absolute bottom-3 right-3 bg-[#087443] text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-sm font-mono tabular-nums">
                    87% Class Average
                  </div>
                </div>

                {/* Feature Tags Grid */}
                <div className="p-4 grid grid-cols-2 gap-2 text-xs font-bold text-[#001d36]/80">
                  <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded-xl border border-[#d3e9fa]">
                    <span className="text-[#087443]">✓</span>
                    <span className="truncate">Hidden Teacher Notes</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded-xl border border-[#d3e9fa]">
                    <span className="text-[#087443]">✓</span>
                    <span className="truncate">Auto-Marked Gradebook</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded-xl border border-[#d3e9fa]">
                    <span className="text-[#087443]">✓</span>
                    <span className="truncate">Class Pace Lockdown</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded-xl border border-[#d3e9fa]">
                    <span className="text-[#087443]">✓</span>
                    <span className="truncate">Printable Summary Cards</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={onOpenTeacher}
              className="w-full btn-chunky-green py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Open Teacher Presentation Deck</span>
              <Presentation className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
