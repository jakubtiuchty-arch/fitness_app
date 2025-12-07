import { Check, Play } from 'lucide-react';
import type { DaySchedule } from '../types';
import { getWorkoutLabel, getWorkoutColor, getWorkoutEmoji } from '../data/schedule';

interface DayCardProps {
  day: DaySchedule;
  isToday?: boolean;
  onStartWorkout?: () => void;
  onViewWorkout?: () => void;
}

export function DayCard({ day, isToday, onStartWorkout, onViewWorkout }: DayCardProps) {
  const isRest = day.workoutType === 'REST';
  const colorClass = getWorkoutColor(day.workoutType);
  const emoji = getWorkoutEmoji(day.workoutType);
  const label = getWorkoutLabel(day.workoutType);

  return (
    <div
      className={`day-card ${colorClass} ${isToday ? 'today' : ''} ${day.completed ? 'completed' : ''}`}
      onClick={!isRest ? onViewWorkout : undefined}
    >
      <div className="day-card-header">
        <span className="day-name">{day.day}</span>
        {isToday && <span className="today-badge">Dziś</span>}
      </div>

      <div className="day-card-content">
        <span className="workout-emoji">{emoji}</span>
        <span className="workout-type">{label}</span>
      </div>

      {day.completed ? (
        <div className="day-card-status completed">
          <Check size={18} />
          <span>Wykonane</span>
        </div>
      ) : !isRest ? (
        <button
          className="start-workout-btn"
          onClick={(e) => {
            e.stopPropagation();
            onStartWorkout?.();
          }}
        >
          <Play size={16} />
          <span>Start</span>
        </button>
      ) : (
        <div className="day-card-status rest">
          <span>Regeneracja</span>
        </div>
      )}
    </div>
  );
}
