import { ArrowLeft, Play, Pause, Check, Timer, Flame, Heart } from 'lucide-react';
import { getCardioOption } from '../data/workouts';
import type { WorkoutSession } from '../types';
import { IntervalTimer } from './IntervalTimer';

interface CardioViewProps {
  cardioType: 'CARDIO_1' | 'CARDIO_2';
  onBack: () => void;
  activeSession: WorkoutSession | null;
  onStart: () => void;
  onFinish: () => void;
  elapsed: number;
  isRunning: boolean;
  onPause: () => void;
  formatTime: (seconds: number) => string;
}

export function CardioView({
  cardioType,
  onBack,
  activeSession,
  onStart,
  onFinish,
  elapsed,
  isRunning,
  onPause,
  formatTime
}: CardioViewProps) {
  const cardioOption = getCardioOption(cardioType);
  const isHIIT = cardioType === 'CARDIO_1';

  return (
    <div className={`workout-view cardio-view ${isHIIT ? 'hiit' : 'liss'}`}>
      <div className="workout-view-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="workout-title">
          <span className="workout-emoji">{isHIIT ? '🔥' : '🏃'}</span>
          <div>
            <h2>{isHIIT ? 'CARDIO 1' : 'CARDIO 2'}</h2>
            <p>{isHIIT ? 'Interwały HIIT' : 'Bieg ciągły LISS'}</p>
          </div>
        </div>
      </div>

      {/* Show interval timer for HIIT when session is active */}
      {isHIIT && activeSession && (
        <IntervalTimer
          totalRounds={10}
          runTime={45}
          walkTime={45}
          onComplete={onFinish}
          autoStart={true}
        />
      )}

      {/* Show regular timer for LISS */}
      {!isHIIT && activeSession && (
        <div className="session-timer large">
          <div className="timer-display">{formatTime(elapsed)}</div>
          <button className="timer-button" onClick={onPause}>
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <div className="cardio-target-info">
            <div className="target-item">
              <Timer size={18} />
              <span>Cel: 45-60 min</span>
            </div>
            <div className="target-item">
              <Heart size={18} />
              <span>Tętno: 65-70% HRmax</span>
            </div>
          </div>
        </div>
      )}

      {/* Phase description - only before starting */}
      {!activeSession && (
        <div className="cardio-phases">
          <div className="cardio-description">
            <p>{cardioOption.description}</p>
          </div>

          {cardioOption.phases.map((phase, index) => (
            <div key={index} className="phase-card">
              <div className="phase-header">
                <div className="phase-icon">
                  {isHIIT ? <Flame size={20} /> : <Heart size={20} />}
                </div>
                <div className="phase-title">
                  <h4>{phase.name}</h4>
                  <span className="phase-duration">{phase.duration}</span>
                </div>
              </div>
              <p className="phase-description">{phase.description}</p>
            </div>
          ))}

          {isHIIT && (
            <div className="cardio-tip warning">
              <strong>⚠️ Autoregulacja:</strong> Jeśli czujesz, że nogi masz z betonu po wczorajszych przysiadach – zmień na CARDIO 2 (LISS). Lepiej lżejszy trening niż kontuzja.
            </div>
          )}

          {!isHIIT && (
            <div className="cardio-tip info">
              <strong>💡 Opcje:</strong> Możesz wybrać bieg z narastającą prędkością (BNP) - zaczynaś wolno, co 10 min zwiększasz tempo. Ostatnie 10 min mocne.
            </div>
          )}
        </div>
      )}

      <div className="workout-actions">
        {!activeSession ? (
          <button className="primary-button" onClick={onStart}>
            <Play size={20} />
            <span>Rozpocznij {isHIIT ? 'interwały' : 'bieg'}</span>
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
