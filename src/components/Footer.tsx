import React from 'react';
import { Laptop, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenStudent: () => void;
  onOpenTeacher: () => void;
  onOpenHardware: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenStudent,
  onOpenTeacher,
  onOpenHardware
}) => {
  return (
    <footer className="bg-white border-t border-[#d3e9fa] pt-14 pb-10 text-xs text-[#17324d]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#eef4ff]">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#087443] flex items-center justify-center text-white shadow-xs">
                <Laptop className="w-5 h-5 text-[#9af7b9]" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-[#001d36]">
                  Owrafix
                </span>
                <span className="block text-[11px] font-bold text-[#087443] -mt-0.5">
                  Junior Computer School
                </span>
              </div>
            </div>

            <p className="text-xs text-[#17324d]/70 leading-relaxed max-w-sm">
              Empowering Ghanaian basic school students aged 8–13 with early hardware mastery, 
              tactile computing, and foundational programming. Built for high impact in both connected 
              and low-connectivity computer laboratories.
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#087443]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Child–Safe Digital Environment • GES Aligned • Zero Dark Patterns</span>
            </div>
          </div>

          {/* Col 2: Curriculum Tracks */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#001d36]">
              Curriculum Tracks
            </h4>
            <ul className="space-y-2 font-medium">
              <li><a href="#roadmap-section" className="hover:text-[#087443] transition-colors">Hardware & Peripherals</a></li>
              <li><a href="#roadmap-section" className="hover:text-[#087443] transition-colors">Algorithmic Logic</a></li>
              <li><a href="#roadmap-section" className="hover:text-[#087443] transition-colors">Block & Python Coding</a></li>
              <li><a href="#roadmap-section" className="hover:text-[#087443] transition-colors">Cyber Safety & Ethics</a></li>
            </ul>
          </div>

          {/* Col 3: Quick Portals */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#001d36]">
              Quick Portals
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button onClick={onOpenStudent} className="hover:text-[#087443] transition-colors text-left cursor-pointer">
                  Student Quest Terminal
                </button>
              </li>
              <li>
                <button onClick={onOpenTeacher} className="hover:text-[#087443] transition-colors text-left cursor-pointer">
                  Teacher Projector Deck
                </button>
              </li>
              <li>
                <button onClick={onOpenHardware} className="hover:text-[#087443] transition-colors text-left cursor-pointer">
                  Hardware Inspector Lab
                </button>
              </li>
              <li>
                <a href="#roadmap-section" className="hover:text-[#087443] transition-colors">
                  Ghana School Showcase
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: School Inquiries */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#001d36]">
              School Inquiries
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#087443] shrink-0 mt-0.5" />
                <span>Accra Learning Lab Hub, Greater Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#087443] shrink-0" />
                <a href="mailto:labs@owrafix.edu.gh" className="hover:underline">labs@owrafix.edu.gh</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#087443] shrink-0" />
                <span>+233 (0) 24 000 0000</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#17324d]/60">
          <div>
            © 2025 Owrafix Junior Computer School. All rights reserved. Designed for Ghanaian Basic Schools.
          </div>
          <div className="flex items-center gap-4 font-semibold text-[#001d36]/70">
            <a href="#" className="hover:underline">Child Safety Protocol</a>
            <span>•</span>
            <a href="#" className="hover:underline">Classroom Privacy</a>
            <span>•</span>
            <a href="#" className="hover:underline">Educator Terms</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
