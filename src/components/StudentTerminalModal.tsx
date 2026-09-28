import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM_DATA, INITIAL_STUDENT_PROFILE } from '../data/curriculum';
import { CurriculumWeek, Question } from '../types';
import { 
  X, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Keyboard, 
  HelpCircle, 
  Printer, 
  Flame, 
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Zap,
  Star,
  UserCheck
} from 'lucide-react';

interface StudentTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeek?: number;
}

export const StudentTerminalModal: React.FC<StudentTerminalProps> = ({
  isOpen,
  onClose,
  initialWeek = 2
}) => {
  const { userProfile, role, saveStudentXP } = useAuth();
  const [selectedWeekNum, setSelectedWeekNum] = useState(initialWeek);
  const [activeTab, setActiveTab] = useState<'quiz' | 'typing' | 'certificate'>('quiz');
  
  // Student gamification state
  const [studentXP, setStudentXP] = useState(INITIAL_STUDENT_PROFILE.xp);
  const [badges, setBadges] = useState(INITIAL_STUDENT_PROFILE.badges);

  // Sync initial state if user is logged in
  useEffect(() => {
    if (userProfile) {
      // Keep baseline or add existing
    }
  }, [userProfile]);

  // Quiz state
  const currentWeek = CURRICULUM_DATA.find((w) => w.weekNumber === selectedWeekNum) || CURRICULUM_DATA[0];
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Typing practice state
  const sampleWords = ['asdf', 'jkl;', 'desk', 'port', 'mouse', 'click', 'ghana', 'smart', 'folder'];
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [wpm, setWpm] = useState(18);
  const [typingSuccess, setTypingSuccess] = useState(false);

  if (!isOpen) return null;

  const currentQ: Question = currentWeek.questions[currentQuestionIdx] || {
    id: 'placeholder',
    question: `Practice task for Week ${currentWeek.weekNumber}: Identify the core operation.`,
    options: ['Option A: Standard Protocol', 'Option B: Safe Procedure', 'Option C: Alternative Task', 'Option D: Hardware Inspection'],
    correctIndex: 1,
    explanation: 'Follow the standard procedure instructed by your lab teacher.',
    hint: 'Review the workstation guidance.'
  };

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedAnswer(idx);
    setHasSubmittedAnswer(true);

    if (idx === currentQ.correctIndex) {
      setStudentXP((prev: number) => prev + 25);
      setQuizScore((prev: number) => prev + 1);
      saveStudentXP(25);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < currentWeek.questions.length - 1) {
      setCurrentQuestionIdx((prev: number) => prev + 1);
      setSelectedAnswer(null);
      setHasSubmittedAnswer(false);
      setShowHint(false);
    } else {
      setQuizCompleted(true);
      if (!badges.includes(currentWeek.badgeName)) {
        setBadges((prev: string[]) => [...prev, currentWeek.badgeName]);
      }
      saveStudentXP(50, currentWeek.badgeName, currentWeek.weekNumber);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setHasSubmittedAnswer(false);
    setShowHint(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleTypingKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTypedInput(val);
    const targetWord = sampleWords[typingIndex];
    if (val.trim() === targetWord) {
      if (typingIndex < sampleWords.length - 1) {
        setTypingIndex((prev: number) => prev + 1);
        setTypedInput('');
        setWpm((prev: number) => Math.min(35, prev + 2));
      } else {
        setTypingSuccess(true);
        setStudentXP((prev: number) => prev + 50);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#001d36]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white border-4 border-[#001d36] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Strip */}
        <div className="bg-[#0061a4] text-white p-4 sm:px-6 flex items-center justify-between border-b-2 border-[#001d36]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Owrafix Quest Terminal
                </h3>
                {userProfile?.regNo ? (
                  <span className="text-[11px] font-mono font-bold bg-[#33a0fd] text-white px-2 py-0.5 rounded-full">
                    {userProfile.regNo}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold bg-[#33a0fd] text-white px-2 py-0.5 rounded-full">
                    OWRAFIX Student
                  </span>
                )}
                {userProfile?.paymentStatus && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    userProfile.paymentStatus === 'FULLY PAID' ? 'bg-green-200 text-green-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {userProfile.paymentStatus}
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 font-medium">
                Student: <strong className="text-white">{userProfile?.displayName || 'Bertha Kwakyewah'}</strong>
                {userProfile?.profession && ` (${userProfile.profession})`}
                {' • '}
                <span className="text-white/90">{userProfile?.course || 'Digital Foundations & AI Mastery'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* XP Pill */}
            <div className="flex items-center gap-1.5 bg-[#fff8e7] border border-[#ffc857] text-[#654800] px-3 py-1 rounded-full text-xs font-extrabold">
              <span>⭐</span>
              <span className="font-mono tabular-nums">{studentXP} XP</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close terminal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#f8f9ff] px-6 py-2.5 border-b border-[#d3e9fa] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#d3e9fa]">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'quiz' ? 'bg-[#2196F3] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              Mastery Checkpoints
            </button>
            <button
              onClick={() => setActiveTab('typing')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'typing' ? 'bg-[#2196F3] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              Typing Speed Lab
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'certificate' ? 'bg-[#2196F3] text-white shadow-xs' : 'text-[#17324d] hover:bg-[#eef4ff]'
              }`}
            >
              My Badges & Certificate
            </button>
          </div>

          {/* Week Selector Dropdown */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#17324d]/70">Selected Week:</span>
            <select
              value={selectedWeekNum}
              onChange={(e) => {
                setSelectedWeekNum(Number(e.target.value));
                restartQuiz();
              }}
              className="bg-white border-2 border-[#d3e9fa] text-[#001d36] font-bold rounded-xl px-2.5 py-1 text-xs focus:border-[#2196F3] outline-hidden cursor-pointer"
            >
              {CURRICULUM_DATA.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  Week {w.weekNumber < 10 ? `0${w.weekNumber}` : w.weekNumber}: {w.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          
          {/* TAB 1: QUIZ CHECKPOINT */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              
              {!quizCompleted ? (
                <div>
                  {/* Question Progress bar */}
                  <div className="flex items-center justify-between text-xs font-extrabold text-[#0061a4] mb-2">
                    <span>
                      Question {currentQuestionIdx + 1} of {currentWeek.questions.length}
                    </span>
                    <span className="text-[#087443] font-mono">
                      Current Score: {quizScore}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#eef4ff] rounded-full overflow-hidden mb-6">
                    <div 
                      className="h-full bg-[#087443] rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx + 1) / currentWeek.questions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question Card */}
                  <div className="bg-[#f8f9ff] border-2 border-[#d3e9fa] rounded-2xl p-6 mb-6">
                    <div className="text-xs font-extrabold text-[#0061a4] uppercase tracking-wider mb-2">
                      Week {currentWeek.weekNumber} • {currentWeek.title}
                    </div>
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#001d36] mb-6">
                      {currentQ.question}
                    </h4>

                    {/* Option Tiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {currentQ.options.map((opt, idx) => {
                        let btnStyle = 'bg-white border-[#d3e9fa] text-[#001d36] hover:border-[#2196F3]';
                        if (hasSubmittedAnswer) {
                          if (idx === currentQ.correctIndex) {
                            btnStyle = 'bg-[#e9fff6] border-[#087443] text-[#087443] font-extrabold';
                          } else if (idx === selectedAnswer) {
                            btnStyle = 'bg-[#fff1f1] border-[#ba1a1a] text-[#ba1a1a] font-bold';
                          }
                        }

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
                            disabled={hasSubmittedAnswer}
                            className={`p-4 rounded-xl border-2 text-left flex items-start justify-between gap-2 transition-all cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-md bg-[#f8f9ff] border border-[#d3e9fa] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-xs sm:text-sm font-semibold">{opt}</span>
                            </div>
                            {hasSubmittedAnswer && idx === currentQ.correctIndex && (
                              <CheckCircle2 className="w-5 h-5 text-[#087443] shrink-0" />
                            )}
                            {hasSubmittedAnswer && idx === selectedAnswer && idx !== currentQ.correctIndex && (
                              <XCircle className="w-5 h-5 text-[#ba1a1a] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Feedback / Explanation Box */}
                  {hasSubmittedAnswer && (
                    <div className={`p-4 rounded-2xl border-2 mb-6 animate-in fade-in ${
                      selectedAnswer === currentQ.correctIndex
                        ? 'bg-[#e9fff6] border-[#087443] text-[#087443]'
                        : 'bg-[#fff8e7] border-[#ffc857] text-[#654800]'
                    }`}>
                      <div className="font-extrabold text-sm mb-1 flex items-center gap-1.5">
                        {selectedAnswer === currentQ.correctIndex ? (
                          <>
                            <span>🎉 Brilliant work! (+25 XP)</span>
                          </>
                        ) : (
                          <>
                            <span>💡 Learning Opportunity</span>
                          </>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {currentQ.explanation}
                      </p>
                    </div>
                  )}

                  {/* Footer actions */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-xs font-bold text-[#0061a4] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                    </button>

                    {hasSubmittedAnswer && (
                      <button
                        onClick={handleNextQuestion}
                        className="btn-chunky-green py-2.5 px-6 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>{currentQuestionIdx < currentWeek.questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {showHint && (
                    <div className="mt-3 p-3 bg-[#eaf7ff] border border-[#d3e9fa] rounded-xl text-xs text-[#0061a4] font-medium">
                      💡 <strong>Hint:</strong> {currentQ.hint}
                    </div>
                  )}

                </div>
              ) : (
                /* Quiz Complete Celebratory Screen */
                <div className="text-center py-8 max-w-md mx-auto space-y-5 animate-in zoom-in-95">
                  <div className="w-20 h-20 rounded-3xl bg-[#e9fff6] border-2 border-[#9af7b9] text-[#087443] flex items-center justify-center text-4xl mx-auto shadow-sm">
                    {currentWeek.badgeIcon}
                  </div>
                  
                  <div>
                    <span className="text-xs font-extrabold text-[#087443] uppercase tracking-wider">
                      Mastery Test Complete!
                    </span>
                    <h3 className="text-2xl font-extrabold text-[#001d36] mt-1">
                      Badge Unlocked: {currentWeek.badgeName}
                    </h3>
                    <p className="text-xs text-[#17324d]/80 mt-1">
                      You scored {quizScore} / {currentWeek.questions.length} on Week {currentWeek.weekNumber} practical skill check.
                    </p>
                  </div>

                  <div className="p-4 bg-[#f8f9ff] border border-[#d3e9fa] rounded-2xl flex items-center justify-around">
                    <div>
                      <div className="text-2xl font-extrabold text-[#087443] font-mono">+{quizScore * 25}</div>
                      <div className="text-[11px] font-bold text-[#17324d]/60">XP Gained</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <div className="text-2xl font-extrabold text-[#0061a4] font-mono">100%</div>
                      <div className="text-[11px] font-bold text-[#17324d]/60">GES Aligned</div>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div>
                      <div className="text-2xl font-extrabold text-[#654800] font-mono">4 Days</div>
                      <div className="text-[11px] font-bold text-[#17324d]/60">Streak</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={restartQuiz}
                      className="btn-chunky-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('certificate')}
                      className="btn-chunky-green py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View Passport Certificate</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: TYPING SPEED LAB */}
          {activeTab === 'typing' && (
            <div className="max-w-xl mx-auto py-6 space-y-6 text-center">
              <div>
                <span className="text-xs font-extrabold text-[#0061a4] uppercase tracking-wider">
                  WEEK 03 SKILL DRILL
                </span>
                <h4 className="text-2xl font-extrabold text-[#001d36] mt-1">
                  Home Row Tactile Typing Challenge
                </h4>
                <p className="text-xs text-[#17324d]/70 mt-1">
                  Keep index fingers on F and J bumps. Type the prompt word below and press space!
                </p>
              </div>

              {/* Target Word Display */}
              <div className="p-8 bg-[#f8f9ff] border-3 border-[#d3e9fa] rounded-3xl shadow-xs">
                <div className="text-xs font-bold text-[#0061a4] mb-2 uppercase">
                  Target Word ({typingIndex + 1} of {sampleWords.length}):
                </div>
                <div className="text-4xl sm:text-5xl font-extrabold text-[#001d36] tracking-widest font-mono">
                  {sampleWords[typingIndex]}
                </div>

                <div className="mt-6 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={typedInput}
                    onChange={handleTypingKey}
                    autoFocus
                    placeholder="Type here..."
                    className="w-full text-center text-xl font-bold py-3 px-4 rounded-xl border-3 border-[#2196F3] outline-hidden focus:ring-4 focus:ring-[#2196F3]/20"
                  />
                </div>
              </div>

              {/* Live telemetry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#e9fff6] border border-[#9af7b9] rounded-xl text-center">
                  <div className="text-2xl font-extrabold text-[#087443] font-mono">{wpm} WPM</div>
                  <div className="text-[11px] font-bold text-[#087443]">Speed Benchmark</div>
                </div>
                <div className="p-3 bg-[#fff8e7] border border-[#ffc857] rounded-xl text-center">
                  <div className="text-2xl font-extrabold text-[#654800] font-mono">100%</div>
                  <div className="text-[11px] font-bold text-[#654800]">Accuracy</div>
                </div>
              </div>

              {typingSuccess && (
                <div className="p-4 bg-[#e9fff6] border border-[#087443] rounded-2xl text-[#087443] font-bold text-xs animate-in zoom-in-95">
                  🌟 Congratulations! You completed the Home Row typing challenge (+50 XP)!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PASSPORT CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              <div className="border-4 border-[#087443] rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#ffffff] to-[#f8f9ff] relative shadow-md">
                
                {/* Official Certificate Header */}
                <div className="text-center space-y-2 pb-6 border-b-2 border-[#d3e9fa]">
                  <div className="inline-flex items-center gap-2 bg-[#e9fff6] border border-[#9af7b9] px-3.5 py-1 rounded-full text-xs font-extrabold text-[#087443]">
                    <Award className="w-3.5 h-3.5" />
                    <span>MINISTRY OF EDUCATION • GES ICT FRAMEWORK</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#001d36] tracking-tight">
                    Certificate of Practical Digital Literacy
                  </h3>
                  <p className="text-xs text-[#17324d]/75">
                    This certifies that the basic school pupil has demonstrated verified hands-on workstation competency.
                  </p>
                </div>

                {/* Pupil Info */}
                <div className="py-6 text-center space-y-2">
                  <div className="text-xs font-bold text-[#0061a4] uppercase">Awarded To:</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#087443]">
                    {userProfile?.displayName || 'Bertha Kwakyewah'}
                  </div>
                  <div className="text-xs font-semibold text-[#17324d]/80">
                    Registration No: <span className="font-mono font-bold text-[#0061a4]">{userProfile?.regNo || 'OWR-2026-0003'}</span>
                    {userProfile?.profession && ` • Profession: ${userProfile.profession}`}
                  </div>
                  <div className="text-sm font-extrabold text-[#001d36] pt-1">
                    Course: {userProfile?.course || 'Digital Foundations & AI Mastery — Complete Beginner — 12 Weeks'}
                  </div>
                  <div className="text-xs text-[#087443] font-medium">
                    OWRAFIX VENTURES • Practical Digital Skills & Entrepreneurship Training Programme
                  </div>
                </div>

                {/* Badges Earned Grid */}
                <div className="bg-[#f8f9ff] border border-[#d3e9fa] rounded-2xl p-4 mb-6">
                  <div className="text-xs font-extrabold text-[#001d36] mb-3 uppercase tracking-wider">
                    Verified Competency Badges ({badges.length} Unlocked)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((b: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-white border border-[#9af7b9] px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#087443] shadow-xs"
                      >
                        <span>🎖️</span>
                        <span>{b}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificate Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#d3e9fa] text-[11px] text-[#17324d]/70">
                  <div>
                    <span className="font-bold text-[#001d36]">Lab Verification ID:</span> OWX-ACCRA-2025-0843
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#087443]"></span>
                    <span className="font-bold text-[#087443]">Status: Verified by Lead Lab Instructor</span>
                  </div>
                </div>

              </div>

              {/* Print CTA */}
              <div className="flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="btn-chunky-green py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Student Passport Card</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
