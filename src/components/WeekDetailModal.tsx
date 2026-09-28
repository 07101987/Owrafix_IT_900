import React from 'react';
import { CurriculumWeek } from '../types';
import { 
  X, 
  Sparkles, 
  Presentation, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Laptop,
  Award
} from 'lucide-react';

interface WeekDetailProps {
  week: CurriculumWeek | null;
  onClose: () => void;
  onOpenStudent: (weekNum: number) => void;
  onOpenTeacher: (weekNum: number) => void;
}

export const WeekDetailModal: React.FC<WeekDetailProps> = ({
  week,
  onClose,
  onOpenStudent,
  onOpenTeacher
}) => {
  if (!week) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001d36]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white border-4 border-[#001d36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#001d36] text-white p-4 sm:px-6 flex items-center justify-between border-b-2 border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#087443] flex items-center justify-center text-xl font-bold text-white shadow-xs">
              {week.badgeIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#9af7b9]">
                  WEEK {week.weekNumber < 10 ? `0${week.weekNumber}` : week.weekNumber} SYLLABUS
                </span>
                <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full font-mono">
                  {week.mcqCount} MCQs
                </span>
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                {week.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff] space-y-6">
          
          {/* Overview */}
          <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 shadow-xs space-y-2">
            <h4 className="text-xs font-extrabold text-[#0061a4] uppercase tracking-wider">
              Curriculum Summary
            </h4>
            <p className="text-sm text-[#17324d] leading-relaxed">
              {week.description}
            </p>
          </div>

          {/* Workstation Hands-On Task */}
          <div className="bg-[#e9fff6] border-2 border-[#9af7b9] rounded-2xl p-5 shadow-xs flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-[#087443] text-white flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
              🛠️
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#087443] uppercase tracking-wider">
                Hands-On Workstation Challenge
              </div>
              <div className="text-base font-extrabold text-[#001d36] mt-0.5">
                {week.workstationTask}
              </div>
              <div className="text-xs text-[#087443] font-semibold mt-1">
                Badge Unlocked upon completion: <strong>{week.badgeName}</strong>
              </div>
            </div>
          </div>

          {/* Teacher Slide Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#001d36] uppercase tracking-wider">
              Classroom Projector Slides ({week.slides.length} Demonstration Units)
            </h4>
            
            <div className="space-y-3">
              {week.slides.map((s, idx) => (
                <div key={idx} className="bg-white border border-[#d3e9fa] rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0061a4]">
                    <span>Slide {idx + 1}: {s.title}</span>
                    <span className="text-[#087443] font-semibold">Projector Ready</span>
                  </div>
                  <p className="text-xs text-[#17324d]/85">
                    {s.bigConcept}
                  </p>
                  <div className="text-[11px] text-[#087443] font-bold">
                    ✓ Takeaway: {s.keyTakeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Assessment Checkpoint */}
          {week.questions.length > 0 && (
            <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#0061a4] uppercase tracking-wider">
                  Sample Practice Question
                </span>
                <span className="text-[11px] font-bold text-[#087443]">Auto-Marked Instant Star</span>
              </div>
              
              <div className="text-sm font-bold text-[#001d36]">
                {week.questions[0].question}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
                {week.questions[0].options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border ${
                      i === week.questions[0].correctIndex
                        ? 'bg-[#e9fff6] border-[#087443] text-[#087443] font-bold'
                        : 'bg-[#f8f9ff] border-[#d3e9fa] text-[#17324d]'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-white border-t border-[#d3e9fa] p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="btn-chunky-white py-2 px-4 rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Syllabus
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenTeacher(week.weekNumber);
              }}
              className="btn-chunky-green py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Projector Slides</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStudent(week.weekNumber);
              }}
              className="btn-chunky-blue py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Student Quest</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
