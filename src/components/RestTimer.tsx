import { useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface RestTimerProps {
  defaultTime: number; // in seconds
  onClose: () => void;
  autoStart?: boolean;
}

export function RestTimer({ defaultTime, onClose, autoStart = true }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [selectedTime, setSelectedTime] = useState(defaultTime);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const presetTimes = [60, 90, 120];

  const playSound = useCallback(() => {
    if (!soundEnabled) return;

    // Create beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio not supported
    }
  }, [soundEnabled]);

  const vibrate = useCallback(() => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  }, []);

  // Countdown effect - just decrements timer
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft > 0]); // Only re-run when isRunning changes or when timeLeft transitions to/from 0

  // Countdown sounds effect - plays tick at 3, 2, 1
  useEffect(() => {
    if (isRunning && timeLeft > 0 && timeLeft <= 3) {
      playSound();
    }
  }, [timeLeft, isRunning, playSound]);

  // Completion effect - handles when timer reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playSound();
      vibrate();
      // Auto-close after 1.5 seconds
      const timeout = setTimeout(() => {
        onClose();
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, isRunning, playSound, vibrate, onClose]);

  const handleReset = () => {
    setTimeLeft(selectedTime);
    setIsRunning(false);
  };

  const handleSelectTime = (time: number) => {
    setSelectedTime(time);
    setTimeLeft(time);
    setIsRunning(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedTime - timeLeft) / selectedTime) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none">
      {/* Ciemne tło */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Wyjeżdżający modal od dołu */}
      <div className="relative bg-ios-card rounded-t-[32px] p-6 pb-safe w-full max-w-md mx-auto pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transform transition-transform duration-300 translate-y-0">
        
        {/* Wskaźnik przeciągnięcia (pigułka) */}
        <div className="w-12 h-1.5 bg-ios-gray4 rounded-full mx-auto mb-6 opacity-50"></div>

        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-white tracking-tight">Przerwa</h3>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-95"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? 'Wyłącz dźwięk' : 'Włącz dźwięk'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-95" 
              onClick={onClose} 
              aria-label="Zamknij"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-ios-gray4/30"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
              />
              <circle
                className="text-ios-primary transition-all duration-1000 ease-linear"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 46}`}
                strokeDashoffset={`${2 * Math.PI * 46 * (progress / 100)}`}
              />
            </svg>
            
            {/* Czas w środku */}
            <div className="text-6xl font-black text-white tracking-tighter font-mono z-10">
              {formatTime(timeLeft)}
            </div>
            
            {/* Glow effect */}
            {isRunning && (
              <div className="absolute inset-0 bg-ios-primary/20 blur-2xl rounded-full opacity-30 animate-pulse"></div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {presetTimes.map((time) => (
            <button
              key={time}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
                selectedTime === time 
                  ? 'bg-ios-primary text-black shadow-[0_0_15px_rgba(168,240,0,0.3)]' 
                  : 'bg-ios-gray4/50 text-ios-gray hover:text-white hover:bg-ios-gray4'
              }`}
              onClick={() => handleSelectTime(time)}
            >
              {time}s
            </button>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mb-4">
          <button 
            className="w-14 h-14 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-90" 
            onClick={handleReset}
          >
            <RotateCcw size={24} />
          </button>
          <button
            className={`w-20 h-20 flex items-center justify-center rounded-full transition-all active:scale-90 ${
              isRunning ? 'bg-ios-gray4 text-white' : 'bg-ios-primary text-black shadow-[0_0_20px_rgba(168,240,0,0.4)]'
            }`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={32} className="fill-current" /> : <Play size={32} className="fill-current ml-1" />}
          </button>
          <button 
            className="w-14 h-14 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-gray hover:text-white transition-colors active:scale-90" 
            onClick={onClose}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Pomiń</span>
          </button>
        </div>

        {timeLeft === 0 && (
          <div className="text-center text-ios-primary font-bold animate-pulse mt-4">
            Czas na kolejną serię! 🔥
          </div>
        )}
      </div>
    </div>
  );
}
