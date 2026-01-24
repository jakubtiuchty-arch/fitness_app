import { useState, useEffect } from 'react';
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
    syncDayWithDate,
    getTodayWorkout
  } = useWorkoutStore();

  const [view, setView] = useState<View>('schedule');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Sync day with current date on app load
  useEffect(() => {
    syncDayWithDate();
  }, [syncDayWithDate]);

  const todayWorkout = getTodayWorkout();

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

  if (view === 'workout' && selectedWorkout) {
    return (
      <WorkoutView
        workoutType={selectedWorkout}
        onBack={handleBack}
        onComplete={handleWorkoutComplete}
      />
    );
  }

  // Get upcoming days (next 6 days after today)
  const upcomingDays = schedule.slice(currentDayNumber, currentDayNumber + 6);
  // Get recent days (last 3 completed)
  const recentDays = schedule.slice(Math.max(0, currentDayNumber - 4), currentDayNumber - 1).reverse();

  const todaySchedule = schedule[currentDayNumber - 1];
  const isCompleted = todaySchedule?.completed;

  return (
    <div className="app">
      <Header
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="main-content">
        <div className="day-counter">
          <span className="day-number">Dzień {currentDayNumber}</span>
          <span className="rotation-info">Plan przygotowawczy do sezonu</span>
        </div>

        {/* Today's Workout - Prominent Card */}
        <div className={`today-workout-card ${isStrengthWorkout(todayWorkout) ? 'strength' : 'cardio'} ${isCompleted ? 'completed' : ''}`}>
          <div className="today-header">
            <span className="today-label">DZISIAJ</span>
            {isCompleted && <span className="completed-badge">✓ Ukończone</span>}
          </div>

          <div className="today-content">
            <div className="workout-emoji-large">{getWorkoutEmoji(todayWorkout)}</div>
            <div className="workout-info">
              <h2>{getWorkoutLabel(todayWorkout)}</h2>
              <p>{getWorkoutSubtitle(todayWorkout)}</p>
            </div>
          </div>

          {!isCompleted && (
            <button
              className="start-workout-btn"
              onClick={() => handleStartWorkout(todayWorkout)}
            >
              Rozpocznij trening
            </button>
          )}
        </div>

        {/* Upcoming Days */}
        {upcomingDays.length > 0 && (
          <div className="schedule-section">
            <h3>Nadchodzące</h3>
            <div className="mini-schedule">
              {upcomingDays.map((day) => (
                <div
                  key={day.dayNumber}
                  className={`mini-day ${isStrengthWorkout(day.workoutType) ? 'strength' : 'cardio'}`}
                >
                  <span className="mini-day-number">D{day.dayNumber}</span>
                  <span className="mini-emoji">{getWorkoutEmoji(day.workoutType)}</span>
                  <span className="mini-label">{getWorkoutLabel(day.workoutType).split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Days */}
        {recentDays.length > 0 && (
          <div className="schedule-section">
            <h3>Ostatnie treningi</h3>
            <div className="mini-schedule">
              {recentDays.map((day) => (
                <div
                  key={day.dayNumber}
                  className={`mini-day ${day.completed ? 'completed' : 'missed'}`}
                >
                  <span className="mini-day-number">D{day.dayNumber}</span>
                  <span className="mini-emoji">{day.completed ? '✓' : '✗'}</span>
                  <span className="mini-label">{getWorkoutLabel(day.workoutType).split(' ')[0]}</span>
                </div>
              ))}
            </div>
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
