import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface IntervalTimerProps {
  totalRounds: number;
  runTime: number; // seconds
  walkTime: number; // seconds
  onComplete: () => void;
}

type Phase = 'run' | 'walk' | 'warmup' | 'cooldown' | 'complete';

export function IntervalTimer({
  totalRounds = 12,
  runTime = 30,
  walkTime = 30,
  onComplete
}: IntervalTimerProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('warmup');
  const [timeLeft, setTimeLeft] = useState(300); // 5 min warmup
  const [isRunning, setIsRunning] = useState(false);
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

  const getPhaseTime = (p: Phase): number => {
    switch (p) {
      case 'warmup': return 300; // 5 min
      case 'run': return runTime;
      case 'walk': return walkTime;
      case 'cooldown': return 300; // 5 min
      default: return 0;
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

  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && phase !== 'complete') {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          // Play countdown sounds
          if (prev <= 4 && prev > 1) {
            playSound(700, 0.1);
          }

          if (prev <= 1) {
            nextPhase();
            return getPhaseTime(phase);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, phase, nextPhase, playSound]);

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
    <div className="interval-timer">
      <div className="interval-timer-header">
        <button
          className="timer-icon-btn"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>

      <div className={`interval-timer-phase ${phase}`}>
        {getPhaseLabel(phase)}
      </div>

      <div className="interval-timer-time">
        {formatTime(timeLeft)}
      </div>

      {phase !== 'warmup' && phase !== 'cooldown' && phase !== 'complete' && (
        <div className="interval-timer-round">
          Runda {currentRound} z {totalRounds}
        </div>
      )}

      <div className="interval-timer-progress">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`interval-dot ${
              i < currentRound - 1 ? 'completed' :
              i === currentRound - 1 && phase === 'walk' ? 'completed' :
              i === currentRound - 1 ? 'current' : ''
            }`}
          />
        ))}
      </div>

      <div className="rest-timer-actions">
        <button className="timer-action-btn" onClick={handleReset}>
          <RotateCcw size={20} />
        </button>
        <button
          className="timer-action-btn primary"
          onClick={() => setIsRunning(!isRunning)}
          disabled={phase === 'complete'}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          className="timer-action-btn skip"
          onClick={handleSkipPhase}
          disabled={phase === 'complete'}
        >
          Pomiń
        </button>
      </div>

      {phase === 'complete' && (
        <div className="timer-complete">
          Świetna robota! Interwały ukończone!
        </div>
      )}
    </div>
  );
}
