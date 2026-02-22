import { ArrowLeft, Clock, Timer, Check, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { WorkoutType, ExerciseProgress } from '../types';
import { workouts } from '../data/workouts';
import { ExerciseCard } from './ExerciseCard';
import { CardioView } from './CardioView';
import { useWorkoutStore } from '../store/workoutStore';
import { getWorkoutEmoji, isCardioWorkout } from '../data/schedule';

interface WorkoutViewProps {
  workoutType: WorkoutType;
  onBack: () => void;
  onComplete: () => void;
}

export function WorkoutView({ workoutType, onBack, onComplete }: WorkoutViewProps) {
  const { activeSession, startSession, endSession, completeSet, updateExerciseProgress } = useWorkoutStore();
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const workout = workoutType === 'SILA_A' || workoutType === 'SILA_B' ? workouts[workoutType] : null;

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

  // Cardio workouts use CardioView
  if (isCardioWorkout(workoutType)) {
    return (
      <CardioView
        cardioType={workoutType as 'CARDIO_1'}
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
    <div className="min-h-screen bg-ios-bg pb-32">
      {/* IOS Sticky Header */}
      <div className="sticky top-0 z-40 bg-ios-bg/90 backdrop-blur-xl border-b border-ios-gray4">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-ios-gray4/50 text-ios-primary active:scale-95 transition-transform" 
            onClick={onBack}
          >
            <ArrowLeft size={22} />
          </button>
          
          <div className="flex-1 text-center">
            <span className="text-xs font-semibold text-ios-primary uppercase tracking-widest block">
              {workout.name}
            </span>
            <span className="text-sm text-ios-gray font-medium">
              {getWorkoutEmoji(workoutType)} {workout.description}
            </span>
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
        {/* Workout Meta Info */}
        <div className="flex gap-3 pb-2 w-full">
          <div className="flex items-center gap-2 bg-ios-card px-4 py-3 rounded-2xl border border-ios-gray4/50 w-auto whitespace-nowrap">
            <Clock size={18} className="text-ios-gray shrink-0" />
            <div>
              <p className="text-[10px] text-ios-gray uppercase font-bold tracking-wider">Przerwy</p>
              <p className="text-sm text-white font-medium">{workout.restBetweenSets}</p>
            </div>
          </div>
          {workout.tempo && (
            <div className="flex items-center gap-2 bg-ios-card px-4 py-3 rounded-2xl border border-ios-gray4/50 flex-1 min-w-0">
              <Timer size={18} className="text-ios-gray shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-ios-gray uppercase font-bold tracking-wider">Tempo</p>
                <p className="text-sm text-white font-medium truncate">{workout.tempo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Global Workout Timer */}
        {activeSession && (
          <div className="bg-ios-primary/10 border border-ios-primary/20 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(168,240,0,0.1)]">
            <span className="text-ios-primary text-xs font-bold tracking-widest uppercase mb-1">
              Czas Treningu
            </span>
            <div className="text-5xl font-black text-white tracking-tight font-mono mb-4">
              {formatTime(elapsed)}
            </div>
            <button 
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90 ${isRunning ? 'bg-ios-gray4 text-white' : 'bg-ios-primary text-black'}`}
              onClick={handlePause}
            >
              {isRunning ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
            </button>
          </div>
        )}

        {/* Lista ćwiczeń */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold text-white mb-2 ml-1">Ćwiczenia</h3>
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
      </div>

      {/* Pływający pasek akcji na dole */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-ios-glass backdrop-blur-xl border-t border-ios-gray4/50 pb-safe z-50">
        <div className="max-w-md mx-auto">
          {!activeSession ? (
            <button 
              className="w-full bg-[#A8F000] hover:bg-[#8bcc00] text-black font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 !opacity-100 shadow-[0_0_20px_rgba(168,240,0,0.3)]"
              onClick={handleStart}
            >
              <Play size={24} className="fill-current" />
              <span>Rozpocznij Trening</span>
            </button>
          ) : (
            <button 
              className="w-full bg-ios-card hover:bg-ios-gray4 text-white font-bold text-lg py-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 border border-ios-primary/50 text-ios-primary"
              onClick={handleFinish}
            >
              <Check size={24} strokeWidth={3} />
              <span>Zakończ Trening</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
