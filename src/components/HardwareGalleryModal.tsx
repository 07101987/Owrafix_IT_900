import React, { useState } from 'react';
import { HARDWARE_PARTS } from '../data/curriculum';
import { X, Sparkles, ShieldAlert, Cpu, Eye, Lightbulb, CheckCircle2 } from 'lucide-react';

interface HardwareGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareGalleryModal: React.FC<HardwareGalleryProps> = ({ isOpen, onClose }) => {
  const [selectedPartId, setSelectedPartId] = useState(HARDWARE_PARTS[0].id);

  if (!isOpen) return null;

  const activePart = HARDWARE_PARTS.find((p) => p.id === selectedPartId) || HARDWARE_PARTS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001d36]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border-4 border-[#001d36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#087443] text-white p-4 sm:px-6 flex items-center justify-between border-b-2 border-[#001d36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              🔬
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Computer Hardware Inspector Lab
              </h3>
              <p className="text-xs text-[#9af7b9] font-medium">
                Step 2 Visual Anatomy: Inspect Real Computer Components
              </p>
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Real Hardware Photo with Interactive Pins */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#d3e9fa] bg-black shadow-xs">
                <img
                  src="/src/assets/images/computer_hardware_display_1790527370735.jpg"
                  alt="Computer hardware workbench layout"
                  className="w-full h-72 sm:h-84 object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Photo overlay badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-md border border-white/20 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#9af7b9]" />
                  <span>Interactive High-Resolution Lab Stage</span>
                </div>
              </div>

              {/* Component Selector Buttons */}
              <div className="flex flex-wrap gap-2">
                {HARDWARE_PARTS.map((part) => (
                  <button
                    key={part.id}
                    onClick={() => setSelectedPartId(part.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      selectedPartId === part.id
                        ? 'btn-chunky-green shadow-xs'
                        : 'bg-white border-2 border-[#d3e9fa] text-[#001d36] hover:border-[#087443]'
                    }`}
                  >
                    {part.name.split('(')[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Educational Breakdown */}
            <div className="lg:col-span-5 bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 space-y-4 shadow-xs">
              
              <div>
                <span className="text-[11px] font-extrabold text-[#0061a4] uppercase tracking-wider">
                  Hardware Inspector
                </span>
                <h4 className="text-xl font-extrabold text-[#001d36] mt-0.5">
                  {activePart.name}
                </h4>
                <div className="text-xs font-bold text-[#087443] mt-0.5">
                  {activePart.subtitle}
                </div>
              </div>

              <p className="text-xs text-[#17324d]/80 leading-relaxed font-normal">
                {activePart.description}
              </p>

              {/* Fun Fact Box */}
              <div className="p-3.5 bg-[#fff8e7] border border-[#ffc857] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#654800]">
                  <Lightbulb className="w-4 h-4 text-[#f59e0b]" />
                  <span>Did You Know?</span>
                </div>
                <p className="text-[11px] text-[#654800]/90 leading-relaxed font-medium">
                  {activePart.funFact}
                </p>
              </div>

              {/* Electrical Safety Tip */}
              <div className="p-3.5 bg-[#eaf7ff] border border-[#d3e9fa] rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#0061a4]">
                  <ShieldAlert className="w-4 h-4 text-[#0061a4]" />
                  <span>Lab Safety Protocol</span>
                </div>
                <p className="text-[11px] text-[#17324d]/80 leading-relaxed font-medium">
                  {activePart.safetyTip}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full btn-chunky-white py-2.5 rounded-xl text-xs font-bold text-[#001d36] cursor-pointer"
                >
                  Return to Classroom View
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
