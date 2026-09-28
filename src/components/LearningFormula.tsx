import React from 'react';
import { 
  Presentation, 
  Eye, 
  Keyboard, 
  HelpCircle, 
  Award,
  ArrowRight
} from 'lucide-react';

interface LearningFormulaProps {
  onOpenTeacher: () => void;
  onOpenHardware: () => void;
  onOpenStudent: () => void;
  onOpenMouseGame: () => void;
}

export const LearningFormula: React.FC<LearningFormulaProps> = ({
  onOpenTeacher,
  onOpenHardware,
  onOpenStudent,
  onOpenMouseGame
}) => {
  const steps = [
    {
      number: '1',
      stepLabel: 'STEP ONE',
      title: 'Teacher Demo',
      description: 'Teacher projects high-contrast interactive slides on the classroom projector. Concepts are mapped step-by-step.',
      btnText: 'Projector Mode',
      btnIcon: Presentation,
      color: 'bg-[#087443]',
      onClick: onOpenTeacher
    },
    {
      number: '2',
      stepLabel: 'STEP TWO',
      title: 'Real Visuals',
      description: 'Pupils inspect high-resolution photographs of physical ports, cables, mice, keyboards, and motherboard parts.',
      btnText: 'Hardware Gallery',
      btnIcon: Eye,
      color: 'bg-[#0061a4]',
      onClick: onOpenHardware
    },
    {
      number: '3',
      stepLabel: 'STEP THREE',
      title: 'Student Practice',
      description: 'Pupils switch immediately to individual workstation screens. Physical muscle memory drills for typing & mousing.',
      btnText: 'Tactile Workstation',
      btnIcon: Keyboard,
      color: 'bg-[#654800]',
      onClick: onOpenMouseGame
    },
    {
      number: '4',
      stepLabel: 'STEP FOUR',
      title: 'Quick Check',
      description: '3-question friendly checkpoints during lesson time give instant encouraging hints before anyone falls behind.',
      btnText: 'Live Feedback',
      btnIcon: HelpCircle,
      color: 'bg-[#0061a4]',
      onClick: onOpenStudent
    },
    {
      number: '5',
      stepLabel: 'STEP FIVE',
      title: 'Mastery Test',
      description: '20-question randomized mastery challenge. Auto-marked instantly with stars, digital certificates, and teacher gradebooks.',
      btnText: 'Instant Badge Issue',
      btnIcon: Award,
      color: 'bg-[#087443]',
      onClick: onOpenStudent
    }
  ];

  return (
    <section id="formula-section" className="py-20 bg-[#f8f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#0061a4]">
            CORE CLASSROOM METHODOLOGY
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001d36] tracking-tight">
            The Owrafix Learning Formula
          </h2>
          <p className="text-base sm:text-lg text-[#17324d]/80 italic font-medium">
            “Do not just tell children about computers. Build an environment where they see, 
            understand, practise, and demonstrate.”
          </p>
        </div>

        {/* 5-Step Formula Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {steps.map((step) => {
            const Icon = step.btnIcon;
            return (
              <div
                key={step.number}
                className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 flex flex-col justify-between hover:border-[#087443] transition-all hover:shadow-md group"
              >
                <div>
                  {/* Step Number Badge */}
                  <div className={`w-9 h-9 rounded-xl ${step.color} text-white font-extrabold flex items-center justify-center text-sm shadow-xs mb-4`}>
                    {step.number}
                  </div>

                  <div className="text-[11px] font-bold text-[#0061a4] uppercase tracking-wider mb-1">
                    {step.stepLabel}
                  </div>

                  <h3 className="text-lg font-extrabold text-[#001d36] mb-2 group-hover:text-[#087443] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#17324d]/75 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Tactile Mini Action Trigger */}
                <div className="pt-5">
                  <button
                    onClick={step.onClick}
                    className="w-full btn-chunky-white py-2 px-3 rounded-xl text-xs font-bold text-[#001d36] flex items-center justify-center gap-1.5 hover:text-[#087443] cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#087443]" />
                    <span className="truncate">{step.btnText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
