import React from 'react';
import { 
  Sparkles, 
  Presentation, 
  ArrowDown, 
  CheckCircle2, 
  Award,
  Zap,
  Laptop
} from 'lucide-react';

interface HeroProps {
  onOpenStudent: () => void;
  onOpenTeacher: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenStudent, onOpenTeacher }) => {
  const scrollToCurriculum = () => {
    const el = document.getElementById('roadmap-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#eaf7ff] rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 bg-[#e9fff6] rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 bg-[#eaf7ff] border border-[#d3e9fa] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#0061a4]">
              <Laptop className="w-3.5 h-3.5" />
              <span>Ages 8–13 • Practical Computing for Ghanaian Schools</span>
            </div>

            {/* Second Kicker Line */}
            <div className="text-xs font-extrabold tracking-wider text-[#005932] uppercase">
              LEARN • PRACTISE • CREATE • BECOME DIGITALLY CONFIDENT
            </div>

            {/* Main Projector-Grade Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#001d36] tracking-tight leading-[1.12]">
              Practical Computer Skills Made{' '}
              <span className="relative inline-block text-[#087443] underline decoration-[#9af7b9] decoration-wavy decoration-2 underline-offset-8">
                Fun & Empowering
              </span>{' '}
              for Young Learners.
            </h1>

            {/* Subhead Description */}
            <p className="text-base sm:text-lg text-[#17324D]/80 leading-relaxed max-w-2xl font-normal">
              A structured 12–week hands-on digital literacy programme designed specifically for 
              Ghanaian basic school computer laboratories. Combining big-screen teacher projector 
              demonstrations with individual student workstation tasks, 100% offline classroom 
              capability, and instant 20–question mastery feedback.
            </p>

            {/* Big Action Chunky Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 max-w-xl">
              {/* Student Portal Button */}
              <button
                onClick={onOpenStudent}
                className="btn-chunky-blue flex-1 py-4 px-5 rounded-2xl text-left flex items-start gap-3.5 cursor-pointer shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    Student Portal — Enter Classroom
                  </div>
                  <div className="text-xs text-white/90 font-medium mt-0.5">
                    Earn XP, Badges & Solve Quests
                  </div>
                </div>
              </button>

              {/* Teacher Portal Button */}
              <button
                onClick={onOpenTeacher}
                className="btn-chunky-green flex-1 py-4 px-5 rounded-2xl text-left flex items-start gap-3.5 cursor-pointer shadow-md group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-base font-bold text-white leading-tight">
                    Teacher Portal — Projector Mode
                  </div>
                  <div className="text-xs text-white/90 font-medium mt-0.5">
                    Instant Slides & Realtime Class Score
                  </div>
                </div>
              </button>
            </div>

            {/* Syllabus Helper Link */}
            <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-[#001d36]/70">
              <span>Want to explore the week-by-week syllabus first?</span>
              <button
                onClick={scrollToCurriculum}
                className="text-[#087443] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                Explore 12-Week Curriculum
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Floating Top XP Badge */}
              <div className="absolute -top-4 -left-3 sm:-left-6 z-20 bg-white border-2 border-[#ffc857] shadow-lg rounded-2xl px-4 py-2.5 flex items-center gap-2.5 animate-bounce [animation-duration:3s]">
                <div className="w-8 h-8 rounded-xl bg-[#fff8e7] text-[#654800] flex items-center justify-center font-bold text-lg">
                  ⭐
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#17324d]">
                    +85 XP Earned!
                  </div>
                  <div className="text-[11px] text-[#17324d]/70 font-medium">
                    Mouse Navigation Complete
                  </div>
                </div>
              </div>

              {/* Central Photo Container */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-slate-900 group">
                <img
                  src="/src/assets/images/ghana_lab_students_1790527347951.jpg"
                  alt="Ghanaian basic school students actively practicing computer mouse navigation"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Overlaid Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001d36]/85 via-transparent to-black/25 pointer-events-none" />

                {/* Top-Right Offline Pill on Photo */}
                <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#7ed99e] animate-ping" />
                  <span>100% Offline Capable</span>
                </div>

                {/* Bottom Caption Strip */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-1.5 font-semibold bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
                    <Laptop className="w-3.5 h-3.5 text-[#9af7b9]" />
                    <span>Hands-on Lab Session #04</span>
                  </div>
                  <span className="text-white/80 font-medium text-[11px] hidden sm:inline">
                    Primary 5 & 6 St. Kizito Basic
                  </span>
                </div>
              </div>

              {/* Bottom Floating Achievement Badge */}
              <div className="absolute -bottom-5 -right-2 sm:-right-4 z-20 bg-white border-2 border-[#9af7b9] shadow-xl rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e9fff6] text-[#087443] flex items-center justify-center font-bold text-xl shrink-0">
                  🏆
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#001d36] flex items-center gap-1">
                    <span>Computer Explorer</span>
                  </div>
                  <div className="text-[11px] text-[#087443] font-bold">
                    Mastery Badge Unlocked
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
