import { ArrowLeft, Clock, Timer, Check, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { WorkoutType, ExerciseProgress } from '../types';
import { workouts } from '../data/workouts';
import { ExerciseCard } from './ExerciseCard';
import { AerobyView } from './AerobyView';
import { useWorkoutStore } from '../store/workoutStore';
import { getWorkoutEmoji } from '../data/schedule';

interface WorkoutViewProps {
  workoutType: WorkoutType;
  onBack: () => void;
  onComplete: () => void;
}

export function WorkoutView({ workoutType, onBack, onComplete }: WorkoutViewProps) {
  const { activeSession, startSession, endSession, completeSet, updateExerciseProgress } = useWorkoutStore();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const workout = workoutType === 'A' || workoutType === 'B' ? workouts[workoutType] : null;

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && activeSession) {
      interval = window.setInterval(() => {
        const start = new Date(activeSession.startTime).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, activeSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startSession(workoutType);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleFinish = () => {
    endSession();
    onComplete();
  };

  const getExerciseProgress = (exerciseId: string): ExerciseProgress | undefined => {
    return activeSession?.exercises.find(e => e.exerciseId === exerciseId);
  };

  if (workoutType === 'AEROBY') {
    return (
      <AerobyView
        onBack={onBack}
        activeSession={activeSession}
        onStart={handleStart}
        onFinish={handleFinish}
        elapsed={elapsed}
        isRunning={isRunning}
        onPause={handlePause}
        formatTime={formatTime}
      />
    );
  }

  if (!workout) return null;

  return (
    <div className="workout-view">
      <div className="workout-view-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={24} />
        </button>
        <div className="workout-title">
          <span className="workout-emoji">{getWorkoutEmoji(workoutType)}</span>
          <div>
            <h2>{workout.name}</h2>
            <p>{workout.description}</p>
          </div>
        </div>
      </div>

      <div className="workout-meta">
        <div className="meta-item">
          <Clock size={18} />
          <span>Przerwy: {workout.restBetweenSets}</span>
        </div>
        {workout.tempo && (
          <div className="meta-item">
            <Timer size={18} />
            <span>{workout.tempo}</span>
          </div>
        )}
      </div>

      {activeSession && (
        <div className="session-timer">
          <div className="timer-display">{formatTime(elapsed)}</div>
          <button className="timer-button" onClick={handlePause}>
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </button>
        </div>
      )}

      <div className="exercises-list">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            index={index + 1}
            progress={getExerciseProgress(exercise.id)}
            isActive={!!activeSession}
            onCompleteSet={(setIndex, data) => completeSet(exercise.id, setIndex, data)}
            onUpdateProgress={(progress) => updateExerciseProgress(exercise.id, progress)}
          />
        ))}
      </div>

      <div className="workout-actions">
        {!activeSession ? (
          <button className="primary-button" onClick={handleStart}>
            <Play size={20} />
            <span>Rozpocznij trening</span>
          </button>
        ) : (
          <button className="finish-button" onClick={handleFinish}>
            <Check size={20} />
            <span>Zakończ trening</span>
          </button>
        )}
      </div>
    </div>
  );
}
