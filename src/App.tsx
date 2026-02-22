import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import {
  WorkoutView,
  StatsView,
  SettingsView,
  BottomTabBar
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
  const [activeTab, setActiveTab] = useState('today');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  useEffect(() => {
    syncDayWithDate();
  }, [syncDayWithDate]);

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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'today') {
      setSelectedDay(currentDayNumber);
    }
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

  const selectorStart = Math.max(0, selectedDay - 4);
  const selectorEnd = Math.min(schedule.length, selectorStart + 7);
  const visibleDays = schedule.slice(selectorStart, selectorEnd);

  return (
    <div className="min-h-screen bg-ios-bg text-white pb-24">
      
      {activeTab === 'today' || activeTab === 'schedule' ? (
        <>
          {/* IOS System Header - Tylko nazwa aplikacji i ikona profilu */}
          <div className="sticky top-0 z-40 bg-ios-bg/90 backdrop-blur-md border-b border-ios-gray4 px-4 py-3">
            <div className="flex justify-between items-center max-w-md mx-auto">
              <h1 className="text-xl font-bold tracking-tight">FitTrack</h1>
              <div className="w-8 h-8 rounded-full bg-ios-card flex items-center justify-center text-ios-primary font-bold text-sm">
                {currentDayNumber}
              </div>
            </div>
          </div>

          <main className="max-w-md mx-auto p-4 flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Nawigacja Dni (pozioma karuzela w stylu iOS) */}
            <div className="bg-ios-card rounded-ios-lg p-4 shadow-ios">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-ios-gray uppercase tracking-wider">Plan Treningowy</h2>
                <span className="text-xs text-ios-gray px-2 py-1 bg-ios-gray4 rounded-full">Dzień {selectedDay} z {schedule.length}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-ios-gray4 text-ios-gray disabled:opacity-30"
                  onClick={handlePrevDay}
                  disabled={selectedDay <= 1}
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex-1 flex justify-center gap-2 overflow-hidden">
                  {visibleDays.map((day) => {
                    const isSelected = day.dayNumber === selectedDay;
                    const isTodayPill = day.dayNumber === currentDayNumber;
                    
                    return (
                      <button
                        key={day.dayNumber}
                        onClick={() => setSelectedDay(day.dayNumber)}
                        className={`
                          flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all
                          ${isSelected ? 'bg-ios-primary text-black scale-110' : 'bg-ios-gray4/50 text-ios-gray hover:bg-ios-gray4'}
                          ${isTodayPill && !isSelected ? 'ring-1 ring-ios-primary' : ''}
                          ${day.completed ? 'opacity-50' : ''}
                        `}
                      >
                        <span className="text-[10px] font-bold">{day.dayNumber}</span>
                        <span className="text-lg">{getWorkoutEmoji(day.workoutType)}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-ios-gray4 text-ios-gray disabled:opacity-30"
                  onClick={handleNextDay}
                  disabled={selectedDay >= schedule.length}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Główna karta treningu */}
            {selectedWorkoutType && (
              <div className={`
                rounded-ios-xl p-6 shadow-ios relative overflow-hidden
                ${isStrengthWorkout(selectedWorkoutType) 
                  ? 'bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#5E5CE6]/30' 
                  : 'bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#FF453A]/30'}
              `}>
                {/* Tło blur dla koloru */}
                <div className={`
                  absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20
                  ${isStrengthWorkout(selectedWorkoutType) ? 'bg-[#5E5CE6]' : 'bg-[#FF453A]'}
                `}></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <span className="text-xs font-bold tracking-widest text-ios-gray uppercase mb-1 block">
                      {isToday ? 'DZISIAJ' : `DZIEŃ ${selectedDay}`}
                    </span>
                    <h2 className="text-2xl font-bold text-white leading-tight">
                      {getWorkoutLabel(selectedWorkoutType)}
                    </h2>
                    <p className="text-sm text-ios-gray mt-1">
                      {getWorkoutSubtitle(selectedWorkoutType)}
                    </p>
                  </div>
                  <div className="text-4xl bg-ios-gray4/50 p-3 rounded-2xl">
                    {getWorkoutEmoji(selectedWorkoutType)}
                  </div>
                </div>

                {isCompleted ? (
                  <div className="bg-ios-green/20 text-ios-green font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                    <span className="text-xl">✓</span> Trening ukończony
                  </div>
                ) : (
                  <button
                    className="w-full bg-[#A8F000] hover:bg-[#8bcc00] text-black font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 !opacity-100 shadow-[0_0_20px_rgba(168,240,0,0.2)]"
                    onClick={() => handleStartWorkout(selectedWorkoutType)}
                  >
                    <Play size={20} className="fill-current" />
                    Rozpocznij Trening
                  </button>
                )}
              </div>
            )}

            {/* Legenda IOS Style */}
            <div className="bg-ios-card rounded-ios-lg p-5 shadow-ios">
              <h3 className="text-sm font-semibold text-ios-gray mb-4 uppercase tracking-wider">Rotacja cyklu</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#5E5CE6]/20 flex items-center justify-center text-[#5E5CE6] font-bold text-xs">💪</div>
                  <span className="text-sm font-medium text-ios-gray2">Siła A - Push & Legs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF453A]/20 flex items-center justify-center text-[#FF453A] font-bold text-xs">🔥</div>
                  <span className="text-sm font-medium text-ios-gray2">Cardio 1 - HIIT Interwały</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] font-bold text-xs">🦍</div>
                  <span className="text-sm font-medium text-ios-gray2">Siła B - Pull & Hinge</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF453A]/20 flex items-center justify-center text-[#FF453A] font-bold text-xs">🔥</div>
                  <span className="text-sm font-medium text-ios-gray2">Cardio 1 - HIIT Interwały</span>
                </div>
              </div>
            </div>
          </main>
        </>
      ) : activeTab === 'stats' ? (
        <StatsView />
      ) : activeTab === 'settings' ? (
        <SettingsView />
      ) : null}

      <BottomTabBar activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}

export default App;