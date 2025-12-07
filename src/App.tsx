import { useState } from 'react';
import {
  Header,
  WeekSelector,
  DayCard,
  WorkoutView,
  StatsModal,
  SettingsModal
} from './components';
import { useWorkoutStore } from './store/workoutStore';
import type { WorkoutType } from './types';
import './App.css';

type View = 'schedule' | 'workout';

function App() {
  const {
    schedule,
    currentWeek,
    setCurrentWeek,
    markDayCompleted
  } = useWorkoutStore();

  const [view, setView] = useState<View>('schedule');
  const [selectedWorkout, setSelectedWorkout] = useState<{
    type: WorkoutType;
    weekIndex: number;
    dayIndex: number;
  } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const today = new Date();
  const todayDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  const handleStartWorkout = (weekIndex: number, dayIndex: number, type: WorkoutType) => {
    setSelectedWorkout({ type, weekIndex, dayIndex });
    setView('workout');
  };

  const handleViewWorkout = (weekIndex: number, dayIndex: number, type: WorkoutType) => {
    setSelectedWorkout({ type, weekIndex, dayIndex });
    setView('workout');
  };

  const handleWorkoutComplete = () => {
    if (selectedWorkout) {
      markDayCompleted(selectedWorkout.weekIndex, selectedWorkout.dayIndex);
    }
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
        workoutType={selectedWorkout.type}
        onBack={handleBack}
        onComplete={handleWorkoutComplete}
      />
    );
  }

  return (
    <div className="app">
      <Header
        onOpenStats={() => setShowStats(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      <main className="main-content">
        <WeekSelector
          currentWeek={currentWeek}
          totalWeeks={schedule.length}
          onWeekChange={setCurrentWeek}
        />

        <div className="schedule-info">
          <p>System rotacyjny - co drugi dzień trening</p>
        </div>

        <div className="days-grid">
          {schedule[currentWeek]?.days.map((day, dayIndex) => (
            <DayCard
              key={`${currentWeek}-${dayIndex}`}
              day={day}
              isToday={currentWeek === 0 && dayIndex === todayDayIndex}
              onStartWorkout={() => handleStartWorkout(currentWeek, dayIndex, day.workoutType)}
              onViewWorkout={() => handleViewWorkout(currentWeek, dayIndex, day.workoutType)}
            />
          ))}
        </div>

        <div className="legend">
          <h3>Legenda</h3>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color bg-blue-600"></span>
              <span>Trening A - Siła i baza</span>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-purple-600"></span>
              <span>Trening B - Hipertrofia</span>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-green-600"></span>
              <span>Aeroby - Cardio</span>
            </div>
            <div className="legend-item">
              <span className="legend-color bg-slate-700"></span>
              <span>Wolne - Regeneracja</span>
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
