import React, { useState, useEffect, useRef } from 'react';
import { useAuth, WhatsAppVerificationState, formatGhanaPhoneNumber } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  findRegisteredApplicantByPhone, 
  findRegisteredApplicantByRegNo, 
  INITIAL_REGISTERED_APPLICANTS,
  RegisteredApplicant,
  OWRAFIX_FINANCIAL_SUMMARY
} from '../data/registeredStudents';
import { 
  X, 
  Sparkles, 
  Presentation, 
  ShieldCheck, 
  LogIn, 
  Check, 
  School, 
  Lock, 
  ArrowRight, 
  Info, 
  Phone, 
  QrCode, 
  MessageSquare, 
  RefreshCw, 
  ExternalLink, 
  Smartphone, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  CreditCard,
  Search,
  UserCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'student'
}) => {
  const { 
    requestWhatsAppOtp, 
    verifyWhatsAppOtp, 
    loginWithWhatsApp, 
    loginWithApplicant,
    loginWithRegistrationNo,
    loginWithWhatsAppQR, 
    loginWithGoogle, 
    loading 
  } = useAuth();

  const [authMethod, setAuthMethod] = useState<'otp' | 'regno' | 'qr' | 'google'>('otp');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  
  // WhatsApp OTP inputs
  const [phoneInput, setPhoneInput] = useState('');
  const [regNoInput, setRegNoInput] = useState('');
  const [countryCode, setCountryCode] = useState('+233');
  
  // Realtime matched applicant
  const [matchedApplicant, setMatchedApplicant] = useState<RegisteredApplicant | undefined>(undefined);
  
  // OTP state
  const [verificationState, setVerificationState] = useState<WhatsAppVerificationState | null>(null);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [simulatedNotification, setSimulatedNotification] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // References for OTP inputs
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (defaultRole) {
      setSelectedRole(defaultRole);
    }
  }, [defaultRole]);

  // Realtime applicant lookup when phone changes
  useEffect(() => {
    if (phoneInput.trim().length >= 8) {
      const match = findRegisteredApplicantByPhone(phoneInput) || findRegisteredApplicantByPhone(`${countryCode}${phoneInput}`);
      setMatchedApplicant(match);
      if (match) {
        setSelectedRole(match.role);
      }
    } else {
      setMatchedApplicant(undefined);
    }
  }, [phoneInput, countryCode]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (verificationState && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [verificationState, countdown]);

  if (!isOpen) return null;

  // Handle Request WhatsApp OTP
  const handleRequestOtp = async (overridePhone?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const targetPhone = overridePhone || `${countryCode}${phoneInput}`;
    
    if (!targetPhone || targetPhone.replace(/[^0-9]/g, '').length < 8) {
      setErrorMsg('Please enter a valid WhatsApp phone number (e.g. 024 400 0044)');
      return;
    }

    try {
      setIsVerifying(true);
      const state = await requestWhatsAppOtp(targetPhone, selectedRole);
      setVerificationState(state);
      setCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      
      const appInfo = state.applicant 
        ? `[ ${state.applicant.name} • ${state.applicant.regNo} ]`
        : `[ ${state.displayName} ]`;

      setSimulatedNotification(
        `🟢 WhatsApp • Owrafix Ventures: Hello ${state.displayName}, your 6-digit access code is [ ${state.code} ]. Valid for 5 minutes.`
      );

      // Auto-focus first input after delay
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 300);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate WhatsApp verification code.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && verificationState) {
      submitVerification(fullCode, verificationState);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill from WhatsApp notification simulation
  const handleAutoFillOtp = () => {
    if (verificationState) {
      const codeDigits = verificationState.code.split('');
      setOtpDigits(codeDigits);
      submitVerification(verificationState.code, verificationState);
    }
  };

  // Submit OTP Verification
  const submitVerification = async (codeToVerify: string, state: WhatsAppVerificationState) => {
    setErrorMsg(null);
    setIsVerifying(true);
    try {
      await verifyWhatsAppOtp(codeToVerify, state);
      setSuccessMsg(`Welcome, ${state.displayName}! Logged in successfully.`);
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Direct login by Registered Applicant
  const handleSelectRegisteredApplicant = async (applicant: RegisteredApplicant) => {
    setErrorMsg(null);
    try {
      setIsVerifying(true);
      await loginWithApplicant(applicant);
      setSuccessMsg(`Authenticated as ${applicant.name} (${applicant.regNo})!`);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg('Failed to log in with registered profile.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Login by Registration Number input
  const handleLoginByRegNo = async () => {
    if (!regNoInput.trim()) {
      setErrorMsg('Please enter your Owrafix Registration Number (e.g. OWR-2026-0003)');
      return;
    }
    setErrorMsg(null);
    try {
      setIsVerifying(true);
      const user = await loginWithRegistrationNo(regNoInput.trim());
      setSuccessMsg(`Welcome back, ${user.displayName}! (${user.regNo})`);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration number not found in training database.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Quick QR Scan Simulation
  const handleSimulateQrScan = async () => {
    setErrorMsg(null);
    try {
      setIsVerifying(true);
      const user = await loginWithWhatsAppQR('Desk-14', selectedRole);
      setSuccessMsg(`WhatsApp QR linked! Authenticated as ${user.displayName}.`);
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg('QR pairing failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Google Sign-In Fallback
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle(selectedRole);
      onClose();
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in cancelled. Please use the WhatsApp login option.');
      } else {
        setErrorMsg('Google Sign-In unavailable. Use the WhatsApp authenticator.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001d36]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white border-4 border-[#001d36] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* WhatsApp & Owrafix Branded Header */}
        <div className="bg-[#128C7E] text-white p-5 flex items-center justify-between border-b-2 border-[#001d36]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 2C6.511 2 2.016 6.477 2.016 11.979c0 1.954.566 3.778 1.547 5.323L2 22l4.898-1.527c1.477.893 3.208 1.408 5.133 1.408 5.52 0 10.015-4.477 10.015-9.979C22.046 6.477 17.551 2 12.031 2zm0 18.232c-1.68 0-3.238-.49-4.557-1.332l-.326-.208-2.983.931.956-2.898-.225-.349c-.933-1.442-1.428-3.13-1.428-4.887 0-4.664 3.812-8.46 8.563-8.46 4.75 0 8.562 3.796 8.562 8.46 0 4.664-3.812 8.443-8.563 8.443zm4.698-6.315c-.258-.129-1.527-.751-1.764-.837-.237-.086-.409-.129-.581.129-.172.258-.667.837-.818 1.009-.151.172-.301.193-.559.064-.258-.129-1.089-.4-2.074-1.275-.768-.682-1.286-1.525-1.437-1.783-.151-.258-.016-.397.113-.526.116-.115.258-.301.387-.451.129-.151.172-.258.258-.43.086-.172.043-.323-.022-.451-.064-.129-.581-1.397-.796-1.913-.209-.502-.421-.433-.581-.442-.151-.008-.323-.01-.495-.01-.172 0-.451.064-.688.323-.237.258-.903.882-.903 2.15 0 1.268.924 2.494 1.053 2.666.129.172 1.819 2.766 4.406 3.879.616.265 1.097.423 1.472.542.619.196 1.182.168 1.627.102.496-.074 1.527-.624 1.742-1.226.215-.602.215-1.118.151-1.226-.064-.107-.236-.172-.494-.301z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  OWRAFIX Ventures Training Login
                </h3>
                <span className="text-[10px] font-bold bg-[#25D366] text-[#003816] px-2 py-0.5 rounded-full uppercase">
                  WhatsApp Authenticator
                </span>
              </div>
              <p className="text-xs text-[#b8f5d0] font-medium">
                Official Registered Students, Teachers & Administrators
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

        {/* Navigation Tabs */}
        <div className="bg-[#f0f9f5] px-5 pt-3 border-b border-[#c8ebd7] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => { setAuthMethod('otp'); setVerificationState(null); }}
              className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                authMethod === 'otp'
                  ? 'border-[#128C7E] text-[#128C7E]'
                  : 'border-transparent text-[#17324d]/60 hover:text-[#128C7E]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Phone Login</span>
            </button>

            <button
              onClick={() => { setAuthMethod('regno'); setVerificationState(null); }}
              className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                authMethod === 'regno'
                  ? 'border-[#128C7E] text-[#128C7E]'
                  : 'border-transparent text-[#17324d]/60 hover:text-[#128C7E]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Registration No.</span>
            </button>

            <button
              onClick={() => setAuthMethod('qr')}
              className={`pb-2.5 px-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                authMethod === 'qr'
                  ? 'border-[#128C7E] text-[#128C7E]'
                  : 'border-transparent text-[#17324d]/60 hover:text-[#128C7E]'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Scan</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 bg-[#f8f9ff] space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-[#fff1f1] border border-[#ba1a1a] rounded-xl text-xs font-semibold text-[#ba1a1a] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-[#e9fff6] border border-[#087443] rounded-xl text-xs font-semibold text-[#087443] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: WHATSAPP PHONE NUMBER */}
          {authMethod === 'otp' && (
            <div className="space-y-4">
              
              {!verificationState ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-extrabold text-[#001d36]">
                        Registered WhatsApp Phone Number
                      </label>
                      <span className="text-[10px] text-[#087443] font-bold">
                        Linked to Owrafix Registry
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-white border-2 border-[#d3e9fa] rounded-xl px-2.5 py-2.5 text-xs font-bold text-[#001d36] focus:border-[#128C7E] outline-hidden cursor-pointer"
                      >
                        <option value="+233">🇬🇭 Ghana (+233)</option>
                        <option value="+234">🇳🇬 Nigeria (+234)</option>
                        <option value="+254">🇰🇪 Kenya (+254)</option>
                        <option value="+44">🇬🇧 UK (+44)</option>
                        <option value="+1">🇺🇸 US (+1)</option>
                      </select>

                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-[#17324d]/40 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          placeholder="e.g. 054 409 0932 or 244000044"
                          className="w-full bg-white border-2 border-[#d3e9fa] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-bold text-[#001d36] placeholder-[#17324d]/40 focus:border-[#128C7E] outline-hidden"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRequestOtp();
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Realtime Applicant Match Card */}
                  {matchedApplicant && (
                    <div className="p-3 bg-[#e9fff6] border-2 border-[#087443] rounded-2xl space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#087443]">
                          <UserCheck className="w-4 h-4" />
                          <span>Official Registrant Recognized!</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-[#087443] text-white px-2 py-0.5 rounded-full">
                          {matchedApplicant.regNo}
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-[#001d36]">
                        {matchedApplicant.name} • {matchedApplicant.profession}
                      </div>
                      <div className="text-[11px] text-[#17324d]/80 font-medium">
                        Course: {matchedApplicant.course}
                      </div>
                      <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#c8ebd7] font-semibold">
                        <span className="text-[#17324d]/70">Status: <strong className="text-[#087443]">{matchedApplicant.paymentStatus}</strong></span>
                        <span className="text-[#17324d]/70">Paid: GH₵{matchedApplicant.totalPaid} / GH₵{matchedApplicant.totalDue}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleRequestOtp()}
                    disabled={isVerifying}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-[#25D366] hover:bg-[#20ba59] active:translate-y-0.5 text-[#003816] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-2 border-[#003816]"
                  >
                    <MessageSquare className="w-4 h-4 fill-current" />
                    <span>Send WhatsApp Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Step 2: Enter 6-digit WhatsApp OTP */
                <div className="space-y-4">
                  {/* Realistic WhatsApp simulation card */}
                  {simulatedNotification && (
                    <div className="bg-[#e9fff6] border-2 border-[#25D366] p-3 rounded-2xl shadow-xs space-y-2 animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-[#087443]">
                          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping"></span>
                          <span>WhatsApp Push Message Received</span>
                        </div>
                        <span className="text-[10px] text-[#087443] font-bold">Just Now</span>
                      </div>
                      <p className="text-xs text-[#003816] font-medium leading-relaxed font-mono">
                        {simulatedNotification}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleAutoFillOtp}
                          className="bg-[#25D366] hover:bg-[#1eb754] text-[#003816] text-[11px] font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                        >
                          <Copy className="w-3 h-3" />
                          <span>1-Click Auto-Fill Code ({verificationState.code})</span>
                        </button>
                        <a
                          href={verificationState.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#087443] hover:underline flex items-center gap-1"
                        >
                          <span>Open in WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-[#17324d]/80">
                      Enter the 6-digit code sent to:
                    </p>
                    <p className="text-sm font-extrabold text-[#001d36] font-mono">
                      {verificationState.phoneNumber}
                    </p>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3 py-2">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { otpInputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-13 text-center text-xl font-extrabold font-mono rounded-xl border-2 border-[#128C7E] bg-white text-[#001d36] focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/30 outline-hidden shadow-xs"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-[#17324d]/70">
                    <button
                      onClick={() => setVerificationState(null)}
                      className="text-[#128C7E] hover:underline cursor-pointer"
                    >
                      Change Phone Number
                    </button>
                    {countdown > 0 ? (
                      <span className="text-[#17324d]/50">Resend in {countdown}s</span>
                    ) : (
                      <button
                        onClick={() => handleRequestOtp()}
                        className="text-[#087443] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Resend WhatsApp Code</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => submitVerification(otpDigits.join(''), verificationState)}
                    disabled={isVerifying || otpDigits.join('').length < 6}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-[#128C7E] hover:bg-[#075E54] active:translate-y-0.5 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-2 border-[#001d36] disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <span>Verifying with Owrafix Database...</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Verify & Enter Training Portal</span>
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: SEARCH / ENTER REGISTRATION NUMBER */}
          {authMethod === 'regno' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-[#001d36] mb-1.5">
                  Official Owrafix Registration Number
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#17324d]/40 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regNoInput}
                    onChange={(e) => setRegNoInput(e.target.value.toUpperCase())}
                    placeholder="e.g. OWR-2026-0003 or OWR-2026-0001"
                    className="w-full bg-white border-2 border-[#d3e9fa] rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm font-bold font-mono text-[#001d36] placeholder-[#17324d]/40 focus:border-[#128C7E] outline-hidden uppercase"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLoginByRegNo();
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#17324d]/60 mt-1">
                  Assigned upon registration with OWRAFIX Ventures training programme.
                </p>
              </div>

              <button
                onClick={handleLoginByRegNo}
                disabled={isVerifying}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-[#087443] hover:bg-[#065b34] active:translate-y-0.5 text-white flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-2 border-[#001d36]"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In With Registration Number</span>
              </button>
            </div>
          )}

          {/* TAB 3: QR DESK LINK */}
          {authMethod === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-white border-2 border-[#128C7E] rounded-2xl max-w-[220px] mx-auto space-y-2 shadow-sm">
                <div className="aspect-square bg-[#f0f9f5] border border-[#25D366] rounded-xl flex items-center justify-center p-3 relative group">
                  <svg className="w-full h-full text-[#128C7E]" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="4" />
                    <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                    <rect x="9" y="9" width="12" height="12" />

                    <rect x="70" y="0" width="30" height="30" rx="4" />
                    <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                    <rect x="79" y="9" width="12" height="12" />

                    <rect x="0" y="70" width="30" height="30" rx="4" />
                    <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                    <rect x="9" y="79" width="12" height="12" />

                    <rect x="40" y="10" width="8" height="8" />
                    <rect x="52" y="10" width="8" height="8" />
                    <rect x="40" y="22" width="8" height="8" />
                    <rect x="45" y="38" width="10" height="10" fill="#25D366" />
                    <rect x="10" y="45" width="8" height="8" />
                    <rect x="22" y="45" width="8" height="8" />
                    <rect x="40" y="60" width="8" height="8" />
                    <rect x="55" y="60" width="8" height="8" />
                    <rect x="70" y="45" width="8" height="8" />
                    <rect x="85" y="45" width="8" height="8" />
                    <rect x="75" y="75" width="8" height="8" />
                    <rect x="85" y="85" width="8" height="8" />
                    <rect x="45" y="80" width="8" height="8" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md border-2 border-white">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 2C6.511 2 2.016 6.477 2.016 11.979c0 1.954.566 3.778 1.547 5.323L2 22l4.898-1.527c1.477.893 3.208 1.408 5.133 1.408 5.52 0 10.015-4.477 10.015-9.979C22.046 6.477 17.551 2 12.031 2zm0 18.232c-1.68 0-3.238-.49-4.557-1.332l-.326-.208-2.983.931.956-2.898-.225-.349c-.933-1.442-1.428-3.13-1.428-4.887 0-4.664 3.812-8.46 8.563-8.46 4.75 0 8.562 3.796 8.562 8.46 0 4.664-3.812 8.443-8.563 8.443zm4.698-6.315c-.258-.129-1.527-.751-1.764-.837-.237-.086-.409-.129-.581.129-.172.258-.667.837-.818 1.009-.151.172-.301.193-.559.064-.258-.129-1.089-.4-2.074-1.275-.768-.682-1.286-1.525-1.437-1.783-.151-.258-.016-.397.113-.526.116-.115.258-.301.387-.451.129-.151.172-.258.258-.43.086-.172.043-.323-.022-.451-.064-.129-.581-1.397-.796-1.913-.209-.502-.421-.433-.581-.442-.151-.008-.323-.01-.495-.01-.172 0-.451.064-.688.323-.237.258-.903.882-.903 2.15 0 1.268.924 2.494 1.053 2.666.129.172 1.819 2.766 4.406 3.879.616.265 1.097.423 1.472.542.619.196 1.182.168 1.627.102.496-.074 1.527-.624 1.742-1.226.215-.602.215-1.118.151-1.226-.064-.107-.236-.172-.494-.301z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-extrabold text-[#001d36]">
                  Lab Terminal Desk #14
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateQrScan}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold bg-[#25D366] hover:bg-[#20ba59] text-[#003816] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all border-2 border-[#003816]"
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulate WhatsApp Camera Scan</span>
              </button>
            </div>
          )}

          {/* OFFICIAL OWRAFIX REGISTERED APPLICANTS (1-CLICK DIRECT LOGIN) */}
          <div className="pt-2 border-t border-[#d3e9fa] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#17324d] uppercase tracking-wider">
                Official Registered Applicants (Live Dashboard)
              </span>
              <span className="text-[10px] text-[#087443] font-bold bg-[#e9fff6] px-2 py-0.5 rounded-md">
                OWRAFIX Training Registry
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {INITIAL_REGISTERED_APPLICANTS.map((applicant) => (
                <button
                  key={applicant.regNo}
                  type="button"
                  onClick={() => handleSelectRegisteredApplicant(applicant)}
                  className="p-3 bg-white hover:bg-[#f0f9f5] border-2 border-[#d3e9fa] hover:border-[#128C7E] rounded-2xl flex items-center justify-between text-left cursor-pointer transition-all shadow-xs group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#eaf7ff] text-base flex items-center justify-center shrink-0 border border-[#d3e9fa]">
                      {applicant.avatarEmoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#001d36] group-hover:text-[#128C7E]">
                          {applicant.name}
                        </span>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded bg-slate-100 text-[#17324d]/80">
                          {applicant.regNo}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#17324d]/80 font-medium">
                        {applicant.profession} • {applicant.course}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold mt-0.5">
                        <span className="text-[#128C7E] font-mono">📱 {applicant.displayPhone}</span>
                        <span>•</span>
                        <span className={applicant.paymentStatus === 'FULLY PAID' ? 'text-[#087443]' : applicant.paymentStatus === 'PARTIALLY PAID' ? 'text-[#b45309]' : 'text-slate-500'}>
                          {applicant.paymentStatus} (GH₵{applicant.totalPaid} paid)
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#128C7E] shrink-0 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>

            {/* Official Mobile Money Payment Notice */}
            <div className="p-3 bg-[#fff8e7] border border-[#ffc857] rounded-xl text-[11px] text-[#654800] space-y-1">
              <div className="font-extrabold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>OWRAFIX Ventures Payment Details</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-mono">
                <span>MoMo Name: <strong>{OWRAFIX_FINANCIAL_SUMMARY.momoName}</strong></span>
                <span>Phone: <strong>{OWRAFIX_FINANCIAL_SUMMARY.momoPhone}</strong></span>
                <span>Merchant ID: <strong>{OWRAFIX_FINANCIAL_SUMMARY.merchantId}</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-[#d3e9fa] p-4 flex items-center justify-between text-[11px] text-[#17324d]/70">
          <div className="flex items-center gap-1.5 text-[#087443] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>End-to-End Encrypted via WhatsApp & Act 843</span>
          </div>
          <button
            onClick={onClose}
            className="hover:underline text-[#001d36] font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
