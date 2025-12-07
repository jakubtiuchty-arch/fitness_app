import { useState } from 'react';
import { ArrowLeft, Play, Pause, Check, Timer, Heart, Zap } from 'lucide-react';
import { aerobyOptions } from '../data/workouts';
import type { WorkoutSession } from '../types';

interface AerobyViewProps {
  onBack: () => void;
  onComplete: () => void;
  activeSession: WorkoutSession | null;
  onStart: () => void;
  onFinish: () => void;
  elapsed: number;
  isRunning: boolean;
  onPause: () => void;
  formatTime: (seconds: number) => string;
}

export function AerobyView({
  onBack,
  activeSession,
  onStart,
  onFinish,
  elapsed,
  isRunning,
  onPause,
  formatTime
}: AerobyViewProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="workout-view aeroby-view">
      <div className="workout-view-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="workout-title">
          <span className="workout-emoji">🏃</span>
          <div>
            <h2>AEROBY</h2>
            <p>Wybierz opcję treningu</p>
          </div>
        </div>
      </div>

      {activeSession && (
        <div className="session-timer large">
          <div className="timer-display">{formatTime(elapsed)}</div>
          <button className="timer-button" onClick={onPause}>
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>
      )}

      <div className="aeroby-options">
        {aerobyOptions.map((option) => (
          <div
            key={option.id}
            className={`aeroby-option ${selectedOption === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedOption(option.id)}
          >
            <div className="option-header">
              <div className="option-icon">
                {option.id === 'interval' ? <Zap size={24} /> : <Heart size={24} />}
              </div>
              <div className="option-title">
                <h3>{option.name}</h3>
                <p>{option.description}</p>
              </div>
              {selectedOption === option.id && (
                <div className="option-check">
                  <Check size={20} />
                </div>
              )}
            </div>

            <div className="option-phases">
              {option.phases.map((phase, index) => (
                <div key={index} className="phase-item">
                  <div className="phase-icon">
                    <Timer size={16} />
                  </div>
                  <div className="phase-info">
                    <span className="phase-name">{phase.name}</span>
                    <span className="phase-duration">{phase.duration}</span>
                  </div>
                  <p className="phase-description">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="workout-actions">
        {!activeSession ? (
          <button
            className="primary-button"
            onClick={onStart}
            disabled={!selectedOption}
          >
            <Play size={20} />
            <span>Rozpocznij trening</span>
          </button>
        ) : (
          <button className="finish-button" onClick={onFinish}>
            <Check size={20} />
            <span>Zakończ trening</span>
          </button>
        )}
      </div>
    </div>
  );
}
