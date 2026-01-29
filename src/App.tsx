import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Header,
  WorkoutView,
  StatsModal,
  SettingsModal
} from './components';
import { useWorkoutStore } from './store/workoutStore';
import { getWorkoutLabel, getWorkoutSubtitle, getWorkoutEmoji, isStrengthWorkout } from './data/schedule';
import type { WorkoutType } from './types';
import './App.css';

type View = 'schedule' | 'workout';

function App() {
  const {
    schedule,
    currentDayNumber,
    syncDayWithDate
  } = useWorkoutStore();

  const [view, setView] = useState<View>('schedule');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync day with current date on app load
  useEffect(() => {
    syncDayWithDate();
  }, [syncDayWithDate]);

  // Set selected day to current day on load
  useEffect(() => {
    setSelectedDay(currentDayNumber);
  }, [currentDayNumber]);

  const selectedSchedule = schedule[selectedDay - 1];
  const selectedWorkoutType = selectedSchedule?.workoutType;
  const isToday = selectedDay === currentDayNumber;
  const isCompleted = selectedSchedule?.completed;

  const handleStartWorkout = (type: WorkoutType) => {
    setSelectedWorkout(type);
    setView('workout');
  };

  const handleWorkoutComplete = () => {
    setView('schedule');
    setSelectedWorkout(null);
  };

  const handleBack = () => {
    setView('schedule');
    setSelectedWorkout(null);
  };

  const handlePrevDay = () => {
    setSelectedDay(d => Math.max(1, d - 1));
  };

  const handleNextDay = () => {
    setSelectedDay(d => Math.min(schedule.length, d + 1));
  };

  if (view === 'workout' && selectedWorkout) {
    return (
      <WorkoutView
        workoutType={selectedWorkout}
        onBack={handleBack}
        onComplete={handleWorkoutComplete}
      />
    );
  }

  // Get visible days for the selector (7 days centered on selected)
  const selectorStart = Math.max(0, selectedDay - 4);
  const selectorEnd = Math.min(schedule.length, selectorStart + 7);
  const visibleDays = schedule.slice(selectorStart, selectorEnd);

  return (
    <div className="app">
      <Header
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="main-content">
        <div className="day-counter">
          <span className="rotation-info">Plan przygotowawczy do sezonu</span>
        </div>

        {/* Day Navigator */}
        <div className="day-navigator">
          <button
            className="day-nav-btn"
            onClick={handlePrevDay}
            disabled={selectedDay <= 1}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="day-selector">
            {visibleDays.map((day) => (
              <button
                key={day.dayNumber}
                className={`day-pill ${day.dayNumber === selectedDay ? 'selected' : ''} ${day.dayNumber === currentDayNumber ? 'today' : ''} ${day.completed ? 'done' : ''} ${isStrengthWorkout(day.workoutType) ? 'strength' : 'cardio'}`}
                onClick={() => setSelectedDay(day.dayNumber)}
              >
                <span className="pill-number">{day.dayNumber}</span>
                <span className="pill-emoji">{getWorkoutEmoji(day.workoutType)}</span>
              </button>
            ))}
          </div>

          <button
            className="day-nav-btn"
            onClick={handleNextDay}
            disabled={selectedDay >= schedule.length}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Selected Day's Workout Card */}
        {selectedWorkoutType && (
          <div className={`today-workout-card ${isStrengthWorkout(selectedWorkoutType) ? 'strength' : 'cardio'} ${isCompleted ? 'completed' : ''}`}>
            <div className="today-header">
              <span className="today-label">
                {isToday ? 'DZISIAJ' : `DZIEŃ ${selectedDay}`}
              </span>
              {isCompleted && <span className="completed-badge">✓ Ukończone</span>}
            </div>

            <div className="today-content">
              <div className="workout-emoji-large">{getWorkoutEmoji(selectedWorkoutType)}</div>
              <div className="workout-info">
                <h2>{getWorkoutLabel(selectedWorkoutType)}</h2>
                <p>{getWorkoutSubtitle(selectedWorkoutType)}</p>
              </div>
            </div>

            {!isCompleted && (
              <button
                className="start-workout-btn"
                onClick={() => handleStartWorkout(selectedWorkoutType)}
              >
                Rozpocznij trening
              </button>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="legend">
          <h3>Rotacja</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color workout-sila-a"></span>
              <span>Siła A - Push & Legs</span>
            </div>
            <div className="legend-item">
              <span className="legend-color workout-cardio-1"></span>
              <span>Cardio 1 - HIIT Interwały</span>
            </div>
            <div className="legend-item">
              <span className="legend-color workout-sila-b"></span>
              <span>Siła B - Pull & Hinge</span>
            </div>
            <div className="legend-item">
              <span className="legend-color workout-cardio-2"></span>
              <span>Cardio 2 - LISS Bieg ciągły</span>
            </div>
          </div>
        </div>
      </main>

      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
