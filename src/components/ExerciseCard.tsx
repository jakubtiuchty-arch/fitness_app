import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Info, Timer } from 'lucide-react';
import type { Exercise, ExerciseProgress, SetProgress } from '../types';
import { RestTimer } from './RestTimer';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  progress?: ExerciseProgress;
  isActive: boolean;
  onCompleteSet: (setIndex: number, data: Partial<SetProgress>) => void;
  onUpdateProgress: (progress: Partial<ExerciseProgress>) => void;
}

// Parse rest time string like "90-120 sek" to get default seconds
function parseRestTime(restTime: string): number {
  const match = restTime.match(/(\d+)/);
  return match ? parseInt(match[1]) : 90;
}

export function ExerciseCard({
  exercise,
  index,
  progress,
  isActive,
  onCompleteSet,
}: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [setInputs, setSetInputs] = useState<Record<number, { weight: string; reps: string }>>({});
  const [showRestTimer, setShowRestTimer] = useState(false);

  const completedSets = progress?.sets.filter(s => s.completed).length || 0;
  const allSetsCompleted = completedSets >= exercise.sets;

  const handleSetComplete = (setIndex: number) => {
    const input = setInputs[setIndex] || { weight: '', reps: '' };
    onCompleteSet(setIndex, {
      weight: input.weight ? parseFloat(input.weight) : undefined,
      reps: input.reps ? parseInt(input.reps) : undefined
    });

    // Show rest timer if not the last set
    if (setIndex < exercise.sets - 1) {
      setShowRestTimer(true);
    }
  };

  const updateSetInput = (setIndex: number, field: 'weight' | 'reps', value: string) => {
    setSetInputs(prev => ({
      ...prev,
      [setIndex]: {
        ...prev[setIndex],
        [field]: value
      }
    }));
  };

  const isSetCompleted = (setIndex: number) => {
    return progress?.sets[setIndex]?.completed || false;
  };

  const defaultRestTime = parseRestTime(exercise.restTime);

  return (
    <>
      <div className={`bg-ios-card rounded-2xl overflow-hidden shadow-sm border border-ios-gray4/50 transition-all duration-300 ${allSetsCompleted ? 'opacity-70 grayscale-[0.2]' : ''}`}>
        <div 
          className="flex items-center gap-4 p-4 cursor-pointer active:bg-ios-gray4/30 transition-colors" 
          onClick={() => setExpanded(!expanded)}
        >
          {/* Numer ćwiczenia w kółku */}
          <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-ios-gray4/50 text-ios-primary font-bold rounded-full text-sm">
            {index}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white truncate">{exercise.name}</h3>
            <p className="text-sm text-ios-gray font-medium">
              {exercise.sets} serie x {exercise.reps}
            </p>
          </div>
          
          <div className="flex items-center gap-3 shrink-0 text-ios-gray">
            {allSetsCompleted ? (
              <div className="w-8 h-8 rounded-full bg-ios-primary/20 text-ios-primary flex items-center justify-center">
                <Check size={18} strokeWidth={3} />
              </div>
            ) : isActive ? (
              <span className="text-sm font-bold text-ios-primary">{completedSets}/{exercise.sets}</span>
            ) : null}
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>

        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-ios-gray4/50">
            <p className="text-sm text-ios-gray leading-relaxed mb-4">{exercise.description}</p>

            {exercise.notes && (
              <div className="flex items-start gap-2 bg-[#FF9F0A]/10 text-[#FF9F0A] p-3 rounded-xl text-sm mb-4">
                <Info size={18} className="shrink-0 mt-0.5" />
                <span className="leading-snug">{exercise.notes}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-ios-gray font-semibold uppercase tracking-wider mb-4 bg-ios-gray4/30 w-max px-3 py-1.5 rounded-lg">
              <Timer size={14} />
              <span>Przerwa: {exercise.restTime}</span>
            </div>

            {isActive && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-white">Postęp serii</h4>
                <div className="flex flex-col gap-2">
                  {Array.from({ length: exercise.sets }).map((_, setIndex) => {
                    const isCompleted = isSetCompleted(setIndex);
                    
                    return (
                      <div
                        key={setIndex}
                        className={`flex items-center justify-between p-3 rounded-xl border ${
                          isCompleted 
                            ? 'bg-ios-primary/10 border-ios-primary/30' 
                            : 'bg-ios-bg border-ios-gray4'
                        }`}
                      >
                        <span className={`text-sm font-semibold ${isCompleted ? 'text-ios-primary' : 'text-ios-gray'}`}>
                          Seria {setIndex + 1}
                        </span>
                        
                        {!isCompleted ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="kg"
                              className="w-14 bg-ios-card border border-ios-gray4 rounded-lg px-2 py-1.5 text-center text-sm text-white placeholder:text-ios-gray focus:outline-none focus:border-ios-primary transition-colors"
                              value={setInputs[setIndex]?.weight || ''}
                              onChange={(e) => updateSetInput(setIndex, 'weight', e.target.value)}
                            />
                            <input
                              type="number"
                              placeholder="powt"
                              className="w-14 bg-ios-card border border-ios-gray4 rounded-lg px-2 py-1.5 text-center text-sm text-white placeholder:text-ios-gray focus:outline-none focus:border-ios-primary transition-colors"
                              value={setInputs[setIndex]?.reps || ''}
                              onChange={(e) => updateSetInput(setIndex, 'reps', e.target.value)}
                            />
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-ios-primary text-black rounded-lg active:scale-90 transition-transform"
                              onClick={() => handleSetComplete(setIndex)}
                            >
                              <Check size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-bold text-ios-primary">
                            <Check size={16} strokeWidth={3} />
                            {progress?.sets[setIndex]?.weight && (
                              <span>{progress.sets[setIndex].weight}kg</span>
                            )}
                            {progress?.sets[setIndex]?.reps && (
                              <span>× {progress.sets[setIndex].reps}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showRestTimer && (
        <RestTimer
          defaultTime={defaultRestTime}
          onClose={() => setShowRestTimer(false)}
        />
      )}
    </>
  );
}
