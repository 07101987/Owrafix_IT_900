import React from 'react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      value: '12 Weeks',
      label: 'STEP-BY-STEP PATHWAY',
      accent: 'text-[#0061a4]'
    },
    {
      value: '240+',
      label: 'INTERACTIVE SKILL CHECKS',
      accent: 'text-[#087443]'
    },
    {
      value: '0 MB',
      label: 'INTERNET NEEDED (PWA)',
      accent: 'text-[#654800]'
    },
    {
      value: 'GES',
      label: 'APPROVED ICT CURRICULUM',
      accent: 'text-[#001d36]'
    }
  ];

  return (
    <section className="py-6 border-y border-[#d3e9fa] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#f8f9ff] hover:bg-[#eef4ff] transition-colors border border-[#d3e9fa] rounded-2xl p-4 sm:p-5 text-center flex flex-col justify-center items-center"
            >
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${stat.accent} font-mono tabular-nums`}>
                {stat.value}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[#17324d]/75 tracking-wider mt-1 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
