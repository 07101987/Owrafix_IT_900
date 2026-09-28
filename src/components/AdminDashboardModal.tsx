import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SIMULATED_WORKSTATIONS, CURRICULUM_DATA } from '../data/curriculum';
import { 
  OWRAFIX_FINANCIAL_SUMMARY, 
  INITIAL_REGISTERED_APPLICANTS, 
  OWRAFIX_COURSES,
  RegisteredApplicant 
} from '../data/registeredStudents';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Server, 
  HardDrive, 
  Activity, 
  Download, 
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  School,
  Lock,
  Plus,
  CreditCard,
  PhoneCall,
  Search,
  Filter,
  Check,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserRole, loginWithApplicant } = useAuth();
  const [activeTab, setActiveTab] = useState<'registry' | 'financials' | 'workstations' | 'curriculum' | 'exports'>('registry');
  const [applicants, setApplicants] = useState<RegisteredApplicant[]>(INITIAL_REGISTERED_APPLICANTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  
  // Payment modal state
  const [selectedForPayment, setSelectedForPayment] = useState<RegisteredApplicant | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(50);
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [showPaymentSuccess, setShowPaymentSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForPayment) return;

    setApplicants((prev) =>
      prev.map((app) => {
        if (app.regNo === selectedForPayment.regNo) {
          const newPaid = app.totalPaid + paymentAmount;
          const newBalance = Math.max(0, app.totalDue - newPaid);
          const newStatus = newBalance === 0 ? 'FULLY PAID' : 'PARTIALLY PAID';
          return {
            ...app,
            totalPaid: newPaid,
            balance: newBalance,
            paymentStatus: newStatus,
            paymentReference: paymentRef || `MM-TX-${Date.now().toString().slice(-6)}`
          };
        }
        return app;
      })
    );

    setShowPaymentSuccess(`GH₵${paymentAmount} payment recorded for ${selectedForPayment.name} via MoMo (${OWRAFIX_FINANCIAL_SUMMARY.merchantId})`);
    setTimeout(() => {
      setSelectedForPayment(null);
      setShowPaymentSuccess(null);
      setPaymentRef('');
    }, 1500);
  };

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'ALL' || app.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalCollected = applicants.reduce((acc, a) => acc + a.totalPaid, 0);
  const totalOutstanding = applicants.reduce((acc, a) => acc + a.balance, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001d36]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl bg-white border-4 border-[#001d36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-[#654800] text-white p-4 sm:px-6 flex items-center justify-between border-b-2 border-[#001d36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  OWRAFIX VENTURES – TRAINING REGISTRATION DASHBOARD
                </h3>
                <span className="text-[10px] font-bold bg-[#ffdfa7] text-[#261900] px-2 py-0.5 rounded-md uppercase">
                  MoE / GES Verified
                </span>
              </div>
              <p className="text-xs text-[#ffdfa7] font-medium">
                Practical Digital Skills & Entrepreneurship Training Programme • MoMo Merchant ID: {OWRAFIX_FINANCIAL_SUMMARY.merchantId}
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

        {/* Tab Strip */}
        <div className="bg-[#f8f9ff] px-6 py-2.5 border-b border-[#d3e9fa] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#d3e9fa] overflow-x-auto">
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'registry' ? 'bg-[#654800] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              Applicant Register ({applicants.length})
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'financials' ? 'bg-[#654800] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              Financials & MoMo
            </button>
            <button
              onClick={() => setActiveTab('workstations')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'workstations' ? 'bg-[#654800] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              28 Lab Desks
            </button>
            <button
              onClick={() => setActiveTab('curriculum')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'curriculum' ? 'bg-[#654800] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              Courses ({OWRAFIX_COURSES.length})
            </button>
            <button
              onClick={() => setActiveTab('exports')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'exports' ? 'bg-[#654800] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              Reports & Print
            </button>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#17324d]/70">Current User:</span>
            <span className="bg-white border border-[#d3e9fa] px-2 py-1 rounded-md text-[#001d36]">
              {userProfile?.displayName || 'Administrator'} ({userProfile?.role || 'admin'})
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9ff] space-y-6">
          
          {/* TAB 1: APPLICANT REGISTER */}
          {activeTab === 'registry' && (
            <div className="space-y-4">
              
              {/* Financial Metrics Strip from CSV */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Total Applicants</div>
                  <div className="text-xl font-extrabold text-[#001d36] font-mono">{applicants.length}</div>
                  <div className="text-[10px] text-[#087443] font-semibold">Registered</div>
                </div>

                <div className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Total Paid</div>
                  <div className="text-xl font-extrabold text-[#087443] font-mono">GH₵{totalCollected}</div>
                  <div className="text-[10px] text-[#087443] font-semibold">MoMo Collected</div>
                </div>

                <div className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Outstanding</div>
                  <div className="text-xl font-extrabold text-[#b45309] font-mono">GH₵{totalOutstanding}</div>
                  <div className="text-[10px] text-[#b45309] font-semibold">Pending Balance</div>
                </div>

                <div className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Fully Paid</div>
                  <div className="text-xl font-extrabold text-[#001d36] font-mono">
                    {applicants.filter(a => a.paymentStatus === 'FULLY PAID').length}
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">0 Applicants</div>
                </div>

                <div className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Partially Paid</div>
                  <div className="text-xl font-extrabold text-[#0061a4] font-mono">
                    {applicants.filter(a => a.paymentStatus === 'PARTIALLY PAID').length}
                  </div>
                  <div className="text-[10px] text-[#0061a4] font-semibold">Deposit Paid</div>
                </div>

                <div className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs">
                  <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">MoMo Merchant ID</div>
                  <div className="text-xl font-extrabold text-[#654800] font-mono">{OWRAFIX_FINANCIAL_SUMMARY.merchantId}</div>
                  <div className="text-[10px] text-[#654800] font-semibold">{OWRAFIX_FINANCIAL_SUMMARY.momoPhone}</div>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#d3e9fa]">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="w-4 h-4 text-[#17324d]/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, phone, reg number (e.g. Bertha, 244000044, OWR-2026-0003)..."
                    className="w-full bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-[#001d36] focus:border-[#654800] outline-hidden"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#17324d]/70 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    Status:
                  </span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#001d36] outline-hidden cursor-pointer"
                  >
                    <option value="ALL">All Payments</option>
                    <option value="FULLY PAID">Fully Paid</option>
                    <option value="PARTIALLY PAID">Partially Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              {/* Applicant Table */}
              <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#f0f4fc] border-b border-[#d3e9fa] text-[#001d36] font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Reg No.</th>
                        <th className="py-3 px-4">Applicant</th>
                        <th className="py-3 px-4">WhatsApp Phone</th>
                        <th className="py-3 px-4">Profession</th>
                        <th className="py-3 px-4">Enrolled Course</th>
                        <th className="py-3 px-4 text-right">Fee / Due</th>
                        <th className="py-3 px-4 text-right">Paid</th>
                        <th className="py-3 px-4 text-right">Balance</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eef4ff]">
                      {filteredApplicants.map((app) => (
                        <tr key={app.regNo} className="hover:bg-[#f8f9ff] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[#0061a4]">
                            {app.regNo}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-extrabold text-[#001d36] flex items-center gap-1.5">
                              <span>{app.avatarEmoji}</span>
                              <span>{app.name}</span>
                            </div>
                            <div className="text-[10px] text-[#17324d]/60 font-semibold uppercase">
                              Role: {app.role}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-semibold text-[#128C7E]">
                            {app.displayPhone}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#17324d]">
                            {app.profession}
                          </td>
                          <td className="py-3 px-4 font-medium text-[#001d36] max-w-[200px] truncate" title={app.course}>
                            {app.course}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-semibold">
                            GH₵{app.totalDue}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-extrabold text-[#087443]">
                            GH₵{app.totalPaid}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-extrabold text-[#b45309]">
                            GH₵{app.balance}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              app.paymentStatus === 'FULLY PAID'
                                ? 'bg-green-100 text-green-800'
                                : app.paymentStatus === 'PARTIALLY PAID'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {app.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedForPayment(app)}
                                className="px-2 py-1 bg-[#fff8e7] hover:bg-[#ffdfa7] text-[#654800] border border-[#ffc857] rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                                title="Record Mobile Money Payment"
                              >
                                Record MoMo
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  loginWithApplicant(app);
                                  onClose();
                                }}
                                className="px-2 py-1 bg-[#eaf7ff] hover:bg-[#d3e9fa] text-[#0061a4] border border-[#d3e9fa] rounded-lg font-bold text-[10px] cursor-pointer transition-colors"
                                title="Login directly into this applicant account"
                              >
                                Enter Portal
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Record Payment Sub-modal */}
              {selectedForPayment && (
                <div className="p-4 bg-white border-2 border-[#654800] rounded-2xl shadow-md space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#d3e9fa]">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#654800]" />
                      <h4 className="font-extrabold text-sm text-[#001d36]">
                        Record MoMo Payment for {selectedForPayment.name} ({selectedForPayment.regNo})
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedForPayment(null)}
                      className="text-xs text-slate-500 hover:text-black cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <form onSubmit={handleRecordPayment} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#17324d] mb-1">Payment Amount (GH₵)</label>
                      <input
                        type="number"
                        min="1"
                        max={selectedForPayment.balance}
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        className="w-full bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl px-3 py-2 font-mono font-bold text-[#001d36]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#17324d] mb-1">MoMo Transaction Reference</label>
                      <input
                        type="text"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        placeholder="e.g. MM-TX-972184"
                        className="w-full bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl px-3 py-2 font-mono text-[#001d36]"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 rounded-xl text-xs font-extrabold bg-[#087443] hover:bg-[#065b34] text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm & Update Balance</span>
                      </button>
                    </div>
                  </form>

                  {showPaymentSuccess && (
                    <div className="p-2 bg-green-50 border border-green-300 text-green-800 text-xs rounded-xl font-bold">
                      {showPaymentSuccess}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: FINANCIALS & MOMO */}
          {activeTab === 'financials' && (
            <div className="space-y-5">
              <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#eef4ff]">
                  <div>
                    <h4 className="font-extrabold text-sm text-[#001d36]">
                      OWRAFIX Mobile Money Merchant Account
                    </h4>
                    <p className="text-xs text-[#17324d]/70">
                      Direct payment processing for ICT & AI training enrolments
                    </p>
                  </div>
                  <span className="text-xs font-extrabold text-[#087443] bg-[#e9fff6] px-3 py-1 rounded-full">
                    Active Merchant
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl space-y-1">
                    <div className="text-[#17324d]/60 font-semibold uppercase text-[10px]">Merchant Name</div>
                    <div className="font-extrabold text-base text-[#001d36]">{OWRAFIX_FINANCIAL_SUMMARY.momoName}</div>
                    <div className="text-[11px] text-[#087443] font-medium">Registered Business</div>
                  </div>

                  <div className="p-4 bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl space-y-1">
                    <div className="text-[#17324d]/60 font-semibold uppercase text-[10px]">Merchant Phone Number</div>
                    <div className="font-extrabold text-base text-[#001d36] font-mono">{OWRAFIX_FINANCIAL_SUMMARY.momoPhone}</div>
                    <div className="text-[11px] text-[#128C7E] font-medium">MTN Mobile Money</div>
                  </div>

                  <div className="p-4 bg-[#f8f9ff] border border-[#d3e9fa] rounded-xl space-y-1">
                    <div className="text-[#17324d]/60 font-semibold uppercase text-[10px]">Merchant ID Code</div>
                    <div className="font-extrabold text-base text-[#654800] font-mono">{OWRAFIX_FINANCIAL_SUMMARY.merchantId}</div>
                    <div className="text-[11px] text-[#654800] font-medium">*170# Pay Merchant</div>
                  </div>
                </div>
              </div>

              {/* Financial Summary Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 space-y-3">
                  <h5 className="font-extrabold text-xs text-[#001d36] uppercase tracking-wider">
                    Registration & Revenue Summary
                  </h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-[#17324d]/70">Expected Course Revenue:</span>
                      <span className="font-mono font-bold text-[#001d36]">GH₵{OWRAFIX_FINANCIAL_SUMMARY.expectedCourseRevenue}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-[#17324d]/70">Standard Registration Fee:</span>
                      <span className="font-mono font-bold text-[#001d36]">GH₵{OWRAFIX_FINANCIAL_SUMMARY.registrationFee}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-[#17324d]/70">Total Revenue Collected:</span>
                      <span className="font-mono font-extrabold text-[#087443]">GH₵{totalCollected}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-[#17324d]/70">Outstanding Fee Balance:</span>
                      <span className="font-mono font-extrabold text-[#b45309]">GH₵{totalOutstanding}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 space-y-3">
                  <h5 className="font-extrabold text-xs text-[#001d36] uppercase tracking-wider">
                    Ghana Mobile Money Instructions
                  </h5>
                  <p className="text-xs text-[#17324d]/80 leading-relaxed">
                    Students can pay fees directly via USSD on any mobile network in Ghana:
                  </p>
                  <div className="p-3 bg-[#fff8e7] border border-[#ffc857] rounded-xl text-xs font-mono text-[#654800] space-y-1">
                    <div>1. Dial <strong>*170#</strong></div>
                    <div>2. Select <strong>Transfer Money &gt; Pay Merchant</strong></div>
                    <div>3. Enter Merchant ID: <strong>{OWRAFIX_FINANCIAL_SUMMARY.merchantId}</strong></div>
                    <div>4. Reference: <strong>Applicant Reg No. (e.g. OWR-2026-0003)</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 28 WORKSTATION NODES */}
          {activeTab === 'workstations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[#001d36]">
                  Active Classroom Workstations ({SIMULATED_WORKSTATIONS.length} Desks)
                </h4>
                <div className="text-xs text-[#087443] font-bold">
                  ● Realtime Telemetry Broadcast
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SIMULATED_WORKSTATIONS.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-white border border-[#d3e9fa] rounded-xl shadow-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#0061a4]">{w.seatNumber}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        w.status === 'needs-help' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {w.status}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs text-[#001d36] truncate">
                      {w.studentName}
                    </div>
                    <div className="text-[11px] text-[#17324d]/70 truncate">
                      {w.currentTask}
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-100">
                      <span className="text-[#17324d]/60">Score:</span>
                      <span className="font-bold text-[#087443]">{w.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COURSES & ENROLMENT REVENUE */}
          {activeTab === 'curriculum' && (
            <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#eef4ff]">
                <div>
                  <h4 className="font-extrabold text-sm text-[#001d36]">
                    Course Enrolment & Revenue Matrix
                  </h4>
                  <p className="text-xs text-[#17324d]/70">
                    Official OWRAFIX training catalog and applicant enrolment tracking
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f0f4fc] border-b border-[#d3e9fa] text-[#001d36] font-extrabold uppercase text-[10px]">
                      <th className="py-2.5 px-3">Course Title</th>
                      <th className="py-2.5 px-3 text-right">Course Fee</th>
                      <th className="py-2.5 px-3 text-center">Applicants</th>
                      <th className="py-2.5 px-3 text-right">Expected Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eef4ff]">
                    {OWRAFIX_COURSES.map((course, idx) => (
                      <tr key={idx} className="hover:bg-[#f8f9ff]">
                        <td className="py-2.5 px-3 font-extrabold text-[#001d36]">
                          {course.name}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold">
                          GH₵{course.fee}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {course.applicants > 0 ? (
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-mono">
                              {course.applicants}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-[#087443]">
                          GH₵{course.expectedRevenue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORTS & PRINTING */}
          {activeTab === 'exports' && (
            <div className="bg-white border-2 border-[#d3e9fa] rounded-2xl p-6 space-y-4">
              <h4 className="font-extrabold text-sm text-[#001d36]">
                Official Reports & Export
              </h4>
              <p className="text-xs text-[#17324d]/80 leading-relaxed max-w-lg">
                Generate training registration records, MoMo receipt summaries, and classroom attendance certificates.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => window.print()}
                  className="p-4 bg-[#f8f9ff] border-2 border-[#d3e9fa] hover:border-[#087443] rounded-2xl text-left flex items-start gap-3 cursor-pointer transition-all"
                >
                  <Download className="w-5 h-5 text-[#087443] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-[#001d36]">
                      Export Training Applicant Register (PDF)
                    </div>
                    <div className="text-[11px] text-[#17324d]/60 mt-0.5">
                      Includes 3 registered applicants, fee status, and MoMo balances.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-4 bg-[#f8f9ff] border-2 border-[#d3e9fa] hover:border-[#654800] rounded-2xl text-left flex items-start gap-3 cursor-pointer transition-all"
                >
                  <Download className="w-5 h-5 text-[#654800] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold text-[#001d36]">
                      MoMo Payment Reconciliation Statement
                    </div>
                    <div className="text-[11px] text-[#17324d]/60 mt-0.5">
                      OWRAFIX Ventures Merchant ID: 972184 collection report.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-[#d3e9fa] p-4 flex items-center justify-between text-xs text-[#17324d]/70">
          <div>
            OWRAFIX Ventures • Practical Digital Skills & Entrepreneurship Training Programme
          </div>
          <button
            onClick={onClose}
            className="btn-chunky-white py-1.5 px-4 rounded-xl text-xs font-bold text-[#001d36] cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
