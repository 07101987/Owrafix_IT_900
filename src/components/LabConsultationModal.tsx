import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, School, Phone, Mail, User } from 'lucide-react';

interface ConsultationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabConsultationModal: React.FC<ConsultationProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    contactPerson: '',
    phone: '',
    region: 'Greater Accra',
    numComputers: '10–25 computers',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001d36]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white border-4 border-[#001d36] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-[#005932] text-white p-5 flex items-center justify-between border-b-2 border-[#001d36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              🏫
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Book School Lab Consultation
              </h3>
              <p className="text-xs text-[#9af7b9] font-medium">
                Accra Learning Hub • On-Site & Solar Lab Setup
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

        {/* Content */}
        <div className="p-6 bg-[#f8f9ff]">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17324d] mb-1">
                  School Name & Location
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-[#0061a4] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Kizito Basic School, Osu"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#d3e9fa] rounded-xl text-xs text-[#001d36] font-medium focus:border-[#087443] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17324d] mb-1">
                    Headteacher / ICT Teacher Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#0061a4] absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mr. K. Mensah"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#d3e9fa] rounded-xl text-xs text-[#001d36] font-medium focus:border-[#087443] outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17324d] mb-1">
                    Phone / WhatsApp Contact
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#087443] absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +233 24 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-[#d3e9fa] rounded-xl text-xs text-[#001d36] font-medium focus:border-[#087443] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17324d] mb-1">
                    Region in Ghana
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full py-2.5 px-3 bg-white border-2 border-[#d3e9fa] rounded-xl text-xs text-[#001d36] font-medium focus:border-[#087443] outline-hidden"
                  >
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti (Kumasi)</option>
                    <option value="Central">Central (Cape Coast)</option>
                    <option value="Eastern">Eastern (Koforidua)</option>
                    <option value="Western">Western (Takoradi)</option>
                    <option value="Northern">Northern (Tamale)</option>
                    <option value="Volta">Volta (Ho)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17324d] mb-1">
                    Lab Capacity
                  </label>
                  <select
                    value={formData.numComputers}
                    onChange={(e) => setFormData({ ...formData, numComputers: e.target.value })}
                    className="w-full py-2.5 px-3 bg-white border-2 border-[#d3e9fa] rounded-xl text-xs text-[#001d36] font-medium focus:border-[#087443] outline-hidden"
                  >
                    <option value="1–5 netbooks">1–5 shared netbooks</option>
                    <option value="10–25 computers">10–25 computers</option>
                    <option value="30–50 computers">30–50 computer laboratory</option>
                    <option value="New Lab Setup">Planning new computer lab</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-chunky-white py-2.5 px-4 rounded-xl text-xs font-bold text-[#001d36] cursor-pointer flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-chunky-green py-2.5 px-5 rounded-xl text-xs font-bold text-white cursor-pointer flex-1 shadow-xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-[#e9fff6] border-2 border-[#9af7b9] text-[#087443] flex items-center justify-center text-3xl mx-auto shadow-xs">
                ✓
              </div>
              <h4 className="text-xl font-extrabold text-[#001d36]">
                Consultation Request Received!
              </h4>
              <p className="text-xs text-[#17324d]/80 max-w-sm mx-auto leading-relaxed">
                Thank you for supporting digital literacy at <strong>{formData.schoolName}</strong>. 
                Our lab team in Accra will contact you within 24 hours to schedule an offline PWA demo.
              </p>
              <button
                onClick={onClose}
                className="btn-chunky-green py-2.5 px-6 rounded-xl text-xs font-bold text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
