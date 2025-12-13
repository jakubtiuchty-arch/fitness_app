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
    <div className="rest-timer-overlay">
      <div className="rest-timer-modal">
        <div className="rest-timer-header">
          <h3>Przerwa</h3>
          <div className="rest-timer-controls">
            <button
              className="timer-icon-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? 'Wyłącz dźwięk' : 'Włącz dźwięk'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button className="timer-icon-btn" onClick={onClose} aria-label="Zamknij">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="rest-timer-display">
          <svg className="timer-circle" viewBox="0 0 100 100">
            <circle
              className="timer-circle-bg"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
            />
            <circle
              className="timer-circle-progress"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="timer-time">{formatTime(timeLeft)}</div>
        </div>

        <div className="rest-timer-presets">
          {presetTimes.map((time) => (
            <button
              key={time}
              className={`preset-btn ${selectedTime === time ? 'active' : ''}`}
              onClick={() => handleSelectTime(time)}
            >
              {time}s
            </button>
          ))}
        </div>

        <div className="rest-timer-actions">
          <button className="timer-action-btn" onClick={handleReset}>
            <RotateCcw size={20} />
          </button>
          <button
            className="timer-action-btn primary"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button className="timer-action-btn skip" onClick={onClose}>
            Pomiń
          </button>
        </div>

        {timeLeft === 0 && (
          <div className="timer-complete">
            Czas na kolejną serię!
          </div>
        )}
      </div>
    </div>
  );
}
