import React, { useEffect, useMemo, useState } from 'react';
import { RegisteredApplicant, refreshRegisteredApplicants, GOOGLE_REGISTRATION_API_URL } from '../data/registeredStudents';
import { X, UserPlus, RefreshCw, Search, CheckCircle2, AlertTriangle, Users, ShieldCheck } from 'lucide-react';

interface AdminStudentManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = {
  name: string;
  gender: string;
  phone: string;
  whatsapp: string;
  email: string;
  town: string;
  education: string;
  profession: string;
  course: string;
  role: 'student' | 'teacher' | 'admin';
  paymentStatus: 'PENDING' | 'PARTIALLY PAID' | 'FULLY PAID' | 'UNPAID';
  enrolmentStatus: 'REGISTERED' | 'ACTIVE' | 'COMPLETED';
  totalDue: string;
  totalPaid: string;
};

const emptyForm: FormState = {
  name: '',
  gender: '',
  phone: '',
  whatsapp: '',
  email: '',
  town: '',
  education: '',
  profession: '',
  course: 'Digital Skills & Computer Mastery for Students — 8 Weeks',
  role: 'student',
  paymentStatus: 'PENDING',
  enrolmentStatus: 'REGISTERED',
  totalDue: '0',
  totalPaid: '0'
};

export const AdminStudentManager: React.FC<AdminStudentManagerProps> = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState<RegisteredApplicant[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await refreshRegisteredApplicants();
      setStudents(list);
      setMessage(`${list.length} registered student${list.length === 1 ? '' : 's'} loaded.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load the registration register.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) void loadStudents();
  }, [isOpen]);

  const filteredStudents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [student.name, student.regNo, student.phone, student.course, student.profession]
        .some((value) => String(value || '').toLowerCase().includes(term))
    );
  }, [students, searchTerm]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const resetForm = () => setForm(emptyForm);

  const handleAddStudent = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!GOOGLE_REGISTRATION_API_URL) {
      setError('The Google Registration API URL is not configured in the portal.');
      return;
    }

    if (!form.name.trim() || !form.phone.trim()) {
      setError('Full name and phone number are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        action: 'add',
        name: form.name.trim(),
        gender: form.gender.trim(),
        phone: form.phone.trim(),
        whatsapp: (form.whatsapp || form.phone).trim(),
        email: form.email.trim(),
        town: form.town.trim(),
        education: form.education.trim(),
        profession: form.profession.trim(),
        course: form.course.trim(),
        role: form.role,
        paymentStatus: form.paymentStatus,
        enrolmentStatus: form.enrolmentStatus,
        totalDue: Number(form.totalDue) || 0,
        totalPaid: Number(form.totalPaid) || 0
      };

      const response = await fetch(GOOGLE_REGISTRATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false) {
        throw new Error(result?.message || `Registration service returned ${response.status}.`);
      }

      await loadStudents();
      setMessage(result?.message || `${form.name} was added to the training register.`);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add the student.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#001d36]/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-7xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#001d36] flex flex-col">
        <div className="bg-[#654800] text-white px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center"><UserPlus className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold">Student & User Management</h2>
              <p className="text-xs text-[#ffdfa7] font-medium">Add students without editing the website code.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/15" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-4 sm:p-6 space-y-5">
          <div className="grid lg:grid-cols-[1.05fr_1.4fr] gap-5">
            <form onSubmit={handleAddStudent} className="bg-white rounded-2xl border-2 border-[#d3e9fa] p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-[#001d36]">Add New User</h3>
                  <p className="text-xs text-slate-500">The registration number can be generated by the registration service.</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-[#087443]" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="sm:col-span-2 text-xs font-bold text-[#17324d]">Full Name<input value={form.name} onChange={(e) => update('name', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="e.g. Ama Mensah" /></label>
                <label className="text-xs font-bold text-[#17324d]">Phone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="024 000 0000" /></label>
                <label className="text-xs font-bold text-[#17324d]">WhatsApp<input value={form.whatsapp} onChange={(e) => update('whatsapp', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Same as phone if blank" /></label>
                <label className="text-xs font-bold text-[#17324d]">Gender<select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2"><option value="">Select</option><option>Female</option><option>Male</option><option>Other</option></select></label>
                <label className="text-xs font-bold text-[#17324d]">Profession<input value={form.profession} onChange={(e) => update('profession', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" placeholder="Student / Teacher / Nurse" /></label>
                <label className="text-xs font-bold text-[#17324d]">Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" /></label>
                <label className="text-xs font-bold text-[#17324d]">Town / City<input value={form.town} onChange={(e) => update('town', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" /></label>
                <label className="text-xs font-bold text-[#17324d]">Education<input value={form.education} onChange={(e) => update('education', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" /></label>
                <label className="text-xs font-bold text-[#17324d] sm:col-span-2">Course<select value={form.course} onChange={(e) => update('course', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2"><option>Digital Skills & Computer Mastery for Students — 8 Weeks</option><option>Digital Foundations & AI Mastery — Complete Beginner — 12 Weeks</option><option>AI for Professionals — 8 Weeks</option><option>Digital Skills for SHS Leavers — 8 Weeks</option><option>AI for Teachers — 8 Weeks</option><option>AI for Business & Entrepreneurs — 8 Weeks</option><option>Graphic Design & Digital Content Creation — 12 Weeks</option></select></label>
                <label className="text-xs font-bold text-[#17324d]">Role<select value={form.role} onChange={(e) => update('role', e.target.value as FormState['role'])} className="mt-1 w-full border rounded-xl px-3 py-2"><option value="student">Student</option><option value="teacher">Teacher</option><option value="admin">Admin</option></select></label>
                <label className="text-xs font-bold text-[#17324d]">Enrolment Status<select value={form.enrolmentStatus} onChange={(e) => update('enrolmentStatus', e.target.value as FormState['enrolmentStatus'])} className="mt-1 w-full border rounded-xl px-3 py-2"><option>REGISTERED</option><option>ACTIVE</option><option>COMPLETED</option></select></label>
                <label className="text-xs font-bold text-[#17324d]">Payment Status<select value={form.paymentStatus} onChange={(e) => update('paymentStatus', e.target.value as FormState['paymentStatus'])} className="mt-1 w-full border rounded-xl px-3 py-2"><option>PENDING</option><option>PARTIALLY PAID</option><option>FULLY PAID</option><option>UNPAID</option></select></label>
                <label className="text-xs font-bold text-[#17324d]">Total Due<input type="number" min="0" value={form.totalDue} onChange={(e) => update('totalDue', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" /></label>
                <label className="text-xs font-bold text-[#17324d]">Total Paid<input type="number" min="0" value={form.totalPaid} onChange={(e) => update('totalPaid', e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" /></label>
              </div>

              {error && <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3 flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" />{error}</div>}
              {message && <div className="rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold p-3 flex gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" />{message}</div>}

              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-[#087443] text-white font-extrabold py-2.5 hover:bg-[#075c36] disabled:opacity-50 flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />{saving ? 'Adding...' : 'Add User'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 rounded-xl border border-[#d3e9fa] bg-white font-bold text-[#17324d]">Clear</button>
              </div>
            </form>

            <section className="bg-white rounded-2xl border-2 border-[#d3e9fa] overflow-hidden shadow-sm">
              <div className="p-4 border-b border-[#d3e9fa] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2"><Users className="w-5 h-5 text-[#0061a4]" /><div><h3 className="font-extrabold text-[#001d36]">Registered Users</h3><p className="text-[11px] text-slate-500">Live registration register</p></div></div>
                <button onClick={() => void loadStudents()} disabled={loading} className="px-3 py-2 rounded-xl bg-[#eef4ff] text-[#0061a4] font-bold text-xs flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
              </div>
              <div className="p-3 border-b border-[#d3e9fa]"><div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" /><input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search students..." className="w-full border rounded-xl pl-9 pr-3 py-2 text-sm" /></div></div>
              <div className="max-h-[560px] overflow-auto">
                {filteredStudents.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No registered users found.</div> : filteredStudents.map((student) => (
                  <div key={student.regNo} className="px-4 py-3 border-b border-[#eef4ff] hover:bg-[#f8f9ff]">
                    <div className="flex items-start justify-between gap-3">
                      <div><div className="font-extrabold text-[#001d36]">{student.name}</div><div className="text-[11px] font-mono text-[#0061a4]">{student.regNo}</div><div className="text-[11px] text-slate-500">{student.displayPhone} • {student.course}</div></div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded-full bg-[#eef4ff] text-[#0061a4]">{student.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
