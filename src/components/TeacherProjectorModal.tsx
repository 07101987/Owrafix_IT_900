import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM_DATA, SIMULATED_WORKSTATIONS } from '../data/curriculum';
import { CurriculumWeek, WorkstationTelemetry } from '../types';
import { 
  X, 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Printer,
  Sparkles,
  Eye,
  HelpCircle
} from 'lucide-react';

interface TeacherProjectorProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeek?: number;
}

export const TeacherProjectorModal: React.FC<TeacherProjectorProps> = ({
  isOpen,
  onClose,
  initialWeek = 1
}) => {
  const { userProfile, role } = useAuth();
  const [selectedWeekNum, setSelectedWeekNum] = useState(initialWeek);
  const [slideIdx, setSlideIdx] = useState(0);
  const [isWallProjectorOnly, setIsWallProjectorOnly] = useState(false);
  const [isPaceLocked, setIsPaceLocked] = useState(false);
  
  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Simulated telemetry
  const [workstations, setWorkstations] = useState<WorkstationTelemetry[]>(SIMULATED_WORKSTATIONS);
  const [selectedDesk, setSelectedDesk] = useState<WorkstationTelemetry | null>(null);

  const currentWeek = CURRICULUM_DATA.find((w) => w.weekNumber === selectedWeekNum) || CURRICULUM_DATA[0];
  const slides = currentWeek.slides;
  const currentSlide = slides[slideIdx] || slides[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  if (!isOpen) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextSlide = () => {
    if (slideIdx < slides.length - 1) {
      setSlideIdx((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (slideIdx > 0) {
      setSlideIdx((prev) => prev - 1);
    }
  };

  const togglePaceLock = () => {
    setIsPaceLocked(!isPaceLocked);
  };

  const assistStudent = (id: number) => {
    setWorkstations((prev) =>
      prev.map((w) => (w.id === id ? { ...w, status: 'active', score: Math.min(100, w.score + 10) } : w))
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#001d36] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Projector Toolbar */}
      <div className="bg-[#00210f] border-b border-[#087443]/40 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Left: Branding & Week Selector */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#087443] flex items-center justify-center font-bold text-sm">
            📺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">
                Projector Mode
              </span>
              <span className="text-[10px] font-bold bg-[#9af7b9] text-[#00210f] px-2 py-0.5 rounded-md">
                Wall Display
              </span>
              {userProfile?.regNo && (
                <span className="text-[10px] font-mono font-bold bg-[#087443] text-white px-2 py-0.5 rounded-md">
                  {userProfile.regNo}
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#9af7b9]/80 font-medium">
              Instructor: <strong className="text-white">{userProfile?.displayName || 'Test Applicant'}</strong>
              {userProfile?.course && ` • ${userProfile.course}`}
            </div>
          </div>
        </div>

        {/* Center: Controls for Pace Lock & Timer */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Timer Display */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1 rounded-xl text-xs font-mono">
            <span className="text-white/60">SESSION:</span>
            <span className="font-bold text-[#9af7b9]">{formatTimer(seconds)}</span>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="ml-1 p-0.5 hover:text-white text-white/70 cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
            <button
              onClick={() => setSeconds(0)}
              className="p-0.5 hover:text-white text-white/70 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Pace Lockdown Button */}
          <button
            onClick={togglePaceLock}
            className={`py-1.5 px-3 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPaceLocked
                ? 'bg-[#ba1a1a] text-white ring-2 ring-[#ba1a1a]/50'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isPaceLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isPaceLocked ? 'Class Locked (Eyes Front)' : 'Lock Pace'}</span>
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={() => setIsWallProjectorOnly(!isWallProjectorOnly)}
            className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            {isWallProjectorOnly ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isWallProjectorOnly ? 'Show Teacher Deck' : 'Projector Only Mode'}</span>
          </button>
        </div>

        {/* Right: Exit */}
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Exit Projector Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left / Center Zone: Large 48px Presentation Slide */}
        <div className={`flex-1 flex flex-col justify-between p-6 sm:p-12 overflow-y-auto transition-all ${
          isWallProjectorOnly ? 'w-full max-w-6xl mx-auto' : ''
        }`}>
          
          {/* Slide Header indicator */}
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-[#9af7b9] pb-4 border-b border-white/10">
            <span>LESSON DEMONSTRATION • SLIDE {slideIdx + 1} OF {slides.length}</span>
            <span className="font-mono bg-white/10 px-2 py-0.5 rounded-md">GES ALIGNED</span>
          </div>

          {/* Center Slide Body (Massive 48px Typography for Wall Projection) */}
          <div className="py-6 sm:py-12 space-y-6">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              {currentSlide.title}
            </h2>

            <div className="p-6 sm:p-8 bg-white/5 border-2 border-white/15 rounded-3xl backdrop-blur-xs">
              <div className="text-xs font-bold text-[#9af7b9] uppercase tracking-wider mb-2">
                Core Concept
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium text-white/95 leading-snug">
                {currentSlide.bigConcept}
              </p>
            </div>

            <div className="p-4 sm:p-6 bg-[#087443]/30 border border-[#9af7b9]/40 rounded-2xl flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-[#087443] flex items-center justify-center font-bold text-lg shrink-0 text-white mt-1">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-[#9af7b9] uppercase">
                  Classroom Takeaway
                </div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {currentSlide.keyTakeaway}
                </div>
              </div>
            </div>

            {/* Prompt for pupils */}
            <div className="p-4 bg-[#2196F3]/20 border border-[#2196F3]/40 rounded-2xl flex items-center justify-between gap-4">
              <div className="text-sm sm:text-base font-bold text-white">
                👉 <strong>Student Action:</strong> {currentSlide.actionPrompt}
              </div>
            </div>
          </div>

          {/* Slide Navigation Footbar */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                disabled={slideIdx === 0}
                className="btn-chunky-white py-2 px-4 rounded-xl text-xs font-bold text-[#001d36] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>
              <button
                onClick={handleNextSlide}
                disabled={slideIdx === slides.length - 1}
                className="btn-chunky-green py-2 px-5 rounded-xl text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-bold text-white/60">
              Slide {slideIdx + 1} / {slides.length}
            </div>
          </div>

        </div>

        {/* Right Zone: Teacher Deck & Telemetry (Hidden when in Wall Only mode) */}
        {!isWallProjectorOnly && (
          <div className="w-full lg:w-96 bg-[#001424] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between p-5 overflow-y-auto">
            
            <div className="space-y-5">
              
              {/* Teacher Prompt Notes (Hidden from Wall Projector) */}
              <div className="bg-white/5 border border-white/15 rounded-2xl p-4">
                <div className="flex items-center justify-between gap-1.5 text-xs font-extrabold text-[#f59e0b] uppercase tracking-wider mb-2">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Instructor Prompt Notes</span>
                  </div>
                  <span className="text-[10px] text-white/50 lowercase font-normal">
                    {userProfile?.displayName || 'Teacher View'}
                  </span>
                </div>
                <p className="text-xs text-white/85 leading-relaxed italic">
                  “{currentSlide.teacherNotes}”
                </p>
              </div>

              {/* Live Classroom Telemetry (28 Desks) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-white">
                    <Users className="w-3.5 h-3.5 text-[#9af7b9]" />
                    <span>Live Workstation Telemetry</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#9af7b9] bg-[#005932] px-2 py-0.5 rounded-full font-mono">
                    28 Connected
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                  {workstations.map((desk) => {
                    const isHelp = desk.status === 'needs-help';
                    const isDone = desk.status === 'completed';

                    return (
                      <button
                        key={desk.id}
                        onClick={() => setSelectedDesk(desk)}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          isHelp
                            ? 'bg-[#ba1a1a]/30 border-[#ba1a1a] text-white animate-pulse'
                            : isDone
                            ? 'bg-[#087443]/30 border-[#087443] text-white'
                            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <div className="text-[10px] font-bold text-white/50">{desk.seatNumber}</div>
                        <div className="text-xs font-extrabold truncate">{desk.studentName}</div>
                        <div className="text-[10px] font-mono mt-0.5 text-[#9af7b9]">
                          {desk.score}%
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Desk Inspection Card */}
              {selectedDesk && (
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-white">{selectedDesk.seatNumber}: {selectedDesk.studentName}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                      selectedDesk.status === 'needs-help' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'
                    }`}>
                      {selectedDesk.status}
                    </span>
                  </div>
                  <div className="text-xs text-white/80 mb-3">
                    Current Task: {selectedDesk.currentTask}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => assistStudent(selectedDesk.id)}
                      className="btn-chunky-green py-1.5 px-3 rounded-lg text-[11px] font-bold flex-1 text-center cursor-pointer"
                    >
                      Send Encouraging Hint
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => window.print()}
                className="w-full btn-chunky-white py-2 px-3 rounded-xl text-xs font-bold text-[#001d36] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export Lesson Summary Card</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
