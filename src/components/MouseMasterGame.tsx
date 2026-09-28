import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  Award, 
  MousePointer2, 
  Sparkles,
  Zap,
  Target,
  Trophy
} from 'lucide-react';

interface TargetItem {
  id: number;
  label: string;
  icon: string;
  x: number;
  y: number;
  points: number;
}

const HARDWARE_TARGETS = [
  { label: 'CPU Chip', icon: '🧠', points: 15 },
  { label: 'RAM Stick', icon: '⚡', points: 10 },
  { label: 'Optical Mouse', icon: '🖱️', points: 10 },
  { label: 'USB Drive', icon: '💾', points: 15 },
  { label: 'HDMI Cable', icon: '🔌', points: 10 },
  { label: 'Keyboard Key', icon: '⌨️', points: 10 },
];

export const MouseMasterGame: React.FC<{ onOpenStudent: () => void }> = ({ onOpenStudent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [currentTarget, setCurrentTarget] = useState<TargetItem | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [clickPops, setClickPops] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  const spawnTarget = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const item = HARDWARE_TARGETS[Math.floor(Math.random() * HARDWARE_TARGETS.length)];
    
    // Bounds check within container
    const padding = 50;
    const width = Math.max(200, rect.width - padding * 2);
    const height = Math.max(160, rect.height - padding * 2);
    
    const x = Math.floor(Math.random() * width) + padding;
    const y = Math.floor(Math.random() * height) + padding;

    setCurrentTarget({
      id: Date.now(),
      label: item.label,
      icon: item.icon,
      x,
      y,
      points: item.points
    });
  };

  const startGame = () => {
    setIsPlaying(true);
    setIsFinished(false);
    setTimeLeft(20);
    setScore(0);
    setHits(0);
    setMisses(0);
    setClickPops([]);
    setTimeout(() => {
      spawnTarget();
    }, 200);
  };

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      setIsPlaying(false);
      setIsFinished(true);
      setCurrentTarget(null);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentTarget || !isPlaying) return;

    const gained = currentTarget.points;
    setScore((prev) => prev + gained);
    setHits((prev) => prev + 1);

    // Visual pop
    setClickPops((prev) => [
      ...prev.slice(-4),
      {
        id: Date.now(),
        x: currentTarget.x,
        y: currentTarget.y - 15,
        text: `+${gained} XP!`
      }
    ]);

    spawnTarget();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (!isPlaying) return;
    setMisses((prev) => prev + 1);
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 100;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f0f7ff] border-t border-[#d3e9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#fff8e7] border border-[#ffc857] px-3.5 py-1 rounded-full text-xs font-extrabold text-[#654800]">
            <span>✨</span>
            <span>INTERACTIVE SANDBOX DEMO</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001d36] tracking-tight">
            Try a Junior Skill Check: Mouse Master!
          </h2>
          <p className="text-base sm:text-lg text-[#17324d]/80 font-normal">
            Children build confidence by practicing right now in their browser. 
            Test your hand-eye coordination: click the moving hardware parts as fast as you can!
          </p>
        </div>

        {/* Sandbox Game Canvas Container */}
        <div className="max-w-4xl mx-auto">
          <div 
            ref={containerRef}
            onClick={handleBackgroundClick}
            className="relative bg-white border-3 border-[#d3e9fa] rounded-3xl min-h-[380px] sm:min-h-[420px] p-6 shadow-sm overflow-hidden flex flex-col justify-between select-none cursor-crosshair"
          >
            {/* Ambient Background Grid pattern */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#d3e9fa 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Game Top HUD */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-[#eef4ff] pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-[#eaf7ff] border border-[#d3e9fa] px-3 py-1.5 rounded-xl text-xs font-bold text-[#0061a4]">
                  <MousePointer2 className="w-4 h-4" />
                  <span>Aim & Left Click</span>
                </div>
                {isPlaying && (
                  <div className="flex items-center gap-1 bg-[#fff8e7] border border-[#ffc857] px-3 py-1.5 rounded-xl text-xs font-bold text-[#654800]">
                    <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span className="font-mono tabular-nums">{score} XP</span>
                  </div>
                )}
              </div>

              {isPlaying && (
                <div className="flex items-center gap-4 text-xs font-extrabold">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#17324d]/60">TIME:</span>
                    <span className="px-2.5 py-1 bg-[#f8f9ff] border border-[#d3e9fa] rounded-lg text-[#ba1a1a] font-mono tabular-nums">
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#17324d]/60">ACCURACY:</span>
                    <span className="px-2.5 py-1 bg-[#f8f9ff] border border-[#d3e9fa] rounded-lg text-[#087443] font-mono tabular-nums">
                      {accuracy}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Popups */}
            {clickPops.map((pop) => (
              <div
                key={pop.id}
                className="absolute z-30 pointer-events-none text-xs font-extrabold text-[#087443] bg-[#e9fff6] border border-[#9af7b9] px-2 py-0.5 rounded-md shadow-xs animate-out fade-out slide-out-to-top duration-700"
                style={{ left: pop.x, top: pop.y }}
              >
                {pop.text}
              </div>
            ))}

            {/* Central Area: Welcome / Active / Result */}
            {!isPlaying && !isFinished && (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 rounded-2xl bg-[#eaf7ff] border-2 border-[#d3e9fa] text-[#0061a4] flex items-center justify-center text-3xl mb-4 shadow-xs">
                  🖱️
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#001d36] mb-2">
                  Ready to start mousing?
                </h3>
                <p className="text-xs sm:text-sm text-[#17324d]/70 max-w-sm mb-6">
                  Click the target components as they appear to build muscle memory and precision!
                </p>
                <button
                  onClick={startGame}
                  className="btn-chunky-blue px-7 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Practice Round</span>
                </button>
              </div>
            )}

            {/* Active Target Button */}
            {isPlaying && currentTarget && (
              <button
                onClick={handleTargetClick}
                style={{
                  position: 'absolute',
                  left: `${currentTarget.x}px`,
                  top: `${currentTarget.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="z-20 btn-chunky-green p-3 rounded-2xl flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 animate-in zoom-in-75 duration-150"
              >
                <span className="text-2xl">{currentTarget.icon}</span>
                <span className="text-xs font-extrabold whitespace-nowrap">
                  {currentTarget.label}
                </span>
                <span className="bg-[#9af7b9] text-[#00210f] text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  +{currentTarget.points}
                </span>
              </button>
            )}

            {/* Finished Results Screen */}
            {isFinished && (
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-6 animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-2xl bg-[#e9fff6] border-2 border-[#9af7b9] text-[#087443] flex items-center justify-center text-3xl mb-3 shadow-xs">
                  🏆
                </div>
                <h3 className="text-2xl font-extrabold text-[#001d36] mb-1">
                  Skill Check Completed!
                </h3>
                <p className="text-xs text-[#087443] font-bold uppercase tracking-wider mb-5">
                  Mastery Badge: Precision Pilot Achieved
                </p>

                {/* Score breakdown tiles */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm mb-6">
                  <div className="bg-[#f8f9ff] border border-[#d3e9fa] p-3 rounded-xl">
                    <div className="text-xl font-extrabold text-[#0061a4] font-mono tabular-nums">{score}</div>
                    <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Total XP</div>
                  </div>
                  <div className="bg-[#f8f9ff] border border-[#d3e9fa] p-3 rounded-xl">
                    <div className="text-xl font-extrabold text-[#087443] font-mono tabular-nums">{hits}</div>
                    <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Targets Hit</div>
                  </div>
                  <div className="bg-[#f8f9ff] border border-[#d3e9fa] p-3 rounded-xl">
                    <div className="text-xl font-extrabold text-[#654800] font-mono tabular-nums">{accuracy}%</div>
                    <div className="text-[10px] font-bold text-[#17324d]/60 uppercase">Accuracy</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={startGame}
                    className="btn-chunky-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Play Again</span>
                  </button>
                  <button
                    onClick={onOpenStudent}
                    className="btn-chunky-blue py-2.5 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Enter Student Terminal</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Help Tip */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-[#17324d]/60 pt-3 border-t border-[#eef4ff]">
              <span>💡 Tip: Keep your wrist resting comfortably on the desk while guiding the mouse.</span>
              <span className="font-semibold text-[#0061a4]">Grade 4–6 Skill Benchmark</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
