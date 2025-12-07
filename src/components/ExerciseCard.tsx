import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { Exercise, ExerciseProgress, SetProgress } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  progress?: ExerciseProgress;
  isActive: boolean;
  onCompleteSet: (setIndex: number, data: Partial<SetProgress>) => void;
  onUpdateProgress: (progress: Partial<ExerciseProgress>) => void;
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

  const completedSets = progress?.sets.filter(s => s.completed).length || 0;
  const allSetsCompleted = completedSets >= exercise.sets;

  const handleSetComplete = (setIndex: number) => {
    const input = setInputs[setIndex] || { weight: '', reps: '' };
    onCompleteSet(setIndex, {
      weight: input.weight ? parseFloat(input.weight) : undefined,
      reps: input.reps ? parseInt(input.reps) : undefined
    });
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

  return (
    <div className={`exercise-card ${allSetsCompleted ? 'completed' : ''}`}>
      <div className="exercise-header" onClick={() => setExpanded(!expanded)}>
        <div className="exercise-number">{index}</div>
        <div className="exercise-info">
          <h3 className="exercise-name">{exercise.name}</h3>
          <p className="exercise-sets">
            {exercise.sets} x {exercise.reps}
            {exercise.isSuperset && <span className="superset-badge">Superseria</span>}
          </p>
        </div>
        <div className="exercise-status">
          {allSetsCompleted ? (
            <div className="completed-badge">
              <Check size={18} />
            </div>
          ) : isActive ? (
            <span className="sets-counter">{completedSets}/{exercise.sets}</span>
          ) : null}
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="exercise-details">
          <p className="exercise-description">{exercise.description}</p>

          {exercise.notes && (
            <div className="exercise-notes">
              <Info size={16} />
              <span>{exercise.notes}</span>
            </div>
          )}

          <div className="rest-time">
            Przerwa: {exercise.restTime}
          </div>

          {isActive && (
            <div className="sets-tracker">
              <h4>Serie:</h4>
              <div className="sets-grid">
                {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                  <div
                    key={setIndex}
                    className={`set-item ${isSetCompleted(setIndex) ? 'completed' : ''}`}
                  >
                    <span className="set-number">Seria {setIndex + 1}</span>
                    {!isSetCompleted(setIndex) ? (
                      <div className="set-inputs">
                        <input
                          type="number"
                          placeholder="kg"
                          className="set-input"
                          value={setInputs[setIndex]?.weight || ''}
                          onChange={(e) => updateSetInput(setIndex, 'weight', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="powt"
                          className="set-input"
                          value={setInputs[setIndex]?.reps || ''}
                          onChange={(e) => updateSetInput(setIndex, 'reps', e.target.value)}
                        />
                        <button
                          className="set-complete-btn"
                          onClick={() => handleSetComplete(setIndex)}
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="set-completed">
                        <Check size={16} />
                        {progress?.sets[setIndex]?.weight && (
                          <span>{progress.sets[setIndex].weight}kg</span>
                        )}
                        {progress?.sets[setIndex]?.reps && (
                          <span>x{progress.sets[setIndex].reps}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
