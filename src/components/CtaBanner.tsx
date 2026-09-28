import React from 'react';
import { Sparkles, Calendar, ArrowRight, Laptop } from 'lucide-react';

interface CtaBannerProps {
  onOpenStudent: () => void;
  onOpenConsultation: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenStudent, onOpenConsultation }) => {
  return (
    <section className="bg-[#005932] text-white py-16 lg:py-20 relative overflow-hidden">
      {/* Background soft ambient accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#087443]/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl space-y-6">
          
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#9af7b9]">
            READY TO EMPOWER YOUR SCHOOL’S YOUNG LEARNERS?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Bring Owrafix to Your School Computer Lab This Term.
          </h2>

          <p className="text-base sm:text-lg text-white/85 leading-relaxed font-normal max-w-3xl">
            Whether you have a 40–computer air-conditioned laboratory or 5 shared netbooks running 
            on solar, Owrafix deploys in 30 minutes with full teacher training.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenStudent}
              className="btn-chunky-white py-3.5 px-6 rounded-2xl font-extrabold text-sm text-[#001d36] flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#087443]" />
              <span>Start Learning Free</span>
            </button>

            <button
              onClick={onOpenConsultation}
              className="border-2 border-white/40 hover:border-white bg-white/10 hover:bg-white/20 text-white py-3.5 px-6 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#9af7b9]" />
              <span>Book Lab Consultation</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
