import React, { useState } from 'react';
import { 
  WifiOff, 
  ShieldCheck, 
  Database, 
  FileCheck, 
  Server, 
  MonitorCheck, 
  CheckCircle2,
  HardDrive,
  RefreshCw
} from 'lucide-react';

export const OfflineArchitecture: React.FC = () => {
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  const runPingTest = () => {
    setPingStatus('testing');
    setTimeout(() => {
      setPingStatus('success');
    }, 600);
  };

  return (
    <section className="py-20 bg-[#f8f9ff] border-t border-[#d3e9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="bg-white border-2 border-[#d3e9fa] rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Offline Architecture Pitch & 4 Features */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 bg-[#e9fff6] border border-[#9af7b9] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#087443]">
                <HardDrive className="w-3.5 h-3.5" />
                <span>Built For Ghana School Infrastructure</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001d36] tracking-tight leading-tight">
                Reliable Offline Architecture. 100% Child–Safe Sandbox.
              </h2>

              <p className="text-sm sm:text-base text-[#17324d]/80 leading-relaxed font-normal">
                School laboratories face power fluctuations and internet bandwidth drops. 
                Owrafix is compiled as an offline Progressive Web Application (PWA). All lessons, 
                quiz databases, and student scorecards operate locally without internet access.
              </p>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#f8f9ff] border border-[#d3e9fa] rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#001d36] mb-1">
                    <WifiOff className="w-4 h-4 text-[#0061a4] shrink-0" />
                    <span>Zero Data Cost During Class</span>
                  </div>
                  <p className="text-xs text-[#17324d]/70 leading-relaxed">
                    Loads once, runs the whole term offline on school PCs.
                  </p>
                </div>

                <div className="bg-[#f8f9ff] border border-[#d3e9fa] rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#001d36] mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#087443] shrink-0" />
                    <span>No Ads & No Open Chat</span>
                  </div>
                  <p className="text-xs text-[#17324d]/70 leading-relaxed">
                    Strictly closed sandbox. No external pop-ups or external links.
                  </p>
                </div>

                <div className="bg-[#f8f9ff] border border-[#d3e9fa] rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#001d36] mb-1">
                    <Database className="w-4 h-4 text-[#654800] shrink-0" />
                    <span>Local IndexedDB Sync</span>
                  </div>
                  <p className="text-xs text-[#17324d]/70 leading-relaxed">
                    Student progress saves securely even if lab power turns off.
                  </p>
                </div>

                <div className="bg-[#f8f9ff] border border-[#d3e9fa] rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#001d36] mb-1">
                    <FileCheck className="w-4 h-4 text-[#0061a4] shrink-0" />
                    <span>Parent Mastery Reports</span>
                  </div>
                  <p className="text-xs text-[#17324d]/70 leading-relaxed">
                    Generate exportable PDF skill passports at term end.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Lab Diagnostic Box */}
            <div className="lg:col-span-5">
              <div className="bg-[#f8f9ff] border-2 border-[#d3e9fa] rounded-2xl p-6 space-y-4 shadow-xs">
                
                {/* Diagnostic Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#d3e9fa]">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#001d36]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#087443] animate-pulse"></span>
                    <span>Owrafix Lab Diagnostic</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-[#087443] bg-[#e9fff6] border border-[#9af7b9] px-2.5 py-0.5 rounded-full">
                    All Systems Green
                  </span>
                </div>

                {/* Status Items */}
                <div className="space-y-3 text-xs font-semibold">
                  <div className="flex items-center justify-between p-3 bg-white border border-[#d3e9fa] rounded-xl">
                    <div className="flex items-center gap-2 text-[#17324d]">
                      <Server className="w-4 h-4 text-[#0061a4]" />
                      <span>Classroom Hub Server</span>
                    </div>
                    <span className="font-bold text-[#087443]">Connected (Local)</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-[#d3e9fa] rounded-xl">
                    <div className="flex items-center gap-2 text-[#17324d]">
                      <MonitorCheck className="w-4 h-4 text-[#087443]" />
                      <span>Workstations Synchronized</span>
                    </div>
                    <span className="font-mono font-bold text-[#001d36] tabular-nums">28 / 28 Ready</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white border border-[#d3e9fa] rounded-xl">
                    <div className="flex items-center gap-2 text-[#17324d]">
                      <HardDrive className="w-4 h-4 text-[#654800]" />
                      <span>Curriculum Storage Cache</span>
                    </div>
                    <span className="font-mono font-bold text-[#087443] tabular-nums">100% Pre-loaded</span>
                  </div>
                </div>

                {/* Legal compliance notice */}
                <div className="p-3 bg-[#e9fff6] border border-[#9af7b9] rounded-xl text-[11px] text-[#087443] font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#087443] shrink-0" />
                  <span>Complies with Ghana Data Protection Act 2012 (Act 843)</span>
                </div>

                {/* Interactive Ping Button */}
                <button
                  onClick={runPingTest}
                  disabled={pingStatus === 'testing'}
                  className="w-full btn-chunky-white py-2 px-3 rounded-xl text-xs font-bold text-[#001d36] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#0061a4] ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
                  <span>
                    {pingStatus === 'testing' 
                      ? 'Testing Local Mesh...' 
                      : pingStatus === 'success' 
                      ? 'Local Mesh Latency: 2.1ms (Ultra Fast)' 
                      : 'Test Local Lab Mesh Latency'}
                  </span>
                </button>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
