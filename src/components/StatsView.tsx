import { Trophy, Clock, Flame, TrendingUp } from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { Achievements } from './Achievements';
import { getWorkoutEmoji } from '../data/schedule';

export function StatsView() {
  const { stats, completedSessions, schedule } = useWorkoutStore();

  const totalWorkoutsInPlan = schedule.length;
  const completedWorkouts = schedule.filter(d => d.completed).length;
  const progressPercentage = Math.round((completedWorkouts / totalWorkoutsInPlan) * 100);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="min-h-screen bg-ios-bg pb-32 animate-in fade-in duration-300">
      <div className="sticky top-0 z-40 bg-ios-bg/90 backdrop-blur-xl border-b border-ios-gray4">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Postępy</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 flex flex-col gap-6">
        
        {/* Główny progres */}
        <div className="bg-ios-card rounded-2xl p-5 border border-ios-gray4/50 shadow-ios">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-xs font-semibold text-ios-gray uppercase tracking-widest block mb-1">Plan Treningowy</span>
              <h3 className="text-2xl font-bold text-white leading-none">{progressPercentage}%</h3>
            </div>
            <span className="text-sm font-medium text-ios-gray">{completedWorkouts} z {totalWorkoutsInPlan} dni</span>
          </div>
          
          <div className="h-3 bg-ios-bg rounded-full overflow-hidden border border-ios-gray4/50">
            <div 
              className="h-full bg-[#A8F000] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,240,0,0.5)]"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 4 Statystyki (Grid) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#A8F000]/10 border border-[#A8F000]/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Trophy size={24} className="text-[#A8F000] mb-2" />
            <span className="text-3xl font-black text-white mb-1">{stats.totalWorkouts}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8F000]">Treningi</span>
          </div>

          <div className="bg-ios-card border border-ios-gray4/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Clock size={24} className="text-ios-gray mb-2" />
            <span className="text-2xl font-bold text-white mb-1">{formatDuration(stats.totalDuration)}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-ios-gray">Czas</span>
          </div>

          <div className="bg-ios-card border border-ios-gray4/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <Flame size={24} className="text-[#FF453A] mb-2" />
            <span className="text-3xl font-black text-white mb-1">{stats.currentStreak}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-ios-gray">Passa</span>
          </div>

          <div className="bg-ios-card border border-ios-gray4/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
            <TrendingUp size={24} className="text-ios-blue mb-2" />
            <span className="text-3xl font-black text-white mb-1">{stats.longestStreak}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-ios-gray">Rekord Passy</span>
          </div>
        </div>

        <Achievements />

        {/* Ostatnie treningi */}
        {completedSessions.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <span className="text-xs font-semibold text-ios-gray uppercase tracking-widest pl-4">Historia Treningów</span>
            <div className="bg-ios-card rounded-2xl overflow-hidden border border-ios-gray4/50 flex flex-col">
              {completedSessions.slice(-5).reverse().map((session, index) => (
                <div 
                  key={session.id} 
                  className={`flex items-center justify-between p-4 ${index !== 0 ? 'border-t border-ios-gray4/50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-ios-bg flex items-center justify-center text-xl shadow-sm border border-ios-gray4">
                      {getWorkoutEmoji(session.workoutType)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{session.workoutType.replace('_', ' ')}</h4>
                      <p className="text-xs text-ios-gray">{new Date(session.date).toLocaleDateString('pl-PL')}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-[#A8F000] bg-[#A8F000]/10 px-3 py-1.5 rounded-lg">
                    {session.totalDuration} min
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
