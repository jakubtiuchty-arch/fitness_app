import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface IntervalTimerProps {
  totalRounds: number;
  runTime: number; // seconds
  walkTime: number; // seconds
  onComplete: () => void;
  autoStart?: boolean;
}

type Phase = 'run' | 'walk' | 'warmup' | 'cooldown' | 'complete';

export function IntervalTimer({
  totalRounds = 12,
  runTime = 30,
  walkTime = 30,
  onComplete,
  autoStart = true
}: IntervalTimerProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('warmup');
  const [timeLeft, setTimeLeft] = useState(300); // 5 min warmup
  const [isRunning, setIsRunning] = useState(autoStart);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playSound = useCallback((frequency: number = 800, duration: number = 0.3) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch {
      // Audio not supported
    }
  }, [soundEnabled]);

  const vibrate = useCallback((pattern: number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const getPhaseLabel = (p: Phase): string => {
    switch (p) {
      case 'warmup': return 'Rozgrzewka';
      case 'run': return 'BIEGNIJ!';
      case 'walk': return 'Marsz';
      case 'cooldown': return 'Schłodzenie';
      case 'complete': return 'Koniec!';
      default: return '';
    }
  };

  const nextPhase = useCallback(() => {
    if (phase === 'warmup') {
      setPhase('run');
      setCurrentRound(1);
      setTimeLeft(runTime);
      playSound(1000, 0.5);
      vibrate([200, 100, 200]);
    } else if (phase === 'run') {
      if (currentRound >= totalRounds) {
        setPhase('cooldown');
        setTimeLeft(300);
        playSound(600, 0.5);
      } else {
        setPhase('walk');
        setTimeLeft(walkTime);
        playSound(600, 0.3);
        vibrate([200]);
      }
    } else if (phase === 'walk') {
      setPhase('run');
      setCurrentRound(prev => prev + 1);
      setTimeLeft(runTime);
      playSound(1000, 0.5);
      vibrate([200, 100, 200]);
    } else if (phase === 'cooldown') {
      setPhase('complete');
      setIsRunning(false);
      playSound(800, 1);
      vibrate([200, 100, 200, 100, 200]);
      onComplete();
    }
  }, [phase, currentRound, totalRounds, runTime, walkTime, playSound, vibrate, onComplete]);

  // Timer countdown effect
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && phase !== 'complete') {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          // Play countdown sounds at 3, 2, 1
          if (prev <= 4 && prev > 1) {
            playSound(700, 0.1);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, phase, playSound]);

  // Phase transition effect - triggers when timeLeft hits 0
  useEffect(() => {
    if (timeLeft <= 0 && isRunning && phase !== 'complete') {
      nextPhase();
    }
  }, [timeLeft, isRunning, phase, nextPhase]);

  const handleReset = () => {
    setPhase('warmup');
    setCurrentRound(0);
    setTimeLeft(300);
    setIsRunning(false);
  };

  const handleSkipPhase = () => {
    nextPhase();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-ios-card rounded-[32px] p-6 shadow-ios border border-ios-gray4/50 relative overflow-hidden">
      {/* Kolorowe tło zależne od fazy (blur) */}
      <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-20 transition-colors duration-1000 ${
        phase === 'run' ? 'bg-[#FF453A]' : 
        phase === 'walk' ? 'bg-[#A8F000]' : 
        phase === 'warmup' ? 'bg-[#FF9F0A]' : 'bg-[#0A84FF]'
      }`}></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <span className={`text-sm font-bold tracking-widest uppercase px-3 py-1 rounded-full ${
          phase === 'run' ? 'bg-[#FF453A]/20 text-[#FF453A]' : 
          phase === 'walk' ? 'bg-[#A8F000]/20 text-[#A8F000]' : 
          phase === 'warmup' ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' : 'bg-[#0A84FF]/20 text-[#0A84FF]'
        }`}>
          {getPhaseLabel(phase)}
        </span>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-95"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className={`text-7xl font-black tracking-tighter font-mono mb-2 transition-colors duration-300 ${
          phase === 'run' ? 'text-[#FF453A]' : 
          phase === 'walk' ? 'text-[#A8F000]' : 'text-white'
        }`}>
          {formatTime(timeLeft)}
        </div>
        
        {phase !== 'warmup' && phase !== 'cooldown' && phase !== 'complete' && (
          <div className="text-ios-gray font-medium">
            Runda <span className="text-white font-bold">{currentRound}</span> z {totalRounds}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
        {Array.from({ length: totalRounds }).map((_, i) => {
          const isCompleted = i < currentRound - 1 || (i === currentRound - 1 && phase === 'walk');
          const isCurrent = i === currentRound - 1 && phase === 'run';
          
          return (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                isCompleted ? 'w-4 bg-[#A8F000]' :
                isCurrent ? 'w-8 bg-[#FF453A] animate-pulse' : 'w-2 bg-ios-gray4'
              }`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 relative z-10">
        <button 
          className="w-14 h-14 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-90" 
          onClick={handleReset}
        >
          <RotateCcw size={24} />
        </button>
        <button
          className={`w-20 h-20 flex items-center justify-center rounded-full transition-all active:scale-90 ${
            isRunning 
              ? 'bg-ios-gray4 text-white' 
              : 'bg-[#A8F000] text-black shadow-[0_0_20px_rgba(168,240,0,0.4)]'
          }`}
          onClick={() => setIsRunning(!isRunning)}
          disabled={phase === 'complete'}
        >
          {isRunning ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
        </button>
        <button 
          className="w-14 h-14 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-90" 
          onClick={handleSkipPhase}
          disabled={phase === 'complete'}
        >
          <span className="text-xs font-bold uppercase tracking-wider">Pomiń</span>
        </button>
      </div>

      {phase === 'complete' && (
        <div className="mt-6 p-4 bg-[#A8F000]/20 rounded-2xl text-center text-[#A8F000] font-bold animate-pulse relative z-10">
          Świetna robota! Interwały ukończone! 🎉
        </div>
      )}
    </div>
  );
}
