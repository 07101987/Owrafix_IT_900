import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CURRICULUM_DATA, INITIAL_STUDENT_PROFILE } from '../data/curriculum';
import { CurriculumWeek, Question } from '../types';
import computerImage from '../assets/images/computer_hardware_display_1790527370735.jpg';
import studentsImage from '../assets/images/ghana_lab_students_1790527347951.jpg';
import teacherImage from '../assets/images/teacher_projector_lab_1790527359831.jpg';
import {
  X, CheckCircle2, XCircle, Keyboard, HelpCircle, ChevronRight,
  ChevronLeft, RotateCcw, Star, BookOpen, PlayCircle, Trophy,
  Target, Lightbulb, MousePointer2, ClipboardCheck, Image as ImageIcon
} from 'lucide-react';

interface StudentTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeek?: number;
}

type StudentTab = 'learn' | 'quiz' | 'typing' | 'progress';

const weekImage = (week: CurriculumWeek) => {
  if (week.category === 'hardware' || week.weekNumber === 2 || week.weekNumber === 3) return computerImage;
  if (week.category === 'safety' || week.weekNumber === 8) return studentsImage;
  return teacherImage;
};

const uniqueOptions = (correct: string, distractors: string[]) => {
  const options = [correct, ...distractors.filter((d) => d && d !== correct)].slice(0, 4);
  while (options.length < 4) options.push(`Review the lesson: ${options.length + 1}`);
  return options;
};

/**
 * Every student assessment is exactly 20 questions. Existing curriculum questions
 * are preserved, then lesson content is converted into additional child-friendly
 * questions so a short source question list can never produce a 3- or 5-question test.
 */
const buildTwentyQuestionAssessment = (week: CurriculumWeek): Question[] => {
  const result: Question[] = [];
  const seen = new Set<string>();

  const add = (q: Question) => {
    if (result.length < 20 && !seen.has(q.question)) {
      seen.add(q.question);
      result.push({ ...q, id: `${week.weekNumber}-assessment-${result.length + 1}` });
    }
  };

  week.questions.forEach(add);

  const slides = week.slides || [];
  slides.forEach((slide, slideIndex) => {
    const otherSlides = slides.filter((_, i) => i !== slideIndex);
    const distractorConcepts = otherSlides.map((s) => s.bigConcept);
    const distractorActions = otherSlides.map((s) => s.actionPrompt);

    add({
      id: '',
      question: `What is the big idea in the lesson “${slide.title}”?`,
      options: uniqueOptions(slide.bigConcept, [slide.keyTakeaway, ...distractorConcepts]),
      correctIndex: 0,
      explanation: slide.bigConcept,
      hint: 'Read the Big Idea box in the lesson.'
    });
    add({
      id: '',
      question: `Which statement is the key takeaway from “${slide.title}”?`,
      options: uniqueOptions(slide.keyTakeaway, [slide.bigConcept, slide.actionPrompt, ...distractorConcepts]),
      correctIndex: 0,
      explanation: slide.keyTakeaway,
      hint: 'Look for the Key Takeaway in this lesson.'
    });
    add({
      id: '',
      question: `What practice activity belongs to “${slide.title}”?`,
      options: uniqueOptions(slide.actionPrompt, [slide.keyTakeaway, ...distractorActions, week.workstationTask]),
      correctIndex: 0,
      explanation: `Your practice activity is: ${slide.actionPrompt}`,
      hint: 'Think about what you are asked to do with the computer.'
    });
    add({
      id: '',
      question: `If you are practising “${slide.title}”, what should you remember?`,
      options: uniqueOptions(slide.keyTakeaway, [slide.bigConcept, week.description, week.workstationTask]),
      correctIndex: 0,
      explanation: slide.keyTakeaway,
      hint: 'Choose the sentence that helps you do the task correctly.'
    });
    add({
      id: '',
      question: `Which sentence best describes why “${slide.title}” matters?`,
      options: uniqueOptions(slide.bigConcept, [week.description, slide.actionPrompt, 'It is only for playing games.']),
      correctIndex: 0,
      explanation: slide.bigConcept,
      hint: 'Choose the explanation that teaches the main idea.'
    });
  });

  const weekFacts: Question[] = [
    {
      id: '',
      question: `What is the main focus of Week ${week.weekNumber}: ${week.title}?`,
      options: uniqueOptions(week.description, ['Only computer games', 'Only drawing pictures', 'Only watching videos']),
      correctIndex: 0,
      explanation: week.description,
      hint: 'Look at the Week Description on the course map.'
    },
    {
      id: '',
      question: `Which hands-on task is planned for Week ${week.weekNumber}?`,
      options: uniqueOptions(week.workstationTask, ['Skip all practice', 'Watch the teacher only', 'Close the computer immediately']),
      correctIndex: 0,
      explanation: `Your hands-on task is: ${week.workstationTask}`,
      hint: 'The course map lists a workstation task for every week.'
    },
    {
      id: '',
      question: `What badge can you earn after completing Week ${week.weekNumber}?`,
      options: uniqueOptions(week.badgeName, ['Homework Helper', 'Screen Watcher', 'Computer Visitor']),
      correctIndex: 0,
      explanation: `Your Week ${week.weekNumber} badge is ${week.badgeName}.`,
      hint: 'Look beside the badge icon on the course map.'
    },
    {
      id: '',
      question: `What should you do if you are unsure during Week ${week.weekNumber}?`,
      options: ['Ask the teacher and review the lesson', 'Guess and change random settings', 'Switch off every computer', 'Leave the classroom'],
      correctIndex: 0,
      explanation: 'Good learners ask questions, review examples, and practise carefully.',
      hint: 'A good computer learner is curious and asks for help.'
    },
    {
      id: '',
      question: `How should you learn Week ${week.weekNumber} before taking the test?`,
      options: ['Read the lesson, study the example, practise, then take the test', 'Skip the lesson and guess', 'Only memorise the badge name', 'Take the test without practising'],
      correctIndex: 0,
      explanation: 'Owrafix uses a Learn → See → Practise → Test learning cycle.',
      hint: 'Follow the four-step learning journey.'
    },
    {
      id: '',
      question: `Which learning cycle does Owrafix use?`,
      options: ['Learn → See → Practise → Test', 'Guess → Click → Exit → Forget', 'Watch → Sleep → Test → Leave', 'Type → Delete → Restart → Stop'],
      correctIndex: 0,
      explanation: 'The portal is designed around Learn → See → Practise → Test.',
      hint: 'It starts with learning and ends with a test.'
    },
    {
      id: '',
      question: 'What should you do after finishing a practice activity?',
      options: ['Check your work and then take the assessment', 'Delete everything immediately', 'Close the browser without saving', 'Turn off the classroom power'],
      correctIndex: 0,
      explanation: 'Reviewing your practice helps you prepare for the assessment.',
      hint: 'Practice comes before the test.'
    },
    {
      id: '',
      question: 'What does a course badge show?',
      options: ['A learning achievement you have earned', 'Your computer password', 'Your internet speed', 'Your classroom seat number'],
      correctIndex: 0,
      explanation: 'Badges celebrate skills and completed learning milestones.',
      hint: 'A badge is an achievement.'
    }
  ];

  weekFacts.forEach(add);

  // Guarantee exactly 20 even for weeks with only one short lesson.
  const fallbackTopics = [
    ['Which resource should you use first when learning?', 'The lesson and examples', 'A random website', 'A game only', 'Nothing'],
    ['What is the purpose of practice?', 'To build confidence by doing the skill', 'To avoid using the computer', 'To make the lesson longer', 'To skip the test'],
    ['What should a learner do when a task is difficult?', 'Try again, use the hint, and ask the teacher', 'Give up immediately', 'Delete the lesson', 'Turn off the monitor'],
    ['What does a correct answer show?', 'You understood that question', 'You have finished the whole course', 'You never need practice again', 'You can skip every lesson'],
    ['Why are examples included in the portal?', 'They show what the skill looks like in real use', 'They are decorations only', 'They replace the teacher', 'They are passwords']
  ];

  let fallbackIndex = 0;
  while (result.length < 20) {
    const item = fallbackTopics[fallbackIndex % fallbackTopics.length];
    fallbackIndex += 1;
    add({
      id: '',
      question: `${item[0]} — Quick Check ${fallbackIndex}`,
      options: [item[1], item[2], item[3], item[4]],
      correctIndex: 0,
      explanation: item[1],
      hint: 'Think about the Learn → See → Practise → Test approach.'
    });
  }

  return result.slice(0, 20);
};

export const StudentTerminalModal: React.FC<StudentTerminalProps> = ({ isOpen, onClose, initialWeek = 1 }) => {
  const { userProfile, saveStudentXP } = useAuth();
  const [selectedWeekNum, setSelectedWeekNum] = useState(initialWeek);
  const [activeTab, setActiveTab] = useState<StudentTab>('learn');
  const [studentXP, setStudentXP] = useState(INITIAL_STUDENT_PROFILE.xp);
  const [badges, setBadges] = useState(INITIAL_STUDENT_PROFILE.badges);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [typingSuccess, setTypingSuccess] = useState(false);

  const currentWeek = CURRICULUM_DATA.find((w) => w.weekNumber === selectedWeekNum) || CURRICULUM_DATA[0];
  const assessment = useMemo(() => buildTwentyQuestionAssessment(currentWeek), [currentWeek]);
  const currentQ = assessment[currentQuestionIdx];
  const currentSlide = currentWeek.slides[lessonIndex] || currentWeek.slides[0];

  useEffect(() => {
    setLessonIndex(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setHasSubmittedAnswer(false);
    setShowHint(false);
    setQuizScore(0);
    setQuizCompleted(false);
    setTypingIndex(0);
    setTypedInput('');
    setTypingSuccess(false);
  }, [selectedWeekNum]);

  if (!isOpen) return null;

  const selectWeek = (weekNumber: number) => {
    setSelectedWeekNum(weekNumber);
    setActiveTab('learn');
  };

  const chooseAnswer = (idx: number) => {
    if (hasSubmittedAnswer) return;
    setSelectedAnswer(idx);
    setHasSubmittedAnswer(true);
    if (idx === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
      setStudentXP((prev) => prev + 10);
      void saveStudentXP(10);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < 19) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setHasSubmittedAnswer(false);
      setShowHint(false);
      return;
    }
    setQuizCompleted(true);
    if (!badges.includes(currentWeek.badgeName)) {
      setBadges((prev) => [...prev, currentWeek.badgeName]);
    }
    void saveStudentXP(50, currentWeek.badgeName, currentWeek.weekNumber);
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setHasSubmittedAnswer(false);
    setShowHint(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const words = ['asdf', 'jkl;', 'home row', 'computer', 'keyboard', 'mouse', 'Owrafix'];
    const value = e.target.value;
    setTypedInput(value);
    if (value.trim().toLowerCase() === words[typingIndex].toLowerCase()) {
      if (typingIndex < words.length - 1) {
        setTypingIndex((prev) => prev + 1);
        setTypedInput('');
        setStudentXP((prev) => prev + 5);
      } else {
        setTypingSuccess(true);
        setStudentXP((prev) => prev + 25);
        void saveStudentXP(25);
      }
    }
  };

  const tabClass = (tab: StudentTab) =>
    `px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === tab ? 'bg-[#0061a4] text-white shadow-sm' : 'text-[#17324d] hover:bg-[#eaf7ff]'}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#17324d]/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl bg-white border-2 border-[#d3e9fa] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        <header className="bg-white border-b border-[#d3e9fa] p-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#eaf7ff] flex items-center justify-center text-2xl shrink-0">🎓</div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0061a4] truncate">Owrafix Junior Learning Portal</h2>
              <p className="text-xs text-[#58758f] font-semibold">Learn • See • Practise • Test • Level Up</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-[#fff8e7] border border-[#ffc857] text-[#654800] rounded-full px-3 py-2 text-xs font-extrabold">⭐ {studentXP} XP</div>
            <button onClick={onClose} className="p-2 rounded-xl bg-[#f2f7fb] hover:bg-[#e5eef5] text-[#17324d]" aria-label="Close student portal"><X className="w-5 h-5" /></button>
          </div>
        </header>

        <div className="bg-[#f8fbff] border-b border-[#d3e9fa] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 bg-white p-1 rounded-2xl border border-[#d3e9fa]">
            <button className={tabClass('learn')} onClick={() => setActiveTab('learn')}><BookOpen className="inline w-4 h-4 mr-1" />Learn</button>
            <button className={tabClass('quiz')} onClick={() => setActiveTab('quiz')}><ClipboardCheck className="inline w-4 h-4 mr-1" />20-Question Test</button>
            <button className={tabClass('typing')} onClick={() => setActiveTab('typing')}><Keyboard className="inline w-4 h-4 mr-1" />Typing Practice</button>
            <button className={tabClass('progress')} onClick={() => setActiveTab('progress')}><Trophy className="inline w-4 h-4 mr-1" />My Progress</button>
          </div>
          <label className="flex items-center gap-2 text-xs font-extrabold text-[#58758f]">
            WEEK
            <select value={selectedWeekNum} onChange={(e) => selectWeek(Number(e.target.value))} className="bg-white border-2 border-[#d3e9fa] rounded-xl px-3 py-2 text-[#0061a4] font-extrabold outline-none">
              {CURRICULUM_DATA.map((week) => <option key={week.weekNumber} value={week.weekNumber}>Week {String(week.weekNumber).padStart(2, '0')} — {week.title}</option>)}
            </select>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f8fbff] p-4 sm:p-6">
          {activeTab === 'learn' && (
            <div className="space-y-6">
              <section className="grid lg:grid-cols-[1.25fr_.75fr] gap-5">
                <div className="bg-white rounded-3xl border border-[#d3e9fa] overflow-hidden shadow-sm">
                  <div className="relative h-52 sm:h-64 overflow-hidden">
                    <img src={weekImage(currentWeek)} alt={`${currentWeek.title} lesson`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001d36]/75 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 text-white">
                      <div className="text-xs font-extrabold uppercase tracking-wider">Week {currentWeek.weekNumber} • {currentWeek.category}</div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold">{currentWeek.title}</h3>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <p className="text-sm leading-6 text-[#35536d] font-medium">{currentWeek.description}</p>
                    <div className="mt-4 grid sm:grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-[#eaf7ff] p-4"><Target className="w-5 h-5 text-[#0061a4] mb-2" /><div className="text-[11px] font-extrabold text-[#58758f] uppercase">Goal</div><div className="text-sm font-extrabold text-[#17324d]">Build the skill</div></div>
                      <div className="rounded-2xl bg-[#fff8e7] p-4"><Lightbulb className="w-5 h-5 text-[#b77a00] mb-2" /><div className="text-[11px] font-extrabold text-[#58758f] uppercase">Badge</div><div className="text-sm font-extrabold text-[#17324d]">{currentWeek.badgeIcon} {currentWeek.badgeName}</div></div>
                      <div className="rounded-2xl bg-[#e9fff6] p-4"><PlayCircle className="w-5 h-5 text-[#087443] mb-2" /><div className="text-[11px] font-extrabold text-[#58758f] uppercase">Project</div><div className="text-sm font-extrabold text-[#17324d]">{currentWeek.workstationTask}</div></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-[#d3e9fa] p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4"><h3 className="font-extrabold text-[#0061a4]">This Week's Lessons</h3><span className="text-xs font-bold text-[#58758f]">{lessonIndex + 1}/{currentWeek.slides.length}</span></div>
                  <div className="space-y-2">
                    {currentWeek.slides.map((slide, index) => (
                      <button key={slide.title} onClick={() => setLessonIndex(index)} className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${lessonIndex === index ? 'border-[#2196F3] bg-[#eaf7ff]' : 'border-[#edf3f8] bg-white hover:border-[#b9d8ee]'}`}>
                        <div className="flex items-center gap-3"><span className="w-8 h-8 rounded-xl bg-white border border-[#d3e9fa] flex items-center justify-center text-xs font-extrabold text-[#0061a4]">{index + 1}</span><span className="text-sm font-extrabold text-[#17324d]">{slide.title}</span></div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-5 p-4 rounded-2xl bg-[#f8fbff] border border-[#d3e9fa] text-xs text-[#58758f] font-semibold">Read each lesson, look at the example, then do the practice activity on your own computer.</div>
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-[#d3e9fa] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-[#0061a4]" /><h3 className="text-xl font-extrabold text-[#17324d]">Lesson {lessonIndex + 1}: {currentSlide.title}</h3></div>
                <div className="grid lg:grid-cols-2 gap-5">
                  <div className="rounded-2xl bg-[#eaf7ff] p-5"><div className="text-xs font-extrabold uppercase tracking-wider text-[#0061a4] mb-2">Big Idea</div><p className="text-base sm:text-lg font-extrabold leading-7 text-[#17324d]">{currentSlide.bigConcept}</p></div>
                  <div className="rounded-2xl bg-[#fff8e7] p-5"><div className="text-xs font-extrabold uppercase tracking-wider text-[#9b6800] mb-2">Remember This</div><p className="text-base sm:text-lg font-extrabold leading-7 text-[#17324d]">{currentSlide.keyTakeaway}</p></div>
                </div>
                <div className="mt-5 rounded-2xl border-2 border-dashed border-[#087443] bg-[#e9fff6] p-5">
                  <div className="flex items-center gap-2 text-[#087443] font-extrabold"><Target className="w-5 h-5" /> Try It On Your Computer</div>
                  <p className="mt-2 text-sm font-bold text-[#17324d]">{currentSlide.actionPrompt}</p>
                </div>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <button disabled={lessonIndex === 0} onClick={() => setLessonIndex((prev) => Math.max(0, prev - 1))} className="px-4 py-2.5 rounded-xl border border-[#d3e9fa] font-extrabold text-xs disabled:opacity-40"><ChevronLeft className="inline w-4 h-4" /> Previous</button>
                  <button onClick={() => lessonIndex < currentWeek.slides.length - 1 ? setLessonIndex((prev) => prev + 1) : setActiveTab('quiz')} className="px-5 py-2.5 rounded-xl bg-[#087443] text-white font-extrabold text-xs">{lessonIndex < currentWeek.slides.length - 1 ? 'Next Lesson' : 'I am ready for the 20-question test'} <ChevronRight className="inline w-4 h-4" /></button>
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-[#d3e9fa] p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4"><ImageIcon className="w-5 h-5 text-[#0061a4]" /><h3 className="font-extrabold text-[#17324d]">Your 12-Week Course Map</h3></div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {CURRICULUM_DATA.map((week) => (
                    <button key={week.weekNumber} onClick={() => selectWeek(week.weekNumber)} className={`text-left rounded-2xl border-2 p-4 ${week.weekNumber === selectedWeekNum ? 'border-[#2196F3] bg-[#eaf7ff]' : 'border-[#edf3f8] bg-white hover:border-[#b9d8ee]'}`}>
                      <div className="flex items-center justify-between"><span className="text-xs font-extrabold text-[#0061a4]">WEEK {String(week.weekNumber).padStart(2, '0')}</span><span className="text-lg">{week.badgeIcon}</span></div>
                      <div className="mt-1 font-extrabold text-[#17324d]">{week.title}</div>
                      <div className="mt-1 text-xs text-[#58758f] font-medium line-clamp-2">{week.description}</div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="max-w-4xl mx-auto">
              {!quizCompleted ? (
                <div className="space-y-5">
                  <div className="bg-white rounded-3xl border border-[#d3e9fa] p-5 shadow-sm">
                    <div className="flex items-center justify-between gap-3"><div><div className="text-xs font-extrabold uppercase tracking-wider text-[#0061a4]">{currentWeek.title}</div><h3 className="text-xl sm:text-2xl font-extrabold text-[#17324d]">20-Question Mastery Test</h3></div><div className="text-right"><div className="text-xs font-extrabold text-[#087443]">Question {currentQuestionIdx + 1} of 20</div><div className="text-xs font-bold text-[#58758f]">Score: {quizScore}</div></div></div>
                    <div className="mt-4 h-3 bg-[#edf3f8] rounded-full overflow-hidden"><div className="h-full bg-[#087443] transition-all" style={{ width: `${((currentQuestionIdx + 1) / 20) * 100}%` }} /></div>
                  </div>

                  <div className="bg-white rounded-3xl border-2 border-[#d3e9fa] p-5 sm:p-7 shadow-sm">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf7ff] text-[#0061a4] text-xs font-extrabold"><ClipboardCheck className="w-4 h-4" /> Question {currentQuestionIdx + 1}</div>
                    <h4 className="mt-4 text-xl sm:text-2xl font-extrabold leading-8 text-[#17324d]">{currentQ.question}</h4>
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {currentQ.options.map((option, index) => {
                        const correct = index === currentQ.correctIndex;
                        const selected = index === selectedAnswer;
                        const style = hasSubmittedAnswer ? (correct ? 'border-[#087443] bg-[#e9fff6] text-[#087443]' : selected ? 'border-[#ba1a1a] bg-[#fff1f1] text-[#ba1a1a]' : 'border-[#edf3f8] bg-white text-[#17324d]') : 'border-[#d3e9fa] bg-white text-[#17324d] hover:border-[#2196F3] hover:bg-[#f5fbff]';
                        return <button key={option} disabled={hasSubmittedAnswer} onClick={() => chooseAnswer(index)} className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all ${style}`}><span className="inline-flex w-7 h-7 rounded-lg bg-[#f2f7fb] items-center justify-center mr-2 text-xs">{String.fromCharCode(65 + index)}</span>{option}{hasSubmittedAnswer && correct && <CheckCircle2 className="inline w-5 h-5 ml-2" />}{hasSubmittedAnswer && selected && !correct && <XCircle className="inline w-5 h-5 ml-2" />}</button>;
                      })}
                    </div>

                    {hasSubmittedAnswer && <div className={`mt-5 rounded-2xl p-4 border-2 ${selectedAnswer === currentQ.correctIndex ? 'bg-[#e9fff6] border-[#087443]' : 'bg-[#fff8e7] border-[#ffc857]'}`}><div className="font-extrabold text-sm">{selectedAnswer === currentQ.correctIndex ? '🎉 Correct! +10 XP' : '💡 Keep learning — you can get the next one!'}</div><p className="mt-1 text-sm font-medium text-[#35536d]">{currentQ.explanation}</p></div>}

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button onClick={() => setShowHint((prev) => !prev)} className="text-xs font-extrabold text-[#0061a4]"><HelpCircle className="inline w-4 h-4 mr-1" />{showHint ? 'Hide Hint' : 'Need a Hint?'}</button>
                      {hasSubmittedAnswer && <button onClick={nextQuestion} className="px-5 py-3 rounded-xl bg-[#087443] text-white font-extrabold text-xs">{currentQuestionIdx === 19 ? 'View My Score' : 'Next Question'} <ChevronRight className="inline w-4 h-4" /></button>}
                    </div>
                    {showHint && <div className="mt-3 rounded-xl bg-[#eaf7ff] border border-[#d3e9fa] p-3 text-xs font-semibold text-[#35536d]">💡 {currentQ.hint}</div>}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-[#d3e9fa] p-8 text-center shadow-sm">
                  <div className="w-20 h-20 rounded-full bg-[#fff8e7] flex items-center justify-center mx-auto text-4xl">🏆</div>
                  <div className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#0061a4]">Assessment Complete</div>
                  <h3 className="mt-1 text-3xl font-extrabold text-[#17324d]">You scored {quizScore} / 20</h3>
                  <p className="mt-3 text-[#58758f] font-medium">You answered all 20 questions. Great work! Review the lessons and try again if you want to improve your score.</p>
                  <div className="mt-5 grid sm:grid-cols-3 gap-3"><div className="rounded-2xl bg-[#e9fff6] p-4"><div className="text-2xl font-extrabold text-[#087443]">{Math.round((quizScore / 20) * 100)}%</div><div className="text-xs font-bold text-[#58758f]">Score</div></div><div className="rounded-2xl bg-[#eaf7ff] p-4"><div className="text-2xl font-extrabold text-[#0061a4]">+{quizScore * 10} XP</div><div className="text-xs font-bold text-[#58758f]">Question XP</div></div><div className="rounded-2xl bg-[#fff8e7] p-4"><div className="text-2xl font-extrabold text-[#654800]">{currentWeek.badgeIcon}</div><div className="text-xs font-bold text-[#58758f]">{currentWeek.badgeName}</div></div></div>
                  <div className="mt-6 flex flex-wrap justify-center gap-3"><button onClick={restartQuiz} className="px-5 py-3 rounded-xl border-2 border-[#d3e9fa] font-extrabold text-xs"><RotateCcw className="inline w-4 h-4 mr-1" /> Try Again</button><button onClick={() => setActiveTab('learn')} className="px-5 py-3 rounded-xl bg-[#0061a4] text-white font-extrabold text-xs">Review Lessons</button></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'typing' && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="bg-white rounded-3xl border border-[#d3e9fa] p-6 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#eaf7ff] flex items-center justify-center mx-auto"><Keyboard className="w-8 h-8 text-[#0061a4]" /></div>
                <h3 className="mt-4 text-2xl font-extrabold text-[#17324d]">Typing Practice Lab</h3>
                <p className="mt-2 text-sm text-[#58758f] font-medium">Type the word or phrase exactly as shown. Look at the screen, not your fingers!</p>
                {!typingSuccess ? <><div className="mt-6 text-4xl sm:text-5xl font-black tracking-widest text-[#0061a4]">{['asdf', 'jkl;', 'home row', 'computer', 'keyboard', 'mouse', 'Owrafix'][typingIndex]}</div><input autoFocus value={typedInput} onChange={handleTyping} className="mt-6 w-full rounded-2xl border-2 border-[#d3e9fa] p-4 text-center text-xl font-extrabold outline-none focus:border-[#2196F3]" placeholder="Type here..." /></> : <div className="mt-6 rounded-2xl bg-[#e9fff6] border-2 border-[#087443] p-6"><div className="text-4xl">🎉</div><div className="mt-2 text-xl font-extrabold text-[#087443]">Typing Challenge Complete!</div><div className="text-sm font-bold text-[#35536d]">You earned bonus XP. Keep practising every class.</div></div>}
              </div>
              <div className="grid sm:grid-cols-3 gap-3"><div className="bg-white rounded-2xl border border-[#d3e9fa] p-4 text-center"><div className="text-2xl font-extrabold text-[#0061a4]">{typingIndex + (typingSuccess ? 1 : 0)}</div><div className="text-xs font-bold text-[#58758f]">Steps</div></div><div className="bg-white rounded-2xl border border-[#d3e9fa] p-4 text-center"><div className="text-2xl font-extrabold text-[#087443]">F + J</div><div className="text-xs font-bold text-[#58758f]">Home-row guides</div></div><div className="bg-white rounded-2xl border border-[#d3e9fa] p-4 text-center"><div className="text-2xl font-extrabold text-[#654800]">🎯</div><div className="text-xs font-bold text-[#58758f]">Accuracy first</div></div></div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="max-w-5xl mx-auto space-y-5">
              <div className="bg-white rounded-3xl border border-[#d3e9fa] p-6 shadow-sm"><div className="flex items-center gap-3"><div className="w-14 h-14 rounded-2xl bg-[#fff8e7] flex items-center justify-center text-3xl">⭐</div><div><div className="text-xs font-extrabold text-[#58758f] uppercase">Learner</div><h3 className="text-2xl font-extrabold text-[#17324d]">{userProfile?.displayName || 'Junior Explorer'}</h3></div></div><div className="mt-5 grid sm:grid-cols-3 gap-3"><div className="rounded-2xl bg-[#eaf7ff] p-5"><div className="text-3xl font-extrabold text-[#0061a4]">{studentXP}</div><div className="text-xs font-bold text-[#58758f]">XP earned</div></div><div className="rounded-2xl bg-[#e9fff6] p-5"><div className="text-3xl font-extrabold text-[#087443]">{badges.length}</div><div className="text-xs font-bold text-[#58758f]">Badges</div></div><div className="rounded-2xl bg-[#fff8e7] p-5"><div className="text-3xl font-extrabold text-[#654800]">12</div><div className="text-xs font-bold text-[#58758f]">Weeks in course</div></div></div></div>
              <div className="bg-white rounded-3xl border border-[#d3e9fa] p-6 shadow-sm"><h3 className="font-extrabold text-[#17324d] mb-4">Your Course Journey</h3><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{CURRICULUM_DATA.map((week) => <button key={week.weekNumber} onClick={() => { selectWeek(week.weekNumber); setActiveTab('learn'); }} className="text-left rounded-2xl border border-[#edf3f8] p-4 hover:border-[#2196F3]"><div className="flex justify-between"><span className="text-xs font-extrabold text-[#0061a4]">WEEK {String(week.weekNumber).padStart(2, '0')}</span><span>{week.badgeIcon}</span></div><div className="mt-1 font-extrabold text-[#17324d]">{week.title}</div><div className="mt-2 text-xs text-[#58758f]">20-question assessment • lessons • practice</div></button>)}</div></div>
            </div>
          )}
        </div>

        <footer className="border-t border-[#d3e9fa] bg-white px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-[#58758f]">Owrafix IT Training Center • Junior Computer School</div>
          <div className="flex items-center gap-2 text-xs font-extrabold text-[#0061a4]"><MousePointer2 className="w-4 h-4" /> {currentWeek.workstationTask}</div>
        </footer>
      </div>
    </div>
  );
};
