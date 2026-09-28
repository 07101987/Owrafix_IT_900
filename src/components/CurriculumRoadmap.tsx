import React, { useState } from 'react';
import { CURRICULUM_DATA } from '../data/curriculum';
import { CurriculumWeek } from '../types';
import { 
  CheckCircle2, 
  Layers, 
  Award, 
  ExternalLink, 
  BookOpen, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CurriculumRoadmapProps {
  onSelectWeek: (week: CurriculumWeek) => void;
}

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({ onSelectWeek }) => {
  const [filter, setFilter] = useState<'all' | 'hardware' | 'basics' | 'software' | 'safety' | 'creative'>('all');

  const filteredWeeks = filter === 'all' 
    ? CURRICULUM_DATA 
    : CURRICULUM_DATA.filter((w) => w.category === filter);

  return (
    <section id="roadmap-section" className="py-20 bg-white border-t border-[#d3e9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#0061a4]">
              GES ALIGNED SYLLABUS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001d36] tracking-tight">
              The Complete 12–Week Roadmap
            </h2>
            <p className="text-base text-[#17324d]/80 leading-relaxed font-normal">
              From basic physical anatomy to safe AI exploration and capstone web presentations. 
              Each single week delivers 1 lesson, 1 hands-on task, and 1 auto-marked skill check.
            </p>
          </div>

          {/* Right badge */}
          <div className="inline-flex items-center gap-2 bg-[#e9fff6] border border-[#9af7b9] px-4 py-2 rounded-xl text-xs font-bold text-[#087443] shrink-0 self-start lg:self-auto shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-[#087443]" />
            <span>100% Practical (No passive copying)</span>
          </div>
        </div>

        {/* Category Filter Pills (Functional) */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#087443] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#17324d] hover:bg-[#eef4ff] border border-[#d3e9fa]'
            }`}
          >
            All 12 Weeks
          </button>
          <button
            onClick={() => setFilter('hardware')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'hardware'
                ? 'bg-[#087443] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#17324d] hover:bg-[#eef4ff] border border-[#d3e9fa]'
            }`}
          >
            Hardware & Safety
          </button>
          <button
            onClick={() => setFilter('basics')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'basics'
                ? 'bg-[#087443] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#17324d] hover:bg-[#eef4ff] border border-[#d3e9fa]'
            }`}
          >
            Mouse & Typing
          </button>
          <button
            onClick={() => setFilter('software')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'software'
                ? 'bg-[#087443] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#17324d] hover:bg-[#eef4ff] border border-[#d3e9fa]'
            }`}
          >
            Office & Word
          </button>
          <button
            onClick={() => setFilter('safety')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'safety'
                ? 'bg-[#087443] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#17324d] hover:bg-[#eef4ff] border border-[#d3e9fa]'
            }`}
          >
            Cyber Safety
          </button>
          <button
            onClick={() => setFilter('creative')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'creative'
                ? 'bg-[#087443] text-white shadow-xs'
                : 'bg-[#f8f9ff] text-[#17324d] hover:bg-[#eef4ff] border border-[#d3e9fa]'
            }`}
          >
            Creative & Capstone
          </button>
        </div>

        {/* 12-Week Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeeks.map((item) => {
            const isCapstone = item.weekNumber === 12;

            return (
              <div
                key={item.weekNumber}
                onClick={() => onSelectWeek(item)}
                className={`border-2 rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 group ${
                  isCapstone 
                    ? 'bg-[#e9fff6] border-[#087443]' 
                    : 'bg-[#f8f9ff] border-[#d3e9fa] hover:border-[#087443]'
                }`}
              >
                <div>
                  {/* Top line with week tag & MCQ counter */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                      isCapstone
                        ? 'bg-[#087443] text-white'
                        : item.weekNumber % 3 === 0
                        ? 'bg-[#fff8e7] text-[#654800]'
                        : item.weekNumber % 2 === 0
                        ? 'bg-[#eaf7ff] text-[#0061a4]'
                        : 'bg-[#e9fff6] text-[#087443]'
                    }`}>
                      WEEK {item.weekNumber < 10 ? `0${item.weekNumber}` : item.weekNumber}
                    </span>

                    <span className="text-[11px] font-extrabold text-[#17324d]/70 flex items-center gap-1 font-mono">
                      <span>⭐</span>
                      <span>{isCapstone ? 'CAPSTONE' : `${item.mcqCount} MCQs`}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-[#001d36] mb-2 group-hover:text-[#087443] transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-[#087443]" />
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#17324d]/80 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Details */}
                <div className="pt-3 border-t border-[#d3e9fa]/80 space-y-2">
                  <div className="text-[11px] font-bold text-[#0061a4]">
                    <span className="text-[#17324d]/60 font-semibold">Workstation Task: </span>
                    {item.workstationTask}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-extrabold text-[#087443]">
                    <span className="flex items-center gap-1.5">
                      <span>Badge: {item.badgeName}</span>
                    </span>
                    <span className="text-sm">{item.badgeIcon}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
